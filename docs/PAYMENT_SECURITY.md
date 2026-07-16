# Payment Security

Payments are simulated in the MVP until provider, legal model and settlement rules are approved.

## Browser Must Never Define

- subtotal
- discount
- commission
- tax
- total amount
- professional payout
- payment state

## Future Real Payment Flow

```text
Customer requests payment
-> backend recalculates price
-> backend creates payment operation
-> provider processes payment
-> provider sends signed webhook
-> Edge Function verifies signature
-> database updates payment state
-> frontend reads result
```

## Controls

- Idempotency keys.
- Webhook signature verification.
- Expected amount and currency validation.
- Internal and external references.
- Audit events.
- No full card storage.
