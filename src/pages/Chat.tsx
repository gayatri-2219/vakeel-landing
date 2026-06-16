import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Send, Lock, FileText, ChevronDown, ShieldCheck,
  Cpu, Loader2, User
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

interface VaultDoc {
  id: string;
  name: string;
  type: string;
  pages: number;
  risk: 'green' | 'amber' | 'red';
  date: string;
}

const VAULT_DOCS: VaultDoc[] = [
  { id: 'tax-loan', name: 'HDFC_HomeLoan_Agreement_2023.pdf', type: 'Home Loan', pages: 42, risk: 'amber', date: '12 Oct 2023' },
  { id: 'land-title', name: 'Sale_Deed_Survey_104_Bangalore.pdf', type: 'Sale Deed', pages: 18, risk: 'red', date: '04 Jun 2023' },
  { id: 'cross-border-tax', name: 'US_Tech_Offer_Letter_Remote.pdf', type: 'Employment Contract', pages: 8, risk: 'amber', date: '30 May 2024' },
  { id: 'contract-verify', name: 'Freelance_MSA_AcmeTech_Pvt_Ltd.pdf', type: 'MSA', pages: 12, risk: 'red', date: '15 Jun 2024' },
];

type MessageRole = 'user' | 'assistant';

interface Message {
  id: string;
  role: MessageRole;
  text: string;
  streaming?: boolean;
  model?: string;
}

