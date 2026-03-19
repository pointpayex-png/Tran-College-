import asyncio
import websockets
import json
import sqlite3
import time
from datetime import datetime
import math
import threading
from geopy.distance import geodesic
import requests

class LiveLocationTracker:
    def __init__(self, db_path="transpay.db"):
        self.db_path = db_path
        self.connected_users = {}
        self.location_cache = {}
        self.geofences = []
        self.emergency_zones = []
        
    def calculate_distance(self, lat1, lng1, lat2, lng2):
        """Calculate distance between two coordinates in kilometers"""
        return geodesic((lat1, lng1), (lat2, lng2)).kilometers
    
    def calculate_speed(self, prev_location, current_location):
        """Calculate speed in km/h"""
        if not prev_location:
            return 0
        
        distance = self.calculate_distance(
            prev_location['lat'], prev_location['lng'],
            current_location['lat'], current_location['lng']
        )
        
        time_diff = (current_location['timestamp'] - prev_location['timestamp']) / 3600  # hours
        return distance / time_diff if time_diff > 0 else 0
    
    def is_in_emergency_zone(self, lat, lng):
        """Check if location is in a predefined emergency zone"""
        for zone in self.emergency_zones:
            distance = self.calculate_distance(lat, lng, zone['lat'], zone['lng'])
            if distance <= zone['radius_km']:
                return True, zone
        return False, None
    
    def detect_anomalies(self, user_id, location_data):
        """Detect location anomalies that might indicate emergencies"""
        anomalies = []
        
        # Check for sudden speed changes
        if location_data.get('speed', 0) > 120:  # Over 120 km/h
            anomalies.append({
                'type': 'excessive_speed',
                'severity': 'medium',
                'message': f"Excessive speed detected: {location_data['speed']} km/h"
            })
        
        # Check for stationary vehicle in unusual location
        prev_location = self.location_cache.get(user_id)
        if prev_location:
            distance = self.calculate_distance(
                prev_location['lat'], prev_location['lng'],
                location_data['lat'], location_data['lng']
            )
            time_diff = time.time() - prev_location['timestamp']
            
            if distance < 0.01 and time_diff > 1800:  # Stationary for 30+ minutes
                anomalies.append({
                    'type': 'stationary_vehicle',
                    'severity': 'low',
                    'message': "Vehicle stationary for extended period"
                })
        
        # Check emergency zones
        in_zone, zone = self.is_in_emergency_zone(location_data['lat'], location_data['lng'])
        if in_zone:
            anomalies.append({
                'type': 'emergency_zone',
                'severity': 'high',
                'message': f"Vehicle in emergency zone: {zone['name']}"
            })
        
        return anomalies
    
    def update_location(self, user_id, location_data):
        """Update user location in database and cache"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Add timestamp
            location_data['timestamp'] = time.time()
            
            # Calculate speed if previous location exists
            prev_location = self.location_cache.get(user_id)
            if prev_location:
                location_data['calculated_speed'] = self.calculate_speed(prev_location, location_data)
            
            # Detect anomalies
            anomalies = self.detect_anomalies(user_id, location_data)
            
            # Insert into database
            cursor.execute('''
                INSERT INTO live_locations (
                    user_id, ride_id, lat, lng, accuracy, heading, speed,
                    altitude, battery_level, is_online
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                user_id, location_data.get('ride_id'), location_data['lat'],
                location_data['lng'], location_data.get('accuracy'),
                location_data.get('heading'), location_data.get('speed'),
                location_data.get('altitude'), location_data.get('battery_level'),
                True
            ))
            
            conn.commit()
            
            # Update cache
            self.location_cache[user_id] = location_data
            
            # Handle anomalies
            if anomalies:
                self.handle_anomalies(user_id, anomalies)
            
            return True
            
        except Exception as e:
            print(f"Error updating location: {e}")
            return False
        finally:
            conn.close()
    
    def handle_anomalies(self, user_id, anomalies):
        """Handle detected location anomalies"""
        for anomaly in anomalies:
            if anomaly['severity'] == 'high':
                # Create automatic emergency alert
                self.create_auto_emergency_alert(user_id, anomaly)
            
            # Log anomaly
            print(f"Anomaly detected for user {user_id}: {anomaly['message']}")
    
    def create_auto_emergency_alert(self, user_id, anomaly):
        """Create automatic emergency alert for high-severity anomalies"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            location = self.location_cache.get(user_id)
            if not location:
                return
            
            alert_id = f"AUTO_{int(time.time())}_{user_id}"
            
            cursor.execute('''
                INSERT INTO emergency_alerts (
                    alert_id, user_id, type, severity, status,
                    lat, lng, description
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                alert_id, user_id, 'other', anomaly['severity'], 'active',
                location['lat'], location['lng'], f"Auto-generated: {anomaly['message']}"
            ))
            
            conn.commit()
            
            # Notify emergency services
            self.notify_emergency_services(alert_id, user_id, location, anomaly)
            
        finally:
            conn.close()
    
    def notify_emergency_services(self, alert_id, user_id, location, anomaly):
        """Notify emergency services of critical alerts"""
        # In production, this would integrate with actual emergency services
        notification = {
            'alert_id': alert_id,
            'user_id': user_id,
            'location': location,
            'anomaly': anomaly,
            'timestamp': datetime.now().isoformat()
        }
        
        print(f"EMERGENCY NOTIFICATION: {json.dumps(notification, indent=2)}")
        
        # Send to emergency services API (mock)
        try:
            # requests.post('https://emergency-services.sl/api/alerts', json=notification)
            pass
        except Exception as e:
            print(f"Failed to notify emergency services: {e}")
    
    def get_nearby_users(self, lat, lng, radius_km=5, user_type=None):
        """Get users within specified radius"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Get recent locations (last 10 minutes)
            ten_minutes_ago = datetime.now().timestamp() - 600
            
            query = '''
                SELECT DISTINCT ll.user_id, ll.lat, ll.lng, u.first_name, u.last_name, u.role
                FROM live_locations ll
                JOIN users u ON ll.user_id = u.user_id
                WHERE ll.timestamp > ? AND ll.is_online = 1
            '''
            params = [ten_minutes_ago]
            
            if user_type:
                query += ' AND u.role = ?'
                params.append(user_type)
            
            cursor.execute(query, params)
            results = cursor.fetchall()
            
            nearby_users = []
            for user_id, user_lat, user_lng, first_name, last_name, role in results:
                distance = self.calculate_distance(lat, lng, user_lat, user_lng)
                if distance <= radius_km:
                    nearby_users.append({
                        'user_id': user_id,
                        'name': f"{first_name} {last_name}",
                        'role': role,
                        'lat': user_lat,
                        'lng': user_lng,
                        'distance_km': round(distance, 2)
                    })
            
            return sorted(nearby_users, key=lambda x: x['distance_km'])
            
        finally:
            conn.close()
    
    def get_route_optimization(self, start_lat, start_lng, end_lat, end_lng):
        """Get optimized route between two points"""
        # Mock route optimization - in production, use Google Maps API or similar
        route = {
            'distance_km': self.calculate_distance(start_lat, start_lng, end_lat, end_lng),
            'estimated_duration_minutes': int(self.calculate_distance(start_lat, start_lng, end_lat, end_lng) * 2),
            'waypoints': [
                {'lat': start_lat, 'lng': start_lng, 'instruction': 'Start'},
                {'lat': end_lat, 'lng': end_lng, 'instruction': 'Destination'}
            ],
            'traffic_conditions': 'moderate',
            'alternative_routes': []
        }
        
        return route
    
    async def websocket_handler(self, websocket, path):
        """Handle WebSocket connections for real-time location updates"""
        user_id = None
        try:
            async for message in websocket:
                data = json.loads(message)
                
                if data['type'] == 'auth':
                    user_id = data['user_id']
                    self.connected_users[user_id] = websocket
                    await websocket.send(json.dumps({
                        'type': 'auth_success',
                        'message': 'Connected to location service'
                    }))
                
                elif data['type'] == 'location_update':
                    if user_id:
                        success = self.update_location(user_id, data['location'])
                        await websocket.send(json.dumps({
                            'type': 'location_ack',
                            'success': success
                        }))
                
                elif data['type'] == 'get_nearby':
                    if user_id:
                        location = data['location']
                        nearby = self.get_nearby_users(
                            location['lat'], location['lng'],
                            data.get('radius', 5), data.get('user_type')
                        )
                        await websocket.send(json.dumps({
                            'type': 'nearby_users',
                            'users': nearby
                        }))
                
                elif data['type'] == 'emergency':
                    if user_id:
                        alert_id = self.create_emergency_alert(user_id, data['alert'])
                        await websocket.send(json.dumps({
                            'type': 'emergency_ack',
                            'alert_id': alert_id
                        }))
        
        except websockets.exceptions.ConnectionClosed:
            pass
        finally:
            if user_id and user_id in self.connected_users:
                del self.connected_users[user_id]
    
    def create_emergency_alert(self, user_id, alert_data):
        """Create emergency alert from user"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            alert_id = f"USER_{int(time.time())}_{user_id}"
            
            cursor.execute('''
                INSERT INTO emergency_alerts (
                    alert_id, user_id, ride_id, type, severity, status,
                    lat, lng, address, description
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                alert_id, user_id, alert_data.get('ride_id'),
                alert_data['type'], alert_data.get('severity', 'high'), 'active',
                alert_data['lat'], alert_data['lng'], alert_data.get('address'),
                alert_data.get('description', 'Emergency assistance requested')
            ))
            
            conn.commit()
            
            # Notify nearby operators and emergency services
            self.broadcast_emergency_alert(alert_id, alert_data)
            
            return alert_id
            
        finally:
            conn.close()
    
    def broadcast_emergency_alert(self, alert_id, alert_data):
        """Broadcast emergency alert to nearby users and services"""
        # Get nearby operators
        nearby_operators = self.get_nearby_users(
            alert_data['lat'], alert_data['lng'], 10, 'operator'
        )
        
        alert_message = {
            'type': 'emergency_alert',
            'alert_id': alert_id,
            'location': {'lat': alert_data['lat'], 'lng': alert_data['lng']},
            'description': alert_data.get('description'),
            'severity': alert_data.get('severity', 'high')
        }
        
        # Send to connected operators
        for operator in nearby_operators:
            if operator['user_id'] in self.connected_users:
                websocket = self.connected_users[operator['user_id']]
                asyncio.create_task(websocket.send(json.dumps(alert_message)))
    
    def start_location_service(self, host='localhost', port=8765):
        """Start the WebSocket location service"""
        print(f"Starting location service on {host}:{port}")
        start_server = websockets.serve(self.websocket_handler, host, port)
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()

# Initialize and start location tracker
if __name__ == "__main__":
    tracker = LiveLocationTracker()
    
    # Add some emergency zones (hospitals, police stations, etc.)
    tracker.emergency_zones = [
        {'name': 'Connaught Hospital', 'lat': 8.4657, 'lng': -13.2317, 'radius_km': 0.5},
        {'name': 'Central Police Station', 'lat': 8.4840, 'lng': -13.2299, 'radius_km': 0.3},
        {'name': 'Fire Station', 'lat': 8.4900, 'lng': -13.2350, 'radius_km': 0.3}
    ]
    
    print("Live location tracking system initialized!")
    print("Emergency zones configured:")
    for zone in tracker.emergency_zones:
        print(f"  - {zone['name']}: {zone['lat']}, {zone['lng']} (radius: {zone['radius_km']}km)")
    
    # Start the service
    tracker.start_location_service()
