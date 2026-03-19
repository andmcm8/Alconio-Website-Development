# deployment-guide.md

# Deployment Guide

## Pre-Deployment Preparation

### 1. Complete Testing Checklist
- Run through entire testing-checklist.md to ensure all items pass
- Document any known issues that will be addressed post-launch
- Get client approval on final site before deployment
- Create backup of development site
- Export database (if applicable)

### 2. Domain and Hosting Setup

#### Domain Registration
- Register domain name with registrar (GoDaddy, Namecheap, Google Domains, etc.)
- Register domain under client's account (client owns domain)
- Enable domain privacy protection
- Set domain to auto-renew to prevent expiration
- Note domain renewal date and set calendar reminder

#### Hosting Account Setup
- Choose hosting provider based on tier:
  - **Standard Tier:** Shared hosting (Bluehost, SiteGround, HostGator)
  - **Premium Tier:** Managed WordPress hosting (WP Engine, Kinsta) or VPS
  - **E-commerce Tier:** VPS or dedicated hosting with e-commerce optimization
- Set up hosting account under client's name/payment info
- Configure hosting plan with adequate resources:
  - Disk space: Minimum 10GB for Standard, 20GB+ for Premium/E-commerce
  - Bandwidth: Unlimited or minimum 100GB/month
  - Email accounts: Minimum 5-10
- Enable automatic backups (daily for Premium/E-commerce, weekly minimum for Standard)
- Note hosting renewal date and set calendar reminder

#### DNS Configuration
- Point domain nameservers to hosting provider nameservers
- Allow 24-48 hours for DNS propagation
- Verify DNS propagation using whatsmydns.net
- Configure DNS records:
  - A record pointing to hosting IP address
  - CNAME for www subdomain pointing to main domain
  - MX records for email (if using custom email)
  - SPF record for email authentication
  - DKIM record for email security
  - TXT record for domain verification (Google, etc.)

### 3. SSL Certificate Installation

#### Obtain SSL Certificate
- Use free Let's Encrypt certificate (most hosting providers offer this)
- Or purchase SSL from hosting provider or certificate authority
- Choose certificate type:
  - Domain Validation (DV) - adequate for most sites
  - Organization Validation (OV) - better for businesses
  - Extended Validation (EV) - best for e-commerce (shows company name in address bar)

#### Install SSL Certificate
- Install certificate through hosting control panel (cPanel, Plesk, custom)
- Verify certificate installed correctly
- Test SSL configuration using SSL Labs SSL Test (aim for A or A+ rating)
- Configure automatic certificate renewal

#### Force HTTPS
- Set up 301 redirects from HTTP to HTTPS
- Update .htaccess (Apache) or nginx.conf (Nginx) to force HTTPS:
```
  # Apache .htaccess
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```
- Enable HSTS header (Strict-Transport-Security)
- Update all internal links to use HTTPS
- Update canonical tags to use HTTPS URLs

### 4. Email Setup

#### Create Email Accounts
- Set up email accounts for client:
  - info@domain.com
  - contact@domain.com
  - support@domain.com (if applicable)
  - admin@domain.com (for admin notifications)
- Configure email clients (Gmail, Outlook) or webmail access
- Test sending and receiving emails

#### Configure Email for Forms
- Set up SMTP service for form emails:
  - Use hosting SMTP (less reliable)
  - Or use SendGrid, Mailgun, or AWS SES (recommended for Premium/E-commerce)
- Configure SPF record in DNS
- Configure DKIM for email authentication
- Test form submissions send emails correctly
- Add business email to safe senders list to avoid spam folder

---

## Deployment Process

### Method 1: Manual FTP/SFTP Deployment (Standard Tier)

#### 1. Prepare Files for Upload
- Minify CSS and JavaScript
- Compress images
- Remove development files (.git, .env.example, README, etc.)
- Update configuration files with production settings
- Update database connection strings (if applicable)
- Update API keys and environment variables

#### 2. Upload Files
- Connect to hosting via FTP/SFTP using FileZilla, Cyberduck, or similar
- Navigate to public_html or www directory (root web directory)
- Upload all website files
- Set correct file permissions:
  - Directories: 755
  - Files: 644
  - Sensitive files (.env): 600
