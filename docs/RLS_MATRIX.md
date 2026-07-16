# RLS Matrix

This is the initial matrix. It must be converted into SQL policies during migration work.

| Table | Role | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|---|
| `profiles` | customer/professional | own row | no direct insert except profile bootstrap | own non-role fields | no |
| `customer_addresses` | customer | own rows | own rows | own rows | soft delete only |
| `professional_profiles` | public | approved public data | no | no | no |
| `professional_profiles` | professional | own full row | own row | own editable fields | no |
| `categories` | public | active rows | no | no | no |
| `services` | public | active rows | no | no | no |
| `professional_services` | public | active public rows | no | no | no |
| `professional_services` | professional | own rows | own rows | own rows | no |
| `bookings` | customer | own rows | secure function only | limited own fields by state | no |
| `bookings` | professional | assigned rows | no | secure transition only | no |
| `messages` | participant | own conversation rows | own conversation rows | no | no |
| `reviews` | public | published rows | completed own booking only | no | no |
| `disputes` | customer/professional | related rows | own related booking | no direct update | no |
| `audit_events` | admin/backend | backend only | backend only | no | no |

## Risks

- Broad `authenticated` policies can cause IDOR.
- Admin access must not rely on frontend role claims.
- Storage buckets need policies matching table ownership.
