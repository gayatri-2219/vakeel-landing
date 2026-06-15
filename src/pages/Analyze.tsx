import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cpu, FileSearch, CheckCircle2, ArrowRight, Lock, AlertTriangle } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';

const demos: Record<string, any> = {
  'tax-loan': {
    title: 'Home Loan Agreement Analysis',
    filename: 'HDFC_HomeLoan_Agreement_2023.pdf',
    pages: 42,
    verdict: 'Your home loan has a 2% prepayment penalty hidden in Clause 14.2. Refinancing to SBI now will cost ₹40,000 in penalties. We recommend waiting 8 months until the lock-in period expires.',
    risk: 'amber',
    action: 'Set calendar reminder for July 2024 to refinance',
    findings: [
      { text: 'Clause 14.2 contains a 2% penalty for prepayment before 24 months.', type: 'amber' },
      { text: 'Interest rate is repo-linked but spread is fixed at 2.65%.', type: 'green' },
      { text: 'Processing fee of ₹10,000 is non-refundable.', type: 'green' }
    ]
  },
  'land-title': {
    title: 'Land Title & Patta Verification',
    filename: 'Sale_Deed_Survey_104_Bangalore.pdf',
    pages: 18,
    verdict: 'Title has an unresolved mutation from 2014. The seller\'s sister, listed in the family tree, has not signed a relinquishment deed. Buying this property carries extreme litigation risk.',
    risk: 'red',
    action: 'Demand a registered relinquishment deed before signing agreement',
    findings: [
      { text: 'Encumbrance Certificate shows clear title for 13 years.', type: 'green' },
      { text: 'Mutation extract (2014) is missing signatures from 1 legal heir.', type: 'red' },
      { text: 'Property taxes paid up to date (FY 2023-24).', type: 'green' }
    ]
  },
  'cross-border-tax': {
    title: 'Remote Employment Contract Analysis',
    filename: 'US_Tech_Offer_Letter.pdf',
    pages: 8,
    verdict: 'You are classified as an "Independent Contractor" but the contract mandates working fixed IST hours (9 AM - 5 PM). This breaches Indian labor law tests for contract work and risks permanent establishment for the employer.',
    risk: 'amber',
    action: 'Request removal of fixed working hours clause to maintain contractor status',
    findings: [
      { text: 'Compensation structure avoids direct Indian payroll.', type: 'amber' },
      { text: 'Fixed working hours mandate contradicts contractor classification.', type: 'red' },
      { text: 'IP assignment clause is standard and enforceable in India.', type: 'green' }
    ]
  },
  'contract-verify': {
    title: 'Client Master Service Agreement',
    filename: 'Freelance_MSA_AcmeCorp.pdf',
    pages: 12,
    verdict: 'The Corporate Identification Number (CIN) listed in the preamble does not match MCA public records. Furthermore, the jurisdiction for dispute resolution is set to Delaware, USA, which makes recovery of unpaid invoices practically impossible for a ₹50,000 contract.',
    risk: 'red',
    action: 'Verify company CIN on MCA portal and request jurisdiction change to India',
    findings: [
      { text: 'Payment terms are Net-60 (standard but long).', type: 'amber' },
      { text: 'CIN U72900KA2021PTC145xxx is invalid/deregistered.', type: 'red' },
      { text: 'Dispute jurisdiction set to Delaware, USA.', type: 'red' }
    ]
  }
};

const steps = [
  { id: 'upload', label: 'Local Vault Loading', icon: Lock },
  { id: 'ocr', label: 'Local OCR Extraction', icon: FileSearch },
  { id: 'rules', label: 'Rule-Based Pattern Match', icon: ShieldCheck },
  { id: 'ai', label: 'Local AI Reasoning Layer', icon: Cpu },
];

export default function Analyze() {
  const { persona } = useParams();
  const demoData = demos[persona as string] || demos['tax-loan'];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1500); // 1.5s per step
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setIsComplete(true), 500);
    }
  }, [currentStep]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link to="/" className="text-sm text-primary font-semibold hover:underline mb-2 inline-block">&larr; Back to Home</Link>
          <h1 className="text-3xl font-display font-bold text-foreground">{demoData.title}</h1>
        </div>
        <div className="hidden sm:block">
          <RiskBadge level={isComplete ? demoData.risk : 'processing'} text={isComplete ? undefined : 'Analyzing...'} />
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="font-mono text-sm font-semibold text-foreground flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-primary" />
            {demoData.filename}
          </div>
          <div className="text-xs text-muted-foreground">{demoData.pages} pages</div>
        </div>

        <div className="p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Pipeline Visualization */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Processing Pipeline</h3>
              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === index;
                  const isPast = currentStep > index;
                  
                  return (
                    <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active pb-8 last:pb-0">
                      <div className={`flex items-center justify-center w-9 h-9 rounded-full border-2 bg-white z-10 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${
                        isPast ? 'border-primary text-primary' : 
                        isActive ? 'border-primary text-primary animate-pulse' : 
                        'border-muted text-muted-foreground'
                      }`}>
                        {isPast ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                      </div>
                      <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-lg border shadow-sm ${
                        isActive ? 'bg-primary/5 border-primary/20' : 'bg-white border-border'
                      }`}>
                        <div className={`text-sm font-semibold ${isActive || isPast ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.label}
                        </div>
                        {isActive && (
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: '100%' }} 
                            transition={{ duration: 1.5, ease: "linear" }}
                            className="h-1 bg-primary mt-2 rounded-full"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Results Area */}
            <div>
              <AnimatePresence>
                {!isComplete ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center p-8 bg-muted/10 rounded-xl border border-dashed border-border"
                  >
                    <div className="w-16 h-16 relative mb-4">
                      <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                      <Lock className="absolute inset-0 m-auto w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-lg mb-2">Analyzing Securely</h3>
                    <p className="text-sm text-muted-foreground">Your document is being processed entirely on your device. No data is sent to the cloud.</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <div className={`p-6 rounded-xl border ${
                      demoData.risk === 'red' ? 'bg-risk-red/5 border-risk-red/20' : 
                      demoData.risk === 'amber' ? 'bg-risk-amber/5 border-risk-amber/20' : 
                      'bg-risk-green/5 border-risk-green/20'
                    }`}>
                      <div className="flex items-center gap-3 mb-4">
                        <RiskBadge level={demoData.risk} />
                        <span className="text-sm font-bold text-foreground">Final Verdict</span>
                      </div>
                      <p className="text-lg text-foreground font-medium leading-relaxed mb-6">
                        {demoData.verdict}
                      </p>
                      <div className="bg-white rounded-lg p-4 border border-border shadow-sm flex items-start gap-3">
                        <ArrowRight className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Recommended Action</div>
                          <div className="text-sm font-semibold text-foreground">{demoData.action}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Key Findings</h4>
                      <ul className="space-y-2">
                        {demoData.findings.map((finding: any, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm p-3 bg-white border border-border rounded-lg shadow-sm">
                            {finding.type === 'red' ? <AlertTriangle className="w-4 h-4 text-risk-red shrink-0 mt-0.5" /> :
                             finding.type === 'amber' ? <AlertTriangle className="w-4 h-4 text-risk-amber shrink-0 mt-0.5" /> :
                             <CheckCircle2 className="w-4 h-4 text-risk-green shrink-0 mt-0.5" />}
                            <span className="text-foreground/90">{finding.text}</span>
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
    </div>
  );
}
