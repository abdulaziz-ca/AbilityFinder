# Snapshot re-verification report — 2026-10-16, batch 7 part B

Fact-check of seven records against today's official-page snapshots (fetched 2026-10-15). Snapshots are the only truth. Read-only review; no wording is proposed.

## Method and scope

Evaluated `public/data.js` in a Node `vm` with `{window:{}, document:{}, console}` and read each record's fields (including `amountTiers`, `eligibility`, `detail`, `BENEFIT_VALUES`, `BENEFIT_META`), as in `scripts/check-readability.js`. Read the `REQS` entries (`unmet`/`short` text) for each benefit's `requires` in `public/app.js` without calling matchers. Facts count distinct assertions (amounts, percentages, thresholds incl. each income-table cell, ages, dates, durations, phone numbers, form numbers, named conditions, hedges). Repeated assertions are consolidated. Internal flags, labels, URLs, difficulty ratings and advice without a factual assertion are not counted.

CONFIRMED requires a supporting snapshot quotation. DIFFERS identifies number, boundary, hedge, dropped condition or scope differences. NOT ON PAGE means absent from the supplied snapshot, not false. Hedges are checked both ways. Phone numbers are compared for the same stated purpose. Source-only facts that the record does not assert are listed under each table as notes and are not counted.

Snapshots used (all `status: 200`): `parking-placard--1.txt` (the record `source`), `parking-placard--2.txt` (the record `applyUrl`), `sparc-parking-permit--1.txt`, `acsd--1.txt`, `brampton-activeassist--1.txt`, `grt-affordable-transit--1.txt`, `grt-mobilityplus--1.txt`, `grt-taxi-coupons--1.txt`.

## Per-record detail

### parking-placard

Sources: `parking-placard--1.txt` (overview, contact only), `parking-placard--2.txt` (Get a parking placard).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Cost; amount, VALUES.note | “Low-cost accessible parking permit” | NOT ON PAGE | Neither page states any fee or cost. |
| Purpose; summary | “lets you use accessible parking spaces” | CONFIRMED | “A parking placard allows people to use disabled parking stalls.” (--2) |
| Alberta residents; REQS.ab | “This is an Alberta program.” | CONFIRMED | “If you’re a resident of Alberta and can’t walk more than 50 metres...” (--2) |
| Walking threshold; note | “can't walk more than about 50 metres” | DIFFERS | “can’t walk more than 50 metres (164 feet)” (--2). Hedge: record adds “about”; page gives a fixed 50 metres. (REQS.abPlacardMobility unmet text says “50 metres” without “about”.) |
| Vision criterion; note | “vision loss makes moving around parking areas unsafe” | DIFFERS | “a loss of vision that substantially limits safe and independent mobility while navigation parking areas” (--2). Boundary: page requires substantial limitation of safe and independent mobility; the record’s “unsafe” drops “substantially” and “independent”. (REQS.abPlacardMobility unmet text matches the page.) |
| Long-term placard 5 years; about | “valid 5 years” (long-term) | CONFIRMED | “a long-term placard, issued for 5 years” (--2). |
| Temporary placard 3–12 months; about | “temporary ones (3–12 months)” | CONFIRMED | “a temporary placard, issued for between 3 and 12 months” (--2). |
| Colours blue = long-term, red = temporary; about | “Blue placards ... red placards” | NOT ON PAGE | Blue is never mentioned. Red appears only for visitors (“temporary red parking placard”) and organizations (“a red placard for a 12-month term only”), not as the general temporary colour. |
| Practitioner completes the form; steps, REQS.certifier | “have a medical practitioner complete their section” | CONFIRMED | “The application may be approved by an authorized healthcare provider” (--2). |
| Practitioner types; tips | “physician, occupational therapist, physiotherapist, surgeon, podiatrist, nurse practitioner or chiropractor” | CONFIRMED | “such as a: physician occupational therapist physiotherapist surgeon physical therapist podiatrist nurse practitioner chiropractors” (--2). Page list is non-exhaustive and also names physical therapist. |
| Submit at a registry agent; steps | “Take it to any registry agent” | CONFIRMED | “Bring your completed application to a registry agent” (--2). |
| AMA centre as an example registry; steps | “(e.g. an AMA centre)” | NOT ON PAGE | No AMA centre mentioned. |
| Identification; documents | “Government-issued ID” | NOT ON PAGE | Page says only “acceptable identification”; “government-issued” is not stated. |
| Placard belongs to person, not a car; tips | “the placard belongs to you, not a car” | CONFIRMED | “A valid parking placard ... can only be used by the person it is issued to.” “You can use your valid placard ... in any vehicle that provides you with transportation.” (--2) |
| No vehicle ownership needed; tips | “You don't need to own a vehicle” | NOT ON PAGE | Page never says ownership is or is not required for a placard (ownership/registration is mentioned only for the licence plate option). |
| Issued at the registry, same day; time, BENEFIT_META.wait | “Issued at the registry, often same-day.” | NOT ON PAGE | No processing time or same-day statement. |
| “Short form”; BENEFIT_META.effort | “Short form + a registry visit” | NOT ON PAGE | Registry visit supported; form length not described. |

