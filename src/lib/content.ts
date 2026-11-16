// All portfolio text lives here — edit this file to update the site.

export const profile = {
  name: "Saravanan R",
  title: "Full-Stack Developer · FinTech & Digital Lending",
  tagline:
    "Two years building a digital lending platform used by banks, finance companies and their partner agents, from React screens to Go back ends.",
  location: "Tiruppur, Tamil Nadu, India",
  coords: "11.11° N, 77.34° E",
  availability: "Open to work: on-site, hybrid or remote",
  email: "saravanan.rv22@gmail.com",
  linkedin: "https://www.linkedin.com/in/saravanan-webdeveloper/",
};

// Short summary used for search results and link previews.
export const summary =
  "Full-stack software engineer with over two years of experience in FinTech. I build loan management software used by lenders and partner agents: automatic document reading for 15+ document types, loan approval reports, a customer service request system and automated partner payments, using Go, React and TypeScript.";

export const about =
  "I’m a full-stack software engineer with over two years of experience building a digital lending platform. Banks, finance companies and their partner agents use it to take in loan applications, check customer documents, approve loans and manage each loan from start to finish. I work on both sides: the screens people use every day, and the back end that stores data, applies business rules and produces reports. I also handle clients directly and work closely with finance and operations teams to turn their needs into working software.";

export const stats = [
  { value: "2+", label: "Years in FinTech" },
  { value: "650+", label: "Reviewed code changes" },
  { value: "70K", label: "Lines of code written" },
  { value: "20+", label: "Business areas covered" },
];

export const skills = [
  {
    group: "Languages",
    items: ["Go (Golang)", "Python", "TypeScript", "JavaScript", "SQL", "HTML / CSS"],
  },
  {
    group: "Front end",
    items: ["React", "TypeScript", "Monorepo setup", "Shadcn UI", "Tailwind CSS", "Config-driven forms"],
  },
  {
    group: "Back end",
    items: ["Go Fiber", "FastAPI", "REST APIs", "MySQL", "PostgreSQL", "Redis", "Node.js / Express", "MongoDB"],
  },
  {
    group: "AI / OCR",
    items: ["RapidOCR (PP-OCR)", "PaddleOCR-VL", "vLLM", "ONNX Runtime (GPU)", "PDF parsing"],
  },
  {
    group: "Cloud & tools",
    items: ["AWS S3 (file storage)", "AWS SES (email)", "Docker", "nginx", "Prometheus / Grafana", "GitHub Actions", "Git", "Bitbucket"],
  },
  {
    group: "Integrations",
    items: [
      "AI / OCR document reading",
      "PDF report generation",
      "Excel export",
      "Credit bureau data",
      "Lender API integration",
      "eSign API (third-party)",
      "Email & SMS notification APIs",
      "IAAS API",
    ],
  },
  {
    group: "Lending domain",
    items: [
      "Loan origination",
      "KYC document checks",
      "Credit appraisal (CAM)",
      "GST & tax return data",
      "Collections",
      "Partner commission & GST",
    ],
  },
  {
    group: "Ways of working",
    items: [
      "Client handling",
      "Understanding business needs",
      "Working with finance & operations",
      "Code reviews",
      "Teamwork",
    ],
  },
];

// Four core strengths, dealt out as cards between About and Stack. The back of
// each card says where I have used them for real.
export const strengths = [
  {
    title: "Back end",
    items: ["Go Fiber", "FastAPI", "MySQL", "PostgreSQL", "Redis"],
    used: [
      { where: "At work", what: "Go Fiber, MySQL and Redis back ends for a lending platform: loan rules, reports, partner payouts" },
      { where: "LendOCR", what: "FastAPI and PostgreSQL: API keys, rate limits, a job queue and signed webhooks" },
    ],
  },
  {
    title: "Front end",
    items: ["React", "TypeScript", "Tailwind CSS", "Shadcn UI"],
    used: [
      { where: "At work", what: "React and TypeScript screens for staff, partners and customers, with config-driven loan forms" },
      { where: "This site", what: "Next.js, React 19, Motion and Three.js" },
    ],
  },
  {
    title: "AI / OCR",
    items: ["RapidOCR", "PaddleOCR-VL", "vLLM", "ONNX Runtime GPU"],
    used: [
      { where: "At work", what: "Integrated an AI / OCR service that reads 15+ Indian document types" },
      { where: "LendOCR", what: "RapidOCR on the GPU and PaddleOCR-VL on vLLM: about 0.15 s per card" },
    ],
  },
  {
    title: "Lending",
    items: ["Loan origination", "KYC checks", "Credit appraisal", "Collections"],
    used: [
      { where: "At work", what: "Loan journeys, KYC, CAM reports, collections and partner commission with GST" },
      { where: "LendOCR", what: "Bank statement analysis: salary, EMIs, cheque bounces and tamper checks" },
    ],
  },
];

