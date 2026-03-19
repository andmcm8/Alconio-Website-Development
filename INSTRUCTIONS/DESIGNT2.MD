# PREMIUM WEBSITE DESIGN INSTRUCTIONS (TIER 2)

## OVERVIEW
This document provides comprehensive instructions for creating a **Premium Tier Website** using Google Stitch. The Premium tier builds upon the Standard tier foundation, adding CMS capability, analytics, light e-commerce (up to 10 products), advanced functionality, third-party integrations, and user account systems. Premium websites are designed for businesses selling products/services and advanced service platforms requiring more sophisticated features.

**CRITICAL**: Premium tier represents the BEST possible design and functionality. This is your showcase tier - make it absolutely exceptional.

---

## SECTION 1: PREMIUM TIER SCOPE & CAPABILITIES

### 1.1 What Distinguishes Premium from Standard

**Additional Features:**
- ✅ **CMS Integration** - Client can update content themselves (Headless CMS)
- ✅ **Analytics Integration** - Google Analytics 4, heatmaps, conversion tracking
- ✅ **Light E-commerce** - Up to 10 products with payment processing
- ✅ **Complex Functionality** - Booking systems, member portals, custom databases
- ✅ **Third-Party Integrations** - CRM (HubSpot, Salesify), Email Marketing (Mailchimp, ConvertKit)
- ✅ **User Account Systems** - Login, registration, profile management, password reset
- ✅ **Advanced SEO** - Schema markup, advanced meta tags, sitemap automation
- ✅ **2 Rounds of Revisions** - More refinement cycles

**Page Count:**
- Typically 10-15 pages (vs 7-10 for Standard)
- More complex page structures
- Dynamic content pages (blog, products, resources)

---

### 1.2 Premium Design Philosophy

**Core Principles:**

**1. Sophistication Over Simplicity**
- More refined animations and interactions
- Premium typography choices
- Advanced layouts (asymmetric grids, overlapping sections)
- Subtle micro-interactions everywhere

**2. User Experience Excellence**
- Intuitive navigation with smart defaults
- Anticipatory design (predicting user needs)
- Delightful surprise moments
- Zero friction in conversions

**3. Technical Excellence**
- Blazing fast performance (Lighthouse 95+)
- Flawless responsive design across ALL devices
- Progressive enhancement
- Accessibility beyond WCAG AA (aim for AAA where possible)

---

## SECTION 2: GOOGLE STITCH WORKFLOW (PREMIUM)

### 2.1 Initial Setup - Same as Standard with Additions

**Follow all Standard Tier setup steps (Section 2 of Standard instructions), PLUS:**

#### **Additional Design System Elements**

When using the `design-md` skill for Premium projects, ensure the DESIGN.md includes:

**Enhanced Design Tokens:**
```markdown
## Interactive States
- **Hover Effects**: Subtle lift (translateY: -2px) + shadow increase
- **Active States**: Slight scale down (0.98)
- **Focus States**: 2px outline with brand color
- **Disabled States**: 50% opacity + no pointer events

## Micro-interactions
- **Button Clicks**: Ripple effect
- **Form Success**: Checkmark animation
- **Loading States**: Skeleton screens (not spinners)
- **Scroll Progress**: Thin progress bar at top

## Advanced Spacing
- **Section Padding**: 80-120px (desktop), 40-60px (mobile)
- **Component Spacing**: 40px between major components
- **Grid Gaps**: 32px standard, 24px compact

## Premium Typography
- **Display Text**: [Font], ExtraBold (800), 56-72px
- **Hero Subheadings**: [Font], Medium (500), 20-24px
- **Eyebrow Text**: [Font], SemiBold (600), 12-14px, uppercase, letter-spacing: 0.1em
```

---

### 2.2 Creating Premium Pages

**Typical Premium Page Structure (10-15 pages):**

**Core Pages:**
1. **Homepage** - Advanced hero, dynamic content sections, social proof
2. **About** - Story-driven, team bios with photos, values showcase
3. **Services/Solutions** - Detailed service pages (separate page per service)
4. **Portfolio/Case Studies** - Filterable portfolio, detailed case study pages
5. **Shop/Products** - Product catalog (up to 10 items), individual product pages
6. **Blog/Resources** - Article listing, individual blog post template, categories
7. **Booking/Scheduling** - Calendar integration, appointment booking
8. **Member Portal** - User dashboard, account settings, content access
9. **Contact** - Multi-step contact form, location map, live chat integration
10. **FAQ** - Searchable, categorized questions
11. **Privacy Policy** - Legal compliance
12. **Terms of Service** - Legal compliance
13. **Careers** - Job listings, application forms
14. **Press/Media** - Press releases, media kit downloads
15. **(Optional)** Custom pages based on client needs

