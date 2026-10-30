// Structured portfolio data for the Projects / Tech stack pages.
// Every fact here must also appear in backend/data/knowledge.md.

export interface Project {
  id: string;
  name: string;
  tagline: string;
  stack: string[];
  highlights: string[];
  /** Question sent when the visitor clicks "Ask about this" */
  prompt: string;
}

export const PROJECTS: Project[] = [
  {
    id: "resume-ai",
    name: "AI Resume Intelligence Platform",
    tagline: "This portfolio assistant: a RAG pipeline over resume content",
    stack: ["Next.js", "FastAPI", "Sentence Transformers", "Vector search"],
    highlights: [
      "Vector similarity search with confidence thresholds to reduce hallucinations",
      "Guardrails that restrict the LLM to retrieved resume context",
      "Streaming chat interface with conversation history",
    ],
    prompt: "Explain how Dishant built the AI Resume Intelligence Platform",
  },
  {
    id: "auth",
    name: "Custom Authentication & Session Engine",
    tagline: "A custom auth layer on Supabase GoTrue and PostgREST",
    stack: ["FastAPI", "PostgreSQL", "Supabase", "JWT", "Docker"],
    highlights: [
      "Server-side sessions with Snowflake-generated IDs beyond stateless JWT",
      "JWT validation, CSRF protection, refresh tokens and server-side invalidation",
      "A single /me endpoint for auth, workspace, project and role metadata",
    ],
    prompt: "Walk me through Dishant's custom authentication and session engine",
  },
  {
    id: "search",
    name: "Enterprise Search Infrastructure",
    tagline: "Elasticsearch/OpenSearch pipelines for 50M+ biomedical records",
    stack: ["Elasticsearch", "OpenSearch", "Redis", "Kibana"],
    highlights: [
      "Tuned analyzers, mappings and scoring for 30% better search accuracy",
      "Redis caching for frequent searches, cutting latency by over 80%",
      "Optimized query composition, pagination and aggregations",
    ],
    prompt: "How did Dishant build search infrastructure for 50M+ records?",
  },
];

export interface SkillGroup {
  label: string;
  items: string[];
  prompt: string;
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: "Languages",
    items: ["Java (core)", "JavaScript", "TypeScript", "Python", "SQL"],
    prompt: "Which programming languages does Dishant use?",
  },
  {
    label: "Frontend",
    items: ["React.js", "Next.js", "Angular", "Redux Toolkit", "HTML5", "CSS3", "Tailwind CSS", "Material UI"],
    prompt: "Tell me about Dishant's frontend experience",
  },
  {
    label: "Backend",
    items: ["Node.js", "Express.js", "FastAPI", "Django", "REST APIs"],
    prompt: "Tell me about Dishant's backend experience",
  },
  {
    label: "AI / ML",
    items: ["RAG", "Sentence Transformers", "Vector Search", "Semantic Search", "LLM Applications", "Prompt Engineering", "Ollama"],
    prompt: "What AI and LLM work has Dishant done?",
  },
  {
    label: "Databases",
    items: ["PostgreSQL", "MongoDB", "Redis", "Supabase"],
    prompt: "What databases does Dishant work with?",
  },
  {
    label: "Search",
    items: ["Elasticsearch", "OpenSearch", "Kibana"],
    prompt: "What is Dishant's search engineering experience?",
  },
  {
    label: "Infrastructure",
    items: ["Docker", "Kubernetes", "Microservices", "Jaeger", "OpenTelemetry"],
    prompt: "What infrastructure and observability work has Dishant done?",
  },
  {
    label: "Security",
    items: ["JWT", "CSRF protection", "Session management", "Role-based access control", "Refresh tokens"],
    prompt: "What security and authentication work has Dishant done?",
  },
];