// Simulated answer bank keyed by doc context + keywords
const ANSWERS: { keywords: string[]; docs?: string[]; answer: string; model: string }[] = [
  {
    keywords: ['prepayment', 'penalty', 'lock-in', 'foreclose'],
    docs: ['tax-loan'],
    answer: 'Section 14.2 of your HDFC agreement imposes a 2% prepayment penalty on the outstanding principal during the 24-month lock-in period. At your current balance, that is approximately ₹40,000. After the lock-in expires in August 2024, you can prepay or refinance without any penalty. RBI guidelines prohibit prepayment penalties on floating-rate home loans — if your loan is repo-linked, this clause may be challengeable.',
    model: 'LLAMA_3_2_1B_INST_Q4_0',
  },
  {
    keywords: ['80c', 'tax', 'deduction', 'section 24', 'interest'],
    docs: ['tax-loan'],
    answer: 'You are eligible for two deductions on your HDFC home loan: (1) Section 80C — principal repayment up to ₹1.5 lakh per year; (2) Section 24(b) — interest paid up to ₹2 lakh per year for a self-occupied property. Based on your loan schedule, you have been missing approximately ₹30,000 per year in unclaimed 80C deductions. Ensure your Form 16 or ITR reflects both.',
    model: 'LLAMA_3_2_1B_INST_Q4_0',
  },
  {
    keywords: ['heir', 'mutation', 'relinquishment', 'title', 'legal heir', 'kavitha'],
    docs: ['land-title'],
    answer: 'Your sale deed has a critical title defect: one of three legal heirs — Kavitha R — has not signed the 2014 mutation extract. Under Section 8 of the Hindu Succession Act and the Transfer of Property Act, all co-owners must consent to a sale for the transfer to be legally valid. Buying this property without a registered Relinquishment Deed from Kavitha R exposes you to a partition suit at any point in the future, even after registration.',
    model: 'LLAMA_3_2_1B_INST_Q4_0',
  },
  {
    keywords: ['poa', 'power of attorney', 'expired', '2018'],
    docs: ['land-title'],
    answer: 'A Power of Attorney (POA) used in a 2018 transaction that has since expired is a serious red flag. An expired POA means the agent no longer has authority to act, and any transaction executed under it after expiry is voidable. You should obtain certified copies of the original 2018 POA and verify whether it was properly registered and whether the principal is still alive and has not revoked it.',
    model: 'LLAMA_3_2_11B_VISION_INSTRUCT',
  },
  {
    keywords: ['dtaa', 'foreign tax', 'form 67', 'usa', 'us', 'double taxation'],
    docs: ['cross-border-tax'],
    answer: 'Under the India-USA Double Taxation Avoidance Agreement (DTAA), you can claim a credit for taxes already paid in the USA against your Indian tax liability. To do this: (1) file Form 67 with your ITR before the due date; (2) obtain a Tax Residency Certificate (TRC) from the US IRS; (3) declare the foreign income under Schedule FSI in your ITR. Failure to file Form 67 forfeits the treaty benefit.',
    model: 'LLAMA_3_2_1B_INST_Q4_0',
  },
  {
    keywords: ['contractor', 'employment', 'misclassification', 'independent', 'fixed hours', 'exclusivity'],
    docs: ['cross-border-tax'],
    answer: 'Your contract uses the label "Independent Contractor" but imposes fixed working hours (9 AM–5 PM IST) and single-employer exclusivity — both are hallmarks of employment under Indian labor law (the "control test"). This misclassification has two risks: (1) you may lose access to statutory benefits like gratuity and PF; (2) the foreign company may face Permanent Establishment liability in India, potentially triggering corporate tax obligations here.',
    model: 'LLAMA_3_2_1B_INST_Q4_0',
  },
  {
    keywords: ['cin', 'mca21', 'invalid', 'struck off', 'fraud', 'acme'],
    docs: ['contract-verify'],
    answer: 'The CIN U72900KA2021PTC145887 listed in your MSA does not correspond to an active company on MCA21. This company was struck off the register in June 2023, meaning it no longer legally exists. Any contract signed with a struck-off company is void — there is no legal counterparty to enforce against. This is a strong indicator of intentional fraud. Do not pay any advance or deliver any work product.',
    model: 'LLAMA_3_2_1B_INST_Q4_0',
  },
  {
    keywords: ['jurisdiction', 'delaware', 'dispute', 'arbitration', 'court'],
    docs: ['contract-verify'],
    answer: 'The dispute resolution clause in your MSA specifies Delaware, USA, as the seat of arbitration. For a ₹50,000 contract, enforcing an award from a US court in India requires a separate recognition proceeding under the Arbitration and Conciliation Act, 1996. The legal costs alone would far exceed the contract value. You must negotiate the jurisdiction to India (ideally Bengaluru, the company\'s stated state) before signing.',
    model: 'LLAMA_3_2_1B_INST_Q4_0',
  },
  {
    keywords: ['gst', 'registration', 'verify', 'valid'],
    answer: 'To verify a GST registration in India, you can check the GST portal (gst.gov.in) under "Search Taxpayer." A valid GSTIN has 15 characters: the first two are the state code, next 10 are the PAN, followed by entity number, Z, and a checksum digit. VAKEEL\'s on-device verification cross-references the GSTIN format, state code, and PAN linkage against our offline registry snapshot.',
    model: 'LLAMA_3_2_1B_INST_Q4_0',
  },
  {
    keywords: ['fema', 'remittance', 'foreign', 'rbi'],
    answer: 'Under FEMA (Foreign Exchange Management Act), income received from abroad must be remitted to India within a specified time (generally the earlier of 9 months from the due date or within 6 months of receipt). If you receive USD payments, you must: (1) remit through an authorized dealer bank; (2) file an FIRC (Foreign Inward Remittance Certificate) for each transaction; (3) declare the income in your ITR under "Foreign Source Income."',
    model: 'LLAMA_3_2_1B_INST_Q4_0',
  },
  {
    keywords: ['encumbrance', 'ec', 'property', 'clear title'],
    answer: 'An Encumbrance Certificate (EC) from the Sub-Registrar\'s Office shows all registered transactions on a property for a specified period. A "nil encumbrance" EC means no mortgages, liens, or charges are registered. However, EC only covers registered transactions — oral family arrangements, unregistered wills, or revenue records like Patta/Khata are not captured. Always cross-check EC with revenue records (RTC/Pahani) for agricultural land.',
    model: 'LLAMA_3_2_1B_INST_Q4_0',
  },
  {
    keywords: ['pmay', 'pradhan mantri', 'subsidy', 'credit linked', 'housing'],
    answer: 'PMAY-CLSS (Credit Linked Subsidy Scheme) offers interest subsidies on home loans for first-time buyers. As of the current scheme cycle: EWS/LIG category (annual income up to ₹6 lakh) can get 6.5% subsidy on loans up to ₹6 lakh. MIG-I (up to ₹12 lakh income) gets 4% on ₹9 lakh. MIG-II (up to ₹18 lakh) gets 3% on ₹12 lakh. The subsidy is credited upfront to the loan account. Apply through your bank using Form CLSS-1.',
    model: 'LLAMA_3_2_1B_INST_Q4_0',
  },
];

