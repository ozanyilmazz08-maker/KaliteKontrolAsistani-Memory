import React from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../atoms/Card';

/**
 * INTERACTION CHAIN: KPI Card → Drill-Down Detail View
 * Complete breakdown of metric with historical data and breakdown
 */

interface KPIDrillDownModalProps {
  metric: {
    label: string;
    value: string;
    trend: 'up' | 'down' | 'neutral';
    change: string;
  };
  onClose: () => void;
}

export default function KPIDrillDownModal({ metric, onClose }: KPIDrillDownModalProps) {
  const historicalData = [
    { date: 'Week 1', value: 750000, target: 700000 },
    { date: 'Week 2', value: 780000, target: 720000 },
    { date: 'Week 3', value: 810000, target: 750000 },
    { date: 'Week 4', value: 847230, target: 800000 }
  ];

  const breakdownData = [
    { category: 'North America', value: 312000, percentage: 36.8 },
    { category: 'Europe', value: 265000, percentage: 31.3 },
    { category: 'Asia Pacific', value: 187000, percentage: 22.1 },
    { category: 'Latin America', value: 83230, percentage: 9.8 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl w-[800px] max-h-[85vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
          <div>
            <h2 className="text-gray-900">{metric.label} - Detailed Analysis</h2>
            <p className="text-gray-600 mt-1">In-depth breakdown and trends</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <p className="text-gray-600 mb-2">Current Value</p>
              <p className="text-gray-900 mb-1">{metric.value}</p>
              <div className={`flex items-center gap-1 ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{metric.change} vs last period</span>
              </div>
            </Card>

            <Card>
              <p className="text-gray-600 mb-2">Target</p>
              <p className="text-gray-900 mb-1">$800,000</p>
              <p className="text-green-600">+5.9% above target</p>
            </Card>

            <Card>
              <p className="text-gray-600 mb-2">Average</p>
              <p className="text-gray-900 mb-1">$797,058</p>
              <p className="text-gray-600">Last 4 weeks</p>
            </Card>
          </div>

          {/* Historical Trend */}
          <Card>
            <h3 className="text-gray-900 mb-4">4-Week Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  name="Actual"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#10b981', r: 4 }}
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Regional Breakdown */}
          <Card>
            <h3 className="text-gray-900 mb-4">Breakdown by Region</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={breakdownData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="category" 
                  stroke="#6b7280"
                  style={{ fontSize: '11px' }}
                  angle={-15}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Bar 
                  dataKey="value" 
                  fill="#8b5cf6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Breakdown Table */}
            <div className="mt-4 space-y-2">
              {breakdownData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">{item.category}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-900">${item.value.toLocaleString()}</span>
                    <span className="text-gray-600 w-16 text-right">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Key Insights */}
          <Card>
            <h3 className="text-gray-900 mb-3">Key Insights</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-green-900">Strong Performance</p>
                  <p className="text-green-700 mt-1">Revenue exceeded target by 5.9% this period</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-blue-900">Growth Trend</p>
                  <p className="text-blue-700 mt-1">Consistent week-over-week growth of ~3.5%</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-purple-900">Top Performer</p>
                  <p className="text-purple-700 mt-1">North America leading with 36.8% of total revenue</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