Notes (source-only, not counted): the page requires the application to “be submitted within 6 months of the healthcare professional signing it”; also lists a permanent placard “renewable every 5 years by the client without a new application”, and 1 placard per vehicle. The record gives no phone number (“Any Alberta registry agent”); the page’s contact number is 780-427-7013 (toll free: 310-0000 before the number, in Alberta); no conflict.

### sparc-parking-permit

Sources: `sparc-parking-permit--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Fee set by SPARC BC / confirm fee; amount, note, documents, steps | “Fees are set by SPARC BC; confirm the current fee” | NOT ON PAGE | Page mentions no fee. |
| Hardship assistance; note, steps | “any available hardship assistance” | NOT ON PAGE | Not mentioned. |
| Permanent permit 3 years, renewable; amount, about | “permanent (valid 3 years, renewable)” | CONFIRMED | “Permanent Parking Permit: Valid for a period of three (3) years, and renewable.” |
| Temporary permit 1–12 months, not renewable, reapply; amount, about, tips | “temporary (1 to 12 months, not renewable — reapply if still needed)” | CONFIRMED | “Valid for a period of one (1) month to twelve (12) months, and not renewable. Clients requiring an extension ... must reapply.” |
| Conditional permit type (3 years, not renewable); about | “Three types exist: ... and conditional (3 years, not renewable)” | DIFFERS | “There are two (2) types of parking permits for people with disabilities: Permanent ... Temporary”. Number/scope: page lists two types; no conditional permit. |
| Mobility-limitation eligibility examples; eligibility, requiresNote | “you use a wheelchair or a mobility aid like a cane or crutches, or your health prevents you from walking far” | CONFIRMED | “People who qualify ... may: need the extra width ... in a wheelchair. use crutches, a cane or other mobility aid, or need to park close to a building entrance because their health prevents them from walking very far.” |
| Mobility limitation “confirmed by a medical professional”; eligibility, requiresNote | “confirmed by a medical professional” | NOT ON PAGE | Page does not mention a medical confirmation requirement or referral section. |
| Walking-distance cue “~50m”; REQS.mobility unmet | “can't walk ~50m” | NOT ON PAGE | No distance threshold on the page. |
| Vision loss as a qualifying route; REQS.mobility (met if vision, unmet text) | “or vision loss” | DIFFERS | Page frames eligibility only as “people with mobility limitations”; vision loss is never mentioned. Scope: the gate accepts vision loss alone. |
| Vehicle ownership not required; eligibility.note, requiresNote | “You don't need to own a vehicle.” | CONFIRMED | “entitled to a permit even if they do not own a vehicle, as long as the parking permit holder is either driving or being transported in the vehicle.” |
| Valid as driver or passenger; summary | “valid whether you're driving or riding as a passenger” | CONFIRMED | Same sentence as above. |
| Display on rear-view mirror when parked; summary, about, steps | “must be displayed on the rear-view mirror while parked” | CONFIRMED | “A valid parking permit must be displayed on the rear view mirror when the vehicle is parked in a designated spot.” |
| Permit belongs to the person, not a car; any car you drive or ride in; about, tips | “The permit belongs to the person, not a car”; “use it in any car you drive or ride in” | NOT ON PAGE | Page says the permit holder must be driving or transported in “the vehicle”; it does not say the permit belongs to the person or works in any car. |
| Recognized across BC; about | “recognized in designated spaces across British Columbia” | CONFIRMED | “they can park in one of the designated parking spots throughout British Columbia.” |
| SPARC BC administers the program, non-profit; note | “SPARC BC is the non-profit that administers BC's permit program” | CONFIRMED | “independent, non-partisan, registered charity”; “managing the Parking Permit Program for People with Disabilities since 1984.” |
| Download application form from sparc.bc.ca; steps | “Download the application form from sparc.bc.ca” | CONFIRMED | “DOWNLOAD THE PARKING APPLICATION FORM” |
| Phone 604-718-7744 / 1-888-718-7794 (parking inquiries); steps, phone | “604-718-7744 or toll-free 1-888-718-7794” | CONFIRMED | “For parking permit inquiries: permits@sparc.bc.ca 604-718-7744 or toll free at 1-888-718-7794”. No conflicting parking number (604-718-7733 is general SPARC info). |
| Call for a copy of the form; steps | “call 604-718-7744 / 1-888-718-7794 for a copy” | NOT ON PAGE | Page uses 604-718-7744 for “special permits” (organizations/motorcycles) and inquiries; no copy-by-phone service. |
| Email permits@sparc.bc.ca; tips | “Email permits@sparc.bc.ca with questions” | CONFIRMED | “For parking permit inquiries: permits@sparc.bc.ca”. |
| Referral completed by professional with a valid MSP number; steps | “medical professional with a valid MSP number” | NOT ON PAGE | Not mentioned. |
| Processing time 2–3 weeks; steps, time, BENEFIT_META.wait | “Allow 2 to 3 weeks for processing” | NOT ON PAGE | No processing time. |
| Renew permanent permits online at online.sparc.bc.ca; expired cannot be renewed online; tips | “Renew permanent permits online ... expired permits can't be renewed online” | NOT ON PAGE | Page has only a “Renew / Replace” link; no online-renewal address or expiry rule. |

Notes (source-only, not counted): organizations and motorcycle users use “special permits” (decal for motorcycles) via 604-718-7744. 

### acsd

Sources: `acsd--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Payment range; amount, about, VALUES | “$25 to $678 a month” | CONFIRMED | “Eligible parents and guardians can receive between $25 and $678 a month”. |
| Amount depends on income, family size, disability costs; about | “depending on household income, family size, and the child's disability-related costs” | CONFIRMED | “Depending on your household income, the size of your family and your child’s disability-related costs, the ACSD program may provide between $25 and $678 a month”. |
| Parent or guardian of a child under 18 (17 and under) | “child under 18 (17 and under)” | CONFIRMED | “a child who is under 18 years of age (17 and under)”. |
| Child lives at home | “The child lives at home” | CONFIRMED | “lives at home and who has a severe disability”. |
| Household income $77,640 or less; eligibility, steps, REQS.acsdIncome | “total household income is $77,640 or less” | CONFIRMED | “You may be eligible if your total household income is $77,640 or less. You must also meet other factors of eligibility.” Page hedges (“may be eligible”) and adds other factors; record keeps the other-factors note. |
| Other eligibility factors; eligibility.note, REQS.acsdSeverity/acsdIncome | “size of your family, the severity of your child's disability, and the extraordinary costs” | CONFIRMED | “size of your family severity of your child’s disability extraordinary costs related to your child’s disability”. |
| Allowed costs; summary, about | “travel to appointments, special shoes and clothes, and parental relief such as respite” | CONFIRMED | “travel to doctors’ appointments, hospitals and other appointments related to the child’s disability special shoes and clothes parental relief such as respite”. |
| Canada Disability Benefit exempt; note | “exempt as income for ACSD and will not affect your eligibility or your payment” | CONFIRMED | “it will not affect your eligibility for ACSD or the amount of your payment.” |
| Maximum tied to inflation, adjusted each July; note, about | “tied to inflation and adjusted each July” | CONFIRMED | “The maximum monthly ACSD payment is tied to inflation and adjusted annually in July.” |
| 1.9% rise on July 1, 2026; note, about | “rose 1.9% on July 1, 2026” | CONFIRMED | “increased the maximum monthly ACSD payment by 1.9% effective July 2026”; “took effect on July 1, 2026.” |
| Assistive-device assessment / consumer contribution (ADP); about | “may also receive coverage for an assessment for an assistive device and/or the consumer contribution” | CONFIRMED | “children with severe disabilities may also receive coverage for: an assessment for an assistive device and/or the consumer contribution for a device provided under the Assistive Devices Program”. |
| Batteries and repairs for mobility devices; about, tips | “batteries and repairs for mobility devices” | CONFIRMED | “batteries and repairs for mobility devices”. |
| Drugs via OHIP+, dental via Healthy Smiles Ontario, hearing aids and vision care incl. eyeglasses; summary, about | “prescription drugs through OHIP+, dental care through Healthy Smiles Ontario, and hearing aids and vision care including eyeglasses” | CONFIRMED | “prescription drugs through OHIP+ dental care through Healthy Smiles Ontario program hearing aids and vision care, including eyeglasses”. |
| ADP itself does not fund batteries/repairs; tips | “something the Assistive Devices Program itself does not fund” | NOT ON PAGE | Page lists batteries/repairs as ACSD coverage; says nothing about what ADP funds. |
| Apply online, save/edit/submit later; steps | “Apply online — you can save, edit and submit later” | CONFIRMED | “You will have the option to save, edit and submit your application later.” |
| 90 days to complete; new application after; steps, tips | “you have 90 days ... after that you have to start a new one” | CONFIRMED | “You have 90 days to complete and submit your online application. After 90 days ... required to complete a new application.” |
| Paper application to local ministry regional office; steps | “download the paper application and send it to your local ministry regional office” | CONFIRMED | “download a paper copy of the application to complete and send it to your local ministry regional office”. |
| One application per child; duplicates delay; steps, tips | “Submit one application per child; duplicate applications ... delay processing” | CONFIRMED | “You can only submit one application for your child. Submitting duplicate applications will result in delays”; “separate application for each child.” |
| Review by special agreements officer, may contact, decision letter; steps | “A special agreements officer reviews ... may contact you for more information, then you receive a decision letter” | CONFIRMED | “a special agreements officer will review your application and may contact you if they need more information. You will receive a letter stating the decision”. |
| Who can help complete the application; tips | “community agency, health care professional, social worker, family member or friend” | CONFIRMED | “community agency health care professional social worker family or friend other individual who may be involved in the child’s regular care”. |
| Internal review within 30 days of receiving the decision; tips | “ask for an internal review within 30 days of receiving the decision letter” | CONFIRMED | “you have the right to ask for an internal review within 30 days of receiving the decision.” |
| ACSD assesses severity and extraordinary costs to decide eligibility and amount; REQS.acsdSeverity | “to decide both eligibility and the amount” | CONFIRMED | “Your eligibility and the amount of assistance you receive is based on a combination of factors.” |
| Documents: household income information; child’s disability and extraordinary cost information; documents | “Information about your total household income” | NOT ON PAGE | Page has no document list for the application. |