export const experience = [
  {
    role: "Full Stack Developer",
    company: "Inforvio Technologies",
    type: "Full-time · On-site · FinTech",
    period: "Sep 2024 — Present",
    description:
      "Full-stack work on a digital lending platform used by banks, finance companies and partner agents: loan applications, document checks, approvals, accounting and the full loan lifecycle. I also handle clients directly.",
    highlights: [
      "Recent: two-wheeler loan lender integration",
      "650+ reviewed code changes across 3 projects",
      "About 70,000 lines of code",
      "Go Fiber · React · TypeScript · MySQL · Redis · AWS",
    ],
  },
  {
    role: "Full Stack Developer Intern",
    company: "itboomi innovations",
    type: "Tiruppur · On-site",
    period: "Feb 2024 — Jul 2024",
    description:
      "Built features with MongoDB and applied SEO best practices to web projects.",
    highlights: [] as string[],
  },
];

// Steps of the two-wheeler loan lender integration (shown in the phone visual).
export const lenderSteps = [
  "Application create",
  "eKYC",
  "Video KYC",
  "Down payment confirmation",
  "Vehicle verification",
  "eNACH mandate",
  "eSign",
  "Delivery OTP",
];

// Headline results from the lending platform, shown in the FinTech section.
export const achievements = [
  {
    title: "Lender API integration",
    tag: "Recent · Two-wheeler loans",
    metric: "8-step loan journey, end to end",
    description:
      "Connected the platform to a lending partner’s APIs for two-wheeler loans, covering every step from creating the application to vehicle delivery. I also integrated the IAAS API.",
    visual: "journey",
  },
  {
    visual: "scan",
    title: "Automatic document reading",
    tag: "AI / OCR integration",
    metric: "15+ document types",
    description:
      "Customer documents such as Aadhaar, PAN, GST certificates, cheques, driving licences and utility bills are read automatically, and unclear or wrong documents are flagged. This removes manual typing and speeds up loan processing.",
  },
  {
    visual: "report",
    title: "Loan approval (CAM) report",
    tag: "Credit appraisal · PDF",
    metric: "One ready-to-print PDF",
    description:
      "The report loan officers use to decide on a business loan. It pulls together tax returns, GST data, credit score, financial health, risk rating and the loan offers available.",
  },
  {
    visual: "requests",
    title: "Customer service requests",
    tag: "Workflow & approvals",
    metric: "Raised → approved → completed",
    description:
      "A system for after-loan requests such as a loan closure quote or a change of details, with rules for who can approve what, required documents and a full history for each request.",
  },
  {
    visual: "invoice",
    title: "Partner payments & invoices",
    tag: "Finance automation",
    metric: "Replaced manual spreadsheets",
    description:
      "Monthly commission for partner agents is calculated automatically, with PDF invoices and GST records generated each month.",
  },
  {
    visual: "config",
    title: "Configurable loan journeys",
    tag: "Config-driven product",
    metric: "No developer needed",
    description:
      "Business teams change loan application steps and forms through settings, so new products and changes go live without waiting for a release.",
  },
];

// Where my work sits in the loan lifecycle.
export const lifecycle = [
  {
    stage: "Apply",
    items: [
      "OTP verification",
      "Digital signing through a third-party eSign API",
      "Address entry with PIN code lookup",
      "Vehicle selection for vehicle loans",
      "EMI calculator",
      "Lender offer comparison",
      "Customer portal: uploads, eligible lenders, status tracking",
    ],
  },
  {
    stage: "Verify",
    items: [
      "Automatic reading of 15+ KYC and business documents",
      "Flags for wrong or unclear documents",
      "Field verification reports for home, office and property visits",
    ],
  },
  {
    stage: "Assess",
    items: [
      "Loan assessment (CAM) report",
      "Credit bureau report: history and recent enquiries",
      "Tax return, GST and credit score data in one view",
    ],
  },
  {
    stage: "Approve",
    items: [
      "Approval-authority table: who can approve which amount",
      "Lead search with filters",
      "Click-to-call for calling teams",
    ],
  },
  {
    stage: "Service",
    items: [
      "After-loan service requests with approvals and history",
      "Loan due details with corrected interest calculations",
      "Email notification templates with preview",
    ],
  },
  {
    stage: "Collect",
    items: [
      "Collection reports: visits and payments from customers who have fallen behind",
    ],
  },
];

