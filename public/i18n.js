/* =============================================================================
   i18n — English + French (Canada). t(key) with English fallback.
   Benefit CATALOG text (names, amounts, guides) stays in official English for
   now; the whole INTERFACE is translated. Language is remembered across visits.
   ========================================================================== */
let LANG = "en";
const LANGS = [{ code: "en", label: "EN", name: "English" }, { code: "fr", label: "FR", name: "Français" }];

const I18N = {
  en: {
    "nav.tag": "Canada",
    "benefitsEnglishNote": "",

    "land.eyebrow": "Alberta + federal benefits",
    "land.title": "Every benefit you're owed, found in one minute.",
    "land.sub": "Government support for your disability is real money — but it's scattered across dozens of confusing pages. AbilityFinder asks a few simple questions and hands you the exact list you qualify for, with plain-language guides and direct links to apply.",
    "land.find": "Find my benefits",
    "land.how": "See how it works",
    "pv.found": "benefits found",
    "pv.qualify": "You qualify",
    "pv.dtc": "Disability Tax Credit",
    "pv.rdsp": "Savings plan (RDSP)",
    "pv.transit": "Low-income transit pass",
    "pv.cdb": "Canada Disability Benefit",
    "pv.needsDtc": "needs the DTC first",
    "aside.title": "Why we ask",
    "aside.1": "<b>Only what matters.</b> A few quick questions decide which programs fit you.",
    "aside.2": "<b>Stored only on this device.</b> Your answers live in this browser.",
    "aside.3": "<b>No wrong answers.</b> We'll show what you're missing and how to get it.",
    // "your answers" not "everything": assistant and feedback text can be sent
    // through their separate opt-in actions.
    "trust.private": "Private — your answers stay in your browser",
    "trust.free": "Free, no account",
    "trust.official": "Links to official sources",

    "prob.title": "Searching “what benefits can I get?” doesn't work.",
    "prob.badH": "The usual way",
    "prob.bad1": "You Google your disability and get 40 tabs of policy pages.",
    "prob.bad2": "Every program hides its rules behind walls of text.",
    "prob.bad3": "You never actually find out what <b>you</b> qualify for.",
    "prob.bad4": "Half the benefits you're entitled to, you never hear about.",
    "prob.goodH": "With AbilityFinder",
    "prob.good1": "Answer a few checkboxes — no reading required.",
    "prob.good2": "Get a personal list of what you qualify for, sorted by ease.",
    "prob.good3": "Each one comes with a plain-English “how to apply” guide.",
    "prob.good4": "We tell you what you're missing and how to unlock it.",

    "how.title": "How it works",
    "how.1h": "Answer a few questions",
    "how.1p": "Your disability, age, income and situation. Takes about a minute. Saved on this device, not sent to us.",
    "how.2h": "See what you qualify for",
    "how.2p": "A tailored list of money, discounts and supports — with what's ready now and what's one step away.",
    "how.3h": "Apply with confidence",
    "how.3p": "Open a clear guide for each benefit: what it is, what to bring, tips to skip the runaround, then a direct link.",

    "cats.title": "What you could find",
    "cat.money": "Money & tax credits",
    "cat.health": "Health & equipment",
    "cat.education": "Education grants",
    "cat.employment": "Employment supports",
    "cat.transit": "Transit & recreation",
    "cat.family": "Family supports",
    "cats.note": "Covering federal, provincial, and local programs — for ADHD, autism, mental health, physical & chronic conditions, vision, hearing, learning disabilities and more.",

    "final.title": "Ready to see your list?",
    "final.sub": "It's free, private, and takes about a minute.",

    "fb.label": "Help shape AbilityFinder",
    "fb.title": "Got an idea, or found something broken?",
    "fb.lead": "Missing a benefit? Broken link? A feature you'd love? Tell us — this tool gets better because of people like you.",
    "fb.typeLabel": "What's this about?",
    "fb.tFeature": "A feature I'd like",
    "fb.tBug": "A bug or broken link",
    "fb.tMissing": "A benefit that's missing",
    "fb.tOther": "Something else",
    "fb.emailLabel": "Your email",
    "fb.optional": "(optional)",
    "fb.msgLabel": "Your message",
    "fb.placeholder": "Tell us what's on your mind…",
    "fb.send": "Send feedback",
    "fb.note": "Send feedback sends this form to AbilityFinder through our server and emails it to our inbox. The email-app option does not submit it through this site.",
    "fb.needMsg": "Please add a short message first.",
    "fb.thanks": "Thanks! Your email app should open. If it doesn't, email us at ",

    "disclaimer": "AbilityFinder is a free helper tool, not legal, medical, or financial advice. Benefit rules and amounts change — always confirm on the official government page (linked in each guide) before applying. Amounts shown are 2025–2026 figures. Your answers stay in your browser and are never saved or sent anywhere.",

    "wiz.step": "Step", "wiz.of": "of",
    "wiz.back": "Back", "wiz.exit": "Exit", "wiz.next": "Next", "wiz.continue": "Continue",
    "wiz.done": "Done", "wiz.cancel": "Cancel",
    "res.yourAnswers": "Your answers · tap any to change",
    "finder.title": "Find help near you",
    "finder.lead": "This benefit needs a medical practitioner to complete a form. If you don't have one, search for the right kind near you.",
    "finder.postalPh": "Postal code (e.g. T2P 1A1)",
    "finder.useLoc": "Use my location",
    "finder.find": "Find a",
    "finder.familyDoc": "family doctor",
    "finder.note": "Opens Google Maps in a new tab. Add your postal code or use your location for closer results.",
    "finder.locating": "Getting your location…",
    "finder.located": "Using your location ✓ — the buttons now search nearby.",
    "finder.locFail": "Couldn't get your location — enter a postal code instead.",
    "finder.locUnsupported": "Your browser can't share location — enter a postal code instead.",
    "finder.locBlocked": "Location is blocked. Allow it for this site (and turn on Location Services in your system settings), or just enter a postal code.",
    "finder.locTimeout": "Location timed out — try again, or enter a postal code.",

    "res.headline": "benefits you may be able to get",
    "res.headline1": "benefit you may be able to get",
    "res.print": "Print my action plan",
    "res.applied": "marked as applied",
    "grp.ready": "Ready to apply",
    "grp.almost": "One step away",
    "grp.supports": "Supports & strategies for you",
    "supports.heading": "Things you can use this week",
    "supports.sub": "Benefits take weeks. These don't — no forms, no doctor's note, no waiting.",
    "supports.resource": "Recommended resource",
    "nm.summary": "Not a match right now",
    "nm.tap": "tap to see why",
    "nm.default": "Doesn't match your answers.",
    "apply.how": "How to apply",
    "apply.unlock": "See how to unlock it",
    "mark.applied": "Mark as applied",
    "mark.done": "Applied",
    "restart": "Start over",

    "det.back": "Back to my results",
    "det.eligible": "Based on your answers, you look eligible for this.",
    "det.almostH": "One step away.",
    "det.almostSub": "To unlock this you still need:",
    "guide.how": "How to apply",
    "guide.need": "What you'll need",
    "guide.tips": "Tips to skip the runaround",
    "meta.time": "How long",
    "meta.contact": "Contact",
    "det.official": "official info page",
    "det.foot": "Opens the official government page in a new tab, so you won't lose your place here. Always confirm current details there before applying.",
    "det.enNote": "Benefit guides are provided in English.",

    "a11y.title": "Accessibility",
    "a11y.read": "Read this page aloud",
    "a11y.stop": "Stop reading",
    "a11y.size": "Text size",
    "a11y.spacing": "Readable spacing",
    "a11y.contrast": "High contrast",
    "a11y.links": "Highlight links",
    "a11y.guide": "Reading guide",
    "a11y.motion": "Reduce motion",
    "a11y.reset": "Reset accessibility",
  },

  fr: {
    "nav.tag": "Canada",
    "benefitsEnglishNote": "",

    "land.eyebrow": "Alberta · C.-B. · Ontario · Québec",
    "land.title": "Toutes les prestations qui vous reviennent, trouvées en une minute.",
    "land.sub": "Le soutien gouvernemental lié à votre handicap représente de l'argent réel — mais il est éparpillé sur des dizaines de pages déroutantes. AbilityFinder pose quelques questions simples et vous remet la liste exacte à laquelle vous êtes admissible, avec des guides en langage clair et des liens directs pour faire une demande.",
    "land.find": "Trouver mes prestations",
    "land.how": "Voir comment ça marche",
    "pv.found": "prestations trouvées",
    "pv.qualify": "Vous êtes admissible",
    "pv.dtc": "Crédit d'impôt (CIPH)",
    "pv.rdsp": "Régime d'épargne (REEI)",
    "pv.transit": "Passe de transport à faible revenu",
    "pv.cdb": "Prestation canadienne pour personnes handicapées",
    "pv.needsDtc": "nécessite d'abord le CIPH",
    "aside.title": "Pourquoi ces questions",
    "aside.1": "<b>Seulement l'essentiel.</b> Quelques questions déterminent les programmes qui vous conviennent.",
    "aside.2": "<b>Enregistré seulement sur cet appareil.</b> Vos réponses restent dans ce navigateur.",
    "aside.3": "<b>Aucune mauvaise réponse.</b> On vous montre ce qui manque et comment l'obtenir.",
    "trust.private": "Privé — vos réponses restent dans votre navigateur",
    "trust.free": "Gratuit, sans compte",
    "trust.official": "Liens vers les sources officielles",

    "prob.title": "Chercher « quelles prestations puis-je obtenir ? » ne fonctionne pas.",
    "prob.badH": "La méthode habituelle",
    "prob.bad1": "Vous cherchez votre handicap sur Google et obtenez 40 onglets de pages de politiques.",
    "prob.bad2": "Chaque programme cache ses règles derrière des murs de texte.",
    "prob.bad3": "Vous ne découvrez jamais vraiment ce à quoi <b>vous</b> êtes admissible.",
    "prob.bad4": "La moitié des prestations auxquelles vous avez droit, vous n'en entendez jamais parler.",
    "prob.goodH": "Avec AbilityFinder",
    "prob.good1": "Cochez quelques cases — aucune lecture requise.",
    "prob.good2": "Obtenez une liste personnelle, triée du plus simple au plus complexe.",
    "prob.good3": "Chacune vient avec un guide « comment faire la demande » en langage clair.",
    "prob.good4": "On vous dit ce qui manque et comment y accéder.",

    "how.title": "Comment ça marche",
    "how.1h": "Répondez à quelques questions",
    "how.1p": "Votre handicap, âge, revenu et situation. Environ une minute. Enregistré sur cet appareil, non envoyé à AbilityFinder.",
    "how.2h": "Voyez à quoi vous êtes admissible",
    "how.2p": "Une liste personnalisée d'argent, de rabais et de soutiens — ce qui est prêt et ce qui est à une étape près.",
    "how.3h": "Faites votre demande en confiance",
    "how.3p": "Ouvrez un guide clair pour chaque prestation : ce que c'est, quoi apporter, des astuces, puis un lien direct.",

    "cats.title": "Ce que vous pourriez trouver",
    "cat.money": "Argent et crédits d'impôt",
    "cat.health": "Santé et équipement",
    "cat.education": "Bourses d'études",
    "cat.employment": "Soutiens à l'emploi",
    "cat.transit": "Transport et loisirs",
    "cat.family": "Soutiens à la famille",
    "cats.note": "Programmes fédéraux, albertains et municipaux — pour le TDAH, l'autisme, la santé mentale, les conditions physiques et chroniques, la vision, l'audition, les troubles d'apprentissage et plus.",

    "final.title": "Prêt à voir votre liste ?",
    "final.sub": "C'est gratuit, privé, et ça prend environ une minute.",

    "fb.label": "Aidez à améliorer AbilityFinder",
    "fb.title": "Une idée, ou quelque chose de brisé ?",
    "fb.lead": "Une prestation manquante ? Un lien brisé ? Une fonction souhaitée ? Dites-le-nous — cet outil s'améliore grâce à des gens comme vous.",
    "fb.typeLabel": "De quoi s'agit-il ?",
    "fb.tFeature": "Une fonction souhaitée",
    "fb.tBug": "Un bogue ou un lien brisé",
    "fb.tMissing": "Une prestation manquante",
    "fb.tOther": "Autre chose",
    "fb.emailLabel": "Votre courriel",
    "fb.optional": "(facultatif)",
    "fb.msgLabel": "Votre message",
    "fb.placeholder": "Dites-nous ce que vous pensez…",
    "fb.send": "Envoyer",
    "fb.note": "Envoyer envoie ce formulaire à AbilityFinder par notre serveur et à notre boîte courriel. L'option d'application de courriel ne le soumet pas par ce site.",
    "fb.needMsg": "Veuillez d'abord ajouter un court message.",
    "fb.thanks": "Merci ! Votre application de courriel devrait s'ouvrir. Sinon, écrivez-nous à ",

    "disclaimer": "AbilityFinder est un outil d'aide gratuit, et non un conseil juridique, médical ou financier. Les règles et montants changent — confirmez toujours sur la page gouvernementale officielle (liée dans chaque guide) avant de faire une demande. Les montants indiqués sont ceux de 2025–2026. Vos réponses restent dans votre navigateur et ne sont jamais enregistrées ni envoyées.",

    "wiz.step": "Étape", "wiz.of": "sur",
    "wiz.back": "Retour", "wiz.exit": "Quitter", "wiz.next": "Suivant", "wiz.continue": "Continuer",
    "wiz.done": "Terminé", "wiz.cancel": "Annuler",
    "res.yourAnswers": "Vos réponses · touchez pour modifier",
    "finder.title": "Trouver de l'aide près de chez vous",
    "finder.lead": "Cette prestation nécessite qu'un professionnel de la santé remplisse un formulaire. Si vous n'en avez pas, cherchez le bon type près de chez vous.",
    "finder.postalPh": "Code postal (ex. H2X 1Y4)",
    "finder.useLoc": "Utiliser ma position",
    "finder.find": "Trouver un",
    "finder.familyDoc": "médecin de famille",
    "finder.note": "Ouvre Google Maps dans un nouvel onglet. Ajoutez votre code postal ou utilisez votre position pour des résultats plus proches.",
    "finder.locating": "Localisation en cours…",
    "finder.located": "Position utilisée ✓ — les boutons cherchent maintenant à proximité.",
    "finder.locFail": "Impossible d'obtenir votre position — entrez un code postal.",
    "finder.locUnsupported": "Votre navigateur ne peut pas partager la position — entrez un code postal.",
    "finder.locBlocked": "La localisation est bloquée. Autorisez-la pour ce site (et activez les services de localisation dans vos réglages), ou entrez un code postal.",
    "finder.locTimeout": "Délai de localisation dépassé — réessayez ou entrez un code postal.",

    "res.headline": "prestations que vous pourriez obtenir",
    "res.headline1": "prestation que vous pourriez obtenir",
    "res.print": "Imprimer mon plan d’action",
    "res.applied": "marquées comme demandées",
    "grp.ready": "Prêt à demander",
    "grp.almost": "À une étape près",
    "grp.supports": "Soutiens et stratégies pour vous",
    "nm.summary": "Pas admissible pour l'instant",
    "nm.tap": "touchez pour voir pourquoi",
    "nm.default": "Ne correspond pas à vos réponses.",
    "apply.how": "Comment faire la demande",
    "apply.unlock": "Voir comment y accéder",
    "mark.applied": "Marquer comme demandé",
    "mark.done": "Demandé",
    "restart": "Recommencer",

    "det.back": "Retour à mes résultats",
    "det.eligible": "D'après vos réponses, vous semblez y être admissible.",
    "det.almostH": "À une étape près.",
    "det.almostSub": "Pour y accéder, il vous faut encore :",
    "guide.how": "Comment faire la demande",
    "guide.need": "Ce dont vous aurez besoin",
    "guide.tips": "Astuces pour éviter les complications",
    "meta.time": "Délai",
    "meta.contact": "Contact",
    "det.official": "page d'information officielle",
    "det.foot": "Ouvre la page gouvernementale officielle dans un nouvel onglet, pour ne pas perdre votre place ici. Confirmez toujours les détails à jour avant de faire une demande.",
    "det.enNote": "Les guides des prestations sont fournis en anglais.",

    "a11y.title": "Accessibilité",
    "a11y.read": "Lire cette page à voix haute",
    "a11y.stop": "Arrêter la lecture",
    "a11y.size": "Taille du texte",
    "a11y.spacing": "Espacement lisible",
    "a11y.contrast": "Contraste élevé",
    "a11y.links": "Souligner les liens",
    "a11y.guide": "Guide de lecture",
    "a11y.motion": "Réduire les animations",
    "a11y.reset": "Réinitialiser l'accessibilité",
  },
};

