import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, File, Search, ShieldCheck, Lock, Clock, ChevronRight,
  Database, Landmark, FileText, MessageSquare, Eye, X, Download,
  AlertTriangle, CheckCircle2, Calendar, Maximize2, ZoomIn
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import QvacBadge from '../components/QvacBadge';

const DOCUMENTS = [
  {
    id: 'tax-loan',
    name: 'HDFC_HomeLoan_Agreement_2023.pdf',
    type: 'Loan Agreement',
    date: 'Oct 12, 2023',
    risk: 'amber' as const,
    size: '2.4 MB',
    pages: 42,
    category: 'Tax & Finance',
    analyzeLink: '/analyze/tax-loan',
    deadline: 'Lock-in expires Aug 2024',
    excerpt: 'This Home Loan Agreement is entered into between HDFC Bank Limited ("Bank") and the Borrower(s) named herein. The loan is sanctioned subject to the terms and conditions contained herein and in the Schedule hereto which form an integral part of this Agreement.',
    clauses: [
      { text: 'Section 14.2 — Prepayment Penalty: A prepayment charge of 2% on the outstanding principal shall be levied if the loan is prepaid within 24 months of first disbursement.', risk: 'amber' as const },
      { text: 'Section 6.1 — Interest Rate: The rate of interest shall be at HDFC\'s RPLR with a spread of 2.65% per annum, payable monthly.', risk: 'green' as const },
      { text: 'Section 19 — Cross Default: Default on any other credit facility with the Bank shall constitute default under this Agreement.', risk: 'amber' as const },
      { text: 'Section 22 — Insurance: The Borrower shall maintain adequate insurance on the mortgaged property throughout the loan tenure.', risk: 'green' as const },
    ],
  },
  {
    id: 'land-title',
    name: 'Sale_Deed_Bangalore_Survey_104.pdf',
    type: 'Sale Deed',
    date: 'Sep 28, 2023',
    risk: 'red' as const,
    size: '5.1 MB',
    pages: 18,
    category: 'Land & Property',
    analyzeLink: '/analyze/land-title',
    deadline: 'Proposed signing Jul 1, 2024',
    excerpt: 'This Sale Deed is executed on this 28th day of September 2023 by Ramesh Kumar S/o Late Krishnamurthy, residing at No. 14, 3rd Cross, Jayanagar, Bengaluru — 560041 ("Vendor") in favour of the Purchaser(s) named herein.',
    clauses: [
      { text: 'Mutation Extract (2014): The property was transferred following the death of the original owner. However, the signature of legal heir Kavitha R. is absent from the mutation extract. This constitutes an incomplete transfer.', risk: 'red' as const },
      { text: 'Encumbrance Certificate: The EC issued by the Sub-Registrar covers the period 2010–2023 and confirms nil encumbrance. No prior mortgages or liens are registered.', risk: 'green' as const },
      { text: 'Power of Attorney Clause: The sale of 2018 was executed through a Power of Attorney dated 14 March 2018. The POA expired on 14 March 2021 and was not renewed at the time of this transaction.', risk: 'red' as const },
    ],
  },
  {
    id: 'cross-border-tax',
    name: 'US_Tech_OfferLetter_Remote.pdf',
    type: 'Employment Contract',
    date: 'Nov 5, 2023',
    risk: 'amber' as const,
    size: '1.2 MB',
    pages: 8,
    category: 'Employment',
    analyzeLink: '/analyze/cross-border-tax',
    deadline: 'Contract start Jul 15, 2024',
    excerpt: 'This Independent Contractor Agreement is entered into between NovaSoft Inc., a Delaware corporation ("Company"), and the Contractor named herein. The Contractor agrees to provide software development services on the terms set forth herein.',
    clauses: [
      { text: 'Schedule A — Working Hours: The Contractor shall be available Monday through Friday, 9:00 AM to 5:00 PM IST, and shall attend all company standups and sprint ceremonies.', risk: 'red' as const },
      { text: 'Section 4 — Exclusivity: During the term of this Agreement, the Contractor shall not provide services to any competitor of the Company or engage in any competing business activity.', risk: 'amber' as const },
      { text: 'Section 9 — IP Assignment: All work product, inventions, and deliverables created under this Agreement shall be the exclusive property of the Company upon creation.', risk: 'green' as const },
    ],
  },
  {
    id: 'contract-verify',
    name: 'Freelance_MSA_AcmeTech_Pvt_Ltd.pdf',
    type: 'Master Service Agreement',
    date: 'Nov 10, 2023',
    risk: 'red' as const,
    size: '0.8 MB',
    pages: 12,
    category: 'Contracts',
    analyzeLink: '/analyze/contract-verify',
    deadline: 'Project start Jun 20, 2024',
    excerpt: 'This Master Service Agreement is entered into between AcmeTech Solutions Pvt. Ltd. (CIN: U72900KA2021PTC145887) ("Client") and the Service Provider named herein for the provision of technology consulting services.',
    clauses: [
      { text: 'Preamble — CIN: U72900KA2021PTC145887. VAKEEL Alert: This CIN does not correspond to any active company on the MCA21 portal. The company was struck off in June 2023.', risk: 'red' as const },
      { text: 'Section 12 — Dispute Resolution: Any disputes arising under this Agreement shall be exclusively resolved by binding arbitration in the State of Delaware, USA, under AAA rules.', risk: 'red' as const },
      { text: 'Section 5 — Payment Terms: The Client shall pay invoices within 60 days of receipt. Late payment shall accrue interest at 1.5% per month.', risk: 'amber' as const },
    ],
  },
];

