import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, File, Trash2, Search, SlidersHorizontal, ShieldCheck,
  Lock, Activity, Clock, ChevronRight, Database, Landmark, FileText
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import QvacBadge from '../components/QvacBadge';

const DOCUMENTS = [
  {
    id: 1,
    name: 'HDFC_HomeLoan_Agreement_2023.pdf',
    type: 'Loan Agreement',
    date: 'Oct 12, 2023',
    risk: 'amber' as const,
    size: '2.4 MB',
    category: 'Tax & Finance',
    analyzeLink: '/analyze/tax-loan',
    deadline: 'Lock-in expires Aug 2024',
  },
  {
    id: 2,
    name: 'Sale_Deed_Bangalore_Survey_104.pdf',
    type: 'Title Deed',
    date: 'Sep 28, 2023',
    risk: 'red' as const,
    size: '5.1 MB',
    category: 'Land & Property',
    analyzeLink: '/analyze/land-title',
    deadline: 'Proposed signing Jul 1, 2024',
  },
  {
    id: 3,
    name: 'US_Tech_OfferLetter_Remote.pdf',
    type: 'Employment Contract',
    date: 'Nov 5, 2023',
    risk: 'amber' as const,
    size: '1.2 MB',
    category: 'Employment',
    analyzeLink: '/analyze/cross-border-tax',
    deadline: 'Contract start Jul 15, 2024',
  },
  {
    id: 4,
    name: 'Freelance_MSA_AcmeTech_Pvt_Ltd.pdf',
    type: 'Master Service Agreement',
    date: 'Nov 10, 2023',
    risk: 'red' as const,
    size: '0.8 MB',
    category: 'Contracts',
    analyzeLink: '/analyze/contract-verify',
    deadline: 'Project start Jun 20, 2024',
  },
];

const CATEGORIES = [
  { name: 'Tax & Finance', count: 1, icon: FileText, risk: 'amber' as const },
  { name: 'Land & Property', count: 1, icon: Landmark, risk: 'red' as const },
  { name: 'Employment', count: 1, icon: FileText, risk: 'amber' as const },
  { name: 'Contracts', count: 1, icon: File, risk: 'red' as const },
];

const HEALTH_SCORE = 62;

export default function Vault() {
  const [dragActive, setDragActive] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const filtered = DOCUMENTS.filter((d) => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.type.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCat || d.category === selectedCat;
    return matchSearch && matchCat;
  });

  const healthColor = HEALTH_SCORE >= 80 ? 'text-risk-green' : HEALTH_SCORE >= 60 ? 'text-risk-amber' : 'text-risk-red';
  const healthLabel = HEALTH_SCORE >= 80 ? 'Healthy' : HEALTH_SCORE >= 60 ? 'Needs Attention' : 'Critical Issues';

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">My Secure Vault</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span>All documents stored and processed locally · </span>
            <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">vakeel.db</span>
          </div>
        </div>

        {/* Vault health */}
        <div className="flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4 shadow-sm shrink-0">
          <div className="relative w-14 h-14">
            <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke={HEALTH_SCORE >= 80 ? 'hsl(var(--risk-green))' : HEALTH_SCORE >= 60 ? 'hsl(var(--risk-amber))' : 'hsl(var(--risk-red))'}
                strokeWidth="3"
                strokeDasharray={`${HEALTH_SCORE} ${100 - HEALTH_SCORE}`}
                strokeLinecap="round"
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main document list */}
        <div className="lg:col-span-3 space-y-5">
          {/* QVAC semantic search */}
          <div className="bg-card border border-border rounded-xl p-3 flex gap-2 shadow-sm">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder='Search vault... try "agreements expiring in 6 months"'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-muted/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-colors placeholder:text-muted-foreground/60"
              />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted/40 text-xs font-mono text-muted-foreground border border-border shrink-0">
              <Database className="w-3.5 h-3.5" />
              NOMIC_EMBED
            </div>
          </div>

          {/* Document table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 gap-2 px-5 py-3 border-b border-border bg-muted/30 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              <div className="col-span-5">Document</div>
              <div className="col-span-2 hidden md:block">Category</div>
              <div className="col-span-2">Risk</div>
              <div className="col-span-3 hidden md:block">Next Deadline</div>
            </div>

            <AnimatePresence initial={false}>
              {filtered.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  className="grid grid-cols-12 gap-2 px-5 py-4 items-center border-b border-border last:border-0 hover:bg-muted/20 transition-colors group"
                >
                  <div className="col-span-5 flex items-start gap-3">
                    <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
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
                    <div className="min-w-0">
                      <div className="font-medium text-sm text-foreground truncate">{doc.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{doc.size} · {doc.date}</div>
                    </div>
                  </div>

                  <div className="col-span-2 hidden md:block text-xs text-muted-foreground">{doc.category}</div>

                  <div className="col-span-2">
                    <RiskBadge level={doc.risk} size="sm" />
                  </div>

                  <div className="col-span-3 hidden md:flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-3 h-3 shrink-0" />
                      {doc.deadline}
                    </span>
                    <Link
                      to={doc.analyzeLink}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs font-bold text-primary px-2 py-1 rounded-md hover:bg-primary/10"
                    >
                      Analyze <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No documents match your search</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Upload */}
          <div
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
              dragActive ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border bg-card hover:border-primary/40'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
          >
            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Upload className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display font-bold text-sm text-foreground mb-1">Upload Document</h3>
            <p className="text-xs text-muted-foreground mb-4">PDF, photo, or scan. Max 20 MB.</p>
            <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm">
              Select File
            </button>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-risk-green" />
              Encrypted on-device only
            </div>
          </div>

          {/* Categories */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
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
          </div>

          {/* QVAC info */}
          <div className="bg-muted/50 border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <QvacBadge compact />
              <span className="text-xs font-bold text-muted-foreground">Vault powered by</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Semantic search via <span className="font-mono">NOMIC_EMBED_TEXT_V1_5_Q8_0</span>. All embeddings stored in <span className="font-mono">vakeel.db</span> on your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
