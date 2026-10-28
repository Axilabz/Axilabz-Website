import type { IconName } from '@/components/site/Icon';

/**
 * Availability is deliberately conservative. Until the company confirms which
 * capabilities ship today, every product is presented as an enquiry pathway.
 * Update `status` per capability once verified.
 */
export type CapabilityStatus = 'available' | 'in-development' | 'demonstration' | 'planned' | 'enquiry' | 'research';

export const statusLabels: Record<CapabilityStatus, string> = {
  available: 'Available',
  'in-development': 'In development',
  demonstration: 'Demonstration',
  planned: 'Planned',
  enquiry: 'Confirmed on enquiry',
  research: 'Under research',
};

export type Product = {
  slug: string;
  name: string;
  icon: IconName;
  art: 'voice' | 'doc' | 'core' | 'data' | 'solve';
  subtitle: string;
  summary: string;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
  status: CapabilityStatus;
  heroHeadline: string;
  problem: string[];
  capabilities: { title: string; text: string; status: CapabilityStatus }[];
  useCases: { title: string; text: string }[];
  considerations: string[];
  mock: { title: string; rows: { k: string; v: string }[] };
  services: string[];
  faqs: { q: string; a: string }[];
  interest: string;
  /** Being researched: shown on the product cards, but has no page and cannot be enquired about. */
  underResearch?: boolean;
};