### brampton-activeassist

Sources: `brampton-activeassist--1.txt`. The page footer reads “© 2023 City of Brampton”.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Subsidy $275 per eligible member, one lump sum to primary account holder; amount, about, VALUES | “$275 for each eligible family member, as one lump sum” | CONFIRMED | “Staff will apply the subsidy amount to the primary account holder as a single lump sum payment in the amount of $275 for each eligible member of the family”. |
| Family of four receives $1,100 | “a family of four receives $1,100” | CONFIRMED | “An approved family of four (4) would receive $1,100.00”. |
| Qualifies for two years once approved; summary, about | “once approved you qualify for two years” | CONFIRMED | “Once approved, you qualify for the program for 2 years.” |
| Delivered as account credit; summary, about | “a credit on your account” | CONFIRMED | “This assistance is given in the form of a credit to your account.” |
| Purpose: low-income families and individuals, recreation programs; summary, about, REQS.lowIncome | “low-income families and individuals take part in recreation programs” | CONFIRMED | “designed to help low-income families and individuals in Brampton participate in Recreation programs.” |
| Expired allocation not renewed automatically; re-apply; note, tips | “not renewed automatically — you have to re-apply” | CONFIRMED | “Expired ActiveAssist subsidy allocation will not be automatically renewed for you ... please re-apply”. |
| Influx of applications and longer wait times; note, tips, BENEFIT_META.wait | “an influx of applications and longer wait times for approvals” | CONFIRMED | “we are experiencing an influx of Active Assist applications resulting in longer wait times for approvals.” |
| Brampton residence with proof; eligibility, steps, documents, REQS.brampton | “live in Brampton and can show proof of residency, such as a utility bill, lease agreement or driver's licence” | CONFIRMED | “Provide proof of residency (eg. utility bill, lease agreement, driver’s license, etc).” |
| Proof of total family net income | “proof of total family net income” | CONFIRMED | “Provide proof of total family net income.” |
| Proof of legal responsibility for all dependants listed | “proof of legal responsibility for every dependant listed on the application” | CONFIRMED | “Provide proof of legal responsibility for all dependents listed on the application.” |
| No income threshold published on this page; eligibility.note | “does not publish an income threshold on this page” | CONFIRMED | Snapshot contains no income figure; “Confirm you Qualify” and FAQ links appear without their content. |
| Confidentiality; eligibility.note, about | “Confidentiality is always maintained.” | CONFIRMED | “Confidentiality is always maintained.” |
| Credits usable toward most registered programs, drop-ins, memberships; some exclusions; about, tips | “most registered programs, drop-in programs and memberships, though some exclusions apply” | CONFIRMED | “Most registered programs Drop-in programs Memberships *some exclusions apply”. |
| Apply online with required documentation; steps | “Apply online, attaching the required documentation” | CONFIRMED | “Online (must attach required documentation with application)”. |
| Pick up/drop off form at any Brampton Recreation Centre; steps | “pick up and drop off an application form at any Brampton Recreation Centre” | CONFIRMED | “Pick up or drop off an application form at any Brampton Recreation Centre”. |
| Mail address; steps | “ActiveAssist Brampton, 2 Wellington St. W., Brampton, ON L6Y 4R2” | CONFIRMED | “By mail to: ActiveAssist Brampton, 2 Wellington St. W., Brampton, ON L6Y 4R2”. |
| Team contacts you once the application is received; steps | “A member of the team contacts you once the completed application is received” | CONFIRMED | “A member of our team will connect with you once we have received your completed application.” |
| Questions email recreation@brampton.ca; tips | “Questions go to recreation@brampton.ca.” | CONFIRMED | “Please email recreation@brampton.ca should you have any questions.” |
| Two-year duration longer than most municipal subsidies; tips | “longer than most municipal recreation subsidies” | NOT ON PAGE | Page makes no comparison with other municipalities. |

