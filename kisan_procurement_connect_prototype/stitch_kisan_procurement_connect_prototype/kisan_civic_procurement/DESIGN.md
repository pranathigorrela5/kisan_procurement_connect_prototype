---
name: Kisan Civic Procurement
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#404940'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#707a6f'
  outline-variant: '#bfc9bd'
  surface-tint: '#1d6c39'
  primary: '#004c22'
  on-primary: '#ffffff'
  primary-container: '#156634'
  on-primary-container: '#93e1a2'
  inverse-primary: '#8ad89a'
  secondary: '#904d00'
  on-secondary: '#ffffff'
  secondary-container: '#fe932c'
  on-secondary-container: '#663500'
  tertiary: '#224a21'
  on-tertiary: '#ffffff'
  tertiary-container: '#396236'
  on-tertiary-container: '#aedca5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a5f4b4'
  primary-fixed-dim: '#8ad89a'
  on-primary-fixed: '#00210b'
  on-primary-fixed-variant: '#005226'
  secondary-fixed: '#ffdcc3'
  secondary-fixed-dim: '#ffb77d'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6e3900'
  tertiary-fixed: '#c0efb7'
  tertiary-fixed-dim: '#a5d29c'
  on-tertiary-fixed: '#002203'
  on-tertiary-fixed-variant: '#284f26'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  headline-xl:
    fontFamily: Public Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Public Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Public Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Public Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: 0em
  headline-md:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0em
  body-xl:
    fontFamily: Noto Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Noto Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Noto Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Noto Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Noto Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Noto Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  touch-min: 3rem
  touch-generous: 3.375rem
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  margin-mobile: 1rem
  margin-tablet: 1.5rem
  gutter-mobile: 0.75rem
  gutter-desktop: 1.5rem
---

## Brand & Style

This design system delivers an authoritative, high-clarity civic framework engineered specifically for rural agricultural producers navigating mandi transactions, procurement scheduling, Minimum Support Price (MSP) disbursements, and grain quality assessments. The operational context requires immediate comprehension in intense direct outdoor sunlight, resilient multi-script rendering (Devanagari, Telugu, Tamil, Gurmukhi, and Latin), and uncompromised usability across low-cost mobile hardware and intermittent connectivity.

The aesthetic fuses civic dependability with tactile agricultural vitality:
- **Tone:** Grounded, unyielding in integrity, respectful, and reassuringly official.
- **Design Philosophy:** Utilitarian Civic Modernism. Interface components favor physical clarity, large structural targets, and crisp information boundaries over ornate decoration.
- **Visual Stance:** Robust high-contrast surfaces, solid structural contours, and immediate visual hierarchy that eliminates cognitive fatigue for first-time or low-literacy smartphone users.

## Colors

The color architecture is built directly on agricultural certitude and national institutional trust. All token pairings conform strictly to WCAG AAA contrast guidelines (minimum 7:1 for core text and 3:1 for interactive boundaries) to guarantee legibility under harsh solar glare on affordable LCD displays.

### Primary Palette (Crop & Canopy)
- **Primary Base (`#156634`):** An authoritative deep agricultural green used for top-level app bars, primary transaction triggers, verified state indicators, and focal institutional branding.
- **Primary Deep (`#0E4422`):** Active press states and high-emphasis focal items.
- **Primary Container (`#E7F3EB`):** High-visibility background for active selection rows, approved inspection cards, and primary banners.

### Secondary & Accent (Harvest & Mandi Gold)
- **Secondary Base (`#D97706`):** Vibrant harvest amber signifying pending actions, slot booking windows, payment escrow notices, and attention states.
- **Secondary Light (`#FEF3C7`):** Background fill for advisory banners and warning alerts.
- **Secondary Dark (`#92400E`):** High-contrast text on gold containers.

