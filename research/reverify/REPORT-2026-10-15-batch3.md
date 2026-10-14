# Snapshot re-verification report — 2026-10-15, batch 3

## Method and scope

Evaluated `public/data.js` in a Node `vm` with `{window:{}, document:{}, console}` and exported `BENEFITS`, as in `scripts/check-readability.js`; did not grep-parse the data. Read `REQS` unmet and short messages in `public/app.js` for every record's `requires` keys (including the later short-message assignments). Reviewed only the supplied record-specific status-200 snapshots; no additional pages were fetched. The supplied today-refetched snapshots retain 2026-10-14 timestamps in their headers. Filenames below are relative to `research/reverify/snapshots/`.

Facts are distinct assertions, not appearances or numeric tokens. Repeated assertions across amount, summary, note, eligibility, requiresNote, tables, about/aboutList, steps, documents, tips and gates are consolidated. An amount and its period or an inseparable route's constituent conditions form one assertion; independent assertions have separate rows. Record quotes are verbatim excerpts. Advice without a published factual claim is not counted. Names, UI labels, URLs and internal flags are not benefit facts; required documents and procedural promises are.

**CONFIRMED** requires a supporting snapshot quotation. **DIFFERS** means substantive inconsistency, including numbers, boundaries, lost or added hedges, dropped conditions and scope changes. **NOT ON PAGE** means absent from these record-specific snapshots, not false. Linked pages, PDFs and JavaScript forms are not treated as their unseen contents. Hedges are checked in both directions; a weaker hedge does not establish a different maximum unless the page expressly fixes the amount. Source conflicts are identified rather than silently resolved. No replacement wording is proposed.

**DRES safety guardrail:** `AGENTS.md` requires functional-limitation eligibility rather than diagnosis-based guarantees. `e2e/matcher-safety.spec.js` specifically keeps DRES conditional even for employed, documented Alberta adults, preserves the Convention Refugee route, rejects under-sixteen profiles, warns about institution/training exclusions and prevents injected employment/device answers from manufacturing ready status. Any DRES change needs extra care and guardrail review. This report changes no gates or program text.

## Summary table

Pending completion; per-record sections are saved as each is finished.

## DIFFERS — needs a decision

Pending completion. Each numbered item will correspond to one DIFFERS assertion row; repeated occurrences are consolidated.

## Per-record detail

### taxisaver-translink

Source: `taxisaver-translink--1.txt` (accessible-transit page, HandyCard and TaxiSaver sections).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Price, value, half-price and monthly limit | “$25.00 buys one book with $50.00 worth of coupons, maximum two books per month” | CONFIRMED | --1: “For $25.00, customers can purchase one book of TaxiSavers with $50.00 worth of coupons. Per the Transit Tariff, each member is allowed a maximum of two books per month.” |
| HandyCard membership | “You must be a TransLink HandyCard member.” | CONFIRMED | --1: “available to purchase and be used by HandyCard members.” |
| Scheduled HandyDART unavailable trip scope | “for trips where a scheduled HandyDART ride does not work.” | NOT ON PAGE | TaxiSaver section does not condition trips on unavailable/unsuitable scheduled HandyDART. |
| Separate ordinary taxi / dispatched HandyDART products | “They are separate from taxis dispatched by HandyDART as part of a booked HandyDART trip.” | NOT ON PAGE | Page says HandyCards “cannot be used on HandyDART”, but does not describe dispatched taxi trips. |
| Mail payment and self-addressed envelope | “Order by cheque or money order with a self-addressed envelope” | CONFIRMED | --1: “enclose a cheque(s)/money order(s), and self-addressed envelope(s) (postage not required).” |
| Counter, location and payment | “TransLink Customer Service Centre at Waterfront Station, which takes cash, debit or credit” | CONFIRMED | --1: “TransLink Customer Service Centre (Walk-in Centre) at Waterfront Station”; “Cash, debit, or credit will be accepted.” |
| Representative / original card | “you or your representative must present the original HandyCard.” | CONFIRMED | --1: “The customer (or representative) MUST present their ORIGINAL HandyCard.” |
| Show card to taxi driver | “Show the HandyCard to the taxi driver and use coupons toward the participating taxi fare” | CONFIRMED | --1: “customer should show the taxi driver their HandyCard, confirming that they are eligible.” |
| Post-dated future orders | “You can use post-dated cheques to pre-order future months” | CONFIRMED | --1: “Customers can pre-order for up to 12 months with post-dated cheques for each month.” Record does not claim an unlimited advance period. |
| Purchase / delivery timing | “In person is immediate when stock and eligibility are confirmed; mail delivery varies” | NOT ON PAGE | No immediate-purchase or delivery-duration statement. |
| Phone | “604-953-3680” | CONFIRMED | --1: “Access Transit Customer Care at 604.953.3680”. |
| B.C. / Metro Vancouver gates | “This is a British Columbia program.”; “This TransLink program is for Metro Vancouver residents.” | CONFIRMED | --1: “Accessible Transit in Metro Vancouver guide”; counter address “Vancouver BC”. |
| Transit barrier (REQS.transitBarrier) | “cannot use regular public transit without assistance for some or all trips.” | CONFIRMED | --1: “HandyCard is a photo-identity card for customers who cannot use conventional transit without assistance.” |
| First-registration gate conflates HandyDART and HandyCard | “Register for TransLink HandyDART/HandyCard first.” | DIFFERS | --1: “HandyCards are for use on conventional transit only and cannot be used on HandyDART.” Scope: the gate presents HandyDART/HandyCard interchangeably, while TaxiSaver eligibility specifically requires HandyCard membership. |

