import type { ReactNode } from "react";
import { BriefcaseIcon, ChatBubbleIcon, CodeIcon, FolderIcon, LayersIcon } from "./ComposerIcons";

export interface Category {
  id: string;
  label: string;
  icon: ReactNode;
  prompts: string[];
}

// Claude's "Write / Learn / Code / Life stuff" chips, retargeted at Dishant's portfolio.
export const CATEGORIES: Category[] = [
  {
    id: "about",
    label: "About",
    icon: <ChatBubbleIcon />,
    prompts: [
      "Who is Dishant Sharma?",
      "Summarize Dishant's career in three sentences",
      "Where did Dishant study?",
      "How can I contact Dishant?",
    ],
  },
  {
    id: "experience",
    label: "Experience",
    icon: <BriefcaseIcon />,
    prompts: [
      "Walk me through Dishant's professional experience",
      "What does Dishant do in his current role?",
      "What did Dishant work on at IIT Kanpur?",
      "What freelance work has Dishant done?",
    ],
  },
  {
    id: "stack",
    label: "Tech stack",
    icon: <CodeIcon />,
    prompts: [
      "What is Dishant's technical stack?",
      "What AI and LLM tools has Dishant worked with?",
      "What databases and cloud tools does Dishant use?",
      "Which certifications does Dishant hold?",
    ],
  },
  {
    id: "projects",
    label: "Projects",
    icon: <FolderIcon />,
    prompts: [
      "What projects has Dishant built?",
      "Explain the architecture of Dishant's most impressive project",
      "What problems did Dishant's projects solve?",
    ],
  },
  {
    id: "hiring",
    label: "Hiring",
    icon: <LayersIcon />,
    prompts: [
      "Why should we hire Dishant?",
      "Is Dishant a good fit for a backend engineering role?",
      "What are Dishant's biggest engineering achievements?",
      "Share Dishant's LinkedIn profile",
    ],
  },
];

export const ALL_PROMPTS = CATEGORIES.flatMap((c) => c.prompts);