- Verify all files uploaded correctly

#### 3. Configure Server
- Update .htaccess or nginx.conf for:
  - Pretty URLs / URL rewriting
  - 301 redirects (HTTP to HTTPS, www to non-www or vice versa)
  - Gzip compression
  - Browser caching headers
  - Security headers
- Test .htaccess changes don't break site

### Method 2: Git Deployment (Premium/E-commerce Tier)

#### 1. Set Up Git Repository
- Initialize Git repository in development
- Create .gitignore file excluding:
  - .env files
  - node_modules/
  - vendor/ (if using Composer)
  - .DS_Store, Thumbs.db
  - Development files
- Commit all production-ready files
- Push to remote repository (GitHub, GitLab, Bitbucket)

#### 2. Clone Repository on Server
- SSH into hosting server
- Navigate to web root directory
- Clone Git repository
- Run build commands if necessary:
  - npm install (if using Node.js)
  - npm run build (compile assets)
  - composer install (if using PHP dependencies)

#### 3. Set Up Deployment Workflow
- Configure post-receive hook for automatic deployments (optional)
- Or use deployment service like DeployHQ, Buddy, or Netlify
- Test deployment by pushing small change

### Method 3: WordPress Deployment (Premium Tier if using WordPress)

#### 1. Export WordPress Site from Development
- Use All-in-One WP Migration or Duplicator plugin
- Export entire site (database, themes, plugins, uploads)
- Download export file

#### 2. Install WordPress on Production
- Use hosting one-click WordPress installer
- Or manually install WordPress:
  - Download WordPress from wordpress.org
  - Upload to server via FTP
  - Create MySQL database
  - Run WordPress installation

#### 3. Import Development Site
- Install All-in-One WP Migration or Duplicator on production
- Import exported file
- Update site URLs to production domain
- Update permalinks (Settings > Permalinks > Save Changes)

#### 4. Configure WordPress for Production
- Delete default posts and pages
- Install security plugins (Wordfence, iThemes Security)
- Configure automatic backups (UpdraftPlus, BackupBuddy)
- Disable XML-RPC if not needed (security)
- Change default "admin" username
- Limit login attempts
- Enable two-factor authentication for admin

### Method 4: Static Site Deployment (Standard Tier if static HTML/CSS/JS)

#### Option A: Deploy to Netlify
- Connect Git repository to Netlify
- Configure build settings (if using build tools)
- Set environment variables
- Deploy
- Configure custom domain and SSL (automatic with Netlify)
- Enable continuous deployment from Git

#### Option B: Deploy to Vercel
- Import Git repository to Vercel
- Configure build and output settings
- Deploy
- Add custom domain
- SSL configured automatically

#### Option C: Deploy to Traditional Hosting
- Follow Manual FTP/SFTP method above
- Upload HTML, CSS, JS, images to public_html
- Configure server settings

---

## Database Deployment (if applicable)

### 1. Export Development Database
- Use phpMyAdmin, MySQL Workbench, or command line
- Export database as .sql file
- Compress if large (zip or gzip)

### 2. Create Production Database
- Create new database in hosting control panel
- Create database user with strong password
- Grant user all privileges on database
- Note database name, username, password, host

### 3. Import Database to Production
- Use phpMyAdmin or command line to import .sql file
- Verify all tables imported correctly
- Check row counts match development database

### 4. Update Database Connection
- Update configuration file with production database credentials
- Test database connection
- Verify site functions correctly with production database

### 5. Search and Replace URLs (WordPress)
- Use WP-CLI or Better Search Replace plugin
- Replace development URLs with production URLs throughout database
- Clear WordPress cache

---

## Post-Deployment Configuration

### 1. Server Optimization

#### Enable Compression
- Enable Gzip or Brotli compression in server config
- Test compression using giftofspeed.com/gzip-test/

