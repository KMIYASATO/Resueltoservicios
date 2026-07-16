# API Contracts

## Public Reads

- `GET /services`: active categories and services.
- `GET /professionals`: public professional search with filters.
- `GET /professionals/:id`: public profile details.

## Authenticated Customer Operations

- `POST /bookings/draft`: create authorized booking draft.
- `POST /bookings/:id/confirm`: confirm booking through a secure function.
- `POST /bookings/:id/cancel`: cancel booking with rule evaluation.
- `POST /reviews`: create review after completed booking.
- `POST /disputes`: create dispute linked to own booking.

## Professional Operations

- `POST /professional/services`: manage own services.
- `POST /professional/availability`: manage own availability.
- `POST /bookings/:id/accept`: accept assigned booking.
- `POST /bookings/:id/state`: request allowed state transition.

## Admin Operations

Admin operations must run through protected backend routes or Edge Functions. They must not expose privileged keys to the browser.

## Error Shape

```json
{
  "code": "booking_slot_unavailable",
  "message": "Ese horario ya no esta disponible. Elige otro momento.",
  "requestId": "uuid"
}
```
