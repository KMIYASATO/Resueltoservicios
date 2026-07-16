# Interaction Audit

## Scope

Pages reviewed:

- `/`
- `/resultados`
- `/profesionales/[id]`
- `/reserva`

Components reviewed:

- `Button`, `ButtonLink`, `Badge`, `Card`
- `ResueltoLogo`, `MainSearch`, `ServiceCard`, `ProfessionalCard`

## Findings

| Component | Current state | Problem | Impact | Priority | Proposal |
|---|---|---|---|---|---|
| Global tokens | Blue/orange palette | New approved palette not applied | Brand mismatch | High | Replace tokens with turquoise/aquamarine/yellow/pink system |
| Buttons | Default and hover only | Missing active, disabled, loading conventions | Weak feedback | High | Add visible hover, active scale, disabled and loading styles |
| Header | Static/absolute | No sticky behavior or mobile menu | Poor navigation on mobile | High | Add sticky header and accessible mobile drawer |
| Main search | Native selects | No autocomplete, empty/error/loading states | Weak marketplace UX | High | Replace with accessible comboboxes |
| Service cards | Look clickable but are divs | Poor semantics and keyboard navigation | Accessibility issue | High | Make full card a link |
| Categories | Static links | No active state or progressive disclosure | Weak discovery | Medium | Add interactive category explorer |
| FAQ | Static cards | No accordion semantics | Long page and poor mobile scan | Medium | Add accessible accordion |
| Results filters | Static checkboxes | No chips, state, apply/clear | Incomplete search flow | Medium | Add visual states in next phase |
| Booking stepper | Static grid | No current/complete/disabled states | Weak reservation feedback | Medium | Add stateful stepper in next phase |

## Accessibility Issues

- Missing skip link.
- Header mobile navigation missing.
- Search lacks combobox semantics.
- Some decorative icons lack consistent `aria-hidden`.
- Focus exists globally but not always component-specific.
- Cards are not always keyboard actionable.

## Responsive Issues

- Header navigation disappears on mobile without replacement.
- Search controls are usable but not optimized as suggestions/bottom sheet.
- Long category lists need progressive disclosure.

## Dependency Recommendation

No new dependency is required for this phase. Use React, Tailwind and browser APIs.