#### Configure Caching
- Set browser cache headers for static assets (1 year)
- Enable server-side caching (if applicable)
- Install caching plugin for WordPress (WP Rocket, W3 Total Cache, WP Super Cache)
- Configure object caching with Redis or Memcached (Premium/E-commerce tier)

#### Enable HTTP/2
- Verify HTTP/2 enabled on server
- Test using tools.keycdn.com/http2-test

#### Optimize PHP (if applicable)
- Update to latest stable PHP version (minimum 7.4, ideally 8.0+)
- Enable OPcache for PHP
- Increase memory_limit (256MB minimum for WordPress)
- Increase max_execution_time if needed

### 2. Security Hardening

#### File Permissions
- Set secure file permissions:
  - Directories: 755
  - Files: 644
  - wp-config.php (if WordPress): 600
  - .env files: 600
- Disable directory listing in server config

#### Security Headers
- Configure security headers in .htaccess or nginx.conf:
  - Content-Security-Policy
  - X-Frame-Options: SAMEORIGIN
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy
- Test headers at securityheaders.com

#### Firewall and Protection
- Enable Web Application Firewall (WAF) if available (Cloudflare, Sucuri)
- Configure mod_security rules (if available)
- Set up DDoS protection (Cloudflare recommended)
- Install malware scanner (if hosting provides)

#### WordPress-Specific Security (if applicable)
- Change database table prefix from default wp_
- Disable file editing in wp-config.php: define('DISALLOW_FILE_EDIT', true);
- Hide WordPress version
- Remove default "admin" user
- Limit login attempts (Limit Login Attempts Reloaded plugin)
- Install security plugin (Wordfence, iThemes Security)

### 3. Performance Optimization

#### Image Optimization
- Verify all images compressed
- Enable lazy loading
- Implement WebP with fallbacks
- Use CDN for images (Cloudflare, CloudFront)

#### Minification
- Minify HTML, CSS, JavaScript
- Combine CSS and JS files (if not using HTTP/2)
- Remove unused CSS (PurgeCSS)

#### CDN Setup (Premium/E-commerce tier)
- Sign up for CDN service (Cloudflare free tier, CloudFront, KeyCDN)
- Configure CDN to cache static assets
- Update asset URLs to use CDN
- Test CDN serving assets correctly

#### Database Optimization (if applicable)
- Optimize database tables
- Remove post revisions, spam comments, transients (if WordPress)
- Set up regular database optimization schedule

---

## SEO Configuration Post-Deployment

### 1. Google Search Console Setup
- Verify site ownership in Google Search Console
  - HTML file upload method
  - Or DNS TXT record method
  - Or Google Analytics method
- Submit XML sitemap
- Request indexing for homepage and key pages
- Set preferred domain (www or non-www)
- Set geographic target (if local business)

### 2. Google Analytics Setup
- Create Google Analytics 4 property
- Install GA4 tracking code on all pages
- Verify tracking working in Real-Time report
- Set up goals and conversions
- Configure enhanced e-commerce (if e-commerce site)
- Exclude internal traffic (IP exclusion filter)
- Link Google Analytics to Search Console

### 3. Google Business Profile (if local business)
- Claim Google Business Profile listing
- Verify business (postcard, phone, email)
- Complete all profile information
- Add photos of business
- Set business hours
- Add products/services
- Encourage customer reviews

### 4. Bing Webmaster Tools
- Verify site in Bing Webmaster Tools
- Submit XML sitemap
- Verify crawling working correctly

### 5. Sitemap and Robots.txt
- Verify XML sitemap accessible at /sitemap.xml
- Verify robots.txt accessible at /robots.txt
- Confirm robots.txt references sitemap
- Confirm robots.txt not blocking important pages

---

## Analytics and Tracking Setup

### 1. Install Analytics Code
- Google Analytics 4 tracking code in <head> of all pages
- Configure cookie consent integration (GDPR/CCPA compliance)
- Set up custom events for form submissions, button clicks, etc.

### 2. Set Up Goals/Conversions
- Contact form submissions
- Phone number clicks
- Email clicks
- Newsletter signups
- Product purchases (e-commerce)
- Account registrations

