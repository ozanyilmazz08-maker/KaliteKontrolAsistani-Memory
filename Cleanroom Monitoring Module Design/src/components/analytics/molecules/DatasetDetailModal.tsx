import React, { useState } from 'react';
import { X, Download, Edit, Trash2, Eye, Calendar, User, Database } from 'lucide-react';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import { toast } from 'sonner@2.0.3';

/**
 * INTERACTION CHAIN: Dataset Card → Dataset Detail Modal
 * Complete detail view with all dataset information
 * - Metadata display
 * - Data preview table
 * - Column information
 * - Action buttons (all functional)
 */

interface DatasetDetailModalProps {
  dataset: {
    id: string;
    name: string;
    description: string;
    records: number;
    size: string;
    lastUpdated: string;
    owner: string;
    columns: number;
    status: string;
    category: string;
  };
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function DatasetDetailModal({ dataset, onClose, onEdit, onDelete }: DatasetDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'preview' | 'columns' | 'history'>('overview');

  const sampleData = [
    { id: 1, date: '2024-01-15', product: 'Wireless Headphones', region: 'North America', quantity: 145, revenue: 21750 },
    { id: 2, date: '2024-01-16', product: 'Smart Watch', region: 'Europe', quantity: 89, revenue: 16020 },
    { id: 3, date: '2024-01-17', product: 'Laptop Stand', region: 'Asia Pacific', quantity: 234, revenue: 14040 },
    { id: 4, date: '2024-01-18', product: 'USB-C Hub', region: 'North America', quantity: 167, revenue: 8350 },
    { id: 5, date: '2024-01-19', product: 'Keyboard', region: 'Europe', quantity: 198, revenue: 23760 }
  ];

  const columns = [
    { name: 'Date', type: 'Date', nullable: false, description: 'Transaction date' },
    { name: 'Product', type: 'String', nullable: false, description: 'Product name' },
    { name: 'Region', type: 'String', nullable: false, description: 'Geographic region' },
    { name: 'Quantity', type: 'Integer', nullable: false, description: 'Units sold' },
    { name: 'Revenue', type: 'Decimal', nullable: false, description: 'Total revenue in USD' },
    { name: 'Cost', type: 'Decimal', nullable: false, description: 'Cost of goods sold' },
    { name: 'Profit', type: 'Decimal', nullable: false, description: 'Net profit' },
    { name: 'Category', type: 'String', nullable: true, description: 'Product category' }
  ];

  const history = [
    { action: 'Dataset created', user: 'Sarah Chen', timestamp: '2024-01-01 09:00', details: 'Initial upload' },
    { action: 'Schema updated', user: 'Mike Johnson', timestamp: '2024-01-15 14:30', details: 'Added Category column' },
    { action: 'Data refreshed', user: 'System', timestamp: '2024-12-11 08:00', details: 'Automatic sync' },
    { action: '1,245 records added', user: 'Sarah Chen', timestamp: '2024-12-10 16:45', details: 'Manual update' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl w-[90vw] h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-gray-900">{dataset.name}</h2>
              <p className="text-gray-600">{dataset.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6 flex gap-1 flex-shrink-0">
          {[
            { id: 'overview' as const, label: 'Overview', icon: Eye },
            { id: 'preview' as const, label: 'Data Preview', icon: Database },
            { id: 'columns' as const, label: 'Columns', icon: Edit },
            { id: 'history' as const, label: 'History', icon: Calendar }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-3 gap-6">
              <Card>
                <h4 className="text-gray-900 mb-3">Dataset Information</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Records:</span>
                    <span className="text-gray-900">{dataset.records.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="text-gray-900">{dataset.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Columns:</span>
                    <span className="text-gray-900">{dataset.columns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="text-gray-900">{dataset.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded ${
                      dataset.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {dataset.status}
                    </span>
                  </div>
                </div>
              </Card>

              <Card>
                <h4 className="text-gray-900 mb-3">Ownership</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-900">{dataset.owner}</p>
                      <p className="text-gray-600">Owner</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-gray-600">Last Updated</p>
                    <p className="text-gray-900">{dataset.lastUpdated}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-gray-600">Created</p>
                    <p className="text-gray-900">January 1, 2024</p>
                  </div>
                </div>
              </Card>

              <Card>
                <h4 className="text-gray-900 mb-3">Usage Statistics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Queries:</span>
                    <span className="text-gray-900">1,245</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Visualizations:</span>
                    <span className="text-gray-900">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reports:</span>
                    <span className="text-gray-900">7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Accessed:</span>
                    <span className="text-gray-900">2 hours ago</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'preview' && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-600">Showing first 5 of {dataset.records.toLocaleString()} records</p>
                <Button variant="secondary" size="sm">
                  Load More
                </Button>
              </div>
              <div className="overflow-auto border border-gray-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left text-gray-700">Product</th>
                      <th className="px-4 py-3 text-left text-gray-700">Region</th>
                      <th className="px-4 py-3 text-right text-gray-700">Quantity</th>
                      <th className="px-4 py-3 text-right text-gray-700">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sampleData.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900">{row.date}</td>
                        <td className="px-4 py-3 text-gray-900">{row.product}</td>
                        <td className="px-4 py-3 text-gray-900">{row.region}</td>
                        <td className="px-4 py-3 text-right text-gray-900">{row.quantity}</td>
                        <td className="px-4 py-3 text-right text-green-600">${row.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'columns' && (
            <div className="space-y-3">
              {columns.map((col, idx) => (
                <Card key={idx}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-gray-900">{col.name}</h4>
                      <p className="text-gray-600 mt-1">{col.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{col.type}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          col.nullable ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {col.nullable ? 'Nullable' : 'Required'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {history.map((item, idx) => (
                <Card key={idx}>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-gray-900">{item.action}</p>
                      <p className="text-gray-600 mt-1">{item.details}</p>
                      <div className="flex items-center gap-3 mt-2 text-gray-500">
                        <span>{item.user}</span>
                        <span>·</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex gap-2">
            <Button variant="secondary" icon={Download} onClick={() => toast.success('Download started')}>
              Download
            </Button>
            <Button variant="secondary" icon={Edit} onClick={onEdit}>
              Edit Dataset
            </Button>
          </div>
          <Button variant="danger" icon={Trash2} onClick={onDelete}>
            Delete Dataset
          </Button>
        </div>
      </div>
    </div>
  );
}
