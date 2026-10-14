/** Shape of the canon. Every string that reaches a manager must trace to `source`. */
export type Domain = "managing-self" | "managing-teams" | "driving-results" | "managing-organisation" | "careers";

export type Ref = {
  label: string;
  /** Concept route once it exists; undefined renders as a plain label. */
  href?: string;
  /** Printed workbook page (not PDF page). */
  workbookPage?: number;
};

export type Scenario = {
  slug: string;
  title: string;
  group: "Trust and engagement" | "Hard conversations" | "Conflict and fairness" | "Delegation and time" | "Careers and growth" | "Conduct";
  concepts: string[];
  /** Conduct scenarios route to Flag, not coaching. */
  flag?: boolean;
  /** §4.2 answer structure */
  answer: {
    going_on: string;
    not_first: string;
    move: [string, string, string];
    words: string[];
    /** Stage direction after the words, e.g. "Then stop talking." */
    words_note?: string;
    worked: string;
    watch_for?: string;
    deeper: Ref[];
  };
  source: string;
};
