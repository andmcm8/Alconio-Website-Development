# project-workflow-overview.md

# Project Workflow Overview

## How These Instructions Work Together

This document explains how all the individual instruction files connect to create a complete website development workflow from client intake to launch.

**Note:** Not all projects will include `ANIMATIONS.md`. If this file is not present in your project folder, simply skip any animation-related steps mentioned below.

---

## The Complete Workflow

### Phase 1: Discovery & Planning
**Use:** `CLIENTBRIEF.md`

- Start every project by having the client fill out the client brief
- This captures all requirements: goals, features, content, technical needs
- Determines which tier (Standard, Premium, E-commerce) fits their needs
- Identifies all functionality, integrations, and design preferences
- Sets timeline expectations and budget alignment

**Output:** Completed brief that defines entire project scope

---

### Phase 2: Design & User Experience
**Use:** `DESIGN.md` + `ACCESSIBILITY.md` + `ANIMATIONS.md` (if present)

**Design Phase:**
- Reference `DESIGN.md` for layout, visual hierarchy, typography, color schemes
- Build wireframes and mockups based on client brief requirements
- Ensure design aligns with client's industry, target audience, and brand

**Accessibility Integration:**
- While designing, reference `ACCESSIBILITY.md` to ensure:
  - Color contrast meets WCAG 2.1 AA standards
  - Touch targets are properly sized
  - Focus states are visible
  - Semantic HTML structure planned
- Design with keyboard navigation in mind from the start

**Animation Planning (if ANIMATIONS.md exists):**
- Reference `ANIMATIONS.md` for appropriate animations:
  - Micro-interactions (hovers, clicks, loading states)
  - Page transitions
  - Scroll animations
  - Motion preferences and accessibility
- Plan animations that enhance UX without overwhelming
- **If ANIMATIONS.md is not in your project, skip animation planning**

**Output:** Design mockups that are beautiful, accessible, and functional

---

### Phase 3: Development & Implementation

**Use All Applicable Files Simultaneously:**

#### Build Core Structure
- Implement semantic HTML from `ACCESSIBILITY.md`
- Follow performance guidelines from `PERFORMANCE.md`:
  - Optimize images during development
  - Structure CSS for minimal render-blocking
  - Set up lazy loading from the start

#### Implement Functionality
- Reference `CLIENTBRIEF.md` for required features
- Build forms, e-commerce, CMS, booking systems as specified
- Integrate third-party services identified in brief

#### Add Interactivity
- **If ANIMATIONS.md exists:** Implement animations per file guidelines
- **If ANIMATIONS.md does not exist:** Use basic CSS transitions only
- Ensure all interactive elements meet `ACCESSIBILITY.md` standards:
  - Keyboard accessible
  - Screen reader compatible
  - Proper ARIA labels

#### Optimize Throughout
- Follow `PERFORMANCE.md` continuously:
  - Compress and optimize all assets
  - Minify code
  - Implement caching strategies
- Follow `SEO.md` as you build:
  - Add proper title tags and meta descriptions
  - Structure headings correctly
  - Implement schema markup
  - Create SEO-friendly URLs

**Output:** Fully functional website ready for testing

---

### Phase 4: Testing & Quality Assurance
**Use:** `TESTINGCHECK.md` + All Other Files

**Systematic Testing:**
- Work through `TESTINGCHECK.md` checklist item by item
- Each checklist item references concepts from other files:
  
  **Functionality Testing:** Verify features from `CLIENTBRIEF.md` work correctly
  
  **Responsive Testing:** Ensure design from `DESIGN.md` works on all devices
  
  **Performance Testing:** Validate `PERFORMANCE.md` targets met:
    - PageSpeed scores 90+
    - Core Web Vitals passing
    - Images optimized
    - Code minified
  
  **SEO Testing:** Confirm `SEO.md` requirements implemented:
    - Meta tags on all pages
    - Schema markup present
    - Sitemap submitted
    - Search Console configured
  
  **Accessibility Testing:** Verify `ACCESSIBILITY.md` compliance:
    - WCAG 2.1 AA met
    - Keyboard navigation works
    - Screen reader compatible
    - Color contrast sufficient
  
  **Animation Testing (if ANIMATIONS.md exists):** Check animation guidelines:
    - Animations enhance UX
    - Reduced motion respected
    - Performance impact minimal
    - **If ANIMATIONS.md does not exist, skip this testing section**