Notes (source-only, not counted): “The credit has no real cash value”; unused credits at the end of the enrolment period cannot be carried over, transferred, or redeemed for cash; the amount is applied only “Once your application is received and approved”.

### grt-affordable-transit

Sources: `grt-affordable-transit--1.txt`. The page says the online application is temporarily unavailable.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Program discounts GRT fares for Waterloo Region residents on low income; eligibility based on total household income; summary, about | “discounted GRT fare products to Waterloo Region residents living with low income. Eligibility is based on total household income.” | CONFIRMED | “offers a discount on the price of GRT fare products for Waterloo Region residents living with low income. Eligibility for this program is based on total household income.” |
| Managed by Region of Waterloo Department of Community Services; about | “managed by the Region of Waterloo Department of Community Services” | CONFIRMED | “Eligibility for the ATP is managed by the Region of Waterloo Department of Community Services.” |
| Age 18 or older; eligibility | “You are 18 or older” | CONFIRMED | “You are 18 or older”. |
| Lives in Region of Waterloo; eligibility, REQS.waterlooRegion | “You live in the Region of Waterloo” | CONFIRMED | “You live in the Region of Waterloo”; “Residents of Wellesley, Wilmot, Woolwich, and North Dumfries are eligible to apply”. |
| Not a full-time college or university student; eligibility | “You are NOT a full-time college or university student” | CONFIRMED | “You are not a full-time college or university student”. |
| Income limit, 1 person; amountTiers | “$31,875” | CONFIRMED | “1 person ... $31,875 or less”. |
| Income limit, 2 people | “$45,078” | CONFIRMED | “2 people ... $45,078 or less”. |
| Income limit, 3 people | “$55,208” | CONFIRMED | “3 people ... $55,208 or less”. |
| Income limit, 4 people | “$63,749” | CONFIRMED | “4 people ... $63,749 or less”. |
| Income limit, 5 people | “$71,724” | CONFIRMED | “5 people ... $71,724 or less”. |
| Income limit, 6 people | “$78,077” | CONFIRMED | “6 people ... $78,077 or less”. |
| Boundary “at or below the limit”; amountTiers.caption, eligibility.items[3] | “at or below this limit” | CONFIRMED | Table: “$31,875 or less” etc. Note: the page’s own bullet reads “Your household income is below the income limit” and “must be below these limits”, which conflicts with the table’s “or less”. |
| Net income = add line 23600 from each member’s tax return; eligibility.note, steps, REQS.atpApproval | “add line 23600 from each member's tax return” | CONFIRMED | “Your household net income (add line 23600 from each members tax return)”. |
| Household definition; eligibility.note, tips | “people you live with, are related to and financially support” | CONFIRMED | “A household includes people you live with, are related to and financially support.” |
| Everyone counts even if no pass needed; eligibility.note, tips | “Everyone counts even if they do not need a pass” | CONFIRMED | “Even if a member of your household does not require a pass, you will need to include them in your household count.” |
| Members over 18 must provide income information | “members over 18 must provide income information” | CONFIRMED | “If they are over 18, you will need to provide their income information.” |
| All household members can buy discounted fares, including children 17 or younger | “ALL household members can buy the discounted fares, including all children 17 or younger” | CONFIRMED | “If approved, all members of your household can purchase the discounted fare products. This includes all children 17 or younger.” |
| Monthly pass $47 vs regular $104 | “$47 monthly pass instead of $104” | NOT ON PAGE | Prices are in an “ATP fare prices” table not present in the snapshot text; page confirms only that monthly passes are available. |
| Stored value $1.35 per ride vs $3 regular stored value and $4 cash fare | “$1.35 per ride instead of the regular $3 stored-value fare or $4 cash fare” | NOT ON PAGE | No fare figures in the snapshot text. |
| Strip of 5 ATP MobilityPLUS tickets $6.75 vs $15 | “$6.75 for 5 MobilityPLUS tickets”; “instead of $15” | NOT ON PAGE | Page says approved customers can buy “reduced MobilityPLUS ATP tickets”; no price. |
| Fare products: monthly pass, stored value, MobilityPLUS tickets; amount | “monthly pass, ... stored value ... MobilityPLUS tickets” | CONFIRMED | “you can purchase monthly passes, stored value or MobilityPLUS tickets.” |
| Online application at webapps.regionofwaterloo.ca; steps | “Complete the online application at https://webapps.regionofwaterloo.ca/ATP/ApplicationWizard/Step/Info” | DIFFERS | “The Affordable Transit Program online application is temporarily unavailable. You can still apply or receive help ... Calling Employment and Income Services at 519-883-2100 option 1 ... Contacting your Ontario Works caseworker ... Visiting a Community Services Welcome Space”. Dropped condition: online route currently unavailable and alternative routes not given; the URL itself is not on the page. |
| Help at a Community Service Welcome Space; steps | “Ask for help at a Community Service Welcome Space” | CONFIRMED | “If you need assistance to complete the ATP application, you can call or visit one of the Community Service Welcome Spaces.” |
| Ontario Works/ODSP route documents: date of birth and SAMS Member ID or SIN; documents | “your date of birth and your SAMS Member ID or SIN” | CONFIRMED | “If you receive Ontario Works or Ontario Disability Support: Date of birth SAMS Member ID OR Social Insurance Number”. |
| Non-OW/ODSP proof of address types; documents | “valid driver's licence, Ontario photo ID card, government-issued mail, current utility bill, rent receipt or lease, or mortgage document” | CONFIRMED | “Valid driver's licence Ontario photo ID card Government issued mail Current utility bill Rent receipt or lease Mortgage document”. |
| Non-OW/ODSP proof of income for each income-earning member (NOA line 23600, Option C, RSW letter); documents | “CRA Notice of Assessment showing line 23600, CRA Proof of income statement (Option C), or a letter from a Registered Social Worker” | CONFIRMED | “Proof of income – one of the following, for each income-earning member of your household”. |
| Document list complete for each route; documents | the two “If you...” document lists | DIFFERS | “If you were a student in the last calendar year, you will need to provide proof of completion/graduation documents.” (stated for both routes) and “If you are new to Canada in the current calendar year, you can submit” PR/citizenship/refugee/work-permit documents. Dropped condition: former-student documents (and new-to-Canada alternatives) are omitted from the record’s routes. |
| MobilityPLUS customers on low income should apply for ATP; tips | “registered MobilityPLUS customer on a low income, apply for ATP too because it discounts MobilityPLUS tickets” | CONFIRMED | “If you use MobilityPLUS specialized services, you can purchase reduced MobilityPLUS ATP tickets to pay your fare on MobilityPLUS vehicles.” |
| Approval required; REQS.atpApproval | “You need to be approved for the Affordable Transit Program” | CONFIRMED | “Once you are approved for ATP, you can purchase monthly passes, stored value or MobilityPLUS tickets.” |

