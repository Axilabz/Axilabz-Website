/**
 * Enquiry validation shared by the browser form and the API route, so both
 * enforce exactly the same rules. No imports: it is also run by node:test.
 */

export const INTEREST_OPTIONS = [
  { value: 'general', label: 'General enquiry / partnership' },
  { value: 'axisolve', label: 'AxiSolve — custom AI or software solution' },
  { value: 'axidoc', label: 'AxiDoc — product enquiry' },
  { value: 'axicore', label: 'AxiCore — product enquiry' },
  { value: 'axidata', label: 'AxiData — product enquiry' },
  { value: 'careers-fde', label: 'Careers: Forward Deployed Engineer' },
  { value: 'ai-consulting', label: 'Service: AI consulting & strategy' },
  { value: 'ai-agent-development', label: 'Service: AI agent development' },
  { value: 'generative-ai-rag', label: 'Service: Generative AI & RAG' },
  { value: 'intelligent-document-processing', label: 'Service: Intelligent document processing' },
  { value: 'voice-ai', label: 'Service: Voice AI' },
  { value: 'custom-software-development', label: 'Service: Custom software development' },
  { value: 'web-application-development', label: 'Service: Web application development' },
  { value: 'data-engineering-analytics', label: 'Service: Data engineering & analytics' },
  { value: 'workflow-automation', label: 'Service: Workflow automation & integration' },
  { value: 'cloud-ai-deployment', label: 'Service: AI deployment & monitoring' },
] as const;

export const BUDGET_OPTIONS = [
  { value: '', label: 'Prefer not to say' },
  { value: 'exploring', label: 'Still exploring' },
  { value: 'small', label: 'Small project / pilot' },
  { value: 'medium', label: 'Mid-size project' },
  { value: 'large', label: 'Large programme' },
] as const;

export const TIMELINE_OPTIONS = [
  { value: '', label: 'Prefer not to say' },
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-3-months', label: 'Within 1–3 months' },
  { value: '3-6-months', label: 'Within 3–6 months' },
  { value: 'later', label: 'Later / no fixed date' },
] as const;

const interestSet = new Set<string>(INTEREST_OPTIONS.map((o) => o.value));
const budgetSet = new Set<string>(BUDGET_OPTIONS.map((o) => o.value));
const timelineSet = new Set<string>(TIMELINE_OPTIONS.map((o) => o.value));

export type Enquiry = {
  submissionId: string;
  name: string;
  email: string;
  company: string;
  interest: string;
  message: string;
  budget: string;
  timeline: string;
};

export type FieldErrors = Partial<Record<'name' | 'email' | 'company' | 'interest' | 'message' | 'budget' | 'timeline' | 'consent', string>>;

export type ValidationResult = { ok: true; data: Enquiry } | { ok: false; errors: FieldErrors };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Control characters (other than tab/newline) have no place in a contact form.
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export function validateEnquiry(input: unknown): ValidationResult {
  const d = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const errors: FieldErrors = {};

  const name = str(d.name);
  const email = str(d.email).toLowerCase();
  const company = str(d.company);
  const interest = str(d.interest) || 'general';
  const message = str(d.message);
  const budget = str(d.budget);
  const timeline = str(d.timeline);
  const submissionId = str(d.submissionId);

  if (name.length < 2 || name.length > 100 || CONTROL.test(name)) errors.name = 'Please enter your name (2–100 characters).';
  if (email.length > 254 || !EMAIL.test(email)) errors.email = 'Please enter a valid email address.';
  if (company.length > 150 || CONTROL.test(company)) errors.company = 'Company name is too long (150 characters maximum).';
  if (!interestSet.has(interest)) errors.interest = 'Please choose one of the listed options.';
  if (message.length < 20) errors.message = 'Tell us a little more (at least 20 characters).';
  else if (message.length > 5000) errors.message = 'Please keep your message under 5,000 characters.';
  else if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(message)) errors.message = 'Your message contains unsupported characters.';
  if (!budgetSet.has(budget)) errors.budget = 'Please choose one of the listed options.';
  if (!timelineSet.has(timeline)) errors.timeline = 'Please choose one of the listed options.';
  if (d.consent !== true && d.consent !== 'on') errors.consent = 'Please agree so we can respond to your enquiry.';

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: { submissionId: UUID.test(submissionId) ? submissionId.toLowerCase() : '', name, email, company, interest, message, budget, timeline },
  };
}

export const interestLabel = (value: string) => INTEREST_OPTIONS.find((o) => o.value === value)?.label ?? value;
