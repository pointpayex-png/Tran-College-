# Orange Money & Africell Money Integration Guide

This document provides comprehensive information about the real Orange Money and Africell Money API integrations implemented in the Trans-Pay system.

## Overview

The payment system supports both Orange Money and Africell Money, the two major mobile money providers in Sierra Leone. The integration includes:

- Real-time payment processing
- Transaction status monitoring
- Webhook callbacks for payment confirmations
- Comprehensive error handling
- Fee calculation and transparency
- Phone number validation
- Security with signature verification

## API Endpoints

### Orange Money Integration

**Base URL:** `https://api.orange.com/orange-money-webpay/sl/v1`

#### Authentication
- **Method:** Bearer Token + HMAC Signature
- **Headers:**
  - `Authorization: Bearer {API_KEY}`
  - `X-Signature: {HMAC_SHA256_SIGNATURE}`
  - `X-Timestamp: {ISO_TIMESTAMP}`
  - `X-Nonce: {RANDOM_STRING}`

#### Payment Initiation
\`\`\`
POST /payments/initiate
\`\`\`

**Request Body:**
\`\`\`json
{
  "merchant_id": "string",
  "amount": 25000,
  "currency": "SLL",
  "order_id": "TP_1705567890_abc123",
  "phone_number": "23276123456",
  "description": "Ride payment",
  "callback_url": "https://your-app.com/api/payments/orange/callback",
  "return_url": "https://your-app.com/payment/success",
  "cancel_url": "https://your-app.com/payment/cancel",
  "timestamp": "2024-01-18T10:30:00Z",
  "nonce": "random_string",
  "metadata": {}
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "transaction_id": "OM_TXN_789456123",
  "payment_url": "https://payment.orange.sl/pay/xyz",
  "reference": "OM_REF_789456123",
  "fees": 500,
  "net_amount": 24500,
  "expires_at": "2024-01-18T10:35:00Z"
}
\`\`\`

#### Payment Status Check
\`\`\`
GET /payments/{transaction_id}/status
\`\`\`

**Response:**
\`\`\`json
{
  "transaction_id": "OM_TXN_789456123",
  "status": "success",
  "amount": 25000,
  "currency": "SLL",
  "reference": "OM_REF_789456123",
  "completed_at": "2024-01-18T10:31:15Z",
  "failure_reason": null
}
\`\`\`

### Africell Money Integration

**Base URL:** `https://api.africell.sl/money/v1`

#### Authentication
- **Method:** API Key + HMAC Signature
- **Headers:**
  - `X-API-Key: {API_KEY}`
  - `X-Signature: {HMAC_SHA256_SIGNATURE}`
  - `X-Timestamp: {UNIX_TIMESTAMP}`

#### Payment Request
\`\`\`
POST /payments/request
\`\`\`

**Request Body:**
\`\`\`json
{
  "merchant_id": "string",
  "request_id": "TP_1705567890_abc123_1705567890",
  "amount": 25000,
  "currency": "SLL",
  "phone_number": "23270123456",
  "description": "Ride payment",
  "callback_url": "https://your-app.com/api/payments/africell/callback",
  "return_url": "https://your-app.com/payment/success",
  "cancel_url": "https://your-app.com/payment/cancel",
  "timestamp": "1705567890",
  "metadata": {}
}
\`\`\`

**Response:**
\`\`\`json
{
  "status": "success",
  "transaction_id": "AM_TXN_456789012",
  "payment_url": "https://payment.africell.sl/pay/xyz",
  "reference_number": "AM_REF_456789012",
  "transaction_fee": 400,
  "net_amount": 24600,
  "expires_in": 300
}
\`\`\`

## Phone Number Validation

### Orange Money Numbers
- **Prefixes:** 076, 077, 078, 079
- **Format:** +232 7X XXX XXXX
- **Regex:** `^(232)?(76|77|78|79)\d{6}$`

### Africell Money Numbers
- **Prefixes:** 070, 075, 088, 099
- **Format:** +232 7X XXX XXXX or +232 XX XXX XXXX
- **Regex:** `^(232)?(70|75|88|99)\d{6}$`

## Fee Structure

### Orange Money Fees
| Amount Range (SLL) | Fee (SLL) |
|-------------------|-----------|
| 0 - 50,000        | 500       |
| 50,001 - 100,000  | 1,000     |
| 100,001 - 500,000 | 2,000     |
| 500,001+          | 5,000     |

### Africell Money Fees
| Amount Range (SLL) | Fee (SLL) |
|-------------------|-----------|
| 0 - 50,000        | 400       |
| 50,001 - 100,000  | 800       |
| 100,001 - 500,000 | 1,500     |
| 500,001+          | 4,000     |

## Security Implementation

### HMAC Signature Generation

**Orange Money:**
\`\`\`javascript
const signatureString = `${merchant_id}${amount}${currency}${order_id}${timestamp}${nonce}`
const signature = crypto.createHmac('sha256', secret_key).update(signatureString).digest('hex')
\`\`\`

**Africell Money:**
\`\`\`javascript
const signatureString = `${merchant_id}${request_id}${amount}${currency}${timestamp}`
const signature = crypto.createHmac('sha256', secret_key).update(signatureString).digest('hex')
\`\`\`

### Webhook Verification

Both providers send webhooks to confirm payment status. Always verify the signature before processing:

\`\`\`javascript
function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
}
\`\`\`

## Error Handling

### Common Error Codes

| Code | Description | Action |
|------|-------------|--------|
| 1001 | Invalid phone number | Validate format |
| 1002 | Insufficient balance | Ask user to top up |
| 1003 | Transaction limit exceeded | Reduce amount |
| 1004 | Service unavailable | Retry later |
| 1005 | Invalid PIN | User should retry |
| 1006 | Transaction timeout | Initiate new payment |

### Retry Logic

Implement exponential backoff for failed requests:

\`\`\`javascript
async function retryPayment(paymentFunction, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await paymentFunction()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
    }
  }
}
\`\`\`

## Testing

### Test Credentials

**Orange Money Sandbox:**
- API URL: `https://api-sandbox.orange.com/orange-money-webpay/sl/v1`
- Test Phone: `23276000001`
- Test PIN: `1234`

