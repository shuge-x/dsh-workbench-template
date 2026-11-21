---
version: alpha
name: Drafito Store Design System
description: "A clean, high-trust commerce interface for Drafito — a Chinese storefront for official AI subscription top-ups (ChatGPT Plus / Pro, Grok, etc.). The system is an Apple-flavored, efficiency-first shop — a white canvas with warm-grey section panels, near-black pine-green ink, and a single saturated emerald brand green (#008d63) reserved for CTAs, prices-as-action, and accent text. Unlike consumer AI brands that lean cool blue, Drafito's voltage is the deep-green + silver membership card imagery — the product is the hero. Type voice is purely system-native (SF Pro Display / PingFang SC) with tight negative tracking and a wide 350–650 weight range, no external web fonts. A pill-shaped button language (100px radius) and a 1.586-aspect gradient membership card are the two signature shapes. Full light/dark themes ship as first-class tokens."
colors:
  primary: "#008d63"
  primary-strong: "#007651"
  primary-soft: "#e9f5ef"
  accent-text: "#007a56"
  on-primary: "#ffffff"
  ink: "#1d2824"
  ink-2: "#59645e"
  ink-3: "#717b75"
  bg: "#ffffff"
  bg-warm: "#f5f6f5"
  surface: "#ffffff"
  surface-2: "#f0f3f1"
  store-panel: "#f5f6f5"
  store-glass: "#ffffffdb"
  border: "#e6eae7"
  border-strong: "#cbd4ce"
  gold: "#c5b88d"
  gold-strong: "#756336"
  gold-soft: "#f6f2e6"
  plum: "#65766b"
  plum-soft: "#edf1ee"
  success: "#00845d"
  warning: "#b6770a"
  danger: "#dc2626"
  focus-ring: "0 0 0 4px #008d6326"
  card-green-text: "#effff8"
  card-green-secondary: "#c0e7d9"
typography:
  display-h1:
    fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: clamp(2.8rem, 4.6vw, 4rem)
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: -0.055em
  section-title:
    fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif"
    fontSize: 1.8rem
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.04em
  block-title:
    fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif"
    fontSize: 1.65rem
    fontWeight: 550
    lineHeight: 1.4
    letterSpacing: -0.045em
  card-title:
    fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif"
    fontSize: 1.02rem
    fontWeight: 550
    lineHeight: 1.4
    letterSpacing: -0.035em
  price:
    fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif"
    fontSize: 1.5rem
    fontWeight: 550
    lineHeight: 1.4
    letterSpacing: -0.05em
  card-plan:
    fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif"
    fontSize: clamp(1rem, 13cqw, 2.7rem)
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -0.055em
  brand:
    fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif"
    fontSize: 1.05rem
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: -0.035em
  body:
    fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif"
    fontSize: 0.88rem
    fontWeight: 400
    lineHeight: 1.95
    letterSpacing: 0
  nav-link:
    fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif"
    fontSize: 0.78rem
    fontWeight: 450
    lineHeight: 1.4
    letterSpacing: 0
  button:
    fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif"
    fontSize: 0.79rem
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0
  caption:
    fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif"
    fontSize: 0.66rem
    fontWeight: 400
    lineHeight: 1.85
    letterSpacing: 0
  eyebrow:
    fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif"
    fontSize: 0.65rem
    fontWeight: 550
    lineHeight: 1.4
    letterSpacing: 0.15em
  micro:
    fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif"
    fontSize: 0.55rem
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.08em
rounded:
  sm: 10px
  md: 16px
  lg: 22px
  xl: 30px
  pill: 9999px
  note: 13.6px
  membership: 17.6px
  product: 19.2px
spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  section: 40px
  block: 64px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 12px 21px
    height: 44px
  button-primary-active:
    backgroundColor: "{colors.primary-strong}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
  button-small:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 9px 16px
    height: 38px
  button-text-link:
    backgroundColor: transparent
    textColor: "{colors.accent-text}"
    typography: "{typography.button}"
  top-nav:
    backgroundColor: "{colors.store-glass}"
    textColor: "{colors.ink-2}"
    typography: "{typography.nav-link}"
    height: 72px
  announcement-bar:
    backgroundColor: "{colors.bg-warm}"
    textColor: "{colors.ink-2}"
    typography: "{typography.micro}"
    height: 41px
  hero-band:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    typography: "{typography.display-h1}"
    padding: 38px 0 42px
  collection-band:
    backgroundColor: "{colors.store-panel}"
    textColor: "{colors.ink}"
    typography: "{typography.section-title}"
    padding: 48px 0 40px
  product-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.card-title}"
    rounded: "{rounded.product}"
    padding: 19px
    border: "1px solid {colors.border}"
  product-price:
    textColor: "{colors.ink}"
    typography: "{typography.price}"
  membership-card-green:
    background: "radial-gradient(ellipse at 9% 0%, #4a9d82 0%, transparent 49%), linear-gradient(116deg, #164f40, #0c382d 62%, #1e604a)"
    textColor: "{colors.card-green-text}"
    rounded: "{rounded.membership}"
    aspectRatio: 1.586
  membership-card-silver:
    background: "radial-gradient(ellipse at 21% 3%, #ffffff 0%, transparent 57%), linear-gradient(121deg, #c1c8c5, #e9eeeb 45%, #b8c0bc)"
    textColor: "#303837"
    rounded: "{rounded.membership}"
    aspectRatio: 1.586
  membership-card-graphite:
    background: "radial-gradient(ellipse at 15% 0%, #5c5e5b 0%, transparent 58%), linear-gradient(120deg, #2e3231, #1b1e1d 65%, #444843)"
    textColor: "#f3f2ef"
    rounded: "{rounded.membership}"
    aspectRatio: 1.586
  search-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.pill}"
    padding: 0 10px 0 14px
    height: 37px
    border: "1px solid {colors.border}"
  plan-pill:
    backgroundColor: transparent
    textColor: "{colors.ink-2}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.pill}"
    height: 35px
  plan-pill-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  faq-item:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    borderBottom: "1px solid {colors.border}"
  text-link-accent:
    backgroundColor: transparent
    textColor: "{colors.accent-text}"
    typography: "{typography.nav-link}"
  site-footer:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink-2}"
    typography: "{typography.caption}"
    padding: 38px 0 19px
---

## Overview

Drafito is a **clean, trust-first commerce storefront** for official AI subscription top-ups. It does not feel like a SaaS marketing site — it feels like a well-organized Apple Store page: a quiet white canvas, disciplined type, generous product photography, and one decisive brand color that signals "buy" without shouting. The commercial intent is direct (pick a card, pay, redeem), and the interface removes every decorative distraction that could slow that down.

