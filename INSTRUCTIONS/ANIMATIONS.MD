# ANIMATIONS INSTRUCTION GUIDE

## OVERVIEW
This document provides comprehensive instructions for implementing animations across the website. Follow these guidelines to create visually stunning, performant animations that enhance user experience without overwhelming the design.

---

## SECTION 1: ANIMATION INSPIRATION & CODE REFERENCES

### 1.1 21st.dev Component Library

**Tool:** Use the `21st_magic_component_inspiration` MCP tool

**Instructions:**
1. Access my 21st.dev bookmarked components using the MCP tool
2. Review ALL bookmarked animations and components
3. Pay special attention to:
   - Scroll-triggered animations
   - Hover effects and micro-interactions
   - Transition timing and easing functions
   - Component composition and layering

**Command Example:**
```
Use the 21st_magic_component_inspiration tool to fetch my bookmarked components from 21st.dev
```

---

### 1.2 CodePen Animation Library

**Resource:** https://codepen.io/Andres-McMahon/pens/loved

**Instructions:**
1. Navigate to the CodePen URL above
2. Browse through ALL animations I have marked as "loved"
3. Examine the code for each animation, focusing on:
   - GSAP implementation patterns
   - ScrollTrigger configurations
   - Timeline sequences
   - Easing functions and durations
   - Performance optimization techniques

**Key Focus Areas:**
- Scroll-based animations (parallax, reveal, pin)
- Text animations (split text, stagger effects)
- Video integration with scroll
- Smooth transitions and morphing effects
- Interactive hover states

---

## SECTION 2: ANIMATION SELECTION STRATEGY

### 2.1 Design Philosophy

**Goal:** Create a cohesive, beautiful design that feels premium without being chaotic or overwhelming.

**Guidelines:**

**DO:**
- ✅ Select 2-4 primary animation styles that complement each other
- ✅ Use animations purposefully to guide user attention
- ✅ Maintain consistent easing and timing across similar animation types
- ✅ Consider page hierarchy (hero animations should be more prominent than footer animations)
- ✅ Ensure animations enhance readability, not distract from content
- ✅ Test animation performance and optimize as needed

**DON'T:**
- ❌ Use every animation style you find - be selective
- ❌ Create competing focal points with multiple intense animations
- ❌ Use jarring or overly fast animations
- ❌ Implement animations that interfere with accessibility
- ❌ Overuse parallax effects (can cause motion sickness)

---

### 2.2 Decision-Making Process

**Before implementing any animation, ask yourself:**

1. **Purpose:** What is this animation trying to achieve?
   - Guide attention to important content?
   - Create visual interest during scroll?
   - Provide feedback on user interaction?
   - Establish brand personality?

2. **Cohesion:** Does this animation style work with others already selected?
   - Are timing/easing similar enough?
   - Do they share a common aesthetic?
   - Will they compete for attention or complement each other?

3. **Performance:** Will this animation impact page load or scroll performance?
   - Is it GPU-accelerated (transform/opacity)?
   - Does it require heavy computation?
   - Will it work smoothly on mobile devices?

4. **Accessibility:** Could this animation cause issues for users?
   - Respect `prefers-reduced-motion` settings
   - Avoid rapid flashing or strobing effects
   - Ensure animations don't prevent access to content

**Document your reasoning:** When selecting animations, briefly note WHY you chose each one and HOW they work together as a system.

---

## SECTION 3: VIDEO-BASED ANIMATIONS

### 3.1 Video Upload Folder

**Location:** `/video_upload/`

**Structure:**
```
/video_upload/
  ├── hero-animation.mp4
  ├── hero-animation.txt          ← Description file
  ├── product-showcase.mp4
  ├── product-showcase.txt
  └── ...
```

**Description File Format:**
Each video should have a corresponding `.txt` file with the same name containing:
```
Animation Type: [1, 2, or 3]
Description: [Brief description of what this animation shows]
Intended Use: [Where on the page this should appear]
Duration: [Video duration in seconds]
```

---

### 3.2 Animation Type Specifications

#### **TYPE 1: Scroll-Eating Animation**

**Description:** Animation consumes the scroll action - the page doesn't move down until the animation completes.

**Implementation:**
1. Use FFmpeg to extract frames at maximum quality:
```bash
   ffmpeg -i video_upload/[VIDEO_NAME].mp4 -qscale:v 1 -r 30 frames/[VIDEO_NAME]/frame_%04d.png
```

2. Create a new folder: `/frames/[VIDEO_NAME]/`

3. Store all extracted frames in this folder

4. Implement GSAP ScrollTrigger with scrub animation:
```javascript
   gsap.timeline({
     scrollTrigger: {
       trigger: "[container]",
       start: "top top",
       end: "+=300%",  // Adjust based on frame count
       scrub: true,
       pin: true
     }
   })
```

5. Sequence through frames based on scroll progress

**Quality Settings:**
- Frame rate: 30fps minimum (use `-r 30`)
- Quality: Lossless PNG (`-qscale:v 1`)
- Format: PNG for transparency support if needed

**Performance Notes:**
- Lazy load frames or use sprite sheets for better performance
- Consider WebP format for smaller file sizes if quality is acceptable

---

#### **TYPE 2: Scroll-Parallel Animation**

**Description:** Animation plays while the page scrolls simultaneously - both animation and page movement happen together.