Notes (source-only, not counted): eligibility lasts one year, then reapply (30 days before expiry); ATP EasyGO card required and a new fare card fee applies; the page gives 519-883-2100 for application help (the record gives no ATP phone; no conflict).

### grt-mobilityplus

Sources: `grt-mobilityplus--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Operates within urban areas of Waterloo Region; summary, about | “operates within the urban areas of Waterloo Region” | CONFIRMED | “MobilityPLUS service operates within the urban areas of Waterloo Region.” |
| Only for eligible, registered customers; summary, eligibility.note, about | “eligible, registered customers”; “only available to people who are eligible and registered” | CONFIRMED | “MobilityPLUS is only available to people who are eligible and registered.” |
| Disability impacts ability to travel on GRT buses or ION trains; summary, about | “whose disability impacts their ability to travel on GRT buses or ION trains” | CONFIRMED | “customers who have a disability that impacts their ability to travel on GRT buses or ION trains.” |
| Unconditional eligibility; eligibility, about | “a disability prevents you from using conventional transit” | CONFIRMED | “Unconditional - A person with a disability that prevents them from using conventional transit.” |
| Conditional eligibility; eligibility, about | “environmental or physical barriers limit your ability to consistently use conventional transit; you may be able to use conventional transit for all or part of a trip but may qualify for specialized transit under specific circumstances” | CONFIRMED | “A person with a disability where environmental or physical barriers limit their ability to consistently use conventional transit. An applicant who qualifies for conditional service may be able to use conventional transit for all or part of their trip but may also qualify for specialized transit under specific circumstances for some or all of their trip.” |
| Temporary eligibility; eligibility, about | “a temporary disability that prevents you from using conventional transit and requires specialized transit for a defined period of time” | CONFIRMED | “A person with a temporary disability that prevents them from using conventional transit. ... requires specialized transit for a defined period of time.” |
| Application is for Cambridge, Kitchener and Waterloo residents; note, about | “for residents of Cambridge, Kitchener and Waterloo” | CONFIRMED | “MobilityPLUS application For residents of Cambridge, Kitchener and Waterloo.” |
| Separate specialized service for township residents; note, about, tips | “A separate specialized service exists for township residents” | CONFIRMED | “We also offer specialized service for township residents.” Page does not give that service’s rules (record says the same). |
| Two-part application; steps, documents | “the two-part application” | CONFIRMED | “The application contains two parts”. |
| Part A by applicant or delegate | “Part A, completed by you or your delegate” | CONFIRMED | “Part A - MobilityPLUS application to be completed by the applicant or their delegate/representative”. |
| Part B by a professional who can speak to disability and ability to take conventional transit | “a professional who can speak to your disability and ability to take conventional transit” | CONFIRMED | “completed by a health/disability professional who can speak to the applicant’s disability(ies) and their ability to take conventional transit.” |
| List of professionals; tips, documents | “Listed professionals are a physician, nurse practitioner, psychiatrist, psychologist, optometrist, physiotherapist, occupational therapist, social worker, orientation and mobility specialist, kinesiologist, managers from pre-approved adult day programs or long-term care centres, and other professionals approved by the Region” | DIFFERS | “Appropriate professionals could include (but are not limited to): ...”. Hedge: page list is non-exhaustive (“could include”); record presents it as the defined list and Part B as completed by “an accepted professional”. |
| MobilityPLUS tickets $15 for a strip of 5 | “$15 for 5 tickets” | NOT ON PAGE | No fare prices on the snapshot. |
| MobilityPLUS monthly pass $104 | “a monthly pass costs $104” | NOT ON PAGE | Not on the page. |
| Strip of 5 costs $6.75 with ATP approval | “$6.75 for 5 tickets with ATP approval” | NOT ON PAGE | Not on this page (ATP page also gives no price). |
| Low-income customers should apply for ATP; tips | “apply for ATP too because it reduces a strip of 5 MobilityPLUS tickets from $15 to $6.75” | NOT ON PAGE | This page does not mention ATP discounts (only an alert that the ATP application is unavailable). |
| Gate: cannot use regular transit without assistance for some or all trips; REQS.transitBarrier unmet | “cannot use regular public transit without assistance for some or all trips” | DIFFERS | Page categories are inability to use conventional transit (unconditional/temporary) or limited ability to “consistently use” it (conditional). Scope/boundary: “without assistance” is not on the page and the conditional route is a consistency limit, not inability. |

Notes (source-only, not counted): visitors to Cambridge, Kitchener, Waterloo or North Dumfries may register for a maximum of six months (14 calendar days to process); extension requests go to 519-585-7597 at least two months before the registration end date; appeals via 519-585-7597. The record gives no phone number; no conflict.

### grt-taxi-coupons

Sources: `grt-taxi-coupons--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Book value $60 sold for $30; amount, summary, about | “$60 coupon book for $30” | CONFIRMED | “Contains $5, $2 and $1 coupons that add up to a total value of $60 Is sold to MobilityPLUS customers for $30”. |
| Coupon denominations $5, $2, $1; holes punched | “$5, $2 and $1 coupons”; “punched holes to identify each value” | CONFIRMED | “Has holes punched to identify each coupon value”. |
| Up to 30 books between January 1 and December 31 (“a year”); amount, eligibility.note, about | “up to 30 books a year”; “between January 1 and December 31” | CONFIRMED | “Customers may purchase up to 30 coupon books between January 1 and December 31.” |
| Seasonal eligibility only during active registration; eligibility.note | “Customers with seasonal eligibility may only buy during active registration periods” | CONFIRMED | “Customers with seasonal eligibility may only purchase during active registration periods.” |
| Do not expire; not refundable; note, about | “Coupons do not expire and are not refundable.” | CONFIRMED | “Does not expire and is not refundable”. |
| Personal use; no resale or transfer; note | “cannot be resold or transferred” | CONFIRMED | “Coupons cannot be resold or transferred to anyone else.” |
| Proven abuse revokes privileges | “Proven abuse results in privileges being revoked” | CONFIRMED | “Proven abuse of this policy will result in taxi coupon privileges being revoked.” |
| Lost or stolen coupons not reimbursed; note, tips | “lost or stolen coupons are not reimbursed” | CONFIRMED | “Lost or stolen taxi coupons will not be reimbursed.” |
| Eligibility: a MobilityPLUS customer; eligibility.items, REQS.mobilityplusRegistered | “You are a MobilityPLUS customer” | DIFFERS | “MobilityPLUS customers who live and travel in Cambridge, Kitchener and Waterloo can purchase taxi coupons ... customers on MobilityPLUS North Dumfries or Kiwanis Transit services are not eligible for taxi coupons.” Dropped condition: live and travel in the three cities; North Dumfries and Kiwanis Transit customers excluded. |
| Cambridge, Kitchener, Waterloo only; REQS.waterlooUrban unmet | “covers Cambridge, Kitchener and Waterloo; townships have a separate specialized service” | CONFIRMED | “Taxi coupons cannot be used for travel within the townships”. |
| Phone order 519-585-7597 ext. 7347, Monday to Friday 8:30 a.m.–4 p.m.; steps, phone | “519-585-7597 ext. 7347, Monday to Friday from 8:30 a.m. to 4 p.m.” | CONFIRMED | “By telephone 519-585-7597 ext. 7347 Monday to Friday: 8:30 a.m.-4 p.m.” No other number given for ordering (GRT customer service 519-585-7555 is listed for general contact only). |
| Credit card required by phone; steps, documents | “a credit card is required” | CONFIRMED | “A valid credit card is required for purchase by telephone.” |
| Buy in person at a GRT customer service location; steps | “buy in person at a GRT customer service location” | CONFIRMED | “In person GRT customer service locations”. |
| Mail order: cheque to Region of Waterloo, 250 Strasburg Rd., Kitchener, ON N2E 3M6, ID on front, two weeks; steps, documents | “mail a cheque payable to Region of Waterloo to 250 Strasburg Rd., Kitchener, ON N2E 3M6, write your MobilityPLUS ID number on the front, and allow two weeks” | CONFIRMED | “Send a cheque payable to: Region of Waterloo 250 Strasburg Rd. Kitchener, ON, N2E 3M6 Write your MobilityPLUS ID number on the front. Please allow two weeks for delivery.” |
| Tell taxi company about coupons and mobility device; steps | “tell the company you are using taxi coupons and say if you use a mobility device” | CONFIRMED | “You must tell the taxi company: You are using taxi coupons If you use a mobility device so that a suitable vehicle can be arranged”. |
| Delivery: three books or fewer by Canada Post; four or more by courier 9 a.m.–5 p.m., be home; tips | “Orders of three books or fewer go by Canada Post. Four or more go by courier between 9 a.m. and 5 p.m.” | CONFIRMED | “orders of three books or fewer will be sent via Canada Post.” “Orders of four books or more will be sent by courier and will be delivered between 9 a.m. and 5 p.m.” |
| Named companies; tips | “Golden Triangle Taxi in Cambridge, and City Cabs, United Taxi and Waterloo Taxi in Kitchener and Waterloo” | CONFIRMED | “Cambridge: Golden Triangle Taxi Kitchener and Waterloo: City Cabs United Taxi Waterloo Taxi”. |

