import React, { useState } from 'react';
import { TrendingUp, DollarSign, Users, ShoppingCart, BarChart3 } from 'lucide-react';
import { AnalyticsContext } from '../../../analytics-app';
import StatCard from '../molecules/StatCard';
import KPIDrillDownModal from '../molecules/KPIDrillDownModal';
import Card from '../atoms/Card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * ORGANISM: Overview Dashboard
 * Complete dashboard with ALL content populated
 * - Stat cards row (molecules with real data)
 * - Multiple chart panels (with axes, legends, data)
 * - Data table (with real rows and columns)
 * NO EMPTY PLACEHOLDERS - everything functional
 */

interface OverviewDashboardProps {
  context: AnalyticsContext;
  updateContext: (updates: Partial<AnalyticsContext>) => void;
}

export default function OverviewDashboard({ context }: OverviewDashboardProps) {
  const [selectedKPI, setSelectedKPI] = useState<any>(null);

  // Real data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000, target: 40000 },
    { month: 'Feb', revenue: 52000, target: 45000 },
    { month: 'Mar', revenue: 48000, target: 50000 },
    { month: 'Apr', revenue: 61000, target: 55000 },
    { month: 'May', revenue: 55000, target: 60000 },
    { month: 'Jun', revenue: 67000, target: 65000 },
    { month: 'Jul', revenue: 72000, target: 70000 },
    { month: 'Aug', revenue: 69000, target: 72000 },
    { month: 'Sep', revenue: 78000, target: 75000 },
    { month: 'Oct', revenue: 84000, target: 80000 },
    { month: 'Nov', revenue: 91000, target: 85000 },
    { month: 'Dec', revenue: 89000, target: 90000 }
  ];

  const categoryData = [
    { name: 'Electronics', value: 35, color: '#3b82f6' },
    { name: 'Clothing', value: 25, color: '#10b981' },
    { name: 'Home & Garden', value: 20, color: '#f59e0b' },
    { name: 'Sports', value: 12, color: '#8b5cf6' },
    { name: 'Other', value: 8, color: '#6b7280' }
  ];

  const regionData = [
    { region: 'North America', sales: 125000 },
    { region: 'Europe', sales: 98000 },
    { region: 'Asia Pacific', sales: 156000 },
    { region: 'Latin America', sales: 67000 },
    { region: 'Middle East', sales: 45000 }
  ];

  const kpis = [
    {
      label: 'Total Revenue',
      value: '$847,230',
      icon: DollarSign,
      trend: 'up' as const,
      change: '+12.5%',
      color: 'green' as const
    },
    {
      label: 'Total Orders',
      value: '12,483',
      icon: ShoppingCart,
      trend: 'up' as const,
      change: '+8.2%',
      color: 'blue' as const
    },
    {
      label: 'Active Users',
      value: '8,924',
      icon: Users,
      trend: 'up' as const,
      change: '+15.3%',
      color: 'purple' as const
    },
    {
      label: 'Conversion Rate',
      value: '3.24%',
      icon: TrendingUp,
      trend: 'down' as const,
      change: '-0.8%',
      color: 'yellow' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Analytics Overview</h1>
        <p className="text-gray-600">
          Comprehensive view of your data and metrics for {context.dateRange.start} to {context.dateRange.end}
        </p>
      </div>

      {/* Stats Cards Row - Molecules - NOW CLICKABLE */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <div key={index} onClick={() => setSelectedKPI(kpi)}>
            <StatCard {...kpi} />
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 gap-6">
        {/* Revenue Trend Chart - Fully Populated */}
        <Card>
          <div className="mb-4">
            <h3 className="text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Revenue Trend
            </h3>
            <p className="text-gray-600 mt-1">Monthly revenue vs target</p>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
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
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
                name="Actual Revenue"
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#10b981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#10b981', r: 3 }}
                name="Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution - Fully Populated */}
        <Card>
          <div className="mb-4">
            <h3 className="text-gray-900">Sales by Category</h3>
            <p className="text-gray-600 mt-1">Product category breakdown</p>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend with values */}
          <div className="mt-4 space-y-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-gray-700">{cat.name}</span>
                </div>
                <span className="text-gray-900">{cat.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-2 gap-6">
        {/* Regional Sales - Fully Populated */}
        <Card>
          <div className="mb-4">
            <h3 className="text-gray-900">Sales by Region</h3>
            <p className="text-gray-600 mt-1">Geographic performance</p>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="region" 
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
                dataKey="sales" 
                fill="#8b5cf6"
                radius={[8, 8, 0, 0]}
                name="Sales"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Products Table - Fully Populated */}
        <Card>
          <div className="mb-4">
            <h3 className="text-gray-900">Top Products</h3>
            <p className="text-gray-600 mt-1">Best performing items</p>
          </div>
          
          <div className="overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-gray-700">Product</th>
                  <th className="px-4 py-3 text-right text-gray-700">Sales</th>
                  <th className="px-4 py-3 text-right text-gray-700">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { rank: 1, name: 'Wireless Headphones Pro', sales: 2847, revenue: 427050 },
                  { rank: 2, name: 'Smart Watch Elite', sales: 2134, revenue: 384120 },
                  { rank: 3, name: 'Laptop Stand Deluxe', sales: 1923, revenue: 115380 },
                  { rank: 4, name: 'USB-C Hub 7-in-1', sales: 1756, revenue: 87800 },
                  { rank: 5, name: 'Mechanical Keyboard RGB', sales: 1502, revenue: 180240 }
                ].map((product) => (
                  <tr key={product.rank} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-600">{product.rank}</td>
                    <td className="px-4 py-3 text-gray-900">{product.name}</td>
                    <td className="px-4 py-3 text-right text-gray-900">{product.sales.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-green-600">
                      ${product.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* KPI Drill-Down Modal */}
      {selectedKPI && (
        <KPIDrillDownModal
          metric={selectedKPI}
          onClose={() => setSelectedKPI(null)}
        />
      )}
    </div>
  );
}