// Everything I built, area by area. Follows the "What I built" section of my
// own write-up, plus third-party integrations and client handling.
export const workAreas = [
  {
    title: "Reports for loan approval and field checks",
    points: [
      "Loan assessment (CAM) report: income, tax, GST, credit score, risk rating and loan offers, as a PDF",
      "Credit bureau report: the customer’s credit history and recent loan enquiries, as a PDF",
      "Field verification reports for home, office and property visits, with photos and findings",
      "Loan recovery (collection) reports: visits and payments from customers who have fallen behind",
    ],
  },
  {
    title: "Automatic document reading",
    points: [
      "Connected the platform to an AI / OCR document-reading service",
      "Uploaded ID and business documents fill in their details automatically",
      "15+ Indian document types, with wrong or unclear documents flagged",
    ],
  },
  {
    title: "Customer service requests",
    points: [
      "Full after-loan request process: raise, approve, required documents, complete",
      "Rules for who can approve what",
      "A clear history for every request",
    ],
  },
  {
    title: "Accounting and finance",
    points: [
      "Accounting entries: quick filters and one-click Excel export for the finance team",
      "Partner commission: automatic earnings, monthly PDF invoices and GST records",
      "Loan due details: corrected interest calculations for customers and staff",
    ],
  },
  {
    title: "Sales targets and territories",
    points: [
      "Sales targets for teams and regions, with weekly and monthly progress and gap from target",
      "Mapping of staff and partner agents to the regions they cover",
    ],
  },
  {
    title: "Screens for staff, partners and customers",
    points: [
      "Loan application steps: OTP checks, PIN code lookup, vehicle selection, EMI calculator, lender offer comparison",
      "Partner management: register partners, bulk upload from a file, sub-partners and approvals",
      "Staff tools: approval-authority table, lead search with filters, click-to-call",
      "Branding: each client company sees its own logo and settings",
      "Customer portal: upload and preview documents, see eligible lenders, track application status",
    ],
  },
  {
    title: "Third-party integrations",
    points: [
      "Lender API integration for two-wheeler loans",
      "eSign API for digital signing of documents",
      "Email notifications through a third-party provider, with templates and a preview before sending",
      "SMS / mobile notifications through a third-party provider",
      "IAAS API integration",
    ],
  },
  {
    title: "Client handling and teamwork",
    points: [
      "Client handling: working directly with client companies",
      "Reviewed and approved teammates’ code for new lender partner connections",
      "Working with finance and operations teams to understand business needs",
    ],
  },
];