### Neutral & Ground
- **Neutral Foreground (`#1F2937`):** Slate dark typography engineered to replace pure black, preventing chromatic aberration while maintaining maximum contrast against light surfaces.
- **Muted Foreground (`#4B5563`):** Secondary metadata, timestamps, mandi lot numbers, and auxiliary labels.
- **Surface Canvas (`#F8FAF5`):** Warm, fertile cream-tinted off-white reducing eye strain and panel glare.
- **Surface Card (`#FFFFFF`):** Crisp pure white card container surfaces.
- **Structural Border (`#D1D5DB`):** Explicit 1px structural contours establishing discrete card perimeters.

## Typography

Typography prioritizes open counters, uninhibited diacritic clearance, and multi-lingual glyph stability. **Public Sans** provides institutional authority for headers, weight declarations, and financial amounts. **Noto Sans** handles all multilingual body, instructions, and interactive states, maintaining exact x-height parity across Hindi, Telugu, and English.

### Implementation Guidelines
- **Diacritic Clearance:** Line-height multipliers are set to a minimum of 1.45x–1.55x on all body copy to prevent conjunct clipping in Indic complex scripts.
- **Numbers and Currency:** Financial values (₹ MSP per quintal, total payouts, token serial numbers) must always render using tabular numerals (`tnum`) in semi-bold or bold weights.
- **Hierarchy Rules:** Primary actions and key metric summaries use `label-lg` or `headline-md` to remain readable at arm’s length.

## Layout & Spacing

A mobile-first, single-column fluid layout forms the core structure, guaranteeing that crucial workflows—such as procurement slot booking, MSP rate verification, and weighing slip downloads—can be managed with one thumb in field conditions.

### Touch Target Architecture
- **Mandatory Target Floor:** All interactive controls, icon buttons, list items, and form elements enforce a strict minimum tap bounding box of 48px × 48px (`touch-min`), with a standard default of 54px (`touch-generous`) for high-frequency workflows.
- **Spacing Rhythm:** Based on an 8px baseline grid (`space-xs` = 8px, `space-md` = 16px, `space-lg` = 24px). Micro-spacers of 4px (`space-2xs`) are reserved exclusively for icon-to-label adjacency and chip internals.

### Breakpoints & Adaptive Behavior
- **Handheld Mobile (< 600px):** Single-column stacked cards. 16px horizontal viewport margins. Sticky bottom bar for critical actions.
- **Tablet / Mandi Kiosk (600px - 1024px):** Two-column card grid with 24px margins and gutters. Master-detail views for procurement lots and receipt reviews.
- **Desktop / Procurement Center Operator (> 1024px):** Constrained layout centered at max 1200px width with structured data tables and sidebar navigation.

## Elevation & Depth

To remain unambiguous across varied lighting environments, this design system avoids fragile, low-contrast diffuse shadows. Visual hierarchy is established through a combination of crisp structural borders, surface tone stepping, and purposeful tactile shadows.

### Elevation Hierarchy
- **Level 0 (Flat / Canvas):** `#F8FAF5` background surface without borders or shadows.
- **Level 1 (Cards & Data Panels):** `#FFFFFF` surface backed by a 1px solid border in `#D1D5DB`, paired with a light tactile shadow: `0px 1px 3px rgba(31, 41, 55, 0.08), 0px 1px 2px rgba(31, 41, 55, 0.04)`.
- **Level 2 (Active Focus & Bottom Sheets):** `#FFFFFF` surface with a 1px solid border in `#9CA3AF`, supported by a direct lift shadow: `0px 4px 6px -1px rgba(21, 102, 52, 0.12), 0px 2px 4px -2px rgba(31, 41, 55, 0.08)`.
- **Level 3 (Modal Dialogs & Mandi Token Alerts):** Deep focal shadow: `0px 10px 15px -3px rgba(15, 23, 42, 0.18), 0px 4px 6px -4px rgba(15, 23, 42, 0.1)`.

