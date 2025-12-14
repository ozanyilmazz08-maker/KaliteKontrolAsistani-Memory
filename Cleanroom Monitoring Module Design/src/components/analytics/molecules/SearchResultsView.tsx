import React from 'react';
import { Database, PieChart, FileText, X } from 'lucide-react';
import Card from '../atoms/Card';

/**
 * INTERACTION CHAIN: Search Input → Search Results View
 * Complete search results display with categorized results
 */

interface SearchResultsViewProps {
  searchQuery: string;
  onClose: () => void;
  onSelectResult: (type: string, id: string) => void;
}

export default function SearchResultsView({ searchQuery, onClose, onSelectResult }: SearchResultsViewProps) {
  const results = {
    datasets: [
      { id: 'sales_2024', name: 'Sales Data 2024', description: 'Complete sales transactions', records: 48293 },
      { id: 'customer_data', name: 'Customer Database', description: 'Customer information', records: 156789 }
    ],
    visualizations: [
      { id: 'viz-1', name: 'Quarterly Revenue Trend', type: 'Bar Chart', dataset: 'sales_2024' },
      { id: 'viz-2', name: 'Product Distribution', type: 'Pie Chart', dataset: 'sales_2024' }
    ],
    reports: [
      { id: 'rpt-1', name: 'Q4 2024 Sales Report', created: '2 days ago', pages: 12 },
      { id: 'rpt-2', name: 'Annual Performance Review', created: '1 week ago', pages: 24 }
    ]
  };

  const totalResults = results.datasets.length + results.visualizations.length + results.reports.length;

  if (!searchQuery) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-xl z-50 max-h-[600px] overflow-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="text-gray-900">Search Results</h3>
          <p className="text-gray-600 mt-1">
            Found {totalResults} results for "{searchQuery}"
          </p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Datasets */}
        {results.datasets.length > 0 && (
          <div>
            <h4 className="text-gray-900 mb-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              Datasets ({results.datasets.length})
            </h4>
            <div className="space-y-2">
              {results.datasets.map((dataset) => (
                <Card 
                  key={dataset.id} 
                  padding="sm" 
                  hover
                  onClick={() => onSelectResult('dataset', dataset.id)}
                >
                  <p className="text-gray-900">{dataset.name}</p>
                  <p className="text-gray-600 mt-1">{dataset.description}</p>
                  <p className="text-gray-500 mt-1">{dataset.records.toLocaleString()} records</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Visualizations */}
        {results.visualizations.length > 0 && (
          <div>
            <h4 className="text-gray-900 mb-3 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-600" />
              Visualizations ({results.visualizations.length})
            </h4>
            <div className="space-y-2">
              {results.visualizations.map((viz) => (
                <Card 
                  key={viz.id} 
                  padding="sm" 
                  hover
                  onClick={() => onSelectResult('visualization', viz.id)}
                >
                  <p className="text-gray-900">{viz.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-gray-600">
                    <span>{viz.type}</span>
                    <span>·</span>
                    <span>Dataset: {viz.dataset}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Reports */}
        {results.reports.length > 0 && (
          <div>
            <h4 className="text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-600" />
              Reports ({results.reports.length})
            </h4>
            <div className="space-y-2">
              {results.reports.map((report) => (
                <Card 
                  key={report.id} 
                  padding="sm" 
                  hover
                  onClick={() => onSelectResult('report', report.id)}
                >
                  <p className="text-gray-900">{report.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-gray-600">
                    <span>{report.pages} pages</span>
                    <span>·</span>
                    <span>Created {report.created}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
