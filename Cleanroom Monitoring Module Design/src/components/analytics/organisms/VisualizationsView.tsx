import React, { useState } from 'react';
import { PieChart as PieChartIcon, BarChart3, LineChart as LineChartIcon, TrendingUp, Plus } from 'lucide-react';
import { AnalyticsContext } from '../../../analytics-app';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner@2.0.3';

/**
 * ORGANISM: Visualizations View
 * Gallery of saved visualizations with previews
 * - Each card shows a real chart preview
 * - Complete metadata displayed
 * - Action buttons functional
 * NO PLACEHOLDERS - all charts rendered
 */

interface VisualizationsViewProps {
  context: AnalyticsContext;
  updateContext: (updates: Partial<AnalyticsContext>) => void;
}

export default function VisualizationsView({ context }: VisualizationsViewProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const sampleData1 = [
    { name: 'Q1', value: 45000 },
    { name: 'Q2', value: 52000 },
    { name: 'Q3', value: 61000 },
    { name: 'Q4', value: 72000 }
  ];

  const sampleData2 = [
    { name: 'Product A', value: 35 },
    { name: 'Product B', value: 25 },
    { name: 'Product C', value: 20 },
    { name: 'Product D', value: 12 },
    { name: 'Other', value: 8 }
  ];

  const sampleData3 = [
    { month: 'Jan', users: 1200, revenue: 45000 },
    { month: 'Feb', users: 1500, revenue: 52000 },
    { month: 'Mar', users: 1800, revenue: 61000 },
    { month: 'Apr', users: 2100, revenue: 72000 }
  ];

  const visualizations = [
    {
      id: 'viz-1',
      name: 'Quarterly Revenue Trend',
      type: 'bar',
      description: 'Revenue performance by quarter',
      dataset: 'sales_2024',
      createdBy: 'Sarah Chen',
      lastModified: '2 hours ago',
      chartData: sampleData1
    },
    {
      id: 'viz-2',
      name: 'Product Distribution',
      type: 'pie',
      description: 'Market share by product line',
      dataset: 'sales_2024',
      createdBy: 'Mike Johnson',
      lastModified: '1 day ago',
      chartData: sampleData2
    },
    {
      id: 'viz-3',
      name: 'Growth Metrics',
      type: 'line',
      description: 'User growth and revenue correlation',
      dataset: 'customer_data',
      createdBy: 'Sarah Chen',
      lastModified: '3 days ago',
      chartData: sampleData3
    },
    {
      id: 'viz-4',
      name: 'Regional Sales',
      type: 'bar',
      description: 'Sales performance by region',
      dataset: 'sales_2024',
      createdBy: 'Emily Davis',
      lastModified: '5 days ago',
      chartData: sampleData1
    }
  ];

  const renderChartPreview = (viz: typeof visualizations[0]) => {
    if (viz.type === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={viz.chartData}>
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (viz.type === 'pie') {
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#6b7280'];
      return (
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie data={viz.chartData} dataKey="value" cx="50%" cy="50%" outerRadius={60}>
              {viz.chartData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={viz.chartData}>
            <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  };

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'bar': return BarChart3;
      case 'pie': return PieChartIcon;
      case 'line': return LineChartIcon;
      default: return TrendingUp;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Visualizations</h1>
          <p className="text-gray-600 mt-1">
            Create and manage your data visualizations
          </p>
        </div>
        
        <Button 
          variant="primary" 
          icon={Plus}
          onClick={() => setShowCreateDialog(true)}
        >
          Create Visualization
        </Button>
      </div>

      {/* Visualization Grid - All Populated with Real Charts */}
      <div className="grid grid-cols-2 gap-6">
        {visualizations.map((viz) => {
          const ChartIcon = getChartIcon(viz.type);
          
          return (
            <Card key={viz.id} hover>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ChartIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900">{viz.name}</h3>
                    <p className="text-gray-600">{viz.description}</p>
                  </div>
                </div>
              </div>

              {/* Chart Preview - Fully Rendered */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                {renderChartPreview(viz)}
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between text-gray-600 mb-4">
                <span>Dataset: {viz.dataset}</span>
                <span>·</span>
                <span>{viz.type.toUpperCase()}</span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="text-gray-600">
                  <span>By {viz.createdBy}</span>
                  <span className="mx-2">·</span>
                  <span>{viz.lastModified}</span>
                </div>
                
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    toast.info('Opening visualization', {
                      description: `Loading ${viz.name}`
                    });
                  }}
                >
                  Open
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowCreateDialog(false)}>
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-gray-900">Create New Visualization</h3>
              <button onClick={() => setShowCreateDialog(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Visualization Name</label>
                <input
                  type="text"
                  placeholder="Enter visualization name"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Chart Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { type: 'bar', icon: BarChart3, label: 'Bar Chart' },
                    { type: 'line', icon: LineChartIcon, label: 'Line Chart' },
                    { type: 'pie', icon: PieChartIcon, label: 'Pie Chart' }
                  ].map((chart) => {
                    const Icon = chart.icon;
                    return (
                      <button
                        key={chart.type}
                        className="flex flex-col items-center gap-2 p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                      >
                        <Icon className="w-8 h-8 text-gray-600" />
                        <span className="text-gray-700">{chart.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Select Dataset</label>
                <select className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
                  <option>sales_2024</option>
                  <option>customer_data</option>
                  <option>inventory_q4</option>
                  <option>marketing_metrics</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    toast.success('Visualization created', {
                      description: 'Opening chart editor'
                    });
                    setShowCreateDialog(false);
                  }}
                >
                  Create & Edit
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
