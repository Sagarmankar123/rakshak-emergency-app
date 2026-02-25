# 🔒 Security Policy - Rakshak

## Security Best Practices

### Current Implementation

#### 1. Data Encryption
**Current:** Base64 encoding (Demo purposes)
```typescript
// utils/storage.ts
const encrypt = (data: string): string => {
  return btoa(data); // Base64 - NOT SECURE FOR PRODUCTION
};
```

**Production Recommendation:**
```typescript
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.VITE_ENCRYPTION_KEY;

const encrypt = (data: string): string => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

const decrypt = (data: string): string => {
  const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
```

#### 2. Authentication
**Current:** Simulated OTP and JWT
**Production Requirements:**
- Use real SMS gateway (Twilio, MSG91, Firebase Auth)
- Implement proper JWT with secret key rotation
- Add refresh tokens
- Implement rate limiting
- Use httpOnly cookies for tokens

```typescript
// Production JWT implementation
import jwt from 'jsonwebtoken';

const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId, iat: Date.now() },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
};

const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
};
```

#### 3. Input Validation
```typescript
// Sanitize user inputs
import DOMPurify from 'dompurify';

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input);
};

// Validate phone numbers
const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Validate names
const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name);
};
```

#### 4. XSS Protection
```typescript
// Escape HTML
const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
};
```

#### 5. CSRF Protection
```typescript
// Generate CSRF token
const generateCSRFToken = (): string => {
  return crypto.randomUUID();
};

// Validate CSRF token
const validateCSRFToken = (token: string, storedToken: string): boolean => {
  return token === storedToken;
};
```

### Security Headers

Add these headers to your hosting provider:

```
# Content Security Policy
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://api.rakshak.app wss://api.rakshak.app;
  media-src 'self';
  frame-ancestors 'none';

# Prevent clickjacking
X-Frame-Options: DENY

# Prevent MIME sniffing
X-Content-Type-Options: nosniff

# XSS Protection
X-XSS-Protection: 1; mode=block

# Referrer Policy
Referrer-Policy: strict-origin-when-cross-origin

# Permissions Policy
Permissions-Policy: 
  geolocation=(self),
  microphone=(self),
  camera=(self),
  payment=(),
  usb=()

# Strict Transport Security
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### Environment Variables Security

#### Development (.env.local)
```env
VITE_API_URL=http://localhost:3000
VITE_ENABLE_DEBUG=true
```

#### Production (.env.production)
```env
VITE_API_URL=https://api.rakshak.app
VITE_MSG91_API_KEY=NEVER_COMMIT_THIS
VITE_SENTRY_DSN=your_sentry_dsn
VITE_ENABLE_DEBUG=false
```

**Never commit these files to Git!**

Add to `.gitignore`:
```
.env
.env.local
.env.production
.env.*.local
```

### Rate Limiting

Implement rate limiting for sensitive operations:

```typescript
// Simple rate limiter
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  isAllowed(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    return true;
  }
}

// Usage
const limiter = new RateLimiter();

const sendOTP = async (phone: string) => {
  if (!limiter.isAllowed(`otp-${phone}`, 3, 60000)) {
    throw new Error('Too many attempts. Please try again later.');
  }
  // Send OTP
};
```

### Secure Storage

```typescript
// Use encrypted storage for sensitive data
class SecureStorage {
  private encryptionKey: string;
  
  constructor(key: string) {
    this.encryptionKey = key;
  }
  
  set(key: string, value: any): void {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(value),
      this.encryptionKey
    ).toString();
    localStorage.setItem(key, encrypted);
  }
  
  get(key: string): any {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    
    try {
      const decrypted = CryptoJS.AES.decrypt(
        encrypted,
        this.encryptionKey
      ).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  }
  
  remove(key: string): void {
    localStorage.removeItem(key);
  }
  
  clear(): void {
    localStorage.clear();
  }
}
```

### API Security

When implementing backend API:

```typescript
// Express.js middleware example
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

app.use(helmet()); // Security headers

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Input validation
import { body, validationResult } from 'express-validator';