---

### 2.3 Premium Page Creation Best Practices

**For EACH premium page, follow this enhanced workflow:**

#### **Step 1: Strategic Planning**
Before creating the page, ask:
- What is the PRIMARY goal of this page? (conversion, information, engagement)
- What user journey does this support?
- What's the next logical step after this page?
- What data/content needs to be dynamic vs. static?

#### **Step 2: Enhanced Prompt Engineering**
```
Use the enhance-prompt skill with additional context:

"Enhance this prompt for a PREMIUM Stitch design:
Create a [PAGE_NAME] for [business type] that:
- Converts [specific user action]
- Showcases [premium features]
- Integrates with [CMS/third-party tool]
- Includes [advanced functionality]
- Feels [specific mood/emotion]
- References DESIGN.md for consistency
- Uses sophisticated layout techniques (asymmetry, overlapping sections, z-index layering)
"
```

#### **Step 3: Generate with Context**
```
Use generate_screen_from_text with full context:

"Using the DESIGN.md design system and the extract_design_context from [existing premium screen], generate a [PAGE_NAME] that:

LAYOUT:
- [Specific layout description]
- [Section breakdown]

FUNCTIONALITY:
- [Interactive elements]
- [Dynamic content areas]

DESIGN DETAILS:
- [Specific design treatments]
- [Premium touches]

CONTENT:
- [Actual content, not placeholders]
- [Real data examples]
"
```

#### **Step 4: Validate Premium Quality**

**Premium Quality Checklist:**
- [ ] Does this feel MORE sophisticated than Standard tier?
- [ ] Are there delightful micro-interactions?
- [ ] Is the layout more interesting than a simple grid?
- [ ] Does it showcase advanced functionality clearly?
- [ ] Would I pay premium price for this design?

---

## SECTION 3: CMS INTEGRATION

### 3.1 Choosing the Right CMS

**Recommended CMS Options for Premium Tier:**

**Option 1: Sanity.io** (Recommended)
- ✅ Excellent for React components
- ✅ Real-time collaboration
- ✅ Customizable content models
- ✅ Free tier: 3 users, unlimited documents
- ✅ GraphQL API

**Option 2: Contentful**
- ✅ User-friendly interface
- ✅ Powerful content modeling
- ✅ Free tier: 1 user, 25,000 records
- ✅ REST and GraphQL APIs

**Option 3: Strapi** (Self-hosted)
- ✅ Open source
- ✅ Full control
- ✅ No vendor lock-in
- ⚠️ Requires hosting

**Option 4: Payload CMS**
- ✅ Modern, TypeScript-based
- ✅ Code-first approach
- ✅ Self-hosted or cloud
- ✅ Excellent for developers

---

### 3.2 Converting Stitch to CMS-Powered React

**Process:**

#### **Step 1: Convert Stitch HTML to React Components**
```
Use the react:components skill:

"Convert the [PAGE_NAME] screen from Stitch project [PROJECT_ID] to a React component system with:
- Proper component hierarchy
- Reusable UI components
- Props for dynamic content
- TypeScript types
- Styled components or Tailwind
"
```

#### **Step 2: Create Content Models**

**Example: Blog Post Content Model (Sanity)**
```javascript
// schemas/blogPost.js
export default {
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' }
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}]
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}]
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime'
    },
    {
      name: 'body',
      title: 'Body',
      type: 'blockContent'
    }
  ]
}
```

#### **Step 3: Connect React Components to CMS**

**Example: Fetching Blog Posts**
```javascript
// pages/blog.jsx
import { client } from '../lib/sanity'

export async function getStaticProps() {
  const posts = await client.fetch(`
    *[_type == "blogPost"] | order(publishedAt desc) {
      title,
      slug,
      author->{name, image},
      mainImage,
      categories[]->{title},
      publishedAt,
      "excerpt": array::join(string::split((pt::text(body)), "")[0..255], "") + "..."
    }
  `)
  
  return { props: { posts }, revalidate: 60 }
}

export default function Blog({ posts }) {
  return (
    <div className="blog-container">
      {posts.map(post => (
        <BlogCard key={post.slug.current} post={post} />
      ))}
    </div>
  )
}
```

