import {
  AudioLines, Bot, BrainCircuit, Boxes, CloudUpload, Code2, Database, FileText, Globe, Lightbulb,
  Workflow, ShieldCheck, Network, Cpu, Sparkles, ArrowRight, ArrowUpRight, Check, Rocket, Layers3,
  Users, ChartNoAxesCombined, Search, Box, Settings, FlaskConical, type LucideIcon,
} from 'lucide-react';

const icons = {
  audio: AudioLines, bot: Bot, brain: BrainCircuit, core: Boxes, cloud: CloudUpload, code: Code2,
  database: Database, file: FileText, globe: Globe, lightbulb: Lightbulb, workflow: Workflow,
  shield: ShieldCheck, network: Network, cpu: Cpu, sparkles: Sparkles, arrow: ArrowRight,
  arrowUp: ArrowUpRight, check: Check, rocket: Rocket, layers: Layers3, users: Users,
  chart: ChartNoAxesCombined, search: Search, box: Box, settings: Settings, flask: FlaskConical,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

export function Icon({ name, size = 24, className }: { name: IconName; size?: number; className?: string }) {
  const Cmp = icons[name];
  return <Cmp size={size} className={className} aria-hidden="true" />;
}