// Main project. The API code is private (it is a commercial product); the
// product website is public and shows real API output.
export const lendOcr = {
  name: "LendOCR",
  subtitle: "OCR API for Indian KYC and loan documents",
  status: "Working MVP",
  started: "Nov 2026",
  label: "Python · FastAPI · GPU OCR",
  repo: "",
  site: "https://saravanan-22.github.io/lendocr-website/",
  oneLiner:
    "An API that reads 14 kinds of Indian KYC and loan documents (photos, scans or PDFs) and returns checked, structured JSON in about 0.2 seconds, with a clear flag when a person should look.",
  problem:
    "Lenders still type PAN, Aadhaar, bank statement and salary slip details by hand, or pay per document for OCR that reads text but doesn’t check it. A wrong digit in a PAN or a doctored bank statement goes straight into the loan file.",
  solution:
    "A production-style API: open-source OCR models on the GPU, a validator for every number (Verhoeff, GSTIN, MRZ check digits, IFSC), bank statement analysis, API keys with quotas, background jobs with signed webhooks, and monitoring. Built and tested end to end on a laptop at zero cost.",
  modules: [
    {
      name: "Read 14 documents",
      tag: "OCR + validation",
      points: [
        "PAN, Aadhaar, voter ID, driving licence, passport, cheque, bank statement, utility bills, motor insurance, ITR-V, salary slip, GST and Udyam",
        "Detects the document type; digital PDFs read directly, scans and password-protected PDFs rendered and OCR’d",
        "Aadhaar Verhoeff, GSTIN mod-36, passport MRZ check digits, PAN / DL / vehicle formats; OCR slips repaired only where a checksum proves it",
      ],
    },
    {
      name: "Bank statement analysis",
      tag: "Lending logic",
      points: [
        "Every transaction categorised: salary, EMI, ATM, cheque bounce, cash deposit",
        "Monthly salary, EMI load, bounces and average daily balance for the credit decision",
        "Tamper check: re-adds every row and flags balances that don’t carry forward",
      ],
    },
    {
      name: "Sold as an API",
      tag: "Security",
      points: [
        "Live and test API keys stored only as HMAC-SHA256 hashes, with scopes per key",
        "Token-bucket rate limits shared through Postgres, monthly quotas and usage metering",
        "Admin API and CLI to create organisations and keys; no document is stored by the extract API",
      ],
    },
    {
      name: "Built to scale",
      tag: "Reliability",
      points: [
        "Concurrency gate with backpressure (503 + Retry-After), batch uploads, nginx load balancer over replicas",
        "Postgres job queue (SKIP LOCKED, leases, retries), AES-256-GCM encrypted files, HMAC-signed webhooks",
        "Prometheus metrics, Grafana dashboard, 8 alert rules; about 15 documents per second on one GPU",
      ],
    },
  ],
  // Inner ring of the stack orbit: the core service.
  core: ["Python", "FastAPI", "PostgreSQL"],
  stack: [
    "Python",
    "FastAPI",
    "PostgreSQL",
    "RapidOCR (PP-OCR)",
    "PaddleOCR-VL",
    "vLLM",
    "ONNX Runtime GPU",
    "Docker Compose",
    "nginx",
    "Prometheus · Grafana",
    "pytest · GitHub Actions",
  ],
  // Real commits from the (private) repo, oldest first.
  history: [
    { hash: "5aa2586", scope: "feat(validate)", build: "Checksum validators and FastAPI skeleton" },
    { hash: "13631df", scope: "perf(ocr)", build: "RapidOCR on the GPU, about 8× faster" },
    { hash: "e5feaf7", scope: "feat(vl)", build: "PaddleOCR-VL accurate tier served by vLLM" },
    { hash: "0947662", scope: "feat(docs)", build: "Extractors for 14 documents and statement analysis" },
    { hash: "8e0cf5d", scope: "feat(auth)", build: "API keys, rate limits, quotas, usage metering" },
    { hash: "73e07d6", scope: "test(eval)", build: "Accuracy harness on blurred, rotated, dim copies" },
    { hash: "4ad4025", scope: "feat(scale)", build: "Backpressure, batch, nginx load balancer" },
    { hash: "bfb6b8b", scope: "feat(jobs)", build: "Background jobs, signed webhooks, monitoring" },
  ],
  historyEnd: "160 tests · CI passing",
  results: [
    { value: "14", label: "Indian document types" },
    { value: "0.15 s", label: "Per card on a laptop GPU" },
    { value: "100%", label: "Fields read on the test set*" },
    { value: "160", label: "Automated tests in CI" },
  ],
  resultsNote:
    "*552 fields across 107 synthetic documents, including blurred, rotated, compressed and phone-photo copies, with no wrong field left unflagged. Real-world accuracy is measured per customer in a pilot.",
};

// Real API responses for synthetic sample documents (shortened), shown in the
// LendOCR console panel.
export const lendOcrApi = [
  {
    label: "Extract",
    request: "POST /v1/documents:extract  pan.jpg",
    response: `{
  "document_type": "pan",
  "fields": {
    "pan":  { "value": "ABCPK1234F", "confidence": 1.0 },
    "name": { "value": "RAVI KUMAR", "confidence": 0.992 },
    "dob":  { "value": "1990-04-12", "confidence": 1.0 }
  },
  "checks": {
    "pan_format": true,
    "name_matches_pan": true
  },
  "needs_review": false,
  "processing_ms": 148
}`,
  },
  {
    label: "Statement",
    request: "POST /v1/documents:extract  statement.pdf",
    response: `{
  "document_type": "bank_statement",
  "checks": {
    "balance_continuity": true,
    "closing_balance_matches": true
  },
  "data": { "analysis": {
    "salary":   { "monthly_estimate": "53000.00" },
    "emi_loan": { "monthly_average": "18500.00" },
    "bounces":  { "count": 1 },
    "average_balance": "84915.02"
  } },
  "needs_review": false,
  "processing_ms": 19
}`,
  },
  {
    label: "Jobs",
    request: "POST /v1/jobs  20 files + webhook_url",
    response: `{
  "jobs": [
    { "id": "job_7f3c…", "status": "queued",
      "file_name": "statement_oct.pdf", "attempts": 0 },
    …19 more
  ]
}
→ 202 Accepted  in 52 ms

POST https://lender.example/hooks
X-LendOCR-Signature: t=1763190000,v1=9b1e…
{ "event": "job.succeeded",
  "document_type": "bank_statement", "needs_review": false }`,
  },
];

