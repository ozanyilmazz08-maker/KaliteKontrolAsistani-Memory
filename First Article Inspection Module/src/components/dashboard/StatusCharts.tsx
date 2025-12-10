import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { toast } from 'sonner@2.0.3';

const statusData = [
  { name: 'Draft', count: 3, color: '#94a3b8' },
  { name: 'In Measurement', count: 8, color: '#3b82f6' },
  { name: 'Awaiting Customer', count: 7, color: '#f59e0b' },
  { name: 'Approved', count: 42, color: '#10b981' },
  { name: 'Rejected', count: 2, color: '#ef4444' },
  { name: 'On Hold', count: 1, color: '#6b7280' }
];

const supplierData = [
  { name: 'Supplier A', count: 15 },
  { name: 'Supplier B', count: 12 },
  { name: 'Supplier C', count: 8 },
  { name: 'Supplier D', count: 6 },
  { name: 'Supplier E', count: 4 }
];

const rejectionData = [
  { name: 'Dimensional out of tolerance', count: 12 },
  { name: 'Surface finish issues', count: 8 },
  { name: 'Missing documentation', count: 5 },
  { name: 'Material test failure', count: 3 },
  { name: 'Visual defects', count: 2 }
];

export function StatusCharts() {
  const handleStatusClick = (data: any) => {
    console.log('Status clicked:', data);
    if (data && data.name) {
      toast.info(`${data.name} durumuna göre filtreleme yapılıyor...`);
    }
  };

  const handleSupplierClick = (data: any) => {
    console.log('Supplier clicked:', data);
    if (data && data.activeLabel) {
      toast.info(`${data.activeLabel} tedarikçisine göre filtreleme yapılıyor...`);
    }
  };

  const handleRejectionClick = (data: any) => {
    console.log('Rejection reason clicked:', data);
    if (data && data.activeLabel) {
      toast.info(`${data.activeLabel} için detaylı analiz gösteriliyor...`);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Status Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">FAI Status Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              onClick={handleStatusClick}
              style={{ cursor: 'pointer' }}
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* FAI by Supplier */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">FAI by Supplier</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={supplierData} onClick={handleSupplierClick}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" style={{ cursor: 'pointer' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Rejection Reasons (Pareto) */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 col-span-2">
        <h3 className="text-gray-900 mb-4">Top Rejection Reasons (Pareto)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={rejectionData} onClick={handleRejectionClick}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-15} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#ef4444" style={{ cursor: 'pointer' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}