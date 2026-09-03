// Jedan izvor za FAQ (S1). Naslovna i /faq su ranije drzali odvojene kopije istih
// pitanja — razlaz izmedju njih je bio mehanizam kojim se lazna tvrdnja ("We've
// placed plenty of drivers...") uvukla samo na /faq, ne i na naslovnu.
export const FAQ_ITEMS = [
  {
    id: 'pay',
    q: 'Do I really pay nothing?',
    a: "Correct — drivers never pay us a cent, at any point. Not to apply, not to talk to us, not when you get placed. Carriers pay us a flat placement fee, and only after you successfully start driving for them. It comes out of their pocket, never as a cut of your paycheck. No membership, no resume service, no upsell later. And we don't sell your information to marketers or lead brokers — your details go to a carrier only when it's for a match we're actively working on for you.",
  },
  {
    id: 'start',
    q: 'How fast can I start?',
    a: "Ready drivers can roll in as little as 3–5 days. The application takes about two minutes, and a real recruiter usually calls you back within 15–20 minutes during business hours — weekends included. After that it comes down to your paperwork: current medical card, clean drug screen, and whatever else the carrier needs on file. If any of that is expired or you're not sure where you stand, say so on the call. We help you work through it instead of leaving you to chase it down alone.",
  },
  {
    id: 'violations',
    q: 'What if I have violations or a SAP?',
    a: "We still want to talk. We have carriers who hire drivers with violations on their record, and carriers who take drivers who've completed a SAP program — that door isn't closed here. What matters is that you tell us up front. If we know what's on your record from the first call, we can point you at the carriers who are able to work with it, instead of costing you a week on applications that were never going to clear.",
  },
  {
    id: 'trucks',
    q: 'What kind of trucks and miles?',
    a: "Dry van, reefer, flatbed, step deck, tanker and more, across 20+ partner carriers. Which one you end up with depends less on what happens to be open this week and more on what you tell us you want — the miles you're after, the home time you need, and the equipment you actually like running. We'd rather put you somewhere you'll stay than fill a seat.",
  },
  {
    id: 'grads',
    q: 'Do you work with new CDL graduates?',
    a: "Yes — tell us where you are in the process, including any endorsements you have or are working on. We'll only put you in front of carriers that take drivers at your experience level, and we'll tell you up front what training they actually provide. If a carrier isn't a fit for where you are right now, you'll hear that from us straight, not after you've filled out their paperwork.",
  },
  {
    id: 'states',
    q: 'What states do you cover?',
    a: "All 48 continental US states — OTR, regional, local, dedicated. The right answer depends on where you live and how often you want to be home, not just on what's posted somewhere. Tell us your home base and the kind of run you're after, and we'll tell you honestly what our carriers have in that area.",
  },
  {
    id: 'different',
    q: 'How is GROWTH different from other recruiters?',
    a: "We're new, and we'd rather earn a reputation than claim one. So: no inflated pay numbers, no pressure, and your phone number doesn't get handed around. When you give us permission to call, that permission is for us — not for a list of other recruiters you never agreed to hear from. We stay reachable after you're placed, not just until the paperwork clears. And if the job turns out not to be what you were told it was, tell us and we go back to looking. The point is the right seat, not just a seat.",
  },
  {
    id: 'home-time',
    q: 'Can I choose my home time?',
    a: "Absolutely, and it's one of the first things we ask about. Home daily, home on weekends, or out for two to three weeks at a stretch — each one is a different set of carriers, and treating them as interchangeable is the fastest way to end up quitting a job you just started. Tell us what your life actually needs and we work from there, instead of showing you the biggest number and hoping it holds.",
  },
];

// Podskup za naslovnu — kratka verzija, ostatak na /faq.
const HOME_FAQ_IDS = ['pay', 'start', 'violations', 'trucks'];

export function homeFaqItems() {
  return FAQ_ITEMS.filter((item) => HOME_FAQ_IDS.includes(item.id));
}