### victoria-life

Source: `victoria-life--1.txt` (includes closure updates, benefits, eligibility and adjudicator rules). The page itself has anniversary/calendar-year sticker instructions in tension.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Two-year approval cycle | “It runs two years from your approval date, not by calendar year” | CONFIRMED | --1: “membership will be valid for two years. The two-year cycle begins upon approval date, not limited to January application.” |
| Unqualified local drop-ins / pool coverage | “Two years of unlimited free drop-ins”; “covers pool, skating and regional partner facilities.” | DIFFERS | --1: “Unlimited free drop-in sessions at Victoria Recreation Centre (opening early 2027).”; “50% off instead of unlimited access to Victoria Recreation Centre.” Scope/date: local access is location/opening-qualified and can be replaced by the regional-pass option; pool coverage during closure is not promised. |
| Skating | “covers pool, skating and regional partner facilities.” | CONFIRMED | --1: “Unlimited access to drop-in public skating at Save-On-Foods Memorial Arena.” Skating constituent only; pool is classified above. |
| Regional annual visits | “52 free regional drop-ins a year” | CONFIRMED | --1: “52x free drop-in sessions annually to participating regional partners”. |
| Credit range / age-dependence / full term | “a program credit of $80 to $120 depending on age”; “for the whole two-year term, not per year.” | CONFIRMED | --1: “Credit allotment is for the two-year term.”; “$80 per preschooler (0-5yrs) $120 per youth (6-18yrs) $80 per adults (19yrs +)”. |
| Residency, fixed address, prior thirty days (eligibility / gates) | “City of Victoria resident with a fixed address, have lived there for the previous 30 days, and can demonstrate proof of residency.” | CONFIRMED | --1: “Only City of Victoria residents with a fixed address may apply”; “Applicants must have lived at their address for the previous 30 days and be able to demonstrate proof of residency within the City.” |
| Income boundary / whole household | “at or below the Statistics Canada low-income threshold”; “All family members and dependants at the same address are included.” | CONFIRMED | --1: “Income must be at or below the Statistics Canada low-income threshold”; “This includes all family members/dependants residing at the same address.” |
| Income table, one | “1 person” / “$29,640” | CONFIRMED | --1: “1 $29,640”. |
| Income table, two | “2” / “$38,493” | CONFIRMED | --1: “2 $38,493”. |
| Income table, three | “3” / “$47,145” | CONFIRMED | --1: “3 $47,145”. |
| Income table, four | “4” / “$55,076” | CONFIRMED | --1: “4 $55,076”. |
| Income table, five | “5” / “$62,464” | CONFIRMED | --1: “5 $62,464”. |
| Income table, six | “6” / “$70,451” | CONFIRMED | --1: “6 $70,451”. |
| Income table, seven | “7” / “$78,436” | CONFIRMED | --1: “7 $78,436”. |
| Adjudicator alternative, certainty | “The City also accepts an adjudicator route when standard documents cannot reasonably be provided.” | DIFFERS | --1: “they may still be eligible to apply ... using an adjudicator”; “Adjudicator applications will only be accepted when all required information is provided. Auditing is done for ALL adjudicator forms.” Hedge/dropped condition: blanket acceptance drops possible eligibility and complete-information/audit qualifications. |
| Adjudicator professional familiarity | “an eligible professional who knows the household situation” | CONFIRMED | --1: “professional relationship with the applicant”; “familiar with the applicants financial and residential situation”. |
| One application per same-address family | “Complete one L.I.F.E. application for family members living at the same address” | CONFIRMED | --1: “Please complete one application per family residing at the same household.” |
| Residency documents / recency | “Utility bill, phone bill or rental agreement from the last three months” | CONFIRMED | --1: “current utility bill, phone bill or current rental agreement within the last three months.” |
| CRA proof age boundary | “Most recent CRA Notice of Assessment for household members over 19” | DIFFERS | --1: “most recent ... Notice of Assessment (NOA) for all household members aged 19 and older.” Boundary: over nineteen excludes nineteen-year-olds. |
| Sticker renewal calendar boundary | “The regional 52-visit sticker must be renewed each calendar year” | CONFIRMED | --1: “You will require a new sticker each calendar year.” Also says second-year sticker is “based on their application anniversary date”; source tension retained, not resolved. |
| Credit expiry | “use the program credit before the two-year term ends” | CONFIRMED | --1: “The L.I.F.E. card and credit expires at the end of the two-year term.” |
| Discounted annual regional pass choice | “choosing the discounted regional annual pass” | CONFIRMED | --1: “option to purchase an Annual Regional Recreation Pass at 50% off”. |
| Low-income gate | “This is for lower-income households.” | CONFIRMED | --1: “individuals and families living on a low income.” |
| B.C. gate | “This is a British Columbia program.” | CONFIRMED | --1: “Victoria, B.C.” |