#### **Step 4: Build Client CMS Dashboard**

**What clients can edit:**
- ✅ Blog posts, articles, news
- ✅ Product information (for light e-commerce)
- ✅ Team member bios
- ✅ Testimonials
- ✅ Service descriptions
- ✅ Images and media
- ✅ SEO meta tags

**What clients CANNOT edit:**
- ❌ Design/layout (preserve your design system)
- ❌ Navigation structure (without guidance)
- ❌ Code/functionality
- ❌ Critical pages (homepage hero usually locked)

---

### 3.3 CMS Training Documentation

**Create a CLIENT-CMS-GUIDE.md:**
```markdown
# CMS User Guide - [Client Name]

## Accessing the CMS
1. Go to: [CMS_URL]
2. Login with: [credentials]

## Adding a New Blog Post
1. Click "Blog Posts" in sidebar
2. Click "Create New"
3. Fill in:
   - Title (required)
   - Author (select from dropdown)
   - Categories (select relevant)
   - Main Image (click to upload)
   - Content (use the rich text editor)
4. Click "Publish"

## Editing Existing Content
1. Navigate to content type
2. Click on item to edit
3. Make changes
4. Click "Update"
5. Changes appear on website within 1 minute

## Image Guidelines
- Minimum size: 1200px wide
- Formats: JPG, PNG, WebP
- Max file size: 2MB (compress before uploading)
- Use descriptive filenames

## Best Practices
- Preview before publishing
- Don't delete content (unpublish instead)
- Keep text concise
- Use headers for readability
- Add alt text to all images

## Need Help?
Contact: [your support email/phone]
```

---

## SECTION 4: LIGHT E-COMMERCE INTEGRATION (UP TO 10 PRODUCTS)

### 4.1 E-commerce Platform Selection

**Recommended for Light E-commerce:**

**Option 1: Stripe Payment Links + Simple Product Pages** (Easiest)
- ✅ No complicated setup
- ✅ Stripe handles checkout
- ✅ PCI compliance automatic
- ✅ Works with static sites
- ⚠️ Limited customization

**Option 2: Snipcart** (Recommended)
- ✅ Add-to-cart functionality
- ✅ Shopping cart overlay
- ✅ Works with any HTML
- ✅ Subscription support
- 💰 2% transaction fee + Stripe fees

**Option 3: Medusa** (Advanced)
- ✅ Open source
- ✅ Headless commerce
- ✅ Full control
- ⚠️ Requires more setup

**For Premium Tier with <10 products: Use Snipcart**

---

### 4.2 Implementing Snipcart with Stitch

#### **Step 1: Add Snipcart to HTML**
```html
<!-- Add to <head> of all pages -->
<link rel="stylesheet" href="https://cdn.snipcart.com/themes/v3.7.1/default/snipcart.css" />

<!-- Add before </body> -->
<div id="snipcart" data-api-key="YOUR_PUBLIC_API_KEY" hidden></div>
<script src="https://cdn.snipcart.com/themes/v3.7.1/default/snipcart.js"></script>
```

#### **Step 2: Create Product Pages with Stitch**

**Prompt for Stitch:**
```
"Generate a premium product page for [PRODUCT_NAME] with:

LAYOUT:
- Hero section with large product image gallery (4-6 images, zoom on hover)
- Product title, price, and short description
- Detailed product information tabs (Description, Specifications, Reviews, Shipping)
- Add to Cart button (prominent, premium styling)
- Related products carousel at bottom

DESIGN:
- Clean, minimal product photography focus
- Generous whitespace
- Trust indicators (secure checkout badges, money-back guarantee)
- Social proof (customer reviews, ratings)
- Sticky "Add to Cart" on mobile scroll

FUNCTIONALITY:
- Image gallery with thumbnails
- Quantity selector
- Size/variant selector (if applicable)
- Save to wishlist
- Share buttons

Use DESIGN.md for consistency.
"
```

#### **Step 3: Add Snipcart Buy Buttons**

**HTML structure:**
```html
<button
  class="snipcart-add-item premium-buy-button"
  data-item-id="product-001"
  data-item-price="49.99"
  data-item-url="/products/product-001"
  data-item-name="Premium Product Name"
  data-item-description="Short product description"
  data-item-image="/assets/images/products/product-001.jpg"
  data-item-categories="category1|category2"
  data-item-max-quantity="10"
>
  Add to Cart - $49.99
</button>
```