**Africell Money Sandbox:**
- API URL: `https://sandbox-api.africell.sl/money/v1`
- Test Phone: `23270000001`
- Test PIN: `0000`

### Test Scenarios

1. **Successful Payment**
   - Amount: 10,000 SLL
   - Expected: Success with reference number

2. **Insufficient Balance**
   - Amount: 1,000,000 SLL
   - Expected: Error 1002

3. **Invalid Phone Number**
   - Phone: `23271234567` (invalid prefix)
   - Expected: Error 1001

4. **Payment Timeout**
   - Don't complete payment within 5 minutes
   - Expected: Status changes to 'expired'

## Monitoring and Logging

### Key Metrics to Track

1. **Payment Success Rate**
   - Target: >95%
   - Alert if <90%

2. **Average Processing Time**
   - Target: <30 seconds
   - Alert if >60 seconds

3. **API Response Times**
   - Target: <2 seconds
   - Alert if >5 seconds

4. **Error Rates by Provider**
   - Track error codes and frequencies
   - Identify patterns and issues

### Logging Best Practices

\`\`\`javascript
// Log payment initiation
logger.info('Payment initiated', {
  transactionId,
  provider,
  amount,
  userId,
  timestamp: new Date().toISOString()
})

// Log payment completion
logger.info('Payment completed', {
  transactionId,
  status,
  processingTime: endTime - startTime,
  reference
})

// Log errors (without sensitive data)
logger.error('Payment failed', {
  transactionId,
  errorCode,
  errorMessage,
  provider
})
\`\`\`

## Compliance and Regulations

### Data Protection
- Store minimal payment data
- Encrypt sensitive information
- Implement data retention policies
- Comply with Sierra Leone data protection laws

### Financial Regulations
- Maintain transaction records for 7 years
- Report suspicious activities
- Implement AML (Anti-Money Laundering) checks
- Comply with Central Bank of Sierra Leone regulations

### PCI DSS Compliance
- Never store card data (if applicable)
- Use secure communication channels
- Implement proper access controls
- Regular security audits

## Deployment Checklist

### Pre-Production
- [ ] Test all payment flows
- [ ] Verify webhook endpoints
- [ ] Test error scenarios
- [ ] Load testing completed
- [ ] Security audit passed

### Production Setup
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Monitoring alerts configured
- [ ] Backup procedures tested
- [ ] Documentation updated

### Go-Live
- [ ] Switch to production APIs
- [ ] Monitor initial transactions
- [ ] Customer support ready
- [ ] Rollback plan prepared

## Support and Troubleshooting

### Common Issues

1. **Payment Stuck in Pending**
   - Check webhook delivery
   - Verify callback URL accessibility
   - Manual status check via API

2. **High Failure Rate**
   - Check provider service status
   - Verify API credentials
   - Review error logs

3. **Webhook Not Received**
   - Check firewall settings
   - Verify endpoint URL
   - Test with webhook testing tools

### Contact Information

**Orange Money Support:**
- Email: api-support@orange.sl
- Phone: +232 76 000 000
- Documentation: https://developer.orange.sl

**Africell Money Support:**
- Email: developer@africell.sl
- Phone: +232 70 000 000
- Documentation: https://developer.africell.sl

## Conclusion

This integration provides a robust, secure, and user-friendly payment system for Sierra Leone's mobile money ecosystem. Regular monitoring, testing, and updates ensure optimal performance and user experience.

For technical support or questions about this integration, contact the development team or refer to the provider documentation.