function getAnswer(question: string, docId: string | null): { answer: string; model: string } {
  const q = question.toLowerCase();
  for (const entry of ANSWERS) {
    const keyMatch = entry.keywords.some((k) => q.includes(k));
    const docMatch = !entry.docs || !docId || entry.docs.includes(docId);
    if (keyMatch && docMatch) return { answer: entry.answer, model: entry.model };
  }
  return {
    answer: `Based on your vault documents and VAKEEL's on-device analysis, this appears to be a nuanced legal question. Here is a general framework: In India, any contractual clause that conflicts with a statutory right is void to the extent of the conflict (per Section 23 of the Indian Contract Act). I recommend consulting the specific section of the document where this clause appears. If you have scanned and indexed this document in your vault, use the semantic search to find all related clauses. Would you like me to clarify anything specific about this question?`,
    model: 'LLAMA_3_2_1B_INST_Q4_0',
  };
}

const RISK_COLOR: Record<string, string> = {
  green: 'bg-risk-green text-white',
  amber: 'bg-risk-amber text-white',
  red: 'bg-risk-red text-white',
};

const SUGGESTED: Record<string, string[]> = {
  'tax-loan': [
    'What does the prepayment penalty clause mean?',
    'How do I claim my Section 80C deduction?',
    'Can I refinance before the lock-in ends?',
  ],
  'land-title': [
    'What is the risk of the missing heir signature?',
    'What should I do about the expired POA?',
    'How do I check the Encumbrance Certificate?',
  ],
  'cross-border-tax': [
    'Do I need to file Form 67 for US income?',
    'Am I misclassified as a contractor?',
    'What are my FEMA obligations for USD payments?',
  ],
  'contract-verify': [
    'What does an invalid CIN mean for my contract?',
    'Can I enforce this contract if the company is struck off?',
    'How do I change the dispute jurisdiction to India?',
  ],
  general: [
    'How do I verify a company on MCA21?',
    'What is the PMAY housing subsidy eligibility?',
    'What are my rights under the Consumer Protection Act?',
  ],
};