**Premium styling for buy button:**
```css
.premium-buy-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 48px;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.premium-buy-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.premium-buy-button:active {
  transform: translateY(0);
}
```

#### **Step 4: Shopping Cart Integration**

**Cart button in navigation:**
```html
<button class="snipcart-checkout premium-cart-button">
  <svg><!-- Cart icon --></svg>
  <span class="snipcart-items-count"></span>
</button>
```

Snipcart automatically:
- ✅ Tracks cart items
- ✅ Updates count badge
- ✅ Shows cart overlay
- ✅ Handles checkout
- ✅ Processes payments
- ✅ Sends confirmation emails

---

### 4.3 Product Management in CMS

**Create Product Content Model (Sanity example):**
```javascript
// schemas/product.js
export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' }
    },
    {
      name: 'sku',
      title: 'SKU',
      type: 'string'
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: Rule => Rule.required().positive()
    },
    {
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      validation: Rule => Rule.required().min(1).max(6)
    },
    {
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3
    },
    {
      name: 'description',
      title: 'Full Description',
      type: 'blockContent'
    },
    {
      name: 'specifications',
      title: 'Specifications',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {name: 'label', type: 'string'},
          {name: 'value', type: 'string'}
        ]
      }]
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'productCategory'}]}]
    },
    {
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'stockQuantity',
      title: 'Stock Quantity',
      type: 'number'
    },
    {
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      initialValue: false
    }
  ]
}
```

**Client can update:**
- Product names and descriptions
- Prices
- Images
- Stock status
- Categories

---

### 4.4 Premium E-commerce Pages

**Required E-commerce Pages:**

1. **Shop/Products Listing**
   - Grid layout (3-4 columns desktop, 1-2 mobile)
   - Filters (category, price range, availability)
   - Sorting (price, name, featured)
   - Quick view on hover
   - "Add to Cart" on product cards

2. **Individual Product Pages**
   - Image gallery with zoom
   - Product details tabs
   - Related products
   - Customer reviews
   - Trust badges

3. **Cart Page** (handled by Snipcart overlay)
   - Line items with thumbnails
   - Quantity adjustment
   - Remove items
   - Coupon code field
   - Shipping calculator
   - Total breakdown

4. **Checkout** (handled by Snipcart)
   - Shipping information
   - Payment processing
   - Order confirmation

5. **Order Confirmation Page**
   - Thank you message
   - Order number
   - Email confirmation notice
   - Next steps
   - Related products / Continue shopping

---

## SECTION 5: ADVANCED FUNCTIONALITY

### 5.1 Booking/Scheduling System

**Recommended Tools:**

**Option 1: Calendly Embed** (Easiest)
```html
<!-- Inline embed -->
<div class="calendly-inline-widget" 
     data-url="https://calendly.com/your-link?hide_gdpr_banner=1" 
     style="min-width:320px;height:700px;">
</div>
<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js"></script>
```

**Option 2: Cal.com** (Open Source, More Control)
- Self-hosted option
- Custom branding
- Advanced features
- Integrations with Google Calendar, Stripe

**Implementation in Stitch:**

**Prompt:**
```
"Generate a premium Booking page with:

LAYOUT:
- Hero section explaining the booking process
- Embedded calendar widget (reserve space: 320px min width, 700px height)
- Service selection (if multiple services offered)
- What to expect section
- Cancellation policy
- Contact information for questions

DESIGN:
- Clean, professional aesthetic
- Calendar widget seamlessly integrated (not iframe-looking)
- Clear call-to-action
- Trust indicators (certifications, testimonials)

Use DESIGN.md for consistency.
"
```

---

### 5.2 Member Portal / User Accounts

**Authentication Options:**

**Option 1: Supabase** (Recommended)
- ✅ Built-in authentication
- ✅ User management
- ✅ PostgreSQL database
- ✅ Real-time capabilities
- ✅ Generous free tier

**Option 2: Firebase Authentication**
- ✅ Easy setup
- ✅ Social logins (Google, Facebook, etc.)
- ✅ Email/password auth
- ✅ Email verification

**Option 3: Auth0**
- ✅ Enterprise-grade
- ✅ Extensive integrations
- 💰 Paid plans for production

---