The base atmosphere is a **white-to-warm-grey rhythm**: the page floor is `{colors.bg}` (#ffffff), while the product collection band steps down to `{colors.store-panel}` (#f5f6f5). This is the only band-contrast in the system — there is no dark hero and no navy footer. Depth comes from thin hairlines and very faint shadows, never from large color blocks.

Brand voltage comes from a **single emerald green** (`{colors.primary}` — #008d63). It is the only chromatic accent: primary buttons, in-stock dots, the announcement icon, eyebrow labels, section links, and the green membership card. Everything else is pine-tinted neutrals (`{colors.ink}` — #1d2824 through `{colors.ink-3}` — #717b75) and warm greys. This is a deliberate counter-position to the blue-violet palette of most AI products.

The product itself is the hero. The dominant visual is a **1.586-aspect "membership card"** rendered as a layered CSS gradient (deep green / silver / graphite variants) with a subtle noise overlay, a gold chip, and an engraved contour pattern. It appears in the hero at large scale and repeats as the product thumbnail in every card — real product chrome, not abstract illustration.

**Key Characteristics:**
- White canvas (`{colors.bg}`) with warm-grey collection band (`{colors.store-panel}`) — a two-surface system, no dark mode inversion of layout.
- Emerald brand green (`{colors.primary}` — #008d63) used sparingly and consistently on CTAs, stock indicators, and inline accents. Deep-green press state (`{colors.primary-strong}` — #007651).
- Pine-black ink (`{colors.ink}` — #1d2824), never pure black — text reads as warm and slightly organic against white.
- Pure system font stack — SF Pro Display / SF Pro Text with PingFang SC for Chinese. No web font is loaded. Display tracking is tight (-0.035em to -0.055em), weights span an unusually wide 350–650 range on variable SF.
- Pill button language: every button and search field uses `{rounded.pill}` (9999px), giving the commerce UI a soft, friendly edge despite its efficiency focus.
- The 1.586-aspect membership card with gradient + noise + gold chip is the signature asset and the page's visual anchor.
- Small type by default: body at 0.88rem (~14px), captions down to 0.55rem (~9px). Information density is intentionally high.
- Full light/dark themes are shipped as first-class token sets — dark inverts all hues toward pine-black rather than neutral grey.

## Colors

### Brand & Accent
- **Brand Green / Primary** (`{colors.primary}` — #008d63): The single signature accent. Fills every primary CTA, the in-stock dot, the eyebrow bullet, and the "official top-up" reassurance icons. Never used as a large background — its power comes from scarcity.
- **Brand Green Strong** (`{colors.primary-strong}` — #007651): Press state for primary buttons; also the border tone for selected spec pills.
- **Brand Green Soft** (`{colors.primary-soft}` — #e9f5ef): Selected-spec pill background and the subtle hover wash.
- **Accent Text** (`{colors.accent-text}` — #007a56): Slightly darker green reserved for text links, section "view all" links, the eyebrow label, nav hover, and the announcement-bar icon — green as a reading cue, not a fill.
- **On Primary** (`{colors.on-primary}` — #ffffff): White text on green fills.

### Surface
- **Background** (`{colors.bg}` — #ffffff): Default page floor. Pure white — the trust signal of a storefront.
- **Background Warm** (`{colors.bg-warm}` — #f5f6f5): Announcement bar, plan-pill container, and the product-card ghost state.
- **Surface** (`{colors.surface}` — #ffffff): Cards and dropdowns; identical to background, separated by border rather than color.
- **Surface 2** (`{colors.surface-2}` — #f0f3f1): Search button circle and inner card placeholders.
- **Store Panel** (`{colors.store-panel}` — #f5f6f5): The product-collection band — the one broad surface shift on the page.
- **Store Glass** (`{colors.store-glass}` — #ffffffdb): Sticky header's translucent white (80%+ opacity) with `saturate(150%) blur(20px)` backdrop.
- **Border** (`{colors.border}` — #e6eae7): 1px hairline on product cards, search input, FAQ rows, and footer dividers.
- **Border Strong** (`{colors.border-strong}` — #cbd4ce): Emphasized hairline; also the pale large guide-step numbers (01/02/03).

### Text
- **Ink** (`{colors.ink}` — #1d2824): All headlines, prices, and primary text. Pine-tinted near-black.
- **Ink 2** (`{colors.ink-2}` — #59645e): Default secondary text — descriptions, nav links, reassurance lines.
- **Ink 3** (`{colors.ink-3}` — #717b75): Weakest text — product kickers, footnotes, footer bottom, guide numbers' caption.
- **Card Green Text / Secondary** (`{colors.card-green-text}` — #effff8, `{colors.card-green-secondary}` — #c0e7d9): The two-tone type inside the green membership card.

### Semantics & Accents
- **Success** (`{colors.success}` — #00845d): Available / in-stock status.
- **Warning** (`{colors.warning}` — #b6770a): Price and promo accents.
- **Danger** (`{colors.danger}` — #dc2626): Validation and error states (inherited from the shared UI layer).
- **Focus Ring** (`{colors.focus-ring}` — `0 0 0 4px #008d6326`): 4px green-at-15% ring on keyboard focus.

### Dark Theme Override
Dark mode is a token swap, not a layout change. Every surface and ink value inverts toward pine-black:
`{colors.bg}` → `#151b18` · `{colors.bg-warm}` → `#111713` · `{colors.surface}` → `#1c2420` · `{colors.surface-2}` → `#26322b` · `{colors.store-panel}` → `#101712` · `{colors.store-glass}` → `#151b18ec` · `{colors.ink}` → `#edf4ee` · `{colors.ink-2}` → `#bac8bf` · `{colors.ink-3}` → `#9aaa9f` · `{colors.border}` → `#334239` · `{colors.primary}` → `#65d4a1` · `{colors.primary-strong}` → `#8be5b9` · `{colors.primary-soft}` → `#20392c` · `{colors.accent-text}` → `#7bd8ac` · `{colors.on-primary}` → `#102b1d`.

The membership card variants do **not** swap — the green / silver / graphite card artwork stays identical in both themes.

## Typography

### Font Family
The system runs entirely on the **native system stack**: `{typography.display-h1}` and all headings use **SF Pro Display**, falling back through `-apple-system`, `BlinkMacSystemFont`, `Helvetica Neue`, `PingFang SC`, `Microsoft YaHei`, `sans-serif`. Body and UI labels use **SF Pro Text** with the same fallback chain. There are no `@font-face` declarations and no external font requests — the typographic consistency comes from the OS, not a downloaded asset.

The display/body split is functional:
- SF Pro Display (weight 550–650, negative tracking) → h1, section titles, prices, card plan names, brand wordmark
- SF Pro Text (weight 400–450) → body copy, navigation, buttons, captions, footnotes

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-h1}` | clamp(2.8rem, 4.6vw, 4rem) | 600 | 1.18 | -0.055em | Hero h1 — "官方充值，快、好、省。" |
| `{typography.section-title}` | 1.8rem (~28.8px) | 600 | 1.3 | -0.04em | Collection heading "Pick a card. Go further." |
| `{typography.block-title}` | 1.65rem (~26.4px) | 550 | 1.4 | -0.045em | Purchase-guide and FAQ section titles |
| `{typography.card-title}` | 1.02rem (~16.3px) | 550 | 1.4 | -0.035em | Product names in cards |
| `{typography.price}` | 1.5rem (24px) | 550 | 1.4 | -0.05em | Product price ¥ value |
| `{typography.card-plan}` | clamp(1rem, 13cqw, 2.7rem) | 500 | 1.1 | -0.055em | Membership card plan name — container-relative |
| `{typography.brand}` | 1.05rem (~16.8px) | 650 | 1.2 | -0.035em | Drafito wordmark |
| `{typography.body}` | 0.88rem (~14px) | 400 | 1.95 | 0 | Hero description, lead copy |
| `{typography.nav-link}` | 0.78rem (~12.5px) | 450 | 1.4 | 0 | Top nav, FAQ summary, footer columns |
| `{typography.button}` | 0.79rem (~12.6px) | 500 | 1 | 0 | All button labels |
| `{typography.caption}` | 0.66rem (~10.6px) | 400 | 1.85 | 0 | Product descriptions, footer text |
| `{typography.eyebrow}` | 0.65rem (~10.4px) | 550 | 1.4 | 0.15em | Section eyebrow labels with wide tracking |
| `{typography.micro}` | 0.55rem (~8.8px) | 500 | 1.4 | 0.08em | Product kicker, stock label, fine print |

### Principles
Display sizes carry **negative letter-spacing** (-0.035em to -0.055em) — without it the tight SF Pro headings read as generic. Weights are deliberately light-to-medium (550/600) rather than heavy; the 650 brand wordmark is the single boldest moment on the page. The wide 350–650 spread assumes a variable font — on static fonts, map 550→500 and 450→400.

Body copy runs at 0.88rem with a generous 1.95 line height, creating loose, readable paragraphs despite the small size. The very small caption and micro sizes are intentional — the storefront is information-dense, and hierarchy is carried by color (`{colors.ink}` vs `{colors.ink-3}`) as much as by size.

Membership-card type is **container-query driven**: `{typography.card-plan}` uses `cqw` units inside a `container-type: inline-size` card, so the plan name scales with card width rather than viewport. Secondary card labels use `clamp()` with `cqw` at 2.3–4.4cqw. This keeps card typography proportional at hero scale and thumbnail scale alike.

## Layout

### Spacing System
- **Base unit:** 4px (0.25rem). All spacing is expressed in rem against a 16px root.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 20px · `{spacing.xl}` 24px · `{spacing.xxl}` 32px · `{spacing.section}` 40px · `{spacing.block}` 64px.
- **Global block gap:** none — the Drafito theme sets the shared `--gap-block` to 0. Section rhythm is produced entirely by component padding, not a global gap.
- **Band padding:** collection band `{spacing.section}` top / 40px bottom; purchase guide and FAQ `{spacing.block}` vertical; hero 38px top / 42px bottom.
- **Card internal padding:** `{spacing.lg}` (19px) on product cards; 12–21px on buttons; 6–7% of card width on membership cards.

### Grid & Container
- **Max content width:** 1160px, centered, via `width: calc(100% - 5rem)`. Mobile drops to `calc(100% - 2.25rem)`.
- **Header:** flex row, min-height 72px (64px tablet / 60px small), brand at left, nav center-left, actions cluster pushed right with `margin-left: auto`.
- **Hero:** 2-column grid `1fr 1fr` with a 4rem gap; copy left, membership-card stage right, min-height 500px.
- **Product grid:** 3-up at desktop inside the collection band; each card is a flex column with the purchase row pinned to the bottom via `margin-top: auto`.
- **Guide & FAQ:** split grid `0.85fr 2fr` with a 3rem gap — a narrow label column and a wide content column.
- **Footer top:** 3-column grid `2fr 1fr 1fr` with a 3rem gap; brand occupies the double-width first column.

### Whitespace Philosophy
Whitespace is **functional, not atmospheric**. The page moves in tight, decisive steps: a shallow hero, a dense product grid, a compact three-step guide, a short FAQ, a lean footer. There is no 96px marketing breathing room here — the storefront respects the buyer's time. Padding inside cards is moderate (19px) so product information sits close together and comparison is easy.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Page body, footer, guide and FAQ sections |
| Hairline | 1px `{colors.border}` | Product cards, search input, FAQ rows, footer divider |
| Soft lift | `0 2px 8px -3px rgba(33,26,23,.14)` | Dropdowns and small floating elements |
| Card lift | `0 14px 30px -18px rgba(33,26,23,.28)` | Elevated panels |
| Product card | `0 4px 12px -8px #1c402012` — almost invisible | Product cards at rest |
| Membership card | `0 24px 45px -15px #123b2e6b` + inset top highlight | Hero membership card |
| Press | `transform: scale(.97)` | Buttons on active, 80ms |

The elevation philosophy is **border-first, shadow-second**. Most separation comes from 1px hairlines and the surface shift to `{colors.store-panel}`. Shadows are large-radius and very low-alpha, used only where a card must float above its band. The membership card is the one high-drama elevation — a deep green cast shadow that echoes its own gradient.

### Decorative Depth
- The header uses a backdrop-blur glass effect (`saturate(150%) blur(20px)`) over `{colors.store-glass}` — the only "material" in the system.
- Membership cards carry three internal depth layers: a radial color highlight, a `feTurbulence` fractal-noise overlay at 22% opacity in `soft-light` blend mode, and an engraved contour pattern made of concentric border-radius ellipses at 9% opacity.
- The gold chip is a small CSS gradient block (`#dccfaa → #a5a17d → #dcd2b0`) with hairline segment dividers — a tactile detail that sells the card as a real object.
- Guide steps use oversized pale numbers (01/02/03) in `{colors.border-strong}` as background typography.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.sm}` | 10px | Chips, small inline dropdown items |
| `{rounded.note}` | 13.6px | Floating hero note |
| `{rounded.md}` | 16px | Nested panels, dropdown container |
| `{rounded.membership}` | 17.6px | Membership card corners |
| `{rounded.product}` | 19.2px | Product cards, skeleton cards |
| `{rounded.lg}` | 22px | Large panels |
| `{rounded.xl}` | 30px | Plan-pill container |
| `{rounded.pill}` | 9999px (100px) | All buttons, search field, plan pills, status badges |

The pill dominates the interactive layer — buttons, inputs, and selectors are all fully rounded, which softens an otherwise dense commercial interface. Cards stay in the 17–19px range, never pill-shaped.

### Product Imagery
There is no photography in the system. Every product is represented by the **membership card component** in one of three finishes:
- **Green** — `{component.membership-card-green}`; the default and premium finish, deep forest gradient with mint text.
- **Silver** — `{component.membership-card-silver}`; pale brushed-metal gradient with dark ink text.
- **Graphite** — `{component.membership-card-graphite}`; near-black gradient with warm-white text.

Product thumbnails tilt slightly (`rotate(-5deg)`) and straighten on hover (`translateY(-4px) rotate(-2deg)`) with a 350ms spring curve — a small moment of play in an otherwise serious interface.

Icons are **Lucide**, drawn as 1.25–1.6px strokes at 13px, 16px, or 22px. They appear in the announcement bar, reassurance row, guide steps, FAQ toggles, and buttons. No filled or duotone icons.

## Components

### Top Navigation
**`top-nav`** — Sticky white-glass header, 72px tall, `{colors.store-glass}` with a 20px backdrop blur and a 1px bottom hairline. Left: the Drafito shield-style mark and `{typography.brand}` wordmark. Center-left: horizontal nav in `{typography.nav-link}` (Products, 充值教程, etc.), green on hover or active. Right: account dropdown, theme toggle, cart link with a green count badge. Collapses to a hamburger below 900px.

### Announcement Bar
**`announcement-bar`** — A 41px band in `{colors.bg-warm}` directly under the header, centering a `{typography.micro}` trust line ("源头直充 · 同卡续费 · 订阅质保") with a green shield-check icon and a green "购物教程" text link.

### Buttons
**`button-primary`** — The signature CTA. Background `{colors.primary}` (#008d63), white `{colors.on-primary}` text, `{typography.button}`, `{rounded.pill}`, 12px × 21px padding, 44px min-height. Press state `button-primary-active` darkens to `{colors.primary-strong}` (#007651) with a `scale(.97)` transform over 80ms.

**`button-small`** — Compact variant for product cards. Same fill and pill shape, 9px × 16px padding, 38px min-height, slightly smaller type.

**`button-text-link`** — Transparent inline action in `{colors.accent-text}`. Used for "View all", "立即购买" in the hero, and footer links. Carries a small arrow icon.

### Hero
**`hero-band`** — White 2-column hero. Left: a `{typography.eyebrow}` kicker with a 5px green bullet, the tight `{typography.display-h1}` headline (with a green-highlighted word), `{typography.body}` description, a primary button + text link row, and a `{typography.micro}` reassurance row with green check icons. Right: `hero-card-stage` holding a fanned stack of membership cards and a glass floating note showing plan options and price.

**`hero-card-stage`** — A relative-positioned stage with a front green card, a back silver card rotated +9deg, and an absolutely-positioned note at the bottom-right. The note (`{rounded.note}`, 1px white border, glass background) contains the plan pills, the `{typography.price}` price, and the buy text-link.

### Collection & Products
**`collection-band`** — The `{colors.store-panel}` band holding the catalog. Header row: `{typography.section-title}` with a muted trailing count, a "View all" accent link, and a `{typography.nav-link}` filter toolbar (category tabs + `{component.search-input}`).

**`product-card`** — White card, 1px `{colors.border}`, `{rounded.product}`, 19px padding, flex column. Top row: `{typography.micro}` service label and a green in-stock dot. Center: the tilted membership-card art. Bottom: `{typography.card-title}` product name, `{typography.caption}` two-line description, spec pills, and a purchase row with `{typography.price}` price and `{component.button-small}`.

**`plan-pill` / `plan-pill-active`** — Segmented selector inside the hero note. Inactive pills are transparent with `{colors.ink-2}` text; the active pill flips to `{colors.surface}` with `{colors.ink}` text. All use `{rounded.pill}`.

**`search-input`** — 37px pill with a 1px border, magnifier icon, `{typography.nav-link}` input, and a circular `{colors.surface-2}` search button.

### Guide & FAQ
**`guide-step`** — Three-column step row inside the guide band. Each step carries a 22px green Lucide icon, a pale oversized number in `{colors.border-strong}`, a `{typography.nav-link}` title, and a `{typography.caption}` description.

**`faq-item`** — A native `<details>` row with a 1px bottom border. Summary in `{typography.nav-link}` with a rotating 16px plus icon; answer in `{typography.caption}` with a 1.95 line height. Open state rotates the icon 45deg.

### Footer
**`site-footer`** — White footer, no dark inversion. Top grid places the brand and a short line in the double-width first column, followed by two link columns. Bottom row is a hairline-separated `{typography.micro}` line with copyright and legal links.

## Do's and Don'ts

### Do
- Keep the canvas white and the collection band `{colors.store-panel}` — this two-surface shift is the page's entire rhythm.
- Reserve `{colors.primary}` for actions and status only: CTAs, stock dots, eyebrow bullets, accent links. Never use it as a large background fill.
- Use `{typography.card-plan}` with `cqw` units inside membership cards so card type scales with the card, not the viewport.
- Represent every product with the membership-card component — green, silver, or graphite. The card is the product image.
- Keep all interactive elements pill-shaped (`{rounded.pill}`) and all cards in the 17–19px radius range.
- Preserve the negative tracking on display type; it is what makes SF Pro headings feel intentional.
- Use Lucide stroke icons at 1.25–1.6px weight, never filled icons.
- Maintain the full dark-theme token swap — dark mode inverts hue toward pine-black, not neutral grey.

### Don't
- Don't introduce the shared UI layer's blue (`#0071e3`) or violet accents — the store overrides them with green. A blue button is off-brand here.
- Don't add a dark hero or a dark footer. Drafito is light-first; dark mode is a theme, not a section treatment.
- Don't use external web fonts or switch the display face to a serif. The system-native stack is the voice.
- Don't fill large areas with `{colors.primary}`. Green is a signal color, not a surface color.
- Don't round product cards into pills or square off the buttons — the two radius families are distinct.
- Don't use photography or 3D renders for products. The CSS membership card is the product visual.
- Don't document hover states as separate tokens; only default and active/pressed states belong in the system.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Small | < 350px | Membership-card stage height reduces to 235px; card type clamps to lower bound |
| Mobile | < 600px | Container width `calc(100% - 2.25rem)`; header 60px; hero stacks to one column; product grid 1-up |
| Tablet | < 900px | Nav and account links hide, hamburger appears; header 64px; hero 2-column tightens; guide/FAQ columns narrow |
| Desktop | 900–1140px | Full nav, header 72px; 3-up product grid; guide and FAQ split into 0.85fr / 2fr |
| Wide | > 1140px | Container caps at 1160px with auto margins; header gap widens to 3rem |

### Touch Targets
- `{component.button-primary}` — 44px min-height, meets WCAG 44px.
- `{component.button-small}` — 38px min-height, slightly under 44px but visually compact in card rows.
- `{component.search-input}` — 37px height; tap area extends to the full pill.
- Plan pills and FAQ summaries — 35px and ~40px effective tap height respectively.

### Collapsing Strategy
- Hero collapses from 2 columns to 1 at < 600px — copy first, then the card stage below.
- Product grid reduces columns rather than shrinking cards: 3 → 2 → 1.
- Guide and FAQ keep their narrow-label / wide-content split down to tablet, then stack at mobile.
- Header nav becomes a hamburger at < 900px; the cart and theme toggle remain visible.
- Membership-card typography needs no breakpoint rules — container queries handle scaling automatically.

## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key (e.g. `{component.product-card}`, `{component.membership-card-green}`).
2. Variants of a component (`-active`, `-silver`, `-graphite`, `-small`) live as separate entries in `components:`.
3. Use `{token.refs}` everywhere — never inline a raw hex in prose or component definitions.
4. Document default and active/pressed states only. Do not add hover as a formal token.
5. Display stays SF Pro Display 550–650 with negative tracking; body stays SF Pro Text 400–450. No external fonts, no serif.
6. Green + pine-neutral + white is the trinity. Don't introduce a fourth brand hue (no blue, no purple, no coral).
7. When in doubt about emphasis: use `{colors.accent-text}` or a tighter headline before reaching for a heavier weight or a bigger fill.

## Known Gaps

- The source site's CSS names the brand-green variables `--red`, `--red-strong`, `--red-soft` — a legacy of the shared UI token layer. This document normalizes them to semantic `primary` names. When reading the site's stylesheets, map `--red` → `{colors.primary}`.
- The shared UI layer defines a full blue Apple-style token set (`--ui-accent` #0071e3, `--ui-bg-page` #f5f5f7, etc.) that the Drafito storefront overrides. Pages outside the store shell may still use the blue tokens; this document covers the storefront only.
- The membership card's noise overlay is an inline SVG `feTurbulence` filter; it is described but not tokenized as a reusable asset. Treat it as part of the card component.
- Animation and transition timings (card tilt spring, active-scale 80ms, FAQ icon rotation 180ms, announcement modal entrance) are not formalized as tokens.
- The announcement modal, toast notifications, login dialog, and cart drawer are shared UI-layer components and are only partially captured here — they need their own surface pass.
- Exact dark-theme radius, spacing, and typography values are unchanged from light mode; only color tokens swap. This is stated in Colors but not duplicated across every component entry.
- Product data, pricing, and subscription names are content, not design tokens, and are intentionally excluded.
