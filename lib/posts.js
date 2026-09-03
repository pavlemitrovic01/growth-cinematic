// Jedan izvor za Truckers Lounge clanke (N3). Isti obrazac kao lib/faq.js —
// sadrzaj je podatak, stranice (listing + [slug]) samo renderuju. Sledeci
// clanak se dodaje ovde, ne u JSX.
//
// `body` je niz tipizovanih blokova umesto slobodnog JSX-a, da renderer na
// obe rute (listing izvod = body[0], detalj = ceo niz) ostane glup i ne mora
// da zna nista o strukturi konkretnog clanka:
//   {type:'p', text}                       — pasus
//   {type:'subhead', text}                  — podnaslov (h2 na detalj-ruti —
//                                              h1 je naslov clanka, h3 bi
//                                              preskocio nivo, N3 recon)
//   {type:'callout', lead, text}            — istaknut okvir (.blog-callout)
//   {type:'source', text, links:[{label,url}]} — citat izvora (N4). Postoji zato
//                                              sto clanci smeju da nose javno
//                                              proverljive regulatorne cinjenice,
//                                              a tvrdnja bez izvora se po RULES §7
//                                              ne razlikuje od izmisljene.
//   {type:'cta', text, linkText, linkHref}  — CTA kutija na kraju
//
// ⚠️ Pravilo za sadrzaj (RULES §7 + BRIEF §5/§6): tvrdnje O GROWTH-u smeju doci
// samo iz vec odobrene kopije (lib/faq.js, docs/BRIEF.md). Regulatorne cinjenice
// smeju iz javnih FMCSA/eCFR izvora i MORAJU nositi `source` blok. Nista trece.
export const POSTS = [
  {
    slug: 'new-cdl-graduate-what-training-provided-actually-means',
    title: 'New CDL Graduate? Here Is What "Training Provided" Actually Means',
    tag: 'NEW CDL DRIVERS',
    date: '2026-08-22',
    dateDisplay: 'August 22, 2026',
    readTime: '6 min read',
    body: [
      {
        type: 'p',
        text: `A carrier saying "training provided" can sound like a complete answer when you are fresh out of CDL school. It is not. That phrase can sit next to two very different things: the federal training you need before certain CDL tests, and the employer-specific orientation or time with a trainer that may come after you are licensed. Before you accept a job, separate those two conversations and get the second one explained in plain language.`,
      },
      { type: 'subhead', text: 'First, know what ELDT actually covers' },
      {
        type: 'p',
        text: `The federal Entry-Level Driver Training rules set a baseline for drivers getting a Class A or Class B CDL for the first time, upgrading a Class B to a Class A, or getting a school bus (S), passenger (P), or hazardous materials (H) endorsement for the first time. If one of those situations applies, the required training has to come from a provider listed on FMCSA's Training Provider Registry.`,
      },
      {
        type: 'p',
        text: `For a first Class A or Class B CDL, applicable ELDT has to be complete before the skills test. Your provider submits the completion record electronically, and you can check it through the Training Provider Registry. FMCSA also says you must hold the commercial learner's permit for 14 days before you are eligible for the CDL skills test. Your state issues the license and may have requirements beyond the federal baseline, so its current CDL manual still matters.`,
      },
      { type: 'subhead', text: 'Endorsements do not all follow the same path' },
      {
        type: 'p',
        text: `The first-time ELDT rule specifically names H, P, and S. Hazardous materials requires theory training before the H knowledge test. Passenger and school bus endorsements require theory and behind-the-wheel training before their respective skills tests. FMCSA also lists doubles/triples (T), tank vehicle (N), and the tank-plus-hazmat combination (X) as endorsements with knowledge tests. The federal first-time ELDT trigger is H, P, or S, not T or N by themselves. Because X includes hazardous materials, confirm with your state how the H training requirement and X application are handled.`,
      },
      { type: 'subhead', text: 'Federal ELDT is based on proficiency, not a promised number of hours' },
      {
        type: 'p',
        text: `There is no federal minimum number of hours for the theory portion of ELDT. The provider has to cover the required topics, and the trainee has to earn an overall score of at least 80 percent on the theory assessment. FMCSA also does not set a federal minimum number of behind-the-wheel hours for the Class A, Class B, P, or S curricula. The instructor has to assess the trainee as proficient in the required range and public-road elements.`,
      },
      {
        type: 'p',
        text: `That does not mean every program can be reduced to the shortest possible clock. A state may impose stricter requirements, including a prescribed number of hours. It means a bare claim such as "we provide 40 hours" does not, by itself, tell you whether the program covers the right training, whether the provider can submit your record, or whether the carrier is describing ELDT at all.`,
      },
      { type: 'subhead', text: 'Then make the carrier define its own training' },
      {
        type: 'p',
        text: `The federal licensing rules above do not tell you what a particular employer includes after you have your CDL. They do not answer whether orientation is paid, whether you will drive with a trainer, how the carrier decides you are ready to run solo, or what happens if you need more time. Those are offer-specific questions, and "training provided" is too vague to answer any of them.`,
      },
      {
        type: 'p',
        text: `Ask for the sequence: What happens on day one? Is there classroom, yard, simulator, or road time? Who evaluates you, and what standard releases you to solo driving? Ask for the money: Which parts are paid, at what rate, and who covers travel, lodging, meals, testing, or equipment? Ask for the commitment: Is there a written employment or tuition-repayment agreement, and what do you owe if the job or program ends early?`,
      },
      {
        type: 'p',
        text: `Finally, connect the training to the actual job. Confirm the equipment you will train on, the position and operating area you are being hired for, and whether the home-time plan discussed for the role begins during training or only after you are released to solo. The useful answer is not simply "yes, we train new drivers." It is a sequence, a pay explanation, a release standard, and a clear description of the job waiting at the end.`,
      },
      { type: 'subhead', text: 'What to tell GROWTH before we match you' },
      {
        type: 'p',
        text: `Tell us where you are in the process, including the endorsements you already have and the ones you are working on. We will only put you in front of carriers that take drivers at your experience level, and we will tell you up front what training they actually provide. If a carrier is not a fit for where you are right now, you will hear that from us before you spend time on its paperwork.`,
      },
      {
        type: 'callout',
        lead: 'Verify the license requirements yourself.',
        text: `This article explains the federal baseline, not every state rule or every driver's situation. Use FMCSA's current guidance, search the Training Provider Registry, and read the CDL manual for the state issuing your license before you schedule training or testing.`,
      },
      {
        type: 'source',
        text: 'Federal requirements described above come from:',
        links: [
          { label: 'FMCSA - Entry-Level Driver Training', url: 'https://www.fmcsa.dot.gov/registration/commercial-drivers-license/entry-level-driver-training-eldt' },
          { label: 'FMCSA - Drivers: endorsements and restrictions', url: 'https://www.fmcsa.dot.gov/registration/commercial-drivers-license/drivers' },
          { label: 'FMCSA - How do I get a CDL?', url: 'https://www.fmcsa.dot.gov/registration/commercial-drivers-license/how-do-i-get-commercial-drivers-license' },
          { label: 'FMCSA Training Provider Registry - training requirements FAQ', url: 'https://tpr.fmcsa.dot.gov/FAQ/Topics/drivers%2Ctraining-requirements' },
        ],
      },
      {
        type: 'cta',
        text: 'New CDL graduate? Tell us where you are in the process and what endorsements you have or are working on.',
        linkText: 'See your options',
        linkHref: '/apply',
      },
    ],
  },
  {
    slug: 'sap-and-violations-how-the-return-to-duty-process-works',
    title: 'SAP or Violations on Your Record? Here Is How the Process Actually Works',
    tag: 'KNOW YOUR RIGHTS',
    date: '2026-08-17',
    dateDisplay: 'August 17, 2026',
    readTime: '5 min read',
    body: [
      {
        type: 'p',
        text: `If you have violations on your record, or you have been through a SAP program, the honest answer is that the door is not closed. But the process is a lot more specific than most recruiters will tell you before they have your phone number. Here is what it actually involves, start to finish, and the two places drivers get blindsided.`,
      },
      { type: 'subhead', text: 'The return-to-duty process, step by step' },
      {
        type: 'p',
        text: `A drug or alcohol program violation puts you in "prohibited" status. Until you complete the federal return-to-duty process, you cannot perform safety-sensitive functions - which means you cannot drive a commercial vehicle for any DOT-regulated employer. The process is defined in 49 CFR Part 40, and it works the same way no matter which carrier you end up with.`,
      },
      {
        type: 'p',
        text: `First, you pick your SAP. Your employer has to give you a list of qualified substance abuse professionals, but the choice is yours - you are not assigned one. The SAP evaluates you and prescribes education, treatment, or both.`,
      },
      {
        type: 'p',
        text: `Second, you complete what the SAP prescribed and the SAP re-evaluates you. Only after the SAP signs off can you take a return-to-duty test. That test has to come back verified negative for drugs, or under 0.02 for alcohol.`,
      },
      {
        type: 'p',
        text: `Third, the SAP writes a follow-up testing plan, and this is the part that surprises people. The minimum is six unannounced tests in your first twelve months back behind the wheel. The SAP alone decides how many more after that, how often, and whether they test for drugs, alcohol, or both. The plan can run anywhere from one to five years. A SAP can end it early once the first year is behind you, but nobody can shrink that first-year minimum of six.`,
      },
      {
        type: 'p',
        text: `Finally, your Clearinghouse status has to change to "not prohibited" before your state licensing agency will reinstate your commercial driving privileges.`,
      },
      { type: 'subhead', text: 'Two things nobody mentions until it is too late' },
      {
        type: 'p',
        text: `Who pays is not settled by the regulation. Part 40 leaves payment for SAP evaluations and services to be worked out between employer and employee - it can fall under a labor agreement or health benefits, or it can land entirely on you. Ask before you start the process, not after you get the bill.`,
      },
      {
        type: 'p',
        text: `And finishing the process does not obligate anyone to put you back in a truck. An employer must not return you to safety-sensitive duty until you have met every condition - but meeting them does not mean any employer has to take you. That stays a personnel decision, and it stays theirs to make. Which is exactly why it matters which carriers you spend your applications on.`,
      },
      { type: 'subhead', text: 'What this means when you are job hunting' },
      {
        type: 'p',
        text: `We have carriers who hire drivers with violations on their record, and carriers who take drivers who have completed a SAP program. What matters is that you tell us up front. If we know what is on your record from the first call, we can point you at the carriers who are able to work with it, instead of costing you a week on applications that were never going to clear.`,
      },
      {
        type: 'callout',
        lead: 'Check this yourself, do not take our word for it.',
        text: `Rules change, and your situation may have specifics this article does not cover. Confirm the details with your own SAP and with FMCSA directly before you make decisions based on them. We are recruiters, not compliance advisors - and we would rather say that plainly than let you assume otherwise.`,
      },
      {
        type: 'source',
        text: 'Federal requirements described above come from:',
        links: [
          { label: 'FMCSA - Return-to-Duty', url: 'https://www.fmcsa.dot.gov/regulations/drug-alcohol-testing/return-duty' },
          { label: '49 CFR Part 40, Subpart O', url: 'https://www.ecfr.gov/current/title-49/subtitle-A/part-40/subpart-O' },
          { label: 'FMCSA Drug & Alcohol Clearinghouse', url: 'https://clearinghouse.fmcsa.dot.gov/' },
        ],
      },
      {
        type: 'cta',
        text: 'Got something on your record? Tell us up front and we will only send you where it can work.',
        linkText: 'Apply now',
        linkHref: '/apply',
      },
    ],
  },
  {
    slug: 'how-to-spot-hidden-costs-before-signing-a-contract',
    title: 'How to Spot Hidden Costs Before Signing a Contract',
    tag: 'TIPS & TRICKS',
    date: '2026-07-30',
    dateDisplay: 'July 30, 2026',
    readTime: '4 min read',
    body: [
      {
        type: 'p',
        text: `Every driver has experienced a "bait and switch" at least once in their career. A recruiter promises you 80 CPM and the newest truck model, but when you arrive at orientation, you find out that the 80 CPM is only achievable after hitting unrealistic safety, fuel, and mileage bonuses.`,
      },
      {
        type: 'p',
        text: `In the trucking industry, if it isn't in writing - it doesn't exist. Many mega carriers advertise impressive "gross" numbers, but hide operational deductions in the fine print. That's why we decided to bust these myths and show you exactly what to look out for.`,
      },
      { type: 'subhead', text: '1. Escrow and Maintenance Deductions' },
      {
        type: 'p',
        text: `This is a classic trap for Lease Purchase drivers, but it often sneaks up on Company drivers too. Always ask what the weekly escrow limit is and what exactly it covers. Don't let them take 15% out of every load under the guise of a "reserve fund" that you'll never see again.`,
      },
      { type: 'subhead', text: '2. Forced Dispatch and Deadhead Miles' },
      {
        type: 'p',
        text: `"We pay for all miles!" sounds great, right? But what happens when dispatch sends you on a 300-mile deadhead? Many carriers don't pay empty miles the same rate as loaded miles. A real recruiter will always give you the exact ratio of loaded vs. empty miles and their true rate.`,
      },
      {
        type: 'callout',
        lead: 'How do we do it at GROWTH?',
        text: `Before we even connect you with a carrier, we demand their pay structure in writing. If a carrier has hidden "processing" fees - we don't work with them. Our job is to make sure you get exactly what you agreed to.`,
      },
      {
        type: 'cta',
        text: 'Like what you read? We can find you a carrier that plays fair.',
        linkText: 'Apply now',
        linkHref: '/apply',
      },
    ],
  },
];

export function getPostBySlug(slug) {
  return POSTS.find((post) => post.slug === slug);
}

export function allPostSlugs() {
  return POSTS.map((post) => post.slug);
}
