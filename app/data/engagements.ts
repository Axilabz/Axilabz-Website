export const engagements = [
  {
    "name": "AI Technical Assessment",
    "problem": "“We need a clear technical direction.”",
    "icon": "compass",
    "tag": "CLARITY BEFORE COMMITMENT",
    "title": "Know what to build.\nAnd what to fix first.",
    "description": "A focused review of your AI application, architecture or proposed solution—so your next investment has a clear technical basis.",
    "fit": "An idea that needs validation, a prototype with unanswered questions, or an application that needs a second look.",
    "outputs": [
      "Architecture and implementation review",
      "Prioritised findings and recommendations",
      "A practical roadmap and implementation estimate"
    ],
    "scope": "One application or clearly bounded workflow. Access, review depth and schedule are agreed together.",
    "next": "An assessment you can act on."
  },
  {
    "name": "Prototype-to-Production Sprint",
    "problem": "“Our prototype needs to work in the real world.”",
    "icon": "layers",
    "tag": "FROM DEMO TO DELIVERY",
    "title": "Give your prototype\na production plan.",
    "description": "Address the agreed gaps between a working demo and a usable deployment, with reliability and operational needs in view.",
    "fit": "Teams with a working AI prototype and a defined path to real users.",
    "outputs": [
      "Scoped implementation and deployment changes",
      "Tests, monitoring and operational documentation",
      "A handover with known limitations and next steps"
    ],
    "scope": "One validated workflow and an agreed target environment. Readiness depends on the current system and the gaps we uncover.",
    "next": "A deployment evaluated against agreed criteria."
  },
  {
    "name": "AI Integration Sprint",
    "problem": "“We want AI inside the tools we already use.”",
    "icon": "link",
    "tag": "CONNECT CAPABILITY TO WORK",
    "title": "Bring AI into\nyour existing workflow.",
    "description": "Connect a focused AI capability to an existing application or business process, from document extraction to a tool-using assistant.",
    "fit": "Teams with a clear workflow, an existing system and an identified integration point.",
    "outputs": [
      "A scoped, working application integration",
      "API contracts, tests and error handling",
      "Integration documentation and handover"
    ],
    "scope": "One capability with agreed systems, access and data boundaries.",
    "next": "A working connection, with a clear handover."
  },
  {
    "name": "Performance & Cost Review",
    "problem": "“It works, but it is too slow or expensive.”",
    "icon": "activity",
    "tag": "MEASURE. IMPROVE. VERIFY.",
    "title": "Find the bottleneck.\nMeasure the difference.",
    "description": "Benchmark the current workflow, test targeted changes and make the quality, latency and cost trade-offs visible.",
    "fit": "An existing model-powered application with representative workloads and a measurable performance problem.",
    "outputs": [
      "A baseline benchmark and bottleneck analysis",
      "Tested optimisation recommendations",
      "Before-and-after results on the agreed workload"
    ],
    "scope": "One workload with agreed quality and cost metrics. Improvement is measured, never assumed.",
    "next": "Evidence for your next optimisation decision."
  },
  {
    "name": "Agent Reliability Assessment",
    "problem": "“Our agent gets stuck or makes mistakes.”",
    "icon": "shield",
    "tag": "MORE CONFIDENCE IN EVERY STEP",
    "title": "Understand failures.\nStrengthen the workflow.",
    "description": "Evaluate an agent’s tool use, context handling and recovery behaviour, and turn observed failures into a practical improvement plan.",
    "fit": "Teams with an existing AI agent and representative tasks, tool integrations or failure examples.",
    "outputs": [
      "A representative evaluation suite",
      "Failure analysis across the agent workflow",
      "Prioritised fixes and a regression-testing plan"
    ],
    "scope": "One agent workflow and an agreed set of representative tasks and tool boundaries.",
    "next": "A clearer route to dependable behaviour."
  }
] as const;
