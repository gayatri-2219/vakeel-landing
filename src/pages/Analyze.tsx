import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Cpu, FileSearch, CheckCircle2, ArrowRight, Lock, AlertTriangle,
  Clock, Banknote, Landmark, Download, Calendar, Zap, FileImage
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import QvacBadge from '../components/QvacBadge';

const demos: Record<string, any> = {
  'tax-loan': {
    title: 'Home Loan Agreement Analysis',
    persona: 'Middle Class · Tax & Loans',
    filename: 'HDFC_HomeLoan_Agreement_2023.pdf',
    pages: 42,
    verdict: 'Your HDFC home loan contains a 2% prepayment penalty clause in Section 14.2. Refinancing to SBI right now will cost you ₹40,000 in penalties. Recommendation: wait 8 months until the lock-in expires, then refinance and save ₹1,80,000 over 5 years.',
    risk: 'amber' as const,
    action: 'Set calendar reminder for August 2024 to begin refinancing process',
    deadlines: [
      { label: 'Lock-in period expires', date: 'Aug 12, 2024', days: 231, severity: 'amber' },
      { label: 'Annual insurance renewal', date: 'Oct 3, 2024', days: 282, severity: 'green' },
    ],
    findings: [
      { text: 'Clause 14.2: 2% prepayment penalty before 24-month lock-in (₹40,000 at current balance).', type: 'amber' },
      { text: 'Interest: repo-linked + fixed 2.65% spread. Fair by market standards.', type: 'green' },
      { text: 'Processing fee ₹10,000 is non-refundable — standard HDFC practice.', type: 'green' },
      { text: 'Missed 80C deduction on principal repayment (~₹30,000/year unclaimed).', type: 'amber' },
    ],
    schemes: ['PMAY credit-linked subsidy (check eligibility)', 'Section 24 deduction on home loan interest'],
    models: ['LLAMA_3_2_1B_INST_Q4_0', 'NOMIC_EMBED_TEXT_V1_5_Q8_0'],
  },
  'land-title': {
    title: 'Land Title & Patta Verification',
    persona: 'Farmer · Land & Property',
    filename: 'Sale_Deed_Survey_104_Bangalore.pdf',
    pages: 18,
    verdict: 'Title has an unresolved mutation from 2014. The seller\'s sister — a legal heir listed in the Heirship Certificate — has not signed a relinquishment deed. Purchasing this property carries extreme litigation risk. The seller may not have the legal standing to transfer full title.',
    risk: 'red' as const,
    action: 'Demand a registered relinquishment deed from all legal heirs before signing any agreement or paying any advance',
    deadlines: [
      { label: 'Sale agreement proposed signing', date: 'Jul 1, 2024', days: 16, severity: 'red' },
    ],
    findings: [
      { text: 'Encumbrance Certificate: clear title for 13 years (2010-2023). No prior loans.', type: 'green' },
      { text: 'Mutation extract (2014): signature of 1 of 3 legal heirs is absent — seller\'s sister Kavitha R.', type: 'red' },
      { text: 'Property taxes paid up to FY 2023-24 (receipts verified).', type: 'green' },
      { text: 'Power of Attorney used in 2018 sale — POA has since expired. Red flag.', type: 'red' },
    ],
    schemes: ['PMFBY crop insurance (if agricultural land)', 'PM-Kisan eligibility check'],
    models: ['LLAMA_3_2_11B_VISION_INSTRUCT', 'LLAMA_3_2_1B_INST_Q4_0'],
  },
  'cross-border-tax': {
    title: 'Remote Employment Contract Analysis',
    persona: 'Remote Worker · Cross-border Tax',
    filename: 'US_Tech_Offer_Letter_Remote.pdf',
    pages: 8,
    verdict: 'You are classified as "Independent Contractor" but the contract mandates fixed working hours (9 AM–5 PM IST) and exclusivity with one employer. Under Indian labor law tests, this constitutes employment, not contracting. The foreign company may face Permanent Establishment liability in India.',
    risk: 'amber' as const,
    action: 'Request removal of fixed-hours clause or renegotiate to a Consultant Addendum that allows flexible deliverables',
    deadlines: [
      { label: 'Contract start date', date: 'Jul 15, 2024', days: 30, severity: 'amber' },
      { label: 'FEMA remittance reporting deadline', date: 'Oct 31, 2024', days: 138, severity: 'green' },
    ],
    findings: [
      { text: 'Compensation via USD wire transfer avoids Indian payroll — structurally unusual for employment.', type: 'amber' },
      { text: 'Fixed hours (9–5 IST) + single-employer exclusivity = employment under Indian labor tests.', type: 'red' },
      { text: 'IP assignment clause: standard, enforceable in India.', type: 'green' },
      { text: 'No DTAA (US-India treaty) clause — you must file Form 67 to claim foreign tax credit.', type: 'amber' },
    ],
    schemes: ['DTAA India-USA treaty benefits', 'Schedule FA foreign asset reporting (ITR)'],
    models: ['LLAMA_3_2_1B_INST_Q4_0'],
  },
  'contract-verify': {
    title: 'Client Master Service Agreement',
    persona: 'Freelancer · Contract Verification',
    filename: 'Freelance_MSA_AcmeTech_Pvt_Ltd.pdf',
    pages: 12,
    verdict: 'CRITICAL: The Corporate Identification Number (CIN) listed in the preamble — U72900KA2021PTC145xxx — does not match any active company on MCA21 public records. Dispute resolution is set to Delaware, USA, making recovery of unpaid invoices practically impossible for a ₹50,000 contract. Do not commence work.',
    risk: 'red' as const,
    action: 'Verify company existence on MCA21 portal before any engagement. Request jurisdiction change to India (Bengaluru). Do not start work.',
    deadlines: [
      { label: 'Project start date (as per contract)', date: 'Jun 20, 2024', days: 5, severity: 'red' },
      { label: 'Invoice milestone 1', date: 'Jul 31, 2024', days: 46, severity: 'amber' },
    ],
    findings: [
      { text: 'Payment terms: Net-60. Standard but unusually long for a ₹50,000 contract.', type: 'amber' },
      { text: 'CIN U72900KA2021PTC145xxx: deregistered / invalid on MCA21 — HIGH FORGERY RISK.', type: 'red' },
      { text: 'Dispute resolution: Delaware, USA. Recovery impossible under this jurisdiction.', type: 'red' },
      { text: 'IP transfer: all work product transferred without additional compensation (standard).', type: 'amber' },
    ],
    schemes: ['MSME SAMADHAAN for unpaid invoice recovery', 'Consumer Forum complaint option'],
    models: ['LLAMA_3_2_1B_INST_Q4_0', 'NOMIC_EMBED_TEXT_V1_5_Q8_0'],
  },
};

