// tiny defaults; expand as you wish
export type ChecklistItem = { id: string; text: string; done: boolean };

export const DEFAULT_CHECKLIST: Record<string, string[]> = {
  financial: [
    "List monthly fixed costs & due dates",
    "Call one creditor about hardship options",
    "Set up a 50/30/20 budget split",
  ],
  education: [
    "Write a 6-month learning goal",
    "Find 2 relevant courses",
    "Book a mentor/peer feedback chat",
  ],
  health: [
    "List current meds/treatments",
    "Schedule a GP/clinic check-in",
    "Track one metric (sleep/steps/pain)",
  ],
  emotional: [
    "Try 4-7-8 breathing (2 min)",
    "Text one trusted person",
    "Plan one small kindness for yourself",
  ],
  social: [
    "Prepare an ‘I-statement’ for a tough convo",
    "Schedule a cool-off + follow-up",
    "Join one recurring activity/group",
  ],
  environment: [
    "Note safe exits & contacts",
    "Pack a small go-bag",
    "Pick a family check-in point",
  ],
  moral: [
    "Write your top 5 values",
    "List options; pick least-harm next step",
    "Spend 5 minutes reflecting",
  ],
};
