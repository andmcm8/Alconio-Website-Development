# testing-checklist.md

# Testing Checklist

## Pre-Launch Testing Requirements

### Functionality Testing

#### Navigation
- [ ] All navigation menu links work correctly
- [ ] Mobile hamburger menu opens and closes properly
- [ ] Navigation highlights current page
- [ ] Breadcrumb navigation works (if applicable)
- [ ] Footer links work correctly
- [ ] All internal links point to correct pages
- [ ] External links open in new tabs with rel="noopener noreferrer"
- [ ] Skip-to-content link works and is visible on keyboard focus

#### Forms
- [ ] Contact form submits successfully
- [ ] Form validation works (client-side and server-side)
- [ ] Required fields are marked and enforced
- [ ] Error messages display correctly for invalid inputs
- [ ] Success message displays after successful submission
- [ ] Email notifications send to business owner
- [ ] Auto-reply email sends to customer
- [ ] Spam protection is active (honeypot, reCAPTCHA, rate limiting)
- [ ] Form data saves to database as backup
- [ ] Form works with JavaScript disabled (graceful degradation)
- [ ] Newsletter signup works (if applicable)
- [ ] File upload works and validates file types (if applicable)

#### E-commerce Functionality (Premium/E-commerce tiers)
- [ ] Products display correctly with images, prices, descriptions
- [ ] Product variants (size, color) work and update price
- [ ] Add to cart functionality works
- [ ] Cart updates quantities correctly
- [ ] Remove from cart works
- [ ] Cart persists across page navigation
- [ ] Cart shows correct subtotal, tax, shipping estimates
- [ ] Discount codes apply correctly
- [ ] Checkout process completes without errors
- [ ] Payment processing works (test mode first)
- [ ] Order confirmation email sends to customer
- [ ] Order notification sends to store owner
- [ ] Inventory updates after purchase
- [ ] Guest checkout works
- [ ] User account creation works
- [ ] Login/logout functionality works
- [ ] Password reset email sends and works
- [ ] User dashboard displays order history
- [ ] Saved addresses populate in checkout
- [ ] Shipping calculation is accurate
- [ ] Tax calculation is accurate based on location

#### CMS Functionality (Premium/E-commerce tiers)
- [ ] Admin login works
- [ ] User roles and permissions work correctly
- [ ] Content editing saves properly
- [ ] Media upload works (images, PDFs, videos)
- [ ] Media library organizes and displays files correctly
- [ ] Image editing tools work (crop, resize)
- [ ] Page/post publishing works
- [ ] Scheduling posts works
- [ ] Revision history saves and revert works
- [ ] Draft mode works
- [ ] Preview before publishing works

#### Booking System (Premium tier if applicable)
- [ ] Calendar displays availability correctly
- [ ] Time slot selection works
- [ ] Booking form submits successfully
- [ ] Confirmation email sends
- [ ] Reminder emails send before appointments
- [ ] Double-booking prevention works
- [ ] Admin can view and manage bookings
- [ ] Cancellation/rescheduling works
- [ ] Payment at booking works (if applicable)

#### Search Functionality (if applicable)
- [ ] Site search returns relevant results
- [ ] Search handles typos/misspellings
- [ ] Search results link to correct pages
- [ ] "No results" message displays when appropriate
- [ ] Search filters work (if applicable)

---

### Responsive Design Testing

#### Mobile Devices (320px - 767px)
- [ ] All content fits within viewport (no horizontal scrolling)
- [ ] Text is readable without zooming (minimum 16px)
- [ ] Navigation menu adapts to mobile (hamburger menu)
- [ ] Touch targets are minimum 44x44px
- [ ] Forms are easy to fill out on mobile
- [ ] Images scale properly
- [ ] Videos/embeds are responsive
- [ ] Tables scroll horizontally or stack on mobile
- [ ] Footer content stacks vertically

#### Tablet Devices (768px - 1023px)
- [ ] Layout adapts appropriately for tablet size
- [ ] Navigation works on tablet
- [ ] Images scale correctly
- [ ] Content is readable and well-spaced
- [ ] Forms work well on tablet

#### Desktop (1024px+)
- [ ] Full navigation menu displays
- [ ] Layout uses available space effectively
- [ ] Content is centered or aligned appropriately
- [ ] Images display at appropriate sizes
- [ ] Multi-column layouts work correctly

#### Testing on Real Devices
- [ ] Test on iPhone (Safari)
- [ ] Test on Android phone (Chrome)
- [ ] Test on iPad (Safari)
- [ ] Test on Android tablet (Chrome)
- [ ] Test in landscape and portrait orientations
- [ ] Test with different screen resolutions

---

### Cross-Browser Compatibility

