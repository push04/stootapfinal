# Stootap v2 Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from premium SaaS platforms with focus on:
- **Stripe**: Restrained elegance, clear hierarchy, confident spacing
- **Linear**: Typography-first, calm interfaces, purposeful motion
- **Notion**: Approachable professionalism, adaptive UI density

**Design Personality**: Premium, calm, confident. Minimal noise, maximum clarity. India-focused trust signals.

---

## Typography System

**Font Families** (self-hosted, preloaded):
- **Headings**: Plus Jakarta Sans (600, 700, 800 weights)
- **Body**: Inter Variable (400, 500, 600 weights)
- **Fallbacks**: system-ui, -apple-system, sans-serif

**Scale**:
- Hero H1: text-5xl lg:text-6xl xl:text-7xl (font-bold)
- Hero H2: text-lg lg:text-xl xl:text-2xl (font-normal, text-muted)
- Page H1: text-3xl lg:text-4xl (font-bold)
- Section H2: text-2xl lg:text-3xl (font-semibold)
- Card Title: text-xl (font-semibold)
- Body: text-base (font-normal)
- Small: text-sm (font-medium)

---

## Color System

**Light Mode**:
- Background: slate-50
- Surface: white with glass overlays (bg-white/90 backdrop-blur-md)
- Text Primary: slate-900
- Text Secondary: slate-600
- Border: slate-200

**Dark Mode**:
- Background: slate-950
- Surface: slate-900 with glass overlays (bg-slate-900/90 backdrop-blur-md)
- Text Primary: slate-100
- Text Secondary: slate-300
- Border: slate-800

**Brand Colors**:
- Primary: indigo-600 (light), indigo-500 (dark) — CTAs, links, focus states
- Accent: emerald-500/600 — success states, positive metrics
- Destructive: red-600/500
- Warning: amber-500/600

**Trust Signals**: Razorpay orange (#528FF0 blue), green checkmarks, security badges

---

## Layout System

**Spacing Primitives** (Tailwind units):
- Core spacing: 2, 4, 6, 8, 12, 16, 20, 24, 32
- Section padding: py-16 lg:py-24 xl:py-32
- Container: max-w-7xl mx-auto px-4 lg:px-8
- Card padding: p-6 lg:p-8
- Component gaps: gap-4, gap-6, gap-8

**Grid Patterns**:
- Service Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Category Tiles: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- Dashboard Stats: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4

---

## Component Library

**Navigation**:
- Glass navbar: sticky top-0, backdrop-blur-md, border-b
- Logo: text-2xl font-bold (Plus Jakarta Sans)
- Links: text-sm font-medium, hover:text-primary transition
- Mobile: Sheet drawer with stacked links

**Buttons** (shadcn/ui):
- Primary: bg-primary text-white, rounded-lg, px-6 py-3, shadow-lg
- Secondary: border border-input, bg-background
- Ghost: hover:bg-accent/10
- Hover: scale-[1.02], shadow intensify, y:-1px
- On images: backdrop-blur-md bg-white/20 (no additional hover blur)

**Cards**:
- Border: rounded-2xl, border border-border
- Shadow: shadow-xl (light), shadow-2xl with slate-800/5 (dark)
- Hover: scale-[1.02], shadow-2xl, transition duration-300
- Glass variant: bg-white/90 dark:bg-slate-900/90 backdrop-blur-md

**Forms**:
- Inputs: rounded-lg, border-input, focus:ring-2 focus:ring-primary
- Labels: text-sm font-medium mb-2
- Errors: text-red-600 text-sm mt-1
- Success: text-emerald-600 with checkmark icon

**Service Card**:
- Icon (Lucide): w-12 h-12, text-primary, mb-4
- Title: text-xl font-semibold mb-2
- Summary: text-muted-foreground text-sm mb-4
- Footer: flex justify-between items-center (price, ETA badge)
- Badge: rounded-full px-3 py-1 text-xs bg-primary/10 text-primary

---

## Motion & Animation

**Framer Motion Settings**:
- Page transitions: fade + y:20→0, duration:0.35s, ease:[0.22,1,0.36,1]
- Staggered grids: staggerChildren:0.04, delayChildren:0.1
- Card hover: whileHover={{ scale:1.02, y:-2 }}
- Button hover: whileHover={{ y:-1 }}, whileTap={{ scale:0.98 }}
- Respect prefers-reduced-motion

**Micro-interactions**:
- Focus rings: ring-2 ring-primary ring-offset-2
- Loading states: Skeleton shimmer (linear-gradient animation)
- Toasts: slide-in-right, auto-dismiss 4s
- Tooltips: fade-in on hover, 200ms delay

---

## Key Pages

### Home Hero
**Layout**: Full-width hero with glass overlay navigation
- Background: Gradient mesh (indigo-500 to emerald-500, 20% opacity) OR professional hero image (diverse business team, Indian setting, bright workspace)
- Content: Centered, max-w-4xl
- H1: "Your Entire Business, Handled." (Plus Jakarta Sans, bold)
- H2: "From idea to IMPACT. From concept to running brand. 300+ services. One platform."
- CTA Row: Two buttons side-by-side, gap-4
  - "Student? Get Started" (Primary)
  - "Business? Explore Services" (Secondary)
- Trust Bar: Below CTAs, text-sm with icons (Razorpay logo, shield icon, checkmark)

**Category Tiles Section**: 
- 4-column grid on desktop, animated on scroll
- Each tile: icon, name, service count, hover lift effect

### Service Detail Page
**Structure**:
- Breadcrumb navigation
- Hero: Service icon (large), name, summary, price+ETA in glass card
- Tabs: Problem → Outcome → What's Included → Prerequisites → Timeline → FAQs
- Reviews section: 5-star ratings, testimonial cards
- Sticky sidebar: Price breakdown, "Add to Cart" CTA

### Dashboard
**Layout**: Sidebar (fixed) + Main content
- Sidebar: Logo, nav links with icons, user avatar at bottom
- Main: Stats cards (4-column grid), Recent Orders table, Quick Actions
- Card metrics: Large number (text-3xl), label, trend indicator

### Auth Pages
**Login/Register**: Centered card (max-w-md), glass effect
- Logo at top
- Form fields with icons
- Social login: Google button with logo
- Footer links: "Forgot password?", "Don't have account?"

**Profile**: Two-column layout
- Left: Avatar (large, upload button), name, role badge
- Right: Editable fields (name, email, phone), change password section

**404**: Centered content
- Large 404 text (text-9xl, font-bold, gradient)
- Search input (large, rounded-full)
- CTAs: "Go Home", "Browse Services"

---

## Images

**Hero Image** (if used instead of gradient):
- Professional photo: Indian business professionals, bright modern office, diverse team
- Treatment: Overlay with gradient (black 0%→60% opacity top-to-bottom)
- Buttons use backdrop-blur-md bg-white/20 for visibility

**Service Category Banners**:
- Abstract, minimalist illustrations representing each category
- Subtle gradient overlays with glass label (category name)

**Profile Avatar**:
- Circular, 128x128px, border-4 border-white shadow-xl
- Upload via Supabase Storage

**Optimize**: WebP/AVIF format, descriptive alt text, lazy loading

---

## Accessibility & Polish

- Semantic HTML5: header, nav, main, section, footer
- ARIA labels on icon-only buttons
- Keyboard navigation: visible focus rings, no traps
- Color contrast: WCAG AA (4.5:1 text, 3:1 UI)
- Skip to main content link
- Loading skeletons for async content
- Error boundaries with friendly messages
- Optimistic UI updates where possible