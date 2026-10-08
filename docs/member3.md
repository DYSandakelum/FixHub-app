# Member 3 — Transaction & Engagement

Implemented in the existing Expo SDK 57 / React Native project on the Member-3 branch. References: the four supplied PDFs, especially the high fidelity customer screenshots on milestone pages 12–13. Shared UI lives in `src/components/transaction`, data access in `src/lib/transaction-repository.ts`, shared state in `src/hooks/use-transaction.ts`, and the four screens remain under `src/app/(transaction)`.

## Run your screens

```sh
npm install
npx expo start --web
```

Open `http://localhost:8081/payment`. Other direct routes: `/booking-tracking`, `/chat`, `/rate-review`. The original onboarding entry and the other members' screens are still placeholders. On an emulator, open `exp://YOUR_DEV_SERVER_HOST:8081/--/payment`, or navigate from Member 2's booking confirmation when it is implemented.

Without a `bookingId`, these screens use a local demo. Changes persist with AsyncStorage. The booking status options menu offers Advance Demo Status and Reset Demo. Payment supports all three methods in demo mode. Sample card: `4242 4242 4242 4242`, expiry `12/30`, CVV `123`. No card details are saved or transmitted and no money is charged.

Chat: send a message, long press your own message to delete it, use + for quick messages. Reviews: select stars and optional feedback tags, submit, return to edit, or use the options menu to delete.

## Team integration with Supabase

The workload documents mention Flutter/Firestore, but the actual repository and setup guide use Expo/Supabase. This implementation follows the repository. The included SQL is a proposed isolated transaction schema, not a claim about the team's current database. It has not been applied to the shared server.

1. Add the team's `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` to the local `.env` using the existing setup guide. No credentials are included here.
2. Apply `supabase/migrations/202610080001_member3_transactions.sql` once in a development Supabase project. Verify the RLS policies with customer, provider, unrelated user, and signed-out sessions before adopting it in the shared project.
3. The authentication module must sign in through the existing `src/lib/supabase.ts` client.
4. Member 2's trusted booking backend must create `transaction_bookings` with the authoritative amount, customer/provider auth UUIDs, provider name, service, and formatted booking date. If your team already has booking tables, agree on a mapping and adapt the repository rather than maintaining duplicate records.
5. Navigate with `router.push({ pathname: '/payment', params: { bookingId: booking.id } })`. Keep that ID through tracking/chat/review navigation. A real booking never silently falls back to demo when credentials, authentication, or database access fail.
6. Member 4 can call `advanceBookingStatus(bookingId, 'En Route')`, then Arrived, In Progress, Completed. The database checks provider ownership and requires the next stage. The customer has no live status mutation control.

Live mode reads booking status and chat history, subscribes to Supabase changes, sends/deletes the user's messages, and creates/updates/deletes reviews for completed bookings. Cash-on-delivery records are idempotent and use the database amount. They remain pending collection, rather than being marked paid. Live card/bank transfer requests explicitly fail until a gateway is connected. The SQL contains no card storage, and the client does not claim successful live online payment.

## Fidelity and justified differences

| Screen | Preserved from the PDF | Differences |
| --- | --- | --- |
| Payment | Order summary, LKR 3,500, three radio options, selected blue card payment, card/expiry/CVV layout, fixed Pay Now and bottom navigation | Small demo notice and validation; confirmation dialog |
| Booking Status | Five vertical stages, Confirmed/En Route highlighted, provider card, Contact Provider and bottom navigation | Options menu for refresh and demo status progression; completion links to review |
| Support Chat | Marcus subtitle, left white/right blue bubbles, avatars, timestamps, bottom +/input/send composer | Quick-message menu replaces unspecified attachment action; deletion confirmation; decorative typing indicator omitted because no provider is typing |
| Rate & Review | Marcus portrait/name, four selected blue stars, optional text area, four feedback tags, Submit Feedback/Skip | Selected tags have a distinct state; saved feedback can be edited/deleted |

Portraits are cropped from the supplied prototype. The PDF uses Prasanna on payment/tracking and Marcus on chat/review; demo mode preserves this inconsistency for fidelity. Live mode uses the booking's provider name. The layout scales to the device, respects safe areas and keyboards, scrolls on smaller screens, and preserves large touch targets. The app does not simulate live GPS: the high fidelity tracking screenshot contains a status timeline without a map. A GPS/map feature would need a separate design and location backend.

## Verification checklist

- Payment: empty card errors, future expiry, successful demo payment, already recorded payment, each method.
- Tracking: current stage, options, progression to Completed, review navigation, reset.
- Chat: blank send disabled, message send, deletion, quick messages, persistence after reload.
- Review: all stars, tags, optional comment, submit, edit, delete, persistence.
- Device checks: narrow viewport, keyboard open, long messages/comments, large font sizes.
- Live integration: authenticated ownership, unauthorized read/write rejection, realtime changes, disconnect/retry, idempotent cash record, completed-booking review requirement.

Only Member 3 screens are implemented; the requested four-screen visual review is possible now. The workload's all-17-screen QA remains dependent on the other members completing their screens.