No interface element relies purely on drop shadow for its boundary; an explicit outline (`#D1D5DB` or stronger) is always required.

## Shapes

The design system employs a disciplined, balanced geometric geometry with standard `roundedness` set to `2` (8px base corner radius). This curvature provides an approachable, contemporary visual feel while retaining the structural solidity and organizational discipline expected of official government tools.

### Corner Radius Mapping
- **Default Elements (8px / 0.5rem):** Action buttons, input form fields, status badges, and table cells.
- **Large Cards & Panels (`rounded-lg` - 16px / 1.0rem):** Procurement detail containers, crop submission cards, and mandi summary modules.
- **Persistent Sheets & Modals (`rounded-xl` - 24px / 1.5rem):** Bottom drawer headers and primary alert dialogue modules.
- **Pills / Circles:** Exclusively reserved for status indicator tags, step indicators, and circular quick-call emergency actions.

## Components

### Buttons
- **Primary Button:** Solid background in `#156634` with high-contrast `#FFFFFF` text. Minimum height of 54px. Full-width on mobile viewports. Active state shifts to `#0E4422`. Focus rings utilize a 3px outer halo of `#D97706` for clear keyboard and accessibility navigation.
- **Secondary Button:** Outlined with a 2px solid border in `#156634`, surface `#FFFFFF`, text in `#156634`. Height 54px.
- **Destructive/Emergency Button:** Background `#DC2626`, text `#FFFFFF`. Used for transaction cancellations or dispute escalations.

### Chips & Status Badges
- **Purpose:** Communicate lot approval, moisture check pass/fail, and payment disbursement states.
- **Structure:** 8px horizontal padding, 6px vertical padding, pill-shaped (full rounding), paired with a left-aligned 8px status indicator dot.
- **Variants:**
  - *Approved / Verified:* Surface `#E7F3EB`, text `#0E4422`, border `#156634`.
  - *Slot Scheduled / In Transit:* Surface `#FEF3C7`, text `#92400E`, border `#D97706`.
  - *Rejected / Action Required:* Surface `#FEE2E2`, text `#991B1B`, border `#DC2626`.

### Cards
- Container for mandi queue tokens, crop lot summaries, and MSP calculations.
- Solid `#FFFFFF` background, 16px padding, 1px solid `#D1D5DB` border, and 16px corner radius.
- Header row clearly separates lot ID (`label-md` in `#4B5563`) and current status chip, followed by prominent tabular values (Quantity in Quintals, Total Payout).

### Input Fields
- Minimum height of 54px with an internal font size of 16px (`body-lg`) to prevent automatic iOS zooming and facilitate easy manual entry on mobile devices.
- Surface `#FFFFFF` with an unselected 1.5px border in `#6B7280`. On active focus, the border turns `#156634` at 2px with an ambient 2px outer tint.
- Labels are rendered permanently above the input in `label-md` (`#1F2937`), never as disappearing placeholder text. Accompanying helper text sits directly below the field in 14px `#4B5563`.

### Lists
- Separated by explicit 1px `#E5E7EB` divider lines.
- Minimum row height of 64px to support high-confidence tap accuracy.
- Every interactive row includes an unambiguous right-aligned chevron icon (`#9CA3AF`) and left-aligned visual icon or indicator.

### Checkboxes & Radio Buttons
- Sized at a generous 24px × 24px physical container embedded inside a 48px × 48px touch bounding box.
- Checked state fills with `#156634`, featuring a crisp, high-visibility 2.5px white checkmark or inner dot.

### Specialized Agricultural Components
- **Mandi Token Banner:** High-priority numbered banner utilizing `#156634` background with oversized `#FFFFFF` tabular figures, displaying current live queue and gate entry times.
- **Moisture & Quality Gauge:** Segmented color-coded meter (Green 10–14%, Amber 14–17%, Red >17%) allowing farmers to immediately evaluate MSP acceptance eligibility without reading dense text tables.