**Implementation:**
1. Use FFmpeg to extract frames at maximum quality:
```bash
   ffmpeg -i video_upload/[VIDEO_NAME].mp4 -qscale:v 1 -r 30 frames/[VIDEO_NAME]/frame_%04d.png
```

2. Create a new folder: `/frames/[VIDEO_NAME]/`

3. Store all extracted frames in this folder

4. Implement GSAP ScrollTrigger WITHOUT pinning:
```javascript
   gsap.timeline({
     scrollTrigger: {
       trigger: "[container]",
       start: "top center",
       end: "bottom center",
       scrub: 1  // Smooth scrubbing
       // Note: NO pin property
     }
   })
```

5. Sequence through frames as element passes through viewport

**Quality Settings:**
- Same as Type 1 (30fps, lossless PNG)

**Performance Notes:**
- Optimize for mobile - may need to reduce frame count
- Use IntersectionObserver to only load frames when section is near viewport

---

#### **TYPE 3: Play-on-View Animation**

**Description:** Video plays automatically when it enters the viewport (no frame extraction needed).

**Implementation:**
1. Use the video file directly - DO NOT extract frames

2. Implement using HTML5 `<video>` element with GSAP ScrollTrigger:
```javascript
   const video = document.querySelector('[video-element]');
   
   ScrollTrigger.create({
     trigger: video,
     start: "top 80%",
     onEnter: () => video.play(),
     onLeave: () => video.pause(),
     onEnterBack: () => video.play(),
     onLeaveBack: () => video.pause()
   });
```

3. Optional: Add GSAP animations to the video element itself (fade in, scale, etc.)

**Video Settings:**
- Format: MP4 (H.264) for maximum compatibility
- Optimize for web (compress if needed)
- Add `playsinline` attribute for mobile
- Consider adding `muted` and `loop` if appropriate

**Performance Notes:**
- Lazy load videos using `loading="lazy"` or IntersectionObserver
- Provide fallback poster image
- Consider using lower resolution for mobile devices

---

## SECTION 4: IMPLEMENTATION CHECKLIST

Before finalizing animations, verify:

- [ ] All animations have been tested on desktop
- [ ] All animations work smoothly on mobile devices
- [ ] `prefers-reduced-motion` CSS query is respected
- [ ] No animation causes layout shift or reflow issues
- [ ] FFmpeg frame extraction completed successfully for Type 1 & 2 animations
- [ ] All frame folders are properly organized and named
- [ ] Video files for Type 3 are optimized for web
- [ ] GSAP and ScrollTrigger are properly loaded
- [ ] Console shows no errors related to animations
- [ ] Page load time is acceptable (< 3 seconds)
- [ ] Animations don't block critical content rendering

---

## SECTION 5: CODE QUALITY STANDARDS

### 5.1 GSAP Best Practices

**Always:**
- Use `gsap.context()` for cleanup in React/SPA environments
- Implement `ScrollTrigger.refresh()` after DOM changes
- Use GPU-accelerated properties (transform, opacity) when possible
- Set `force3D: true` for complex animations
- Use `will-change` CSS property sparingly

**Never:**
- Animate `width`, `height`, `top`, `left` (use `transform` instead)
- Create ScrollTriggers without cleanup
- Hardcode pixel values (use percentages or viewport units)
- Forget to kill timelines when components unmount

---

### 5.2 Performance Optimization

**Image/Frame Optimization:**
- Compress PNG frames if size is too large (use tools like TinyPNG)
- Consider WebP format for modern browsers (with PNG fallback)
- Implement lazy loading for off-screen frames
- Use sprite sheets for short animations (< 30 frames)

**GSAP Optimization:**
- Batch ScrollTrigger instances when possible
- Use `scrub: true` instead of `scrub: 1` for simple scrubbing (better performance)
- Disable ScrollTrigger on mobile if animations cause jank
- Use `fastScrollEnd` property to improve mobile scroll performance

---

## SECTION 6: ACCESSIBILITY REQUIREMENTS

### 6.1 Reduced Motion Support

**Always implement:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**In JavaScript:**
```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  // Initialize animations
} else {
  // Provide static alternative
}
```

---

### 6.2 Keyboard & Screen Reader Considerations

- Ensure animated content is still accessible via keyboard
- Don't use animation to hide important content indefinitely
- Provide text alternatives for animation-only content
- Test with screen readers (VoiceOver, NVDA, JAWS)

---

## SECTION 7: TROUBLESHOOTING

### Common Issues:

**Issue:** ScrollTrigger animations not working
**Solution:** Ensure GSAP and ScrollTrigger are loaded, run `ScrollTrigger.refresh()` after DOM ready

**Issue:** Frame-based animations are choppy
**Solution:** Reduce frame count, optimize image size, use WebP, implement better lazy loading

**Issue:** Animations cause layout shift
**Solution:** Reserve space for animated elements with fixed dimensions or aspect-ratio

**Issue:** Mobile performance is poor
**Solution:** Reduce animation complexity, disable heavy animations on mobile, use CSS animations instead of JS where possible

---

## FINAL NOTE

Remember: **Less is more**. A few well-executed, purposeful animations will always outperform a chaotic collection of flashy effects. Prioritize user experience, performance, and cohesion over quantity of animations.

When in doubt, reference the bookmarked examples from 21st.dev and CodePen - these have been curated for quality and effectiveness.

