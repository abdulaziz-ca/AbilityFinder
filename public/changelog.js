/* Public record of material catalog and guide changes. Keep newest entries first. */
const DATA_CHANGELOG = [
  { date: "2026-10-17", text: "Larger tap targets on the results page, and the AbilityFinder logo now asks before clearing your answers. Guide text no longer uses all-capital words for emphasis (screen readers can spell them out letter by letter), and list items start with a capital letter. Programs that are closing or closed now show their end date as a badge on results and guides. Guide pages no longer say “You qualify if any of these apply”, and homepage claims about timing and program counts were corrected. Official-link buttons now say where they go. Benefit amounts and program rules are unchanged. Asset version 198." },
  { date: "2026-10-17", text: "Rewrote program summaries, Good to know notes and tips in plainer language: shorter sentences and everyday words. Every amount, date, condition and exception is kept, and each change was checked by a separate reviewer. Wording that was reviewed against official sources word for word was left as it was. Program guide pages now follow your light or dark theme, text size and high-contrast settings, and name Ontario in their header. At very high zoom the header and buttons no longer cover the questions. Benefit amounts and program rules are unchanged. Asset version 197." },
  { date: "2026-10-17", text: "Faster repeat visits: app files are now cached by version, and fonts are no longer re-downloaded after each update. A program with an unknown requirement can no longer be shown as a match. Benefit amounts and program rules are unchanged. Asset version 196." },
  { date: "2026-10-16", text: "If you answered No / not yet to the autism diagnosis question, BC Autism Funding and the Ontario Autism Program now appear under Not for your situation now as An autism diagnosis is needed first, because each program requires a diagnosis before you apply. Benefit amounts and program rules are unchanged. Asset version 194." },
  { date: "2026-10-16", text: "The Learning Disability Assessment Bursary no longer asks for disability documentation first: it pays for the assessment that provides it. It now checks the official conditions instead: StudentAid BC eligibility, a designated public B.C. school, and a recommendation from the school's accessibility services office. Asset version 195.",
    revision: 13,
    changes: [
      { recordId: "bc-learning-disability-assessment-bursary", kind: "rule", summary: "Documentation is no longer required first. The school recommendation is checked instead." }
    ]
  },
  { date: "2026-10-16", text: "Added an optional question about benefits you already get (AISH, ADAP, B.C. disability assistance, ODSP or the CPP disability benefit). A program you say you get is listed as You already get this instead of as a program to check. Benefit amounts and program rules are unchanged. Asset version 193." },
  { date: "2026-10-16", text: "Results are now grouped by what to do next: Programs to check, Other programs to check (one line each), and a closed Not for your situation now list for programs that need Disability Tax Credit approval first. The combined count and empty estimate box are gone, and the what-if panel uses the same groups. Benefit amounts and program rules are unchanged. Asset version 192." },
  { date: "2026-10-16", text: "Corrected privacy wording, replaced illustrative results with generic examples, and aligned live and static guide amounts. Clarified disability-category help, published maximum labels, RDSP repayment wording and review dates. Corrected historical change-log dates and the October review count. French scope labels now include Ontario and matching copy no longer overstates results. Benefit amounts and program rules are unchanged." },
  { date: "2026-10-16", text: "Fixed keyboard question navigation, local-program province and Okotoks area filtering, and unasked home-ownership checks. Loading failures now offer Reload and program guides; missing update data no longer blocks the app. Improved high-contrast colours, postal-code labels, guide footer links and the results heading. Asset version 190." },
  { date: "2026-10-16", text: "Optional device-only fact checks are available for the GRT CNIB pass, taxi coupons and Affordable Transit Program. You can edit or clear each program’s checks. The program still decides." },
  { date: "2026-10-16", text: "Resolved 12 targeted directory follow-ups. Shine's FAQ specifies ages 11–21; Bear Essentials specifies ages 0–19, financial need, a $15,000 lifetime maximum and a health-professional referral, with approval required before travel or purchase. Broadened coarse age filters and removed unsupported numeric cutoffs so potential applicants are not hidden. Bear's financial-need wording remains, without treating it as a fixed household-income cutoff. The BC Rehab bursary application lists a past September 1, 2026 deadline; check for the next cycle. Province and coverage rules and whole-entry verification dates are unchanged. Asset version 189." },
  { date: "2026-10-16", text: "Re-checked all 18 grant and 30 organization directory entries against supplied official-page snapshots. Restored CP Cares membership requirements, Variety BC residence and assessment conditions and parent/caregiver submission, BC Rehab's new/used quote and online submission rules, CPABC's possible-funding qualifier and expired 2026 application cycle, and the Disability Law Clinic intake closure with expected early-2027 reopening. Unsupported or ambiguous facts remain unchanged for a decision; whole-entry verification dates are unchanged. Asset version 188." },
  { date: "2026-10-15", text: "Saved Ontario cities now restore with your answers, so reloading results no longer asks for the city again. Cities are checked against the current province city choices. Asset version 186." },
  { date: "2026-10-15", text: "Results can now show recorded updates to matching and tracked programs on a returning device. The optional list stays until you choose Got it. Review markers are kept only in this browser alongside saved answers; first use starts silently, and the public Updates page remains available." },
  { date: "2026-10-15", text: "Review dates moved to October 2026 for 51 benefits whose facts were fully re-checked against their official pages (each fact confirmed, or corrected and then confirmed, with no unchecked amount, threshold, age limit or deadline). The other benefits keep their earlier review month. Benefit facts and guide wording are unchanged." },
  { date: "2026-10-15", text: "Resolved autism TTE items 34 and 39. Preserved the normal 20% and final aligned period 50% framing; clarified annual funding for plans of 12 months or less, the adjusted portion for plans of 13 months or longer with the first 12 months at 20%, and the 20% exception for youth turning 19 before March 31, 2027 (ages 6–18 record only). Added the support-needs page’s MyFS or Autism Funding balance-check advice. Asset version 183; whole-record verification dates are unchanged for these targeted fixes.",
    revision: 12,
    changes: [
      { recordId: "bc-autism-funding-6-18", kind: "coverage", summary: "The training, travel and equipment funding conditions were corrected." },
      { recordId: "bc-autism-funding-under-6", kind: "coverage", summary: "The training, travel and equipment funding conditions were corrected." }
    ]
  },
  { date: "2026-10-15", text: "Applied all fifteen snapshot follow-up fixes and resolved batch eight open item twelve. Waterloo states both conflicting fact-sheet application dates, the agreement date, separate repair and accessibility limits, promissory-note and mortgage security, and the sole-source OW/ODSP income alternative. Removed its generic low-income gate so that alternative is not rejected. The federal services and equipment grant links to its own page, uses the school-year limit, requires both written confirmation of need and a cost document, and applies through provincial or territorial student aid without promising simultaneous assessment. BC fuel tax preserves possible ICBC benefits, minimum age, full confirmation-letter conditions and dates, representative signing documents and processing up to four weeks. Its record-specific external confirmation gate replaces the shared vehicle disability gate: profiles without physical, vision or transit answers move from no to almost when residency and vehicle ownership pass. The shared gate and excise refund are unchanged. Asset version 182; whole-record verification dates are unchanged for these targeted fixes.",
    revision: 11,
    changes: [
      { recordId: "waterloo-ontario-renovates", kind: "deadline", summary: "The conflicting application dates and need to confirm the deadline were clarified." },
      { recordId: "waterloo-ontario-renovates", kind: "rule", summary: "The alternative income qualification route was restored." },
      { recordId: "waterloo-ontario-renovates", kind: "amount", summary: "The separate funding limits and security conditions were corrected." },
      { recordId: "csg-dse", kind: "application", summary: "The student aid application route and required documents were corrected." },
      { recordId: "bc-fuel-tax-refund-disabilities", kind: "rule", summary: "The qualifying vehicles and disability confirmation requirements were corrected." }
    ]
  },
  { date: "2026-10-15", text: "Applied sixteen batch nine snapshot re-verification fixes. Restored ADP qualification hedges, other-coverage exclusions and grant purchase exception; parking visual-field conditions; OAP re-registration exemption; SSAH infant documentation; Waterloo waste collection conditions and tagged bags; Windsor reimbursement deadline and Windsor-Essex scope; and York homemaker contact wording. Record-specific checks preserve Waterloo's low income or social support routes and York recreation's listed benefit routes and age ranges. York recreation deliberately moves from ready to almost because the wizard cannot establish a listed route. Windsor-Essex residency remains a hard check; shared checks are unchanged. Asset version 181; whole-record verification dates are unchanged because this is a targeted assertion correction, not a full verification.",
    revision: 10,
    changes: [
      { recordId: "on-adp", kind: "rule", summary: "The qualification and other-coverage exceptions were clarified." },
      { recordId: "on-parking-permit", kind: "rule", summary: "The visual-field eligibility conditions were corrected." },
      { recordId: "ontario-autism-program", kind: "application", summary: "The re-registration exception was restored." },
      { recordId: "ssah", kind: "application", summary: "The infant documentation and reassessment requirements were corrected." },
      { recordId: "waterloo-curbside-waste-support", kind: "rule", summary: "The collection eligibility and cart support scope were corrected." },
      { recordId: "waterloo-homemaking-support", kind: "rule", summary: "The income eligibility check was corrected." },
      { recordId: "windsor-recreation-assistance", kind: "deadline", summary: "The reimbursement deadline was corrected." },
      { recordId: "york-region-homemakers", kind: "application", summary: "The available application contact routes were corrected." },
      { recordId: "york-region-recreation-subsidies", kind: "rule", summary: "The income and child eligibility checks were corrected." }
    ]
  },
  { date: "2026-10-15", text: "Applied fifteen batch eight re-verification fixes from supplied snapshots: ODSP effort preserves the prescribed-class exception; Passport minimum and maximum updated throughout; Toronto Fair Pass age, income-counting conflict, renewal and income-document wording; Welcome Policy program-ID alternative and processing times; Trillium quarterly deductible and household inclusion; GRT support-person professional designations, PAL alternative and decision letter; Hamilton Fare Assist OW/ODSP route and documents. Added record-specific Toronto age and Hamilton route checks without changing shared checks. Waterloo funding remains open pending the fact sheet; malformed Waterloo home-value and Hamilton income-table figures are kept as decided. Asset version 180. Whole-record verification dates are unchanged; these are targeted assertion fixes, not a new whole-record verification.",
    revision: 9,
    changes: [
      { recordId: "odsp", kind: "application", summary: "The application effort guidance now preserves the prescribed-class exception." },
      { recordId: "passport-program", kind: "amount", summary: "The funding limits were updated." },
      { recordId: "toronto-fair-pass", kind: "rule", summary: "The age and income qualification conditions were corrected." },
      { recordId: "toronto-welcome-policy", kind: "application", summary: "The application document requirements were corrected." },
      { recordId: "trillium-drug-program", kind: "coverage", summary: "The coverage and deductible conditions were clarified." },
      { recordId: "grt-support-person", kind: "application", summary: "The application document instructions were corrected." },
      { recordId: "hamilton-fare-assist", kind: "application", summary: "The income and document instructions were corrected." }
    ]
  },
  { date: "2026-10-14", text: "Applied seventeen re-verification batch seven snapshot-wording fixes to ten records (one further finding, the CPP disability age wording, was kept because the page is ambiguous). Corrected Cochrane Connect Card (Town, documents for all adults in the household), the Disability Tax Credit sending route (digital form or mail, not the submit documents section), Leduc (monthly bus pass of your choice; Recreation Assistance Program closed until it reopens for new applications in January 2027), the Alberta parking placard wording, the BC SPARC permit types, and Grand River Transit Affordable Transit Program (online application temporarily unavailable, other ways to apply, student and new-to-Canada documents), MobilityPLUS professionals and taxi coupon eligibility. Added record-specific checks so the Excise Gasoline Tax Refund, Fort Saskatchewan Access for Everyone (approved-program or income route), Okotoks Fee Assistance (Foothills County), the SPARC BC permit (mobility limitations) and MobilityPLUS (unconditional, conditional or temporary) no longer turn away people the pages include. Shared checks are unchanged. Asset version 179; whole-record verification dates are unchanged.",
    revision: 8,
    changes: [
      { recordId: "cochrane-connect-card", kind: "application", summary: "The household document requirements were corrected." },
      { recordId: "dtc", kind: "application", summary: "The accepted application submission routes were corrected." },
      { recordId: "excise-gasoline-tax-refund", kind: "rule", summary: "The mobility eligibility check was corrected." },
      { recordId: "fortsask-access", kind: "rule", summary: "The income qualification routes were corrected." },
      { recordId: "leduc-subsidies", kind: "application", summary: "The recreation intake closure and transit pass choices were clarified." },
      { recordId: "okotoks-fee-assistance", kind: "rule", summary: "The residency eligibility check was corrected." },
      { recordId: "parking-placard", kind: "rule", summary: "The mobility and vision eligibility wording was corrected." },
      { recordId: "sparc-parking-permit", kind: "rule", summary: "The permit types and mobility eligibility check were corrected." },
      { recordId: "grt-affordable-transit", kind: "application", summary: "The alternative application routes and document requirements were added." },
      { recordId: "grt-mobilityplus", kind: "rule", summary: "The eligibility types and professional documentation were corrected." },
      { recordId: "grt-taxi-coupons", kind: "rule", summary: "The eligible transit service areas were corrected." }
    ]
  },
  { date: "2026-10-14", text: "Applied all twenty-eight re-verification batch six snapshot-wording fixes to fourteen records. Restored source hedges and exceptions (Lloydminster residency exemption, RAMP eligibility wording, Special Needs Housing waitlists and rent formulas, Adult Health Benefit coverage, application steps and contact line, AISH report costs and file reopening, CLBC funding timing, Plan G and Plan P wording, Work-Able graduate rules, WorkBC assistive technology scope, Canmore ROAM Transit). Added record-specific checks so AISH no longer turns away people 65 or older who may not be eligible for Old Age Security (it is still never shown as a match), the Multigenerational Home Renovation Tax Credit asks who the unit is for, Special Needs Housing recognises other listed routes, CLBC recognises its Personalized Supports Initiative stream, and Work-Able asks for self-identification. Shared checks and assistance-receipt logic are unchanged. Asset version 178; whole-record verification dates are unchanged.",
    revision: 7,
    changes: [
      { recordId: "lloydminster-recreation-access", kind: "rule", summary: "The residency exception was restored." },
      { recordId: "multigenerational-home-renovation-tax-credit", kind: "rule", summary: "The qualifying renovation and claimant requirements were corrected." },
      { recordId: "ab-service-dog-id-card", kind: "rule", summary: "The service dog identification and access conditions were corrected." },
      { recordId: "ab-special-needs-housing", kind: "rule", summary: "The eligibility exceptions and placement expectations were clarified." },
      { recordId: "adult-health-benefit", kind: "contact", summary: "The application contact number was corrected." },
      { recordId: "aish", kind: "rule", summary: "The age eligibility and benefit guidance were corrected." },
      { recordId: "bc-clbc", kind: "rule", summary: "The eligibility routes and service expectations were corrected." },
      { recordId: "bc-pharmacare-plan-g", kind: "coverage", summary: "The renewal and medication coverage guidance was corrected." },
      { recordId: "bc-pharmacare-plan-p", kind: "application", summary: "The application and coverage instructions were corrected." },
      { recordId: "bc-work-able-internship", kind: "rule", summary: "The graduation and disability documentation conditions were corrected." },
      { recordId: "bc-workbc-assistive-technology", kind: "rule", summary: "The eligibility and support conditions were corrected." },
      { recordId: "canmore-affordable-services", kind: "coverage", summary: "The Regional ROAM Transit coverage was clarified." },
      { recordId: "ramp", kind: "rule", summary: "The non-exhaustive mobility eligibility routes were clarified." }
    ]
  },
  { date: "2026-10-14", text: "Applied all thirty-six re-verification batch five snapshot-wording fixes to eleven records. Restored disability verification exceptions, conditional eligibility and coverage, assistance payment timing, renovation paid-or-payable rules, medical equipment exceptions and all eight MSP eligibility groups. Added record-specific age and renovation checks; shared checks and assistance-receipt logic are unchanged. The age bands cannot express eligibility through the last day of the nineteenth birthday month. Asset version 177; whole-record verification dates are unchanged.",
    revision: 6,
    changes: [
      { recordId: "bc-csg-services-equipment", kind: "application", summary: "The disability verification and equipment request steps were corrected." },
      { recordId: "bc-csg-students-disabilities", kind: "application", summary: "The disability verification exceptions were clarified." },
      { recordId: "bc-cy-disability-benefit", kind: "rule", summary: "The age, eligibility and enrolment conditions were corrected." },
      { recordId: "bc-dental-supplement", kind: "rule", summary: "The eligibility exceptions were clarified." },
      { recordId: "bc-disability-assistance-pwd", kind: "amount", summary: "The shelter allowance and first-payment timing were corrected." },
      { recordId: "bc-home-reno-tax-credit", kind: "rule", summary: "The renovation spending requirement was corrected." },
      { recordId: "bc-medical-equipment-devices", kind: "coverage", summary: "The coverage conditions and approval instructions were corrected." },
      { recordId: "bc-msp-supplementary-benefits", kind: "rule", summary: "The qualifying routes and document requirements were corrected." },
      { recordId: "bc-optical-supplement", kind: "coverage", summary: "The optical coverage conditions were corrected." },
      { recordId: "bc-supplemental-bursary-students-disabilities", kind: "deadline", summary: "The application timing conditions were corrected." },
      { recordId: "cpp-childrens-benefit", kind: "application", summary: "The online application and renewal options were clarified." }
    ]
  },
  { date: "2026-10-14", text: "Applied re-verification batch four snapshot-wording fixes to twelve records: restored qualifying routes, source hedges, document exceptions and recreation limits; corrected Surrey's unlabelled income table and added Vancouver's separate income columns. Surrey now asks which route applies without treating PWD designation alone as current assistance receipt. ADAP separately checks age and Old Age Security eligibility and preserves the employment restriction test. Items 31, 34 and 39 remain open; autism equipment, training and travel rules are unchanged. Asset version 176. Whole-record verification dates are unchanged.",
    revision: 5,
    changes: [
      { recordId: "fscd", kind: "application", summary: "The disability documentation exceptions were clarified." },
      { recordId: "handycard-translink", kind: "rule", summary: "The transit membership requirements were corrected." },
      { recordId: "local-supports", kind: "contact", summary: "The navigator service hours were corrected." },
      { recordId: "stalbert-subsidy", kind: "rule", summary: "The income assessment and recreation coverage conditions were corrected." },
      { recordId: "strathcona-subsidy", kind: "application", summary: "The household income document instructions were corrected." },
      { recordId: "surrey-leisure-access", kind: "amount", summary: "The income table and recreation limits were corrected." },
      { recordId: "vancouver-leisure-access", kind: "rule", summary: "The qualifying routes and their document requirements were corrected." },
      { recordId: "adap", kind: "rule", summary: "The age and medical eligibility conditions were corrected." },
      { recordId: "bc-access-grant-students-disabilities", kind: "rule", summary: "The student eligibility routes were corrected." },
      { recordId: "bc-at-home-saet", kind: "coverage", summary: "The description of therapy support was corrected." },
      { recordId: "bc-autism-funding-6-18", kind: "application", summary: "The service and application document requirements were corrected." },
      { recordId: "bc-autism-funding-under-6", kind: "application", summary: "The provider and application document requirements were corrected." }
    ]
  },
  { date: "2026-10-14", text: "Applied re-verification batch three source-wording fixes to transit, recreation, health, disability designation, tax and employment supports. Restored conditional eligibility, funding and coverage qualifiers; corrected application routes, documents, processing times and contact numbers. ICBC now checks its accepted disability-confirmation routes separately, without rejecting unasked alternatives. DRES exclusions remain enforced. Kelowna and the three deferred observations are unchanged. Asset version 175; whole-record verification dates are unchanged.",
    revision: 4,
    changes: [
      { recordId: "taxisaver-translink", kind: "rule", summary: "The required transit membership was corrected." },
      { recordId: "victoria-life", kind: "coverage", summary: "The recreation facilities and available pass options were corrected." },
      { recordId: "aadl", kind: "rule", summary: "The assessment and other-coverage exceptions were clarified." },
      { recordId: "airdrie-fair-access", kind: "application", summary: "The accepted income documents and approval term were clarified." },
      { recordId: "bc-icbc-disability-discount", kind: "rule", summary: "The disability confirmation routes were corrected." },
      { recordId: "bc-pharmacare-plan-c", kind: "coverage", summary: "The emergency prescription coverage conditions were corrected." },
      { recordId: "bc-pwd-designation", kind: "application", summary: "The application purpose and prescribed-class routes were corrected." },
      { recordId: "bc-workbc-employment-services", kind: "coverage", summary: "The conditional training and related supports were clarified." },
      { recordId: "child-health-benefit", kind: "contact", summary: "The application contact numbers were corrected." },
      { recordId: "disability-supports-deduction", kind: "rule", summary: "The eligible activities for claiming expenses were corrected." },
      { recordId: "dres", kind: "rule", summary: "The employment support eligibility wording was corrected." },
      { recordId: "reddeer-fee-assistance", kind: "contact", summary: "The application contact number was corrected." },
      { recordId: "woodbuffalo-lift", kind: "application", summary: "The application and household document instructions were corrected." },
      { recordId: "handydart-translink", kind: "application", summary: "The application processing guidance was corrected." }
    ]
  },
  { date: "2026-10-14", text: "Corrected the Kelowna recreation assistance income table to the City's published 2025 Low Income Cut-Offs (family of 1: $26,926, up to $71,254 for 7); the previous figures were higher than the City's page. The program now says you are eligible to apply if you meet the income verification requirements and have all the necessary documentation, and the assessment time reads up to two weeks from the date of submission, provided all required information is received. Checked against the City of Kelowna's own page.",
    revision: 3,
    changes: [
      { recordId: "kelowna-recreation-assistance", kind: "amount", summary: "The income limits were corrected." },
      { recordId: "kelowna-recreation-assistance", kind: "rule", summary: "Who can apply and the income-check wording were clarified." }
    ]
  },
  { date: "2026-10-14", text: "Applied twenty-four source-wording corrections: student equipment help; Edmonton monthly Arc tiers and possible eligibility; HATC dwelling, claimant and non-refundable spending checks; Lethbridge separate forms and capped funding; medical-expense return lines and supported dependants; Medicine Hat separate subsidies, proof and processing caveats; conditional RDSP grants and bonds; Richmond program scope and assistance alternatives; Saanich benefit choices and alternative documents; and Taxi Saver cash remainders. HATC and Richmond now have record-specific checks so unasked alternatives are not refusals. Asset version 173. Whole-record verification dates and the student equipment source URL are unchanged.",
    revision: 2,
    changes: [
      { recordId: "csg-dse", kind: "coverage", summary: "The description of eligible equipment support was corrected." },
      { recordId: "edmonton-fare-assistance", kind: "amount", summary: "The monthly fare tiers were corrected." },
      { recordId: "home-accessibility-tax-credit", kind: "rule", summary: "The dwelling and claimant requirements were corrected." },
      { recordId: "lethbridge-fee-assistance", kind: "application", summary: "The separate application forms and recreation limits were clarified." },
      { recordId: "medical-expense-tax-credit", kind: "rule", summary: "The dependant expense and claim instructions were corrected." },
      { recordId: "medicinehat-fair-entry", kind: "coverage", summary: "The recreation and arts coverage limits were corrected." },
      { recordId: "richmond-rec-fee-subsidy", kind: "rule", summary: "The income check and recreation access limits were corrected." },
      { recordId: "saanich-life", kind: "coverage", summary: "The included recreation supports and funding limits were corrected." },
      { recordId: "rdsp", kind: "coverage", summary: "The conditions for receiving government grants and bonds were clarified." },
      { recordId: "taxi-saver-bctransit", kind: "application", summary: "The required payment method for the remaining fare was corrected." }
    ]
  },
  { date: "2026-10-14", text: "Corrected Healthy Kids cost-help wording and its inclusive income limit; medical transportation routes, extraordinary-cost wording and conditional escort costs; At Home Medical Benefits alternatives; Option B home owner grant certification; permanent and complete fuel-tax disability conditions; Sales Tax Credit age or family alternatives; and Burnaby FAIR Play child-benefit, CUAET and agency-referral routes. Unasked alternatives remain More to check, not a refusal. Based only on official snapshots fetched October 14 and re-confirmed unchanged October 15. Unverified facts remain unverified; no whole-record verification dates were advanced.",
    revision: 1,
    changes: [
      { recordId: "bc-healthy-kids", kind: "coverage", summary: "The cost-help wording was corrected." },
      { recordId: "bc-healthy-kids", kind: "rule", summary: "The inclusive income limit was clarified." },
      { recordId: "bc-medical-transportation", kind: "coverage", summary: "The extraordinary travel costs and conditional escort coverage were clarified." },
      { recordId: "bc-medical-transportation", kind: "rule", summary: "The eligibility routes and available-resource condition were corrected." },
      { recordId: "bc-at-home-medical", kind: "rule", summary: "The alternative medical-benefit eligibility routes were restored." },
      { recordId: "bc-additional-home-owner-grant", kind: "rule", summary: "The certification requirement was limited to the applicable route." },
      { recordId: "bc-fuel-tax-refund-disabilities", kind: "rule", summary: "The permanent disability and complete functional-loss conditions were corrected." },
      { recordId: "bc-sales-tax-credit", kind: "rule", summary: "The age and family eligibility alternatives were restored." },
      { recordId: "burnaby-fair-play", kind: "rule", summary: "The child-benefit, refugee and other eligibility routes were corrected." },
      { recordId: "burnaby-fair-play", kind: "application", summary: "The agency-referral alternative to a household application was clarified." }
    ]
  },
  { date: "2026-10-14", text: "Results and Print my action plan now include a combined Documents to gather checklist, using the unchanged wording from each matched program's guide. Shared items list the programs that need them; official program pages have the final lists. Nothing is sent or stored remotely." },
  { date: "2026-10-14", text: "English results now say Matches your answers, More to check, or Does not match these answers. Matching answers is not a decision by the program: results, guides and printed plans explain that the program decides if you qualify. Requirements, answers and matching rules are unchanged." },
  { date: "2026-10-14", text: "The Canada Disability Benefit guide now explains the income calculation under More about instead of treating it as a prerequisite. The RDSP guide likewise explains the earlier grant and bond deadline without making it a prerequisite for the plan. Other eligibility checks remain, so neither program is newly marked ready. These facts were checked against the official pages in October 2026; the contribution and BC transition checks are unchanged." },
  { date: "2026-10-13", text: "Guide freshness labels now distinguish individual source checks from the catalogue review. About shows live counts for both groups. Benefit facts and review dates are unchanged." },
  { date: "2026-10-13", text: "Requirements now show short checks with the full official wording available underneath. Mixed results keep the available cues, and requirement links, keyboard focus and printed guides are clearer. Eligibility rules are unchanged." },
  { date: "2026-09-05", text: "The organizations directory now covers Ontario; it previously showed Ontario residents nothing. Eight listings were added, including ARCH Disability Law Centre, Autism Ontario, Spinal Cord Injury Ontario, Easter Seals Ontario and Steps to Justice. Each was verified on the organization's own website in September 2026." },
  { date: "2026-09-05", text: "Windsor residents will now see two Pathway to Potential programs: the Affordable Pass Program, with a Transit Windsor 30-day adult bus pass at $63 instead of $124, and the 90% Recreation Discount, which takes 90% off eligible recreation registration fees before taxes. Proof of ODSP benefits counts as proof of income. Verified against the City of Windsor's own pages in September 2026." },
  { date: "2026-09-05", text: "Three more Region of Waterloo services added. Ontario Renovates lists a maximum of $25,000 per dwelling for homeowner repairs as a fully forgivable loan, with an accessibility grant portion up to $5,000; the maximum funding limits may be subject to change. Homemaking Support has a waitlist currently approximately 2–3 years except under special circumstances, and the curbside waste supports include assisted cart collection and 30 free garbage bag tags per year for approved medical-exemption applicants. Verified against the Region of Waterloo's own pages and its Ontario Renovates fact sheet in September 2026." },
  { date: "2026-09-05", text: "Grand River Transit programs added, along with the Region of Waterloo's four townships — North Dumfries, Wellesley, Wilmot and Woolwich — which the city list did not previously offer. Residents across the Region will now see the Affordable Transit Program ($47 a month instead of $104) and the free CNIB pass, and Kitchener, Cambridge and Waterloo residents will also see MobilityPLUS specialized transit and $60 of taxi coupons for $30, which the Region limits to those three cities. The Transit Support Person program, where the support person rides free, is region-wide. Verified against Grand River Transit's own pages in September 2026." },
  { date: "2026-09-05", text: "York Region programs added, covering Aurora, Markham, Newmarket, Richmond Hill and Vaughan. Residents will now see Homemakers Services, which helps pay for an in-home homemaker for people who are temporarily or permanently ill or disabled, and York Region's recreation, day camp and youth overnight camp subsidies for children from low-income families. Verified against York Region's own pages in September 2026." },
  { date: "2026-09-05", text: "Ottawa transit discounts added. Ottawa residents will now see the Community Pass for people receiving ODSP ($43.25 a month or $1.75 a ride, covering Para Transpo with no top-up), the Access pass for Para Transpo customers, EquiPass for people on a low income ($58.25 a month, about half an adult pass), and the a-card, which gives free travel on all routes except Para Transpo to people who are blind or partially sighted. Verified against OC Transpo's own fares pages in September 2026." },
  { date: "2026-09-05", text: "London added. Homeowners in London and Middlesex County who are seniors 60 or older or people with disabilities will now see Ontario Renovates, which offers a 10-year forgivable loan of up to $25,000 for essential repairs or accessibility work — and for accessibility modifications the first $5,000 is a grant rather than a loan. Funding is limited and first come, first served. Verified against the City of London's own page in September 2026." },
  { date: "2026-09-05", text: "Hamilton added. Residents will now see HSR Fare Assist, which halves single-ride PRESTO fares for a year for households at or below the Low-Income Measure. It counts income from any source, including ODSP and CPP Disability, and it applies to accessible DARTS trips as well as conventional buses. Verified against the City of Hamilton's own page in September 2026." },
  { date: "2026-09-05", text: "Brampton added. Residents will now see ActiveAssist, the City's recreation fee subsidy, worth $275 for each eligible family member paid as one lump sum — $1,100 for a family of four — with approval lasting two years. Verified against the City of Brampton's own page in September 2026." },
  { date: "2026-09-05", text: "Mississauga added. Residents will now see ActiveAssist, the City's fee assistance program for recreation and culture, worth $275 a year for each eligible family member. It is open to low-income households and to newcomers with refugee status. Verified against the City of Mississauga's own page in September 2026." },
  { date: "2026-09-05", text: "Ottawa added. Residents of Ottawa will now see Hand in Hand, the City's recreation and culture fee support program, worth $185 a year per person. Receiving ODSP or Assistance for Children with Severe Disabilities counts as proof of financial need. Verified against the City of Ottawa's own page in September 2026." },
  { date: "2026-09-05", text: "Toronto programs added. Ontario residents can now choose their city, and Toronto residents will see the Fair Pass Transit Discount, which takes 36% off adult single TTC and Wheel-Trans fares, and the Welcome Policy recreation fee subsidy, worth $683.04 a year up to age 24 and $314.60 a year at 25 and over. Both were verified against the City of Toronto's own pages in September 2026." },
  { date: "2026-09-04", text: "Fixed the questionnaire for Ontario residents. Ontario launched with province-wide programs and no municipal ones yet, so the \"which city or town\" question was being asked with an empty list and could not be answered. It is now skipped until Ontario municipalities are added." },
  { date: "2026-09-04", text: "Ontario is now covered. Nine provincial programs were added: the Ontario Disability Support Program (ODSP), the Assistive Devices Program, the Ontario Autism Program, Special Services at Home, Assistance for Children with Severe Disabilities, the Passport program, the Home and Vehicle Modification Program, the Trillium Drug Program, and the Accessible Parking Permit. Each was verified against its official ontario.ca page in September 2026. Ontario residents can now answer the questions and see which of these they may qualify for, alongside the federal programs." },
  { date: "2026-09-04", text: "Recorded review dates for groundwork records and logged this month's link-health review. Nothing shown on the site today has changed, and every published benefit is unchanged." },
  { date: "2026-09-04", text: "Groundwork for future provincial coverage, including a fix found while rehearsing the switch-on. Nothing shown on the site today has changed, and every published benefit is unchanged." },
  { date: "2026-09-04", text: "Final round of behind-the-scenes groundwork for future provincial coverage. Nothing shown on the site today has changed, and every published benefit is unchanged." },
  { date: "2026-09-04", text: "Continued behind-the-scenes groundwork for future provincial coverage. Nothing shown on the site today has changed, and every published benefit is unchanged." },
  { date: "2026-09-04", text: "More groundwork for future provincial coverage. Nothing shown on the site today has changed, and every published benefit is unchanged." },
  { date: "2026-09-04", text: "Continued groundwork for future provincial coverage. Nothing shown on the site today has changed, and every published benefit is unchanged." },
  { date: "2026-09-04", text: "Further groundwork for future provincial coverage, including the data plumbing and tests behind it. Nothing shown on the site today has changed, and every published benefit is unchanged." },
  { date: "2026-09-04", text: "More behind-the-scenes groundwork for future provincial coverage. Nothing shown on the site today has changed." },
  { date: "2026-09-04", text: "Behind-the-scenes groundwork to support adding more provinces in the future. Nothing the site shows today has changed, and every published benefit is unchanged." },
  { date: "2026-09-03", text: "The Fair PharmaCare guide now adds a note for people moving into long-term care: check the facility is enrolled in PharmaCare Plan B before moving in — Plan B gives permanent residents of enrolled facilities full coverage of eligible drugs and pharmacy services (supplies up to a maximum), automatically, but not all facilities are enrolled and it excludes assisted-living, extended-care, acute-care and temporary respite/hospice stays. Verified against the official BC PharmaCare Plan B page 2026-09-03." },
  { date: "2026-09-03", text: "Five more benefit descriptions (More about) — the Disability Tax Credit, the Multigenerational Home Renovation Tax Credit, and the Red Deer, St. Albert and Airdrie municipal subsidies — now show a short lead line followed by bullet points instead of a paragraph. The wording is unchanged." },
  { date: "2026-09-03", text: "Five more benefit descriptions (More about) — PharmaCare Plan P, First Nations Health Benefits, the Disability Supports Deduction, the BC dental supplement, and the SPARC parking permit — now show a short lead line followed by bullet points instead of a paragraph. The wording is unchanged." },
  { date: "2026-09-03", text: "Eight more benefit descriptions (More about) — the Canada Caregiver Credit, the Canadian Dental Care Plan, CAPCC, the Medical Expense Tax Credit, the BC students-with-disabilities grant, the Alberta service dog ID card, the Alberta disability services/equipment grant, and Fair PharmaCare — now show a short lead line followed by bullet points instead of a paragraph. The wording is unchanged." },
  { date: "2026-09-03", text: "Eight more benefit descriptions (More about) — WorkBC Assistive Technology, BC disability assistance (PWD), the BC Bus Pass, the optical supplement, the Grande Prairie AISH transit pass, the Monthly Nutritional Supplement, medical transportation, and PWD designation — now show a short lead line followed by bullet points instead of a paragraph. The wording is unchanged." },
  { date: "2026-09-03", text: "Eight more benefit descriptions (More about) — the BC additional home owner grant, PharmaCare Plan G, the Home Accessibility Tax Credit, the BC Child and Youth Disability Benefit, the At Home SAET therapies benefit, Healthy Kids, the BC home renovation tax credit, and the Wood Buffalo low-income transit program — now show a short lead line followed by bullet points instead of a paragraph. The wording is unchanged." },
  { date: "2026-09-03", text: "Eight benefit descriptions (More about) that were long paragraphs — BC RAHA, RAMP, Special Needs Housing, the CPP children's benefit, MSP Supplementary Benefits, the Excise Gasoline Tax Refund, BC medical equipment and devices, and Kamloops ARCH — now show a short lead line followed by the details as bullet points. The wording is unchanged, other than correcting one BC RAHA typo (\"BC Housing.s\" to \"BC Housing's\")." },
  { date: "2026-09-03", text: "Seven more benefit guides — the Multigenerational Home Renovation Tax Credit, PharmaCare Plan P (palliative), First Nations Health Benefits, the Disability Supports Deduction, the Canada Caregiver Credit, the BC dental supplement, and the SPARC accessible parking permit — now list what you must meet as a checklist, with filing and clarification details shown as a short note. The requirements and wording are unchanged." },
  { date: "2026-09-03", text: "Benefit pages now lead with the essentials and tuck secondary detail (full description, documents, tips, denial reasons, FAQs) into labelled expand sections, so pages are less overwhelming; short descriptions stay visible. The apply action in the quick-answers card is now a link, and DRES shows the at-a-glance row." },
  { date: "2026-09-03", text: "The Disability Related Employment Supports (DRES) guide is intentionally kept without the at-a-glance difficulty/apply/wait row, so that row was removed there; it covers the other 17 recently updated benefits." },
  { date: "2026-09-02", text: "Added the at-a-glance difficulty, apply-time and wait row to 18 benefits that were missing it." },
  { date: "2026-09-02", text: "The Community Living BC and Autism Funding (under 6 / 6–18) guides now show what they cover as a bulleted list instead of a long run-on sentence. The covered items and amounts are unchanged." },
  { date: "2026-09-02", text: "Split several long run-on sentences in benefit descriptions into shorter ones for easier reading. Only punctuation changed — no amounts, dates, or eligibility wording were altered." },
  { date: "2026-09-02", text: "The Fair PharmaCare guide now shows what the plan pays at each family-net-income band in a table, instead of a run-on sentence. The income bands and coverage are unchanged." },
  { date: "2026-09-02", text: "Five more BC benefit guides (Saanich recreation, the home renovation tax credit, the additional home owner grant, the Home Adaptations rebate, and PharmaCare Plan G) now list their eligibility as a checklist. The requirements are unchanged." },
  { date: "2026-09-02", text: "Three municipal recreation-access programs (Victoria, Kelowna, Coquitlam) now show their eligibility as a checklist and their low-income thresholds as a table by household size, instead of a run-on paragraph. The thresholds are unchanged." },
  { date: "2026-09-02", text: "Employment supports and four municipal recreation-access programs (Vancouver, Surrey, Burnaby, Richmond) now list their eligibility as a checklist. The requirements are unchanged." },
  { date: "2026-09-02", text: "Six more British Columbia benefit guides — HandyDART and taxi programs, the fuel tax refund, property tax deferment, and the sales tax credit — now list their eligibility as a checklist. The requirements are unchanged." },
  { date: "2026-09-02", text: "Six British Columbia student-aid disability grants and bursaries now list their eligibility as a checklist instead of a paragraph. The requirements are unchanged." },
  { date: "2026-09-02", text: "Three more British Columbia benefit guides — MSP Supplementary Benefits, the At Home Program medical benefits, and the Child and Youth Disability Benefit — now list their eligibility as a checklist instead of a paragraph. The requirements are unchanged." },
  { date: "2026-09-02", text: "Five more British Columbia benefit guides now list their eligibility as a checklist instead of a paragraph, including which programs accept any one of several routes. The requirements are unchanged." },
  { date: "2026-09-02", text: "Four more Alberta benefit guides — Disability Related Employment Supports, the Client and Family Support continuing-care benefit, the service dog ID card, and Special Needs Housing — now list their eligibility as a checklist instead of a paragraph. The requirements are unchanged." },
  { date: "2026-09-02", text: "Three more benefit guides — the Excise Gasoline Tax Refund, the Home Accessibility Tax Credit, and the CPP children's benefit — now list their eligibility requirements as a checklist instead of a paragraph. The requirements and wording are unchanged." },
  { date: "2026-09-02", text: "The Canadian Dental Care Plan guide now lists its four eligibility requirements as a checklist under a clear \"You must meet all of these\" heading, instead of a single dense paragraph, so you can scan whether you qualify. The requirements, wording of the exceptions, and the T4/T4A coverage-code note are unchanged." },
  { date: "2026-09-02", text: "The Canadian Dental Care Plan guide now shows what the plan pays at each adjusted-family-net-income band in a small table, instead of only a run-on sentence, so you can find your band at a glance. The income thresholds and coverage rates are unchanged — this is a presentation change, not a change to what the plan pays." },
  { date: "2026-08-17", text: "Removed the Rose City Handi-Van Society listing from the organization directory. The society is real and runs the Camrose Community Bus, but it has no working website of its own, so the listing pointed at a City of Camrose page instead. This directory tells you every listing must have a verifiable official website, and we would rather honour that than quietly make an exception. If you need accessible transport in Camrose, call the City of Camrose or 2-1-1 Alberta. We will list the society again if it puts up a working site." },
  { date: "2026-08-16", text: "The Rose City Handi-Van listing now names its link as the City of Camrose service page instead of the generic Website label, so it is clear the link goes to the City rather than the society." },
  { date: "2026-08-16", text: "Softened a homepage line that said every program hides its rules behind walls of text; it now says many programs do." },
  { date: "2026-08-16", text: "Added Rose City Handi-Van Society to the organization directory so Camrose residents can find local accessible transport, with the Camrose Community Bus details and phone number taken from the City of Camrose." },
  { date: "2026-08-16", text: "The out-of-province option no longer says you will see all Canada-wide benefits, since the catalog holds selected federal programs, and the browse page heading now follows the interface language." },
  { date: "2026-08-16", text: "The browse buttons on the landing page and in the footer now follow the interface language instead of always showing English." },
  { date: "2026-08-16", text: "Finished matching the browse wording across the app, corrected the embed to say every benefit links to its official source rather than every fact, and made the search descriptions say Alberta and British Columbia plus Canada-wide federal programs." },
  { date: "2026-08-16", text: "Corrected the search and sharing text so it matches the site: the page description, social share titles, 404 page and program-guide calls to action no longer promise every benefit or say benefits are owed to you." },
  { date: "2026-08-16", text: "Replaced a homepage line that claimed half of the benefits you are entitled to go unheard. The fraction had no source and the wording asserted entitlement the tool never establishes; both languages now say programs you could qualify for never come up." },
  { date: "2026-08-16", text: "Removed remaining copy that implied the questionnaire decides eligibility, that provincial coverage is complete, or that the tool lists every government benefit. Both languages now describe a catalog of selected programs and possible matches to verify." },
  { date: "2026-08-15", text: "Updated the results list description to say programs are ordered by likely value and ease of applying, rather than by ease alone." },
  { date: "2026-08-15", text: "Updated the homepage headline and supporting copy to describe answering questions, seeing possible benefit matches to verify, and getting next steps instead of promising every benefit, and corrected French coverage labels that listed provinces outside the catalog." },
  { date: "2026-08-15", text: "Disability Tax Credit guidance now explains the CRA's three eligibility routes and their thresholds, with short prompts to help people discuss affected activities, duration and combined limitations with a medical practitioner." },
  { date: "2026-08-15", text: "Repointed the Easter Seals Alberta directory link to the organisation's main site after its equipment-programs page stopped working." },
  { date: "2026-07-22", text: "Updated the Canada Disability Benefit maximum for July 2026–June 2027 and its separate September 2026 supplement, added the required AISH/ADAP reporting action, distinguished the no-fee PWD Bus Pass from the $45 senior stream, and documented the 50% final-period Autism Funding equipment, travel and training exception." },
  { date: "2026-07-22", text: "Corrected Disability Tax Credit guidance: removed the disability amount and unsupported back-pay estimate from value totals, replaced universal practitioner suggestions with the current CRA certification matrix, and removed automatic first-place ranking." },
  { date: "2026-07-21", text: "Restored the quicker tap-to-select age question with eight eligibility-relevant ranges. Exact ages are no longer collected or stored, while existing questionnaire progress remains compatible." },
  { date: "2026-07-21", text: "Replaced age-band guessing with a private exact-age field, expanded daily-life and school situations, and rebuilt B.C. application guides with verified steps, document checklists, direct next actions and a readable responsive guide layout." },
  { date: "2026-07-21", text: "Added contextual help for every questionnaire uncertainty choice, repaired older child sessions so they return to the exact age question, added regular-school choices for students through age 18, and centred the legal/privacy note across viewport sizes." },
  { date: "2026-07-21", text: "Questionnaire matching tightened with exact age bands, child school stages, disability documentation, functional-impact questions, and explicit BC program prerequisites to prevent unrelated results. BC charitable funds, helper organizations, guide metadata, program-type labels and province-specific practical resources were added." },
  { date: "2026-07-21", text: "British Columbia coverage launched, including provincial programs and nine verified municipal recreation programs." },
  { date: "2026-07-20", text: "Expanded the verified grants and disability-organization directories, strengthened automatic link monitoring, and refreshed time-sensitive catalog facts." },
  { date: "2026-07-19", text: "Results now expand in place to full program guides." },
  { date: "2026-07-19", text: "Published grants and disability-organization directories, life-situation entry points, DTC appointment preparation, partner tools, impact reporting and an embeddable finder." },
  { date: "2026-07-18", text: "35 printable program guide pages published; printable action plan added." },
  { date: "2026-07-18", text: "Added trust, privacy, accessibility and verification pages; improved navigation, benefit-card guidance and search-engine guide coverage." },
  { date: "2026-07-15", text: "Added privacy-preserving browser persistence, cross-tab safety, municipal benefit coverage, blank-page recovery, link-health monitoring and catalog corrections." },
  { date: "2026-07-14", text: "AbilityFinder launched with a sourced Alberta and federal catalog, a plain-language questionnaire and guides, accessibility controls, a grounded assistant, feedback tools and full catalog verification." },
];

