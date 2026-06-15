import { ShieldCheck, ServerOff, Cpu, FileSearch } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6"
        >
          <ShieldCheck className="w-4 h-4" /> Architecture Deep Dive
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-display font-bold mb-4"
        >
          Zero Trust. 100% Local.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Your legal documents contain your most sensitive data. We built VaultAI so that your files never leave your browser.
        </motion.p>
      </div>

      <div className="space-y-12 mb-16">
        <FeatureBlock 
          icon={ServerOff}
          title="No Cloud Servers"
          description="When you upload a document to VaultAI, it is not sent to AWS, GCP, or any external server. We utilize WebAssembly (Wasm) to run the entire analysis engine directly within your Chrome, Safari, or Edge browser."
        />
        <FeatureBlock 
          icon={FileSearch}
          title="Local OCR & Extraction"
          description="We use highly optimized, in-browser optical character recognition. Text is stripped from PDFs locally. Your PAN, Aadhaar, and salary details remain solely in your device's memory and are cleared when you close the tab."
        />
        <FeatureBlock 
          icon={Cpu}
          title="Small Language Models (SLMs)"
          description="Instead of sending data to OpenAI, we download a highly specialized, 20MB rules engine and a compressed local AI model to your browser cache. It's trained exclusively on Indian contract law, FEMA guidelines, and real estate precedents."
        />
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-display font-bold mb-4">Verify it yourself.</h2>
        <p className="text-muted-foreground mb-6">
          Don't trust our words. Open your browser's Network Tab. Upload a document. You will see zero outbound network requests containing your file.
        </p>
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold shadow-md hover:bg-primary/90 transition-colors">
          Try the Demo Now
        </button>
      </div>
    </div>
  );
}

function FeatureBlock({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-white p-6 rounded-xl border border-border shadow-sm">
      <div className="bg-primary/10 p-4 rounded-full shrink-0">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