#### Desktop Browsers (Latest Versions)
- [ ] Google Chrome - all features work
- [ ] Mozilla Firefox - all features work
- [ ] Apple Safari - all features work
- [ ] Microsoft Edge - all features work
- [ ] Opera (optional) - all features work

#### Mobile Browsers
- [ ] Safari iOS (latest version)
- [ ] Chrome Android (latest version)
- [ ] Samsung Internet (optional)

#### Fallbacks and Polyfills
- [ ] Site works with JavaScript disabled (core content accessible)
- [ ] CSS fallbacks work for modern features
- [ ] Site degrades gracefully in older browsers

---

### Performance Testing

#### Page Speed Metrics
- [ ] Google PageSpeed Insights score: 90+ (mobile and desktop)
- [ ] Largest Contentful Paint (LCP): Under 2.5 seconds
- [ ] First Input Delay (FID): Under 100 milliseconds
- [ ] Cumulative Layout Shift (CLS): Under 0.1
- [ ] First Contentful Paint (FCP): Under 1.8 seconds
- [ ] Time to Interactive (TTI): Under 3.5 seconds
- [ ] Total Blocking Time (TBT): Under 200 milliseconds

#### Image Optimization
- [ ] All images compressed and optimized
- [ ] WebP format used with fallbacks
- [ ] Images have width and height attributes
- [ ] Lazy loading implemented for below-fold images
- [ ] Responsive images (srcset) implemented
- [ ] No images larger than 200KB
- [ ] All images have alt text

#### Resource Optimization
- [ ] CSS minified
- [ ] JavaScript minified
- [ ] HTML minified (if applicable)
- [ ] Gzip or Brotli compression enabled
- [ ] Browser caching configured (1 year for static assets)
- [ ] No render-blocking resources or minimal impact
- [ ] Unused CSS removed
- [ ] Critical CSS inlined (if applicable)

#### Third-Party Scripts
- [ ] All third-party scripts load asynchronously
- [ ] Analytics loads without blocking page render
- [ ] Social media embeds don't slow page load
- [ ] Payment scripts (Stripe, PayPal) load efficiently

#### Network Performance
- [ ] Site loads quickly on 3G connection
- [ ] Time to First Byte (TTFB): Under 200ms
- [ ] Server response time optimized
- [ ] CDN configured (if applicable)
- [ ] HTTP/2 or HTTP/3 enabled

---

### SEO Testing

#### On-Page SEO
- [ ] Every page has unique title tag (50-60 characters)
- [ ] Every page has unique meta description (150-160 characters)
- [ ] All pages have proper heading hierarchy (H1, H2, H3, etc.)
- [ ] Only one H1 per page
- [ ] All images have descriptive alt text
- [ ] URLs are SEO-friendly (descriptive, keyword-rich, lowercase)
- [ ] Internal linking implemented throughout site
- [ ] No broken links (use broken link checker)
- [ ] Canonical tags on all pages
- [ ] Robots.txt file created and configured
- [ ] 404 page exists and styled

#### Technical SEO
- [ ] XML sitemap generated and accurate
- [ ] XML sitemap submitted to Google Search Console
- [ ] XML sitemap submitted to Bing Webmaster Tools
- [ ] HTTPS enabled with valid SSL certificate
- [ ] All HTTP traffic redirects to HTTPS
- [ ] No mixed content warnings
- [ ] Site indexed correctly in search engines
- [ ] Structured data (Schema.org) implemented
- [ ] Structured data validated with Google Rich Results Test
- [ ] OpenGraph tags on all pages (for social sharing)
- [ ] Twitter Card tags on all pages
- [ ] Favicon installed (multiple sizes)

#### Google Search Console
- [ ] Site verified in Google Search Console
- [ ] No crawl errors
- [ ] No mobile usability issues
- [ ] Core Web Vitals passing
- [ ] No manual actions or penalties
- [ ] No security issues

#### Local SEO (if applicable)
- [ ] Google Business Profile claimed and optimized
- [ ] NAP (Name, Address, Phone) consistent across site
- [ ] Local business schema markup implemented
- [ ] Location pages created (if multiple locations)

---

### Accessibility Testing (WCAG 2.1 AA)

#### Automated Accessibility Testing
- [ ] WAVE browser extension - no errors
- [ ] axe DevTools - no critical issues
- [ ] Lighthouse accessibility audit: 95+ score
- [ ] Color contrast meets WCAG AA standards (4.5:1 for normal text)
- [ ] HTML validates (W3C Validator)

#### Keyboard Navigation
- [ ] All interactive elements accessible via Tab key
- [ ] Tab order is logical (top to bottom, left to right)
- [ ] Focus indicators visible on all focusable elements
- [ ] Skip-to-content link works
- [ ] Dropdown menus accessible via keyboard
- [ ] Modals trap focus and close with Escape key
- [ ] No keyboard traps
- [ ] Enter/Space activate buttons and links appropriately

