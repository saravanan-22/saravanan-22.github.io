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
    items: ["Go (Golang)", "TypeScript", "JavaScript", "SQL", "HTML / CSS"],
  },
  {
    group: "Front end",
    items: ["React", "TypeScript", "Monorepo setup", "Shadcn UI", "Tailwind CSS", "Config-driven forms"],
  },
  {
    group: "Back end",
    items: ["Go Fiber", "REST APIs", "MySQL", "Redis", "Node.js / Express", "MongoDB"],
  },
  {
    group: "Cloud & tools",
    items: ["AWS S3 (file storage)", "AWS SES (email)", "Docker", "Git", "Bitbucket"],
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

// Main project: in progress. Fill in `repo` / `demo` once they are public.
export const loanDocs = {
  name: "LoanDocs",
  subtitle: "OCR + PDF toolkit for lending",
  status: "In progress",
  started: "Nov 2026",
  license: "Open source",
  repo: "",
  demo: "",
  oneLiner:
    "A free, self-hosted toolkit that reads Indian KYC and loan documents and generates ready-to-send loan PDFs, through a REST API, a web screen or one Docker command.",
  problem:
    "Small lenders, NBFCs, cooperative banks, DSAs and CA firms pay per document for KYC APIs and still build loan letters by hand in Word. Aadhaar and bank data shouldn’t go to unknown cloud services.",
  solution:
    "One self-hosted package that combines Indian document validation with loan-specific PDFs. Aadhaar is masked by default and uploaded files are deleted after processing.",
  modules: [
    {
      name: "Read documents",
      tag: "OCR",
      points: [
        "PAN, Aadhaar, GST certificate, cheque, bank statement, salary slip, voter ID, driving licence, utility bill",
        "PAN format and holder type, Aadhaar Verhoeff checksum, GSTIN checksum and state code, IFSC lookup",
        "Bank statement running-balance check; salary slip net = gross − deductions",
      ],
    },
    {
      name: "Cross-document match",
      tag: "Key feature",
      points: [
        "Compares name, date of birth and address across every uploaded document",
        "Returns a match score, e.g. “PAN name matches Aadhaar 96%, address mismatch on utility bill”",
      ],
    },
    {
      name: "Generate documents",
      tag: "PDF",
      points: [
        "Sanction letter, EMI schedule, statement of account, receipt with QR, foreclosure quote, NOC, interest certificate, demand notice, KYC summary",
        "HTML templates with placeholders: logo, colours, language and wording change without code",
      ],
    },
    {
      name: "Loan calculators",
      tag: "Finance",
      points: [
        "EMI (reducing and flat), amortisation schedule, prepayment effect",
        "Foreclosure amount on any date with per-day interest, penal interest",
        "Indian number format (1,23,456.00) and amount in words",
      ],
    },
  ],
  stack: [
    "Go (Fiber)",
    "Tesseract / PaddleOCR",
    "Poppler",
    "chromedp / Gotenberg",
    "React + TypeScript",
    "Vite + Tailwind",
    "Docker Compose",
    "OpenAPI",
    "Go unit tests",
  ],
  roadmap: [
    { week: "01", scope: "feat(validate)", build: "Go API, Docker, PAN / GSTIN / Aadhaar / IFSC validators" },
    { week: "02", scope: "feat(calc)", build: "EMI, schedule, foreclosure, amount in words" },
    { week: "03", scope: "feat(pdf)", build: "PDF engine and first 3 templates" },
    { week: "04", scope: "feat(ocr)", build: "OCR engine with PAN, Aadhaar and GST extractors" },
    { week: "05", scope: "feat(match)", build: "Cheque, voter ID, utility bill and cross-document match" },
    { week: "06", scope: "feat(web)", build: "React demo: upload, preview, JSON view, PDF download" },
    { week: "07", scope: "feat(templates)", build: "8+ templates with logo and colour options" },
    { week: "08", scope: "release", build: "Docs, demo GIF, public demo and v1.0 release" },
  ],
};

// Sample API calls shown in the LoanDocs demo panel (fake sample data only).
export const loanDocsApi = [
  {
    label: "Read",
    request: "POST /v1/ocr/extract",
    response: `{
  "document_type": "PAN",
  "fields": {
    "pan": "ABCPR1234F",
    "name": "SARAVANAN R",
    "dob": "1990-04-12"
  },
  "checks": {
    "pan_format": "pass",
    "holder_type": "Individual"
  },
  "confidence": 0.94
}`,
  },
  {
    label: "Calculate",
    request: "POST /v1/calc/emi",
    response: `{
  "amount": 500000,
  "annual_rate": 10.5,
  "tenure_months": 36,
  "emi": 16251.22,
  "total_interest": 85043.98,
  "schedule": [
    { "month": 1, "principal": 11876.22,
      "interest": 4375.00, "balance": 488123.78 },
    { "month": 2, "principal": 11980.14,
      "interest": 4271.08, "balance": 476143.64 }
  ]
}`,
  },
  {
    label: "Generate",
    request: "POST /v1/pdf/sanction-letter",
    response: `{
  "template": "sanction-letter",
  "data": {
    "borrower": "SARAVANAN R",
    "amount": "₹5,00,000.00",
    "amount_in_words": "Five Lakh Rupees Only",
    "rate": "10.5% p.a.",
    "tenure": "36 months",
    "emi": "₹16,251.22"
  }
}
→ 200 OK  application/pdf`,
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
        practice: "Parallel OCR workers in LoanDocs",
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
        practice: "Split OCR and PDF into services",
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
        practice: "Deploy LoanDocs to Kubernetes",
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