export const products: Product[] = [
  {
    slug: 'axivoice',
    name: 'AxiVoice',
    icon: 'audio',
    art: 'voice',
    subtitle: 'Turn conversations into insights.',
    summary: 'Conversation intelligence for meetings: transcription, summaries and action items. Currently under research.',
    metaTitle: 'AxiVoice — Conversation Intelligence & Meeting Summaries',
    metaDescription:
      'AxiVoice is the Axilabz product pathway for transcription, summarisation and meeting workflows. Learn the planned capabilities and enquire about availability.',
    tags: ['Meetings', 'Transcription', 'Summarisation'],
    status: 'research',
    underResearch: true,
    heroHeadline: 'Conversations, captured and made useful.',
    problem: [
      'Teams make decisions in calls and meetings, yet the record is usually a few hurried notes. Follow-ups are missed, context is lost, and people who were not present rely on second-hand summaries.',
      'AxiVoice is the Axilabz pathway for turning spoken conversations into searchable transcripts, concise summaries and clear action items, with a review step so people stay in control of what is recorded.',
    ],
    capabilities: [
      { title: 'Transcription', text: 'Speech-to-text for recorded and live conversations.', status: 'enquiry' },
      { title: 'Summaries and decisions', text: 'Short summaries with decisions and open questions highlighted.', status: 'enquiry' },
      { title: 'Action item extraction', text: 'Tasks with owners and due dates, ready for review.', status: 'enquiry' },
      { title: 'Searchable meeting history', text: 'Find what was said across past conversations.', status: 'enquiry' },
      { title: 'Workflow integration', text: 'Send outputs to calendars, CRM and task tools.', status: 'enquiry' },
    ],
    useCases: [
      { title: 'Internal meetings', text: 'Consistent notes and follow-ups across teams.' },
      { title: 'Client calls', text: 'Accurate records and CRM updates after each conversation.' },
      { title: 'Interviews and research', text: 'Searchable transcripts for analysis.' },
    ],
    considerations: [
      'Recording and transcription require appropriate notice and consent, which differs by region.',
      'Accuracy depends on audio quality, accents and domain vocabulary and should be tested on your own recordings.',
      'Where transcripts are stored and who can access them is agreed before deployment.',
    ],
    mock: {
      title: 'Weekly project sync',
      rows: [
        { k: 'Summary', v: 'Release scope confirmed; testing moves to Thursday.' },
        { k: 'Decision', v: 'Defer reporting module to the next phase.' },
        { k: 'Action', v: 'Update test plan, owner to be assigned' },
      ],
    },
    services: ['voice-ai', 'generative-ai-rag'],
    faqs: [
      { q: 'Is AxiVoice available now?', a: 'Please enquire. We confirm current availability, supported environments and scope in a conversation rather than assuming it.' },
      { q: 'Can it be customised?', a: 'Custom conversation-intelligence work is available through our Voice AI service.' },
    ],
    interest: 'axivoice',
  },
  {
    slug: 'axidoc',
    name: 'AxiDoc',
    icon: 'file',
    art: 'doc',
    subtitle: 'Understand documents. Unlock value.',
    summary: 'Document extraction and understanding that turns PDFs, scans and forms into structured, validated data.',
    metaTitle: 'AxiDoc — Document Extraction & Intelligent Document Processing',
    metaDescription:
      'AxiDoc is the Axilabz product pathway for document extraction, validation and workflow integration. Learn the planned capabilities and enquire about availability.',
    tags: ['Document AI', 'Extraction', 'Workflow'],
    status: 'enquiry',
    heroHeadline: 'Documents in. Structured, validated data out.',
    problem: [
      'Operational data lives in invoices, forms, contracts and correspondence. People retype it into systems, which is slow and error-prone, and the original document is hard to trace once the data has moved.',
      'AxiDoc is the Axilabz pathway for extracting fields and tables from documents, checking them against business rules, and sending clean records to downstream systems, with a review queue for anything uncertain.',
    ],
    capabilities: [
      { title: 'Classification', text: 'Identify document types and split combined files.', status: 'enquiry' },
      { title: 'Field and table extraction', text: 'Capture the values that matter, including line items.', status: 'enquiry' },
      { title: 'Validation rules', text: 'Check values against reference data and each other.', status: 'enquiry' },
      { title: 'Review workflow', text: 'A queue where people confirm or correct uncertain items.', status: 'enquiry' },
      { title: 'System integration', text: 'Deliver structured data to ERP, CRM and workflow tools.', status: 'enquiry' },
    ],
    useCases: [
      { title: 'Accounts payable', text: 'Invoice capture matched to purchase orders.' },
      { title: 'Customer onboarding', text: 'Extraction from identity and supporting documents.' },
      { title: 'Contract registers', text: 'Key dates and obligations pulled into one place.' },
    ],
    considerations: [
      'Extraction accuracy should be measured per field on a labelled sample of your own documents.',
      'Documents frequently contain personal or financial data; storage and retention need explicit decisions.',
      'A human review step is recommended until measured accuracy supports reducing it.',
    ],
    mock: {
      title: 'Invoice: extracted fields',
      rows: [
        { k: 'Supplier', v: 'Sample Supplies Ltd' },
        { k: 'Invoice date', v: '2026-03-14' },
        { k: 'Total', v: 'Needs review (does not match line items)' },
      ],
    },
    services: ['intelligent-document-processing', 'workflow-automation'],
    faqs: [
      { q: 'Is AxiDoc available now?', a: 'Please enquire. We confirm availability, supported document types and scope directly.' },
      { q: 'Can you build a custom pipeline instead?', a: 'Yes. See our Intelligent Document Processing service.' },
    ],
    interest: 'axidoc',
  },
  {
    slug: 'axicore',
    name: 'AxiCore',
    icon: 'core',
    art: 'core',
    subtitle: 'Build, customise and deploy AI.',
    summary: 'A foundation for engineering AI applications: agents, retrieval, customisation, integration and deployment.',
    metaTitle: 'AxiCore — AI Application Engineering, Agents & Deployment',
    metaDescription:
      'AxiCore is the Axilabz pathway for building, customising and deploying AI applications and agents. Learn the planned capabilities and enquire about availability.',
    tags: ['Agents', 'Customisation', 'Deployment'],
    status: 'enquiry',
    heroHeadline: 'An engineering foundation for AI applications.',
    problem: [
      'Teams that build AI features repeatedly solve the same problems: connecting to data, orchestrating model calls, evaluating quality, enforcing permissions and deploying safely.',
      'AxiCore is the Axilabz pathway for approaching those concerns as a coherent engineering foundation covering agents, retrieval, customisation, integration and deployment, rather than a collection of one-off scripts.',
    ],
    capabilities: [
      { title: 'Agent orchestration', text: 'Tool-using agents with guardrails and approval steps.', status: 'enquiry' },
      { title: 'Retrieval and knowledge', text: 'Connect models to your documents and data.', status: 'enquiry' },
      { title: 'Model customisation', text: 'Prompting, configuration and, where justified, fine-tuning.', status: 'enquiry' },
      { title: 'Integration layer', text: 'Connect to internal systems and third-party APIs.', status: 'enquiry' },
      { title: 'Deployment and monitoring', text: 'Release, trace, evaluate and control cost.', status: 'enquiry' },
    ],
    useCases: [
      { title: 'Internal AI assistants', text: 'Permission-aware assistants across company knowledge.' },
      { title: 'Customer-facing AI features', text: 'AI capabilities embedded within your own product.' },
      { title: 'Process agents', text: 'Agents that complete multi-step operational tasks.' },
    ],
    considerations: [
      'Model fine-tuning is rarely the first step; retrieval and prompt design usually come first.',
      'Data residency, security review and model provider terms shape the deployment architecture.',
      'Agent autonomy should widen gradually as evaluation results justify it.',
    ],
    mock: {
      title: 'Agent run: trace',
      rows: [
        { k: 'Step 1', v: 'Retrieve policy passages' },
        { k: 'Step 2', v: 'Call approved lookup tool' },
        { k: 'Step 3', v: 'Draft response, awaiting approval' },
      ],
    },
    services: ['ai-agent-development', 'cloud-ai-deployment', 'generative-ai-rag'],
    faqs: [
      { q: 'Is AxiCore a packaged platform?', a: 'Please enquire. We confirm what is available today and what would be built for your project.' },
      { q: 'Can you build something that is not listed?', a: 'Yes. AxiSolve is our custom AI and software solutions pathway.' },
    ],
    interest: 'axicore',
  },
  {
    slug: 'axidata',
    name: 'AxiData',
    icon: 'database',
    art: 'data',
    subtitle: 'Ask your data in plain English.',
    summary: 'Natural-language querying: ask a question, review the generated SQL and get a result from your own database, within the access rules you set.',
    metaTitle: 'AxiData — Natural-Language Queries on Your Database',
    metaDescription:
      'AxiData is the Axilabz product pathway for asking questions of your database in plain English and getting reviewed SQL and results. See an illustrative demo and enquire about availability.',
    tags: ['Text-to-SQL', 'Analytics', 'Access control'],
    status: 'enquiry',
    heroHeadline: 'Ask your data a question. Get a checked answer.',
    problem: [
      'Business questions are simple to ask and slow to answer. Each one waits in a queue for an analyst to write a query, so teams either decide without the data or settle for a fixed dashboard that never quite fits the question.',
      'AxiData is the Axilabz pathway for turning a plain-English question into SQL against your own schema, showing that SQL for review, running it under the permissions you define, and returning the result as a table or chart.',
    ],
    capabilities: [
      { title: 'Natural-language questions', text: 'Ask in everyday words, including follow-up questions.', status: 'enquiry' },
      { title: 'Schema-aware SQL generation', text: 'Queries are written against your own tables, columns and business definitions.', status: 'enquiry' },
      { title: 'Visible, reviewable SQL', text: 'Every answer shows the query behind it, so it can be checked and reused.', status: 'enquiry' },
      { title: 'Permission-aware execution', text: 'Read-only access, with row and column rules set by your team.', status: 'enquiry' },
      { title: 'Results and BI hand-off', text: 'Tables and charts, with export or embedding into your reporting tools.', status: 'enquiry' },
    ],
    useCases: [
      { title: 'Sales and revenue questions', text: 'Regional, product and period comparisons without waiting for a report.' },
      { title: 'Operations reporting', text: 'Stock, throughput and exception questions asked by the people who need them.' },
      { title: 'Analyst acceleration', text: 'Analysts start from a reviewed draft query instead of a blank editor.' },
    ],
    considerations: [
      'Generated SQL can be wrong or misread a business term. Accuracy should be measured on real questions from your own team, and queries stay visible for review.',
      'Access is read-only and follows your existing permissions. Which tables and columns are exposed is decided up front.',
      'Which databases and BI tools are supported depends on the project and is confirmed on enquiry.',
    ],
    mock: {
      title: 'Question to SQL',
      rows: [
        { k: 'Question', v: 'Revenue by region, last quarter' },
        { k: 'SQL', v: 'SELECT region, SUM(amount) … GROUP BY region' },
        { k: 'Result', v: 'Table of regions, ready to review' },
      ],
    },
    services: ['data-engineering-analytics', 'generative-ai-rag', 'ai-agent-development'],
    faqs: [
      { q: 'Is AxiData available now?', a: 'Please enquire. We confirm availability, supported databases and scope in a conversation rather than assuming it.' },
      { q: 'Does it change my data?', a: 'No. The intended design is read-only access, with the generated SQL shown before and after it runs.' },
      { q: 'Can the numbers be trusted?', a: 'Treat answers as drafts to verify until accuracy has been measured on your own questions. The visible SQL is what makes that check quick.' },
    ],
    interest: 'axidata',
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

/** Custom-solution pathway shown beside the product cards. */
export const axiSolve = {
  name: 'AxiSolve',
  subtitle: 'Let’s connect and solve.',
  summary:
    'Have a challenge that is not listed? AxiSolve is our pathway for custom AI and software solutions, designed around your workflow.',
  interest: 'axisolve',
};

/** Products that have a detail page and can be linked to. */
export const linkableProducts = products.filter((p) => !p.underResearch);