### woodbuffalo-lift

Sources: `woodbuffalo-lift--1.txt` (full program page), `--2.txt` (initial form screen only).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Monthly conventional fare | “$10/month transit pass” | CONFIRMED | --1: “a monthly pass for conventional transit for a nominal fee of $10”. |
| SMART discount / ride packages | “75% off 10- and 25-ride passes for the SMART Bus” | CONFIRMED | --1: “a 75% discount on 10 and 25-ride passes for Specialized Transit”; “purchase their discounted 10 and 25-ride passes from SMART Bus operators.” |
| Specialized service population / door-to-door | “the specialized service for seniors and people with mobility needs”; “door-to-door” | NOT ON PAGE | Specialized Transit is named; these population and door-to-door definitions are not given. |
| Comparative only-two claim | “One of only two municipal programs here that discounts specialized (door-to-door) transit — the other is Lethbridge's Access-A-Ride.” | NOT ON PAGE | No comparison with Lethbridge or catalogue-wide count. |
| AISH income proof | “Your AISH statement is accepted as proof of income.” | CONFIRMED | --1: “Submit ONE of the following for EACH household member 18 years and older: Assured Income for Severely Handicapped (AISH) Form”. |
| Family household application | “Everyone in the household is covered by the one application.”; “your partner and dependent children too” | CONFIRMED | --1: “one application per household”; “All household members (applicant, partner/spouse and dependent children living in the same residence) are eligible for the program's benefits.” |
| Recreation rate / facilities | “60% off memberships at Syncrude Sport and Wellness Centre, Regional Recreation Corporation facilities and Vista Ridge.” | CONFIRMED | --1: “60% discount on Family and Individual memberships at the Syncrude Sport and Wellness Centre, all Regional Recreation Corporation of Wood Buffalo facilities, and Vista Ridge.” |
| Recreation separate application | “The Wood Buffalo Recreation Support Program is separate”; “it's a different application.” | DIFFERS | --1: “Only one application is required to assess Eligibility for the discounted programs.” Scope/procedure: record requires a separate recreation application while page presents the partner offers under one eligibility application. |
| Online / email / in-person application | “Apply online for LIFT, or email community.services@rmwb.ca, or apply in person.” | CONFIRMED | --1: “Online: Apply Now”; “By email: community.services@rmwb.ca”; “In person: Drop off application form at Jubilee Building”. |
| Approval duration / completion qualification | “Allow 7–10 business days for approval.”; “7–10 business days.” | DIFFERS | --1: “You will be notified within 7-10 business days. Applicants must submit a complete application.” Scope/hedge: notification becomes approval timing and loses the complete-application qualification. |
| Purchase SMART from operator after approval | “buy the discounted 10- or 25-ride passes directly from the operator once you're approved.” | CONFIRMED | --1: “After your application is approved”; “purchase their discounted 10 and 25-ride passes from SMART Bus operators.” |
| Address proof document | “Proof of a Wood Buffalo address” | NOT ON PAGE | Residency required, but address-proof document requirement not enumerated in visible form or page. |
| Minimum applicant age | “You must be 18 or older to apply” | DIFFERS | --1: “Be 18 years old or older”; “Individuals under 18 who are living independently may be considered.” Boundary/dropped hedge: absolute eighteen minimum omits possible independent-minor consideration. |
| Single-person income threshold | “about $35,500 for one person” | CONFIRMED | --1: “1 Person $ 35,500.00”. Approximation does not contradict the fixed threshold. |
| Generosity / AISH comparison | “The income line here is generous”; “well above AISH.” | NOT ON PAGE | Neither comparison is published here. |
| Phone | “Pulse: 780-743-7000” | CONFIRMED | --1: “contact Pulse at 780-743-7000.” |
| Municipality gate | “This is a Wood Buffalo (Fort McMurray) program.” | CONFIRMED | --1: “Be a resident of Wood Buffalo”; “Fort McMurray, AB”. |
| Income / route gate | “Confirm the municipality's household-income limit or an accepted benefit-recipient route.” | CONFIRMED | --1: “total household gross income equal to, or less than”; AISH among accepted income documents. This asks confirmation, not automatic income exemption. |
