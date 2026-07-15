// GENERATED FILE — DO NOT EDIT BY HAND.
// Regenerate with:  npm run gen:context
// Sources of truth: public/data.js (BENEFITS) + public/app.js (PRACTITIONER_FORMS)
//
// 28 benefits. Figures are redacted on purpose — the assistant is
// told never to state an amount, and the surest way to hold a small model to
// that is to never show it one. It explains the concept and points at the guide.

/** Always injected: the catalog of what exists + the verified form names. */
export const BENEFITS_CONTEXT = "- Disability Tax Credit (DTC) [Federal · Money & taxes] — The master key. A tax credit that lowers the income tax you (or a family member) pay — and it unlocks most other disability benefits below.\n- Canada Disability Benefit [Federal · Money] — A monthly payment for working-age adults with a disability and lower income.\n- Child Disability Benefit [Federal · Money (for parents)] — A tax-free monthly amount added to the Canada Child Benefit for a child approved for the DTC.\n- Registered Disability Savings Plan (RDSP) [Federal · Money & savings] — A savings account where the government adds matching grants (up to 300%) and bonds — you don't even need to contribute to get the bond if your income is low.\n- Canada Workers Benefit — Disability Supplement [Federal · Money & taxes] — If you work and earn a lower income, this adds an extra disability top-up to your tax refund.\n- CPP Disability Benefit [Federal · Money] — A monthly payment if a severe, long-term disability stops you from working and you've paid into CPP.\n- Canada Student Grant for Students with Disabilities [Federal · Education] — Extra grant money for post-secondary students with a documented disability.\n- Canada Student Grant — Services & Equipment [Federal · Education] — Covers assistive technology, note-taking, tutoring, coaching and other supports for students with disabilities.\n- Assured Income for the Severely Handicapped (AISH) [Alberta · Money] — Alberta's main disability income program — a monthly living allowance plus health coverage.\n- Alberta Aids to Daily Living (AADL) [Alberta · Health & equipment] — Helps pay for equipment and supplies you need for a long-term illness, disability or condition — wheelchairs, hearing aids, breathing supplies and much more.\n- Persons with Developmental Disabilities (PDD) [Alberta · Daily living supports] — Support services for adults with a developmental disability — help with daily living, community involvement, and employment.\n- Family Support for Children with Disabilities (FSCD) [Alberta · Family supports] — Support and funding for Alberta families raising a child under 18 with a disability — respite, aids, counselling, and reimbursement of some costs.\n- Disability Related Employment Supports (DRES) [Alberta · Employment] — Pays for supports that help you get or keep a job, or finish training — assistive devices, tutoring, coaching, workplace tools.\n- Alberta Grant for Students with Disabilities [Alberta · Education] — Alberta top-up grant for post-secondary students with a disability.\n- Alberta Adult Health Benefit [Alberta · Health] — Health coverage for adults in lower-income households — prescriptions, dental, eye care, essential diabetic supplies.\n- Alberta Child Health Benefit [Alberta · Health (for children)] — Health coverage for children in lower-income families — including prescriptions, dental and eye care.\n- Disability Parking Placard [Alberta · Getting around] — A placard that lets you use accessible parking spaces.\n- Calgary Fair Entry — Transit & Recreation [Calgary · Getting around & recreation] — One application unlocks a low-income monthly transit pass and 75% off City of Calgary pools, fitness and rec programs.\n- Edmonton Ride Transit & Leisure Access [Edmonton · Getting around & recreation] — A subsidized monthly Arc transit card plus reduced-cost access to City of Edmonton recreation facilities.\n- Red Deer Transit & Recreation Fee Assistance [Red Deer · Getting around & recreation] — A reduced monthly transit pass plus help with City recreation fees. Being on AISH qualifies you automatically.\n- Lethbridge Fee Assistance Program [Lethbridge · Getting around & recreation] — One application covers transit, Access-A-Ride paratransit, and recreation fees. AISH counts as proof of income.\n- Medicine Hat Fair Entry [Medicine Hat · Getting around & recreation] — One application, valid up to two years, for cheaper transit passes plus recreation and Esplanade arts programs.\n- Grande Prairie AISH Transit Pass & Recreation Access [Grande Prairie · Getting around & recreation] — If you're on AISH, a monthly Grande Prairie transit pass costs $10.25 instead of $74.25 — the deepest municipal transit discount in the province that we've found.\n- St. Albert Transit & Recreation Subsidy [St. Albert · Getting around & recreation] — On AISH or ADAP in St. Albert, local buses and the Handibus are free, and a year's membership at every City rec facility is free too.\n- Strathcona County Everybody Rides & Everybody Gets to Play [Sherwood Park · Getting around & recreation] — Reduced transit fares on your Arc card and a no-cost annual Active Pass+ for County recreation facilities, for residents on a limited income.\n- Airdrie Fair Access [Airdrie · Getting around & recreation] — One income-tested application covering Airdrie transit passes and Genesis Place recreation, at 25%, 50% or 75% off depending on income.\n- Wood Buffalo LIFT (Low-Income Fare Transit) [Fort McMurray · Getting around & recreation] — A $10 monthly transit pass, 75% off specialized SMART Bus passes, and a separate 60% discount on regional recreation memberships.\n- Local transit & recreation discounts [Your community · Getting around & recreation] — Many cities and towns run their own low-income or disability discounts on transit passes and recreation. 2-1-1 can point you to yours.\n\nFORMS A PRACTITIONER MUST SIGN (the only form names you may state):\n- Disability Tax Credit (DTC): a practitioner signs the Disability Tax Credit certificate (Form T2201).\n- CPP Disability Benefit: a practitioner signs the CPP-Disability medical report.\n- Assured Income for the Severely Handicapped (AISH): a practitioner signs the AISH medical report (Part B).\n- Disability Parking Placard: a practitioner signs the accessible parking placard form.";