export default function Chat() {
  const [searchParams] = useSearchParams();
  const preselect = searchParams.get('doc');
  const [selectedDoc, setSelectedDoc] = useState<VaultDoc | null>(
    preselect ? (VAULT_DOCS.find((d) => d.id === preselect) ?? null) : null
  );
  const [dropOpen, setDropOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const suggestions = SUGGESTED[selectedDoc?.id ?? 'general'];

  const sendMessage = (text: string) => {
    if (!text.trim() || streaming) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim() };
    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, userMsg, { id: assistantId, role: 'assistant', text: '', streaming: true }]);
    setInput('');
    setStreaming(true);

    const { answer, model } = getAnswer(text, selectedDoc?.id ?? null);
    const words = answer.split(' ');
    let w = 0;
    const iv = setInterval(() => {
      w++;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, text: words.slice(0, w).join(' '), streaming: w < words.length, model }
            : m
        )
      );
      if (w >= words.length) {
        clearInterval(iv);
        setStreaming(false);
      }
    }, 45);
    timers.current.push(setTimeout(() => clearInterval(iv), words.length * 50 + 500));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 flex flex-col h-[calc(100dvh-4rem)]" style={{ minHeight: 0 }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5 shrink-0">
        <Link to="/" className="hover:text-foreground transition-colors">VAKEEL</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Document Chat</span>
      </div>

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5 shrink-0">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <MessageSquare className="w-4.5 h-4.5 text-secondary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-display font-bold text-foreground">Document Chat</h1>
            <p className="text-xs text-muted-foreground font-mono">LLAMA_3_2_1B_INST_Q4_0 · Vault-grounded · Offline</p>
          </div>
        </div>

        {/* Document selector */}
        <div className="relative shrink-0">
          <button
            onClick={() => setDropOpen(!dropOpen)}
            className="flex items-center gap-2 px-3.5 py-2.5 border border-border bg-card rounded-xl text-sm font-medium hover:bg-muted transition-colors min-w-[220px] justify-between"
          >
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="w-4 h-4 text-primary shrink-0" />
              <span className="truncate text-left">
                {selectedDoc ? selectedDoc.name.replace('.pdf', '') : 'General Legal Chat'}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {dropOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
              >
                <div className="p-2">
                  <button
                    onClick={() => { setSelectedDoc(null); setDropOpen(false); }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${!selectedDoc ? 'bg-primary/8 text-primary font-semibold' : 'hover:bg-muted text-foreground'}`}
                  >
                    General Legal Chat
                    <span className="block text-xs text-muted-foreground font-normal">Ask anything — not document-specific</span>
                  </button>
                  <div className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest px-3 pt-3 pb-1.5">Your Vault</div>
                  {VAULT_DOCS.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => { setSelectedDoc(doc); setDropOpen(false); }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-start gap-2.5 ${selectedDoc?.id === doc.id ? 'bg-primary/8' : 'hover:bg-muted'}`}
                    >
                      <span className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${RISK_COLOR[doc.risk]}`} />
                      <div className="min-w-0">
                        <div className={`text-xs font-semibold truncate ${selectedDoc?.id === doc.id ? 'text-primary' : 'text-foreground'}`}>{doc.name}</div>
                        <div className="text-[10px] text-muted-foreground">{doc.type} · {doc.pages}p · {doc.date}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Active doc context bar */}
      {selectedDoc && (
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-primary/5 border border-primary/15 rounded-xl mb-4 shrink-0">
          <Lock className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="text-xs font-mono text-primary font-semibold">{selectedDoc.name}</span>
          <span className="text-xs text-muted-foreground">{selectedDoc.pages} pages · indexed in vakeel.db</span>
          <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${RISK_COLOR[selectedDoc.risk]}`}>
            {selectedDoc.risk === 'green' ? 'Safe' : selectedDoc.risk === 'amber' ? 'Caution' : 'High Risk'}
          </span>
        </div>
      )}

      {/* Message list */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card min-h-0">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center mb-4">
              <MessageSquare className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2">
              {selectedDoc ? `Ask about ${selectedDoc.type}` : 'Ask any legal question'}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              {selectedDoc
                ? `VAKEEL has indexed ${selectedDoc.name} in your local vault. Ask any question about its clauses, risks, or your rights.`
                : 'Ask general questions about Indian contract law, GST, tax, property, or labor regulations — all answered on-device.'}
            </p>
            <div className="flex flex-col gap-2 w-full max-w-sm">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-left px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-sm text-foreground transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-secondary" />
                  </div>
                )}
                <div className={`max-w-[78%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-tr-sm'
                      : 'bg-muted/50 border border-border text-foreground rounded-tl-sm'
                  }`}>
                    {msg.text}
                    {msg.streaming && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="inline-block w-0.5 h-4 bg-muted-foreground ml-0.5 align-middle"
                      />
                    )}
                  </div>
                  {msg.role === 'assistant' && !msg.streaming && msg.model && (
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                      <Cpu className="w-3 h-3" />
                      {msg.model} · On-device
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Suggested chips when mid-conversation */}
      {messages.length > 0 && !streaming && (
        <div className="flex flex-wrap gap-2 mt-3 shrink-0">
          {suggestions.slice(0, 2).map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="mt-3 shrink-0">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedDoc ? `Ask about ${selectedDoc.type}…` : 'Ask any legal question…'}
            disabled={streaming}
            className="flex-1 px-4 py-3.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/50 transition-all disabled:opacity-60 placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={streaming || !input.trim()}
            className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
          <Lock className="w-3 h-3" />
          All processing stays on your device · vakeel.db · NOMIC_EMBED_TEXT_V1_5_Q8_0
        </div>
      </form>
    </div>
  );
}