**Output:** Tested, validated website ready for deployment

---

### Phase 5: Deployment & Launch
**Use:** `DEPLOYMENTGUIDE.md` + `TESTINGCHECK.md`

**Pre-Deployment:**
- Complete final checks from `TESTINGCHECK.md`
- Follow `DEPLOYMENTGUIDE.md` preparation steps:
  - Set up domain and hosting
  - Configure SSL certificate
  - Prepare production environment

**Deployment:**
- Follow deployment method from `DEPLOYMENTGUIDE.md`:
  - Manual FTP/SFTP for Standard tier
  - Git deployment for Premium/E-commerce
  - CMS-specific deployment if applicable
- Configure server per `PERFORMANCE.md` optimization requirements
- Set up security per `ACCESSIBILITY.md` and general best practices

**Post-Deployment:**
- Run through post-launch checklist from `TESTINGCHECK.md`
- Configure analytics and tracking per `SEO.md`
- Set up monitoring per `DEPLOYMENTGUIDE.md`
- Verify all `PERFORMANCE.md` metrics still meet targets on live site

**Output:** Live website successfully launched

---

## How Files Reference Each Other

### CLIENTBRIEF.md is the Foundation
- Determines which features to implement
- Influences design decisions in `DESIGN.md`
- Defines SEO keywords for `SEO.md`
- Identifies target audience for `ACCESSIBILITY.md` considerations
- Specifies performance requirements tier-based
- Indicates if animations are needed (presence of `ANIMATIONS.md`)

### DESIGN.md Works With
- `ACCESSIBILITY.md` - Color contrast, focus states, layout for screen readers
- `ANIMATIONS.md` (if present) - Visual effects that enhance design
- `PERFORMANCE.md` - Image optimization, font loading
- `CLIENTBRIEF.md` - Design aligns with client preferences and brand

### PERFORMANCE.md Affects Everything
- Image optimization impacts `DESIGN.md` visual quality
- Code minification affects all development
- Loading strategies impact `ANIMATIONS.md` implementation (if present)
- CDN setup referenced in `DEPLOYMENTGUIDE.md`
- Core Web Vitals tracked in `TESTINGCHECK.md`

### SEO.md Integrates With
- `PERFORMANCE.md` - Page speed is ranking factor
- `ACCESSIBILITY.md` - Semantic HTML helps SEO
- `DESIGN.md` - Image alt text, heading structure
- `DEPLOYMENTGUIDE.md` - Search Console setup, sitemap submission

### ACCESSIBILITY.md Touches All Areas
- `DESIGN.md` - Color contrast, visual hierarchy
- `ANIMATIONS.md` (if present) - Reduced motion, animation accessibility
- `PERFORMANCE.md` - Page speed helps users with disabilities
- `TESTINGCHECK.md` - Accessibility testing checklist
- All development - Semantic HTML, ARIA labels, keyboard navigation

### ANIMATIONS.md (if present) Enhances
- `DESIGN.md` - Visual polish and micro-interactions
- `ACCESSIBILITY.md` - Must respect motion preferences
- `PERFORMANCE.md` - Must not negatively impact load times
- `TESTINGCHECK.md` - Animation-specific testing requirements
- **If this file doesn't exist, rely on basic CSS transitions instead**

