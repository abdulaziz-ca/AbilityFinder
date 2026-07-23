// GENERATED FILE — DO NOT EDIT BY HAND.
// Regenerate with:  npm run gen:context
// Sources of truth: public/data.js (BENEFITS) + public/app.js (PRACTITIONER_FORMS)
//
// 84 benefits. Figures are redacted on purpose — the assistant is
// told never to state an amount, and the surest way to hold a small model to
// that is to never show it one. It explains the concept and points at the guide.

/** Always injected: the catalog of what exists + the verified form names. */
export const BENEFITS_CONTEXT = "- Disability Tax Credit (DTC) [Federal · Money & taxes] — A non-refundable tax credit that may reduce income tax for an approved person or an eligible supporting family member. Approval is also required for several related federal programs.\n- Canada Disability Benefit [Federal · Money] — A monthly payment for working-age adults with a disability and lower income.\n- Child Disability Benefit [Federal · Money (for parents)] — A tax-free monthly amount added to the Canada Child Benefit for a child approved for the DTC.\n- Registered Disability Savings Plan (RDSP) [Federal · Money & savings] — A savings account where the government adds matching grants (up to 300%) and bonds — you don't even need to contribute to get the bond if your income is low.\n- Canada Workers Benefit — Disability Supplement [Federal · Money & taxes] — If you work and earn a lower income, this adds an extra disability top-up to your tax refund.\n- CPP Disability Benefit [Federal · Money] — A monthly payment if a severe, long-term disability stops you from working and you've paid into CPP.\n- Canada Student Grant for Students with Disabilities [Federal · Education] — Extra grant money for post-secondary students with a documented disability.\n- Canada Student Grant — Services & Equipment [Federal · Education] — Covers assistive technology, note-taking, tutoring, coaching and other supports for students with disabilities.\n- Assured Income for the Severely Handicapped (AISH) [Alberta · Money] — Alberta disability income assistance for people whose permanent disability prevents employment.\n- Alberta Disability Assistance Program (ADAP) [Alberta · Money] — Alberta disability income assistance when a severe disability significantly impedes employment, including episodically.\n- Alberta Aids to Daily Living (AADL) [Alberta · Health & equipment] — Helps pay for equipment and supplies you need for a long-term illness, disability or condition — wheelchairs, hearing aids, breathing supplies and much more.\n- Persons with Developmental Disabilities (PDD) [Alberta · Daily living supports] — Support services for adults with a developmental disability — help with daily living, community involvement, and employment.\n- Family Support for Children with Disabilities (FSCD) [Alberta · Family supports] — Support and funding for Alberta families raising a child under 18 with a disability — respite, aids, counselling, and reimbursement of some costs.\n- Disability Related Employment Supports (DRES) [Alberta · Employment] — Pays for supports that help you get or keep a job, or finish training — assistive devices, tutoring, coaching, workplace tools.\n- Alberta Grant for Students with Disabilities [Alberta · Education] — Alberta top-up grant for post-secondary students with a disability.\n- Alberta Adult Health Benefit [Alberta · Health] — Health coverage for adults in lower-income households — prescriptions, dental, eye care, essential diabetic supplies.\n- Alberta Child Health Benefit [Alberta · Health (for children)] — Health coverage for children in lower-income families — including prescriptions, dental and eye care.\n- Disability Parking Placard [Alberta · Getting around] — A placard that lets you use accessible parking spaces.\n- Calgary Fair Entry — Transit & Recreation [Calgary · Getting around & recreation] — One application unlocks a low-income monthly transit pass and 75% off City of Calgary pools, fitness and rec programs.\n- Edmonton Ride Transit & Leisure Access [Edmonton · Getting around & recreation] — A subsidized monthly Arc transit card plus reduced-cost access to City of Edmonton recreation facilities.\n- Red Deer Transit & Recreation Fee Assistance [Red Deer · Getting around & recreation] — A reduced monthly transit pass plus help with City recreation fees. Being on AISH qualifies you automatically.\n- Lethbridge Fee Assistance Program [Lethbridge · Getting around & recreation] — One application covers transit, Access-A-Ride paratransit, and recreation fees. AISH counts as proof of income.\n- Medicine Hat Fair Entry [Medicine Hat · Getting around & recreation] — One application, valid up to two years, for cheaper transit passes plus recreation and Esplanade arts programs.\n- Grande Prairie AISH Transit Pass & Recreation Access [Grande Prairie · Getting around & recreation] — If you're on AISH, a monthly Grande Prairie transit pass costs $10.25 instead of $74.25 — the deepest municipal transit discount in the province that we've found.\n- St. Albert Transit & Recreation Subsidy [St. Albert · Getting around & recreation] — On AISH or ADAP in St. Albert, local buses and the Handibus are free, and a year's membership at every City rec facility is free too.\n- Strathcona County Everybody Rides & Everybody Gets to Play [Sherwood Park · Getting around & recreation] — Reduced transit fares on your Arc card and a no-cost annual Active Pass+ for County recreation facilities, for residents on a limited income.\n- Airdrie Fair Access [Airdrie · Getting around & recreation] — One income-tested application covering Airdrie transit passes and Genesis Place recreation, at 25%, 50% or 75% off depending on income.\n- Wood Buffalo LIFT (Low-Income Fare Transit) [Fort McMurray · Getting around & recreation] — A $10 monthly transit pass, 75% off specialized SMART Bus passes, and a separate 60% discount on regional recreation memberships.\n- Spruce Grove Low Income Transit Pass [Spruce Grove area · Getting around] — A reduced local or commuter transit pass for qualifying Spruce Grove-area residents.\n- Leduc Transit & Recreation Subsidies [Leduc · Getting around & recreation] — Financial-navigation support that can reduce local, commuter and LATS transit costs and provide recreation access.\n- Cochrane Connect Card [Cochrane · Getting around & recreation] — A City card for residents facing financial or situational barriers, with local transit and recreation discounts.\n- Okotoks Recreation Fee Assistance [Okotoks · Recreation] — A recreation-fee subsidy for qualifying low-income Okotoks and Foothills County residents.\n- Canmore Affordable Services Program [Canmore · Getting around & recreation] — A Town program that provides qualifying residents with lower-cost local services, including transit and recreation.\n- Lloydminster Recreation Access Program [Lloydminster · Recreation] — Income-based recreation access for qualifying Lloydminster residents.\n- Fort Saskatchewan Access for Everyone [Fort Saskatchewan · Getting around & recreation] — Recreation and transit support for eligible Fort Saskatchewan residents with limited income or approved income support.\n- Local transit & recreation discounts [Your community · Getting around & recreation] — Many cities and towns run their own low-income or disability discounts on transit passes and recreation. 2-1-1 can point you to yours.\n- Persons with Disabilities (PWD) Designation [British Columbia · Money] — BC's provincial disability status for adults 18 and over with a severe impairment expected to last at least two years. It is the credential behind most other BC disability programs.\n- Fair PharmaCare [British Columbia · Health] — BC's main drug plan for anyone enrolled in MSP. It pays a share of your eligible prescriptions based on family net income — the lower your income, the sooner and the more it pays. Free to register.\n- PharmaCare Plan C (Income & Disability Assistance) [British Columbia · Health] — Automatic first-dollar drug coverage if you are on BC income, disability or hardship assistance. PharmaCare pays the full cost of eligible drugs and dispensing fees at the pharmacy counter.\n- BC Healthy Kids Program [British Columbia · Health] — Free basic dental care, glasses and hearing help for children under 19 in low-income working families that are not on income, disability or hardship assistance.\n- Medical Transportation Supplement [British Columbia · Health] — Pays your travel costs to get to essential medical treatment, using the least expensive appropriate way of getting there.\n- HandyDART (TransLink) [Metro Vancouver · Transit] — Door-to-door shared-ride transit across Metro Vancouver for people who cannot use conventional public transit for all trips without assistance. Any distance, always a 1-Zone fare.\n- HandyCard (TransLink) [Metro Vancouver · Transit] — Photo ID card for Metro Vancouver riders who cannot use conventional transit without assistance. It gets you concession fares, lets an attendant travel free, and unlocks the TaxiSaver program.\n- TaxiSaver Program (TransLink) [Metro Vancouver · Transit] — Half-price taxi coupons for HandyCard holders, for trips where a scheduled HandyDART ride does not work.\n- handyDART (BC Transit) [British Columbia · Transit] — Door-to-door shared-ride transit in BC Transit communities outside Metro Vancouver, for people whose disability prevents them from using fixed-route transit without assistance.\n- Taxi Saver Program (BC Transit) [British Columbia · Transit] — Half-price taxi coupons for permanently registered handyDART riders, for one-off trips when handyDART does not work.\n- BC Disability Assistance (PWD) [British Columbia · Money] — Monthly income support for adults with the Persons with Disabilities (PWD) designation — a support allowance plus shelter allowance, an automatic $52 transportation supplement, and full health supplements and PharmaCare Plan C coverage.\n- Autism Funding: Under Age 6 [British Columbia · Money] — Direct annual funding to buy autism intervention services (behaviour consultants, therapists, supervised behaviour interventionists) for children under 6 with an autism diagnosis.\n- Autism Funding: Ages 6-18 [British Columbia · Money] — Annual funding for autism intervention, therapies, life-skills programs, camps and out-of-school tutoring for children and youth aged 6 to 18.\n- BC Children and Youth Disability Benefit [British Columbia · Money] — New direct-funding benefit for children and youth up to age 19 with significant disabilities of any diagnosis (autism, Down syndrome, cerebral palsy, intellectual disability and more) — replacing Autism Funding and the School-Aged Extended Therapies stream.\n- Monthly Nutritional Supplement [British Columbia · Health] — Extra monthly money on top of disability assistance for PWD recipients whose severe condition causes a chronic, progressive deterioration of health and who need supplemental nutrition to avoid serious decline.\n- Optical Supplements (Glasses & Eye Exams) [British Columbia · Health] — Eye exams and prescription eyewear for everyone on income or disability assistance — show your BC Services Card at any eye clinic and the ministry pays the optometrist or optician directly.\n- BC Bus Pass Program [British Columbia · Transit] — Annual bus pass for people on BC disability assistance and low-income seniors, valid on scheduled BC Transit services provincewide and issued as a Compass Card for Metro Vancouver.\n- Accessible Parking Permit (SPARC BC) [British Columbia · Parking] — BC's accessible parking placard for people with mobility limitations — hang it from the rear-view mirror and it's valid whether you're driving or riding as a passenger.\n- Medical Equipment & Devices Supplement [British Columbia · Equipment] — The ministry buys, repairs and replaces essential medical equipment — canes to power wheelchairs, hospital beds, transfer aids, pressure-relief mattresses, specialized glucose meters — for people on assistance with no other way to pay.\n- At Home Program: Medical Benefits [British Columbia · Health] — Covers medical equipment, therapies, dental and optical care, medical travel and PharmaCare Plan F for children with severe disabilities who live at home and are dependent in most daily living activities.\n- Supported Child Development [British Columbia · Family] — Community-based programs that help children with extra support needs take part in regular, fully inclusive child care — support for the family and for the child care centre, not just the child.\n- At Home Program: School-Aged Extended Therapies (SAET) [British Columbia · Health] — Pays for private occupational therapy, physiotherapy and speech-language pathology outside school hours for school-aged children enrolled in the At Home Program.\n- Community Living BC (CLBC) Adult Supports [British Columbia · Family] — Provincial agency funding lifelong supports for adults 19+ with developmental disabilities — home sharing and staffed living, employment services, community inclusion, respite and family support. Youth can apply from age 16 to have services ready at 19.\n- Canada Student Grant for Students with Disabilities (StudentAid BC) [British Columbia · Education] — A non-repayable grant of $2,800 per program year (August 1 to July 31) for post-secondary students with a permanent, or persistent or prolonged, disability. Administered in B.C. through your StudentAid BC application.\n- Canada Student Grant for Services and Equipment – Students with Disabilities [British Columbia · Education] — Up to $20,000 per year for disability-related education services and equipment — notetakers, tutors, interpreters and technical aids — for post-secondary students with disabilities, delivered through StudentAid BC.\n- B.C. Access Grant for Students with Disabilities [British Columbia · Education] — Non-repayable grant money that replaces B.C. student loans for full-time students with a disability, so you borrow less.\n- B.C. Supplemental Bursary for Students with Disabilities [British Columbia · Education] — A non-repayable bursary to help with the cost of post-secondary education for students with a permanent, or persistent or prolonged, disability. Full-time and part-time students both qualify.\n- B.C. Assistance Program for Students with Disabilities [British Columbia · Education] — Funding for exceptional education-related services and adaptive equipment — the top-up you turn to once the federal services and equipment grant runs out.\n- Learning Disability Assessment Bursary [British Columbia · Education] — Covers the up-front cost of a learning disability assessment — the assessment that unlocks disability funding and academic accommodations in the first place.\n- B.C. Access Grant for Deaf Students [British Columbia · Education] — Helps deaf and hard of hearing students with the extra cost of attending a specialized school that teaches in American Sign Language. It applies only to Gallaudet University in Washington, D.C. and the National Technical Institute for the Deaf in Rochester, New York — both in the United States.\n- Dental Supplements (Income & Disability Assistance) [British Columbia · Health] — Basic dental care — check-ups, fillings, extractions, dentures — for people on disability assistance, paid by the ministry directly to the dentist; emergency treatment to relieve pain is covered for everyone on assistance.\n- Home Renovation Tax Credit for Seniors and Persons with Disabilities [British Columbia · Tax] — A refundable B.C. tax credit worth 10% of up to $10,000 in accessibility renovations to your principal residence — up to $1,000 back per year — for people who qualify for the disability tax credit, seniors 65+, and family members who live with them.\n- Work-Able Accessible Employment Program (BC Public Service) [British Columbia · Work] — A paid internship program in the BC Public Service for recent post-secondary graduates who self-identify as having a disability — any physical, sensory, neurological, visible or invisible disability.\n- WorkBC Assistive Technology Services [British Columbia · Equipment] — Funding for assistive technology you need to get or keep a job: devices and equipment, ergonomic furniture, communication and hearing devices, ASL interpreting and captioning, workplace modifications — even vehicle modifications for getting to work.\n- WorkBC Employment Services [British Columbia · Work] — BC's free public employment service. Help finding work, paid training, and practical supports that remove the barriers around a job, with services built specifically for people with disabilities.\n- Fuel Tax Refund for Persons with Disabilities [British Columbia · Transit] — Refunds provincial fuel tax on a vehicle you own, lease or have an ownership interest in — and registering also unlocks a 25% discount on your basic ICBC insurance.\n- ICBC Disability Discount (Basic Autoplan) [British Columbia · Transit] — A quarter off the basic part of your vehicle insurance. It comes with registering for the provincial fuel tax refund program, so the two go together.\n- Property Tax Deferment for Persons with Disabilities [British Columbia · Tax] — Instead of paying your property taxes each year, the province pays them and registers a loan against your home. You repay when you sell or transfer it.\n- B.C. Sales Tax Credit [British Columbia · Tax] — A small refundable credit you claim on your tax return. It is not a disability program, but it is easy money for people on a low income who file.\n- Leisure Access Program (LAP) [Vancouver · Recreation] — Vancouver's low-income recreation pass. Swimming and skating admission are free, and most other Park Board recreation is half price.\n- Leisure Access Program (LAP) [Surrey · Recreation] — Surrey's recreation subsidy. Children, youth and seniors get a free year-long pass to every City recreation facility; adults get three quarters off.\n- FAIR Play Program [Burnaby · Recreation] — Burnaby gives every eligible family member a recreation credit AND a free annual Be Active Pass — the pass is on top of the credit, not paid for out of it.\n- Recreation Fee Subsidy Program (RFSP) [Richmond · Recreation] — Richmond's recreation subsidy for residents in financial hardship — free drop-ins with no cap, and nine tenths off most registered programs.\n- L.I.F.E. Program (Leisure Involvement For Everyone) [Victoria · Recreation] — Victoria's low-income recreation membership. It runs two years from your approval date, not by calendar year, and covers pool, skating and regional partner facilities.\n- L.I.F.E. Program (Leisure Involvement For Everyone) [Saanich · Recreation] — Saanich's version of the regional L.I.F.E. program. Approval lasts two years and you pick one of two benefit options.\n- Financial Assistance for Recreation (KFAP) [Kelowna · Recreation] — Kelowna's recreation subsidy for residents on a low income — a credit you spend on a facility pass or on programs.\n- Financial Assistance for Recreation (FAR) [Coquitlam · Recreation] — Coquitlam gives each eligible family member their own 50 drop-in passes and their own $225 credit toward City admissions, passes and programs.\n- ARCH (Affordable Recreation for Community Health) [Kamloops · Recreation] — Kamloops' recreation subsidy — and the same application also gets you KamPASS, the City's affordable transit program, so one form covers both.\n\nFORMS A PRACTITIONER MUST SIGN (the only form names you may state):\n- Disability Tax Credit (DTC): a practitioner signs the Disability Tax Credit certificate (Form T2201).\n- CPP Disability Benefit: a practitioner signs the CPP disability medical report (ISP-2519).\n- Assured Income for the Severely Handicapped (AISH): a practitioner signs the Disability Assistance Medical Report (for the combined AISH/ADAP application).\n- Alberta Disability Assistance Program (ADAP): a practitioner signs the Disability Assistance Medical Report (for the combined AISH/ADAP application).\n- Disability Parking Placard: a practitioner signs the accessible parking placard form.";

