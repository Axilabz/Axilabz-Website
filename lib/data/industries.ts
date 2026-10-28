export type Industry = {
  slug: string;
  name: string;
  intro: string;
  challenges: string[];
  applications: { title: string; text: string; service: string }[];
  considerations: string;
};

export const industries: Industry[] = [
  {
    slug: 'financial-services',
    name: 'Financial Services',
    intro: 'Banks, lenders, insurers and fintechs handle high volumes of documents and decisions under strict regulatory oversight.',
    challenges: [
      'Manual review of applications, statements and claims slows customer response.',
      'Audit and explainability requirements limit how freely AI can be used.',
      'Data is spread across legacy and modern platforms.',
    ],
    applications: [
      { title: 'Document-based onboarding and underwriting support', text: 'Extract and validate fields, flag inconsistencies for analysts.', service: 'intelligent-document-processing' },
      { title: 'Policy and procedure assistants', text: 'Cited answers from internal compliance documents.', service: 'generative-ai-rag' },
      { title: 'Case-handling agents', text: 'Prepare cases and draft responses with human approval.', service: 'ai-agent-development' },
    ],
    considerations: 'Traceability, access control and data residency must be designed in from the start. Regulated decisions need human accountability.',
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    intro: 'Healthcare organisations carry a heavy administrative load alongside strict privacy requirements.',
    challenges: [
      'Clinical and administrative information is spread across notes, forms and systems.',
      'Documentation takes clinician time away from patients.',
      'Privacy law constrains how data may be processed and stored.',
    ],
    applications: [
      { title: 'Administrative document processing', text: 'Digitise referrals, forms and correspondence into structured records.', service: 'intelligent-document-processing' },
      { title: 'Conversation capture for non-diagnostic notes', text: 'Transcription and summarisation with consent and review.', service: 'voice-ai' },
      { title: 'Internal knowledge search', text: 'Find policy and protocol information quickly with sources.', service: 'generative-ai-rag' },
    ],
    considerations: 'We do not position AI as a substitute for clinical judgement. Privacy compliance and regional requirements need review for each project.',
  },
  {
    slug: 'retail',
    name: 'Retail & E-commerce',
    intro: 'Retailers manage large catalogues, seasonal demand and customers who expect immediate answers.',
    challenges: [
      'Product data is inconsistent across channels.',
      'Support volume spikes with promotions and delivery issues.',
      'Teams struggle to connect sales, inventory and customer data.',
    ],
    applications: [
      { title: 'Support assistants grounded in policy and order data', text: 'Answer common questions and escalate the rest.', service: 'ai-agent-development' },
      { title: 'Customer-facing web applications', text: 'Fast, accessible storefront and account experiences.', service: 'web-application-development' },
      { title: 'Unified commerce reporting', text: 'Consistent sales and inventory measures.', service: 'data-engineering-analytics' },
    ],
    considerations: 'Customer-facing AI should be limited to approved content and have a clear route to a person.',
  },
  {
    slug: 'manufacturing',
    name: 'Manufacturing',
    intro: 'Manufacturers coordinate suppliers, plants and maintenance across disconnected systems.',
    challenges: [
      'Production, quality and maintenance data live in separate systems.',
      'Paper and PDF records slow traceability.',
      'Exceptions are handled through email and phone calls.',
    ],
    applications: [
      { title: 'Process integration and exception routing', text: 'Connect ERP, shop-floor and supplier systems.', service: 'workflow-automation' },
      { title: 'Internal tools for operations teams', text: 'Dashboards and workflow applications tailored to plant processes.', service: 'custom-software-development' },
      { title: 'Operational analytics', text: 'Reliable measures of throughput, quality and downtime.', service: 'data-engineering-analytics' },
    ],
    considerations: 'Plant networks and legacy equipment often constrain integration options, which are reviewed before design.',
  },
  {
    slug: 'logistics',
    name: 'Logistics & Supply Chain',
    intro: 'Logistics operators process large volumes of shipping documents and time-sensitive exceptions.',
    challenges: [
      'Bills of lading, invoices and customs forms arrive in many formats.',
      'Status updates require checking multiple carrier and partner systems.',
      'Exceptions need fast triage.',
    ],
    applications: [
      { title: 'Shipping document extraction', text: 'Capture key fields and match them to orders.', service: 'intelligent-document-processing' },
      { title: 'Exception triage agents', text: 'Gather context and propose next actions for planners.', service: 'ai-agent-development' },
      { title: 'Partner system integration', text: 'Synchronise status across carriers and internal systems.', service: 'workflow-automation' },
    ],
    considerations: 'Partner APIs vary widely in quality; integration discovery happens early.',
  },
  {
    slug: 'professional-services',
    name: 'Professional Services',
    intro: 'Consultancies, legal, accounting and advisory firms sell expertise that depends on locating and reusing knowledge.',
    challenges: [
      'Precedents and prior work are hard to find.',
      'Meeting records and follow-ups are inconsistent.',
      'Document-heavy work consumes billable time.',
    ],
    applications: [
      { title: 'Knowledge search with citations', text: 'Find precedents and prior work across firm documents.', service: 'generative-ai-rag' },
      { title: 'Meeting capture and summaries', text: 'Structured notes and action items with review.', service: 'voice-ai' },
      { title: 'Roadmap and feasibility advice', text: 'Prioritise AI opportunities before committing budget.', service: 'ai-consulting' },
    ],
    considerations: 'Client confidentiality is the central concern, so permission-aware access and careful data handling come first.',
  },
];

export const industryBySlug = (slug: string) => industries.find((i) => i.slug === slug);
