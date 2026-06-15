import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group w-fit">
              <div className="bg-background text-foreground p-1.5 rounded-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-background">VaultAI</span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              Local-first legal intelligence for India. Your documents never leave your device.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 font-display">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/how-it-works" className="hover:text-background transition-colors">How it works</Link></li>
              <li><Link to="/vault" className="hover:text-background transition-colors">Vault</Link></li>
              <li><Link to="/analyze/tax-loan" className="hover:text-background transition-colors">Demo: Home Loan</Link></li>
              <li><Link to="/analyze/land-title" className="hover:text-background transition-colors">Demo: Land Title</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 font-display">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="hover:text-background transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-background transition-colors cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-background transition-colors cursor-pointer">Security Practices</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-muted-foreground/20 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>This is a demonstration application.</p>
          <div className="flex items-center gap-1 mt-4 md:mt-0">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Local Processing</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
