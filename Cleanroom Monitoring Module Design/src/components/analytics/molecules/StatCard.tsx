import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from '../atoms/Card';

/**
 * MOLECULE: StatCard
 * Combines atoms to display a metric with context
 * - Icon (visual identification)
 * - Label (metric name)
 * - Value (primary data)
 * - Trend indicator (change direction)
 * - Change value (percentage/delta)
 */

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  change?: string;
  color?: 'blue' | 'green' | 'red' | 'purple' | 'yellow';
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  change,
  color = 'blue'
}: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600'
  };

  const getTrendIcon = () => {
    if (trend === 'up') return TrendingUp;
    if (trend === 'down') return TrendingDown;
    return Minus;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const TrendIcon = getTrendIcon();

  return (
    <Card hover shadow="md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 mb-1">{label}</p>
          <p className="text-gray-900 mb-2">{value}</p>
          
          {trend && change && (
            <div className={`flex items-center gap-1 ${getTrendColor()}`}>
              <TrendIcon className="w-4 h-4" />
              <span>{change}</span>
            </div>
          )}
        </div>

        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}
