import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md group-hover:bg-primary/90 transition-colors">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">VaultAI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            How it Works
          </Link>
          <Link to="/vault" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            My Vault
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/vault" className="hidden md:flex text-sm font-medium text-foreground hover:text-primary transition-colors">
            Sign In
          </Link>
          <Link to="/vault" className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            Open Vault
          </Link>
        </div>
      </div>
    </header>
  );
}