Notes (source-only, not counted): coupons can pay only for the portion of a trip within the three cities; no change is given from coupons; tipping must be with own money. The record states none of these.

## Count table

| Record | Facts | Confirmed | Differs | Not on page |
|---|---|---|---|---|
| parking-placard | 17 | 8 | 2 | 7 |
| sparc-parking-permit | 22 | 11 | 2 | 9 |
| acsd | 23 | 21 | 0 | 2 |
| brampton-activeassist | 19 | 18 | 0 | 1 |
| grt-affordable-transit | 29 | 24 | 2 | 3 |
| grt-mobilityplus | 17 | 11 | 2 | 4 |
| grt-taxi-coupons | 17 | 16 | 1 | 0 |
| **Total (7 records)** | **144** | **109** | **9** | **26** |

Counts are evidence-limited; NOT ON PAGE does not mean false.

## DIFFERS list

1. **parking-placard — `note` (walking threshold)**
   - Current: “can't walk more than about 50 metres”
   - Snapshot: “can’t walk more than 50 metres (164 feet)” (--2)
   - Difference: hedge “about” added to a fixed threshold.
2. **parking-placard — `note` (vision criterion)**
   - Current: “whose vision loss makes moving around parking areas unsafe”
   - Snapshot: “a loss of vision that substantially limits safe and independent mobility while navigation parking areas” (--2)
   - Difference: degree/boundary; “substantially” and “independent” dropped.
