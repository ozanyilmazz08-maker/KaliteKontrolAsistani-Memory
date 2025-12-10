import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number; // percentage change
  sparklineData?: number[];
  status?: 'good' | 'warning' | 'critical';
  onClick?: () => void;
}

export function KPICard({
  title,
  value,
  unit,
  trend,
  sparklineData,
  status = 'good',
  onClick,
}: KPICardProps) {
  const getTrendIcon = () => {
    if (!trend) return <Minus className="w-4 h-4" />;
    if (trend > 0) return <TrendingUp className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (!trend) return 'text-gray-500';
    if (trend > 0) return 'text-green-600';
    return 'text-red-600';
  };

  const getStatusColor = () => {
    if (status === 'critical') return 'border-red-300 bg-red-50';
    if (status === 'warning') return 'border-yellow-300 bg-yellow-50';
    return 'border-gray-200 bg-white';
  };

  return (
    <div
      className={`p-4 rounded-lg border ${getStatusColor()} ${
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      }`}
      onClick={onClick}
    >
      <div className="text-sm text-gray-600 mb-2">{title}</div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl text-gray-900">{value}</span>
        {unit && <span className="text-sm text-gray-500">{unit}</span>}
      </div>
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
          {getTrendIcon()}
          {trend !== undefined && <span>{Math.abs(trend)}%</span>}
        </div>
        {sparklineData && sparklineData.length > 0 && (
          <div className="flex items-end gap-0.5 h-6">
            {sparklineData.map((val, idx) => (
              <div
                key={idx}
                className="w-1 bg-blue-500 rounded-sm"
                style={{ height: `${(val / Math.max(...sparklineData)) * 100}%` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