/* wizard step content translations (English lives in STEPS; FR overrides here) */
const STEP_I18N = {
  fr: {
    forWho: { kicker: "Pour commencer", q: "Pour qui cherchons-nous des prestations ?", help: "Cela adapte tout à la bonne personne.",
      options: { self: "Moi-même", child: "Mon enfant" } },
    disabilities: { kicker: "Votre handicap", q: "Lesquels s'appliquent ?", help: "Cochez tout ce qui convient — plusieurs choix possibles. C'est privé et ne quitte jamais votre navigateur.",
      options: { adhd: "TDAH / attention", autism: "Spectre de l'autisme", learning: "Trouble d'apprentissage", intellectual: "Déficience intellectuelle / développementale", mental: "Santé mentale", physical: "Physique / mobilité", chronic: "Maladie chronique / douleur", vision: "Perte de vision / cécité", hearing: "Perte auditive / surdité", speech: "Parole / communication", braininjury: "Lésion cérébrale", other: "Autre chose / non listé" } },
    onset: { kicker: "Un peu plus", q: "Cela a-t-il commencé avant l'âge de 18 ans ?", help: "Certains programmes albertains (comme le PDD) visent les handicaps développementaux apparus dans l'enfance.",
      options: { true: "Oui, dans l'enfance", false: "Non, à l'âge adulte" } },
    mobilityQ: { kicker: "Un peu plus", q: "Pouvez-vous marcher confortablement environ 50 mètres ?", help: "Cela détermine si une vignette de stationnement accessible s'applique à vous.",
      options: { true: "Oui, généralement", false: "Non, c'est difficile ou impossible" } },
    age: { kicker: "À propos de vous", q: "Quel groupe d'âge s'applique ?", help: "L'âge détermine les programmes qui vous sont ouverts.",
      options: { child: "Moins de 18 ans", adult: "18 à 64 ans", senior: "65 ans ou plus" } },
    residency: { kicker: "À propos de vous", q: "Dans quelle province vivez-vous ?", help: "Les prestations fédérales s'appliquent partout ; les programmes provinciaux et municipaux dépendent de votre lieu de résidence. Nous couvrons l'AB, la C.-B., l'Ontario et le Québec en détail.",
      options: { AB: "Alberta", BC: "Colombie-Britannique", ON: "Ontario", QC: "Québec", other: "Une autre province ou un territoire" } },
    citizen: { kicker: "À propos de vous", q: "Êtes-vous citoyen canadien ou résident permanent ?", help: "La plupart des prestations l'exigent.",
      options: { true: "Oui", false: "Non / pas encore" } },
    dtc: { kicker: "La clé maîtresse", q: "Êtes-vous approuvé pour le crédit d'impôt pour personnes handicapées (CIPH) ?", help: "Le CIPH est l'élément numéro un qui débloque la plupart des prestations. Si vous ne l'avez pas, pas de souci — nous vous montrerons comment l'obtenir.",
      options: { yes: "Oui, je suis approuvé", no: "Non, pas encore", unsure: "Je ne sais pas ce que c'est" } },
    situation: { kicker: "Votre situation", q: "Qu'est-ce qui vous décrit le mieux en ce moment ?", help: "Cochez tout ce qui s'applique — cela débloque des soutiens au travail et aux études.",
      options: { student: "Aux études postsecondaires", working: "En emploi", looking: "À la recherche d'un emploi ou d'une formation", unableToWork: "Un handicap m'empêche de travailler", none: "Aucune de ces réponses" } },
    income: { kicker: "Votre ménage", q: "Environ, quel est le revenu de votre ménage ?", help: "Certaines prestations visent les faibles revenus. Une réponse approximative suffit — nous ne conservons ni n'envoyons rien.",
      options: { low: "Faible revenu", moderate: "Revenu moyen", high: "Revenu plus élevé" } },
    city: { kicker: "Votre communauté", q: "Dans quelle ville ou village vivez-vous ou près de quelle ville ?", help: "Débloque les rabais locaux de transport et de loisirs. Commencez à taper pour trouver la vôtre.", placeholder: "Choisissez votre ville ou village…" },
  },
};

function t(key) {
  const d = I18N[LANG];
  if (d && d[key] != null) return d[key];
  return (I18N.en[key] != null ? I18N.en[key] : key);
}

/* localized step accessor: returns {kicker,q,help,placeholder} */
function stepText(step) {
  const o = STEP_I18N[LANG] && STEP_I18N[LANG][step.id];
  // A step's q/help may be a function so it can address the right person —
  // "Can you walk 50m?" vs "Can your child walk 50m?" (see FOR_WHO in app.js).
  const r = (v) => (typeof v === "function" ? v() : v);
  return {
    kicker: r((o && o.kicker) || step.kicker),
    q: r((o && o.q) || step.q),
    help: r((o && o.help) || step.help),
    placeholder: r((o && o.placeholder) || step.placeholder),
  };
}
/* localized option label for a step option */
function optionText(step, o) {
  const t = STEP_I18N[LANG] && STEP_I18N[LANG][step.id];
  if (t && t.options) {
    const key = typeof o.value === "boolean" ? String(o.value) : o.value;
    if (t.options[key]) return t.options[key];
  }
  return o.label;
}
