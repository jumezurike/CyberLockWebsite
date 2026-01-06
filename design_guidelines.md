# CyberLockX Design Guidelines

## Design Approach
**Hybrid Enterprise SaaS**: Drawing from Cloudflare's security positioning + Stripe's professional restraint + Linear's precise typography. Emphasizes trust, clarity, and technical credibility for healthcare cybersecurity.

## Typography System
- **Headings**: Inter, bold weights (700-800). Hero h1 at text-5xl/text-6xl, section headers text-3xl/text-4xl
- **Body**: Inter regular (400), medium (500) for emphasis. Body text-base/text-lg
- **Technical elements**: JetBrains Mono for code snippets, assessment scores, or data displays

## Spacing Architecture
Primary units: **4, 6, 8, 12, 16, 24** (p-4, gap-6, py-8, space-y-12, py-16, py-24)
- Section padding: py-16 mobile, py-24 desktop
- Component gaps: gap-6 for cards, gap-8 for larger grids
- Container max-width: max-w-7xl

## Layout Structure

**Hero Section** (Full-width, h-auto min-h-screen):
- Large background image (blurred healthcare/tech workspace or abstract security visualization)
- Centered content with max-w-4xl
- H1 + subtitle + dual CTA (primary "Get Early Access" + secondary "View Assessment")
- Trust indicators below CTAs: "HIPAA Compliant • SOC 2 Certified • 500+ Healthcare Partners"
- Buttons have backdrop-blur-md bg-white/10 treatment over image

**Partner Tiers Section** (py-24):
- 3-column grid (lg:grid-cols-3)
- Cards with border, shadow-sm, hover:shadow-lg transitions
- Each tier: Badge/label at top, tier name, feature list with checkmarks, CTA button
- Tiers: Essential, Professional, Enterprise
- Use subtle gradients or borders to differentiate

**Early Access Form Section** (py-24, split layout):
- 2-column: Form (60%) + Benefits list (40%)
- Form fields: Company, Email, Role, Company Size (dropdown), Use Case (textarea)
- Benefits sidebar: "Join 200+ early adopters", feature bullets with icons
- Full-width CTA button at form bottom

**Assessment Tools Section** (py-24):
- Interactive preview of assessment interface
- Cards showing: "Security Scorecard", "Compliance Checker", "Risk Matrix"
- Each card: Icon, title, description, "Try Assessment →" link
- 2-column grid on desktop, stack mobile

**Features Grid** (py-24):
- 4-column grid becoming 2-col tablet, 1-col mobile
- Each feature: Heroicon, bold title, 2-line description
- Features: Real-time Monitoring, Threat Detection, Compliance Dashboard, Audit Logs, Encrypted Storage, Access Controls

**Social Proof Section** (py-16):
- Logos grid of healthcare partners (8-12 logos in 4-6 columns)
- Testimonial cards: 2-column layout with hospital/clinic names, role, quote
- Include headshot placeholders

**Footer** (py-16):
- 4-column layout: Product links, Resources, Company, Legal
- Newsletter signup with inline form
- Social links and compliance badges

## Component Specifications

**Cards**: 
- Border with rounded-xl, p-6/p-8
- Hover state: shadow-md → shadow-xl, subtle translate-y
- Background subtle treatment (border-l-4 with accent for emphasis)

**Buttons**:
- Primary: Solid, px-8 py-3, rounded-lg, font-medium
- Secondary: Outline variant
- Text links: Underline on hover, arrow icon

**Form Inputs**:
- Consistent height (h-12), rounded-lg, border focus state
- Labels above inputs, help text below in muted color
- Error states with red border + message

**Icons**: 
- Heroicons throughout
- 24px (w-6 h-6) for inline, 32px (w-8 h-8) for feature cards, 48px (w-12 h-12) for hero elements

## Images

**Hero Background**: 
- Full-width, professional healthcare technology environment - modern hospital command center or abstract data security visualization with depth
- Dark overlay (bg-black/60) to ensure text readability
- Position: object-cover, absolute with z-index layering

**Partner Logos**:
- Grayscale treatment, proper spacing in grid
- Hover: Full color transition

**Testimonial Photos**:
- Rounded-full, w-16 h-16, positioned left of quote

## Page Flow
1. Hero (immediate impact + clear value)
2. Partner Tiers (social proof + monetization)
3. Features Grid (capability demonstration)
4. Assessment Tools (interactive value prop)
5. Early Access Form (conversion focus)
6. Social Proof (trust reinforcement)
7. Footer (navigation + newsletter)

## Critical Design Principles
- **Trust-first**: Professional imagery, healthcare context, compliance badges prominent
- **Breathing room**: Don't pack sections - generous py-24 spacing
- **Clear hierarchy**: Distinct visual weight between sections
- **Data visualization**: Use subtle charts/graphs in assessment preview
- **No animations**: Minimal, professional transitions only (hover states, shadow changes)