/** Injected only when the question matches — see retrieveDetails() in index.js. */
export const BENEFIT_DETAILS = {
  "dtc": {
    "name": "Disability Tax Credit (DTC)",
    "keys": [
      "dtc",
      "disability tax credit",
      "t2201"
    ],
    "text": "What it is: A federal tax credit for people with a severe, long-lasting impairment in physical or mental functions. Getting approved is the single most important step, because it's what makes you eligible for the Canada Disability Benefit, RDSP, Child Disability Benefit and more.\nHow to apply:\n  1. Sign in to (or create) CRA My Account — or use the paper form.\n  2. Fill Part A (your personal information).\n  3. Ask a medical practitioner who knows you to complete Part B, describing how your condition limits your daily life.\n  4. Submit through CRA My Account for the fastest processing.\n  5. If approved, ask the CRA to reassess up to 10 past years — this can mean a large back-payment.\nWhat you need:\n  - Your Social Insurance Number (SIN)\n  - A medical practitioner familiar with your condition\n  - Real examples of how it limits you (focus, memory, walking, self-care, etc.)\nPractical tips:\n  - The medical practitioner's section decides most approvals — ask them to be specific and give concrete examples of your limitations.\n  - You do NOT need to pay a private company a percentage of your refund. Applying directly is free.\n  - Denied? You can request a review or appeal. Many people are approved on a second try with stronger wording.\nHow long it takes (verified — you may state this): About 8 weeks once the CRA has the completed form.\nPhone (this exact number is verified — you may give it): CRA: 1-800-959-8281"
  },
  "cdb-adult": {
    "name": "Canada Disability Benefit",
    "keys": [
      "cdb-adult",
      "cdb adult",
      "canada disability benefit"
    ],
    "text": "What it is: A new federal income top-up (started July 2025) for low-income adults aged 18–64 who are approved for the Disability Tax Credit.\nHow to apply:\n  1. Make sure your DTC is approved and your taxes are filed.\n  2. Apply online, by phone, by mail, or in person once applications are open to you.\n  3. Provide direct-deposit details so payments arrive automatically.\nWhat you need:\n  - DTC approval on file with the CRA\n  - Your most recent tax return filed\n  - Banking info for direct deposit\nPractical tips:\n  - File your taxes every year even with no income — payments are calculated from your return.\n  - The first [amount — see the guide] of your own working income (or [amount — see the guide] for a couple) is not counted against you.\nHow long it takes (verified — you may state this): Paid monthly once approved.\nPhone (this exact number is verified — you may give it): Service Canada: 1-800-O-Canada"
  },
  "child-disability-benefit": {
    "name": "Child Disability Benefit",
    "keys": [
      "child-disability-benefit",
      "child disability benefit"
    ],
    "text": "What it is: Extra monthly money for families raising a child under 18 who qualifies for the Disability Tax Credit. It's added on top of the regular Canada Child Benefit.\nHow to apply:\n  1. Apply for the DTC for your child (Form T2201).\n  2. Make sure you're already receiving the Canada Child Benefit (CCB).\n  3. Once the DTC is approved, the Child Disability Benefit is added automatically.\nWhat you need:\n  - Your child's DTC approval\n  - You must be the person receiving the CCB\nPractical tips:\n  - No separate application — the hard part is just getting your child's DTC approved.\n  - The amount reduces gradually for family income over about [amount — see the guide].\nHow long it takes (verified — you may state this): Added to your next CCB payment after DTC approval.\nPhone (this exact number is verified — you may give it): CRA benefits: 1-800-387-1193"
  },
  "rdsp": {
    "name": "Registered Disability Savings Plan (RDSP)",
    "keys": [
      "rdsp",
      "registered disability savings plan"
    ],
    "text": "What it is: A long-term savings account for people approved for the DTC. The government pays in grants (matching what you put in) and bonds (free money for lower incomes) — potentially tens of thousands of dollars over time.\nHow to apply:\n  1. Get approved for the DTC first.\n  2. Choose a bank or credit union that offers RDSPs.\n  3. Open the plan with your SIN and DTC approval.\n  4. Contribute if you can — but even [amount — see the guide] contributions still earn the bond if your income is low.\nWhat you need:\n  - Your SIN and DTC approval\n  - Be a Canadian resident under age 60\nPractical tips:\n  - The bond (up to [amount — see the guide]/year) requires NO contribution from you — don't leave it on the table.\n  - Grants can match up to [percentage — see the guide] — for lower incomes, the first [amount — see the guide] you put in can become [amount — see the guide].\n  - Ask the bank specifically for an 'RDSP' — front-line staff sometimes aren't familiar with it.\nHow long it takes (verified — you may state this): Can be opened same-day once you have DTC approval.\nPhone (this exact number is verified — you may give it): RDSP info: 1-866-204-0357"
  },
  "cwb-disability": {
    "name": "Canada Workers Benefit — Disability Supplement",
    "keys": [
      "cwb-disability",
      "cwb disability",
      "canada workers benefit — disability supplement"
    ],
    "text": "What it is: A refundable tax credit that boosts the income of lower-earning workers, with an extra 'disability supplement' for those approved for the DTC.\nHow to apply:\n  1. Have your DTC on file with the CRA.\n  2. File your income tax return — claim the disability supplement (Schedule 6).\n  3. Tax software or a free tax clinic will handle it for you.\nWhat you need:\n  - DTC approval\n  - Your T4 / record of working income\nPractical tips:\n  - You may be able to receive part of it in advance rather than waiting for tax time.\n  - Free volunteer tax clinics can file this for you if money is tight.\nHow long it takes (verified — you may state this): Received with your tax refund (or as advance payments).\nPhone (this exact number is verified — you may give it): CRA: 1-800-959-8281"
  },
  "cpp-disability": {
    "name": "CPP Disability Benefit",
    "keys": [
      "cpp-disability",
      "cpp disability",
      "cpp disability benefit"
    ],
    "text": "What it is: A monthly payment from the Canada Pension Plan for people under 65 who have worked and contributed to CPP but can no longer work regularly because of a severe, prolonged disability.\nHow to apply:\n  1. Gather your medical information and work history.\n  2. Complete the CPP Disability application (online through My Service Canada Account, or on paper).\n  3. Have your doctor complete the medical report section.\n  4. Submit and keep a copy of everything.\nWhat you need:\n  - Enough CPP contributions (generally 4 of the last 6 years)\n  - A detailed medical report from your doctor\n  - Details of your work history and why you can't continue\nPractical tips:\n  - 'Severe and prolonged' is a high bar — describe your worst days honestly, not your best.\n  - If denied, you can request reconsideration — many are approved at that stage. Don't give up after a first no.\n  - Apply as soon as you stop being able to work; there can be back-pay.\nHow long it takes (verified — you may state this): Around 120 days for a decision.\nPhone (this exact number is verified — you may give it): Service Canada: 1-800-277-9914"
  },
  "csg-disability": {
    "name": "Canada Student Grant for Students with Disabilities",
    "keys": [
      "csg-disability",
      "csg disability",
      "canada student grant for students with disabilities"
    ],
    "text": "What it is: A federal grant (not a loan) to help post-secondary students with a permanent or persistent disability with the general costs of school.\nHow to apply:\n  1. Create an Alberta Student Aid account.\n  2. Apply for student aid for your program.\n  3. Complete the disability section and submit a Schedule 4 + medical documentation the first time.\nWhat you need:\n  - Proof of your disability (e.g. assessment or a completed Schedule 4)\n  - Enrolment in a designated post-secondary program\nPractical tips:\n  - One Alberta Student Aid application covers the federal grants AND the Alberta grant — you don't apply separately.\n  - You only need to submit disability documentation once, not every year.\nHow long it takes (verified — you may state this): Assessed with your student aid application.\nPhone (this exact number is verified — you may give it): Alberta Student Aid: 1-855-606-2096"
  },
  "csg-dse": {
    "name": "Canada Student Grant — Services & Equipment",
    "keys": [
      "csg-dse",
      "csg dse",
      "canada student grant — services & equipment"
    ],
    "text": "What it is: A large grant that pays for the specific services and equipment a student needs because of their disability — from screen readers and hearing supports to coaching, tutoring and note-taking.\nHow to apply:\n  1. Apply through Alberta Student Aid and complete the disability section.\n  2. Work with your school's Accessibility / Disability Services office to identify what you need.\n  3. Submit quotes or a recommendation for the equipment/services.\nWhat you need:\n  - Disability documentation on file\n  - A recommendation or quote for the specific supports (often via your school's accessibility office)\nPractical tips:\n  - Your campus Accessibility Services office does this all the time — go to them first; they'll guide the paperwork.\n  - Can cover ADHD/learning coaching, tutoring, and organization tools, not just physical equipment.\nHow long it takes (verified — you may state this): Assessed with your student aid application.\nPhone (this exact number is verified — you may give it): Alberta Student Aid: 1-855-606-2096"
  },
  "aish": {
    "name": "Assured Income for the Severely Handicapped (AISH)",
    "keys": [
      "aish",
      "assured income for the severely handicapped"
    ],
    "text": "What it is: A monthly living allowance for Alberta adults whose severe, permanent disability substantially limits their ability to work. It also comes with health benefits (prescriptions, dental, optical) and other supports.\nHow to apply:\n  1. Read the eligibility page to confirm you likely qualify.\n  2. Complete Part A (you) of the application; your doctor completes Part B (medical).\n  3. Submit to an AISH office; you'll usually meet with a caseworker.\nWhat you need:\n  - Medical report showing a severe, permanent impairment\n  - Proof of Alberta residency + Canadian citizenship / PR\n  - Financial details (income and assets)\nPractical tips:\n  - The medical form should focus on how your condition limits your ability to EARN A LIVING, not just the diagnosis.\n  - There's a financial test — some assets (like your home and vehicle) are exempt.\n  - If ADHD/mental health is your only condition, pair it with any other diagnoses and be detailed about work impact.\nHow long it takes (verified — you may state this): Can take several months; apply early.\nPhone (this exact number is verified — you may give it): Alberta Supports: 1-877-644-9992"
  },
  "aadl": {
    "name": "Alberta Aids to Daily Living (AADL)",
    "keys": [
      "aadl",
      "alberta aids to daily living"
    ],
    "text": "What it is: A provincial program that funds basic medical equipment and supplies for Albertans with a long-term disability, chronic illness or terminal illness — mobility aids, hearing aids, vision aids, breathing equipment, diabetic and ostomy supplies, and more.\nHow to apply:\n  1. See an AADL-authorized health professional (e.g. an OT, audiologist, or specialist) who assesses what you need.\n  2. They complete the authorization for the specific equipment.\n  3. Get the item from an approved vendor; AADL covers its share directly.\nWhat you need:\n  - Alberta Health Care (personal health) number\n  - An assessment from an authorized professional for the specific item\nPractical tips:\n  - You don't apply to a general office — you go through an authorizer (often an OT, physio, or audiologist). Ask your doctor for a referral.\n  - The [percentage — see the guide] cost-share is capped each year, and can be waived entirely for low-income households or those on AISH.\nHow long it takes (verified — you may state this): Depends on the assessment and vendor.\nPhone (this exact number is verified — you may give it): AADL: 780-427-0731 (toll-free via 310-0000)"
  },
  "pdd": {
    "name": "Persons with Developmental Disabilities (PDD)",
    "keys": [
      "pdd",
      "persons with developmental disabilities"
    ],
    "text": "What it is: A program that funds services helping adults with developmental disabilities live as independently as possible — community access, home living supports, employment supports and specialized services.\nHow to apply:\n  1. Contact a PDD office or Alberta Supports to start.\n  2. An assessment confirms eligibility (developmental disability with onset before 18).\n  3. Work with a coordinator to build a support plan and connect with service providers.\nWhat you need:\n  - Psychological assessment showing a developmental disability before age 18\n  - Proof of Alberta residency + age 18+\nPractical tips:\n  - PDD funds services and supports rather than paying you cash — many people also receive AISH at the same time.\n  - Start early; assessment and planning can take time.\nHow long it takes (verified — you may state this): Varies; assessment-based.\nPhone (this exact number is verified — you may give it): Alberta Supports: 1-877-644-9992"
  },
  "fscd": {
    "name": "Family Support for Children with Disabilities (FSCD)",
    "keys": [
      "fscd",
      "family support for children with disabilities"
    ],
    "text": "What it is: A provincial program that helps families of children under 18 with disabilities cover the extra costs and stress of caregiving — respite, child-focused supports, family counselling, and reimbursement of some disability-related expenses.\nHow to apply:\n  1. Contact an FSCD office or Alberta Supports.\n  2. Meet with an FSCD worker to identify your family's needs.\n  3. A signed agreement sets out the services and funding you'll receive.\nWhat you need:\n  - A diagnosis of your child's disability from a professional\n  - Proof of Alberta residency\nPractical tips:\n  - Ask specifically about respite — many families don't realize it's covered.\n  - You can receive FSCD AND the federal Child Disability Benefit at the same time.\nHow long it takes (verified — you may state this): Assessment-based; contact them to begin.\nPhone (this exact number is verified — you may give it): Alberta Supports: 1-877-644-9992"
  },
  "dres": {
    "name": "Disability Related Employment Supports (DRES)",
    "keys": [
      "dres",
      "disability related employment supports"
    ],
    "text": "What it is: Funding for the specific supports you need to overcome disability-related barriers to work or training — assistive technology, tutoring, interpreters, coaching, exam accommodations, even some vehicle or workplace modifications.\nHow to apply:\n  1. Contact your nearest Alberta Supports Centre.\n  2. Complete an employability assessment with a worker.\n  3. Together you build a service plan listing the supports DRES will fund.\nWhat you need:\n  - Documentation of a permanent/chronic disability that affects work or training\n  - Proof you're legally entitled to work in Canada\nPractical tips:\n  - No DTC needed — this is one of the easiest supports to access with an ADHD, learning, or mental-health diagnosis.\n  - Be specific about the barrier and the tool that would fix it (e.g. 'text-to-speech software for reports').\nHow long it takes (verified — you may state this): Assessment-based.\nPhone (this exact number is verified — you may give it): Alberta Supports: 1-877-644-9992"
  },
  "ab-grant-disability": {
    "name": "Alberta Grant for Students with Disabilities",
    "keys": [
      "ab-grant-disability",
      "ab grant disability",
      "alberta grant for students with disabilities"
    ],
    "text": "What it is: A provincial grant (not a loan) that stacks on top of the federal disability grants to help Alberta post-secondary students with a disability.\nHow to apply:\n  1. Apply for student aid through Alberta Student Aid.\n  2. Complete the disability section.\n  3. Submit a Schedule 4 + medical documentation the first time you apply.\nWhat you need:\n  - Schedule 4 (Disability Verification) form\n  - Medical documentation of your disability\nPractical tips:\n  - It's the same single application as the federal grants — no extra form.\n  - Documentation is a one-time submission, reused in future years.\nHow long it takes (verified — you may state this): Assessed with your student aid application.\nPhone (this exact number is verified — you may give it): Alberta Student Aid: 1-855-606-2096"
  },
  "adult-health-benefit": {
    "name": "Alberta Adult Health Benefit",
    "keys": [
      "adult-health-benefit",
      "adult health benefit",
      "alberta adult health benefit"
    ],
    "text": "What it is: Ongoing health coverage for adults and families with lower incomes — prescription drugs, dental, optical, emergency ambulance, and diabetic supplies — at no monthly premium.\nHow to apply:\n  1. Check the income guidelines on the page.\n  2. Complete the Alberta Adult Health Benefit application.\n  3. Submit it with proof of income.\nWhat you need:\n  - Proof of income (e.g. tax assessment)\n  - Alberta Health Care number\nPractical tips:\n  - If you leave AISH or Income Support because you started working, you may keep this coverage — ask specifically.\nHow long it takes (verified — you may state this): A few weeks to process.\nPhone (this exact number is verified — you may give it): Alberta Supports: 1-877-644-9992"
  },
  "child-health-benefit": {
    "name": "Alberta Child Health Benefit",
    "keys": [
      "child-health-benefit",
      "child health benefit",
      "alberta child health benefit"
    ],
    "text": "What it is: Health coverage for children up to 18 (or 19 if in school) in lower-income Alberta families — prescriptions, dental, optical, and more, with no premium.\nHow to apply:\n  1. Check the income guidelines.\n  2. Complete the Alberta Child Health Benefit application.\n  3. Submit with proof of income.\nWhat you need:\n  - Proof of family income\n  - Your children's Alberta Health Care numbers\nPractical tips:\n  - One application can cover all the children in your household.\nHow long it takes (verified — you may state this): A few weeks to process.\nPhone (this exact number is verified — you may give it): Alberta Supports: 1-877-644-9992"
  },
  "parking-placard": {
    "name": "Disability Parking Placard",
    "keys": [
      "parking-placard",
      "parking placard",
      "disability parking placard"
    ],
    "text": "What it is: A permit that lets you park in designated accessible spaces. Blue placards are for long-term disabilities (valid 5 years); red placards are for temporary ones (3–12 months).\nHow to apply:\n  1. Get the application form and have a medical practitioner complete their section.\n  2. Take it to any registry agent (e.g. an AMA centre).\nWhat you need:\n  - Application form with the medical section completed\n  - Government-issued ID\nPractical tips:\n  - You don't need to own a vehicle — the placard belongs to you, not a car.\n  - A doctor, nurse practitioner, or in some cases other practitioners can certify it.\nHow long it takes (verified — you may state this): Issued at the registry, often same-day.\nPhone (this exact number is verified — you may give it): Any Alberta registry agent"
  },
  "calgary-fair-entry": {
    "name": "Calgary Fair Entry — Transit & Recreation",
    "keys": [
      "calgary-fair-entry",
      "calgary fair entry",
      "calgary fair entry — transit & recreation"
    ],
    "text": "What it is: A single City of Calgary application ('Fair Entry') that qualifies you for several low-income discounts at once — the sliding-scale monthly transit pass and [percentage — see the guide] off recreation admission and programs.\nHow to apply:\n  1. Gather proof of income for your household.\n  2. Apply online through Fair Entry (or in person).\n  3. Once approved, buy the low-income transit pass and use your Fee Assistance card for recreation.\nWhat you need:\n  - Proof of income (e.g. tax assessment or benefit statements)\n  - Calgary address\nPractical tips:\n  - One approval covers transit AND recreation — you don't apply separately.\n  - The transit pass price slides with income, as low as [amount — see the guide]/month.\nHow long it takes (verified — you may state this): Usually processed within a couple of weeks.\nPhone (this exact number is verified — you may give it): City of Calgary 311"
  },
  "edmonton-fare-assistance": {
    "name": "Edmonton Ride Transit & Leisure Access",
    "keys": [
      "edmonton-fare-assistance",
      "edmonton fare assistance",
      "edmonton ride transit & leisure access"
    ],
    "text": "What it is: City of Edmonton programs that give lower-income residents a discounted monthly transit pass (the Ride Transit Program) and reduced-cost recreation access (the Leisure Access Program).\nHow to apply:\n  1. Complete the Leisure Access / Ride Transit application.\n  2. Include proof of income OR proof you receive AISH / CPP-D.\n  3. Once approved, buy the [amount — see the guide] monthly Arc card and use your Leisure Access pass.\nWhat you need:\n  - Proof of income OR AISH / CPP-D statement\n  - Edmonton address\nPractical tips:\n  - Applying for Leisure Access automatically considers you for the transit discount too.\n  - If you're on AISH or CPP Disability you likely qualify regardless of the income cutoff.\nHow long it takes (verified — you may state this): A couple of weeks.\nPhone (this exact number is verified — you may give it): City of Edmonton 311"
  },
  "reddeer-fee-assistance": {
    "name": "Red Deer Transit & Recreation Fee Assistance",
    "keys": [
      "reddeer-fee-assistance",
      "reddeer fee assistance",
      "red deer transit & recreation fee assistance"
    ],
    "text": "What it is: Two City of Red Deer programs. The Transit Fare Assistance Pass drops a monthly pass to [amount — see the guide] no matter which type you'd normally buy (regular passes run [amount — see the guide]–[amount — see the guide]). The Recreation Fee Assistance Program adds a Recreation Pass Card for drop-in use plus up to [amount — see the guide] a year toward registered programs.\nHow to apply:\n  1. Apply online for Recreation Fee Assistance, or for the Transit Fare Assistance Pass — being approved for recreation also qualifies you for transit.\n  2. If you're on AISH, Income Support or Guaranteed Income Supplement, say so — that's automatic qualification and you can skip the income test.\n  3. Otherwise attach your CRA Notice of Assessment so they can check you against the low-income line.\n  4. Allow up to 10 business days, then buy the [amount — see the guide] pass.\n  5. Re-apply every year — approval expires.\nWhat you need:\n  - Proof you're on AISH / Income Support / GIS — or a CRA Notice of Assessment\n  - Proof of a Red Deer address\nPractical tips:\n  - One application can cover both: being approved for Recreation Fee Assistance is itself a qualifying route into the transit pass.\n  - Recreation funding is 'pending available funding' — apply early in the year rather than late.\n  - Sorensen Station staff will help you apply in person if the online form is hard going.\nHow long it takes (verified — you may state this): Up to 10 business days.\nPhone (this exact number is verified — you may give it): City of Red Deer: 403-342-8111"
  },
  "lethbridge-fee-assistance": {
    "name": "Lethbridge Fee Assistance Program",
    "keys": [
      "lethbridge-fee-assistance",
      "lethbridge fee assistance",
      "lethbridge fee assistance program"
    ],
    "text": "What it is: A single City of Lethbridge program covering three things: bus passes (you pay for one month and get the next two free), Access-A-Ride paratransit at one-third of the usual cost, and recreation or culture programs.\nHow to apply:\n  1. Apply online through the City's Fee Assistance form, or call 311 for help.\n  2. Send your AISH statement as proof of income — it's on their accepted list, so you don't need a Notice of Assessment.\n  3. Choose what you need: bus pass, Access-A-Ride, recreation, or more than one.\n  4. Buy your one paid month of bus pass and the next two come free.\nWhat you need:\n  - AISH statement — or a CRA Notice of Assessment, Alberta Works letter, housing authority letter, or a letter from a Registered Social Worker\n  - Proof of a Lethbridge address\nPractical tips:\n  - A letter from a Registered Social Worker is accepted on its own — useful if your paperwork is a mess or your income is hard to document.\n  - Recreation funding is capped per season, so a season with an expensive program in it is the one to claim.\n  - CommunityLINKS at the main library will sit with you and do the application.\nHow long it takes (verified — you may state this): Apply any time; funding runs while it lasts.\nPhone (this exact number is verified — you may give it): 311, or 403-320-3111 from outside Lethbridge"
  },
  "medicinehat-fair-entry": {
    "name": "Medicine Hat Fair Entry",
    "keys": [
      "medicinehat-fair-entry",
      "medicinehat fair entry",
      "medicine hat fair entry"
    ],
    "text": "What it is: The City of Medicine Hat's single low-income access program. It cuts [percentage — see the guide] off monthly transit passes (to an annual maximum of [amount — see the guide] of subsidy), and gives each approved person [amount — see the guide] a year toward City recreation and Esplanade arts programs at [percentage — see the guide] off.\nHow to apply:\n  1. Fill in the Fair Entry application online, or call 403-502-8001.\n  2. Attach your AISH benefits card — it's accepted as proof of income.\n  3. Add proof of a Medicine Hat address.\n  4. Wait about two weeks for a decision.\nWhat you need:\n  - AISH benefits card — or a CRA notice, Alberta Works document, or a social worker's letter\n  - Proof of a Medicine Hat address\nPractical tips:\n  - List every family member on the one application — each approved person gets their own [amount — see the guide] recreation subsidy.\n  - Approval is good for up to two years, so diarize the expiry rather than re-applying blindly.\nHow long it takes (verified — you may state this): About two weeks.\nPhone (this exact number is verified — you may give it): Fair Entry: 403-502-8001"
  },
  "grandeprairie-aish-pass": {
    "name": "Grande Prairie AISH Transit Pass & Recreation Access",
    "keys": [
      "grandeprairie-aish-pass",
      "grandeprairie aish pass",
      "grande prairie aish transit pass & recreation access"
    ],
    "text": "What it is: Grande Prairie prices a monthly transit SUPERPASS at [amount — see the guide] for AISH recipients, against [amount — see the guide] at the regular adult rate. It's separate from the city's general low-income Transit Access Program, which AISH recipients are explicitly excluded from — because this is the better deal. The Recreation Access Program is a separate application giving [percentage — see the guide] off memberships, punch passes and registered programs.\nHow to apply:\n  1. For the transit pass: go to City Hall (10205 98 Street) and ask for the AISH monthly pass — bring your AISH documentation.\n  2. For recreation: apply separately to the Recreation Access Program, online or in person.\n  3. In-person applications are approved on the spot — about 10 minutes. Online takes about 2 days.\nWhat you need:\n  - Proof you receive AISH (or ADAP)\n  - Proof of a Grande Prairie address\n  - For recreation: household income and any dependent children's details\nPractical tips:\n  - Don't let anyone put you in the Transit Access Program instead — it's a [percentage — see the guide] discount ([amount — see the guide]), and the AISH pass is [amount — see the guide]. Say 'AISH pass' explicitly.\n  - The Recreation Access Program uses a more generous income line than most (the low-income cut-off plus [percentage — see the guide]), so apply even if you've been refused elsewhere.\nHow long it takes (verified — you may state this): Same day in person; about 2 days online.\nPhone (this exact number is verified — you may give it): City of Grande Prairie: 780-538-0300 or 311"
  },
  "stalbert-subsidy": {
    "name": "St. Albert Transit & Recreation Subsidy",
    "keys": [
      "stalbert-subsidy",
      "stalbert subsidy",
      "st. albert transit & recreation subsidy"
    ],
    "text": "What it is: St. Albert's Family and Community Support Services runs one subsidy covering transit and recreation. For AISH and ADAP recipients: free local fares within St. Albert, free Handibus rides if you're an approved rider, [percentage — see the guide] off the monthly Edmonton commuter pass, and a free annual membership at Servus Place, Fountain Park and Grosvenor Pool.\nHow to apply:\n  1. Fill in the subsidy application on the City's subsidy page.\n  2. Say that you receive AISH or ADAP — that's automatic eligibility for the free annual recreation membership.\n  3. If you use the Handibus, ask about approved-rider status at the same time.\n  4. Call 780-459-1756 if you get stuck.\nWhat you need:\n  - Proof you receive AISH or ADAP\n  - Proof of a St. Albert address\nPractical tips:\n  - You can't claim this if another source already funds the same thing — so if a program is already paying your bus fare, sort that out first.\n  - The commuter pass to Edmonton is separate from free local fares — ask for both if you travel in.\nHow long it takes (verified — you may state this): Allow a couple of weeks.\nPhone (this exact number is verified — you may give it): St. Albert FCSS: 780-459-1756"
  },
  "strathcona-subsidy": {
    "name": "Strathcona County Everybody Rides & Everybody Gets to Play",
    "keys": [
      "strathcona-subsidy",
      "strathcona subsidy",
      "strathcona county everybody rides & everybody gets to play"
    ],
    "text": "What it is: Two Strathcona County programs. Everybody Rides puts a reduced monthly fare cap on your Arc card profile for local and commuter travel. Everybody Gets to Play gives a free annual Active Pass+ for County recreation facilities plus reduced fees on programs.\nHow to apply:\n  1. Call Family and Community Services at 780-464-4044, or go to 401 Festival Lane (Community Centre, 2nd floor).\n  2. Bring ID, proof you live in the County, and your Notice of Assessment.\n  3. Ask about both programs in the one visit — they're separate but handled by the same team.\nWhat you need:\n  - Photo ID\n  - Proof of a Strathcona County address\n  - CRA Notice of Assessment (or other proof of income)\nPractical tips:\n  - The County raised its income thresholds, so a refusal from years ago isn't a reason not to re-apply.\n  - Everybody Rides works by changing the fare cap on your Arc card — you keep using the same card.\nHow long it takes (verified — you may state this): Ask when you apply — it isn't published.\nPhone (this exact number is verified — you may give it): Family and Community Services: 780-464-4044"
  },
  "airdrie-fair-access": {
    "name": "Airdrie Fair Access",
    "keys": [
      "airdrie-fair-access",
      "airdrie fair access"
    ],
    "text": "What it is: The City of Airdrie's single low-income subsidy (formerly the Airdrie Participant Support Program). One application covers transit passes and Genesis Place recreation admissions, passes and registered programs. The discount is tiered: [percentage — see the guide], [percentage — see the guide] or [percentage — see the guide] depending where your household income falls against the low-income cut-off before tax.\nHow to apply:\n  1. Apply online through the Airdrie Fair Access form — it's a one-step application.\n  2. Show household income; the tier you land in (75 / 50 / [percentage — see the guide]) is worked out from it.\n  3. Call Community Links on 403-945-3900 if you want help with the form.\nWhat you need:\n  - Proof of household income\n  - Proof of an Airdrie address\nPractical tips:\n  - Income up to [percentage — see the guide] ABOVE the low-income cut-off still gets you the [percentage — see the guide] tier — don't assume you earn too much.\n  - If you use Access Airdrie (paratransit), ask whether your subsidy applies to it — the program page doesn't say either way, so check rather than assume.\nHow long it takes (verified — you may state this): Ask when you apply.\nPhone (this exact number is verified — you may give it): City of Airdrie: 403-948-8800 · Community Links: 403-945-3900"
  },
  "woodbuffalo-lift": {
    "name": "Wood Buffalo LIFT (Low-Income Fare Transit)",
    "keys": [
      "woodbuffalo-lift",
      "woodbuffalo lift",
      "low-income fare transit",
      "wood buffalo lift"
    ],
    "text": "What it is: The Regional Municipality of Wood Buffalo's Low-Income Fare Transit program: a monthly conventional transit pass for [amount — see the guide] and [percentage — see the guide] off 10- and 20-ride passes for the SMART Bus (the specialized service for seniors and people with mobility needs). Everyone in the household is covered by the one application. The Wood Buffalo Recreation Support Program is separate and gives [percentage — see the guide] off memberships at Syncrude Sport and Wellness Centre, Regional Recreation Corporation facilities and Vista Ridge.\nHow to apply:\n  1. Apply online for LIFT, or email community.services@rmwb.ca, or apply in person.\n  2. Send your AISH statement as proof of income — it's accepted.\n  3. Allow 7–10 business days for approval.\n  4. For SMART Bus, buy the discounted 10- or 25-ride passes directly from the operator once you're approved.\n  5. Ask about the Recreation Support Program separately — it's a different application.\nWhat you need:\n  - AISH statement (or other proof of household income)\n  - Proof of a Wood Buffalo address\n  - You must be 18 or older to apply\nPractical tips:\n  - The income line here is generous — about [amount — see the guide] for one person, well above AISH.\n  - One application covers your partner and dependent children too, not just you.\n  - Call Pulse on 780-743-7000 if anything about the form is unclear.\nHow long it takes (verified — you may state this): 7–10 business days.\nPhone (this exact number is verified — you may give it): Pulse: 780-743-7000"
  },
  "local-supports": {
    "name": "Local transit & recreation discounts",
    "keys": [
      "local-supports",
      "local supports",
      "local transit & recreation discounts"
    ],
    "text": "What it is: Beyond the biggest cities, many municipalities offer their own low-income or disability discounts on transit and recreation — but they're all named and delivered differently. 2-1-1 is a free, confidential, 24/7 service that connects you to the specific programs in your community.\nHow to apply:\n  1. Visit your provincial 2-1-1 site, or simply dial 2-1-1 from any phone.\n  2. Tell them your town and what you need (transit, recreation, financial help).\n  3. They'll point you to the exact local programs and how to apply.\nWhat you need:\n  - Your city or town name\n  - A rough idea of your household income\nPractical tips:\n  - Dialing 2-1-1 is free and available 24/7 in many languages.\n  - Also search your town's own website for 'recreation fee assistance' or 'low-income transit pass'.\nHow long it takes (verified — you may state this): Immediate — it's an information service.\nPhone (this exact number is verified — you may give it): Dial 2-1-1"
  }
};

export const BENEFIT_COUNT = 28;