### 3. E-commerce Tracking (if applicable)
- Enhanced e-commerce tracking in Google Analytics
- Transaction tracking
- Product impression tracking
- Add to cart events
- Checkout step tracking

### 4. Other Tracking (if applicable)
- Facebook Pixel installation and verification
- Google Tag Manager setup (optional but recommended)
- Heatmap tracking (Hotjar, Crazy Egg)
- Conversion tracking for ads (Google Ads, Facebook Ads)

---

## Email and Communication Testing

### 1. Test All Forms Live
- Submit contact form
- Verify email received by business
- Verify auto-reply received by customer
- Check emails not going to spam
- Test all other forms (newsletter, quote request, etc.)

### 2. Test E-commerce Emails (if applicable)
- Place test order
- Verify order confirmation email
- Verify admin notification email
- Test shipping notification email
- Test password reset email
- Test account creation email

### 3. Configure Email Forwarding
- Set up email forwarding if needed
- Configure catch-all email (optional)
- Test forwarding rules

---

## Backup System Setup

### 1. Configure Automated Backups
- Set up daily backups (minimum weekly for Standard tier)
- Include database and files in backup
- Store backups off-site (cloud storage, different server)
- Set backup retention policy (30 days minimum)

### 2. Backup Methods

#### Hosting Backup (easiest)
- Enable automatic backups in hosting control panel
- Verify backups running on schedule
- Test backup restoration process

#### WordPress Backup Plugin (if WordPress)
- Install UpdraftPlus, BackupBuddy, or similar
- Configure schedule (daily recommended)
- Set remote storage (Dropbox, Google Drive, Amazon S3)
- Test restoration process

#### Manual Backup Script
- Create backup script (bash, PHP)
- Schedule via cron job
- Test script execution
- Verify backups created correctly

### 3. Test Backup Restoration
- Download backup file
- Restore to staging environment
- Verify all functionality works
- Document restoration process

---

## Monitoring and Maintenance Setup

### 1. Uptime Monitoring
- Set up uptime monitor (UptimeRobot, Pingdom, StatusCake)
- Configure alerts for downtime (email, SMS)
- Set check interval (5 minutes recommended)
- Monitor SSL certificate expiration

### 2. Performance Monitoring
- Set up Google PageSpeed monitoring
- Monitor Core Web Vitals in Google Search Console
- Set up performance budget alerts
- Use GTmetrix for regular performance checks

### 3. Security Monitoring
- Enable security scanning (Sucuri, Wordfence)
- Set up alerts for security issues
- Monitor for malware and vulnerabilities
- Enable login attempt monitoring

### 4. Error Logging
- Configure error logging on server
- Set up error notifications for critical errors
- Regularly review error logs
- Use tools like Sentry or Bugsnag for error tracking

---

## Client Handoff

### 1. Training
- Provide CMS training (if Premium/E-commerce tier)
- Share training videos and documentation
- Walk through content update process
- Demonstrate form submission retrieval
- Show analytics basics
- Answer client questions

### 2. Documentation Delivery
- Provide all login credentials (securely via LastPass, 1Password)
- Include documentation:
  - How to update content
  - How to access/download form submissions
  - How to view analytics
  - Contact information for support
  - Domain and hosting renewal dates
  - Email account information
- Create troubleshooting guide for common issues

### 3. Access and Credentials
Provide client with:
- Website admin login
- Hosting control panel login
- Domain registrar login
- Email account logins
- FTP/SFTP credentials
- Database credentials (if applicable)
- Google Analytics access
- Google Search Console access
- Social media account logins (if created)

### 4. Renewal Information
- Document all renewal dates:
  - Domain name (annually)
  - Hosting (monthly/annually)
  - SSL certificate (usually auto-renews)
  - Any premium plugins or services
- Set up calendar reminders for renewals
- Provide client with renewal responsibility

---

## Launch Checklist

### 24 Hours Before Launch
- [ ] Complete final testing checklist
- [ ] Get final client approval
- [ ] Create full backup of development site
- [ ] Prepare rollback plan
- [ ] Notify stakeholders of launch schedule
- [ ] Verify DNS settings correct
- [ ] Clear browser cache for final testing