// Earlier learning projects, shown last.
export const learningProjects = [
  {
    name: "Open Question Database",
    stack: "MERN stack",
    note: "My first full-stack project, built while learning the MERN stack.",
    description:
      "A Q&A platform where users can sign up, then post, filter, upvote, comment on and answer questions on any topic.",
    tech: ["MongoDB", "Express.js", "React.js", "Node.js", "CSS", "Git"],
    live: "https://openquestionsadddatabase.netlify.app/",
    image: "/projects/open-question-database.jpg",
    year: "2023",
  },
];

export const education = [
  {
    title: "Web Development Course (MERN Stack)",
    place: "Skill Safari",
    period: "2023 — 2024",
  },
  {
    title: "BBA, Business Administration and Management",
    place: "Nandha Arts and Science College",
    period: "2017 — 2020",
  },
];

export const certifications = [
  { title: "Full Stack Web Development", issuer: "Skill Safari", year: "2023" },
  {
    title: "Career Essentials in Software Development",
    issuer: "Microsoft and LinkedIn",
    year: "2023",
  },
  {
    title: "Programming Foundations: Fundamentals & Beyond the Fundamentals",
    issuer: "LinkedIn",
    year: "2023",
  },
  {
    title: "HTML Essential Training & CSS Essential Training",
    issuer: "LinkedIn",
    year: "2023",
  },
];

// Future learning plan: advanced back-end topics, each practised on a real build.
export const learningPlan = [
  {
    phase: "Now",
    when: "Nov – Dec 2026",
    title: "Go internals & money-safe data",
    topics: [
      {
        name: "Go concurrency in depth",
        why: "Goroutines, channels, worker pools, context cancellation and pprof profiling.",
        practice: "Go worker pool for a document queue",
      },
      {
        name: "Transactions & isolation levels",
        why: "ACID, row locks and optimistic locking so balances never drift.",
        practice: "Race-free repayment tests",
      },
      {
        name: "Double-entry ledger design",
        why: "Record every rupee as matching debits and credits, with a full audit trail.",
        practice: "Ledger module for EMI repayments",
      },
    ],
  },
  {
    phase: "Next",
    when: "Jan – Mar 2027",
    title: "Events & reliability",
    topics: [
      {
        name: "Event-driven architecture",
        why: "Kafka / NATS topics, consumer groups and replay for loan status events.",
        practice: "Publish document-processed events",
      },
      {
        name: "Outbox pattern & sagas",
        why: "Keep the database and messages in sync across multi-step loan flows.",
        practice: "Saga for a disbursal workflow",
      },
      {
        name: "Resilient lender integrations",
        why: "Idempotency keys, retries with backoff, circuit breakers and dead-letter queues.",
        practice: "Retry-safe webhook receiver",
      },
    ],
  },
  {
    phase: "Then",
    when: "Apr – Jun 2027",
    title: "Scale & performance",
    topics: [
      {
        name: "Microservices with gRPC",
        why: "Service boundaries, protobuf contracts and API versioning.",
        practice: "Split OCR into a gRPC service",
      },
      {
        name: "Advanced Redis",
        why: "Cache-aside, rate limiting, distributed locks and Redis Streams.",
        practice: "Per-client API rate limiter",
      },
      {
        name: "Database scaling",
        why: "Query plans, indexing, partitioning, read replicas and connection pooling.",
        practice: "Partition a large transactions table",
      },
    ],
  },
  {
    phase: "Later",
    when: "Jul – Sep 2027",
    title: "Operate & secure at scale",
    topics: [
      {
        name: "Observability",
        why: "OpenTelemetry traces, Prometheus metrics, Grafana dashboards and structured logs.",
        practice: "Trace one request end to end",
      },
      {
        name: "Security for financial data",
        why: "OAuth2 / OIDC, encryption, secrets management, PII masking and audit logs.",
        practice: "Field-level encryption + audit log",
      },
      {
        name: "Kubernetes & infrastructure as code",
        why: "Production containers, autoscaling, Terraform and CI/CD pipelines.",
        practice: "Deploy LendOCR to Kubernetes",
      },
    ],
  },
];

export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#stack", label: "Stack" },
  { href: "#experience", label: "Experience" },
  { href: "#fintech", label: "FinTech" },
  { href: "#work", label: "Projects" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#contact", label: "Contact" },
];
