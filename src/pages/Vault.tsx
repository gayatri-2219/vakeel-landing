import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, Trash2, Search, Filter, ShieldCheck, Lock, Activity } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';

const mockDocuments = [
  { id: 1, name: 'HDFC_HomeLoan_Agreement_2023.pdf', type: 'Loan Agreement', date: 'Oct 12, 2023', risk: 'amber', size: '2.4 MB', category: 'Tax & Finance' },
  { id: 2, name: 'Sale_Deed_Bangalore_Plot.pdf', type: 'Title Deed', date: 'Sep 28, 2023', risk: 'red', size: '5.1 MB', category: 'Land & Property' },
  { id: 3, name: 'OfferLetter_TechCorp_US.pdf', type: 'Employment', date: 'Nov 05, 2023', risk: 'green', size: '1.2 MB', category: 'Employment' },
  { id: 4, name: 'Freelance_Master_Service_Agreement.pdf', type: 'Contract', date: 'Nov 10, 2023', risk: 'green', size: '0.8 MB', category: 'Contracts' },
];

export default function Vault() {
  const [dragActive, setDragActive] = useState(false);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">My Secure Vault</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Lock className="w-4 h-4" /> All documents are stored and processed locally on this device.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white border border-border rounded-lg p-3 shadow-sm">
          <div className="bg-primary/10 p-2 rounded-md">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-semibold uppercase">Vault Health</div>
            <div className="font-bold text-foreground">75/100 (Needs Attention)</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search local vault..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>

          {/* Document List */}
          <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-6 md:col-span-5">Document</div>
              <div className="col-span-3 hidden md:block">Category</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-3 md:col-span-1 text-right">Actions</div>
            </div>
            <div className="divide-y divide-border">
              {mockDocuments.map((doc) => (
                <div key={doc.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/20 transition-colors">
                  <div className="col-span-6 md:col-span-5 flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded shrink-0 mt-0.5">
                      <File className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-sm text-foreground truncate">{doc.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{doc.size} • Uploaded {doc.date}</div>
                    </div>
                  </div>
                  <div className="col-span-3 hidden md:block text-sm text-muted-foreground">
                    {doc.category}
                  </div>
                  <div className="col-span-3">
                    <RiskBadge level={doc.risk as any} />
                  </div>
                  <div className="col-span-3 md:col-span-1 flex justify-end">
                    <button className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Upload Area */}
          <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-border bg-white hover:border-primary/50'}`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
          >
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Upload for Analysis</h3>
            <p className="text-sm text-muted-foreground mb-6">Drag & drop your PDF here, or click to browse. Max size 20MB.</p>
            <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md text-sm font-bold shadow-md hover:bg-primary/90 transition-colors w-full">
              Select File
            </button>
            <p className="text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Secure local processing
            </p>
          </div>

          <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Categories</h3>
            <ul className="space-y-3">
              {['Tax & Finance', 'Land & Property', 'Employment', 'Contracts'].map((cat) => (
                <li key={cat} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{cat}</span>
                  <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs">1</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