3. **sparc-parking-permit — `detail.about` / `detail.aboutList.items[0]` (permit types)**
   - Current: “Three types exist: permanent ..., temporary ..., and conditional (3 years, not renewable).”
   - Snapshot: “There are two (2) types of parking permits for people with disabilities: Permanent ... Temporary”
   - Difference: number of types; conditional permit not on the page.
4. **sparc-parking-permit — `REQS.mobility` unmet / met (vision loss)**
   - Current: “For a mobility limitation (can't walk ~50m) or vision loss.”
   - Snapshot: “People with mobility limitations are entitled to a permit even if they do not own a vehicle”
   - Difference: scope; vision loss is not a stated route (the 50 m figure is also not on the page).
5. **grt-affordable-transit — `detail.steps[2]` (online application)**
   - Current: “Complete the online application at https://webapps.regionofwaterloo.ca/ATP/ApplicationWizard/Step/Info”
   - Snapshot: “The Affordable Transit Program online application is temporarily unavailable. You can still apply or receive help ... Calling Employment and Income Services at 519-883-2100 option 1”
   - Difference: dropped condition; online route unavailable, alternatives omitted; URL not on page.
6. **grt-affordable-transit — `detail.documents`**
   - Current: two route lists (Ontario Works/ODSP; not Ontario Works/ODSP) with no student or new-to-Canada documents
   - Snapshot: “If you were a student in the last calendar year, you will need to provide proof of completion/graduation documents.”
   - Difference: dropped condition on both routes; new-to-Canada alternatives also omitted.
7. **grt-mobilityplus — `detail.tips[0]` / `detail.documents[1]` (professionals)**
   - Current: “Listed professionals are a physician, ...”; “completed by an accepted professional”
   - Snapshot: “Appropriate professionals could include (but are not limited to)”
   - Difference: hedge; non-exhaustive list presented as a defined list.
8. **grt-mobilityplus — `REQS.transitBarrier` unmet**
   - Current: “cannot use regular public transit without assistance for some or all trips”
   - Snapshot: “where environmental or physical barriers limit their ability to consistently use conventional transit”
   - Difference: scope/boundary; “without assistance” not on page; conditional route is limited consistent use, not inability.
9. **grt-taxi-coupons — `eligibility.items[0]` / `REQS.mobilityplusRegistered`**
   - Current: “You are a MobilityPLUS customer”
   - Snapshot: “MobilityPLUS customers who live and travel in Cambridge, Kitchener and Waterloo can purchase taxi coupons ... customers on MobilityPLUS North Dumfries or Kiwanis Transit services are not eligible for taxi coupons.”
   - Difference: dropped condition; live-and-travel in the three cities and North Dumfries/Kiwanis exclusion missing from eligibility.
