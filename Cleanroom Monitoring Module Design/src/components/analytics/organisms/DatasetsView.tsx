import React, { useState } from 'react';
import { Database, Upload, Download, Trash2, Edit, MoreVertical } from 'lucide-react';
import { AnalyticsContext } from '../../../analytics-app';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import { toast } from 'sonner@2.0.3';

/**
 * ORGANISM: Datasets View
 * Complete dataset management interface
 * - Grid of dataset cards (fully populated)
 * - Each card has actions (upload, download, delete)
 * - Stats and metadata displayed
 * NO EMPTY CARDS - all contain real data
 */

interface DatasetsViewProps {
  context: AnalyticsContext;
  updateContext: (updates: Partial<AnalyticsContext>) => void;
}

export default function DatasetsView({ context, updateContext }: DatasetsViewProps) {
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const datasets = [
    {
      id: 'sales_2024',
      name: 'Sales Data 2024',
      description: 'Complete sales transactions for current year',
      records: 48293,
      size: '12.4 MB',
      lastUpdated: '2 hours ago',
      owner: 'Sarah Chen',
      columns: 12,
      status: 'Active',
      category: 'Sales'
    },
    {
      id: 'customer_data',
      name: 'Customer Database',
      description: 'Customer information and demographics',
      records: 156789,
      size: '45.2 MB',
      lastUpdated: '1 day ago',
      owner: 'Mike Johnson',
      columns: 18,
      status: 'Active',
      category: 'Marketing'
    },
    {
      id: 'inventory_q4',
      name: 'Inventory Q4 2024',
      description: 'Product inventory levels and movements',
      records: 8472,
      size: '3.8 MB',
      lastUpdated: '5 hours ago',
      owner: 'Emily Davis',
      columns: 8,
      status: 'Active',
      category: 'Operations'
    },
    {
      id: 'marketing_metrics',
      name: 'Marketing Metrics',
      description: 'Campaign performance and ROI tracking',
      records: 23451,
      size: '8.9 MB',
      lastUpdated: '3 days ago',
      owner: 'Sarah Chen',
      columns: 15,
      status: 'Active',
      category: 'Marketing'
    },
    {
      id: 'financial_2024',
      name: 'Financial Records 2024',
      description: 'Revenue, expenses, and profit analysis',
      records: 12983,
      size: '6.2 MB',
      lastUpdated: '1 week ago',
      owner: 'James Wilson',
      columns: 10,
      status: 'Archived',
      category: 'Finance'
    },
    {
      id: 'employee_data',
      name: 'Employee Performance',
      description: 'HR metrics and performance reviews',
      records: 547,
      size: '892 KB',
      lastUpdated: '2 days ago',
      owner: 'Mike Johnson',
      columns: 14,
      status: 'Active',
      category: 'Operations'
    }
  ];

  const handleDownload = (datasetId: string) => {
    toast.success('Download started', {
      description: `Preparing ${datasetId} for download`
    });
  };

  const handleDelete = (datasetId: string, datasetName: string) => {
    if (confirm(`Are you sure you want to delete "${datasetName}"? This action cannot be undone.`)) {
      toast.success('Dataset deleted', {
        description: `${datasetName} has been removed`
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Datasets</h1>
          <p className="text-gray-600 mt-1">
            Manage and analyze your data sources
          </p>
        </div>
        
        <Button 
          variant="primary" 
          icon={Upload}
          onClick={() => setShowUploadDialog(true)}
        >
          Upload Dataset
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4">
        <Card padding="sm">
          <p className="text-gray-600">Total Datasets</p>
          <p className="text-gray-900 mt-1">{datasets.length}</p>
        </Card>
        <Card padding="sm">
          <p className="text-gray-600">Total Records</p>
          <p className="text-gray-900 mt-1">
            {datasets.reduce((sum, d) => sum + d.records, 0).toLocaleString()}
          </p>
        </Card>
        <Card padding="sm">
          <p className="text-gray-600">Storage Used</p>
          <p className="text-gray-900 mt-1">77.3 MB</p>
        </Card>
        <Card padding="sm">
          <p className="text-gray-600">Active Datasets</p>
          <p className="text-gray-900 mt-1">
            {datasets.filter(d => d.status === 'Active').length}
          </p>
        </Card>
      </div>

      {/* Dataset Grid - All Cards Populated */}
      <div className="grid grid-cols-2 gap-6">
        {datasets.map((dataset) => (
          <Card 
            key={dataset.id}
            hover
            onClick={() => setSelectedDataset(dataset)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-gray-900">{dataset.name}</h3>
                  <p className="text-gray-600 mt-1">{dataset.description}</p>
                </div>
              </div>
              
              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="px-3 py-2 bg-gray-50 rounded border border-gray-200">
                <p className="text-gray-600">Records</p>
                <p className="text-gray-900">{dataset.records.toLocaleString()}</p>
              </div>
              <div className="px-3 py-2 bg-gray-50 rounded border border-gray-200">
                <p className="text-gray-600">Size</p>
                <p className="text-gray-900">{dataset.size}</p>
              </div>
              <div className="px-3 py-2 bg-gray-50 rounded border border-gray-200">
                <p className="text-gray-600">Columns</p>
                <p className="text-gray-900">{dataset.columns}</p>
              </div>
              <div className="px-3 py-2 bg-gray-50 rounded border border-gray-200">
                <p className="text-gray-600">Category</p>
                <p className="text-gray-900">{dataset.category}</p>
              </div>
            </div>

            {/* Footer Info */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center gap-4 text-gray-600">
                <span>By {dataset.owner}</span>
                <span>·</span>
                <span>{dataset.lastUpdated}</span>
              </div>
              
              <span className={`px-2 py-1 rounded text-xs ${
                dataset.status === 'Active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {dataset.status}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <Button 
                variant="secondary" 
                size="sm" 
                icon={Edit}
                onClick={(e) => {
                  e.stopPropagation();
                  toast.info('Opening editor', { description: `Editing ${dataset.name}` });
                }}
              >
                Edit
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                icon={Download}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(dataset.id);
                }}
              >
                Download
              </Button>
              <Button 
                variant="danger" 
                size="sm" 
                icon={Trash2}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(dataset.id, dataset.name);
                }}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Upload Dialog */}
      {showUploadDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowUploadDialog(false)}>
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-gray-900">Upload New Dataset</h3>
              <button onClick={() => setShowUploadDialog(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Dataset Name</label>
                <input
                  type="text"
                  placeholder="Enter dataset name"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Describe your dataset"
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Category</label>
                <select className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
                  <option>Sales</option>
                  <option>Marketing</option>
                  <option>Operations</option>
                  <option>Finance</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Upload File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-900 mb-1">Click to upload or drag and drop</p>
                  <p className="text-gray-600">CSV, Excel, JSON (max 50MB)</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    toast.success('Dataset uploaded', {
                      description: 'Your dataset is being processed'
                    });
                    setShowUploadDialog(false);
                  }}
                >
                  Upload Dataset
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setShowUploadDialog(false)}
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