### 5.3 Implementing User Accounts with Supabase

#### **Step 1: Set Up Supabase Project**

1. Go to supabase.com
2. Create new project
3. Get API URL and anon key

#### **Step 2: Create React Components for Auth**

**Login Page Component:**
```javascript
// components/Login.jsx
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      window.location.href = '/dashboard'
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h1>Welcome Back</h1>
        {error && <div className="error-message">{error}</div>}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
        
        <a href="/forgot-password" className="forgot-link">
          Forgot password?
        </a>
      </form>
    </div>
  )
}
```

**User Dashboard:**
```javascript
// pages/dashboard.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
    } else {
      window.location.href = '/login'
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {user.email}</h1>
        <button onClick={handleLogout}>Log Out</button>
      </header>
      
      <div className="dashboard-content">
        {/* User-specific content here */}
        <section className="user-info">
          <h2>Account Information</h2>
          <p>Email: {user.email}</p>
          <p>Member since: {new Date(user.created_at).toLocaleDateString()}</p>
        </section>
        
        <section className="user-content">
          <h2>Your Content</h2>
          {/* Dynamic content based on user */}
        </section>
      </div>
    </div>
  )
}
```

#### **Step 3: Create Stitch Screens for Auth Pages**

**Login Page Prompt:**
```
"Generate a premium Login page with:

LAYOUT:
- Split screen: left side = login form, right side = brand imagery/benefits
- Login form fields: email, password
- 'Forgot Password?' link
- 'Create Account' link
- Social login options (Google, Apple) - optional
- Error message display area

DESIGN:
- Modern, trustworthy aesthetic
- Clear visual hierarchy
- Subtle animations on input focus
- Loading state for submit button
- Form validation feedback

Use DESIGN.md for consistency.
"
```

**Dashboard Prompt:**
```
"Generate a premium User Dashboard with:

LAYOUT:
- Sidebar navigation (Profile, Settings, Content, Billing if applicable)
- Main content area with welcome message
- Quick stats/overview widgets
- Recent activity section
- Account information display

DESIGN:
- Clean, organized interface
- Card-based layout
- Consistent with main site design
- Clear CTAs for key actions
- Responsive sidebar (collapse on mobile)

FUNCTIONALITY:
- Log out button
- Edit profile link
- Settings access
- Content management (if applicable)

Use DESIGN.md for consistency.
"
```

---

### 5.4 Third-Party Integrations

#### **CRM Integration (HubSpot)**

**Use Case:** Capture leads and sync with client's CRM

**Implementation:**
```html
<!-- HubSpot Form Embed -->
<script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/v2.js"></script>
<script>
  hbspt.forms.create({
    region: "na1",
    portalId: "YOUR_PORTAL_ID",
    formId: "YOUR_FORM_ID",
    target: "#hubspot-form-container",
    onFormSubmit: function($form) {
      // Custom success handling
      console.log('Form submitted to HubSpot')
    }
  });
</script>
<div id="hubspot-form-container"></div>
```

**Styling HubSpot Forms:**
```css
/* Override HubSpot default styles to match your design */
.hs-form {
  max-width: 600px;
}

.hs-form input[type="text"],
.hs-form input[type="email"],
.hs-form textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.hs-form input:focus {
  border-color: var(--primary-color);
  outline: none;
}

.hs-submit .hs-button {
  background: var(--primary-color);
  color: white;
  padding: 14px 32px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
```

---

#### **Email Marketing Integration (Mailchimp)**

**Newsletter Signup:**
```html
<!-- Mailchimp Embedded Form -->
<div id="mc_embed_signup">
  <form action="https://YOUR_DOMAIN.us1.list-manage.com/subscribe/post?u=XXX&id=XXX" 
        method="post" 
        id="mc-embedded-subscribe-form" 
        name="mc-embedded-subscribe-form" 
        class="validate" 
        target="_blank" 
        novalidate>
    
    <div id="mc_embed_signup_scroll">
      <h2>Subscribe to our newsletter</h2>
      
      <div class="mc-field-group">
        <label for="mce-EMAIL">Email Address <span class="asterisk">*</span></label>
        <input type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL" required>
      </div>
      
      <div class="mc-field-group">
        <label for="mce-FNAME">First Name </label>
        <input type="text" value="" name="FNAME" class="" id="mce-FNAME">
      </div>
      
      <div id="mce-responses" class="clear">
        <div class="response" id="mce-error-response" style="display:none"></div>
        <div class="response" id="mce-success-response" style="display:none"></div>
      </div>
      
      <div style="position: absolute; left: -5000px;" aria-hidden="true">
        <input type="text" name="b_XXX_XXX" tabindex="-1" value="">
      </div>
      
      <div class="clear">
        <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button">
      </div>
    </div>
  </form>
</div>
```

