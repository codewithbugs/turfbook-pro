import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  delay?: number;
}

export const StatsCard = ({ label, value, change, changeType, icon: Icon, delay = 0 }: StatsCardProps) => {
  return (
    <Card 
      className="border-border animate-slide-up" 
      style={{ animationDelay: `${delay}s` }}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium",
            changeType === 'positive' && "text-primary",
            changeType === 'negative' && "text-destructive",
            changeType === 'neutral' && "text-muted-foreground"
          )}>
            {changeType === 'positive' && <TrendingUp className="w-4 h-4" />}
            {changeType === 'negative' && <TrendingDown className="w-4 h-4" />}
            {change}
          </div>
        </div>
        <p className="text-3xl font-bold text-foreground font-display mb-1">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
};