### TESTINGCHECK.md Validates Everything
- References all other files to ensure compliance
- Checks functionality from `CLIENTBRIEF.md` works
- Verifies design from `DESIGN.md` is responsive
- Confirms performance targets from `PERFORMANCE.md` met
- Validates SEO implementation from `SEO.md`
- Tests accessibility per `ACCESSIBILITY.md`
- Checks animations per `ANIMATIONS.md` (if applicable)

### DEPLOYMENTGUIDE.md Brings It All Together
- Uses completed `TESTINGCHECK.md` as pre-launch validation
- Implements server optimizations from `PERFORMANCE.md`
- Sets up analytics and tracking from `SEO.md`
- Ensures accessibility features from `ACCESSIBILITY.md` work on live site
- Configures production environment for all features from `CLIENTBRIEF.md`

---

## Quick Reference: When to Use Each File

| Project Phase | Primary Files | Supporting Files |
|--------------|---------------|------------------|
| **Initial Consultation** | CLIENTBRIEF.md | - |
| **Design Phase** | DESIGN.md | ACCESSIBILITY.md, ANIMATIONS.md* |
| **Development** | All files | Reference continuously |
| **Optimization** | PERFORMANCE.md, SEO.md | ACCESSIBILITY.md |
| **Testing** | TESTINGCHECK.md | All other files |
| **Launch** | DEPLOYMENTGUIDE.md | TESTINGCHECK.md, PERFORMANCE.md |

*Use only if ANIMATIONS.md exists in your project

---

## File Dependency Map
```
CLIENTBRIEF.md (Start Here)
    ↓
DESIGN.md + ACCESSIBILITY.md + [ANIMATIONS.md*]
    ↓
Development (All files referenced)
    ↓
PERFORMANCE.md + SEO.md optimization
    ↓
TESTINGCHECK.md (Validates everything)
    ↓
DEPLOYMENTGUIDE.md (Launch)
```

*ANIMATIONS.md is optional - only use if present in project

---

## Key Principles

1. **CLIENTBRIEF.md always comes first** - It defines the entire project scope
2. **ACCESSIBILITY.md is non-negotiable** - Every project must meet accessibility standards
3. **PERFORMANCE.md and SEO.md run parallel** - Both are implemented throughout development
4. **TESTINGCHECK.md is your safety net** - Don't skip any items
5. **DEPLOYMENTGUIDE.md is your launch playbook** - Follow it step-by-step
6. **ANIMATIONS.md is optional** - If not present, use basic CSS transitions only

---

## Tips for Success

- **Read CLIENTBRIEF.md responses thoroughly** before starting design
- **Reference ACCESSIBILITY.md during design**, not after development
- **Check PERFORMANCE.md benchmarks** as you build, not at the end
- **Implement SEO.md requirements** page-by-page during development
- **Use TESTINGCHECK.md early and often**, not just before launch
- **Follow DEPLOYMENTGUIDE.md exactly** - don't skip steps
- **If ANIMATIONS.md exists**, treat it as enhancement, not requirement
- **If ANIMATIONS.md is missing**, focus on solid UX without complex animations

---

## Common Workflow Mistakes to Avoid

❌ Starting design before completing CLIENTBRIEF.md  
❌ Adding accessibility after development is complete  
❌ Ignoring performance until testing phase  
❌ Implementing SEO as an afterthought  
❌ Skipping items in TESTINGCHECK.md to save time  
❌ Deploying without following DEPLOYMENTGUIDE.md completely  
❌ Using complex animations without ANIMATIONS.md guidance  
❌ Assuming animations are required when ANIMATIONS.md doesn't exist

✅ Complete client brief first, always  
✅ Build accessibility into design and development  
✅ Optimize performance throughout development  
✅ Implement SEO as you build each page  
✅ Test systematically using complete checklist  
✅ Deploy methodically following guide step-by-step  
✅ Use animations only when ANIMATIONS.md is provided  
✅ Keep it simple with CSS transitions when ANIMATIONS.md is absent

