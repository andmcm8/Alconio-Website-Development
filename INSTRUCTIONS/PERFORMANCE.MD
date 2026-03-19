# performance.md

# Performance Optimization Instructions

## Image Optimization

### Image Formats and Compression
- Use WebP format for all images with JPEG/PNG fallbacks for older browsers
- SVG format for icons, logos, and simple vector graphics
- Compress all images before deployment using tools like TinyPNG, ImageOptim, or Squoosh
- Target maximum file size of 200KB per image for web delivery
- JPEG quality setting: 80-85% for photographs
- WebP quality setting: 75-80%
- PNG-8 for simple graphics with limited colors, PNG-24 only when transparency is required
- Remove all EXIF metadata from images to reduce file size
- Use progressive JPEGs for faster perceived loading on slower connections

### Responsive Images Implementation
- Implement srcset attribute to serve different image sizes based on viewport width
- Use sizes attribute to define image display sizes at different breakpoints
- Always specify width and height attributes in HTML to prevent layout shift
- Generate multiple image sizes: 320w, 480w, 768w, 1024w, 1440w minimum
- Use picture element when art direction is needed (different crops for mobile vs desktop)

### Image Loading Strategy
- Load critical above-the-fold images immediately without lazy loading
- Apply lazy loading to all below-the-fold images
- Preload largest contentful paint (LCP) image if it's below the fold
- Use blur-up or low-quality image placeholder technique for better UX
- Implement aspect ratio boxes to prevent layout shift while images load

---

## Lazy Loading

### Native Lazy Loading
- Add loading="lazy" attribute to all images below the fold
- Add loading="eager" to critical above-the-fold images
- Apply lazy loading to iframe embeds (YouTube, Google Maps, etc.)
- Apply to video elements that aren't immediately visible

### Advanced Lazy Loading Techniques
- Use Intersection Observer API for custom lazy loading control
- Set threshold for loading images before they enter viewport (e.g., 200px margin)
- Implement fade-in animation when lazy-loaded images appear
- Lazy load background images using CSS classes toggled by JavaScript
- Defer loading of non-critical third-party scripts until user interaction

### Lazy Loading for Resources
- Defer non-critical JavaScript loading using async or defer attributes
- Load fonts asynchronously to prevent render blocking
- Lazy load CSS for below-the-fold content or print styles
- Implement code splitting for JavaScript bundles (load what's needed per page)

---

## Code Optimization

### CSS Optimization
- Minify all CSS files before deployment
- Remove unused CSS using PurgeCSS or similar tools
- Inline critical above-the-fold CSS in HTML head
- Load non-critical CSS asynchronously
- Combine multiple CSS files into one to reduce HTTP requests
- Use CSS containment for performance isolation
- Avoid expensive CSS selectors (deep nesting, universal selectors)

### JavaScript Optimization
- Minify all JavaScript files
- Remove console.log statements and debugging code
- Implement tree shaking to eliminate dead code
- Use code splitting to create smaller bundles
- Defer non-critical JavaScript execution
- Use async attribute for independent scripts
- Move scripts to bottom of body or use defer attribute
- Minimize DOM manipulation and batch operations
- Debounce scroll and resize event handlers

### HTML Optimization
- Minify HTML to remove whitespace and comments
- Eliminate render-blocking resources in critical rendering path
- Use semantic HTML to reduce markup complexity
- Remove unnecessary div wrappers and nested elements
- Implement resource hints: dns-prefetch, preconnect, prefetch for third-party domains

---

## Server and Hosting Optimization

### Caching Strategy
- Set browser cache headers for static assets (1 year for immutable files)
- Implement ETags for cache validation
- Use versioned filenames for cache busting (style.v123.css)
- Configure server-side caching for dynamic content where appropriate
- Implement service worker for offline caching and faster repeat visits

### Compression
- Enable gzip or Brotli compression on server for text-based files
- Compress HTML, CSS, JavaScript, JSON, SVG, and fonts
- Brotli provides better compression than gzip (use if supported)
- Configure compression level balance (higher = smaller but slower)

### Server Configuration
- Enable HTTP/2 or HTTP/3 for multiplexing and faster loading
- Use CDN (Content Delivery Network) for static assets
- Optimize server response time (TTFB under 200ms)
- Enable keep-alive connections
- Reduce server redirects (each redirect adds latency)
- Use 301 redirects (cached) instead of 302 (not cached) when permanent

---

## Performance Metrics and Monitoring

### Core Web Vitals Targets
- Largest Contentful Paint (LCP): Under 2.5 seconds
- First Input Delay (FID): Under 100 milliseconds
- Cumulative Layout Shift (CLS): Under 0.1
- First Contentful Paint (FCP): Under 1.8 seconds
- Time to Interactive (TTI): Under 3.5 seconds
- Total Blocking Time (TBT): Under 200 milliseconds

### Testing Tools
- Google PageSpeed Insights for performance scoring and recommendations
- Lighthouse in Chrome DevTools for comprehensive audits
- WebPageTest for detailed waterfall analysis and filmstrip view
- GTmetrix for performance monitoring and historical tracking
- Chrome DevTools Performance tab for runtime performance profiling

### Ongoing Monitoring
- Set up performance budgets for page weight and load times
- Monitor Core Web Vitals through Google Search Console
- Track performance metrics in Google Analytics
- Set up alerts for performance degradation
- Regular testing on real devices and slow network conditions (3G)
- Test on various browsers and devices (mobile, tablet, desktop)

---

## Third-Party Script Management

### Loading Third-Party Scripts
- Audit all third-party scripts and remove unnecessary ones
- Load third-party scripts asynchronously when possible
- Defer analytics and non-critical tracking scripts
- Use facade pattern for heavy embeds (YouTube, Google Maps) - load on user interaction
- Implement consent management to delay tracking scripts until user consent
- Self-host third-party scripts when possible for better caching control

### Third-Party Script Security
- Use Subresource Integrity (SRI) for scripts loaded from CDNs
- Implement Content Security Policy to whitelist trusted script sources
- Regularly audit third-party script changes and updates
- Monitor third-party script performance impact in Google Analytics

---

## Font Optimization

### Font Loading Strategy
- Use system font stack as fallback to prevent FOIT (Flash of Invisible Text)
- Implement font-display: swap for web fonts
- Preload critical fonts using link rel="preload"
- Limit number of font families (maximum 2) and font weights (2-3 per family)
- Use WOFF2 format (best compression) with WOFF fallback
- Subset fonts to include only necessary characters/glyphs
- Self-host fonts instead of using Google Fonts (better caching and privacy)

### Font File Optimization
- Use variable fonts when multiple weights needed (single file)
- Remove unused glyphs and characters from font files
- Compress font files using tools like FontSquirrel


