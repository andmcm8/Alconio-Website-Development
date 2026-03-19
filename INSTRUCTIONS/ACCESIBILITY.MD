# accessibility.md

# Web Accessibility Implementation Instructions (WCAG 2.1 AA Compliance)

## Color and Visual Accessibility

### Color Contrast Requirements
- Normal text (under 18pt or under 14pt bold): Minimum 4.5:1 contrast ratio against background
- Large text (18pt and larger or 14pt bold and larger): Minimum 3:1 contrast ratio
- Interactive elements (buttons, form fields, icons): Minimum 3:1 contrast ratio
- Don't rely on color alone to convey information (use icons, text labels, or patterns)
- Test all color combinations using WebAIM Contrast Checker or similar tools
- Ensure link text is distinguishable from regular text (underline or sufficient contrast)

### Visual Indicators
- Provide non-color visual cues for important information (icons alongside colors)
- Use patterns or textures in addition to colors in graphs and charts
- Ensure error messages don't rely solely on red color (include icons and text)
- Make required form fields obvious with asterisks AND text labels
- Provide visible focus indicators that don't rely on color alone

---

## Keyboard Navigation

### Keyboard Accessibility Requirements
- All interactive elements must be accessible via keyboard (Tab, Shift+Tab, Enter, Space, Arrow keys)
- Tab order must follow logical reading order (top to bottom, left to right)
- All functionality available via mouse must also be available via keyboard
- Provide skip-to-content link as first focusable element to bypass navigation
- Ensure custom widgets (dropdowns, modals, tabs) support keyboard interaction
- Don't create keyboard traps where users can't escape using keyboard alone

### Focus Indicators
- Provide highly visible focus indicators for all interactive elements
- Minimum focus indicator: 2px solid outline or border with high contrast
- Focus indicators must have at least 3:1 contrast ratio against background
- Never remove focus outline without providing an equally visible alternative
- Ensure focus indicator is visible on all backgrounds (use contrast-heavy colors)
- Make sure focus order matches visual layout

### Keyboard Interaction Patterns
- Links: Activate with Enter key
- Buttons: Activate with Enter or Space key
- Checkboxes: Toggle with Space key
- Radio buttons: Select with Arrow keys, Space to choose
- Dropdowns: Open with Enter/Space, navigate with Arrow keys, select with Enter
- Modals: Trap focus inside modal, close with Escape key
- Tabs: Navigate with Arrow keys, activate with Enter/Space

### Skip Links
- Implement "Skip to main content" link as first focusable element
- Make skip link visible on keyboard focus (can be visually hidden until focused)
- Link should jump focus to main content area
- Include additional skip links for complex layouts (skip to navigation, skip to footer)

---

## Semantic HTML and Structure

### HTML5 Semantic Elements
- Use <header> for site/page header
- Use <nav> for navigation sections
- Use <main> for main content area (one per page)
- Use <article> for self-contained content
- Use <section> for thematic groupings of content
- Use <aside> for complementary content (sidebars)
- Use <footer> for site/page footer
- Avoid using <div> and <span> when semantic elements exist