app.post('/api/contacts', [
  body('name').trim().isLength({ min: 2, max: 50 }).escape(),
  body('phone').matches(/^[6-9]\d{9}$/),
  body('relationship').trim().isIn(['Parent', 'Sibling', 'Spouse', 'Friend', 'Relative', 'Other'])
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process request
});
```

### Location Data Security

```typescript
// Anonymize location data before logging
const anonymizeLocation = (lat: number, lon: number, precision: number = 3) => {
  return {
    latitude: Number(lat.toFixed(precision)),
    longitude: Number(lon.toFixed(precision))
  };
};

// Don't log exact coordinates in analytics
logEvent('emergency_activated', {
  location: anonymizeLocation(location.latitude, location.longitude),
  timestamp: Date.now()
});
```

### Emergency Contact Security

```typescript
// Validate contact before saving
const validateContact = (contact: TrustedContact): boolean => {
  if (!contact.name || contact.name.length < 2 || contact.name.length > 50) {
    return false;
  }
  
  if (!/^[6-9]\d{9}$/.test(contact.phone)) {
    return false;
  }
  
  const validRelationships = ['Parent', 'Sibling', 'Spouse', 'Friend', 'Relative', 'Other'];
  if (!validRelationships.includes(contact.relationship)) {
    return false;
  }
  
  return true;
};
```

### Audio Recording Security

```typescript
// Ensure user consent before recording
const requestRecordingPermission = async (): Promise<boolean> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Show clear consent dialog
    const consent = confirm(
      'Rakshak will record audio during emergency. ' +
      'This recording is for your safety and will be stored securely. ' +
      'Do you consent?'
    );
    
    stream.getTracks().forEach(track => track.stop());
    return consent;
  } catch {
    return false;
  }
};
```

### Secure Communication

For production real-time features:

```typescript
// Socket.io with authentication
import { io } from 'socket.io-client';

const socket = io('wss://api.rakshak.app', {
  auth: {
    token: getAuthToken()
  },
  transports: ['websocket'],
  secure: true
});

socket.on('connect_error', (error) => {
  console.error('Connection failed:', error.message);
});
```

### Data Retention Policy

```typescript
// Auto-delete old emergency logs
const cleanupOldLogs = () => {
  const logs = storage.getLogs();
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  
  const recentLogs = logs.filter(log => 
    new Date(log.timestamp).getTime() > thirtyDaysAgo
  );
  
  storage.setLogs(recentLogs);
};

// Run cleanup on app start
cleanupOldLogs();
```

### Vulnerability Reporting

If you discover a security vulnerability, please email:
**security@rakshak.app**

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

**Do not** disclose publicly until we've had a chance to address it.

### Security Audit Checklist

Before production:

- [ ] Replace Base64 with proper encryption
- [ ] Implement real OTP service
- [ ] Use proper JWT with secret rotation
- [ ] Add rate limiting
- [ ] Implement CSRF protection
- [ ] Add security headers
- [ ] Sanitize all user inputs
- [ ] Validate all API requests
- [ ] Use HTTPS everywhere
- [ ] Implement proper error handling
- [ ] Remove all console.logs with sensitive data
- [ ] Add monitoring for suspicious activities
- [ ] Implement session timeout
- [ ] Add 2FA for sensitive operations
- [ ] Regular security updates
- [ ] Penetration testing
- [ ] Code review by security expert
- [ ] GDPR compliance (if applicable)
- [ ] Data encryption at rest
- [ ] Secure backup strategy

### Regular Security Tasks

- [ ] Update dependencies monthly (`npm audit`)
- [ ] Review access logs weekly
- [ ] Rotate API keys quarterly
- [ ] Security audit annually
- [ ] Backup encryption keys securely
- [ ] Monitor for unauthorized access
- [ ] Review and update privacy policy
- [ ] Train team on security best practices

### Compliance

Ensure compliance with:
- **IT Act 2000** (India)
- **Personal Data Protection Bill** (India)
- **GDPR** (if serving EU users)
- **CCPA** (if serving California users)

### Third-Party Security

When integrating third-party services:

- [ ] Review their security policies
- [ ] Use official SDKs only
- [ ] Keep dependencies updated
- [ ] Monitor for security advisories
- [ ] Use environment variables for API keys
- [ ] Implement fallbacks for service failures
- [ ] Log third-party errors
- [ ] Set reasonable timeouts

---

**Security is not a feature, it's a requirement.**

For questions, contact: security@rakshak.app