const CATEGORIES = [
  { name: 'Tax & Finance', count: 1, icon: FileText, risk: 'amber' as const },
  { name: 'Land & Property', count: 1, icon: Landmark, risk: 'red' as const },
  { name: 'Employment', count: 1, icon: FileText, risk: 'amber' as const },
  { name: 'Contracts', count: 1, icon: File, risk: 'red' as const },
];

const HEALTH_SCORE = 62;

const RISK_CLAUSE_COLORS = {
  red: 'border-l-4 border-risk-red bg-risk-red/5',
  amber: 'border-l-4 border-risk-amber bg-risk-amber/5',
  green: 'border-l-4 border-risk-green bg-risk-green/5',
};

const RISK_CLAUSE_ICONS = {
  red: <AlertTriangle className="w-3.5 h-3.5 text-risk-red shrink-0 mt-0.5" />,
  amber: <AlertTriangle className="w-3.5 h-3.5 text-risk-amber shrink-0 mt-0.5" />,
  green: <CheckCircle2 className="w-3.5 h-3.5 text-risk-green shrink-0 mt-0.5" />,
};

type DocType = typeof DOCUMENTS[number];

function DocumentViewer({ doc, onClose }: { doc: DocType; onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-3xl max-h-[90dvh] bg-card rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Viewer header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/30 shrink-0">
          <div className={`p-2 rounded-lg ${
            doc.risk === 'red' ? 'bg-risk-red/10' :
            doc.risk === 'amber' ? 'bg-risk-amber/10' :
            'bg-primary/10'
          }`}>
            <File className={`w-4 h-4 ${
              doc.risk === 'red' ? 'text-risk-red' :
              doc.risk === 'amber' ? 'text-risk-amber' :
              'text-primary'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-foreground truncate">{doc.name}</div>
            <div className="text-xs text-muted-foreground">{doc.pages} pages · {doc.size} · Added {doc.date}</div>
          </div>
          <RiskBadge level={doc.risk} size="sm" />
          <div className="flex items-center gap-2 ml-2">
            <button
              onClick={() => navigate(`/chat?doc=${doc.id}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Ask VAKEEL
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Simulated PDF page */}
          <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
            {/* Page header */}
            <div className="px-8 py-6 border-b border-border bg-muted/20">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <div className="text-right text-xs text-muted-foreground font-mono">
                  <div>{doc.name}</div>
                  <div>Page 1 of {doc.pages}</div>
                </div>
              </div>
              <h2 className="font-display text-lg font-bold text-foreground mb-1">{doc.type.toUpperCase()}</h2>
              <div className="w-16 h-0.5 bg-primary/30 rounded mb-4" />
              <p className="text-sm text-foreground/80 leading-relaxed">{doc.excerpt}</p>
            </div>

            {/* Blurred content lines (simulated body text) */}
            <div className="px-8 py-5 space-y-2">
              {[80, 100, 65, 90, 75, 100, 55, 88, 70, 95, 60].map((w, i) => (
                <div key={i} className="h-2.5 rounded-full bg-muted" style={{ width: `${w}%` }} />
              ))}
              <div className="h-4" />
              {[90, 70, 100, 80, 55, 95, 65].map((w, i) => (
                <div key={i} className="h-2.5 rounded-full bg-muted" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>

          {/* VAKEEL-flagged clauses */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <h3 className="font-display font-bold text-sm">VAKEEL — Flagged Clauses</h3>
              <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded ml-auto">
                LLAMA_3_2_1B_INST_Q4_0 · On-device
              </span>
            </div>
            <div className="space-y-2.5">
              {doc.clauses.map((clause, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`flex items-start gap-2.5 p-3.5 rounded-xl text-xs leading-relaxed ${RISK_CLAUSE_COLORS[clause.risk]}`}
                >
                  {RISK_CLAUSE_ICONS[clause.risk]}
                  <span className="text-foreground/90">{clause.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex flex-wrap items-center gap-2 shrink-0">
          <Link
            to={doc.analyzeLink}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors"
          >
            Full Analysis <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => navigate(`/chat?doc=${doc.id}`)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-card text-xs font-bold text-foreground hover:bg-muted transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-primary" /> Ask About This Document
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-card text-xs font-bold text-foreground hover:bg-muted transition-colors ml-auto">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
            <Lock className="w-3 h-3" /> Stored in vakeel.db · On-device only
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Vault() {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [viewingDoc, setViewingDoc] = useState<DocType | null>(null);

  const filtered = DOCUMENTS.filter((d) => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.type.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCat || d.category === selectedCat;
    return matchSearch && matchCat;
  });

  const healthColor = HEALTH_SCORE >= 80 ? 'text-risk-green' : HEALTH_SCORE >= 60 ? 'text-risk-amber' : 'text-risk-red';
  const healthLabel = HEALTH_SCORE >= 80 ? 'Healthy' : HEALTH_SCORE >= 60 ? 'Needs Attention' : 'Critical Issues';

  return (
    <>
      <div className="page-enter container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8"
        >
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">My Secure Vault</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>All documents stored and processed locally · </span>
              <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">vakeel.db</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 max-w-lg leading-relaxed">
              Physical documents get lost. Digital scans live here forever — encrypted on your device, indexed for instant search, and always one tap away.
            </p>
          </div>

          {/* Vault health */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4 shadow-sm shrink-0"
          >
            <div className="relative w-14 h-14">
              <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                <motion.circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke={HEALTH_SCORE >= 80 ? 'hsl(var(--risk-green))' : HEALTH_SCORE >= 60 ? 'hsl(var(--risk-amber))' : 'hsl(var(--risk-red))'}
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '0 100' }}
                  animate={{ strokeDasharray: `${HEALTH_SCORE} ${100 - HEALTH_SCORE}` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${healthColor}`}>
                {HEALTH_SCORE}
              </span>
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Vault Health</div>
              <div className={`font-display font-bold ${healthColor}`}>{healthLabel}</div>
              <div className="text-xs text-muted-foreground mt-0.5">2 documents need review</div>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main document list */}
          <div className="lg:col-span-3 space-y-5">
            {/* Semantic search */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="bg-card border border-border rounded-xl p-3 flex gap-2 shadow-sm"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder='Search vault... try "loan" or "sale deed"'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-muted/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-colors placeholder:text-muted-foreground/60"
                />
              </div>
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted/40 text-xs font-mono text-muted-foreground border border-border shrink-0">
                <Database className="w-3.5 h-3.5" />
                NOMIC_EMBED
              </div>
            </motion.div>

            {/* Document cards */}
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {filtered.map((doc, i) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden group hover:shadow-md hover:border-primary/20 transition-all duration-200"
                  >
                    {/* Risk accent bar */}
                    <div className={`h-1 w-full ${
                      doc.risk === 'red' ? 'bg-risk-red' :
                      doc.risk === 'amber' ? 'bg-risk-amber' :
                      'bg-risk-green'
                    }`} />

                    <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* File icon */}
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        doc.risk === 'red' ? 'bg-risk-red/10' :
                        doc.risk === 'amber' ? 'bg-risk-amber/10' :
                        'bg-primary/10'
                      }`}>
                        <File className={`w-5 h-5 ${
                          doc.risk === 'red' ? 'text-risk-red' :
                          doc.risk === 'amber' ? 'text-risk-amber' :
                          'text-primary'
                        }`} />
                      </div>

                      {/* Doc info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-foreground truncate">{doc.name}</span>
                          <RiskBadge level={doc.risk} size="sm" />
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span>{doc.type}</span>
                          <span>·</span>
                          <span>{doc.pages} pages</span>
                          <span>·</span>
                          <span>{doc.size}</span>
                          <span>·</span>
                          <span>Added {doc.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 shrink-0" />
                          {doc.deadline}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setViewingDoc(doc)}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-muted/40 text-xs font-semibold text-foreground hover:bg-muted hover:border-primary/20 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/chat?doc=${doc.id}`)}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Ask VAKEEL
                        </button>
                        <Link
                          to={doc.analyzeLink}
                          className="flex items-center gap-1 px-3 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all"
                        >
                          Analyze <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filtered.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 text-muted-foreground bg-card border border-dashed border-border rounded-2xl"
                >
                  <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No documents match your search</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Upload */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18 }}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                dragActive ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border bg-card hover:border-primary/40 hover:bg-primary/3'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
            >
              <motion.div
                animate={dragActive ? { scale: 1.15 } : { scale: 1 }}
                className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
              >
                <Upload className="w-5 h-5 text-primary" />
              </motion.div>
              <h3 className="font-display font-bold text-sm text-foreground mb-1">Add to Vault</h3>
              <p className="text-xs text-muted-foreground mb-1">Drag a PDF, photo, or scan here.</p>
              <p className="text-xs text-muted-foreground/70 mb-4 leading-relaxed">
                Physical documents get lost. Your vault keeps them safe forever.
              </p>
              <button className="btn-shine w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm">
                Select File
              </button>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-risk-green" />
                Encrypted on-device · never uploaded
              </div>
            </motion.div>

            {/* Quick ask banner */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22 }}
              className="bg-primary rounded-2xl p-5 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
              <div className="relative z-10">
                <MessageSquare className="w-6 h-6 text-secondary mb-2" />
                <h3 className="font-display font-bold text-base mb-1">Ask VAKEEL</h3>
                <p className="text-xs text-white/70 mb-4 leading-relaxed">
                  Got a legal question? Ask about any document in your vault or any Indian law.
                </p>
                <button
                  onClick={() => navigate('/chat')}
                  className="btn-shine w-full bg-white text-primary py-2 rounded-xl text-xs font-bold hover:bg-white/95 transition-colors"
                >
                  Open Document Chat
                </button>
              </div>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.26 }}
              className="bg-card border border-border rounded-2xl p-5 shadow-sm"
            >
              <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest mb-4">Categories</h3>
              <ul className="space-y-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCat === cat.name;
                  return (
                    <li key={cat.name}>
                      <button
                        onClick={() => setSelectedCat(isSelected ? null : cat.name)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${
                          isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'
                        }`}
                      >
                        <span className="flex items-center gap-2 font-medium">
                          <Icon className="w-4 h-4 opacity-60" /> {cat.name}
                        </span>
                        <span className="flex items-center gap-2">
                          <RiskBadge level={cat.risk} size="sm" />
                          <span className="text-xs text-muted-foreground">{cat.count}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>

            {/* QVAC info */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-muted/50 border border-border rounded-2xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <QvacBadge compact />
                <span className="text-xs font-bold text-muted-foreground">Vault powered by</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Semantic search via <span className="font-mono">NOMIC_EMBED_TEXT_V1_5_Q8_0</span>. All embeddings stored in <span className="font-mono">vakeel.db</span> on your device.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      <AnimatePresence>
        {viewingDoc && (
          <DocumentViewer doc={viewingDoc} onClose={() => setViewingDoc(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
