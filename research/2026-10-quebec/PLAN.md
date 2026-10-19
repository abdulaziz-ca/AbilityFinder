# Québec — status (2026-10-18)

**Live** (`?v=226`): 39 provincial programs and 10 city programs, **written in French** from each official
French page (`snapshots/`, `city-snapshots/`) and checked by a separate French-language reviewer
(`QC-BRIEF.md` / `QC-REVIEW-BRIEF.md` in the scratchpad pipeline). Research: `qc-A.json` (income, family,
tax), `qc-B.json` (health, aids, home care), `qc-C.json` (housing, transport, legal), `qc-D.json` (cities),
`qc-E.json` (quebec.ca disability-program master list used for the completeness check), `qc-spec.json`.

**How French works:** each Québec record has `lang: "fr"`. In the app, record text carries `lang="fr"`
when the interface is English (`recAttr`/`recLang` in `public/app.js`), the "content is in English" note is
skipped for French records, and Québec route gates carry `lang: "fr"` so requirement items are marked too.
Static guides for French records are fully French (`GUIDE_LABELS.fr` in `scripts/gen-guide-pages.js`,
`<html lang="fr-CA">`). `PROVINCE_NOTICES.QC` (English and French) explains this and the blocked sites.
The English Flesch–Kincaid ratchet skips French records; length, one-sentence and repeat rules apply.

**Provincial:** solidarité sociale · aide sociale · revenu de base · objectif emploi · Réussir · Allocation
famille · Supplément pour enfant handicapé · SEHNSE · rente d'invalidité (RRQ) · soutien aux familles ·
aides auditives · aides visuelles · appareils suppléant à une déficience physique · aides à l'élimination ·
chien d'assistance · aides à la vie quotidienne · triporteurs et quadriporteurs · ambulateurs · tricycles
et vélos adaptés · chaussures orthétiques · aides à la communication (PMATCOM) · Transport-Hébergement ·
services aux personnes ayant une déficience · soutien à domicile (AAD) · adaptation de domicile (PAD) ·
supplément au loyer · HLM · Allocation-logement · vignette de stationnement · adaptation de véhicule ·
Carte d'accompagnement loisir · carte d'accompagnement en autocar · assurance médicaments · prestations
spéciales · besoins particuliers (adultes, jeunes) · prêts et bourses (déficience fonctionnelle majeure) ·
Agir tôt · soutien aux artistes en situation de handicap.

**Cities:** transport adapté in Montréal, Laval, Longueuil/Brossard, Terrebonne (exo), Gatineau, Sherbrooke
and Trois-Rivières · ÉquiMobilité (Ville de Québec) · ÉCHO (Gatineau) · tarification sociale
(Trois-Rivières).

Help sections: OPHQ, aide juridique, Éducaloi, 211, AQRIPH; SQDI, Fédération québécoise de l'autisme,
Moelle épinière et motricité Québec, Kéroul, RAAQ, AQLPH, AQEPA. Gaps: `GAPS.md` (Revenu Québec tax
credits and RAMQ pages blocked — not bypassed).