### Launch Day
- [ ] Upload/deploy site to production
- [ ] Import database (if applicable)
- [ ] Update configuration files
- [ ] Test all critical functionality
- [ ] Verify SSL certificate active
- [ ] Submit sitemap to Google and Bing
- [ ] Monitor for errors in logs
- [ ] Test form submissions
- [ ] Test e-commerce checkout (if applicable)
- [ ] Verify analytics tracking

### Immediately After Launch (within 1 hour)
- [ ] Test site on multiple devices and browsers
- [ ] Verify all pages loading correctly
- [ ] Check for broken links
- [ ] Test forms submit successfully
- [ ] Verify emails send from live site
- [ ] Check analytics recording traffic
- [ ] Monitor server resources

### Within 24 Hours of Launch
- [ ] Monitor Google Search Console for crawl errors
- [ ] Check analytics for traffic patterns
- [ ] Review server error logs
- [ ] Test all interactive features
- [ ] Verify contact forms working
- [ ] Verify payment processing (if e-commerce)
- [ ] Check for any customer-reported issues

### Within 1 Week of Launch
- [ ] Monitor site performance
- [ ] Check Google Analytics traffic sources
- [ ] Review error logs
- [ ] Monitor uptime
- [ ] Check for any SEO issues in Search Console
- [ ] Gather initial user feedback
- [ ] Schedule 30-day post-launch review with client

---

## Post-Launch Support

### 1. Bug Fixes (30 days included)
- Monitor for bug reports from client or users
- Fix any critical bugs immediately
- Address non-critical bugs within 48 hours
- Document all fixes

### 2. Ongoing Maintenance (optional paid service)
- Monthly security updates
- Plugin/theme updates (if WordPress)
- Performance optimization
- Content updates (if client requests)
- Quarterly performance reviews
- SEO monitoring and adjustments

### 3. Revisions
- One round of revisions for Standard tier
- Two rounds of revisions for Premium/E-commerce tiers
- Set revision deadline (typically 2 weeks after launch)
- Document all requested changes
- Implement approved changes
- Get final client approval

---

## Rollback Procedure (if issues occur)

### If Critical Issues After Launch
1. Immediately switch to maintenance mode page
2. Notify client and stakeholders
3. Restore from backup:
   - Restore previous site files
   - Restore previous database
   - Clear all caches
4. Verify restored site works correctly
5. Investigate issue in development environment
6. Fix issue
7. Test thoroughly
8. Re-deploy when issue resolved

### Maintenance Mode Page
- Create simple HTML page: "We're performing maintenance. Back soon!"
- Include business contact information
- Set 503 status code (Service Temporarily Unavailable)
- Add Retry-After header
- Keep page lightweight and fast

---

## Long-Term Maintenance Plan

### Monthly Tasks
- Review analytics and traffic reports
- Check for security vulnerabilities
- Update plugins, themes, dependencies
- Test all forms and interactive features
- Review error logs
- Monitor uptime statistics
- Check backup system functioning

### Quarterly Tasks
- Review and optimize site performance
- Update content for freshness
- Review and update SEO
- Test backup restoration
- Review security logs
- Conduct accessibility audit
- Check for broken links

### Annually Tasks
- Renew domain registration
- Renew hosting (if annual plan)
- Review and renew SSL certificate (if not auto-renewing)
- Full site audit and redesign consideration
- Review and update all documentation
- Comprehensive security audit
- Performance benchmarking

---

## Emergency Contacts and Resources

### Important Contacts
- Hosting support phone and email
- Domain registrar support
- Payment processor support (if e-commerce)
- Email service support
- Your support contact information for client

### Useful Resources
- Hosting control panel URL
- Domain management URL
- Google Analytics URL
- Google Search Console URL
- WordPress admin URL (if applicable)
- FTP/SFTP connection details
- Database management URL (phpMyAdmin)

### Documentation
- Keep copies of all configuration files
- Maintain deployment documentation
- Document any custom code or integrations
- Keep backup of all login credentials (encrypted)

