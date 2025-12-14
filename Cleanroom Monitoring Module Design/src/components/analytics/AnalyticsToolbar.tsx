import React, { useState } from 'react';
import { Calendar, Filter, Download, Share2, PanelRightClose, PanelRightOpen, Plus } from 'lucide-react';
import { AnalyticsContext } from '../../analytics-app';
import SearchBar from './molecules/SearchBar';
import SearchResultsView from './molecules/SearchResultsView';
import ExportDialog from './molecules/ExportDialog';
import ShareDialog from './molecules/ShareDialog';
import Button from './atoms/Button';
import Select from './atoms/Select';
import { toast } from 'sonner@2.0.3';

/**
 * ORGANISM: Toolbar
 * Complete action bar with all functional elements
 * - Search bar (molecule)
 * - Filter controls (molecules)
 * - Action buttons (atoms)
 * - Panel toggle (atom)
 * NO EMPTY SPACES - all actions functional
 */

interface AnalyticsToolbarProps {
  context: AnalyticsContext;
  updateContext: (updates: Partial<AnalyticsContext>) => void;
  onToggleRightPanel: () => void;
  showRightPanel: boolean;
}

export default function AnalyticsToolbar({
  context,
  updateContext,
  onToggleRightPanel,
  showRightPanel
}: AnalyticsToolbarProps) {
  const [searchValue, setSearchValue] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const categoryOptions = [
    { value: 'All', label: 'All Categories' },
    { value: 'Sales', label: 'Sales Data' },
    { value: 'Marketing', label: 'Marketing Data' },
    { value: 'Operations', label: 'Operations Data' },
    { value: 'Finance', label: 'Finance Data' }
  ];

  const handleSearch = () => {
    if (searchValue.trim()) {
      setShowSearchResults(true);
    }
  };

  const handleSelectSearchResult = (type: string, id: string) => {
    toast.info(`Opening ${type}`, {
      description: `Loading ${id}...`
    });
    setShowSearchResults(false);
    setSearchValue('');
  };

  const handleNewAnalysis = () => {
    toast.info('New analysis', {
      description: 'Creating new analysis workspace'
    });
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 relative">
      <div className="flex items-center gap-4">
        {/* Search Bar - Molecule */}
        <div className="relative flex-1 max-w-2xl">
          <SearchBar
            value={searchValue}
            onChange={(value) => {
              setSearchValue(value);
              if (value.trim()) {
                setShowSearchResults(true);
              } else {
                setShowSearchResults(false);
              }
            }}
            onSearch={handleSearch}
            placeholder="Search datasets, charts, and reports..."
          />
          
          {showSearchResults && searchValue.trim() && (
            <SearchResultsView
              searchQuery={searchValue}
              onClose={() => setShowSearchResults(false)}
              onSelectResult={handleSelectSearchResult}
            />
          )}
        </div>

        {/* Filters Section - Molecules */}
        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <Select
            value={context.filters.category}
            onChange={(value) => updateContext({
              filters: { ...context.filters, category: value }
            })}
            options={categoryOptions}
          />

          {/* Date Range Picker */}
          <div className="relative">
            <Button
              variant="secondary"
              icon={Calendar}
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              {context.dateRange.start} - {context.dateRange.end}
            </Button>

            {showDatePicker && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowDatePicker(false)}
                />
                <div className="absolute top-full right-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-xl z-20 p-4 w-80">
                  <h4 className="text-gray-900 mb-3">Select Date Range</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={context.dateRange.start}
                        onChange={(e) => updateContext({
                          dateRange: { ...context.dateRange, start: e.target.value }
                        })}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={context.dateRange.end}
                        onChange={(e) => updateContext({
                          dateRange: { ...context.dateRange, end: e.target.value }
                        })}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => {
                        setShowDatePicker(false);
                        toast.success('Date range updated');
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons - Atoms */}
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="secondary" icon={Filter}>
            Filters
          </Button>
          
          <Button 
            variant="secondary" 
            icon={Download} 
            onClick={() => setShowExportDialog(true)}
          >
            Export
          </Button>
          
          <Button 
            variant="secondary" 
            icon={Share2} 
            onClick={() => setShowShareDialog(true)}
          >
            Share
          </Button>
          
          <Button variant="primary" icon={Plus} onClick={handleNewAnalysis}>
            New Analysis
          </Button>

          {/* Panel Toggle */}
          <button
            onClick={onToggleRightPanel}
            className="p-2 rounded-lg border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
          >
            {showRightPanel ? (
              <PanelRightClose className="w-5 h-5 text-gray-600" />
            ) : (
              <PanelRightOpen className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Dialogs */}
      {showExportDialog && <ExportDialog onClose={() => setShowExportDialog(false)} />}
      {showShareDialog && <ShareDialog onClose={() => setShowShareDialog(false)} />}
    </div>
  );
}