# Interaction Specification

## Visual System Update

Resuelto now uses the updated approved palette:

- Aquamarine: `#98DBC6`
- Turquoise: `#5BC8AC`
- Canary Yellow: `#E6D72A`
- Pink Tulip: `#F18D9E`

This replaces the previous blue/orange implementation in code. The interaction implementation centralizes the new values in CSS variables and Tailwind tokens.

## Motion Tokens

- `--duration-instant`: 80ms
- `--duration-fast`: 140ms
- `--duration-normal`: 200ms
- `--duration-slow`: 280ms
- `--duration-emphasis`: 360ms
- `--ease-standard`: cubic-bezier(0.2, 0.8, 0.2, 1)
- `--ease-enter`: cubic-bezier(0.16, 1, 0.3, 1)
- `--ease-exit`: cubic-bezier(0.4, 0, 1, 1)

## Header

- Trigger: scroll, mobile menu button, navigation links.
- Behavior: sticky header with subtle border/shadow, mobile drawer with overlay.
- Keyboard: Escape closes drawer; focusable links remain accessible.
- Mobile: menu button exposes `aria-expanded`.
- Acceptance: navigation is available at all viewports.

## Search

- Trigger: focus, typing, keyboard arrows, Enter, Escape.
- Behavior: service and district comboboxes show suggestions and no-results state.
- States: empty, focused, selected, no results, submitting.
- Keyboard: ArrowUp, ArrowDown, Enter, Escape.
- Acceptance: form prevents empty submission and preserves values.

## Category Explorer

- Trigger: click, keyboard focus, category button selection.
- Behavior: one active category at a time.
- States: default, hover, focus, active, selected.
- Mobile: buttons wrap and remain 44px minimum.

## Cards

- Trigger: hover, focus, active.
- Behavior: full service card navigates to results.
- States: hover lift, active scale, focus-visible ring.

## FAQ

- Trigger: click, Enter, Space.
- Behavior: accordion with `aria-expanded` and one item open by default.
- Acceptance: content can be opened without mouse.