const STEP_CONFIG = [
  { id: 'ingest', label: 'Loading from Vault', sublabel: 'Decrypted locally · never uploaded', icon: Lock, model: null },
  { id: 'ocr', label: 'OCR Extraction', sublabel: 'Text + structure extracted on-device', icon: FileImage, model: 'LLAMA_3_2_11B_VISION_INSTRUCT' },
  { id: 'classify', label: 'Document Classification', sublabel: 'docType · userProfile · jurisdiction', icon: FileSearch, model: 'LLAMA_3_2_1B_INST_Q4_0' },
  { id: 'decision', label: 'Decision Engine', sublabel: 'Risk · Deadline · Fraud · Schemes · Trust', icon: Cpu, model: 'LLAMA_3_2_1B_INST_Q4_0' },
  { id: 'embed', label: 'Vault Embedding', sublabel: 'Stored in vakeel.db · cosine indexed', icon: ShieldCheck, model: 'NOMIC_EMBED_TEXT_V1_5_Q8_0' },
];

const STEP_DURATION = 1400;

export default function Analyze() {
  const { persona } = useParams();
  const demo = demos[persona as string] || demos['tax-loan'];
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  // Reset when persona changes
  useEffect(() => {
    setStep(0);
    setDone(false);
  }, [persona]);

  useEffect(() => {
    if (step < STEP_CONFIG.length) {
      const t = setTimeout(() => setStep((s) => s + 1), STEP_DURATION);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setDone(true), 500);
      return () => clearTimeout(t);
    }
  }, [step]);

  const elapsedMs = Math.min(step * STEP_DURATION, 5 * STEP_DURATION);
  const elapsedStr = (elapsedMs / 1000).toFixed(1) + 's';

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground transition-colors">VAKEEL</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{demo.persona}</span>
      </div>

      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-1">{demo.title}</h1>
          <div className="flex items-center gap-3 flex-wrap mt-2">
            <QvacBadge
              model={demo.models[0]}
              status={done ? 'done' : step > 0 ? 'running' : 'idle'}
              showGpu={demo.models[0].includes('VISION')}
            />
            {done && (
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded-md">
                completed in {elapsedStr}
              </span>
            )}
          </div>
        </div>
        <RiskBadge level={done ? demo.risk : 'processing'} size="lg" />
      </div>

      {/* Main panel */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden mb-8">
        {/* File bar */}
        <div className="bg-muted/40 px-6 py-3.5 border-b border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm font-semibold text-foreground">{demo.filename}</span>
            <span className="text-xs text-muted-foreground">{demo.pages} pages</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-risk-green" />
            Processing on-device
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* ── Pipeline steps ── */}
            <div>
              <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest mb-5">
                QVAC Processing Pipeline
              </h3>
              <div className="space-y-3">
                {STEP_CONFIG.map((s, idx) => {
                  const Icon = s.icon;
                  const isActive = step === idx;
                  const isPast = step > idx;
                  const isFuture = step < idx;

                  return (
                    <div
                      key={s.id}
                      className={`relative flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-300 ${
                        isActive ? 'bg-primary/5 border-primary/25 shadow-sm' :
                        isPast ? 'bg-muted/30 border-border' :
                        'bg-transparent border-transparent opacity-40'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        isPast ? 'border-risk-green bg-risk-green/10' :
                        isActive ? 'border-primary bg-primary/10' :
                        'border-border bg-muted'
                      }`}>
                        {isPast ? (
                          <CheckCircle2 className="w-4 h-4 text-risk-green" />
                        ) : (
                          <Icon className={`w-4 h-4 ${isActive ? 'text-primary animate-pulse2' : 'text-muted-foreground'}`} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-semibold ${isPast || isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {s.label}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{s.sublabel}</div>
                        {s.model && (isPast || isActive) && (
                          <div className="mt-1.5 font-mono text-[10px] text-primary/60 bg-primary/5 px-2 py-0.5 rounded w-fit">
                            {s.model}
                          </div>
                        )}
                        {isActive && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: STEP_DURATION / 1000, ease: 'linear' }}
                            className="h-0.5 bg-primary mt-2 rounded-full"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Results ── */}
            <div>
              <AnimatePresence mode="wait">
                {!done ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full min-h-[340px] flex flex-col items-center justify-center text-center p-8 bg-muted/20 rounded-xl border border-dashed border-border"
                  >
                    <div className="relative w-16 h-16 mb-5">
                      <div className="absolute inset-0 rounded-full border-4 border-muted" />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
                      />
                      <Lock className="absolute inset-0 m-auto w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-lg mb-1">Analyzing Securely</h3>
                    <p className="text-sm text-muted-foreground mb-4">Your document is being processed entirely on your device.</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {[...new Set(demo.models as string[])].map((m: string) => (
                        <span key={m} className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                          {m}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45 }}
                    className="space-y-4"
                  >
                    {/* Verdict card */}
                    <div className={`p-5 rounded-xl border ${
                      demo.risk === 'red' ? 'bg-risk-red/5 border-risk-red/20' :
                      demo.risk === 'amber' ? 'bg-risk-amber/5 border-risk-amber/20' :
                      'bg-risk-green/5 border-risk-green/20'
                    }`}>
                      <div className="flex items-center gap-2 mb-3">
                        <RiskBadge level={demo.risk} size="md" />
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">VAKEEL Verdict</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground leading-relaxed mb-4">{demo.verdict}</p>
                      <div className="bg-white rounded-lg p-3.5 border border-border shadow-sm flex items-start gap-2.5">
                        <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <div className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider mb-1">Next action</div>
                          <div className="text-sm font-semibold text-foreground">{demo.action}</div>
                        </div>
                      </div>
                    </div>

                    {/* Findings */}
                    <div>
                      <h4 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest mb-2.5">Key Findings</h4>
                      <ul className="space-y-2">
                        {demo.findings.map((f: any, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm p-3 bg-card border border-border rounded-lg shadow-sm">
                            {f.type === 'red' && <AlertTriangle className="w-4 h-4 text-risk-red shrink-0 mt-0.5" />}
                            {f.type === 'amber' && <AlertTriangle className="w-4 h-4 text-risk-amber shrink-0 mt-0.5" />}
                            {f.type === 'green' && <CheckCircle2 className="w-4 h-4 text-risk-green shrink-0 mt-0.5" />}
                            <span className="text-foreground/90">{f.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom panels — shown when done */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {/* Deadlines */}
            <div className="bg-card border border-border rounded-2xl p-5 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-display font-bold">Deadline Engine</h3>
              </div>
              <div className="space-y-3">
                {demo.deadlines.map((d: any) => (
                  <div key={d.label} className={`p-3 rounded-lg border text-xs ${
                    d.severity === 'red' ? 'bg-risk-red/5 border-risk-red/15' :
                    d.severity === 'amber' ? 'bg-risk-amber/5 border-risk-amber/15' :
                    'bg-muted/40 border-border'
                  }`}>
                    <div className="font-semibold text-foreground mb-0.5">{d.label}</div>
                    <div className="text-muted-foreground">{d.date} · {d.days} days</div>
                  </div>
                ))}
                <button className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-primary py-2 border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">
                  <Calendar className="w-3.5 h-3.5" /> Export to Calendar
                </button>
              </div>
            </div>

            {/* Government schemes */}
            <div className="bg-card border border-border rounded-2xl p-5 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Landmark className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-display font-bold">Rights Engine</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Schemes you may qualify for based on your profile:</p>
              <ul className="space-y-2">
                {demo.schemes.map((s: string) => (
                  <li key={s} className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-risk-green shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Export */}
            <div className="bg-card border border-border rounded-2xl p-5 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Download className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-display font-bold">Export Report</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Download your analysis in multiple formats for sharing or record-keeping.</p>
              <div className="space-y-2">
                {[
                  { label: 'PDF Risk Report', sub: 'Formatted with QR summary' },
                  { label: 'Markdown (WhatsApp)', sub: 'Text-friendly for sharing' },
                  { label: 'JSON Audit Trail', sub: 'inference-log.jsonl format' },
                ].map((e) => (
                  <button key={e.label} className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs bg-muted/50 border border-border rounded-lg hover:bg-muted transition-colors">
                    <div>
                      <div className="font-semibold text-foreground text-left">{e.label}</div>
                      <div className="text-muted-foreground text-left">{e.sub}</div>
                    </div>
                    <Download className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Switch persona */}
      {done && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">Try another persona</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              ['Home Loan', '/analyze/tax-loan'],
              ['Land Title', '/analyze/land-title'],
              ['Remote Work', '/analyze/cross-border-tax'],
              ['Freelance Contract', '/analyze/contract-verify'],
            ].filter(([, href]) => href !== `/analyze/${persona}`).map(([label, href]) => (
              <Link
                key={href}
                to={href}
                className="px-4 py-2 text-sm font-semibold bg-card border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
              >
                {label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