---

#### **Live Chat Integration (Intercom / Crisp)**

**Crisp Chat (Free tier available):**
```html
<!-- Add before </body> -->
<script type="text/javascript">
  window.$crisp=[];
  window.CRISP_WEBSITE_ID="YOUR_WEBSITE_ID";
  (function(){
    d=document;
    s=d.createElement("script");
    s.src="https://client.crisp.chat/l.js";
    s.async=1;
    d.getElementsByTagName("head")[0].appendChild(s);
  })();
</script>
```

The chat widget automatically appears in the bottom right corner.

**Customization:**
```javascript
// Set user details
$crisp.push(["set", "user:email", ["user@email.com"]]);
$crisp.push(["set", "user:nickname", ["User Name"]]);

// Customize colors
$crisp.push(["config", "color:theme", ["blue"]]);

// Hide by default, show on specific pages
$crisp.push(["do", "chat:hide"]);
// Then show when needed:
$crisp.push(["do", "chat:show"]);
```

---

## SECTION 6: ANALYTICS INTEGRATION

### 6.1 Google Analytics 4 Setup

#### **Step 1: Create GA4 Property**
1. Go to analytics.google.com
2. Create new property
3. Get Measurement ID (G-XXXXXXXXXX)

#### **Step 2: Add GA4 to All Pages**
```html
<!-- Google tag (gtag.js) - Add to <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

#### **Step 3: Set Up Event Tracking**

**Track important interactions:**
```javascript
// Button clicks
document.querySelectorAll('.track-click').forEach(button => {
  button.addEventListener('click', () => {
    gtag('event', 'button_click', {
      'button_name': button.textContent,
      'button_location': window.location.pathname
    });
  });
});

// Form submissions
document.querySelector('#contact-form').addEventListener('submit', () => {
  gtag('event', 'form_submit', {
    'form_name': 'contact_form'
  });
});

// Product views (e-commerce)
function trackProductView(productId, productName, price) {
  gtag('event', 'view_item', {
    currency: 'USD',
    value: price,
    items: [{
      item_id: productId,
      item_name: productName,
      price: price
    }]
  });
}

// Add to cart (e-commerce)
function trackAddToCart(productId, productName, price) {
  gtag('event', 'add_to_cart', {
    currency: 'USD',
    value: price,
    items: [{
      item_id: productId,
      item_name: productName,
      price: price
    }]
  });
}

// Purchase (e-commerce)
function trackPurchase(transactionId, value, items) {
  gtag('event', 'purchase', {
    transaction_id: transactionId,
    value: value,
    currency: 'USD',
    items: items
  });
}
```

---

### 6.2 Heatmap & Session Recording (Hotjar)

**Why add Hotjar:**
- See where users click
- Watch session recordings
- Understand user behavior
- Identify UX issues

**Implementation:**
```html
<!-- Hotjar Tracking Code - Add to <head> -->
<script>
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:YOUR_SITE_ID,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
```

---

### 6.3 Conversion Tracking

**Set up conversion goals in GA4:**
1. Purchase completion
2. Form submissions
3. Account registration
4. Newsletter signup
5. Download (e.g., PDF, resource)
6. Video watch (>50%)
7. Time on site (>2 minutes)
8. Scroll depth (>75%)

**Premium Feature:** Create a simple analytics dashboard the client can view showing:
- Monthly visitors
- Top pages
- Conversion rate
- Form submissions
- Product views/purchases

---

## SECTION 7: ADVANCED SEO

### 7.1 Schema Markup (JSON-LD)

**Homepage Schema:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Business Name",
  "url": "https://www.example.com",
  "logo": "https://www.example.com/logo.png",
  "description": "Business description",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "City",
    "addressRegion": "State",
    "postalCode": "12345",
    "addressCountry": "US"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-555-5555",
    "contactType": "Customer Service"
  },
  "sameAs": [
    "https://www.facebook.com/businessname",
    "https://www.instagram.com/businessname",
    "https://www.linkedin.com/company/businessname"
  ]
}
</script>
```

