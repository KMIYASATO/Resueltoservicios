# Booking State Machine

## Valid States

- `draft`
- `pending_payment`
- `payment_processing`
- `confirmed`
- `accepted`
- `professional_on_the_way`
- `in_progress`
- `completed_by_professional`
- `completed`
- `cancelled_by_customer`
- `cancelled_by_professional`
- `disputed`
- `refunded`
- `closed`

## Initial Valid Transitions

| Origin | Destination | Authorized role | Conditions | Side effects |
|---|---|---|---|---|
| `draft` | `pending_payment` | customer | valid service, address, slot, price | price snapshot |
| `pending_payment` | `confirmed` | backend | payment simulated or authorized | audit, notification |
| `confirmed` | `accepted` | professional | assigned professional | audit, notification |
| `accepted` | `professional_on_the_way` | professional | service day window | audit, notification |
| `professional_on_the_way` | `in_progress` | professional | arrival confirmed | audit |
| `in_progress` | `completed_by_professional` | professional | work marked done | audit, customer notification |
| `completed_by_professional` | `completed` | customer | customer confirms | audit, review enabled |
| any active | `cancelled_by_customer` | customer | cancellation policy allows | penalty/refund calculation |
| any active | `cancelled_by_professional` | professional | reason required | audit, customer notification |
| active/completed | `disputed` | customer/professional | reason and evidence | hold payout |

Invalid transitions must be rejected by PostgreSQL Functions.
