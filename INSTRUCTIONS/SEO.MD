# seo.md

# SEO Implementation Instructions

## Meta Tags

### Title Tags
- Create unique title tag for every page
- Keep length between 50-60 characters (512 pixels max width)
- Include primary keyword near the beginning
- Format: "Primary Keyword | Secondary Keyword | Brand Name"
- Homepage format: "Brand Name | What You Do | Location (if local business)"
- Avoid keyword stuffing and make titles natural and compelling
- Don't duplicate title tags across pages

### Meta Descriptions
- Write unique meta description for every page
- Keep length between 150-160 characters (920 pixels max width)
- Include primary and secondary keywords naturally
- Add compelling call-to-action to encourage clicks
- Accurately summarize page content
- Avoid duplicate meta descriptions across pages
- Use active voice and actionable language

### Additional Meta Tags
- Meta charset: UTF-8 for proper character encoding
- Viewport meta tag for responsive design: width=device-width, initial-scale=1
- Meta robots: index, follow for pages to be indexed; noindex, nofollow for private pages
- Canonical tag on every page to prevent duplicate content issues
- Language meta tag if serving multiple languages: lang attribute in HTML tag

---

## Open Graph and Social Media Tags

### Open Graph Meta Tags (Facebook, LinkedIn)
- og:title - Title of the content (same as or similar to page title, max 60 characters)
- og:description - Brief description (max 200 characters)
- og:image - Image URL (1200x630px recommended, minimum 600x315px)
- og:url - Canonical URL of the page
- og:type - Content type (website, article, product, etc.)
- og:site_name - Name of the website
- og:locale - Language and region (e.g., en_US)

### Twitter Card Tags
- twitter:card - Card type (summary, summary_large_image, player, app)
- twitter:title - Title (max 70 characters)
- twitter:description - Description (max 200 characters)
- twitter:image - Image URL (1200x628px for large image summary card)
- twitter:site - @username of website's Twitter account
- twitter:creator - @username of content creator

### Image Requirements for Social Sharing
- Minimum size: 600x315px
- Recommended size: 1200x630px (1.91:1 aspect ratio)
- Maximum file size: 8MB for Facebook, 5MB for Twitter
- Supported formats: JPG, PNG, WebP, GIF
- Include text overlay that's readable at small sizes
- Test appearance using Facebook Debugger and Twitter Card Validator

---

## Structured Data (Schema Markup)

