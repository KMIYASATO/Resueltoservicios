# Data Model

## Schemas

- `public`: application-visible tables, safe views and exposed functions.
- `private`: internal rules and sensitive configuration.
- `billing`: payments, refunds, commissions and payouts.
- `messaging`: conversations and messages.
- `support`: disputes and support cases.
- `audit`: immutable critical events.

## Core Tables

- `profiles`: user profile linked to `auth.users`.
- `customer_addresses`: customer saved addresses.
- `professional_profiles`: public and operational professional data.
- `categories`: service categories.
- `services`: services grouped by category.
- `professional_services`: professional prices and service settings.
- `cities`, `districts`: service coverage.
- `professional_coverage_zones`: professional coverage by district.
- `availability_rules`, `availability_exceptions`, `availability_blocks`: scheduling model.
- `bookings`: reservation lifecycle.
- `booking_price_snapshots`: immutable price at booking time.
- `payments`, `payment_events`, `refunds`, `professional_payouts`: billing model.
- `conversations`, `conversation_participants`, `messages`, `message_attachments`: messaging.
- `reviews`, `review_moderation_events`: reputation.
- `disputes`, `dispute_evidence`, `dispute_events`: claims.
- `audit_events`: critical traceability.

## Non-Deletion Rule

Bookings, payments, payouts, refunds, disputes and audit events must not be physically deleted.
