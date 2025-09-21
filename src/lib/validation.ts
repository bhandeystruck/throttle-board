// Input validation and sanitization utilities
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Sanitize text input to prevent XSS
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 1000); // Limit length
}

// Validate ICAO codes
export function validateICAO(icao: string): boolean {
  if (!icao || typeof icao !== 'string') return false;
  return /^[A-Z]{4}$/.test(icao.toUpperCase());
}

// Validate email
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Validate password strength
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
    return { valid: false, errors };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Check for common weak patterns
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password cannot contain repeated characters');
  }
  
  if (/123|abc|password|qwerty/i.test(password)) {
    errors.push('Password cannot contain common patterns');
  }
  
  return { valid: errors.length === 0, errors };
}

// Validate handle format
export function validateHandle(handle: string): boolean {
  if (!handle || typeof handle !== 'string') return false;
  return /^@[a-zA-Z0-9_]{1,30}$/.test(handle);
}

// Validate platform selection
export function validatePlatform(platform: string): boolean {
  const validPlatforms = ['tiktok', 'instagram', 'youtube', 'other'];
  return validPlatforms.includes(platform);
}

// Validate flight status
export function validateFlightStatus(status: string): boolean {
  const validStatuses = ['requested', 'queued', 'planning', 'underway', 'edited', 'published', 'archived', 'declined'];
  return validStatuses.includes(status);
}

// Validate visibility setting
export function validateVisibility(visibility: string): boolean {
  const validVisibility = ['public', 'unlisted', 'private'];
  return validVisibility.includes(visibility);
}

// Sanitize and validate flight request data
export function validateFlightRequest(data: any): { valid: boolean; sanitized: any; errors: string[] } {
  const errors: string[] = [];
  const sanitized: any = {};
  
  // Required fields
  if (!data.requester_handle) {
    errors.push('Requester handle is required');
  } else if (!validateHandle(data.requester_handle)) {
    errors.push('Invalid handle format');
  } else {
    sanitized.requester_handle = sanitizeText(data.requester_handle);
  }
  
  if (!data.origin_icao) {
    errors.push('Origin ICAO is required');
  } else if (!validateICAO(data.origin_icao)) {
    errors.push('Invalid origin ICAO code');
  } else {
    sanitized.origin_icao = data.origin_icao.toUpperCase();
  }
  
  if (!data.destination_icao) {
    errors.push('Destination ICAO is required');
  } else if (!validateICAO(data.destination_icao)) {
    errors.push('Invalid destination ICAO code');
  } else {
    sanitized.destination_icao = data.destination_icao.toUpperCase();
  }
  
  // Optional fields
  if (data.platform && !validatePlatform(data.platform)) {
    errors.push('Invalid platform selection');
  } else if (data.platform) {
    sanitized.platform = data.platform;
  }
  
  if (data.origin_city) {
    sanitized.origin_city = sanitizeText(data.origin_city);
  }
  
  if (data.destination_city) {
    sanitized.destination_city = sanitizeText(data.destination_city);
  }
  
  if (data.airline) {
    sanitized.airline = sanitizeText(data.airline);
  }
  
  if (data.aircraft) {
    sanitized.aircraft = sanitizeText(data.aircraft);
  }
  
  if (data.notes_public) {
    sanitized.notes_public = sanitizeText(data.notes_public);
  }
  
  // Default values
  sanitized.sim = 'MSFS 2024';
  sanitized.priority = 1;
  sanitized.visibility = 'public';
  sanitized.status = 'requested';
  
  return {
    valid: errors.length === 0,
    sanitized,
    errors
  };
}

// Rate limiting helper (client-side basic check)
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  isAllowed(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}

export const rateLimiter = new RateLimiter();
