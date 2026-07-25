import { ResearchReport, UserProfile } from '@/types';

export const initialUserProfile: UserProfile = {
  fullName: 'Shivam Chaubey',
  username: 'shivam_verigen',
  email: 'researcher@verigen.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  bio: 'AI Safety Researcher & Lead Developer interested in autonomous multi-agent verification frameworks.',
  theme: 'dark',
  language: 'English (US)',
  notifications: {
    emailAlerts: true,
    reportComplete: true,
    weeklyDigest: false,
  },
  defaultMode: 'Deep Research',
};

export const sampleReports: ResearchReport[] = [
  {
    id: 'rep-001',
    query: 'Impact of AI in Healthcare & Clinical Diagnostics 2026',
    date: '2026-07-24',
    time: '3m 42s',
    confidence: 94,
    status: 'Completed',
    mode: 'Deep Research',
    verificationLevel: 'Expert',
    saved: true,
    tags: ['Healthcare', 'AI & ML', 'Diagnostics'],
    summary: 'Autonomous AI diagnostic systems show a 28% reduction in preliminary triage latency and a 94.2% sensitivity rate in oncology imaging, verified across 14 clinical trial datasets published between 2024 and 2026.',
    detailedAnalysis: `### Executive Overview
Artificial Intelligence in healthcare has transitioned from experimental clinical decision support to autonomous agentic diagnostic orchestration. Key breakthroughs include:

1. **Multimodal Medical LLMs**: Processing genomic sequences, radiology scans, and patient electronic health records (EHR) simultaneously.
2. **Diagnostic Accuracy**: Clinical trials indicate AI-driven triage reduces false negative rates in mammography by 31.4%.
3. **FDA Approvals**: Over 140 new Class II AI medical devices received clearance in the last fiscal period.

### Operational Challenges & Ethics
Despite rapid adoption, algorithmic bias in historical training data remains a primary risk factor requiring automated real-time fact checking and source lineage tracing.`,
    verifiedClaims: [
      {
        id: 'claim-1',
        text: 'AI diagnostic algorithms achieve 94.2% sensitivity in early-stage breast cancer screening.',
        confidence: 96,
        badge: 'High',
        verified: true,
        citation: 'Journal of American Medical Association (JAMA Oncology, Vol 42)',
        sourceUrl: 'https://jama.org/article-ai-healthcare-2025',
      },
      {
        id: 'claim-2',
        text: 'Emergency room triage times were reduced by an average of 28 minutes using AI prioritization.',
        confidence: 92,
        badge: 'High',
        verified: true,
        citation: 'BMJ Health & Care Informatics 2026 Report',
        sourceUrl: 'https://bmj.com/content/healthcare-triage-ai',
      },
      {
        id: 'claim-3',
        text: 'Autonomous diagnostic agents have completely replaced clinical radiologists in standard hospital workflows.',
        confidence: 24,
        badge: 'Low',
        verified: false,
        citation: 'Contradicted by WHO 2026 AI Ethics Framework',
        sourceUrl: 'https://who.int/publications/ai-ethics-radiology',
      },
    ],
    contradictions: [
      {
        id: 'contra-1',
        claim: 'Impact of AI on Radiologist Employment Rates',
        sourceA: {
          name: 'Tech Health Review 2025',
          quote: 'Radiologist headcount demand declined by 12% in urban hospitals.',
        },
        sourceB: {
          name: 'American College of Radiology (ACR)',
          quote: 'Radiologist hiring increased by 8% due to higher volume of AI-assisted scans needing doctor signature.',
        },
        resolution: 'The discrepancy stems from regional vs national sampling; overall demand increased due to increased total throughput.',
      },
    ],
    sources: [
      {
        id: 'src-1',
        title: 'WHO Global Health & AI Safety Charter 2026',
        domain: 'who.int',
        reliability: 98,
        date: '2026-02-14',
        url: 'https://who.int/reports/ai-safety-2026',
        type: 'Government',
      },
      {
        id: 'src-2',
        title: 'Multimodal Neural Networks in Clinical Oncology',
        domain: 'nature.com',
        reliability: 95,
        date: '2025-11-20',
        url: 'https://nature.com/articles/oncology-ai',
        type: 'Research Papers',
      },
      {
        id: 'src-3',
        title: 'AI Diagnostic Breakthroughs in Modern Hospitals',
        domain: 'medicalnews.org',
        reliability: 89,
        date: '2026-05-10',
        url: 'https://medicalnews.org/ai-diagnostics',
        type: 'News',
      },
    ],
    agents: [
      { name: 'Research Agent', status: 'Completed', timeTaken: '42s', description: 'Scanned 14,200 papers & clinical trial registers' },
      { name: 'Verification Agent', status: 'Completed', timeTaken: '1m 10s', description: 'Cross-checked 38 core factual claims' },
      { name: 'Contradiction Detector', status: 'Completed', timeTaken: '45s', description: 'Detected 1 statistical discrepancy between sources' },
      { name: 'Citation Generator', status: 'Completed', timeTaken: '20s', description: 'Generated IEEE & APA formatted citations' },
      { name: 'Report Builder', status: 'Completed', timeTaken: '45s', description: 'Synthesized final confidence score and executive report' },
    ],
  },
  {
    id: 'rep-002',
    query: 'Quantum Computing Encryption Breakthroughs & Post-Quantum Cryptography',
    date: '2026-07-22',
    time: '2m 15s',
    confidence: 91,
    status: 'Completed',
    mode: 'Deep Research',
    verificationLevel: 'Advanced',
    saved: true,
    tags: ['Cybersecurity', 'Quantum', 'Cryptography'],
    summary: 'NIST post-quantum cryptographic standards (CRYSTALS-Kyber, Dilithium) have reached 84% adoption among Fortune 500 tech infrastructure providers to defend against Shor algorithm vulnerabilities.',
    detailedAnalysis: `### Technical Synopsis
As fault-tolerant quantum hardware scales beyond 1,000 logical qubits, legacy RSA-2048 and ECC security protocols face imminent risk. 

### Key Standards Adopted
- **ML-KEM (FIPS 203)**: Primary key encapsulation mechanism.
- **ML-DSA (FIPS 204)**: Lattice-based digital signature algorithm.`,
    verifiedClaims: [
      {
        id: 'claim-201',
        text: 'NIST officially finalized FIPS 203, 204, and 205 for post-quantum cryptography.',
        confidence: 99,
        badge: 'High',
        verified: true,
        citation: 'NIST Cryptographic Technology Group Specification',
        sourceUrl: 'https://nist.gov/pqc-standards',
      },
    ],
    contradictions: [],
    sources: [
      {
        id: 'src-201',
        title: 'Post-Quantum Encryption Readiness Assessment',
        domain: 'nist.gov',
        reliability: 99,
        date: '2026-01-10',
        url: 'https://nist.gov/pqc',
        type: 'Government',
      },
    ],
    agents: [
      { name: 'Research Agent', status: 'Completed', timeTaken: '30s', description: 'Gathered cryptography whitepapers' },
      { name: 'Verification Agent', status: 'Completed', timeTaken: '40s', description: 'Verified NIST specs' },
      { name: 'Contradiction Detector', status: 'Completed', timeTaken: '20s', description: 'Zero contradictions found' },
      { name: 'Citation Generator', status: 'Completed', timeTaken: '15s', description: 'Citations structured' },
      { name: 'Report Builder', status: 'Completed', timeTaken: '30s', description: 'Report rendered' },
    ],
  },
  {
    id: 'rep-003',
    query: 'Global Semiconductor Supply Chain Resilience & Next-Gen Lithography',
    date: '2026-07-20',
    time: '4m 05s',
    confidence: 88,
    status: 'Completed',
    mode: 'Fast Mode',
    verificationLevel: 'Basic',
    saved: false,
    tags: ['Semiconductors', 'Supply Chain', 'Hardware'],
    summary: 'High-NA EUV lithography deployment by ASML in 2nm node foundries reduced power consumption per wafer by 19% while accelerating AI chip output.',
    detailedAnalysis: `### Industry Overview
Next-generation 2nm and 1.4nm nodes heavily rely on High-Numerical Aperture Extreme Ultraviolet (High-NA EUV) systems.`,
    verifiedClaims: [
      {
        id: 'claim-301',
        text: 'High-NA EUV tools provide 1.7x feature density reduction over standard EUV.',
        confidence: 91,
        badge: 'High',
        verified: true,
        citation: 'ASML Annual Technology Report 2026',
        sourceUrl: 'https://asml.com/technology-2026',
      },
    ],
    contradictions: [],
    sources: [
      {
        id: 'src-301',
        title: 'Semiconductor Industry Association 2026 Report',
        domain: 'semiconductors.org',
        reliability: 94,
        date: '2026-03-01',
        url: 'https://semiconductors.org/report',
        type: 'Research Papers',
      },
    ],
    agents: [
      { name: 'Research Agent', status: 'Completed', timeTaken: '50s', description: 'Analyzed supply chain telemetry' },
      { name: 'Verification Agent', status: 'Completed', timeTaken: '1m 20s', description: 'Verified node specifications' },
      { name: 'Contradiction Detector', status: 'Completed', timeTaken: '35s', description: 'Checked foundry reports' },
      { name: 'Citation Generator', status: 'Completed', timeTaken: '20s', description: 'Generated sources' },
      { name: 'Report Builder', status: 'Completed', timeTaken: '1m 00s', description: 'Final report built' },
    ],
  },
];
