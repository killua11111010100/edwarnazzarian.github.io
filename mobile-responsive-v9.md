# Mobile Responsive V9 Design

## Goal

Recompose the existing anime portfolio for 360–1024 px screens, improve muted-text contrast, and add recruiter-focused content without changing the established visual identity.

## Requirements

- Preserve the Joy Boy hero, Gojo About effect, project galleries, Black Asta contact interaction, bilingual FR/EN content, and `Software Developer` title.
- Use compact mobile spacing and prevent horizontal page overflow at 360, 390, 430, 768, and 1024 px.
- Keep the top wordmark and language switch visible; use the existing bottom navigation as the primary mobile navigation.
- Keep touch targets at least 44 px tall and expose visible keyboard focus.
- Recompose the hero so text, Edwar portrait, Joy Boy, aura control, and the projects CTA do not overlap.
- Stack narrative sections on mobile; keep project galleries swipeable with scroll snap and readable cards.
- Use `#484640` for muted text on light backgrounds and `#cbc9d6` for secondary text on dark backgrounds.
- Add a bilingual “What I bring” strip, concise project impact blocks, and a bilingual copy-email action.
- Respect `prefers-reduced-motion` and coarse-pointer/touch devices.

## Validation

Automated static checks cover semantic content, responsive breakpoints, contrast tokens, touch handling, and reduced motion. Browser QA covers the representative mobile and tablet widths when the preview browser is available.
