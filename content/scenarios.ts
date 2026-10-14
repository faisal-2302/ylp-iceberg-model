import type { Scenario } from "./types";

export const SCENARIOS: Scenario[] = [
  {
    slug: "team-is-disengaged",
    title: "My team is disengaged",
    group: "Trust and engagement",
    concepts: ["The Trust Battery", "Five Things Your Team Is Watching For"],
    answer: {
      going_on:
        "Disengagement is almost never a motivation problem. It is a Trust Battery problem that has been running down for weeks, and you are seeing it at the point where people have stopped spending effort they do not think will be noticed. Before you do anything motivational, work out which of the Five Things your team is watching for has gone quiet: Recognition, Feedback, Fairness, Follow-through, or Care.",
      not_first:
        "Do not call a team meeting about engagement. A group conversation about why people seem low puts everyone on the spot and gets you polite answers. Do not announce a new initiative either — a drained battery does not recharge with activity.",
      move: [
        "Take ten minutes alone with the five behaviours and your last month. Where did you go quiet? Be specific about dates and people.",
        "Pick the two people whose batteries you think are lowest. Not your best performer. The two who have gone quietest.",
        "Book 20 minutes with each, one at a time, this week. No agenda in the invite.",
      ],
      words: [
        "I've been thinking about the last few weeks and I don't think I've given you much of a read on where you stand. That's on me. Can I ask you something — what's one thing I've stopped doing that you'd want back?",
      ],
      words_note: "Then stop talking. The silence is the tool.",
      worked:
        "You will not see it in energy. You will see it in volunteering — someone offers to take something on without being asked. That is the battery charging.",
      deeper: [
        { label: "The Trust Battery", workbookPage: 11 },
        { label: "Five Things Your Team Is Watching For", workbookPage: 12 },
        { label: "What Drains the Battery" },
      ],
    },
    source: "Build brief §4.3 exemplar (Atomberg L&D). Concepts: YLP deck Act 2.2 slides 52–89; Workbook p.11–12.",
  },
  {
    slug: "two-team-members-fought",
    title: "Two of my team members have fought",
    group: "Conflict and fairness",
    concepts: ["Conflict Resolution", "SBI", "The Right Call"],
    answer: {
      going_on:
        "Two things are now live and they need separating. There is the incident, and there is what the rest of the team learns from how you handle it. The second one is bigger. Every person watching is calculating what would happen to them. This sits in Conflict Resolution, and the conversation itself runs on SBI.",
      not_first:
        "Do not get them in a room together on day one. Do not ask the team what happened. And do not decide who was right before you have heard both — once you have taken a side in your head, your questions stop being questions.",
      move: [
        "Separately, within 24 hours. Each one, alone, no audience.",
        "Ask each for the facts, not the verdict: what happened, when, what did you do, what did you want to happen.",
        "Only bring them together once each can say the other's version back to you without editorialising. If they cannot, you are not ready.",
      ],
      words: [
        "Opening each one-to-one: “I'm not here to work out who was right. I want to understand what happened, from your side, so we can get back to working together.”",
        "Bringing them together: “You've each told me your version. I want each of you to say back what you heard from the other — then we'll talk about what happens from here.”",
      ],
      worked:
        "Not when they apologise. When they are seen working together on something ordinary a week later, without you in the room.",
      watch_for:
        "If what happened involves harassment, discrimination, threat or anything physical, this stops being a conflict you manage. It is Mine to Flag — a zone of duty, not discretion. It goes to HR or the CoC Committee now, with full context.",
      deeper: [
        { label: "People Processes: Conflict Resolution", workbookPage: 20 },
        { label: "SBI", workbookPage: 17 },
        { label: "The Right Call", workbookPage: 37 },
      ],
    },
    source: "Build brief §4.3 exemplar (Atomberg L&D). Concepts: YLP deck Act 2.3–2.4, 4.2; Workbook p.17, 20, 37.",
  },
];

export const bySlug = (slug: string) => SCENARIOS.find((s) => s.slug === slug);