#### Screen Reader Testing
- [ ] Test with NVDA (Windows) or VoiceOver (Mac)
- [ ] All images have appropriate alt text
- [ ] Form labels associated with inputs
- [ ] Headings create logical document outline
- [ ] Links make sense out of context
- [ ] Error messages announced to screen readers
- [ ] Dynamic content updates announced (aria-live)
- [ ] Skip navigation works
- [ ] Landmark regions properly defined

#### Forms Accessibility
- [ ] All inputs have associated labels
- [ ] Required fields marked with required attribute
- [ ] Error messages clear and associated with fields
- [ ] Field instructions provided where needed
- [ ] Fieldset and legend used for grouped inputs

#### Visual Accessibility
- [ ] Site works at 200% browser zoom
- [ ] Text remains readable when zoomed
- [ ] No information conveyed by color alone
- [ ] Links distinguishable from regular text
- [ ] All text has sufficient contrast

#### Media Accessibility
- [ ] Videos have captions or subtitles
- [ ] Audio content has transcripts
- [ ] No auto-playing media with sound
- [ ] Media player controls keyboard accessible

---

### Security Testing

#### HTTPS and SSL
- [ ] Valid SSL certificate installed
- [ ] SSL certificate not expired
- [ ] All pages force HTTPS
- [ ] No mixed content warnings
- [ ] HSTS header configured
- [ ] SSL Labs test: A or A+ rating

#### Security Headers
- [ ] Content-Security-Policy header configured
- [ ] X-Frame-Options header set (SAMEORIGIN or DENY)
- [ ] X-Content-Type-Options header set (nosniff)
- [ ] Referrer-Policy header configured
- [ ] Test headers at securityheaders.com

#### Form Security
- [ ] All forms use CSRF protection
- [ ] Input validation on client and server side
- [ ] SQL injection prevention (prepared statements)
- [ ] XSS prevention (input sanitization, output encoding)
- [ ] Rate limiting on form submissions
- [ ] Spam protection active (honeypot, reCAPTCHA)
- [ ] Passwords hashed with bcrypt or Argon2 (if user accounts)
- [ ] Strong password requirements enforced

#### Authentication Security (if applicable)
- [ ] Passwords stored securely (hashed, not plain text)
- [ ] Session management secure (HTTP-only cookies)
- [ ] Two-factor authentication available (if applicable)
- [ ] Login rate limiting prevents brute force
- [ ] Password reset flow secure
- [ ] Account lockout after failed login attempts

#### E-commerce Security (if applicable)
- [ ] Payment processing PCI DSS compliant
- [ ] No credit card data stored on server
- [ ] Payment gateway uses tokenization
- [ ] All payment pages served over HTTPS
- [ ] Address verification enabled
- [ ] CVV verification required
- [ ] Fraud detection measures active

#### General Security
- [ ] All dependencies up to date
- [ ] No sensitive data exposed in source code
- [ ] Error messages don't reveal system information
- [ ] Directory listing disabled
- [ ] Admin areas protected with authentication
- [ ] File upload restrictions (if applicable)
- [ ] Database credentials in environment variables

---

### Content Testing

#### Text Content
- [ ] No placeholder text (Lorem Ipsum) remains
- [ ] All content proofread for spelling and grammar
- [ ] Brand name spelled consistently
- [ ] No broken or missing content
- [ ] Dates and times accurate
- [ ] Phone numbers formatted correctly
- [ ] Email addresses correct
- [ ] Physical addresses accurate

#### Images and Media
- [ ] All images display correctly
- [ ] No broken image links
- [ ] All placeholder images replaced with final content
- [ ] Product images high quality (if e-commerce)
- [ ] Team photos professional (if applicable)
- [ ] Logo displays correctly in header and favicon
- [ ] Videos play correctly
- [ ] Video/audio quality acceptable

#### Legal Pages
- [ ] Privacy Policy page exists and complete
- [ ] Terms of Service page exists (if applicable)
- [ ] Cookie Policy page exists (if using cookies)
- [ ] Return/Refund Policy page (if e-commerce)
- [ ] Shipping Policy page (if e-commerce)
- [ ] Contact information accurate
- [ ] Copyright notice in footer with current year

---

### Analytics and Tracking

#### Google Analytics
- [ ] Google Analytics 4 installed correctly
- [ ] Tracking code on all pages
- [ ] Goals/conversions configured
- [ ] E-commerce tracking setup (if applicable)
- [ ] Events tracking configured (form submissions, button clicks, etc.)
- [ ] Real-time tracking working
- [ ] Filters configured (exclude internal traffic)
- [ ] Cookie consent integration working

