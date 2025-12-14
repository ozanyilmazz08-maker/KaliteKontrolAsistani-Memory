import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  total?: string;
  percentage?: string;
  trend: 'up' | 'down' | 'stable';
  timeContext: string;
  severity?: 'success' | 'warning' | 'critical' | 'info';
}

export default function KPICard({ label, value, total, percentage, trend, timeContext, severity }: KPICardProps) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (severity === 'critical') return trend === 'up' ? 'text-red-600' : trend === 'down' ? 'text-green-600' : 'text-gray-600';
    if (severity === 'warning') return trend === 'up' ? 'text-yellow-600' : trend === 'down' ? 'text-green-600' : 'text-gray-600';
    if (severity === 'success') return 'text-green-600';
    return 'text-gray-600';
  };

  const getBorderColor = () => {
    if (severity === 'critical') return 'border-l-red-500';
    if (severity === 'warning') return 'border-l-yellow-500';
    if (severity === 'success') return 'border-l-green-500';
    return 'border-l-blue-500';
  };

  return (
    <button className={`bg-white rounded-lg border border-gray-200 border-l-4 ${getBorderColor()} p-6 hover:shadow-md transition-shadow text-left w-full`}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-gray-600">{label}</p>
        <div className={getTrendColor()}>
          {getTrendIcon()}
        </div>
      </div>
      
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-gray-900">{value}</span>
        {total && <span className="text-gray-600">/ {total}</span>}
        {percentage && <span className="text-gray-900">({percentage})</span>}
      </div>
      
      <p className="text-gray-500">{timeContext}</p>
    </button>
  );
}
