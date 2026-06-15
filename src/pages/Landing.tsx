import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Upload, FileText, ChevronRight, Lock, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 text-primary text-sm font-semibold mb-6 border border-primary/10"
            >
              <Lock className="w-4 h-4" />
              100% Local Processing. Documents never leave your device.
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-extrabold leading-[1.1] tracking-tight mb-6 text-foreground"
            >
              Before you sign,<br />
              <span className="text-primary">know what it costs.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
            >
              VaultAI is your private legal risk engine. Upload your property deeds, loan agreements, or employment contracts. In 30 seconds, our local AI flags hidden traps that could cost you lakhs.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link to="/vault" className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5">
                <Upload className="w-5 h-5" />
                Upload a Document
              </Link>
              <Link to="/how-it-works" className="w-full sm:w-auto px-8 py-4 bg-white text-foreground border border-border rounded-lg font-bold text-lg hover:bg-muted transition-all flex items-center justify-center gap-2">
                See How It Works
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust & Stats */}
      <section className="py-12 border-y border-border/50 bg-white/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="p-4">
              <div className="text-4xl font-display font-bold text-primary mb-2">30s</div>
              <div className="text-sm text-muted-foreground font-medium">Average scan time</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-display font-bold text-primary mb-2">₹0</div>
              <div className="text-sm text-muted-foreground font-medium">Data sent to servers (Fully Local)</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-display font-bold text-primary mb-2">5,000+</div>
              <div className="text-sm text-muted-foreground font-medium">Legal patterns recognized</div>
            </div>
          </div>
        </div>
      </section>

      {/* Personas Section */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">What's hiding in your paperwork?</h2>
            <p className="text-lg text-muted-foreground">Select a scenario to see how VaultAI analyzes complex documents in seconds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PersonaCard
              title="The Middle Class Salaried"
              context="Home Loan Agreement & Salary Slips"
              checks={['Hidden charges', 'Missed 80C deductions', 'Tax regime comparison']}
              verdict="Your home loan has a 2% prepayment penalty. Switching to SBI now will cost ₹40,000 in penalties. Wait 8 months."
              risk="amber"
              link="/analyze/tax-loan"
            />
            <PersonaCard
              title="The Land Buyer"
              context="Title Deed & Mutation Records (Patta)"
              checks={['Ownership chain breaks', 'Fake POA patterns', 'Encumbrances']}
              verdict="Title has an unresolved mutation from 2014. The seller's sister hasn't relinquished rights. Do not sign the sale agreement."
              risk="red"
              link="/analyze/land-title"
            />
            <PersonaCard
              title="The Remote Worker"
              context="Employment Contract & FEMA"
              checks={['Double taxation', 'FEMA compliance', 'Misclassification']}
              verdict="You are classified as an 'Independent Contractor' but mandated to work fixed IST hours. This breaches Indian labor law. Ask for a Consultant Addendum."
              risk="amber"
              link="/analyze/cross-border-tax"
            />
            <PersonaCard
              title="The Freelancer"
              context="Client Contract"
              checks={['Forged signatures', 'Milestone traps', 'IP overreach']}
              verdict="Company registration number (CIN) in the contract does not match MCA public records. High forgery risk. Do not commence work."
              risk="red"
              link="/analyze/contract-verify"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function PersonaCard({ title, context, checks, verdict, risk, link }: { title: string, context: string, checks: string[], verdict: string, risk: 'green'|'amber'|'red', link: string }) {
  return (
    <Link to={link} className="block group">
      <div className="bg-card border border-border rounded-xl p-8 h-full shadow-sm hover:shadow-md transition-all relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
        
        <div className="mb-6">
          <h3 className="text-xl font-display font-bold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <FileText className="w-4 h-4" /> {context}
          </p>
        </div>

        <div className="mb-6 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Checks</p>
          <ul className="text-sm space-y-1">
            {checks.map((check, i) => (
              <li key={i} className="flex items-center gap-2 text-foreground/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary/60" /> {check}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Verdict</span>
            <RiskBadge level={risk} />
          </div>
          <p className="text-sm font-medium text-foreground leading-snug">{verdict}</p>
        </div>

        <div className="mt-6 flex items-center justify-end text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
          Run Demo Scan <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </Link>
  );
}
