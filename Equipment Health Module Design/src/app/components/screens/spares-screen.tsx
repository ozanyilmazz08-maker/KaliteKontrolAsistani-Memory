import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { mockSpareParts } from '../../data/mockData';
import { AlertTriangle, Package, TrendingDown, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function SparesScreen() {
  const lowStockParts = mockSpareParts.filter((part) => part.quantity < part.minStock);
  const totalValue = mockSpareParts.reduce((sum, part) => sum + part.quantity * part.unitCost, 0);

  const handleReserve = (partId: string) => {
    const part = mockSpareParts.find((p) => p.id === partId);
    toast.success('Parts reserved', {
      description: `${part?.name} has been reserved for the work order.`
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-1">Spares & Inventory</h1>
        <p className="text-gray-600">Manage spare parts and ensure maintenance readiness</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-sm text-gray-600">Total Parts</div>
              <div className="text-2xl font-semibold text-gray-900">{mockSpareParts.length}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <div className="text-sm text-gray-600">Low Stock</div>
              <div className="text-2xl font-semibold text-red-600">{lowStockParts.length}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingDown className="w-8 h-8 text-purple-600" />
            <div>
              <div className="text-sm text-gray-600">Total Value</div>
              <div className="text-2xl font-semibold text-gray-900">
                ${totalValue.toLocaleString()}
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-sm text-gray-600">In Stock</div>
              <div className="text-2xl font-semibold text-green-600">
                {mockSpareParts.filter((p) => p.quantity >= p.minStock).length}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockParts.length > 0 && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900 mb-1">Low Stock Alert</h3>
              <p className="text-sm text-red-700">
                {lowStockParts.length} part(s) below minimum stock level. Consider reordering.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Spares Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Lead Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSpareParts.map((part) => {
                const isLowStock = part.quantity < part.minStock;
                return (
                  <TableRow key={part.id}>
                    <TableCell className="font-medium">{part.partNumber}</TableCell>
                    <TableCell className="text-gray-900">{part.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{part.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={isLowStock ? 'text-red-600 font-medium' : ''}>
                        {part.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600">{part.minStock}</TableCell>
                    <TableCell className="text-sm text-gray-600">{part.location}</TableCell>
                    <TableCell className="text-gray-900">${part.unitCost.toFixed(2)}</TableCell>
                    <TableCell className="text-gray-600">{part.leadTime} days</TableCell>
                    <TableCell>
                      {isLowStock ? (
                        <Badge variant="destructive">Low Stock</Badge>
                      ) : (
                        <Badge variant="secondary">In Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReserve(part.id)}
                      >
                        Reserve
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
