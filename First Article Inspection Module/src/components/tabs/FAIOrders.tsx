import { useState } from 'react';
import { GlobalContext } from '../../App';
import { FAIOrdersTable } from '../fai-orders/FAIOrdersTable';
import { FAIOrderDetail } from '../fai-orders/FAIOrderDetail';
import { FAIOrdersFilters } from '../fai-orders/FAIOrdersFilters';
import { Search, Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface FAIOrdersProps {
  globalContext: GlobalContext;
}

export function FAIOrders({ globalContext }: FAIOrdersProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('FAI-2024-001');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateNewFAI = () => {
    console.log('Creating new FAI order');
    toast.info('Yeni FAI Sipariş Oluşturma formu açılıyor...');
  };

  return (
    <div className="flex h-[calc(100vh-120px)]">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by FAI ID, Part Number, Drawing Number, Supplier..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={handleCreateNewFAI}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New FAI Order
            </button>
          </div>

          {/* Filters Row */}
          <div className="mt-3">
            <FAIOrdersFilters />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto p-6">
          <FAIOrdersTable 
            selectedOrderId={selectedOrderId}
            onSelectOrder={setSelectedOrderId}
          />
        </div>
      </div>

      {/* Right: Detail Panel */}
      {selectedOrderId && (
        <div className="w-96 border-l border-gray-200 bg-white overflow-y-auto">
          <FAIOrderDetail orderId={selectedOrderId} />
        </div>
      )}
    </div>
  );
}