import { clsx } from 'clsx';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

type RiskLevel = 'green' | 'amber' | 'red' | 'processing';

export default function RiskBadge({ level, text, className }: { level: RiskLevel; text?: string; className?: string }) {
  if (level === 'processing') {
    return (
      <div className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground", className)}>
        <div className="w-3 h-3 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />
        {text || 'Processing'}
      </div>
    );
  }

  const configs = {
    green: {
      bg: 'bg-risk-green/10',
      text: 'text-risk-green',
      icon: CheckCircle2,
      defaultText: 'Safe'
    },
    amber: {
      bg: 'bg-risk-amber/10',
      text: 'text-risk-amber',
      icon: AlertTriangle,
      defaultText: 'Caution'
    },
    red: {
      bg: 'bg-risk-red/10',
      text: 'text-risk-red',
      icon: AlertCircle,
      defaultText: 'Danger'
    }
  };

  const config = configs[level];
  const Icon = config.icon;

  return (
    <div className={clsx(`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`, className)}>
      <Icon className="w-3.5 h-3.5" />
      {text || config.defaultText}
    </div>
  );
}