/** Injected only when the question matches — see retrieveDetails() in index.js. */
export const BENEFIT_DETAILS = {
  "dtc": {
    "name": "Disability Tax Credit (DTC)",
    "keys": [
      "dtc",
      "disability tax credit",
      "t2201"
    ],
    "text": "What it is: A non-refundable federal tax credit for people whose impairment and functional effects meet the CRA's severe and prolonged rules. It may reduce income tax payable and is also a requirement for several related federal programs, but it is not required for every disability benefit.\nHow to apply:\n  1. Sign in to (or create) CRA My Account — or use the paper form.\n  2. Fill Part A (your personal information).\n  3. Ask a medical practitioner who knows you to complete Part B, describing how your condition limits your daily life.\n  4. Submit through CRA My Account for the fastest processing.\n  5. If the CRA approves years you already filed, request the applicable tax-return adjustments. Past claims may go back up to 10 years, but any refund depends on the tax situation for each year.\nWhat you need:\n  - Your Social Insurance Number (SIN)\n  - A medical practitioner familiar with your condition\n  - Real examples of how it limits you (focus, memory, walking, self-care, etc.)\nPractical tips:\n  - The medical practitioner's section decides most approvals — ask them to be specific and give concrete examples of your limitations.\n  - You do NOT need to pay a private company a percentage of your refund. Applying directly is free.\n  - Denied? Read the decision letter, ask what information was missing, and use the CRA review or objection process that applies to your case.\nHow long it takes (verified — you may state this): Processing time varies; check the CRA processing-times tool for a current estimate.\nPhone (this exact number is verified — you may give it): CRA: 1-800-959-8281"
  },
  "cdb-adult": {
    "name": "Canada Disability Benefit",
    "keys": [
      "cdb-adult",
      "cdb adult",
      "canada disability benefit"
    ],
    "text": "What it is: A new federal income top-up (started July 2025) for low-income adults aged 18–64 who are approved for the Disability Tax Credit.\nHow to apply:\n  1. Make sure your DTC is approved and your taxes are filed.\n  2. Apply online, by phone, by mail, or in person once applications are open to you.\n  3. Provide direct-deposit details so payments arrive automatically.\nWhat you need:\n  - DTC approval on file with the CRA\n  - Your most recent tax return filed\n  - Banking info for direct deposit\nPractical tips:\n  - File your taxes every year even with no income — payments are calculated from your return.\n  - For July 2026 to June 2027, up to [amount — see the guide] of working income is exempt for a single person, or up to [amount — see the guide] of combined working income for a couple.\n  - Starting in September 2026, eligible recipients may receive a separate fixed [amount — see the guide] lump sum toward the cost of obtaining the DTC. You do not apply for it separately, and it is not included in the monthly maximum shown here.\n  - If you receive AISH or ADAP, report the CDB and/or DTC application outcome to Alberta, including the approved CDB amount or a denial. Alberta says that when no CDB decision had been made by February 28, 2026, [amount — see the guide] was reduced from April 2026 AISH or ADAP benefits.\nHow long it takes (verified — you may state this): Paid monthly once approved.\nPhone (this exact number is verified — you may give it): Service Canada: 1-800-O-Canada"
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
    "text": "What it is: AISH is Alberta disability income assistance for adults whose severe, permanent disability prevents employment. It includes a monthly living allowance and may include health and personal benefits.\nHow to apply:\n  1. Use Alberta's combined AISH/ADAP application — it assesses which program fits; you do not make two separate applications.\n  2. Complete your part and arrange the required medical report with a medical professional registered in Alberta.\n  3. Submit online, or use the application options Alberta Supports provides if online is not workable for you.\nWhat you need:\n  - Medical report showing how a severe, permanent impairment prevents employment\n  - Proof of Alberta residency + Canadian citizenship / PR\n  - Financial details (income and assets)\nPractical tips:\n  - The medical form should focus on how your condition limits your ability to EARN A LIVING, not just the diagnosis.\n  - The combined application assesses AISH and ADAP. Alberta, not this tool, decides the program and benefit amount.\n  - Use Alberta's AISH/ADAP benefit estimator for a household-specific estimate before relying on any amount.\n  - If you receive AISH or ADAP, report the outcome of your CDB and/or DTC application to Alberta, including the approved CDB amount or a denial. Alberta says that when no CDB decision had been made by February 28, 2026, [amount — see the guide] was reduced from April 2026 benefits.\nHow long it takes (verified — you may state this): Ask Alberta Supports for the current processing time.\nPhone (this exact number is verified — you may give it): Alberta Supports: 1-877-759-6810"
  },
  "adap": {
    "name": "Alberta Disability Assistance Program (ADAP)",
    "keys": [
      "adap",
      "alberta disability assistance program"
    ],
    "text": "What it is: ADAP is Alberta disability income assistance for adults whose severe disability significantly impedes employment continuously or episodically. It can include a core monthly financial benefit, health benefits, personal benefits and employment supports.\nHow to apply:\n  1. Use Alberta's combined AISH/ADAP application — it assesses which program fits; you do not make two separate applications.\n  2. Complete your part and arrange the required medical report with a medical professional registered in Alberta.\n  3. Provide the residency, status and financial information requested by Alberta Supports.\nWhat you need:\n  - Medical report describing how the disability significantly impedes employment\n  - Proof of Alberta residency + Canadian citizenship / PR\n  - Financial details (income and assets)\nPractical tips:\n  - Describe functional limits and fluctuating or episodic barriers — not only your diagnosis name.\n  - One application is enough: Alberta decides whether AISH or ADAP is the appropriate program.\n  - Use Alberta's AISH/ADAP benefit estimator for a household-specific estimate before relying on any amount.\n  - If you receive ADAP or AISH, report the outcome of your CDB and/or DTC application to Alberta, including the approved CDB amount or a denial. Alberta says that when no CDB decision had been made by February 28, 2026, [amount — see the guide] was reduced from April 2026 benefits.\nHow long it takes (verified — you may state this): Ask Alberta Supports for the current processing time.\nPhone (this exact number is verified — you may give it): Alberta Supports: 1-877-759-6810"
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
    "text": "What it is: A permit that lets you park in designated accessible spaces. Blue placards are for long-term disabilities (valid 5 years); red placards are for temporary ones (3–12 months).\nHow to apply:\n  1. Get the application form and have a medical practitioner complete their section.\n  2. Take it to any registry agent (e.g. an AMA centre).\nWhat you need:\n  - Application form with the medical section completed\n  - Government-issued ID\nPractical tips:\n  - You don't need to own a vehicle — the placard belongs to you, not a car.\n  - The medical section can be completed by a physician, occupational therapist, physiotherapist, surgeon, podiatrist, nurse practitioner or chiropractor.\nHow long it takes (verified — you may state this): Issued at the registry, often same-day.\nPhone (this exact number is verified — you may give it): Any Alberta registry agent"
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
  "sprucegrove-low-income-transit": {
    "name": "Spruce Grove Low Income Transit Pass",
    "keys": [
      "sprucegrove-low-income-transit",
      "sprucegrove low income transit",
      "spruce grove low income transit pass"
    ],
    "text": "What it is: A City of Spruce Grove subsidized transit pass. Qualifying adults can buy a local pass for [amount — see the guide] a month or a commuter pass for [amount — see the guide] a month.\nHow to apply:\n  1. Read the City’s current eligibility rules and application instructions.\n  2. Apply with proof of address and household income.\n  3. Choose the local or commuter pass that matches your trips.\nWhat you need:\n  - Proof of address\n  - Proof of household income\nPractical tips:\n  - The City says applications are accepted year-round.\n  - Stony Plain and Parkland County residents should confirm the local address rules on the City page before applying.\nHow long it takes (verified — you may state this): Applications are accepted year-round."
  },
  "leduc-subsidies": {
    "name": "Leduc Transit & Recreation Subsidies",
    "keys": [
      "leduc-subsidies",
      "leduc subsidies",
      "leduc transit & recreation subsidies"
    ],
    "text": "What it is: Leduc Family and Community Support Services can help qualifying residents access reduced transit and recreation costs as part of its housing and financial-navigation support.\nHow to apply:\n  1. Contact Leduc FCSS for a financial-navigation appointment.\n  2. Ask about the transit and recreation subsidies when discussing your situation.\n  3. Follow their directions for the documents needed to assess eligibility.\nWhat you need:\n  - Proof of Leduc residence\n  - Financial information requested by FCSS\nPractical tips:\n  - Ask specifically about LATS if you use specialized transit.\n  - The City’s page describes an assessment, so do not assume eligibility until FCSS confirms it.\nHow long it takes (verified — you may state this): Ask FCSS when you contact them."
  },
  "cochrane-connect-card": {
    "name": "Cochrane Connect Card",
    "keys": [
      "cochrane-connect-card",
      "cochrane connect card"
    ],
    "text": "What it is: The Cochrane Connect Card gives qualifying residents [percentage — see the guide] off COLT monthly and 10-ticket transit passes, and [percentage — see the guide] off SLS Centre 30-day and monthly passes.\nHow to apply:\n  1. Book the appointment described on the City’s Connect Card page.\n  2. Bring proof of income and your Cochrane address.\n  3. Ask which current transit and SLS Centre discounts the card gives you.\nWhat you need:\n  - Proof of income\n  - Proof of Cochrane address\nPractical tips:\n  - This is not only an income test; the City also describes situational need.\n  - Confirm the current eligible passes at your appointment before purchasing.\nHow long it takes (verified — you may state this): Ask when booking the appointment."
  },
  "okotoks-fee-assistance": {
    "name": "Okotoks Recreation Fee Assistance",
    "keys": [
      "okotoks-fee-assistance",
      "okotoks fee assistance",
      "okotoks recreation fee assistance"
    ],
    "text": "What it is: The Town’s Recreation Fee Assistance Program helps qualifying residents afford most Town recreation programs, passes and admission at an [percentage — see the guide] discount.\nHow to apply:\n  1. Read the Town’s current program information and eligibility rules.\n  2. Apply with the income and residence documents requested.\n  3. Check the program period and any limits before registering for an activity.\nWhat you need:\n  - Proof of income\n  - Proof of Okotoks residence\nPractical tips:\n  - The Town also serves eligible Foothills County residents; confirm the current boundary rule if that is you.\n  - Ask about exclusions before choosing a camp or program.\nHow long it takes (verified — you may state this): Ask when you apply."
  },
  "canmore-affordable-services": {
    "name": "Canmore Affordable Services Program",
    "keys": [
      "canmore-affordable-services",
      "canmore affordable services",
      "canmore affordable services program"
    ],
    "text": "What it is: Canmore’s Affordable Services Program provides qualifying residents with discounts on Town and community services, including local transit and recreation.\nHow to apply:\n  1. Review the Town’s current eligibility and application instructions.\n  2. Apply with the income and residency documents requested.\n  3. Ask which discounts apply to the services you use.\nWhat you need:\n  - Proof of income\n  - Proof of Canmore residence\nPractical tips:\n  - Transit discounts are tiered; the Town page is the source of truth for the current rate.\n  - Apply before assuming a discount is available for a specific community service.\nHow long it takes (verified — you may state this): Ask when you apply."
  },
  "lloydminster-recreation-access": {
    "name": "Lloydminster Recreation Access Program",
    "keys": [
      "lloydminster-recreation-access",
      "lloydminster recreation access",
      "lloydminster recreation access program"
    ],
    "text": "What it is: Lloydminster’s Recreation Access Program gives qualifying low-income residents reduced-cost access to City recreation facilities.\nHow to apply:\n  1. Review the City’s current income criteria and application instructions.\n  2. Apply with the documents the City requests.\n  3. Ask the recreation desk which current facility admissions and passes are covered.\nWhat you need:\n  - Proof of household income\n  - Proof of Lloydminster residence\nPractical tips:\n  - Use the official City page to confirm current rates before making plans around a discount.\n  - Ask whether your household members can be included in the application.\nHow long it takes (verified — you may state this): Ask when you apply."
  },
  "fortsask-access": {
    "name": "Fort Saskatchewan Access for Everyone",
    "keys": [
      "fortsask-access",
      "fortsask access",
      "fort saskatchewan access for everyone"
    ],
    "text": "What it is: Fort Saskatchewan’s Access for Everyone Program combines recreation support with the Everyone Rides transit subsidy for eligible residents.\nHow to apply:\n  1. Review the City’s current eligibility routes and application instructions.\n  2. Apply with proof of limited income or the approved income-support document that applies to you.\n  3. Ask about both the recreation membership and Everyone Rides transit subsidy.\nWhat you need:\n  - Proof of Fort Saskatchewan residence\n  - Proof of income or approved income support\nPractical tips:\n  - The City lists AISH, CPP Disability, FSCD and Income Support among the approved-program routes; check the current page for full details.\n  - Ask whether your local or commuter transit trips qualify before buying a pass.\nHow long it takes (verified — you may state this): Ask when you apply."
  },
  "local-supports": {
    "name": "Local transit & recreation discounts",
    "keys": [
      "local-supports",
      "local supports",
      "local transit & recreation discounts"
    ],
    "text": "What it is: Beyond the biggest cities, many municipalities offer their own low-income or disability discounts on transit and recreation — but they're all named and delivered differently. 2-1-1 is a free, confidential, 24/7 service that connects you to the specific programs in your community.\nHow to apply:\n  1. Visit your provincial 2-1-1 site, or simply dial 2-1-1 from any phone.\n  2. Tell them your town and what you need (transit, recreation, financial help).\n  3. They'll point you to the exact local programs and how to apply.\nWhat you need:\n  - Your city or town name\n  - A rough idea of your household income\nPractical tips:\n  - Dialing 2-1-1 is free and available 24/7 in many languages.\n  - Also search your town's own website for 'recreation fee assistance' or 'low-income transit pass'.\nHow long it takes (verified — you may state this): Immediate — it's an information service.\nPhone (this exact number is verified — you may give it): Dial 2-1-1"
  },
  "bc-pwd-designation": {
    "name": "Persons with Disabilities (PWD) Designation",
    "keys": [
      "bc-pwd-designation",
      "bc pwd designation",
      "pwd",
      "persons with disabilities designation"
    ],
    "text": "What it is: The standard application is form HR2883. Five prescribed classes can use the shorter HR3642 application instead: people on BC PharmaCare Plan P (palliative care), At Home Program participants, Community Living BC eligible clients, people receiving CPP Disability or the Post-Retirement Disability Benefit, and people with an Indigenous Services Canada PWD designation in the BC region.\nHow to apply:\n  1. Start an assistance application through My Self Serve so the ministry can first check financial eligibility\n  2. Ask the ministry for the PWD designation application (HR2883) after you start the assistance application\n  3. Complete the applicant section, then have a doctor or nurse practitioner complete the medical report\n  4. Have a prescribed professional who knows your daily limitations complete the assessor report\n  5. Submit all sections and keep a copy; respond if the ministry asks for more information\nWhat you need:\n  - Identification, income, asset and shelter information for the assistance application\n  - PWD designation application HR2883\n  - Medical and functional information describing how the impairment restricts daily living and what help or supervision is required\nPractical tips:\n  - You can start the PWD application at age 17 and a half, although disability assistance cannot begin before 18\n  - If you are in a prescribed class, ask whether the shorter HR3642 form applies before arranging two professional reports\n  - Ask each professional to describe functional restrictions and support needs, not only the diagnosis\nHow long it takes (verified — you may state this): The ministry does not publish one guaranteed decision time\nPhone (this exact number is verified — you may give it): 1-866-866-0800"
  },
  "bc-fair-pharmacare": {
    "name": "Fair PharmaCare",
    "keys": [
      "bc-fair-pharmacare",
      "bc fair pharmacare",
      "fair pharmacare"
    ],
    "text": "What it is: Assistance is tied to family net income from two years prior and coverage applies automatically at the pharmacy counter. After a family meets its deductible PharmaCare pays [percentage — see the guide] of eligible costs, or [percentage — see the guide] if a family member was born before 1940. After a family reaches its family maximum, Fair PharmaCare pays [percentage — see the guide] of eligible costs for the rest of the year.\nHow to apply:\n  1. Gather the Personal Health Number for every family member, Social Insurance Numbers for adults, and the adults' tax information from two years ago\n  2. Register online, or call Health Insurance BC if online registration is not accessible to you\n  3. Use the temporary coverage that begins the same day while income verification is pending\n  4. Sign and return the CRA consent form within 30 days so temporary coverage does not end\n  5. Check your registration status online or call if a pharmacy cannot see the coverage\nWhat you need:\n  - Personal Health Number for every family member\n  - Social Insurance Number for each adult\n  - Line 23600 from each adult's Notice of Assessment from two years ago\n  - Line 12500 Registered Disability Savings Plan income, if applicable\nPractical tips:\n  - Registration is free and temporary coverage begins the same day\n  - The CRA consent deadline matters: return it within 30 days\n  - If family income has dropped substantially, ask PharmaCare whether an income review is available\nHow long it takes (verified — you may state this): Temporary coverage begins the day you register; income verification follows\nPhone (this exact number is verified — you may give it): 1-800-663-7100"
  },
  "bc-pharmacare-plan-c": {
    "name": "PharmaCare Plan C (Income & Disability Assistance)",
    "keys": [
      "bc-pharmacare-plan-c",
      "bc pharmacare plan c",
      "income & disability assistance",
      "pharmacare plan c"
    ],
    "text": "What it is: Enrolment in those programs automatically enrols you in Plan C — there is no separate application. It also covers prostheses and orthoses including offloading devices for diabetic foot ulcers, ostomy supplies, and insulin and insulin pumps (insulin pumps need an approved Special Authority request from a doctor).\nHow to apply:\n  1. Confirm that your qualifying income, disability, hardship, care or protected status is active with the responsible ministry\n  2. Give the pharmacy your BC Services Card or Personal Health Number so it can check Plan C\n  3. If the status is active but the pharmacy cannot see Plan C, ask the ministry or Health Insurance BC to correct the enrolment\n  4. For an urgent prescription, ask the prescriber or pharmacist whether the emergency 48-hour Plan C process applies\nWhat you need:\n  - BC Services Card or Personal Health Number\n  - Any recent ministry notice showing the qualifying assistance or care status\nPractical tips:\n  - There is no separate Plan C application\n  - Register for Fair PharmaCare as well so coverage can continue if your assistance status changes\n  - Ask the pharmacy about any amount before paying; covered drugs and dispensing fees should not be charged under Plan C\nHow long it takes (verified — you may state this): Automatic when the qualifying ministry status is active\nPhone (this exact number is verified — you may give it): 1-800-663-7100"
  },
  "bc-healthy-kids": {
    "name": "BC Healthy Kids Program",
    "keys": [
      "bc-healthy-kids",
      "bc healthy kids",
      "bc healthy kids program"
    ],
    "text": "What it is: Dental is up to [amount — see the guide] of basic services every two years. Optical is prescription glasses once a year, including lenses and basic frames. Hearing instruments include hearing aids, bone-anchored hearing aids, cochlear implants, repairs and related items — the least expensive appropriate option, based on an assessment by an audiologist or hearing instrument practitioner, when the family has no other resources to pay. Adjusted net income is your net income after deductions for age, family size, disability, and income from the Universal Child Care Benefit and a Registered Disability Savings Plan.\nHow to apply:\n  1. Apply for MSP supplementary benefits through the provincial health and drug coverage application\n  2. File income taxes every year and keep the family's MSP information current\n  3. Before treatment, ask the dental, optical or hearing provider to confirm the child's Healthy Kids coverage and any amount you would have to pay\n  4. Show the child's BC Services Card or CareCard at the appointment\n  5. For hearing instruments, have the provider obtain any required pre-authorization before ordering\nWhat you need:\n  - Child's BC Services Card or CareCard\n  - Family income information used for MSP supplementary benefits\n  - Provider assessment and recommendation for hearing instruments, when applicable\nPractical tips:\n  - Not every provider charges only the program fee; ask about extra charges before agreeing to treatment\n  - Tell Health Insurance BC when the family size, address or marital status changes\n  - Families on income, disability or hardship assistance receive comparable dental and optical supplements through the ministry instead\nHow long it takes (verified — you may state this): Ask Health Insurance BC when you apply\nPhone (this exact number is verified — you may give it): 1-866-866-0800"
  },
  "bc-medical-transportation": {
    "name": "Medical Transportation Supplement",
    "keys": [
      "bc-medical-transportation",
      "bc medical transportation",
      "medical transportation supplement"
    ],
    "text": "What it is: Covers travel to essential medical treatment — services under the Medicare Protection Act or Hospital Insurance Act with a medical practitioner, nurse practitioner, specialist or hospital. Meal allowances are normally not provided; in exceptional circumstances the ministry may issue up to [amount — see the guide] per meal. Escort costs are covered where an escort is required, including for children and adults who are medically incapable of travelling alone.\nHow to apply:\n  1. Ask for pre-approval before booking travel through My Self Serve, by phone, mail, fax or at a ministry office\n  2. Complete the medical transportation request form HR3320\n  3. Attach proof of the treatment and appointment, such as a provider note, appointment card, email, screenshot or Travel Assistance Program form\n  4. Explain the least expensive appropriate travel method and whether an escort or overnight stay is medically required\n  5. Keep approval and travel receipts in case the ministry requests them\nWhat you need:\n  - Form HR3320\n  - Proof of the medical appointment and why the treatment is essential\n  - Travel dates, destination, distance and expected fare or accommodation cost\n  - Medical confirmation that an escort or special travel method is required, if applicable\nPractical tips:\n  - Request approval before you travel; after-the-fact payment is limited to exceptional circumstances\n  - For repeated treatment, ask whether approval can cover ongoing trips for up to 12 months\n  - The ministry chooses the least expensive appropriate transportation, so explain accessibility or medical barriers clearly\nHow long it takes (verified — you may state this): Apply before arranging the trip\nPhone (this exact number is verified — you may give it): 1-866-866-0800"
  },
  "handydart-translink": {
    "name": "HandyDART (TransLink)",
    "keys": [
      "handydart-translink",
      "handydart translink",
      "translink",
      "handydart"
    ],
    "text": "What it is: The earliest pickup is 6 a.m. and the last drop-off is 2 a.m. You can book your trip as far as seven days in advance and up until 4 p.m. the day before your trip. One combined HandyDART and HandyCard application form covers both services.\nHow to apply:\n  1. Download and complete the combined HandyDART and HandyCard application\n  2. Describe the parts of conventional transit you cannot navigate without help, including temporary or changing barriers\n  3. Include the optional medical verification if it will help explain the functional barrier\n  4. Submit the application using the instructions on the form and wait for Access Transit to contact you\n  5. After approval, call to book trips one to seven days ahead; bookings for the next day must be requested before 4 p.m.\nWhat you need:\n  - Completed HandyDART and HandyCard application\n  - Recent photo for the HandyCard portion\n  - Optional functional or medical verification\nPractical tips:\n  - Explain what happens from your door to the stop, on the vehicle and during transfers — eligibility is about the functional trip, not a diagnosis\n  - A HandyDART taxi replacement costs the regular HandyDART fare; it is not a TaxiSaver trip\n  - Tell the booking agent about mobility aids, an attendant, a service dog or vehicle limitations\nHow long it takes (verified — you may state this): Ask Access Transit when you submit the application\nPhone (this exact number is verified — you may give it): 604-953-3680"
  },
  "handycard-translink": {
    "name": "HandyCard (TransLink)",
    "keys": [
      "handycard-translink",
      "handycard translink",
      "translink",
      "handycard"
    ],
    "text": "What it is: HandyCard is for conventional TransLink services, not HandyDART. Carry the original photo card and show it when paying a concession fare or travelling with an attendant.\nHow to apply:\n  1. Complete the combined HandyDART and HandyCard application\n  2. Describe why you cannot use conventional transit without an attendant\n  3. Include the required photo and submit the form using its instructions\n  4. When the card arrives, carry it on every eligible trip and show it when requested\nWhat you need:\n  - Completed combined application\n  - A recent photo meeting the form requirements\n  - Optional supporting verification describing the transit barrier\nPractical tips:\n  - HandyCard applicants must be at least 12 and live in the TransLink service region\n  - An attendant rides free with you on conventional transit, but you still pay your own concession fare\n  - The same application can request HandyDART and HandyCard together\nHow long it takes (verified — you may state this): Ask Access Transit when you apply\nPhone (this exact number is verified — you may give it): 604-953-3680"
  },
  "taxisaver-translink": {
    "name": "TaxiSaver Program (TransLink)",
    "keys": [
      "taxisaver-translink",
      "taxisaver translink",
      "translink",
      "taxisaver program"
    ],
    "text": "What it is: TaxiSavers are coupon books for ordinary participating taxi trips. They are separate from taxis dispatched by HandyDART as part of a booked HandyDART trip.\nHow to apply:\n  1. Get and keep an active TransLink HandyCard\n  2. Choose mail order or in-person purchase at the TransLink Customer Service Centre at Waterfront Station\n  3. For mail order, send a cheque or money order with the required self-addressed envelope\n  4. For an in-person purchase, bring the original HandyCard; a representative may purchase for you if they bring it\n  5. Show the HandyCard to the taxi driver and use coupons toward the participating taxi fare\nWhat you need:\n  - Original TransLink HandyCard\n  - Cheque or money order for mail orders, or accepted payment for an in-person purchase\nPractical tips:\n  - One [amount — see the guide] book contains [amount — see the guide] in coupons and the limit is two books per month\n  - You can use post-dated cheques to pre-order future months\n  - Call before travelling to Waterfront Station if you need accessibility or current counter-hour information\nHow long it takes (verified — you may state this): In person is immediate when stock and eligibility are confirmed; mail delivery varies\nPhone (this exact number is verified — you may give it): 604-953-3680"
  },
  "handydart-bctransit": {
    "name": "handyDART (BC Transit)",
    "keys": [
      "handydart-bctransit",
      "handydart bctransit",
      "bc transit",
      "handydart"
    ],
    "text": "What it is: handyDART is shared, door-to-door service. Drivers drop you off at the closest accessible point near your destination. Registration is free. You can pay your fare with cash when you board, or buy fare products in advance.\nHow to apply:\n  1. Find your community on the BC Transit website and open its handyDART registration page\n  2. Complete, sign and date the regional handyDART application\n  3. Describe which parts of fixed-route transit you cannot use without assistance\n  4. Include the optional medical verification if it helps explain the functional barrier\n  5. Submit the form to the regional registrar, then follow the local instructions for booking after approval\nWhat you need:\n  - Completed regional handyDART application\n  - Optional Medical Verification of Eligibility form\n  - Mobility-aid measurements or travel-support details if requested by the region\nPractical tips:\n  - Registration is free and eligibility is based on functional ability, not diagnosis, age or mobility device\n  - Contacts, fares and booking hours differ by community — use your own regional page\n  - Ask whether your region offers a handyPASS for a free attendant and Taxi Saver access\nHow long it takes (verified — you may state this): Varies by regional transit system\nPhone (this exact number is verified — you may give it): Use the handyDART number on your community's BC Transit page"
  },
  "taxi-saver-bctransit": {
    "name": "Taxi Saver Program (BC Transit)",
    "keys": [
      "taxi-saver-bctransit",
      "taxi saver bctransit",
      "bc transit",
      "taxi saver program"
    ],
    "text": "What it is: Taxi Saver is delivered by participating regional BC Transit systems. This guide uses Victoria's current rules; other regions can set different prices, purchase methods and taxi companies.\nHow to apply:\n  1. Confirm that you are permanently registered for handyDART, age 12 or older and have a handyPASS\n  2. Open your region's Taxi Saver page and confirm the current package price and purchase method\n  3. Buy vouchers from the regional Taxi Saver office or approved outlet\n  4. Book a participating taxi directly and show your handyPASS\n  5. Use vouchers for part of the metered fare and pay any remainder using a method the taxi accepts\nWhat you need:\n  - Current handyPASS\n  - Payment accepted by the regional Taxi Saver office\nPractical tips:\n  - Vouchers cover [percentage — see the guide] of eligible taxi fares but cannot be transferred or used as a tip\n  - Drivers do not give change for vouchers, so combine denominations carefully\n  - Check the participating taxi list before booking because companies can change\nHow long it takes (verified — you may state this): Ask the regional Taxi Saver office\nPhone (this exact number is verified — you may give it): Victoria region: 250-995-5618"
  },
  "bc-disability-assistance-pwd": {
    "name": "BC Disability Assistance (PWD)",
    "keys": [
      "bc-disability-assistance-pwd",
      "bc disability assistance pwd",
      "pwd",
      "bc disability assistance"
    ],
    "text": "What it is: Disability assistance is BC's core income program for people with the PWD designation. A single person receives a [amount — see the guide] monthly support allowance plus actual shelter costs up to [amount — see the guide] and every PWD recipient gets a [amount — see the guide] transportation supplement as cash or an in-kind bus pass. It also opens the door to dental, optical, medical equipment, medical transportation and nutrition supplements, and [percentage — see the guide] drug coverage under PharmaCare Plan C.\nHow to apply:\n  1. Create an account at myselfserve.gov.bc.ca (or call 1-866-866-0800) and complete the online application so the ministry can check financial eligibility\n  2. Request the PWD designation application and complete the applicant section (form HR2883)\n  3. Have your doctor or nurse practitioner complete the medical report section\n  4. Have a doctor, nurse practitioner or prescribed professional (e.g., occupational therapist, social worker) complete the assessor report\n  5. Submit everything and respond to any ministry follow-up; once the designation is approved and you are financially eligible, payments begin\n  6. Report income and changes monthly as required to keep payments accurate\nWhat you need:\n  - ID and Social Insurance Number for all adults in the family unit\n  - Bank statements and details of assets and income\n  - Rent receipt, lease or proof of shelter costs\n  - Completed PWD application (applicant, medical and assessor sections)\nPractical tips:\n  - Already on CPP Disability, Community Living BC, the At Home Program, PharmaCare Plan P (palliative) or ISC PWD? A simplified prescribed-class application (HR3642) skips most of the medical paperwork\n  - The [amount — see the guide] transportation supplement can be taken as a BC Bus Pass instead of cash — choose whichever you actually use\n  - PWD has higher asset limits than regular income assistance, so savings do not disqualify you as quickly\n  - At 65 most recipients transition to federal Old Age Security and GIS — the ministry will contact you before then\nHow long it takes (verified — you may state this): Financial eligibility is usually confirmed within days; the PWD designation decision commonly takes several weeks to a few months once all three report sections are submitted\nPhone (this exact number is verified — you may give it): 1-866-866-0800"
  },
  "bc-autism-funding-under-6": {
    "name": "Autism Funding: Under Age 6",
    "keys": [
      "bc-autism-funding-under-6",
      "bc autism funding under 6",
      "autism funding: under age 6"
    ],
    "text": "What it is: Up to [amount — see the guide] per year per child, spent on professionals listed on the Registry of Autism Service Providers (RASP) and behaviour interventionists supervised by a RASP professional. Also covers family counselling from certified counsellors, psychologists, social workers or psychiatrists, employment-related costs when you hire staff, and administrative costs up to [amount — see the guide]/month. Normally, up to [percentage — see the guide] of the allocation can go to training, travel and equipment (TTE). For the final aligned funding period ending March 31, 2027, BC increased the allowable TTE portion to [percentage — see the guide].\nHow to apply:\n  1. Get an autism diagnosis through the BC Autism Assessment Network (BCAAN, free via physician referral) or a private assessment meeting BC standards\n  2. Register for a Basic BCeID account to apply online, or complete the paper Application for Autism Funding\n  3. Email the application and supporting documents to mcf.autismfundingintake@gov.bc.ca or submit through your local CYSN office\n  4. Sign the funding agreement, then choose RASP-listed providers and submit invoices or reimbursement claims\nWhat you need:\n  - Diagnostic report confirming autism spectrum disorder\n  - Confirmation of Previous Diagnosis of Autism Spectrum Disorder form (CF0905) if diagnosed elsewhere\n  - Child's Personal Health Number and proof of BC residency\n  - Basic BCeID account for online applications\nPractical tips:\n  - Providers must be on the RASP registry for children under 6 — search it before hiring\n  - The normal training, travel and equipment limit is [percentage — see the guide], but BC raised it to [percentage — see the guide] for the final aligned funding period ending March 31, 2027\n  - Approved services and purchases must be delivered by March 31, 2027; direct-payment supporting documents are due May 31, 2027, and final invoices or reimbursement requests are due September 30, 2027\n  - From July 2026 the ministry contacts Autism Funding families about moving to the new Disability Benefit ([amount — see the guide] or [amount — see the guide]/year); you keep current funding until your transition date\nHow long it takes (verified — you may state this): New applications are accepted until March 2027. The program and final aligned funding periods end March 31, 2027; later paperwork deadlines do not extend the service-delivery date.\nPhone (this exact number is verified — you may give it): 1-877-777-3530"
  },
  "bc-autism-funding-6-18": {
    "name": "Autism Funding: Ages 6-18",
    "keys": [
      "bc-autism-funding-6-18",
      "bc autism funding 6 18",
      "autism funding: ages 6-18"
    ],
    "text": "What it is: Up to [amount — see the guide] per year per child for behaviour consultants or analysts, speech-language pathologists, occupational or physical therapists, behaviour interventionists, life skills and social skills programs, out-of-school learning support and tutoring, dietary counselling from registered dieticians, family counselling, and specialized therapeutic camps for autism. Administrative costs are normally limited to [amount — see the guide]/month (or [amount — see the guide] per period for an accountant), and the normal training, travel and equipment (TTE) limit is [percentage — see the guide]. For the final aligned funding period ending March 31, 2027, BC increased the allowable TTE portion to [percentage — see the guide].\nHow to apply:\n  1. Have an autism diagnosis on file (BCAAN or qualified private assessment)\n  2. Apply online with a Basic BCeID or send the Application for Autism Funding to mcf.autismfundingintake@gov.bc.ca, or go through your local CYSN office\n  3. Sign the funding agreement and hire qualified providers\n  4. Submit invoices for direct payment or claim reimbursements\nWhat you need:\n  - Diagnostic report or CF0905 confirmation form\n  - Child's Personal Health Number\n  - Basic BCeID account for the online portal\nPractical tips:\n  - For ages 6-18 providers do not have to be RASP-listed for every service type, so therapy, tutoring and camps are easier to fund than under the Under-6 program\n  - The normal training, travel and equipment limit is [percentage — see the guide], but BC raised it to [percentage — see the guide] for the final aligned funding period ending March 31, 2027\n  - Approved services and purchases must be delivered by March 31, 2027; direct-payment supporting documents are due May 31, 2027, and final invoices or reimbursement requests are due September 30, 2027\n  - Ask your CYSN office about the transition schedule if you have not been contacted by fall 2026\nHow long it takes (verified — you may state this): New applications are accepted until March 2027. The program and final aligned funding periods end March 31, 2027; later paperwork deadlines do not extend the service-delivery date.\nPhone (this exact number is verified — you may give it): 1-877-777-3530"
  },
  "bc-cy-disability-benefit": {
    "name": "BC Children and Youth Disability Benefit",
    "keys": [
      "bc-cy-disability-benefit",
      "bc cy disability benefit",
      "bc children and youth disability benefit"
    ],
    "text": "What it is: Two funding tiers: a base tier of [amount — see the guide]/year and a higher tier of [amount — see the guide]/year set through support planning with a ministry worker. Funding covers disability-related expenses including respite, paediatric therapies, behavioural intervention, and assistive and augmentative communication supports. Eligibility is needs-based, not diagnosis-specific: direct admission for conditions such as moderate-to-profound intellectual disability, autism with intellectual disability, and degenerative conditions, plus a needs-based clinical review pathway for rare or atypical cases. Part of a [amount — see the guide]-million, three-year provincial investment that also expands free community services (therapies from spring 2026, behaviour and mental-health supports 2027, navigation and school-aged programming 2027-2028).\nHow to apply:\n  1. Already receiving Autism Funding or SAET: wait to be contacted — a ministry worker manages your transition between April 2026 and March 2027\n  2. Not yet in a program: apply through Autism Funding or the School-Aged Extended Therapies stream before March 2027 and you will move to the Disability Benefit automatically in April 2027\n  3. From April 1, 2027: apply directly to the Disability Benefit\n  4. Work with a ministry worker on support planning if your child may qualify for the [amount — see the guide] higher tier\nWhat you need:\n  - Existing program enrolment (for automatic transition), or\n  - Diagnostic reports and functional assessments showing significant support needs (communication, cognitive/adaptive functioning, safety or behavioural complexity)\nPractical tips:\n  - Do not wait for 2027 — applying to Autism Funding or the School-Aged Extended Therapies stream now locks in an automatic transition\n  - Funding is flexible across respite, therapy, behaviour intervention and AAC rather than tied to one diagnosis stream\n  - Services outside British Columbia and unresearched interventions are not eligible uses\n  - Call the CYSN Resource Line (1-833-882-0024) or your local CYSN office to discuss eligibility today\nHow long it takes (verified — you may state this): Transition runs April 2026 to March 2027; open to direct applications April 1, 2027.\nPhone (this exact number is verified — you may give it): 1-844-442-2800"
  },
  "bc-monthly-nutritional-supplement": {
    "name": "Monthly Nutritional Supplement",
    "keys": [
      "bc-monthly-nutritional-supplement",
      "bc monthly nutritional supplement",
      "monthly nutritional supplement"
    ],
    "text": "What it is: The MNS is for people on disability assistance with the PWD designation who have a severe medical condition causing chronic, progressive deterioration of health with wasting-type symptoms, and who need additional nutritional items or vitamins and minerals to prevent imminent danger to life. Current maximums (Health Supplements & Programs rate table, effective August 1, 2023) are [amount — see the guide]/month for dietary items and [amount — see the guide]/month for vitamins or minerals.\nHow to apply:\n  1. Get form HR2847 (Application for Monthly Nutritional Supplement) from your ministry office, My Self Serve or the link above\n  2. Complete Part B yourself\n  3. Have a medical practitioner, nurse practitioner or registered dietitian complete Part C describing your condition, symptoms and the items needed\n  4. Submit the form; the ministry's Health Assistance staff review and decide\nWhat you need:\n  - Form HR2847 with the practitioner or dietitian section completed\nPractical tips:\n  - A registered dietitian can complete Part C — often faster than waiting for a specialist appointment\n  - Be specific about each symptom: two or more must be documented for approval\n  - If denied, request reconsideration — MNS denials are frequently overturned with better medical detail\nHow long it takes (verified — you may state this): Typically a few weeks after the ministry receives the completed form\nPhone (this exact number is verified — you may give it): 1-866-866-0800"
  },
  "bc-optical-supplement": {
    "name": "Optical Supplements (Glasses & Eye Exams)",
    "keys": [
      "bc-optical-supplement",
      "bc optical supplement",
      "glasses & eye exams",
      "optical supplements"
    ],
    "text": "What it is: Everyone receiving income or disability assistance gets specified optical services: routine eye exams for adults ([amount — see the guide] with an optometrist or [amount — see the guide] with an ophthalmologist every two years), new eyeglasses up to ministry maximum rates, lens replacement when a prescription changes, and repairs to frames and lenses. Payment goes straight from the ministry to the optometrist or optician.\nHow to apply:\n  1. Take your BC Services Card to any eye clinic\n  2. The clinic verifies your coverage through Pacific Blue Cross\n  3. Get your exam and choose frames within the ministry rate (or pay the difference)\n  4. The ministry pays the provider directly\nWhat you need:\n  - BC Services Card\nPractical tips:\n  - Ask the clinic which frames are fully covered at ministry rates before choosing\n  - If your prescription changes, replacement lenses are covered even between exam cycles\nHow long it takes (verified — you may state this): No application — coverage verified at the clinic on the spot\nPhone (this exact number is verified — you may give it): 1-866-866-0800"
  },
  "bc-bus-pass": {
    "name": "BC Bus Pass Program",
    "keys": [
      "bc-bus-pass",
      "bc bus pass",
      "bc bus pass program"
    ],
    "text": "What it is: The BC Bus Pass Program provides a monthly pass at no annual cost to eligible people with the PWD designation who receive disability assistance, and a separate [amount — see the guide] annual pass to eligible low-income seniors. The pass works on scheduled BC Transit services across the province and as a Compass Card on TransLink in Metro Vancouver. A PWD recipient chooses either the pass or the [amount — see the guide] monthly cash transportation supplement.\nHow to apply:\n  1. Confirm whether you qualify through the PWD stream or the low-income-senior stream\n  2. If you receive PWD disability assistance, choose either the no-fee bus pass or the [amount — see the guide] monthly cash transportation supplement\n  3. Request the pass through My Self Serve or by calling 1-866-866-0800; PWD recipients switching from cash should contact the ministry by the 5th for the change to start the next month\n  4. Allow 4 to 6 weeks for a new pass to arrive\nWhat you need:\n  - No new documents if you already receive disability assistance — just your request\n  - Seniors stream: SIN, name, date of birth, address and contact details\nPractical tips:\n  - PWD recipients pay no annual fee; the [amount — see the guide] annual fee applies to the eligible low-income-senior stream\n  - The pass works in BC Transit communities across the whole province, not just your home city\n  - Replacement passes can carry a fee even when the original PWD pass had no annual fee — report a lost pass promptly\n  - PWD recipients can later cancel the pass and return to the [amount — see the guide] monthly cash supplement by contacting the ministry by the 5th\nHow long it takes (verified — you may state this): Allow 4 to 6 weeks for a new pass to arrive\nPhone (this exact number is verified — you may give it): 1-866-866-0800"
  },
  "sparc-parking-permit": {
    "name": "Accessible Parking Permit (SPARC BC)",
    "keys": [
      "sparc-parking-permit",
      "sparc parking permit",
      "sparc bc",
      "accessible parking permit"
    ],
    "text": "What it is: SPARC BC issues the accessible parking permits recognized in designated spaces across British Columbia. Three types exist: permanent (valid 3 years, renewable), temporary (1 to 12 months, not renewable — reapply if still needed), and conditional (3 years, not renewable). The permit belongs to the person, not a car, and must be displayed on the rear-view mirror while parked.\nHow to apply:\n  1. Download the application form from sparc.bc.ca or call 604-718-7744 / 1-888-718-7794 for a copy\n  2. Have the referral section completed by a medical professional with a valid MSP number\n  3. Check SPARC BC's site for the current fee and submit it with the application; ask about hardship assistance if needed\n  4. Allow 2 to 3 weeks for processing\n  5. Display the permit on the rear-view mirror whenever parked in an accessible space\nWhat you need:\n  - Application form including the medical professional referral section\n  - Payment of the current fee listed by SPARC BC, unless hardship assistance applies\nPractical tips:\n  - The permit is yours, not the vehicle's — use it in any car you drive or ride in\n  - Renew permanent permits online at online.sparc.bc.ca before they expire; expired permits can't be renewed online\n  - Temporary permits can't be renewed — submit a new application if you still need one\n  - Email permits@sparc.bc.ca with questions\nHow long it takes (verified — you may state this): 2 to 3 weeks from when your application is received\nPhone (this exact number is verified — you may give it): 604-718-7744 or toll-free 1-888-718-7794"
  },
  "bc-medical-equipment-devices": {
    "name": "Medical Equipment & Devices Supplement",
    "keys": [
      "bc-medical-equipment-devices",
      "bc medical equipment devices",
      "medical equipment & devices supplement"
    ],
    "text": "What it is: Covered items include canes, crutches, walkers, manual and power wheelchairs, scooters, grab bars, bath seats, commodes, lift devices, hospital beds, pressure-relief mattresses and non-conventional glucose meters. A prescription from a doctor or nurse practitioner is required, and many items also need an occupational or physical therapist assessment. Most equipment can be replaced every five years (wheelchair seating after two; canes, crutches and walkers as needed). Recreational scooters, lift chairs and automatic beds are excluded.\nHow to apply:\n  1. Contact the ministry through My Self Serve or 1-866-866-0800 to start an equipment request\n  2. Get a prescription from your doctor or nurse practitioner\n  3. Complete an occupational or physical therapist assessment where required (wheelchairs, seating, scooters, lifts)\n  4. Submit supplier quote(s); wait for written ministry pre-approval\n  5. The ministry pays the supplier directly; repairs are requested the same way\nWhat you need:\n  - Doctor or nurse practitioner prescription\n  - Occupational/physical therapist assessment for mobility and positioning items\n  - Supplier quote\nPractical tips:\n  - Never buy first — equipment purchased before pre-approval is not reimbursed\n  - Ask your OT to note why the least-expensive option would not meet your medical need if you require specific features\n  - Repairs and batteries can be covered between replacement cycles\nHow long it takes (verified — you may state this): Weeks to a couple of months depending on assessments, quotes and pre-approval\nPhone (this exact number is verified — you may give it): 1-866-866-0800"
  },
  "bc-at-home-medical": {
    "name": "At Home Program: Medical Benefits",
    "keys": [
      "bc-at-home-medical",
      "bc at home medical",
      "at home program: medical benefits"
    ],
    "text": "What it is: Medical Benefits can cover approved equipment, supplies, therapies, dental, optical, medical travel and PharmaCare Plan F. The program must approve many items before they are bought, and coverage ends on the last day of the month the child turns 18.\nHow to apply:\n  1. Complete the At Home Program application with a doctor or nurse practitioner\n  2. Attach the requested identification and functional assessments; children under 3 may be asked for extra supporting information\n  3. Send the application to the regional At Home Program office listed by the province\n  4. Take part in the in-home assessment of eating, dressing, toileting and washing if one is required\n  5. Wait for the written decision, then work with the CYSN worker or Medical Benefits branch before purchasing covered equipment or services\nWhat you need:\n  - Completed At Home Program application with parent and medical-professional sections\n  - Identification for the child and parent or guardian\n  - Child's Personal Health Number and proof of active MSP\n  - Requested functional assessments such as Vineland-3, PEDI-CAT or GMFCS, when applicable\nPractical tips:\n  - Families in current pilot areas use a different Medical Benefits application route; check the official page for your community\n  - Do not buy equipment, dental, optical or travel first when pre-approval is required\n  - Start adult PWD planning about six months before the child's 18th birthday\nHow long it takes (verified — you may state this): Assessment and regional review follow a complete application; no guaranteed timeline is published\nPhone (this exact number is verified — you may give it): Medical Benefits: 1-888-613-3232"
  },
  "bc-supported-child-development": {
    "name": "Supported Child Development",
    "keys": [
      "bc-supported-child-development",
      "bc supported child development",
      "supported child development"
    ],
    "text": "What it is: Supported Child Development is a set of community-based programs offering consulting and support to children, families and child care centres so children with extra support needs can participate in inclusive child care. Aboriginal Supported Child Development provides culturally relevant support.\nHow to apply:\n  1. Use the provincial early-intervention page to find the Supported Child Development program serving your community\n  2. Contact the program directly, or ask a public health nurse or physician to help with the referral\n  3. Tell the program which child care setting the child attends or hopes to attend and what participation barriers are present\n  4. Work with the program and child care provider on an individual support plan\nWhat you need:\n  - Child and parent or guardian contact information\n  - Information from the child care provider about participation and support needs\n  - Relevant developmental or health reports if the local program requests them\nPractical tips:\n  - Contact the program even if the child does not yet have a child care placement\n  - Ask about Aboriginal Supported Child Development if culturally grounded service is a better fit\n  - Availability and intake steps are local, so the community program is the authoritative contact\nHow long it takes (verified — you may state this): Intake and availability vary by community"
  },
  "bc-at-home-saet": {
    "name": "At Home Program: School-Aged Extended Therapies (SAET)",
    "keys": [
      "bc-at-home-saet",
      "bc at home saet",
      "saet",
      "at home program: school-aged extended therapies"
    ],
    "text": "What it is: Up to [amount — see the guide] per 12-month period for each of occupational therapy, physiotherapy and speech-language pathology (including therapist-assistant services), delivered one-to-one or in groups. Maximum billing rates: [amount — see the guide]/hour for therapists, [amount — see the guide]/hour for therapist assistants; up to [amount — see the guide] of the maximum can go to consultation, report writing and travel. A separate [amount — see the guide]/year is available for chiropractic ([amount — see the guide]/session) or massage ([amount — see the guide]/hour). Exceptions to maximums are considered for post-surgical rehabilitation. Services must complement, not duplicate, school-based therapy.\nHow to apply:\n  1. Ensure the child is enrolled in the At Home Program\n  2. Have the treating OT, PT, SLP, chiropractor or massage therapist complete the At Home Program Request for School-Aged Extended Therapies form, including intended functional outcomes\n  3. Submit the request to AHP Medical Benefits for review\n  4. Approved therapists invoice AHP Medical Benefits directly\nWhat you need:\n  - Request for School-Aged Extended Therapies form completed by the treating therapist\n  - Functional outcomes for the child (Part 5 of the request form)\nPractical tips:\n  - The requesting therapist must coordinate with the school-based therapy team so services do not overlap\n  - Sequential therapy blocks (one goal at a time) are preferred over running everything simultaneously\n  - If your child moved to the Disability Benefit in April 2026, pay for the same therapies from the new [amount — see the guide]/[amount — see the guide] allocation instead\n  - Post-surgical rehab can exceed the annual maximum — ask for an exception\nHow long it takes (verified — you may state this): Requests reviewed by AHP Medical Benefits; SAET recipients transitioned to the Disability Benefit starting April 2026.\nPhone (this exact number is verified — you may give it): 1-888-613-3232"
  },
  "bc-clbc": {
    "name": "Community Living BC (CLBC) Adult Supports",
    "keys": [
      "bc-clbc",
      "bc clbc",
      "clbc",
      "community living bc adult supports"
    ],
    "text": "What it is: CLBC funds and coordinates: residential supports (living in your own place, shared living/home sharing with a contracted family, or staffed homes), employment support to find and keep a job, community inclusion and connection programs, skill development, respite for families, wellness supports for daily responsibilities, behavioural support, and the Provincial Assessment Centre's mental-health services for people 14+ with developmental disabilities. Services are delivered through a network of contracted agencies and planned individually with a CLBC facilitator.\nHow to apply:\n  1. From age 16, ask your MCFD/CYSN worker about transition planning to CLBC\n  2. Contact your nearest CLBC office (1-877-660-2522) — a facilitator explains the required documents and approved assessors\n  3. Submit assessments and forms completed by an approved professional (registered psychologist for the DD stream); school-years assessments may be reusable\n  4. Once eligibility is confirmed, attend the CLBC Welcome Workshop series and work with your facilitator on a support plan\n  5. CLBC connects you to funded services based on the plan and available resources\nWhat you need:\n  - Cognitive/psychoeducational assessment by a registered psychologist (DD stream)\n  - Adaptive functioning assessment completed by an approved professional\n  - Confirmed FASD or autism spectrum diagnosis for the PSI stream\n  - CLBC eligibility forms completed by approved professionals\nPractical tips:\n  - Start at 16 — assessments and planning take time, and starting early means supports can begin right at 19\n  - If you were assessed in school, ask the school district for copies; a new assessment may not be needed\n  - Not eligible under the DD stream? Ask specifically about the Personalized Supports Initiative (PSI)\n  - Respite or equivalent funding is commonly the first service offered to families of transitioning youth — ask your facilitator what is available in your region\n  - Adults on CLBC services usually also qualify for BC PWD disability assistance — apply for both\nHow long it takes (verified — you may state this): Apply from age 16; eligibility confirmation before the 19th birthday is recommended so services start on time.\nPhone (this exact number is verified — you may give it): 1-877-660-2522"
  },
  "bc-csg-students-disabilities": {
    "name": "Canada Student Grant for Students with Disabilities (StudentAid BC)",
    "keys": [
      "bc-csg-students-disabilities",
      "bc csg students disabilities",
      "studentaid bc",
      "canada student grant for students with disabilities"
    ],
    "text": "What it is: This federal grant, delivered through StudentAid BC, helps cover education costs for students with disabilities. It is money you do not pay back, and it is available whether you study full-time or part-time. Disability status can be a permanent disability (lifelong) or a persistent or prolonged disability (12+ months). Once your disability status is verified, it also unlocks reduced course-load rules (40-[percentage — see the guide] counts as full-time) and other B.C. disability grants.\nHow to apply:\n  1. Apply for StudentAid BC full-time or part-time funding online.\n  2. In your StudentAid BC account, open the Disability status application in the Forms section (for applications submitted after June 23, 2026).\n  3. Download the Disability Verification Form and have a qualified medical assessor complete it.\n  4. Upload the signed form inside the Disability status application and submit your declaration.\n  5. StudentAid BC reviews it (about 6 weeks) and posts the decision to your account; the grant is then included in your funding assessment.\nWhat you need:\n  - StudentAid BC application (full-time or part-time)\n  - Disability Verification Form completed by a qualified medical assessor\n  - Social Insurance Number and B.C. ID for your StudentAid BC account\nPractical tips:\n  - You can submit the disability verification any time — you do not have to wait for your loan application to finish.\n  - Permanent disabilities never need re-verification; persistent or prolonged disabilities are re-verified when you enter repayment or after a break of more than 5 years.\n  - If you already receive provincial disability assistance (PWD), tell your school's financial aid office — it can affect how your funding is structured.\nHow long it takes (verified — you may state this): About 6 weeks for disability verification\nPhone (this exact number is verified — you may give it): 1-800-561-1818"
  },
  "bc-csg-services-equipment": {
    "name": "Canada Student Grant for Services and Equipment – Students with Disabilities",
    "keys": [
      "bc-csg-services-equipment",
      "bc csg services equipment",
      "canada student grant for services and equipment – students with disabilities"
    ],
    "text": "What it is: This grant pays for the specific services and equipment you need because of your disability while studying — things like notetakers, tutors, interpreters, assistive software and other technical aids. It is non-repayable and is assessed through your StudentAid BC application after your disability status is verified.\nHow to apply:\n  1. Complete a StudentAid BC application and get your disability status verified (Disability Verification Form from a qualified medical assessor).\n  2. Work with your school's accessibility services office to identify the services and equipment you need.\n  3. Submit the services-and-equipment request with cost details through StudentAid BC.\n  4. Funding decisions are posted to your StudentAid BC account.\nWhat you need:\n  - Verified disability status with StudentAid BC\n  - Documentation of the services or equipment you need and their costs (your school's accessibility office helps prepare this)\nPractical tips:\n  - Book an appointment with your institution's accessibility services office early — they know this process well and often start the paperwork for you.\n  - Keep receipts for everything the grant pays for.\nHow long it takes (verified — you may state this): About 6 weeks for disability verification, then with your funding assessment\nPhone (this exact number is verified — you may give it): 1-800-561-1818"
  },
  "bc-access-grant-students-disabilities": {
    "name": "B.C. Access Grant for Students with Disabilities",
    "keys": [
      "bc-access-grant-students-disabilities",
      "bc access grant students disabilities",
      "b.c. access grant for students with disabilities"
    ],
    "text": "What it is: This non-repayable grant replaces B.C. student loan funding with grant funding for eligible full-time students with a disability at B.C. public post-secondary schools, reducing the amount they borrow.\nHow to apply:\n  1. Apply for full-time StudentAid BC funding for the study period\n  2. If disability status is not already verified, submit the StudentAid BC Disability Verification Form completed by an accepted medical assessor\n  3. Confirm that the school is a B.C. public post-secondary institution\n  4. Review the assessment notice in your StudentAid BC account; the grant is assessed with the aid application\nWhat you need:\n  - StudentAid BC application\n  - Disability Verification Form if status is not already verified\n  - Any follow-up financial information StudentAid BC requests\nPractical tips:\n  - There is no separate grant application after disability status is verified\n  - Contact the school's accessibility services office early for accommodations and related disability funding\nHow long it takes (verified — you may state this): Assessed with the StudentAid BC application\nPhone (this exact number is verified — you may give it): 1-800-561-1818"
  },
  "bc-supplemental-bursary-students-disabilities": {
    "name": "B.C. Supplemental Bursary for Students with Disabilities",
    "keys": [
      "bc-supplemental-bursary-students-disabilities",
      "bc supplemental bursary students disabilities",
      "b.c. supplemental bursary for students with disabilities"
    ],
    "text": "What it is: This non-repayable bursary helps eligible full-time and part-time students with a permanent, or persistent or prolonged, disability pay post-secondary education costs at B.C. public post-secondary schools.\nHow to apply:\n  1. Apply for StudentAid BC full-time or part-time funding for the study period\n  2. Submit the Disability Verification Form if StudentAid BC has not already verified disability status\n  3. Confirm that the school and course load meet the bursary rules\n  4. Review the StudentAid BC assessment notice; the bursary is assessed automatically when the conditions are met\nWhat you need:\n  - StudentAid BC aid application\n  - Disability Verification Form when needed\n  - School and course-load information\nPractical tips:\n  - A [percentage — see the guide] course load counts as full-time for this bursary; [percentage — see the guide] to [percentage — see the guide] counts as part-time\n  - Ask StudentAid BC about the published transition rule if you received this bursary at a non-public school in 2025/26\nHow long it takes (verified — you may state this): Assessed with the StudentAid BC application\nPhone (this exact number is verified — you may give it): 1-800-561-1818"
  },
  "bc-assistance-program-students-disabilities": {
    "name": "B.C. Assistance Program for Students with Disabilities",
    "keys": [
      "bc-assistance-program-students-disabilities",
      "bc assistance program students disabilities",
      "b.c. assistance program for students with disabilities"
    ],
    "text": "What it is: This grant funds exceptional education-related services and adaptive equipment after all available funding from the Canada Student Grant for Services and Equipment – Students with Disabilities has been used. Apply for the federal grant first.\nHow to apply:\n  1. Have StudentAid BC verify your disability status\n  2. Meet with the school's accessibility services office to document disability-related services and equipment\n  3. Apply first for the Canada Student Grant for Services and Equipment – Students with Disabilities\n  4. If eligible costs exceed that grant, have the accessibility office submit the B.C. Assistance Program request and quotes\n  5. Wait for written approval before purchasing equipment or committing to services\nWhat you need:\n  - Verified disability status\n  - Accessibility-services assessment of required services or equipment\n  - Supplier quotes or service-cost estimates\n  - Evidence that the federal services-and-equipment grant has been used\nPractical tips:\n  - Do not buy equipment before written funding approval\n  - The official page does not state whether the maximum is annual or lifetime; ask StudentAid BC before planning around it\nHow long it takes (verified — you may state this): Varies with assessment, quotes and funding review\nPhone (this exact number is verified — you may give it): 1-800-561-1818"
  },
  "bc-learning-disability-assessment-bursary": {
    "name": "Learning Disability Assessment Bursary",
    "keys": [
      "bc-learning-disability-assessment-bursary",
      "bc learning disability assessment bursary",
      "learning disability assessment bursary"
    ],
    "text": "What it is: This bursary covers up to [amount — see the guide] of the up-front cost of a learning disability assessment when the accessibility services office at an eligible B.C. public post-secondary institution recommends the assessment.\nHow to apply:\n  1. Apply for StudentAid BC funding and confirm that the school is an eligible B.C. public post-secondary institution\n  2. Meet with the school's accessibility services office and ask whether it recommends a current learning-disability assessment\n  3. Have the accessibility office start the bursary process before booking the assessment\n  4. Use the approved qualified assessor and submit the required invoice or receipt through the school process\nWhat you need:\n  - StudentAid BC funding eligibility\n  - Accessibility-services recommendation\n  - Assessment quote or invoice and the completed assessment documentation requested by the school\nPractical tips:\n  - Start with accessibility services — independently booking an assessment does not establish bursary eligibility\n  - Ask how the assessor will be paid and what amount, if any, you must pay up front\nHow long it takes (verified — you may state this): Ask the school's accessibility services office\nPhone (this exact number is verified — you may give it): StudentAid BC: 1-800-561-1818"
  },
  "bc-access-grant-deaf-students": {
    "name": "B.C. Access Grant for Deaf Students",
    "keys": [
      "bc-access-grant-deaf-students",
      "bc access grant deaf students",
      "b.c. access grant for deaf students"
    ],
    "text": "What it is: This grant is only for eligible deaf or hard of hearing students attending Gallaudet University in Washington, D.C. or the National Technical Institute for the Deaf in Rochester, New York. StudentAid BC assesses it automatically when disability status is verified and the student attends one of those two schools.\nHow to apply:\n  1. Apply for StudentAid BC funding for full-time study at Gallaudet University or the National Technical Institute for the Deaf\n  2. Submit the Disability Verification Form if StudentAid BC has not already verified deaf or hard-of-hearing status\n  3. Provide any financial-need or enrolment information StudentAid BC requests\n  4. Review the funding assessment; there is no separate application for this grant\nWhat you need:\n  - StudentAid BC application\n  - Verified disability status\n  - Full-time enrolment information for one of the two eligible schools\nPractical tips:\n  - Only the two named U.S. institutions qualify\n  - Ask StudentAid BC how cross-border tuition, currency and disbursement are handled before committing to costs\nHow long it takes (verified — you may state this): Assessed with the StudentAid BC application\nPhone (this exact number is verified — you may give it): 1-800-561-1818"
  },
  "bc-dental-supplement": {
    "name": "Dental Supplements (Income & Disability Assistance)",
    "keys": [
      "bc-dental-supplement",
      "bc dental supplement",
      "income & disability assistance",
      "dental supplements"
    ],
    "text": "What it is: Coverage includes restorations, extractions, preventative care, partial and replacement dentures, and crowns or bridges in certain cases, billed under ministry fee schedules. Adults with eligibility get up to [amount — see the guide] over each two-calendar-year period; children get up to [amount — see the guide] plus an extra [amount — see the guide] per year for hospital dental treatment under general anesthesia. Emergency dental to relieve pain is available to everyone on assistance regardless of the limit.\nHow to apply:\n  1. Confirm you receive disability assistance or otherwise qualify for general health supplements\n  2. Book any dentist, denturist or dental hygienist and show your BC Services Card\n  3. The office confirms your coverage with the ministry's insurer (Pacific Blue Cross) before treatment\n  4. The ministry pays the provider directly — ask in advance about any costs above the fee schedule\nWhat you need:\n  - BC Services Card or Personal Health Number\nPractical tips:\n  - Ministry fee-schedule rates are below many dentists' usual fees — ask the office to bill within the schedule or tell you the difference before work starts\n  - Plan larger treatment around the 2-year cycle so a January reset gives you a fresh [amount — see the guide]\n  - Dentures have their own rules and limits — ask the ministry before ordering\nHow long it takes (verified — you may state this): No application — coverage is active while you are on assistance; the provider verifies it at booking\nPhone (this exact number is verified — you may give it): 1-866-866-0800"
  },
  "bc-home-reno-tax-credit": {
    "name": "Home Renovation Tax Credit for Seniors and Persons with Disabilities",
    "keys": [
      "bc-home-reno-tax-credit",
      "bc home reno tax credit",
      "home renovation tax credit for seniors and persons with disabilities"
    ],
    "text": "What it is: This credit helps cover permanent renovations that make your principal residence more accessible, functional or safe — improving access to the home or land, helping you move around and function at home, or reducing risk of harm. Qualifying examples include wheelchair ramps, grab bars, handrails, walk-in bathtubs, raised toilets, lowered cupboards, adjustable counters, widened doorways, non-slip flooring, motion-activated lighting and stair lifts. Aesthetic upgrades, appliances, regular repairs, HVAC, windows, and mobility equipment like walkers or wheelchairs do not qualify.\nHow to apply:\n  1. Complete eligible renovations to your principal residence and keep all receipts.\n  2. At tax time, complete Schedule BC(S12) — the B.C. Home Renovation Tax Credit for Seniors and Persons with Disabilities form.\n  3. Enter your renovation expenses beside box 60480 on the British Columbia Credits form (BC479).\n  4. File with your T1 return; the credit is refunded even if you owe no tax.\nWhat you need:\n  - Receipts from suppliers and contractors (with GST/HST numbers where applicable)\n  - Disability tax credit eligibility (if claiming as a person with a disability)\nPractical tips:\n  - Family members who live with a senior or a person with a disability can claim the credit for work on the shared home.\n  - The renovation's main purpose cannot be increasing your property value — keep documentation showing the accessibility purpose.\n  - You can pair this with the federal Home Accessibility Tax Credit and Multigenerational Home Renovation Credit on the same expenses where rules allow — ask your tax preparer.\nHow long it takes (verified — you may state this): Claimed annually at tax time\nPhone (this exact number is verified — you may give it): 1-800-959-8281"
  },
  "bc-work-able-internship": {
    "name": "Work-Able Accessible Employment Program (BC Public Service)",
    "keys": [
      "bc-work-able-internship",
      "bc work able internship",
      "bc public service",
      "work-able accessible employment program"
    ],
    "text": "What it is: Work-Able coordinates paid internship opportunities across the BC Public Service for recent graduates with disabilities, for up to 24 months. Participants get government work experience, a peer cohort of other graduates with disabilities, exposure to different career paths, and post-program access to internal job postings.\nHow to apply:\n  1. Watch the Work-Able page for the annual intake (next opens spring 2027 for the 2027/28 cohort).\n  2. Confirm you graduated within 3 years of the program start date.\n  3. Apply online during the intake window; you self-identify as having a disability without disclosing a diagnosis.\n  4. If selected, you are placed in a paid position with a ministry.\nWhat you need:\n  - Proof of post-secondary graduation (within 3 years of program start)\n  - Resume\nPractical tips:\n  - Contact the Work-Able team to be notified when the next application period opens.\n  - Workplace accommodations are part of the program's design — you do not need to negotiate them alone.\nHow long it takes (verified — you may state this): Annual intake; internships run up to 24 months"
  },
  "bc-workbc-assistive-technology": {
    "name": "WorkBC Assistive Technology Services",
    "keys": [
      "bc-workbc-assistive-technology",
      "bc workbc assistive technology",
      "workbc assistive technology services"
    ],
    "text": "What it is: Assistive Technology Services (ATS) removes equipment barriers between you and employment. It funds assistive devices and technology, ergonomic supports like furniture and lighting, restorative supports, ASL interpreting and captioning, communication and hearing devices for work, workplace access modifications, and vehicle modifications needed for employment. How much is covered depends on your financial circumstances.\nHow to apply:\n  1. Apply through WorkBC Online Employment Services (apply.workbc.ca) or contact ATS directly.\n  2. An ATS specialist works with you to understand your work barrier and equipment needs.\n  3. Approved equipment and services are arranged fully or partially funded.\nWhat you need:\n  - Proof you are a B.C. resident eligible to work\n  - Information about your job, job offer, self-employment or volunteer role\n  - Details of the disability-related barrier and equipment needs (ATS helps document this)\nPractical tips:\n  - Commuting barriers count — vehicle modifications and travel-related equipment can be funded when needed for work.\n  - You can use ATS while employed to keep your job, not just when job hunting.\n  - Email info-ats@workbc.ca if you are unsure whether your situation qualifies.\nHow long it takes (verified — you may state this): Varies by request; contact ATS for current timelines\nPhone (this exact number is verified — you may give it): 1-844-453-5506"
  },
  "bc-workbc-employment-services": {
    "name": "WorkBC Employment Services",
    "keys": [
      "bc-workbc-employment-services",
      "bc workbc employment services",
      "workbc employment services"
    ],
    "text": "What it is: WorkBC centres provide free employment services including job-search help, training, work experience, wage subsidies and practical disability-related supports. A WorkBC counsellor reviews eligibility and builds the plan with you.\nHow to apply:\n  1. Get a Basic BCeID or set up online access with a BC Services Card\n  2. Register for Online Employment Services and select WorkBC Employment Services\n  3. Complete the application, including work status, barriers and the WorkBC centre you want to use\n  4. Upload requested documents and communicate with the centre through the secure portal\n  5. Meet an employment counsellor to confirm eligibility and create a personal action plan\nWhat you need:\n  - Valid Social Insurance Number\n  - Information showing you are legally allowed to work in B.C.\n  - Work and education history\n  - Information about disability-related employment barriers if requesting specialized supports\nPractical tips:\n  - A phone number and fixed mailing address are not required to submit the online application\n  - Centre staff can help you complete the application\n  - People with disabilities can qualify in additional employed or student situations, including risk of losing a job or the final year of school\nHow long it takes (verified — you may state this): The local WorkBC centre decides eligibility after reviewing the completed application\nPhone (this exact number is verified — you may give it): Contact your selected WorkBC centre"
  },
  "bc-fuel-tax-refund-disabilities": {
    "name": "Fuel Tax Refund for Persons with Disabilities",
    "keys": [
      "bc-fuel-tax-refund-disabilities",
      "bc fuel tax refund disabilities",
      "fuel tax refund for persons with disabilities"
    ],
    "text": "What it is: This is a two-stage program: register the person and qualifying vehicle first, then claim fuel-tax refunds using original receipts after the registration effective date.\nHow to apply:\n  1. Gather the disability confirmation and vehicle ownership or lease information listed by the Ministry of Finance\n  2. Register online or submit form FIN 119 with every required supporting document\n  3. Wait for the mailed registration confirmation letter and note the registration effective date\n  4. Keep original fuel receipts from that effective date onward\n  5. Submit the refund application with eligible receipts; the ministry must receive a claim within four years of the fuel purchase\nWhat you need:\n  - Accepted disability confirmation or medical certification\n  - Vehicle registration, lease or ownership-interest documentation\n  - Power of attorney or representation agreement if applying for another adult\n  - Original receipts showing date, fuel type, litres, and seller name and address\nPractical tips:\n  - Do not claim fuel bought before the registration effective date\n  - Incomplete registration packages delay approval\n  - Once registered, take the confirmation to an Autoplan broker for the related Basic Autoplan discount\nHow long it takes (verified — you may state this): Registration must be approved before any refund claim\nPhone (this exact number is verified — you may give it): 1-877-388-4440"
  },
  "bc-icbc-disability-discount": {
    "name": "ICBC Disability Discount (Basic Autoplan)",
    "keys": [
      "bc-icbc-disability-discount",
      "bc icbc disability discount",
      "basic autoplan",
      "icbc disability discount"
    ],
    "text": "What it is: The discount is applied through an Autoplan broker after the Ministry of Finance registers you in the Fuel Tax Refund Program for Persons with Disabilities.\nHow to apply:\n  1. Complete the provincial Fuel Tax Refund Program registration\n  2. Wait for the Ministry of Finance registration confirmation\n  3. Bring the confirmation and vehicle information to an Autoplan broker\n  4. Ask the broker to apply the disability discount to eligible Basic Autoplan coverage\nWhat you need:\n  - Fuel Tax Refund Program registration confirmation\n  - Vehicle registration and current Autoplan policy information\n  - Identification requested by the broker\nPractical tips:\n  - The discount is on Basic Autoplan, not every optional coverage charge\n  - Ask the broker when the discount will take effect if the policy is already active\n  - Electric vehicles can receive the insurance discount even though they do not use fuel\nHow long it takes (verified — you may state this): Ask an Autoplan broker after provincial registration is confirmed"
  },
  "bc-property-tax-deferment-disabilities": {
    "name": "Property Tax Deferment for Persons with Disabilities",
    "keys": [
      "bc-property-tax-deferment-disabilities",
      "bc property tax deferment disabilities",
      "property tax deferment for persons with disabilities"
    ],
    "text": "What it is: Property tax deferment is a loan secured against the home, not a grant. Interest and fees are added to the account, and eligibility must be maintained.\nHow to apply:\n  1. Check the regular-program eligibility rules, including B.C. residency, citizenship or permanent residency, principal residence and at least [percentage — see the guide] equity\n  2. Pay all previous-year property taxes, utility user fees, penalties and interest\n  3. Gather each owner's Social Insurance Number, birth date and property-tax notice\n  4. Apply online between May 1 and December 31; applying after the local due date can still cause late penalties\n  5. Check application status and renew each year unless you choose and remain eligible for auto-renewal\nWhat you need:\n  - Current property-tax notice and jurisdiction information\n  - Social Insurance Number and date of birth for each owner\n  - PWD designation information or physician certification requested by the program\n  - Mortgage and other registered-charge information needed to verify equity\nPractical tips:\n  - Apply before the municipality's tax due date to avoid late penalties while the province reviews the application\n  - Confirm the current interest rate and understand that interest compounds for 2026 and later deferrals\n  - Do not use this program if current-year property taxes have already been paid in full\nHow long it takes (verified — you may state this): Applications and renewals are accepted May 1 to December 31 each year"
  },
  "bc-sales-tax-credit": {
    "name": "B.C. Sales Tax Credit",
    "keys": [
      "bc-sales-tax-credit",
      "bc sales tax credit",
      "b.c. sales tax credit"
    ],
    "text": "What it is: Claim it when you file your T1 Income Tax Return using the British Columbia Credits form (BC479). You must claim within three years after the end of the tax year.\nHow to apply:\n  1. File the federal T1 income tax return for the year\n  2. Complete the B.C. Credits form BC479\n  3. Enter the sales tax credit claim from BC479 with the return\n  4. If you missed it, ask the Canada Revenue Agency to adjust the return within three years after the tax year\nWhat you need:\n  - Tax slips and income information for the year\n  - Spouse or common-law partner income information when applicable\n  - Form BC479\nPractical tips:\n  - File even if you owe no income tax because this credit is refundable\n  - The credit is income-tested and is not specific to disability\n  - CRA handles questions about the tax return and refund\nHow long it takes (verified — you may state this): Claimed with the annual tax return\nPhone (this exact number is verified — you may give it): Canada Revenue Agency: 1-800-959-8281"
  },
  "vancouver-leisure-access": {
    "name": "Leisure Access Program (LAP)",
    "keys": [
      "vancouver-leisure-access",
      "vancouver leisure access",
      "lap",
      "leisure access program"
    ],
    "text": "What it is: The pass adds free or reduced recreation access to a Vancouver Park Board OneCard and ActiveNet account. The route and documents depend on whether you qualify through a listed benefit, an agency referral or the low-income application.\nHow to apply:\n  1. Open the City's page and choose the application route matching your situation\n  2. Complete the Leisure Access application and gather the documents listed for that route\n  3. Submit it at a Park Board community centre or by the stated mail process\n  4. After approval, have the Leisure Access membership added to the OneCard and ActiveNet account\n  5. For a child 16 or younger, complete the parent or guardian photo-consent form\nWhat you need:\n  - Proof of a qualifying benefit or current Proof of Income Statement, depending on route\n  - Proof of a City of Vancouver address dated within 90 days\n  - Government-issued identification\n  - OneCard photo consent for children 16 and younger\nPractical tips:\n  - A Notice of Assessment is not the same as the CRA Proof of Income Statement requested for the low-income route\n  - UBC and University Endowment Lands addresses are outside the City of Vancouver\n  - Bring the pass and photo identification when a partner venue requires both\nHow long it takes (verified — you may state this): Ask the Leisure Access office when submitting"
  },
  "surrey-leisure-access": {
    "name": "Leisure Access Program (LAP)",
    "keys": [
      "surrey-leisure-access",
      "surrey leisure access",
      "lap",
      "leisure access program"
    ],
    "text": "What it is: Surrey accepts several qualifying routes. Income-tax applicants must meet both the family-income table and the additional investment, rental, RRSP-deduction and capital-gain limits on the current City page.\nHow to apply:\n  1. Review the City's qualifying routes and select the one that applies\n  2. Complete the Leisure Access Program application and copy the documents required for that route\n  3. Submit online and wait for staff to schedule an appointment, or submit in person at a listed Surrey facility\n  4. After approval, use the pass through the MySurrey account or call registration staff\nWhat you need:\n  - Application form\n  - Government-issued photo identification for one adult\n  - Proof of Income Statement or Notice of Assessment for each adult when applying by income\n  - Program confirmation, DTC information or referral documents for another qualifying route\nPractical tips:\n  - Translation and interpretation support are available free\n  - Check that tax documents are from a currently accepted year before submitting\n  - Ask whether a specialty program is excluded before registering\nHow long it takes (verified — you may state this): Online applicants are contacted for appointments on a first-come, first-served basis\nPhone (this exact number is verified — you may give it): 604-502-6325"
  },
  "burnaby-fair-play": {
    "name": "FAIR Play Program",
    "keys": [
      "burnaby-fair-play",
      "burnaby fair play",
      "fair play program"
    ],
    "text": "What it is: Each approved family member receives both a Be Active Pass and recreation credit. The City accepts income-assistance, income, child-disability, refugee and agency-referral routes.\nHow to apply:\n  1. Download and print the FAIR Play application or pick up a copy at a Burnaby recreation or culture facility\n  2. Choose the qualifying route and gather the supporting documents listed on the form\n  3. Complete the household information and submit the application using the City's instructions\n  4. After approval, use the Be Active Pass and apply the recreation credit during online or staff-assisted registration\nWhat you need:\n  - Completed FAIR Play application\n  - Proof of Burnaby residence\n  - Income, assistance, child-disability, refugee or agency-referral documentation for the chosen route\nPractical tips:\n  - Burnaby Community Services can help with translation, documents and the application\n  - Credit expires after one year and cannot be paid out as cash\n  - During online registration, check that the recreation-credit box is applied to the balance\nHow long it takes (verified — you may state this): Apply once per year; ask the City for current processing time"
  },
  "richmond-rec-fee-subsidy": {
    "name": "Recreation Fee Subsidy Program (RFSP)",
    "keys": [
      "richmond-rec-fee-subsidy",
      "richmond rec fee subsidy",
      "rfsp",
      "recreation fee subsidy program"
    ],
    "text": "What it is: Participants get unlimited free admission to many drop-in services and a [percentage — see the guide] discount on most registered City and participating community programs, subject to the annual registered-program subsidy cap.\nHow to apply:\n  1. Download the application for the current program year and review the two financial-hardship qualification methods\n  2. Complete one application per family or couple and attach the documents for the selected method\n  3. Submit by email, mail or at a Richmond recreation facility, Cultural Centre or City Hall\n  4. If help is needed, book an in-person support appointment at City Hall\n  5. Keep the approval letter and use the subsidy when registering for eligible activities\nWhat you need:\n  - Completed current-year application\n  - Proof of Richmond residence\n  - Government-assistance confirmation or current income and financial-hardship documents required by the form\nPractical tips:\n  - Use the application for the correct program year\n  - In-person application help is by appointment, not drop-in\n  - Ask before registering whether a program counts toward the annual discounted-program cap\nHow long it takes (verified — you may state this): Current 2026–2027 applications cover September 1, 2026 to August 31, 2027\nPhone (this exact number is verified — you may give it): 604-247-4909"
  },
  "victoria-life": {
    "name": "L.I.F.E. Program (Leisure Involvement For Everyone)",
    "keys": [
      "victoria-life",
      "victoria life",
      "leisure involvement for everyone",
      "l.i.f.e. program"
    ],
    "text": "What it is: The two-year membership combines local unlimited drop-ins, a regional 52-visit benefit and a one-time registered-program credit. The City also accepts an adjudicator route when standard documents cannot reasonably be provided.\nHow to apply:\n  1. Complete one L.I.F.E. application for family members living at the same address\n  2. Gather current proof of City of Victoria residence and income documents for household adults\n  3. If documents are unavailable, ask an eligible professional who knows the household situation to complete the adjudicator section\n  4. Submit through the method on the current City form\n  5. After approval, obtain the regional visit sticker each calendar year and use the program credit before the two-year term ends\nWhat you need:\n  - Completed L.I.F.E. application\n  - Utility bill, phone bill or rental agreement from the last three months\n  - Most recent CRA Notice of Assessment for household members over 19, or completed adjudicator verification\nPractical tips:\n  - The [amount — see the guide] or [amount — see the guide] program credit is for the whole two-year term, not each year\n  - The regional 52-visit sticker must be renewed each calendar year\n  - Ask staff which benefit option is better before choosing the discounted regional annual pass\nHow long it takes (verified — you may state this): Membership lasts two years from approval"
  },
  "saanich-life": {
    "name": "L.I.F.E. Program (Leisure Involvement For Everyone)",
    "keys": [
      "saanich-life",
      "saanich life",
      "leisure involvement for everyone",
      "l.i.f.e. program"
    ],
    "text": "What it is: Saanich's two-year L.I.F.E. approval includes local drop-ins, regional visits and an age-based one-time program grant. Current applications can be completed through the City's secure online form.\nHow to apply:\n  1. Gather one current proof of Saanich residence for the household\n  2. Get the current CRA Proof of Income Statement for every household member age 19 or older\n  3. Complete the secure online L.I.F.E. application and upload the documents\n  4. If income shown is under [amount — see the guide] or the household has a special situation, contact the financial-assistance office directly\n  5. Allow time after approval for the program grant to appear before registering\nWhat you need:\n  - Utility or phone bill from the last three months, signed rental agreement, driver's licence or BC identification\n  - Current CRA Proof of Income Statement for every household member 19 or older\n  - Recent landing papers instead of income statements for eligible newcomers within one year of arrival\nPractical tips:\n  - Saanich accepts CRA Proof of Income Statements, not Notices of Assessment\n  - The initial grant is for the whole two-year approval\n  - Allow at least five days after approval before trying to spend the grant\nHow long it takes (verified — you may state this): Grant setup can take up to five days after approval"
  },
  "kelowna-recreation-assistance": {
    "name": "Financial Assistance for Recreation (KFAP)",
    "keys": [
      "kelowna-recreation-assistance",
      "kelowna recreation assistance",
      "kfap",
      "financial assistance for recreation"
    ],
    "text": "What it is: Kelowna assesses combined household income from all sources and places an approved credit on the recreation account for passes or City programs.\nHow to apply:\n  1. Email the Access to Recreation Department to request the current application process\n  2. Gather proof of a Kelowna address from the last three months\n  3. Get a CRA Income Statement (Option C print, not Notice of Assessment) for each household member who contributes income or expenses\n  4. Submit the completed application and all supporting documents\n  5. Wait for approval before buying a pass or program; approved credit can then be used during registration\nWhat you need:\n  - Recent utility, cable or internet bill, rental agreement, or government document showing a Kelowna address\n  - CRA Income Statement for contributing household members\n  - Government-assistance confirmation when using that qualifying route\n  - Citizenship or permanent-resident information requested by the form\nPractical tips:\n  - Previous purchases are not covered, so wait for approval\n  - All income sources count, including disability benefits and income outside Canada\n  - A clerk at Parkinson Recreation Centre can check whether processing is complete\nHow long it takes (verified — you may state this): Up to two weeks after all required information is received"
  },
  "coquitlam-far": {
    "name": "Financial Assistance for Recreation (FAR)",
    "keys": [
      "coquitlam-far",
      "coquitlam far",
      "far",
      "financial assistance for recreation"
    ],
    "text": "What it is: Each eligible family member receives 50 drop-in passes and a [amount — see the guide] credit. Income verification can use a CRA statement, government assistance, a red Compass Card or an approved adjudicator or agency signature.\nHow to apply:\n  1. Complete the online FAR form or download the paper application\n  2. Attach proof of Coquitlam residence dated within two months\n  3. Choose one accepted income-verification route and attach that evidence\n  4. Submit online, by email, mail or in a sealed envelope at Glen Pine Pavilion\n  5. After approval, use each family member's passes and credit in the recreation registration system\nWhat you need:\n  - Completed FAR application\n  - Recent Coquitlam bill or government-issued identification\n  - CRA Income Statement, assistance proof, red Compass Card proof, or adjudicator or agency section\nPractical tips:\n  - You may redact irrelevant licence, SIN and bank-account numbers while leaving name, address, date and income visible\n  - Use an Option C Income Statement, not a Notice of Assessment\n  - Each eligible family member gets a separate set of passes and credit\nHow long it takes (verified — you may state this): Ask Community Access and Support after submission\nPhone (this exact number is verified — you may give it): 604-927-6076"
  },
  "kamloops-arch": {
    "name": "ARCH (Affordable Recreation for Community Health)",
    "keys": [
      "kamloops-arch",
      "kamloops arch",
      "affordable recreation for community health"
    ],
    "text": "What it is: The annual ARCH application can also request KamPASS. A participating screening or referral agency reviews the application; City recreation facilities do not accept the application itself.\nHow to apply:\n  1. Download the current ARCH–KamPASS application or pick up a paper copy\n  2. Gather photo identification, a second piece of identification, proof of a Kamloops address and proof of income for each adult\n  3. Take the complete application to a participating ARCH public screening agency or, if you are a client, a listed referral agency\n  4. If approved, take the approval letter and photo identification to a listed City facility to activate ARCH credit\n  5. If also approved for KamPASS, purchase it at Kamloops Museum and Archives\nWhat you need:\n  - Photo identification and a second piece of identification\n  - Current utility bill or other accepted proof of Kamloops residence\n  - Ministry assistance confirmation, each adult's latest Notice of Assessment, or accepted disability or pension income evidence\nPractical tips:\n  - Applications are not accepted at City recreation facilities\n  - One form covers ARCH and KamPASS, but the programs have different eligibility exceptions\n  - Apply again each year and use the form for the current program year\nHow long it takes (verified — you may state this): Annual approval; ask the screening agency for current review time\nPhone (this exact number is verified — you may give it): 250-828-3582"
  }
};

export const BENEFIT_COUNT = 84;
