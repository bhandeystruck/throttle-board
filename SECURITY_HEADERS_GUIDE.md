# Security Headers Configuration Guide

## CSP Errors Fixed ✅

The Content Security Policy errors have been resolved by:

1. **Removed invalid meta tags**: `frame-ancestors` and `X-Frame-Options` cannot be set via `<meta>` tags
2. **Added Google Fonts support**: Added `https://fonts.googleapis.com` to `style-src` and `https://fonts.gstatic.com` to `font-src`

## Current CSP Configuration

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://*.supabase.io; base-uri 'self'; form-action 'self';" />
```

## Server-Level Security Headers (Recommended)

For maximum security, configure these headers at your server/CDN level:

### Nginx Configuration
```nginx
# Add to your nginx.conf or site configuration
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://*.supabase.io; base-uri 'self'; form-action 'self';" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

### Apache Configuration
```apache
# Add to your .htaccess or virtual host configuration
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://*.supabase.io; base-uri 'self'; form-action 'self';"
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
```

### Vercel Configuration
```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://*.supabase.io; base-uri 'self'; form-action 'self';"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        }
      ]
    }
  ]
}
```

### Netlify Configuration
```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://*.supabase.io; base-uri 'self'; form-action 'self';"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

## CSP Directive Explanations

- **default-src 'self'**: Only allow resources from same origin
- **script-src 'self' 'unsafe-inline' 'unsafe-eval'**: Allow scripts from same origin, inline scripts, and eval (needed for React dev tools)
- **style-src 'self' 'unsafe-inline' https://fonts.googleapis.com**: Allow styles from same origin, inline styles, and Google Fonts
- **font-src 'self' data: https://fonts.gstatic.com**: Allow fonts from same origin, data URIs, and Google Fonts
- **img-src 'self' data: https:**: Allow images from same origin, data URIs, and HTTPS sources
- **connect-src 'self' https://*.supabase.co https://*.supabase.io**: Allow API calls to same origin and Supabase
- **base-uri 'self'**: Restrict base tag URLs to same origin
- **form-action 'self'**: Restrict form submissions to same origin

## Security Benefits

✅ **XSS Protection**: Prevents cross-site scripting attacks  
✅ **Clickjacking Protection**: Prevents embedding in frames  
✅ **MIME Sniffing Protection**: Prevents MIME type confusion  
✅ **Font Loading**: Secure font loading from Google Fonts  
✅ **API Security**: Restricted to Supabase endpoints only  

## Testing Your CSP

1. **Browser Console**: Check for CSP violations
2. **Online CSP Evaluator**: Test your policy
3. **Security Headers Check**: Use online tools to verify headers

## Production Recommendations

1. **Remove 'unsafe-eval'** in production if possible
2. **Use nonces** for inline scripts instead of 'unsafe-inline'
3. **Implement HSTS** for HTTPS enforcement
4. **Add CSP reporting** to monitor violations
5. **Regular security audits** of your CSP policy