/* Optional personal-notice metadata. Unattributed history stays public-feed-only.
   Revisions are immutable publication batches, oldest first when validating. */
const AbilityFinderProgramChanges = (() => {
  const kinds = new Set(['amount', 'rule', 'deadline', 'application', 'coverage', 'contact']);
  function validEntry(entry, knownIds) {
    return !!entry && Number.isSafeInteger(entry.revision) && entry.revision > 0 &&
      Array.isArray(entry.changes) && entry.changes.length > 0 && entry.changes.length <= knownIds.size * kinds.size &&
      entry.changes.every((change) => change && typeof change === 'object' && !Array.isArray(change) &&
        Object.keys(change).length === 3 && knownIds.has(change.recordId) && kinds.has(change.kind) &&
        typeof change.summary === 'string' && change.summary.trim().length > 0 && change.summary.length <= 120 &&
        !/^\d+$/.test(change.summary.trim()));
  }
  function collect(entries, ids) {
    const knownIds = new Set(ids);
    let watermark = 0;
    const changes = [];
    for (const entry of [...entries].reverse()) {
      if (!validEntry(entry, knownIds) || entry.revision <= watermark) continue;
      watermark = entry.revision;
      for (const change of entry.changes) changes.push({ ...change, revision: entry.revision, date: entry.date });
    }
    return { watermark, changes };
  }
  return { validEntry, collect };
})();
