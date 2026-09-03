// One source for the full FAQ, homepage subset and FAQ structured data.
export const FAQ_ITEMS = [
  {
    "id": "pay",
    "q": "Do I really pay nothing?",
    "a": "Drivers do not pay GROWTH to apply, speak with a recruiter or get placed. Carriers pay our placement fee; it is not taken from your paycheck. A carrier’s own pay structure and any job-related deductions are separate, and we discuss those with you before you decide."
  },
  {
    "id": "start",
    "q": "How fast can I start?",
    "a": "Ready drivers can start in as little as 3–5 days, but a start date is not guaranteed. A recruiter usually calls within 15–20 minutes during business hours. After that, timing depends on your documents, physical, drug test and the carrier’s onboarding requirements. Tell us what is ready and what you still need help with."
  },
  {
    "id": "violations",
    "q": "What if I have violations or a SAP?",
    "a": "Tell us about it up front. Some partner carriers consider drivers with violations or a completed SAP program, depending on the record and their requirements. A completed program does not guarantee a job. We discuss your situation and available options before you spend time on a carrier’s application."
  },
  {
    "id": "trucks",
    "q": "What kind of trucks and miles?",
    "a": "Our 20+ partner carriers cover equipment including dry van, reefer, flatbed, step deck and tanker. Actual openings, mileage and equipment depend on the carrier, location and your qualifications. Tell us your preferences so we can discuss the options that fit."
  },
  {
    "id": "grads",
    "q": "Do you work with new CDL graduates?",
    "a": "Yes. Tell us your current CDL status and which endorsements you have or are working on. We discuss carriers that consider your experience level and what their training involves. Availability and entry requirements vary by carrier."
  },
  {
    "id": "states",
    "q": "What states do you cover?",
    "a": "Our recruiting coverage includes the 48 contiguous US states. OTR, regional, local and dedicated options depend on your home base, qualifications and current carrier openings. Coverage does not mean every type of job is available in every area."
  },
  {
    "id": "different",
    "q": "How is GROWTH different from other recruiters?",
    "a": "GROWTH is a new agency built on its founder’s experience in CDL-A recruiting. We focus on explaining the full offer, including deductions, before you commit. You decide which options work for you, and you can reach us after placement too."
  },
  {
    "id": "home-time",
    "q": "Can I choose my home time?",
    "a": "Tell us the schedule you need: home daily, weekends or longer stretches out. We use that when looking at carrier options and explain the expected schedule before you decide. Home time depends on the specific role and available openings."
  }
];
const HOME_FAQ_IDS = ['pay', 'start', 'violations', 'trucks'];
export function homeFaqItems() { return FAQ_ITEMS.filter(item => HOME_FAQ_IDS.includes(item.id)); }