**Product Page Schema:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "image": "https://www.example.com/product-image.jpg",
  "description": "Product description",
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://www.example.com/products/product-name",
    "priceCurrency": "USD",
    "price": "49.99",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Business Name"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "24"
  }
}
</script>
```

**Blog Post Schema:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Article Title",
  "image": "https://www.example.com/article-image.jpg",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Business Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.example.com/logo.png"
    }
  },
  "datePublished": "2025-01-15",
  "dateModified": "2025-01-20",
  "description": "Article excerpt/description"
}
</script>
```

---

### 7.2 Advanced Meta Tags

**Open Graph (Facebook/LinkedIn):**
```html
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Page description">
<meta property="og:image" content="https://www.example.com/share-image.jpg">
<meta property="og:url" content="https://www.example.com/page">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Business Name">
```

**Twitter Card:**
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Page description">
<meta name="twitter:image" content="https://www.example.com/share-image.jpg">
<meta name="twitter:site" content="@businesshandle">
```

**Canonical URL:**
```html
<link rel="canonical" href="https://www.example.com/preferred-url">
```

---

### 7.3 Sitemap & Robots.txt Automation

**For React/Next.js sites, generate sitemap automatically:**
```javascript
// scripts/generate-sitemap.js
const fs = require('fs');
const globby = require('globby');

async function generateSitemap() {
  const pages = await globby([
    'pages/**/*.jsx',
    '!pages/_*.jsx',
    '!pages/api',
    '!pages/404.jsx'
  ]);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => {
  const path = page
    .replace('pages', '')
    .replace('.jsx', '')
    .replace('/index', '');
  const route = path === '' ? '' : path;
  
  return `  <url>
    <loc>https://www.example.com${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
}).join('\n')}
</urlset>`;

  fs.writeFileSync('public/sitemap.xml', sitemap);
}

generateSitemap();
```

**Robots.txt:**
```
User-agent: *
Allow: /

Sitemap: https://www.example.com/sitemap.xml
```

---

## SECTION 8: PERFORMANCE OPTIMIZATION (PREMIUM STANDARDS)

### 8.1 Target Lighthouse Scores

**Premium tier benchmarks:**
- **Performance:** 95+
- **Accessibility:** 100
- **Best Practices:** 100
- **SEO:** 100

---

### 8.2 Image Optimization Strategy

**Required for Premium:**

1. **Use Next-Gen Formats:**
```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.jpg" type="image/jpeg">
  <img src="image.jpg" alt="Description">
</picture>
```

2. **Responsive Images:**
```html
<img 
  src="image-800.jpg"
  srcset="image-400.jpg 400w,
          image-800.jpg 800w,
          image-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px,
         (max-width: 1200px) 800px,
         1200px"
  alt="Description"
  loading="lazy"
>
```

3. **Use Image CDN (Cloudinary/Imgix):**
- Automatic format conversion
- On-the-fly resizing
- Compression optimization
- Global CDN delivery

---

### 8.3 Code Splitting & Lazy Loading

**For React components:**
```javascript
import { lazy, Suspense } from 'react'

// Lazy load heavy components
const ProductGallery = lazy(() => import('./ProductGallery'))
const UserDashboard = lazy(() => import('./UserDashboard'))

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductGallery />
    </Suspense>
  )
}
```

**Lazy load sections with Intersection Observer:**
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Load content
      entry.target.classList.add('loaded');
      observer.unobserve(entry.target);
    }
  });
});

document.querySelectorAll('.lazy-section').forEach(section => {
  observer.observe(section);
});
```

---

### 8.4 Caching Strategy