#### Google Search Console
- [ ] Property verified
- [ ] Sitemap submitted
- [ ] No errors in Index Coverage report
- [ ] Mobile usability report shows no issues

#### Other Tracking (if applicable)
- [ ] Facebook Pixel installed (if used)
- [ ] Google Tag Manager configured (if used)
- [ ] Conversion tracking pixels working
- [ ] Heatmap tracking configured (if used)

---

### Email Testing

#### Transactional Emails
- [ ] Contact form submission emails send to business
- [ ] Contact form auto-reply sends to customer
- [ ] Order confirmation emails send (if e-commerce)
- [ ] Shipping notification emails send (if e-commerce)
- [ ] Password reset emails send (if user accounts)
- [ ] Account creation emails send (if user accounts)
- [ ] Booking confirmation emails send (if booking system)
- [ ] Newsletter signup confirmation sends (if applicable)

#### Email Content and Formatting
- [ ] All emails display correctly in Gmail
- [ ] All emails display correctly in Outlook
- [ ] All emails display correctly on mobile
- [ ] Unsubscribe link works (for marketing emails)
- [ ] Email links point to correct pages
- [ ] Email branding matches website
- [ ] Sender name and email address correct
- [ ] No spam trigger words in subject lines

#### Email Deliverability
- [ ] SPF record configured
- [ ] DKIM configured
- [ ] DMARC configured (optional but recommended)
- [ ] Test emails not going to spam folder
- [ ] From address uses business domain (not generic Gmail)

---

### Database and Backup Testing (if applicable)

#### Database Functionality
- [ ] Database connections stable
- [ ] No database errors in logs
- [ ] Database queries optimized
- [ ] Data saves correctly
- [ ] Data retrieves correctly
- [ ] Data updates work
- [ ] Data deletion works

#### Backup System
- [ ] Automated backups configured
- [ ] Backups run on schedule (daily minimum)
- [ ] Backup restoration tested
- [ ] Backups stored off-site or in cloud
- [ ] Backup retention policy set

---

### Legal and Compliance Testing

#### GDPR Compliance (if applicable)
- [ ] Cookie consent banner displays
- [ ] Cookie consent blocks tracking until accepted
- [ ] Privacy policy explains data collection
- [ ] Users can request data deletion
- [ ] Users can export their data
- [ ] Data processing agreements in place

#### CCPA Compliance (if applicable in California)
- [ ] "Do Not Sell My Info" link in footer
- [ ] Privacy policy explains data rights
- [ ] Users can opt-out of data sale

#### Accessibility Compliance
- [ ] WCAG 2.1 AA standards met
- [ ] Accessibility statement page created

#### Terms and Policies
- [ ] Terms of Service legally reviewed (consult lawyer)
- [ ] Privacy Policy legally compliant
- [ ] Return policy clear (if e-commerce)
- [ ] Shipping policy clear (if e-commerce)

---

### Final Pre-Launch Checks

#### Domain and Hosting
- [ ] Domain name registered and pointing to hosting
- [ ] DNS records configured correctly
- [ ] Hosting plan adequate for traffic expectations
- [ ] Server resources sufficient (disk space, bandwidth)
- [ ] Email hosting configured (if using custom domain emails)

#### Final Content Review
- [ ] All pages reviewed by client
- [ ] All requested changes implemented
- [ ] Client approval received in writing

#### Documentation
- [ ] Client training completed (if CMS)
- [ ] Documentation provided (how to update content, access admin, etc.)
- [ ] Login credentials provided to client (securely)
- [ ] Handoff checklist completed

#### Launch Preparation
- [ ] Maintenance mode page ready (if needed)
- [ ] Launch date and time scheduled
- [ ] Rollback plan prepared in case of issues
- [ ] Stakeholders notified of launch schedule
- [ ] Monitoring tools in place to catch errors post-launch

---

## Post-Launch Testing (Within 48 Hours)

### Immediate Post-Launch Checks
- [ ] Site loads correctly on live domain
- [ ] All pages accessible
- [ ] Forms submit successfully on live site
- [ ] Emails send from live site
- [ ] Payment processing works on live site (if e-commerce)
- [ ] Analytics tracking working on live site
- [ ] No 404 errors reported
- [ ] No server errors (500, 502, 503)
- [ ] SSL certificate active on live domain
- [ ] Redirects from old site working (if applicable)

### Monitoring
- [ ] Check Google Analytics for traffic
- [ ] Check Google Search Console for crawl errors
- [ ] Monitor server logs for errors
- [ ] Monitor uptime (use tool like UptimeRobot)
- [ ] Check site speed on live domain
- [ ] Monitor for broken links

### Client Communication
- [ ] Notify client of successful launch
- [ ] Provide post-launch support contact information
- [ ] Schedule 30-day follow-up review

