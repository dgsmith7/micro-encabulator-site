# CSS Dependencies Map

## Global Variables (App.css)

```css
:root {
  --color-bg: #44484f
  --color-fg: #e0e0e0
  --color-accent: #b0e0ff
  --color-title: #e9ecef
  --font-main: "Julius Sans One"
}
```

## Z-Index Hierarchy

1. Base Elements

   - Canvas: z-index: 1
   - Background elements: z-index: 2

2. UI Elements

   - Title and overlays: z-index: 3000
   - ModelLabel overlays: z-index: 10
   - SVG Lines: z-index: 10001
   - Bottom overlays: z-index: 40

3. Modals & Controls
   - Credits modal: z-index: 1000-2000
   - Touch controls: z-index: 10000-10001

## Critical CSS Dependencies

### ModelLabel Component

- Depends on:
  - `.model-label-overlay`: Base positioning and fade transitions
  - `.model-label-title`: Typography and spacing
  - `.model-label-desc`: Typography and spacing
  - Device-specific classes (landscape-mobile, etc.)
  - Modal-specific variations (start-modal, panametric-modal, etc.)

### SVG Lines Component

- Depends on:
  - `.overlay-lines`: Base styling and transitions
  - `.overlay-lines.fade-out`: Transition state
  - Z-index coordination with labels

### SnapshotDisplay Component

- Depends on:
  - `.snapshot-crossfade`: Container positioning
  - `.snapshot-img`: Image handling and transitions
  - `.snapshot-img.fade-out/.fade-in`: Transition states
  - Background color coordination

### TouchNavControls Component

- Depends on:
  - `.touch-nav-controls`: Container positioning
  - `.touch-nav-btn`: Button styling and transitions
  - Button hover/active states
  - SVG icon styling

### Transition System

All transitions use:

```css
transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
```

Components affected:

- ModelLabel fades
- SVG line fades
- Image crossfades
- Touch control interactions

### Responsive Breakpoints

1. Desktop (default)
2. Tablet (>= 1001px)
   - Portrait/Landscape variations
3. Mobile (<= 600px)
   - Portrait/Landscape variations
4. Special cases:
   - Short screens (height < 500px)
   - Wide screens (> 1000px)

### Device-Specific Adjustments

1. Mobile Portrait

   - Adjusted font sizes
   - Compact layouts
   - Modified label positions

2. Mobile Landscape

   - Repositioned labels
   - Adjusted control positions
   - Modified transitions

3. Tablet Adaptations
   - Intermediate font sizes
   - Balanced spacing
   - Optimized touch targets

## CSS Cascade Dependencies

### Title System

```
.title-and-overlays
└─ .floating-title
└─ .top-overlays
   └─ .scroll-hint
   └─ .credits-link
```

### Modal System

```
.model-label-overlay
└─ .model-label-title
└─ .model-label-desc
└─ Device modifiers
   └─ .landscape-mobile
   └─ .start-modal
   └─ .panametric-modal
```

### Navigation System

```
.touch-controls-outer
└─ .touch-controls-inner
   └─ .touch-nav-controls
      └─ .touch-nav-btn
         └─ SVG styling
```

## Performance Considerations

1. Use of `will-change: opacity` for:

   - Fade transitions
   - Crossfades
   - SVG lines

2. Hardware acceleration triggers:

   - transform
   - opacity transitions
   - fixed positioning

3. Critical render path optimization:
   - Z-index layering
   - Pointer-events handling
   - Transition timing