**Service Worker for PWA capabilities:**
```javascript
// sw.js
const CACHE_NAME = 'site-cache-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/assets/logo.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

---

## SECTION 9: QUALITY ASSURANCE (PREMIUM)

### 9.1 Extended Testing Checklist

**Everything from Standard tier, PLUS:**

**CMS Functionality:**
- [ ] Client can log into CMS
- [ ] Client can create/edit blog posts
- [ ] Client can upload images
- [ ] Client can update product information
- [ ] Changes appear on live site within expected time
- [ ] Media library organized
- [ ] Content validation works
- [ ] Draft/publish workflow clear

**E-commerce (if applicable):**
- [ ] Products display correctly
- [ ] Add to cart works
- [ ] Cart updates quantities
- [ ] Cart persists across pages
- [ ] Checkout flow smooth
- [ ] Payment processing works (test mode)
- [ ] Order confirmation emails sent
- [ ] Inventory updates correctly
- [ ] Coupons/discounts apply
- [ ] Shipping calculator accurate

**User Accounts:**
- [ ] Registration works
- [ ] Login/logout works
- [ ] Password reset works
- [ ] Email verification works
- [ ] User dashboard accessible
- [ ] Profile editing works
- [ ] Session management secure
- [ ] Protected routes actually protected

**Third-Party Integrations:**
- [ ] CRM form submissions sync
- [ ] Email marketing signups work
- [ ] Booking system calendar syncs
- [ ] Live chat widget loads
- [ ] Analytics tracking fires
- [ ] All API keys secure (not exposed)

**Advanced Features:**
- [ ] Search functionality works
- [ ] Filters apply correctly
- [ ] Sorting options work
- [ ] Pagination functions
- [ ] Date pickers work
- [ ] File uploads accepted
- [ ] Email notifications send

---

### 9.2 Security Checklist

**Required for Premium:**
- [ ] HTTPS enabled (SSL certificate)
- [ ] Form inputs sanitized
- [ ] SQL injection protection
- [ ] XSS protection implemented
- [ ] CSRF tokens on forms
- [ ] Rate limiting on API endpoints
- [ ] Secure password hashing
- [ ] Environment variables for secrets
- [ ] No sensitive data in client code
- [ ] Security headers configured
- [ ] Regular dependency updates

**Security Headers:**
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://trusted-cdn.com;">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="DENY">
<meta http-equiv="X-XSS-Protection" content="1; mode=block">
```

---

## SECTION 10: CLIENT DELIVERABLES (PREMIUM)

### 10.1 Documentation Package

**Provide comprehensive documentation:**

1. **WEBSITE-OVERVIEW.md**
   - Site architecture
   - Technology stack
   - Third-party services used
   - Login credentials (secure delivery)

2. **CMS-USER-GUIDE.md**
   - Detailed CMS instructions
   - Video tutorials (screen recordings)
   - Common tasks walkthrough
   - Troubleshooting tips

3. **ECOMMERCE-MANAGEMENT.md** (if applicable)
   - Adding/editing products
   - Processing orders
   - Managing inventory
   - Coupon creation
   - Shipping setup

4. **MAINTENANCE-GUIDE.md**
   - How to update dependencies
   - Backup procedures
   - Security best practices
   - Performance monitoring

5. **ANALYTICS-GUIDE.md**
   - How to access analytics
   - Key metrics to watch
   - Interpreting reports
   - Setting up goals

---

### 10.2 Training Session

**Included in Premium tier:**
- 1-hour live training session (Zoom/Google Meet)
- Screen recording of session for reference
- Q&A about website management
- Walkthrough of CMS
- Demonstration of all features
- Best practices guidance

---

### 10.3 Ongoing Support Plan (Optional Upsell)

**Offer monthly maintenance packages:**

**Basic Support ($150/month):**
- Content updates (up to 2 hours/month)
- Plugin/dependency updates
- Security monitoring
- Backup management
- Email support

**Premium Support ($300/month):**
- Everything in Basic
- Priority support
- Monthly analytics reports
- SEO monitoring
- 4 hours of updates/changes
- Feature additions (small)

**Enterprise Support ($500+/month):**
- Everything in Premium
- Dedicated support
- Unlimited updates
- Custom development
- A/B testing
- Conversion optimization

---

## SECTION 11: FINAL NOTES

### 11.1 Premium Tier Success Criteria

**A Premium website should:**
- Make the client feel like they got incredible value
- Showcase advanced functionality seamlessly
- Empower the client to manage content independently
- Drive measurable business results (leads, sales)
- Represent the pinnacle of your design/dev skills
- Include delightful details that exceed expectations

### 11.2 Continuous Improvement

**After launch:**
- Monitor analytics for user behavior
- A/B test key pages (homepage, product pages)
- Gather user feedback
- Iterate based on data
- Optimize conversion funnels
- Refine content strategy

### 11.3 Portfolio Showcase

**Premium projects are your best marketing:**
- Request testimonial
- Ask for case study approval
- Take high-quality screenshots
- Document results (traffic increase, conversion improvement)
- Use as portfolio centerpiece

---

**Remember: Premium tier is where you show what you're truly capable of. Make it exceptional.**

