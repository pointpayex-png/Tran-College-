import sqlite3
import hashlib
import secrets
import json
from datetime import datetime, timedelta
import bcrypt
from cryptography.fernet import Fernet
import os

class TransPayDatabase:
    def __init__(self, db_path="transpay.db"):
        self.db_path = db_path
        self.encryption_key = self.get_or_create_encryption_key()
        self.cipher_suite = Fernet(self.encryption_key)
        self.init_database()
    
    def get_or_create_encryption_key(self):
        """Get or create encryption key for sensitive data"""
        key_file = "encryption.key"
        if os.path.exists(key_file):
            with open(key_file, 'rb') as f:
                return f.read()
        else:
            key = Fernet.generate_key()
            with open(key_file, 'wb') as f:
                f.write(key)
            return key
    
    def encrypt_data(self, data):
        """Encrypt sensitive data"""
        if isinstance(data, str):
            data = data.encode()
        return self.cipher_suite.encrypt(data).decode()
    
    def decrypt_data(self, encrypted_data):
        """Decrypt sensitive data"""
        if isinstance(encrypted_data, str):
            encrypted_data = encrypted_data.encode()
        return self.cipher_suite.decrypt(encrypted_data).decode()
    
    def hash_password(self, password):
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def verify_password(self, password, hashed):
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    def init_database(self):
        """Initialize database with all required tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Users table with enhanced security
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT UNIQUE NOT NULL,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone_encrypted TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL CHECK (role IN ('passenger', 'operator', 'admin')),
                status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'pending')),
                verified BOOLEAN DEFAULT FALSE,
                two_factor_enabled BOOLEAN DEFAULT FALSE,
                two_factor_secret TEXT,
                company TEXT,
                operator_id TEXT,
                license_number TEXT,
                profile_image TEXT,
                location_lat REAL,
                location_lng REAL,
                location_address TEXT,
                emergency_contacts TEXT,
                payment_methods TEXT,
                preferences TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP,
                login_attempts INTEGER DEFAULT 0,
                locked_until TIMESTAMP,
                password_reset_token TEXT,
                password_reset_expires TIMESTAMP,
                email_verification_token TEXT,
                email_verification_expires TIMESTAMP
            )
        ''')
        
        # Transactions table with encryption
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                transaction_id TEXT UNIQUE NOT NULL,
                user_id TEXT NOT NULL,
                order_id TEXT,
                provider TEXT NOT NULL CHECK (provider IN ('orange', 'africell')),
                amount INTEGER NOT NULL,
                currency TEXT DEFAULT 'SLL',
                fees INTEGER DEFAULT 0,
                net_amount INTEGER,
                phone_encrypted TEXT NOT NULL,
                description TEXT,
                status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'failed', 'cancelled', 'expired')),
                reference TEXT,
                failure_reason TEXT,
                metadata_encrypted TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP,
                callback_received BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (user_id) REFERENCES users (user_id)
            )
        ''')
        
        # Rides table for transportation tracking
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS rides (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ride_id TEXT UNIQUE NOT NULL,
                passenger_id TEXT NOT NULL,
                operator_id TEXT,
                status TEXT NOT NULL CHECK (status IN ('requested', 'accepted', 'in_progress', 'completed', 'cancelled')),
                pickup_lat REAL NOT NULL,
                pickup_lng REAL NOT NULL,
                pickup_address TEXT NOT NULL,
                destination_lat REAL,
                destination_lng REAL,
                destination_address TEXT,
                distance_km REAL,
                duration_minutes INTEGER,
                fare_amount INTEGER,
                payment_method TEXT,
                payment_status TEXT DEFAULT 'pending',
                transaction_id TEXT,
                vehicle_info TEXT,
                driver_rating REAL,
                passenger_rating REAL,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                started_at TIMESTAMP,
                completed_at TIMESTAMP,
                FOREIGN KEY (passenger_id) REFERENCES users (user_id),
                FOREIGN KEY (operator_id) REFERENCES users (user_id),
                FOREIGN KEY (transaction_id) REFERENCES transactions (transaction_id)
            )
        ''')
        
        # Live locations table for real-time tracking
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS live_locations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                ride_id TEXT,
                lat REAL NOT NULL,
                lng REAL NOT NULL,
                accuracy REAL,
                heading REAL,
                speed REAL,
                altitude REAL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                battery_level INTEGER,
                is_online BOOLEAN DEFAULT TRUE,
                FOREIGN KEY (user_id) REFERENCES users (user_id),
                FOREIGN KEY (ride_id) REFERENCES rides (ride_id)
            )
        ''')
        
        # Emergency alerts table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS emergency_alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                alert_id TEXT UNIQUE NOT NULL,
                user_id TEXT NOT NULL,
                ride_id TEXT,
                type TEXT NOT NULL CHECK (type IN ('sos', 'accident', 'medical', 'fire', 'other')),
                severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
                status TEXT NOT NULL CHECK (status IN ('active', 'responding', 'resolved')),
                lat REAL NOT NULL,
                lng REAL NOT NULL,
                address TEXT,
                description TEXT,
                responders TEXT,
                response_time INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                responded_at TIMESTAMP,
                resolved_at TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (user_id),
                FOREIGN KEY (ride_id) REFERENCES rides (ride_id)
            )
        ''')
        
        # System logs table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS system_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                log_id TEXT UNIQUE NOT NULL,
                user_id TEXT,
                action TEXT NOT NULL,
                resource TEXT,
                details TEXT,
                ip_address TEXT,
                user_agent TEXT,
                status TEXT NOT NULL CHECK (status IN ('success', 'failure', 'warning', 'info')),
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (user_id)
            )
        ''')
        
        # Two-factor authentication codes table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS two_factor_codes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                code TEXT NOT NULL,
                type TEXT NOT NULL CHECK (type IN ('login', 'password_reset', 'email_verification')),
                expires_at TIMESTAMP NOT NULL,
                used BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (user_id)
            )
        ''')
        
        # Create indexes for better performance
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_users_phone ON users (phone_encrypted)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_users_role ON users (role)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions (user_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions (status)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_rides_passenger ON rides (passenger_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_rides_operator ON rides (operator_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_rides_status ON rides (status)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_locations_user ON live_locations (user_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_locations_timestamp ON live_locations (timestamp)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_alerts_user ON emergency_alerts (user_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_alerts_status ON emergency_alerts (status)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_logs_user ON system_logs (user_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON system_logs (timestamp)')
        
        conn.commit()
        conn.close()
        print("Database initialized successfully!")
    
    def create_user(self, user_data):
        """Create a new user with encrypted sensitive data"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Generate unique user ID
            user_id = f"USR_{datetime.now().strftime('%Y%m%d')}_{secrets.token_hex(6).upper()}"
            
            # Encrypt sensitive data
            phone_encrypted = self.encrypt_data(user_data['phone'])
            password_hash = self.hash_password(user_data['password'])
            
            cursor.execute('''
                INSERT INTO users (
                    user_id, first_name, last_name, email, phone_encrypted, 
                    password_hash, role, company, operator_id, license_number
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                user_id, user_data['first_name'], user_data['last_name'],
                user_data['email'], phone_encrypted, password_hash,
                user_data['role'], user_data.get('company'),
                user_data.get('operator_id'), user_data.get('license_number')
            ))
            
            conn.commit()
            self.log_action(user_id, 'user_created', 'users', f"User {user_data['email']} created")
            return user_id
            
        except sqlite3.IntegrityError as e:
            conn.rollback()
            raise Exception(f"User creation failed: {str(e)}")
        finally:
            conn.close()
    
    def authenticate_user(self, email, password):
        """Authenticate user with enhanced security"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                SELECT user_id, password_hash, login_attempts, locked_until, 
                       two_factor_enabled, status, verified
                FROM users WHERE email = ?
            ''', (email,))
            
            result = cursor.fetchone()
            if not result:
                return None, "Invalid credentials"
            
            user_id, password_hash, login_attempts, locked_until, two_factor_enabled, status, verified = result
            
            # Check if account is locked
            if locked_until and datetime.fromisoformat(locked_until) > datetime.now():
                return None, "Account temporarily locked due to multiple failed attempts"
            
            # Check account status
            if status != 'active':
                return None, f"Account is {status}"
            
            if not verified:
                return None, "Please verify your email address first"
            
            # Verify password
            if not self.verify_password(password, password_hash):
                # Increment login attempts
                new_attempts = login_attempts + 1
                lock_time = None
                
                if new_attempts >= 5:
                    lock_time = (datetime.now() + timedelta(minutes=30)).isoformat()
                
                cursor.execute('''
                    UPDATE users SET login_attempts = ?, locked_until = ?
                    WHERE user_id = ?
                ''', (new_attempts, lock_time, user_id))
                conn.commit()
                
                self.log_action(user_id, 'login_failed', 'authentication', f"Failed login attempt {new_attempts}")
                return None, "Invalid credentials"
            
            # Reset login attempts on successful authentication
            cursor.execute('''
                UPDATE users SET login_attempts = 0, locked_until = NULL, last_login = ?
                WHERE user_id = ?
            ''', (datetime.now().isoformat(), user_id))
            conn.commit()
            
            self.log_action(user_id, 'login_success', 'authentication', "Successful login")
            
            return user_id, "success" if not two_factor_enabled else "2fa_required"
            
        finally:
            conn.close()
    
    def create_transaction(self, transaction_data):
        """Create encrypted transaction record"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Encrypt sensitive data
            phone_encrypted = self.encrypt_data(transaction_data['phone_number'])
            metadata_encrypted = self.encrypt_data(json.dumps(transaction_data.get('metadata', {})))
            
            cursor.execute('''
                INSERT INTO transactions (
                    transaction_id, user_id, order_id, provider, amount, currency,
                    fees, net_amount, phone_encrypted, description, status,
                    reference, metadata_encrypted
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                transaction_data['transaction_id'], transaction_data['user_id'],
                transaction_data.get('order_id'), transaction_data['provider'],
                transaction_data['amount'], transaction_data.get('currency', 'SLL'),
                transaction_data.get('fees', 0), transaction_data.get('net_amount'),
                phone_encrypted, transaction_data.get('description'),
                transaction_data['status'], transaction_data.get('reference'),
                metadata_encrypted
            ))
            
            conn.commit()
            self.log_action(
                transaction_data['user_id'], 'transaction_created', 'transactions',
                f"Transaction {transaction_data['transaction_id']} created"
            )
            
        finally:
            conn.close()
    
    def update_live_location(self, user_id, location_data):
        """Update user's live location"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
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
                location_data.get('is_online', True)
            ))
            
            conn.commit()
            
        finally:
            conn.close()
    
    def create_emergency_alert(self, alert_data):
        """Create emergency alert"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            alert_id = f"ALERT_{datetime.now().strftime('%Y%m%d%H%M%S')}_{secrets.token_hex(4).upper()}"
            
            cursor.execute('''
                INSERT INTO emergency_alerts (
                    alert_id, user_id, ride_id, type, severity, status,
                    lat, lng, address, description
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                alert_id, alert_data['user_id'], alert_data.get('ride_id'),
                alert_data['type'], alert_data['severity'], 'active',
                alert_data['lat'], alert_data['lng'], alert_data.get('address'),
                alert_data.get('description')
            ))
            
            conn.commit()
            self.log_action(
                alert_data['user_id'], 'emergency_alert_created', 'emergency_alerts',
                f"Emergency alert {alert_id} created"
            )
            
            return alert_id
            
        finally:
            conn.close()
    
    def log_action(self, user_id, action, resource, details, status='success'):
        """Log system actions for audit trail"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            log_id = f"LOG_{datetime.now().strftime('%Y%m%d%H%M%S')}_{secrets.token_hex(4).upper()}"
            
            cursor.execute('''
                INSERT INTO system_logs (
                    log_id, user_id, action, resource, details, status
                ) VALUES (?, ?, ?, ?, ?, ?)
            ''', (log_id, user_id, action, resource, details, status))
            
            conn.commit()
            
        finally:
            conn.close()
    
    def get_user_stats(self):
        """Get comprehensive user statistics for admin dashboard"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Total users by role
            cursor.execute('SELECT role, COUNT(*) FROM users GROUP BY role')
            role_stats = dict(cursor.fetchall())
            
            # Active users (logged in last 30 days)
            thirty_days_ago = (datetime.now() - timedelta(days=30)).isoformat()
            cursor.execute('SELECT COUNT(*) FROM users WHERE last_login > ?', (thirty_days_ago,))
            active_users = cursor.fetchone()[0]
            
            # Transaction statistics
            cursor.execute('SELECT status, COUNT(*) FROM transactions GROUP BY status')
            transaction_stats = dict(cursor.fetchall())
            
            # Emergency alerts
            cursor.execute('SELECT status, COUNT(*) FROM emergency_alerts GROUP BY status')
            alert_stats = dict(cursor.fetchall())
            
            return {
                'users': role_stats,
                'active_users': active_users,
                'transactions': transaction_stats,
                'alerts': alert_stats
            }
            
        finally:
            conn.close()

# Initialize database
if __name__ == "__main__":
    db = TransPayDatabase()
    print("TransPay database system initialized successfully!")
    
    # Create sample admin user
    admin_data = {
        'first_name': 'System',
        'last_name': 'Administrator',
        'email': 'admin@transpay.sl',
        'phone': '+23230656763',
        'password': 'Admin@2024!',
        'role': 'admin'
    }
    
    try:
        admin_id = db.create_user(admin_data)
        print(f"Admin user created with ID: {admin_id}")
    except Exception as e:
        print(f"Admin user creation: {e}")
