import type { IconName } from '@/components/site/Icon';

export type ServiceFaq = { q: string; a: string };
export type WorkflowStep = { label: string; detail: string };

export type Service = {
  slug: string;
  name: string;
  icon: IconName;
  /** Drives the card layout on /services so cards are not all identical. */
  tone: 'feature' | 'standard' | 'compact';
  metaTitle: string;
  metaDescription: string;
  /** One-line customer problem used on cards. */
  problem: string;
  /** Short explanation used on cards and as the page hero summary. */
  summary: string;
  heroHeadline: string;
  tags: string[];
  problemStatement: string[];
  useCases: { title: string; text: string }[];
  capabilities: { title: string; text: string }[];
  workflowTitle: string;
  workflow: WorkflowStep[];
  implementation: { phase: string; text: string }[];
  integrations: string[];
  risks: { title: string; text: string }[];
  faqs: ServiceFaq[];
  related: string[];
  products: string[];
  industries: string[];
  cta: string;
};

export const services: Service[] = [
  {
    slug: 'ai-consulting',
    name: 'AI Consulting & Solution Strategy',
    icon: 'lightbulb',
    tone: 'feature',
    metaTitle: 'AI Consulting & Solution Strategy',
    metaDescription:
      'Identify where AI can improve your operations, test feasibility early and plan a build that fits your data, systems and risk requirements.',
    problem: 'Too many possible AI ideas and no clear way to choose between them.',
    summary:
      'We help teams identify the workflows where AI is worth building, test feasibility against real data and agree a delivery plan before major engineering spend.',
    heroHeadline: 'Decide what to build before you build it.',
    tags: ['Use-case discovery', 'Feasibility', 'Roadmap', 'Risk review'],
    problemStatement: [
      'Most organisations have a long list of AI ideas and a short list of reliable data. Without a structured way to compare them, teams either stall in analysis or commit to a prototype that cannot survive contact with production systems.',
      'AI consulting is about making that choice explicit: which workflow, which measure of success, which data, which level of automation and which risks are acceptable.',
    ],
    useCases: [
      { title: 'Opportunity assessment', text: 'Rank candidate workflows by value, data readiness, integration effort and risk.' },
      { title: 'Build-versus-buy review', text: 'Compare custom engineering with off-the-shelf tools for a specific process.' },
      { title: 'Pilot scoping', text: 'Define a narrow pilot with a baseline, an evaluation set and clear exit criteria.' },
      { title: 'Governance planning', text: 'Agree review points, data handling rules and ownership before launch.' },
    ],
    capabilities: [
      { title: 'Workflow mapping', text: 'Document how work moves today, where it stalls and where judgement is needed.' },
      { title: 'Data readiness review', text: 'Check volume, quality, access and permissions for the data a use case depends on.' },
      { title: 'Technical feasibility testing', text: 'Run small, time-boxed experiments on representative samples.' },
      { title: 'Solution architecture options', text: 'Present realistic alternatives with trade-offs in cost, latency, control and maintainability.' },
      { title: 'Delivery roadmap', text: 'Sequence work into milestones that each deliver something testable.' },
    ],
    workflowTitle: 'From idea to scoped pilot',
    workflow: [
      { label: 'Frame', detail: 'Business goal, users and success measure' },
      { label: 'Assess', detail: 'Workflow, data and systems review' },
      { label: 'Test', detail: 'Small feasibility experiment' },
      { label: 'Decide', detail: 'Go, adjust or stop' },
      { label: 'Plan', detail: 'Pilot scope, owners, timeline' },
    ],
    implementation: [
      { phase: 'Discovery workshop', text: 'Sessions with the people who run the process, not only those who sponsor it.' },
      { phase: 'Evidence gathering', text: 'Sample inputs, existing metrics and a view of current systems.' },
      { phase: 'Experiment', text: 'A bounded test against a baseline so the result is a comparison, not an impression.' },
      { phase: 'Recommendation', text: 'A written recommendation covering scope, architecture, risks and next steps.' },
    ],
    integrations: ['Existing line-of-business systems', 'Document and data stores', 'Identity and access management', 'Reporting and BI tools'],
    risks: [
      { title: 'Data may not support the idea', text: 'A feasibility test can conclude that a use case should wait until data quality improves. That is a valid outcome.' },
      { title: 'Estimates carry uncertainty', text: 'Early cost and timeline ranges depend on assumptions that are listed in the recommendation and revisited after the pilot.' },
      { title: 'Adoption is a separate problem', text: 'Even a technically sound tool needs process changes and ownership to deliver value.' },
    ],
    faqs: [
      { q: 'Do we need to have data ready before we talk to you?', a: 'No. Understanding what data exists, and what it would take to use it, is part of the work.' },
      { q: 'Can consulting lead straight into delivery?', a: 'It can, but it does not have to. The recommendation is written so that your team or another supplier could also act on it.' },
      { q: 'How is success measured?', a: 'We agree the measure and the baseline at the start, so results can be compared against how the process performs today.' },
    ],
    related: ['ai-agent-development', 'workflow-automation', 'data-engineering-analytics'],
    products: ['axicore'],
    industries: ['professional-services', 'financial-services'],
    cta: 'Discuss your AI roadmap',
  },
  {
    slug: 'ai-agent-development',
    name: 'AI Agent Development',
    icon: 'bot',
    tone: 'feature',
    metaTitle: 'AI Agent Development',
    metaDescription:
      'Design and build AI agents that use tools, follow business rules and hand off to people, with the controls needed to run them in production.',
    problem: 'Repetitive multi-step work that needs judgement, but not a human for every step.',
    summary:
      'Agents that read context, call approved tools and complete multi-step tasks, with guardrails, logging and human review where the risk requires it.',
    heroHeadline: 'Agents that act within rules you control.',
    tags: ['Tool use', 'Orchestration', 'Guardrails', 'Human-in-the-loop'],
    problemStatement: [
      'Many operational tasks follow a loose pattern: gather information from several places, apply policy, take an action in a system, and explain what was done. Fixed scripts break when inputs vary; people spend time on work that follows a repeatable shape.',
      'An AI agent can handle that variation by deciding which approved tool to call next. The engineering challenge is keeping that flexibility inside boundaries: limited permissions, validated outputs, full traces and a clear route to a person.',
    ],
    useCases: [
      { title: 'Support triage and resolution', text: 'Classify requests, look up account context and draft or perform approved actions.' },
      { title: 'Internal operations assistants', text: 'Answer staff questions across policies and systems, and raise tickets on their behalf.' },
      { title: 'Research and preparation', text: 'Collect and summarise information from approved sources before a human decision.' },
      { title: 'Back-office processing', text: 'Move cases through multi-step procedures, escalating exceptions.' },
    ],
    capabilities: [
      { title: 'Tool and API integration', text: 'Typed, permission-scoped tools so the agent can only do what it is meant to.' },
      { title: 'Planning and orchestration', text: 'Single agents or coordinated multi-agent designs, chosen on need rather than novelty.' },
      { title: 'Memory and context management', text: 'Controlled retrieval of case history and policy documents.' },
      { title: 'Guardrails and approvals', text: 'Output validation, spending and action limits, and approval gates for sensitive steps.' },
      { title: 'Observability', text: 'Step-level traces so every decision can be reviewed and replayed.' },
    ],
    workflowTitle: 'Example agent loop',
    workflow: [
      { label: 'Request', detail: 'User or system event arrives' },
      { label: 'Context', detail: 'Retrieve case data and policy' },
      { label: 'Plan', detail: 'Choose the next approved tool' },
      { label: 'Act', detail: 'Call tool, validate result' },
      { label: 'Review', detail: 'Approve, escalate or finish' },
    ],
    implementation: [
      { phase: 'Define the task boundary', text: 'List the actions the agent may take, what it must never do and who approves what.' },
      { phase: 'Build an evaluation set', text: 'Real or realistic cases with expected outcomes, used throughout development.' },
      { phase: 'Iterate behind a safe interface', text: 'Start in suggestion mode, then widen autonomy as measured results justify it.' },
      { phase: 'Operate', text: 'Monitoring, cost tracking and a routine for updating prompts, tools and policies.' },
    ],
    integrations: ['Ticketing and CRM systems', 'Internal APIs and databases', 'Knowledge bases and document stores', 'Messaging channels', 'Identity and access controls'],
    risks: [
      { title: 'Non-deterministic behaviour', text: 'Agents can choose an unexpected path. We rely on constrained tools, validation and evaluation rather than trusting prompts alone.' },
      { title: 'Compounding errors', text: 'Longer chains multiply failure chances. Where a fixed workflow is enough, we recommend it.' },
      { title: 'Cost and latency', text: 'Multi-step reasoning uses more model calls. Budgets and timeouts are designed in.' },
      { title: 'Security exposure', text: 'Tools that act on systems need least-privilege access and protection against malicious input in the content the agent reads.' },
    ],
    faqs: [
      { q: 'When is an agent the wrong choice?', a: 'When the steps are known and stable. A deterministic workflow is cheaper, faster and easier to test.' },
      { q: 'Can a person stay in control?', a: 'Yes. Approval gates, escalation rules and read-only modes are standard design options.' },
      { q: 'Which models do you use?', a: 'The choice depends on task, data handling requirements, latency and cost, and is confirmed during scoping.' },
    ],
    related: ['workflow-automation', 'generative-ai-rag', 'cloud-ai-deployment'],
    products: ['axicore'],
    industries: ['financial-services', 'logistics', 'professional-services'],
    cta: 'Scope an agent project',
  },
  {
    slug: 'generative-ai-rag',
    name: 'Generative AI & Retrieval-Augmented Generation',
    icon: 'brain',
    tone: 'standard',
    metaTitle: 'Generative AI & RAG Development',
    metaDescription:
      'Build generative AI applications that answer from your own documents and data using retrieval-augmented generation, evaluation and access controls.',
    problem: 'Staff cannot find answers buried across documents, wikis and systems.',
    summary:
      'Question-answering and drafting tools grounded in your own content, with citations, permission-aware retrieval and measured answer quality.',
    heroHeadline: 'Answers grounded in your own knowledge.',
    tags: ['RAG', 'Search', 'Citations', 'Evaluation'],
    problemStatement: [
      'General-purpose language models do not know your policies, contracts or product details, and they can produce confident but wrong text. Retrieval-augmented generation addresses this by fetching relevant passages from your content at question time and asking the model to answer from them.',
      'The quality of the result depends far more on ingestion, chunking, retrieval and evaluation than on the choice of model. That is where most of the engineering effort goes.',
    ],
    useCases: [
      { title: 'Internal knowledge assistant', text: 'Answers to policy and procedure questions with links to the source passage.' },
      { title: 'Customer-facing help', text: 'Product and support answers drawn from approved documentation only.' },
      { title: 'Drafting support', text: 'First drafts of responses, summaries and reports using supplied source material.' },
      { title: 'Contract and policy lookup', text: 'Locate and compare clauses across large document sets.' },
    ],
    capabilities: [
      { title: 'Document ingestion pipelines', text: 'Parsing, cleaning, chunking and metadata tagging for varied formats.' },
      { title: 'Hybrid retrieval', text: 'Combine semantic and keyword search with re-ranking for precision.' },
      { title: 'Permission-aware access', text: 'Users only retrieve content they are already allowed to see.' },
      { title: 'Citations and answer checks', text: 'Show sources and abstain when the evidence is insufficient.' },
      { title: 'Evaluation harness', text: 'Test sets and metrics to compare changes before release.' },
    ],
    workflowTitle: 'Retrieval-augmented generation flow',
    workflow: [
      { label: 'Ingest', detail: 'Parse and chunk documents' },
      { label: 'Index', detail: 'Embeddings plus keyword index' },
      { label: 'Retrieve', detail: 'Find permitted passages' },
      { label: 'Generate', detail: 'Answer from retrieved text' },
      { label: 'Verify', detail: 'Cite, check, log feedback' },
    ],
    implementation: [
      { phase: 'Content audit', text: 'Identify authoritative sources, owners, update frequency and access rules.' },
      { phase: 'Baseline retrieval', text: 'Build a simple pipeline and measure whether the right passages are found.' },
      { phase: 'Improve and evaluate', text: 'Tune chunking, retrieval and prompts against a question set drawn from real use.' },
      { phase: 'Release and monitor', text: 'Collect feedback, track unanswered questions and keep the index current.' },
    ],
    integrations: ['SharePoint, Google Drive and similar stores', 'Wikis and help centres', 'Databases and data warehouses', 'Single sign-on and role systems', 'Chat and web interfaces'],
    risks: [
      { title: 'Poor source content', text: 'Outdated or contradictory documents produce poor answers. Content ownership is part of the solution.' },
      { title: 'Hallucination is reduced, not eliminated', text: 'Grounding lowers the risk but does not remove it, so citations and abstention behaviour matter.' },
      { title: 'Data exposure', text: 'Indexing must respect permissions and data residency requirements from the first design.' },
    ],
    faqs: [
      { q: 'Do we need to fine-tune a model?', a: 'Usually not first. Retrieval and good prompts address most knowledge problems and are easier to update.' },
      { q: 'Can the system say it does not know?', a: 'It can be designed to decline when retrieved evidence is weak, and that behaviour is tested.' },
      { q: 'How do you keep answers current?', a: 'Through scheduled re-indexing or change-triggered updates tied to your content sources.' },
    ],
    related: ['intelligent-document-processing', 'ai-agent-development', 'data-engineering-analytics'],
    products: ['axicore', 'axidoc'],
    industries: ['professional-services', 'healthcare', 'financial-services'],
    cta: 'Discuss a knowledge assistant',
  },
  {
    slug: 'intelligent-document-processing',
    name: 'Intelligent Document Processing',
    icon: 'file',
    tone: 'standard',
    metaTitle: 'Intelligent Document Processing',
    metaDescription:
      'Extract structured data from invoices, forms, contracts and correspondence, validate it against business rules and route exceptions to reviewers.',
    problem: 'Information trapped in PDFs, scans and emails is re-keyed by hand.',
    summary:
      'Extraction, classification and validation pipelines that turn documents into structured data, with a review step for anything uncertain.',
    heroHeadline: 'From documents to dependable data.',
    tags: ['Extraction', 'Classification', 'Validation', 'Review queues'],
    problemStatement: [
      'Documents arrive in many layouts and quality levels. Teams rekey values into systems, which is slow and introduces errors. Template-based tools struggle when layouts change.',
      'Modern extraction combines layout analysis, OCR and language models, but a reliable system also needs validation rules, confidence handling and a human review path. The accuracy that matters is accuracy on your documents, measured on a labelled sample.',
    ],
    useCases: [
      { title: 'Invoice and purchase order capture', text: 'Header and line-item extraction matched to supplier and PO records.' },
      { title: 'Onboarding and KYC packs', text: 'Classify and extract fields from identity and supporting documents.' },
      { title: 'Contract data extraction', text: 'Pull parties, dates, obligations and clauses into a register.' },
      { title: 'Claims and forms intake', text: 'Digitise forms and attachments into case management workflows.' },
    ],
    capabilities: [
      { title: 'Classification and splitting', text: 'Identify document types and separate bundled files.' },
      { title: 'Field and table extraction', text: 'Structured output including tables and multi-page documents.' },
      { title: 'Validation rules', text: 'Cross-field checks, reference-data lookups and totals reconciliation.' },
      { title: 'Confidence and review', text: 'Route low-confidence or rule-failing documents to a reviewer interface.' },
      { title: 'Export and integration', text: 'Deliver results to ERP, CRM or workflow systems through APIs.' },
    ],
    workflowTitle: 'Document pipeline with review',
    workflow: [
      { label: 'Capture', detail: 'Email, upload or API intake' },
      { label: 'Classify', detail: 'Type, split, quality check' },
      { label: 'Extract', detail: 'Fields, tables, entities' },
      { label: 'Validate', detail: 'Rules and reference data' },
      { label: 'Review & export', detail: 'Resolve exceptions, send downstream' },
    ],
    implementation: [
      { phase: 'Sample analysis', text: 'Collect a representative sample including the awkward cases, and define the fields that matter.' },
      { phase: 'Ground truth', text: 'Label a test set so extraction accuracy can be measured per field.' },
      { phase: 'Build and tune', text: 'Configure extraction, rules and confidence thresholds against the test set.' },
      { phase: 'Pilot with review', text: 'Run in parallel with the manual process and adjust before reducing review.' },
    ],
    integrations: ['Email inboxes and shared mailboxes', 'Document management systems', 'ERP and accounting systems', 'Case and workflow platforms', 'Secure storage'],
    risks: [
      { title: 'Accuracy varies by document type', text: 'Handwriting, poor scans and unusual layouts lower accuracy. Per-field metrics show where review is still needed.' },
      { title: 'Sensitive data', text: 'Documents often contain personal or financial information. Storage, retention and access are designed up front.' },
      { title: 'Silent errors', text: 'Plausible but wrong values are the costliest. Validation rules and sampling checks target them.' },
    ],
    faqs: [
      { q: 'What accuracy can we expect?', a: 'It depends on your documents. We measure on a labelled sample from your own files rather than quoting a generic figure.' },
      { q: 'Does it replace human review?', a: 'It reduces it. Review remains for low-confidence and rule-failing items, and the share can shrink as evidence builds.' },
      { q: 'Is this related to AxiDoc?', a: 'AxiDoc is the product pathway for this capability. Scope and availability are confirmed when you enquire.' },
    ],
    related: ['generative-ai-rag', 'workflow-automation', 'custom-software-development'],
    products: ['axidoc'],
    industries: ['financial-services', 'logistics', 'healthcare'],
    cta: 'Discuss document automation',
  },
  {
    slug: 'voice-ai',
    name: 'Voice AI & Conversational Systems',
    icon: 'audio',
    tone: 'standard',
    metaTitle: 'Voice AI & Conversational Systems',
    metaDescription:
      'Speech-to-text, meeting summarisation and conversational assistants for calls and meetings, built with attention to latency, accuracy and consent.',
    problem: 'Valuable information in calls and meetings is never captured or acted on.',
    summary:
      'Transcription, summarisation and conversational interfaces for calls and meetings, with speaker handling, action extraction and consent controls.',
    heroHeadline: 'Turn conversations into usable records.',
    tags: ['Transcription', 'Summaries', 'Action items', 'Conversational AI'],
    problemStatement: [
      'Decisions, commitments and customer feedback are spoken, and then lost. Manual note-taking is inconsistent, and recordings are rarely replayed.',
      'Speech systems can transcribe and structure conversations, but quality depends on audio conditions, accents, domain vocabulary and speaker separation. Recording also carries legal and consent obligations that vary by region.',
    ],
    useCases: [
      { title: 'Meeting notes and actions', text: 'Summaries, decisions and owner-assigned action items sent to the right place.' },
      { title: 'Call review', text: 'Searchable transcripts and structured call summaries for quality and coaching.' },
      { title: 'Voice-enabled assistants', text: 'Spoken interfaces that answer questions or complete simple tasks.' },
      { title: 'Field and dictation capture', text: 'Speech-to-form entry for professionals who cannot type.' },
    ],
    capabilities: [
      { title: 'Speech-to-text', text: 'Batch and streaming transcription with domain vocabulary support.' },
      { title: 'Speaker separation', text: 'Attribute statements to participants where audio allows.' },
      { title: 'Summarisation and extraction', text: 'Structured summaries, decisions, questions and tasks.' },
      { title: 'Conversational flows', text: 'Dialogue management with fallbacks and human handover.' },
      { title: 'Integration', text: 'Push outputs to calendars, CRM, project tools and knowledge bases.' },
    ],
    workflowTitle: 'Conversation intelligence flow',
    workflow: [
      { label: 'Capture', detail: 'Meeting, call or live audio' },
      { label: 'Transcribe', detail: 'Speech-to-text, speakers' },
      { label: 'Understand', detail: 'Summary, decisions, actions' },
      { label: 'Review', detail: 'Edit and confirm' },
      { label: 'Distribute', detail: 'CRM, tasks, notes' },
    ],
    implementation: [
      { phase: 'Audio and consent review', text: 'Understand sources, quality, languages and recording consent requirements.' },
      { phase: 'Vocabulary and accuracy testing', text: 'Evaluate transcription on your real audio and tune for names and terms.' },
      { phase: 'Workflow design', text: 'Decide what is generated, who reviews it and where it is stored.' },
      { phase: 'Pilot', text: 'Run with a small group and refine summaries to match how people actually work.' },
    ],
    integrations: ['Video conferencing platforms', 'Telephony and contact-centre systems', 'CRM and task tools', 'Knowledge bases', 'Calendar systems'],
    risks: [
      { title: 'Audio quality limits accuracy', text: 'Noise, overlap and accents affect transcripts, so outputs need an easy correction path.' },
      { title: 'Consent and retention', text: 'Recording and storing speech is regulated. Notice, consent and retention rules must be designed in.' },
      { title: 'Latency for live use', text: 'Real-time conversational systems have tight latency budgets that constrain architecture choices.' },
    ],
    faqs: [
      { q: 'Which languages are supported?', a: 'This depends on the speech models selected and is tested on your audio during scoping.' },
      { q: 'Is this related to AxiVoice?', a: 'AxiVoice is a conversation-intelligence product that is currently under research and is not available yet. Custom voice and meeting projects are available through this service.' },
      { q: 'Can transcripts stay in our environment?', a: 'Deployment options vary by model choice and are discussed in scoping.' },
    ],
    related: ['ai-agent-development', 'generative-ai-rag', 'cloud-ai-deployment'],
    products: ['axivoice'],
    industries: ['professional-services', 'healthcare', 'retail'],
    cta: 'Discuss a voice project',
  },
  {
    slug: 'custom-software-development',
    name: 'Custom Software Development',
    icon: 'code',
    tone: 'compact',
    metaTitle: 'Custom Software Development',
    metaDescription:
      'Engineering of maintainable business software: architecture, APIs, back-end services and integrations, delivered with testing and clear documentation.',
    problem: 'Off-the-shelf tools do not fit the way your business actually works.',
    summary:
      'Purpose-built software, from internal platforms to customer-facing systems, engineered for maintainability and integrated with the tools you already run.',
    heroHeadline: 'Software built around your process.',
    tags: ['Architecture', 'APIs', 'Back-end', 'Integration'],
    problemStatement: [
      'Packaged software covers common needs. When your process is a source of advantage, or when several systems must behave as one, custom engineering can fit better than workarounds.',
      'The risk with custom software is maintenance, not the first release. We design for readability, test coverage and operational simplicity so that your team can own the system afterwards.',
    ],
    useCases: [
      { title: 'Internal operations platforms', text: 'Replace spreadsheets and email chains with a governed system.' },
      { title: 'Customer and partner portals', text: 'Secure self-service for orders, documents and status.' },
      { title: 'Integration hubs', text: 'Services that connect and reconcile data between systems.' },
      { title: 'AI-enabled products', text: 'Application foundations that can host AI features cleanly.' },
    ],
    capabilities: [
      { title: 'Solution architecture', text: 'Domain modelling, service boundaries and technology selection.' },
      { title: 'API design', text: 'Documented, versioned interfaces that other teams can build on.' },
      { title: 'Back-end services', text: 'Reliable processing, queues, scheduling and data persistence.' },
      { title: 'Testing and quality', text: 'Automated tests, code review and continuous integration.' },
      { title: 'Documentation and handover', text: 'Runbooks and architecture notes so the system outlives the project.' },
    ],
    workflowTitle: 'Typical delivery architecture',
    workflow: [
      { label: 'Clients', detail: 'Web, mobile, partner APIs' },
      { label: 'API layer', detail: 'Auth, validation, routing' },
      { label: 'Services', detail: 'Business logic, jobs' },
      { label: 'Data', detail: 'Database, files, cache' },
      { label: 'Integrations', detail: 'ERP, CRM, third parties' },
    ],
    implementation: [
      { phase: 'Requirements and domain model', text: 'Clarify the workflow and the data it creates, and prioritise a first release.' },
      { phase: 'Incremental delivery', text: 'Short cycles that produce working software for review.' },
      { phase: 'Hardening', text: 'Security review, performance checks and operational readiness.' },
      { phase: 'Handover and support', text: 'Documentation, knowledge transfer and an agreed support model.' },
    ],
    integrations: ['ERP and accounting', 'CRM', 'Payment and messaging providers', 'Identity providers', 'Cloud infrastructure'],
    risks: [
      { title: 'Scope growth', text: 'Fixed first-release scope and a visible backlog help keep delivery predictable.' },
      { title: 'Technical debt', text: 'Shortcuts compound. Tests and reviews are part of normal delivery, not extras.' },
      { title: 'Integration surprises', text: 'Third-party systems are often the least documented part and are investigated early.' },
    ],
    faqs: [
      { q: 'Who owns the code?', a: 'Ownership and licensing terms are set out in the engagement agreement.' },
      { q: 'Can you extend an existing system?', a: 'Yes, after reviewing its architecture and test coverage to decide between extending and replacing it.' },
    ],
    related: ['web-application-development', 'workflow-automation', 'cloud-ai-deployment'],
    products: ['axicore'],
    industries: ['manufacturing', 'logistics', 'retail'],
    cta: 'Discuss a software project',
  },
  {
    slug: 'web-application-development',
    name: 'Web Application Development',
    icon: 'globe',
    tone: 'compact',
    metaTitle: 'Web Application Development',
    metaDescription:
      'Responsive, accessible web applications and dashboards built with modern frameworks, designed for performance and ready to host AI features.',
    problem: 'Your teams or customers need a fast, usable interface to complex data and workflows.',
    summary:
      'Responsive, accessible web applications and dashboards, built for performance and designed to host AI features without compromising usability.',
    heroHeadline: 'Fast, accessible interfaces for complex work.',
    tags: ['React', 'TypeScript', 'Accessibility', 'Performance'],
    problemStatement: [
      'The interface is where business value is realised, or lost. Slow, inaccessible or confusing screens undermine good back-end systems.',
      'We build with a component-based approach, accessibility checks and performance budgets. When AI features are involved, the interface must also communicate uncertainty, allow correction and show sources.',
    ],
    useCases: [
      { title: 'Operational dashboards', text: 'Live views of work in progress, exceptions and key measures.' },
      { title: 'Review and approval tools', text: 'Interfaces for checking AI output, with side-by-side source views.' },
      { title: 'Customer portals', text: 'Secure self-service experiences across devices.' },
      { title: 'Marketing and product sites', text: 'Search-friendly sites that load quickly and are easy to maintain.' },
    ],
    capabilities: [
      { title: 'Component design systems', text: 'Reusable, consistent interface building blocks.' },
      { title: 'Accessibility', text: 'Keyboard support, semantic markup and contrast checks as standard.' },
      { title: 'Performance engineering', text: 'Budgets for bundle size and Core Web Vitals, measured rather than assumed.' },
      { title: 'AI interface patterns', text: 'Streaming responses, citations, feedback and human-correction flows.' },
      { title: 'Edge and cloud deployment', text: 'Hosting that matches your traffic, compliance and cost needs.' },
    ],
    workflowTitle: 'Interface delivery loop',
    workflow: [
      { label: 'Research', detail: 'Users, tasks, constraints' },
      { label: 'Design', detail: 'Flows, components, content' },
      { label: 'Build', detail: 'Typed, tested components' },
      { label: 'Test', detail: 'Accessibility, devices, speed' },
      { label: 'Release', detail: 'Monitor and refine' },
    ],
    implementation: [
      { phase: 'Task and content analysis', text: 'Find the few tasks the interface must make effortless.' },
      { phase: 'Prototype', text: 'Interactive prototypes tested with real users before full build.' },
      { phase: 'Build and verify', text: 'Component development with automated accessibility and visual checks.' },
      { phase: 'Launch and measure', text: 'Analytics, error tracking and performance monitoring from day one.' },
    ],
    integrations: ['REST and GraphQL back ends', 'Identity providers', 'Analytics', 'Content management', 'AI model gateways'],
    risks: [
      { title: 'Client-side weight', text: 'Heavy bundles hurt mobile users, so server rendering and code splitting are used where they help.' },
      { title: 'Accessibility regressions', text: 'Automated checks catch some issues, but manual keyboard and screen-reader testing is still required.' },
    ],
    faqs: [
      { q: 'Which frameworks do you use?', a: 'This site itself uses React and TypeScript. The right choice for a project depends on your team and constraints.' },
      { q: 'Can you work with our design team?', a: 'Yes. We can implement an existing design system or help create one.' },
    ],
    related: ['custom-software-development', 'cloud-ai-deployment', 'generative-ai-rag'],
    products: ['axicore'],
    industries: ['retail', 'professional-services'],
    cta: 'Discuss a web application',
  },
  {
    slug: 'data-engineering-analytics',
    name: 'Data Engineering & Analytics',
    icon: 'database',
    tone: 'standard',
    metaTitle: 'Data Engineering & Analytics',
    metaDescription:
      'Build the pipelines, models and reporting layers that make business data reliable enough for analytics and AI.',
    problem: 'Data is scattered, inconsistent and untrusted, which blocks analytics and AI.',
    summary:
      'Pipelines, data models and quality checks that make data dependable for reporting and AI, with clear lineage and ownership.',
    heroHeadline: 'Data foundations that AI can rely on.',
    tags: ['Pipelines', 'Data quality', 'Modelling', 'Reporting'],
    problemStatement: [
      'AI features inherit the weaknesses of the data beneath them. Duplicate customers, missing fields and unexplained numbers turn into unreliable outputs.',
      'Data engineering creates a consistent, documented layer: ingestion, transformation, quality checks and access controls that both people and models can trust.',
    ],
    useCases: [
      { title: 'Unified reporting', text: 'One consistent set of definitions across departments.' },
      { title: 'AI-ready datasets', text: 'Curated, permissioned data for retrieval and model evaluation.' },
      { title: 'Operational analytics', text: 'Near-real-time views of process performance.' },
      { title: 'System consolidation', text: 'Migrate and reconcile data during platform changes.' },
    ],
    capabilities: [
      { title: 'Ingestion pipelines', text: 'Batch and event-driven capture from databases, files and APIs.' },
      { title: 'Transformation and modelling', text: 'Tested, version-controlled transformations with documented definitions.' },
      { title: 'Data quality monitoring', text: 'Automated checks and alerts on freshness, completeness and anomalies.' },
      { title: 'Access governance', text: 'Role-based access and handling of sensitive fields.' },
      { title: 'Dashboards and reporting', text: 'Visual reports tied to agreed metric definitions.' },
    ],
    workflowTitle: 'Data pipeline layers',
    workflow: [
      { label: 'Sources', detail: 'Apps, files, APIs' },
      { label: 'Ingest', detail: 'Scheduled or streaming' },
      { label: 'Transform', detail: 'Clean, join, model' },
      { label: 'Serve', detail: 'Warehouse, APIs, features' },
      { label: 'Use', detail: 'Reports, AI, applications' },
    ],
    implementation: [
      { phase: 'Source and definition audit', text: 'Catalogue sources and agree how key measures are defined.' },
      { phase: 'Thin vertical slice', text: 'Deliver one end-to-end pipeline and report before scaling out.' },
      { phase: 'Quality and governance', text: 'Add tests, monitoring and access controls.' },
      { phase: 'Operate', text: 'Runbooks, alerting and a change process for new sources.' },
    ],
    integrations: ['Relational databases', 'Cloud data warehouses', 'SaaS application APIs', 'BI tools', 'Object storage'],
    risks: [
      { title: 'Disagreement on definitions', text: 'Metric definitions are a business decision. Unresolved ones surface as conflicting numbers.' },
      { title: 'Upstream change', text: 'Source systems change without warning, so pipelines need tests and alerting.' },
      { title: 'Privacy obligations', text: 'Consolidating personal data increases exposure and must follow applicable regulation.' },
    ],
    faqs: [
      { q: 'Do we need a data warehouse before AI work?', a: 'Not always. A focused dataset is often enough to start, and a warehouse can follow if justified.' },
      { q: 'Can you work in our cloud account?', a: 'That is typically the preferred arrangement for access control and cost visibility.' },
    ],
    related: ['generative-ai-rag', 'ai-consulting', 'cloud-ai-deployment'],
    products: ['axicore'],
    industries: ['financial-services', 'retail', 'manufacturing'],
    cta: 'Discuss your data foundations',
  },
  {
    slug: 'workflow-automation',
    name: 'Workflow Automation & System Integration',
    icon: 'workflow',
    tone: 'feature',
    metaTitle: 'Workflow Automation & System Integration',
    metaDescription:
      'Automate multi-system business processes with reliable integrations, approval steps and monitoring, adding AI only where it helps.',
    problem: 'People copy information between systems and chase approvals by email.',
    summary:
      'Reliable automation that connects your systems, routes approvals and handles exceptions, adding AI judgement only where rules alone fall short.',
    heroHeadline: 'Connect systems. Remove the manual hand-offs.',
    tags: ['Integration', 'Approvals', 'Event-driven', 'Monitoring'],
    problemStatement: [
      'Much operational effort goes to moving information between applications and waiting for someone to approve it. These hand-offs add delay and error but rarely need creativity.',
      'Most of that work is best handled with deterministic automation. AI is valuable at specific steps: reading an unstructured email, classifying a request or drafting a response, while the surrounding flow remains explicit and testable.',
    ],
    useCases: [
      { title: 'Order-to-cash and procure-to-pay', text: 'Synchronise records and approvals across finance and operations systems.' },
      { title: 'Customer onboarding', text: 'Coordinate checks, document collection and account creation.' },
      { title: 'Request routing', text: 'Classify and route internal or customer requests to the right team.' },
      { title: 'Exception handling', text: 'Detect and escalate cases that fall outside normal rules.' },
    ],
    capabilities: [
      { title: 'API and event integration', text: 'Connect systems through APIs, webhooks and message queues.' },
      { title: 'Process orchestration', text: 'Explicit state, retries, timeouts and compensation steps.' },
      { title: 'Human approval steps', text: 'Notifications, audit trails and escalation rules.' },
      { title: 'AI-assisted steps', text: 'Classification, extraction and drafting inside a controlled flow.' },
      { title: 'Operational monitoring', text: 'Dashboards and alerts for stuck or failing runs.' },
    ],
    workflowTitle: 'Automated process with human checkpoint',
    workflow: [
      { label: 'Trigger', detail: 'Event, email or schedule' },
      { label: 'Enrich', detail: 'Fetch data, classify with AI' },
      { label: 'Decide', detail: 'Rules and thresholds' },
      { label: 'Approve', detail: 'Human step if needed' },
      { label: 'Execute', detail: 'Update systems, log result' },
    ],
    implementation: [
      { phase: 'Process mapping', text: 'Document the real process, including exceptions and workarounds.' },
      { phase: 'Automation candidates', text: 'Choose steps by volume, rule clarity and risk.' },
      { phase: 'Build with observability', text: 'Every run is traceable, retryable and measurable.' },
      { phase: 'Phase in', text: 'Start with one process variant and extend as exceptions are understood.' },
    ],
    integrations: ['ERP and finance systems', 'CRM and ticketing', 'Email and messaging', 'Identity and approvals', 'Legacy and file-based systems'],
    risks: [
      { title: 'Automating a broken process', text: 'Automation speeds up whatever it is given. Process clean-up often comes first.' },
      { title: 'Fragile integrations', text: 'Vendor API changes can break flows. Contract tests and alerts reduce this risk.' },
      { title: 'Exception volume', text: 'If exceptions are common, the human review design matters more than the happy path.' },
    ],
    faqs: [
      { q: 'Do we need AI for automation?', a: 'Often not. We use AI only for steps that need interpretation of unstructured input.' },
      { q: 'Can you integrate legacy systems?', a: 'Often, through database access, file exchange or UI-level options, once the constraints are understood.' },
    ],
    related: ['ai-agent-development', 'intelligent-document-processing', 'custom-software-development'],
    products: ['axidoc', 'axicore'],
    industries: ['logistics', 'manufacturing', 'financial-services'],
    cta: 'Discuss a workflow to automate',
  },
  {
    slug: 'cloud-ai-deployment',
    name: 'AI Deployment, Monitoring & Optimisation',
    icon: 'cloud',
    tone: 'compact',
    metaTitle: 'AI Deployment, Monitoring & Optimisation',
    metaDescription:
      'Take AI systems from prototype to production with secure deployment, evaluation, observability, cost control and ongoing improvement.',
    problem: 'A working prototype is not the same as a reliable production service.',
    summary:
      'Production deployment, evaluation, observability and cost control for AI systems, so quality can be measured and maintained after launch.',
    heroHeadline: 'Keep AI systems reliable after launch.',
    tags: ['Deployment', 'Evaluation', 'Observability', 'Cost control'],
    problemStatement: [
      'AI systems change behaviour when models, prompts, data or inputs change. Without measurement, quality drifts and nobody notices until users complain.',
      'Operating AI requires the same discipline as any production service, plus evaluation sets, traceability of model calls and cost and latency tracking.',
    ],
    useCases: [
      { title: 'Prototype hardening', text: 'Make an experimental system secure, scalable and supportable.' },
      { title: 'Model and prompt change control', text: 'Test changes against an evaluation set before release.' },
      { title: 'Cost and latency tuning', text: 'Reduce spend and response time without losing quality.' },
      { title: 'Incident readiness', text: 'Alerts, fallbacks and runbooks for model or provider outages.' },
    ],
    capabilities: [
      { title: 'Deployment pipelines', text: 'Repeatable releases with environments, secrets management and rollback.' },
      { title: 'Evaluation in CI', text: 'Automated regression tests against curated cases.' },
      { title: 'Tracing and logging', text: 'Inputs, outputs, tool calls and timings, with sensitive data handled appropriately.' },
      { title: 'Cost and usage controls', text: 'Budgets, rate limits and caching.' },
      { title: 'Security and access', text: 'Least privilege, data segregation and abuse protection.' },
    ],
    workflowTitle: 'Operate-and-improve loop',
    workflow: [
      { label: 'Release', detail: 'Tested, versioned deploy' },
      { label: 'Observe', detail: 'Traces, metrics, cost' },
      { label: 'Evaluate', detail: 'Compare against test set' },
      { label: 'Improve', detail: 'Prompts, retrieval, models' },
      { label: 'Re-release', detail: 'Gated by results' },
    ],
    implementation: [
      { phase: 'Readiness review', text: 'Assess security, data handling, failure modes and ownership.' },
      { phase: 'Instrument', text: 'Add tracing, metrics and an evaluation set.' },
      { phase: 'Harden and launch', text: 'Fallbacks, rate limits and staged rollout.' },
      { phase: 'Continuous improvement', text: 'Regular review of metrics, feedback and cost.' },
    ],
    integrations: ['Cloud platforms', 'CI/CD systems', 'Monitoring and logging tools', 'Secrets management', 'Model provider APIs'],
    risks: [
      { title: 'Provider dependency', text: 'Model changes or outages can alter behaviour. Version pinning and fallbacks reduce exposure.' },
      { title: 'Evaluation limits', text: 'Test sets cover only known cases, so production feedback must refresh them.' },
      { title: 'Privacy in logs', text: 'Traces can contain personal data and need retention and access policies.' },
    ],
    faqs: [
      { q: 'Can you operate it for us?', a: 'Support and operating arrangements can be agreed as part of the engagement.' },
      { q: 'Do you work with our existing cloud?', a: 'Yes, where practical. Deployment target is confirmed during scoping.' },
    ],
    related: ['ai-agent-development', 'custom-software-development', 'data-engineering-analytics'],
    products: ['axicore'],
    industries: ['financial-services', 'healthcare'],
    cta: 'Discuss production readiness',
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);

/** Services are grouped by the kind of work, in this order, for the header menu and the services page. */
export const serviceGroups: { slug: string; title: string; text: string; services: string[] }[] = [
  { slug: 'strategy', title: 'Strategy & advisory', text: 'Decide what is worth building before anything is built.', services: ['ai-consulting'] },
  { slug: 'ai-solutions', title: 'AI solutions', text: 'Agents, retrieval, document and voice intelligence.', services: ['ai-agent-development', 'generative-ai-rag', 'intelligent-document-processing', 'voice-ai'] },
  { slug: 'software', title: 'Software & web engineering', text: 'Custom software and web applications built to last.', services: ['custom-software-development', 'web-application-development'] },
  { slug: 'data-ops', title: 'Data, automation & operations', text: 'The foundations that keep AI and software running.', services: ['data-engineering-analytics', 'workflow-automation', 'cloud-ai-deployment'] },
];