### Implementation Format
- Use JSON-LD format (Google's preferred method)
- Place schema markup in <script type="application/ld+json"> tag in <head> section
- Validate all structured data using Google's Rich Results Test tool
- Test in Google Search Console's Rich Results report

### Local Business Schema (for service businesses)
- @type: LocalBusiness (or specific type like Restaurant, Hotel, Store)
- name: Official business name
- image: Logo or primary business image URL
- address: Full physical address with streetAddress, addressLocality, addressRegion, postalCode, addressCountry
- geo: Geographic coordinates (latitude and longitude)
- url: Website URL
- telephone: Phone number in international format
- priceRange: Price indicator (e.g., $$)
- openingHoursSpecification: Days and hours of operation
- sameAs: Links to social media profiles

### Organization Schema
- @type: Organization
- name: Company name
- url: Website URL
- logo: Logo image URL (recommended size: 112x112px minimum)
- contactPoint: Customer service contact information
- sameAs: Array of social media profile URLs
- description: Brief company description

### Product Schema (for e-commerce)
- @type: Product
- name: Product name
- image: Array of product image URLs
- description: Product description
- sku: Stock Keeping Unit identifier
- brand: Brand name or organization
- offers: Pricing, availability, and seller information
  - price: Numerical price value
  - priceCurrency: Three-letter currency code (USD, EUR, etc.)
  - availability: In stock status (InStock, OutOfStock, PreOrder)
  - url: Product page URL
- aggregateRating: Average rating and review count (if applicable)
- review: Individual customer reviews (if applicable)

### Article Schema (for blog posts)
- @type: Article or BlogPosting
- headline: Article title (max 110 characters)
- image: Featured image URL (multiple sizes recommended)
- datePublished: ISO 8601 format publication date
- dateModified: ISO 8601 format last modified date
- author: Author name or Organization
- publisher: Organization with name and logo
- description: Article summary or excerpt
- mainEntityOfPage: URL of the article page

### Breadcrumb Schema
- @type: BreadcrumbList
- itemListElement: Array of breadcrumb items
  - @type: ListItem
  - position: Numerical position in breadcrumb trail (starting at 1)
  - name: Display name of breadcrumb
  - item: URL of the page

### FAQ Schema
- @type: FAQPage
- mainEntity: Array of Question objects
  - @type: Question
  - name: The question text
  - acceptedAnswer: Answer object
    - @type: Answer
    - text: The answer text (HTML allowed)

### Review and Rating Schema
- @type: Review
- itemReviewed: The item being reviewed (Product, Organization, etc.)
- author: Reviewer name or organization
- reviewRating: Rating object
  - @type: Rating
  - ratingValue: Numerical rating (e.g., 4.5)
  - bestRating: Maximum possible rating (e.g., 5)
  - worstRating: Minimum possible rating (e.g., 1)
- reviewBody: Full text of the review

### Aggregate Rating Schema
- @type: AggregateRating
- ratingValue: Average rating value
- reviewCount: Total number of reviews
- bestRating: Maximum rating (typically 5)
- worstRating: Minimum rating (typically 1)

---

## Technical SEO

### URL Structure
- Use short, descriptive, keyword-rich URLs
- Use hyphens to separate words (not underscores or spaces)
- Use lowercase letters only
- Remove stop words (a, and, or, but, the, of) unless part of brand name
- Create logical hierarchy: domain.com/category/subcategory/page
- Avoid parameters when possible (?id=123); use clean URLs
- Use 301 redirects for any changed URLs to preserve SEO value
- Avoid more than 3-4 levels deep in URL structure

### XML Sitemap
- Generate XML sitemap listing all important pages
- Include only indexable pages (exclude admin, duplicate, private pages)
- Update sitemap automatically when content changes
- Submit sitemap to Google Search Console and Bing Webmaster Tools
- Include lastmod date for each URL
- Split large sitemaps (over 50,000 URLs) into multiple files
- Reference sitemap location in robots.txt file
- Use sitemap index file if using multiple sitemaps

### Robots.txt File
- Create robots.txt file in root directory
- Allow search engines to crawl important pages: User-agent: * / Allow: /
- Disallow private or duplicate content: Disallow: /admin/ /private/ /checkout/
- Include sitemap location: Sitemap: https://domain.com/sitemap.xml
- Don't block CSS or JavaScript files (needed for rendering)
- Test robots.txt using Google Search Console robots.txt tester

### Canonical Tags
- Add canonical tag to every page pointing to the preferred version
- Self-referencing canonical on original pages
- Point duplicate/similar content to canonical version
- Use absolute URLs in canonical tags (https://domain.com/page)
- Ensure canonical URLs are indexable (not blocked by robots.txt)
- Consistent with hreflang tags if using multiple languages

### Pagination and Infinite Scroll
- Implement rel="next" and rel="prev" for paginated content (deprecated but still useful)
- Ensure each page in series is indexable with unique content
- Use canonical tags appropriately (self-referencing or to view-all page)
- For infinite scroll, implement pagination URLs and history API updates
- Provide traditional pagination links as fallback

---

## On-Page SEO Elements

### Heading Structure
- One H1 tag per page containing primary keyword
- H1 should be descriptive and match page title closely
- Use H2 tags for main section headings (3-5 per page)
- Use H3-H6 for subsections in logical hierarchy
- Don't skip heading levels (H1 → H2 → H3, not H1 → H3)
- Include keywords naturally in headings without stuffing
- Make headings descriptive and useful for users

### Content Optimization
- Include primary keyword in first 100 words of content
- Use keywords naturally throughout content (avoid keyword stuffing)
- Target keyword density of 1-2% (natural usage, not forced)
- Use semantic keywords and related terms (LSI keywords)
- Write for users first, search engines second
- Minimum content length: 300 words for standard pages, 1000+ for blog posts/guides
- Use short paragraphs (3-4 sentences maximum) for readability
- Include bullet points and numbered lists for scanability
- Bold or italicize important terms sparingly for emphasis

### Internal Linking
- Link from high-authority pages to important pages
- Use descriptive anchor text (not "click here" or "read more")
- Include 3-5 relevant internal links per page
- Link to related content to keep users engaged
- Create logical site hierarchy with internal linking
- Link from new content to older related content
- Use breadcrumb navigation for hierarchical sites
- Fix all broken internal links regularly

### Image SEO
- Use descriptive filenames: keyword-description.jpg (not IMG1234.jpg)
- Write descriptive alt text for every image (include keywords naturally)
- Keep alt text concise (125 characters maximum)
- Don't start alt text with "image of" or "picture of"
- Use title attribute for additional context (optional)
- Specify image dimensions in HTML to prevent layout shift
- Compress images for fast loading (important ranking factor)
- Use responsive images with srcset for mobile optimization

---

## Mobile SEO

### Mobile-Friendly Requirements
- Implement responsive design that adapts to all screen sizes
- Use mobile-friendly navigation (hamburger menu, touch-friendly)
- Ensure text is readable without zooming (minimum 16px font size)
- Make tap targets large enough (minimum 48x48px)
- Avoid mobile-specific pop-ups that block content
- Test mobile usability in Google Search Console
- Ensure fast loading on mobile networks (3G/4G)

### Mobile-Specific Optimizations
- Prioritize above-the-fold content loading on mobile
- Minimize redirects on mobile (each redirect adds latency)
- Use appropriate viewport meta tag
- Avoid Flash and other unsupported mobile technologies
- Implement AMP (Accelerated Mobile Pages) for news/blog content (optional)
- Test on actual mobile devices, not just emulators

---

## Performance for SEO

### Page Speed Optimization
- Achieve Google PageSpeed score of 90+ (mobile and desktop)
- Optimize Core Web Vitals (LCP, FID, CLS) as ranking factors
- Minimize server response time (TTFB under 200ms)
- Enable compression (gzip or Brotli)
- Minify CSS, JavaScript, and HTML
- Optimize images (compress, lazy load, use modern formats)
- Leverage browser caching
- Use CDN for faster content delivery
- Reduce number of HTTP requests

### HTTPS and Security
- Implement SSL certificate (HTTPS is ranking factor)
- Force HTTPS redirects from HTTP
- Ensure no mixed content warnings
- Keep SSL certificate up to date
- Use HSTS header for security

---

## Local SEO (if applicable)

### Google Business Profile
- Claim and verify Google Business Profile listing
- Ensure NAP (Name, Address, Phone) consistency across all platforms
- Choose accurate business categories
- Add high-quality photos of business, products, services
- Collect and respond to customer reviews
- Post regular updates and offers
- Answer questions in Q&A section
- Add business hours, services, and attributes

### Local Citations
- Create consistent NAP citations on local directories (Yelp, Yellow Pages, etc.)
- Submit to industry-specific directories
- Ensure consistency in business name formatting across all citations
- Monitor and update citations regularly

### Local Content and Keywords
- Include city/region names in titles, headings, and content
- Create location-specific pages for multiple locations
- Add local landmarks and neighborhood references in content
- Create content about local events, news, or community involvement

---

## Monitoring and Maintenance

### Google Search Console
- Verify site ownership and submit sitemap
- Monitor index coverage and fix any indexing errors
- Check mobile usability issues
- Track search performance (queries, clicks, impressions, CTR)
- Monitor Core Web Vitals performance
- Set up email alerts for critical issues
- Review manual actions and security issues
- Use URL inspection tool to test specific pages

### Regular SEO Audits
- Check for broken links monthly (internal and external)
- Monitor keyword rankings for target terms
- Review and update meta tags quarterly
- Audit site structure and internal linking
- Check for duplicate content issues
- Monitor backlink profile and disavow spammy links
- Review and update old content to keep it fresh
- Track competitor SEO strategies and rankings

### Analytics Tracking
- Set up Google Analytics to track organic traffic
- Monitor bounce rate and time on page for SEO pages
- Track conversions from organic search traffic
- Set up goal tracking for important user actions
- Analyze user behavior flow from organic search
- Create custom reports for SEO performance

---

## Content Strategy for SEO

### Keyword Research
- Identify primary and secondary keywords for each page
- Use tools: Google Keyword Planner, Ahrefs, SEMrush, Ubersuggest
- Target long-tail keywords (3-5 words) for less competition
- Consider search intent (informational, navigational, transactional)
- Analyze competitor keywords and content gaps
- Group keywords by topic for content clusters

### Content Planning
- Create pillar content (comprehensive guides on main topics)
- Develop cluster content linking to pillar pages
- Update existing content regularly to maintain freshness
- Target featured snippets with structured content (lists, tables, definitions)
- Create FAQ sections targeting "people also ask" queries
- Develop diverse content types (articles, videos, infographics)

---

## E-commerce SEO (if applicable)

### Product Pages
- Unique product descriptions (never use manufacturer descriptions)
- Include product schema markup with price, availability, reviews
- Optimize product images with descriptive filenames and alt text
- Add customer reviews and ratings (good for SEO and conversions)
- Use breadcrumb navigation
- Include related products and cross-selling
- Create unique category descriptions (avoid thin content)

### Category and Filter Pages
- Make category pages indexable with unique content
- Add canonical tags for filtered/sorted pages pointing to main category
- Use rel="prev" and rel="next" for paginated categories
- Create unique descriptions for category pages
- Avoid duplicate content from filters creating multiple URLs