### Heading Structure
- Use only one <h1> per page (main page title)
- Follow logical heading hierarchy (h1 → h2 → h3 → h4 → h5 → h6)
- Never skip heading levels (don't go from h2 to h4)
- Use headings to create document outline
- Don't use headings for styling purposes (use CSS instead)
- Include keywords in headings but keep them descriptive and natural
- Screen readers use headings for navigation, so make them meaningful

### Lists
- Use <ul> for unordered lists
- Use <ol> for ordered/numbered lists
- Use <dl>, <dt>, <dd> for definition/description lists
- Use lists for navigation menus
- Never create "fake" lists with line breaks or dashes

### Tables
- Use tables only for tabular data, never for layout
- Include <caption> to describe table purpose
- Use <thead>, <tbody>, <tfoot> to structure table sections
- Use <th> for header cells with scope attribute (scope="col" or scope="row")
- Use <td> for data cells
- For complex tables, use id and headers attributes to associate cells
- Provide summary in <caption> or visually hidden text

### Buttons vs Links
- Use <button> for actions (submit form, open modal, toggle menu)
- Use <a> for navigation to different pages or page sections
- Never use <div> or <span> styled as buttons (unless made fully accessible)
- Ensure buttons have clear text or aria-label describing action

---

## ARIA (Accessible Rich Internet Applications)

### ARIA Principles
- Use semantic HTML first; only add ARIA when necessary
- Don't override native HTML semantics with ARIA
- All interactive ARIA controls must be keyboard accessible
- Test with screen readers to ensure ARIA is working correctly

### Common ARIA Attributes

#### aria-label
- Provides accessible name for elements without visible text
- Use for icon-only buttons: <button aria-label="Close menu">X</button>
- Use for search inputs: <input type="search" aria-label="Search website">
- Don't use if visible label exists (use aria-labelledby instead)

#### aria-labelledby
- References ID of element that labels current element
- Better than aria-label when visible label exists
- Can reference multiple IDs separated by spaces
- Example: <div role="dialog" aria-labelledby="dialog-title">

#### aria-describedby
- References ID of element that describes current element
- Use for help text, error messages, additional instructions
- Example: <input aria-describedby="password-requirements">

#### aria-hidden
- Hides element from screen readers (but not visually)
- Use for decorative icons: <i class="icon" aria-hidden="true"></i>
- Use for duplicate content presented differently
- Never use on focusable elements

#### aria-live
- Announces dynamic content changes to screen readers
- aria-live="polite" - waits for user to pause before announcing
- aria-live="assertive" - interrupts user immediately
- Use for form validation messages, status updates, notifications

#### aria-expanded
- Indicates if collapsible element is expanded or collapsed
- Use on accordion buttons, dropdown triggers, menu buttons
- Values: true or false
- Example: <button aria-expanded="false" aria-controls="menu">Menu</button>

#### aria-controls
- Identifies element(s) controlled by current element
- References ID of controlled element
- Use with aria-expanded for dropdowns, accordions
- Example: <button aria-controls="submenu" aria-expanded="false">

#### aria-current
- Indicates current item in navigation or pagination
- Values: page, step, location, date, time, true, false
- Example: <a href="/about" aria-current="page">About</a>

#### role
- Defines element's purpose when semantic HTML isn't sufficient
- Common roles: button, navigation, main, banner, contentinfo, search, dialog
- Only use when semantic HTML doesn't provide appropriate semantics
- Example: <div role="button" tabindex="0">Click me</div> (but prefer <button>)

### ARIA Landmark Roles (use semantic HTML5 instead when possible)
- role="banner" - use <header> instead
- role="navigation" - use <nav> instead
- role="main" - use <main> instead
- role="complementary" - use <aside> instead
- role="contentinfo" - use <footer> instead
- role="search" - for search forms
- role="form" - use <form> instead

### Custom Widget ARIA Patterns
- Modals: role="dialog", aria-modal="true", aria-labelledby
- Tabs: role="tablist", role="tab", role="tabpanel", aria-selected, aria-controls
- Accordions: Use buttons with aria-expanded and aria-controls
- Dropdowns: Use button with aria-haspopup, aria-expanded
- Tooltips: role="tooltip", aria-describedby on trigger element

---

## Forms Accessibility

### Form Labels
- Every input must have an associated <label>
- Use for attribute on label matching id of input
- Position labels above or to left of input (not below or right)
- Don't use placeholder as replacement for label
- For checkbox/radio groups, use <fieldset> with <legend>

### Form Validation and Error Handling
- Provide clear, specific error messages for each field
- Associate error messages with fields using aria-describedby
- Use aria-invalid="true" on fields with errors
- Display errors inline near the field, not just at top of form
- Don't rely on color alone to indicate errors (use icons and text)
- For required fields, use required attribute AND visual indicator
- Use aria-required="true" for programmatic indication
- Announce errors to screen readers using aria-live regions

### Form Instructions
- Provide clear instructions before form
- Indicate required fields at top and on each field
- Show expected format for inputs (phone numbers, dates, etc.)
- Use aria-describedby to link instructions to fields
- Provide help text where needed
- Show password requirements before password field

### Form Input Types
- Use appropriate input types: email, tel, url, number, date, search
- Use autocomplete attribute for common fields (name, email, address, phone)
- Group related fields with <fieldset> and <legend>
- Use radio buttons for 2-5 mutually exclusive options
- Use checkboxes for multiple selections
- Use select dropdown for 6+ mutually exclusive options

---

## Images and Media

### Image Alt Text
- Provide alt attribute for every <img> element
- Describe image content and function, not just appearance
- Keep alt text concise (typically under 125 characters)
- For decorative images, use empty alt: alt=""
- Don't start alt text with "image of" or "picture of"
- Include important text visible in image
- For complex images (charts, diagrams), provide long description via aria-describedby or nearby text

### Informative Images
- Convey meaningful information in alt text
- Example: alt="Bar chart showing 50% increase in sales from 2023 to 2024"
- Include data context and key takeaways

### Functional Images (buttons, links)
- Describe the function, not the image
- Example: <a href="/cart"><img src="cart-icon.png" alt="View shopping cart"></a>
- Not: alt="Shopping cart icon"

### Decorative Images
- Use alt="" to hide from screen readers
- Ensure image doesn't convey necessary information
- Use CSS background images for purely decorative elements
- Example: <img src="divider.png" alt="" role="presentation">

### Image Maps
- Provide alt text for the <img> element
- Provide alt text for each <area> element
- Ensure image map is keyboard accessible

### SVG Accessibility
- Add <title> element as first child of <svg>
- Add role="img" to <svg> element
- Use aria-labelledby to reference title
- For decorative SVGs, use aria-hidden="true"

### Video Accessibility
- Provide captions for all video content (open or closed)
- Provide transcripts for video and audio content
- Ensure media player controls are keyboard accessible
- Provide audio descriptions for visual-only information
- Use <track> element for captions: <track kind="captions" src="captions.vtt">
- Don't autoplay videos (especially with sound)

### Audio Accessibility
- Provide transcripts for audio-only content
- Include speaker identification in transcripts
- Describe relevant non-speech sounds in transcripts
- Ensure audio player controls are keyboard accessible

---

## Interactive Components

### Modal Dialogs
- Use role="dialog" and aria-modal="true"
- Provide accessible name with aria-labelledby pointing to title
- Trap keyboard focus inside modal when open
- Close on Escape key press
- Return focus to trigger element when closed
- Prevent background scrolling when modal open
- Add aria-hidden="true" to background content when modal open

### Dropdown Menus
- Use button with aria-haspopup="true" and aria-expanded
- Implement keyboard navigation (Arrow keys, Enter, Escape)
- Ensure submenus are keyboard accessible
- Provide sufficient time for users to move mouse to submenu
- Close menu on Escape key
- Close menu when focus moves outside

### Accordions
- Use button for accordion header with aria-expanded
- Use aria-controls to associate button with panel
- Implement keyboard navigation (Arrow keys optional, Enter/Space to toggle)
- Allow only one panel open (if designed that way)
- Ensure panel is accessible immediately after button in tab order

### Tabs
- Use role="tablist" on container
- Use role="tab" on each tab button
- Use role="tabpanel" on content panels
- Implement Arrow key navigation between tabs
- Use aria-selected="true/false" on tabs
- Use aria-controls to associate tabs with panels
- Hide inactive panels from screen readers with hidden attribute

### Carousels/Sliders
- Provide play/pause button that's keyboard accessible
- Don't auto-advance faster than 5 seconds without user control
- Provide navigation buttons (previous/next) that are keyboard accessible
- Use aria-live="polite" to announce slide changes
- Ensure carousel doesn't trap keyboard focus
- Provide alternative way to access all content

### Tooltips
- Use aria-describedby on trigger element
- Display on hover AND focus
- Dismissible with Escape key
- Don't convey essential information only in tooltip
- Ensure tooltip doesn't obscure other content
- Position tooltip consistently

---

## Screen Reader Accessibility

### Screen Reader Only Text
- Use for additional context not needed visually
- Use CSS class to hide visually but keep accessible to screen readers:
```
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
```
- Use for "Skip to main content" links
- Use for icon-only buttons when aria-label not appropriate
- Use for providing context to ambiguous links

### Content Structure for Screen Readers
- Use landmarks to define page regions (header, nav, main, aside, footer)
- Provide page title that describes page purpose
- Use logical heading structure for content hierarchy
- Announce dynamic content changes with aria-live
- Provide text alternatives for all non-text content
- Ensure reading order matches visual order

### Links and Buttons
- Use descriptive link text (not "click here" or "read more")
- Link text should make sense out of context
- Indicate if link opens in new window: <a target="_blank">External site (opens in new window)</a>
- Indicate if link downloads file: <a download>Download report (PDF, 2MB)</a>
- Group related links in lists with descriptive headings

---

## Testing and Validation

### Automated Testing Tools
- WAVE browser extension (WebAIM)
- axe DevTools browser extension
- Lighthouse accessibility audit in Chrome DevTools
- Pa11y command-line tool
- HTML validation (W3C Validator)
- Color contrast analyzers

### Manual Testing Requirements
- Keyboard-only navigation test (unplug mouse)
- Screen reader testing with NVDA (Windows), JAWS (Windows), or VoiceOver (Mac/iOS)
- Test with browser zoom at 200%
- Test with high contrast mode enabled
- Test with browser stylesheets disabled
- Test form validation and error handling
- Test interactive components (modals, dropdowns, tabs)

### Screen Reader Testing
- Test with NVDA (free, Windows) at minimum
- Optionally test with JAWS (Windows) and VoiceOver (Mac/iOS)
- Navigate using headings (H key in NVDA/JAWS)
- Navigate using landmarks (D key in NVDA/JAWS)
- Navigate forms using Tab and Form mode
- Test that dynamic content updates are announced
- Verify images have appropriate alt text
- Ensure links make sense out of context

### Browser and Device Testing
- Test on latest versions of Chrome, Firefox, Safari, Edge
- Test on mobile devices (iOS Safari, Android Chrome)
- Test responsive design at various viewport sizes
- Test with different user preference settings:
  - Reduced motion (prefers-reduced-motion media query)
  - Dark mode/light mode
  - Large text settings
  - High contrast mode

---

## Responsive and Mobile Accessibility

### Touch Target Size
- Minimum touch target size: 44x44 CSS pixels (48x48px recommended)
- Provide adequate spacing between touch targets (minimum 8px)
- Make entire button/link area clickable (not just text)
- Increase target size for small text links on mobile

### Mobile-Specific Considerations
- Ensure pinch-to-zoom is not disabled (don't use user-scalable=no)
- Use viewport meta tag appropriately: <meta name="viewport" content="width=device-width, initial-scale=1">
- Test in portrait and landscape orientations
- Ensure content reflows at different screen sizes without horizontal scrolling
- Don't rely on hover interactions (use tap/click)
- Provide clear visual feedback for touch interactions

### Responsive Text
- Use relative units (em, rem, %) instead of fixed pixels for font sizes
- Ensure text can be resized up to 200% without loss of functionality
- Don't prevent text zooming or scaling
- Test readability at different zoom levels

---

## Motion and Animation

### Reduced Motion
- Respect prefers-reduced-motion media query
- Disable or reduce animations for users with motion sensitivity
- Provide alternative way to access functionality dependent on animation
- Example CSS:
```
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
```

### Animation Guidelines
- Don't use animations that flash more than 3 times per second
- Avoid parallax scrolling effects (can cause motion sickness)
- Provide pause button for any auto-playing animations
- Don't auto-play videos or carousels without user control
- Allow users to pause, stop, or hide moving content

---

## Time and Session Management

### Time Limits
- Provide users with adequate time to complete tasks
- Warn users before session timeouts
- Allow users to extend session without losing data
- Disable time limits when possible
- Provide at least 20 seconds warning before timeout
- Allow users to turn off or adjust time limits

### Auto-Updating Content
- Provide pause button for auto-updating content (news tickers, carousels)
- Don't refresh page automatically without user control
- Use aria-live regions for dynamic content updates
- Allow users to control frequency of updates

---

## Error Prevention and Recovery

### Error Prevention
- Provide clear instructions before forms
- Use appropriate input types and validation
- Show format requirements before user enters data
- Confirm before performing destructive actions (delete, submit payment)
- Provide undo functionality where appropriate

### Error Recovery
- Allow users to review and correct information before final submission
- Preserve user data if errors occur
- Provide clear path to correct errors
- Allow users to go back and edit information
- Don't clear entire form if one field has error

---

## Documentation and Maintenance

### Accessibility Documentation
- Create accessibility statement page for website
- Document known accessibility issues and planned fixes
- Provide contact method for users to report accessibility barriers
- Include information about assistive technologies supported
- Document accessibility testing procedures

### Ongoing Maintenance
- Test accessibility with every new feature or update
- Conduct quarterly full accessibility audits
- Keep up with WCAG updates and guidelines
- Train development team on accessibility best practices
- Include accessibility in code review checklist
- Monitor and respond to accessibility feedback from users

