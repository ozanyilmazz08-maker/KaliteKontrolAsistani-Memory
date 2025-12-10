import { TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const kpis = [
  {
    label: 'Open FAI Orders',
    value: '24',
    trend: { value: '+3', direction: 'up' as const },
    color: 'blue'
  },
  {
    label: 'Overdue FAIs',
    value: '5',
    trend: { value: '+2', direction: 'up' as const },
    color: 'red'
  },
  {
    label: 'Avg FAI Cycle Time',
    value: '12.4',
    unit: 'days',
    trend: { value: '-1.2', direction: 'down' as const },
    color: 'green'
  },
  {
    label: 'First-Pass Approval Rate',
    value: '87.5',
    unit: '%',
    trend: { value: '+2.3', direction: 'up' as const },
    color: 'green'
  },
  {
    label: 'Rejection / Re-submission Rate',
    value: '12.5',
    unit: '%',
    trend: { value: '-2.3', direction: 'down' as const },
    color: 'green'
  }
];

export function KPICards() {
  const handleKPIClick = (label: string) => {
    console.log('KPI clicked:', label);
    if (label === 'Open FAI Orders') {
      toast.info('Açık FAI siparişleri görüntüleniyor...');
    } else if (label === 'Overdue FAIs') {
      toast.info('Gecikmiş FAI siparişleri görüntüleniyor...');
    } else {
      toast.info(`${label} için detaylı analiz açılıyor...`);
    }
  };

  return (
    <div className="grid grid-cols-5 gap-4">
      {kpis.map((kpi, index) => (
        <div 
          key={index} 
          onClick={() => handleKPIClick(kpi.label)}
          className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">{kpi.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl text-gray-900">{kpi.value}</span>
                {kpi.unit && <span className="text-sm text-gray-500">{kpi.unit}</span>}
              </div>
            </div>
          </div>
          
          <div className="mt-3 flex items-center gap-1">
            {kpi.trend.direction === 'up' ? (
              <TrendingUp className={`w-4 h-4 ${kpi.color === 'red' ? 'text-red-600' : 'text-green-600'}`} />
            ) : (
              <TrendingDown className={`w-4 h-4 ${kpi.color === 'green' ? 'text-green-600' : 'text-red-600'}`} />
            )}
            <span className={`text-sm ${kpi.color === 'red' || (kpi.trend.direction === 'up' && kpi.color !== 'green') ? 'text-red-600' : 'text-green-600'}`}>
              {kpi.trend.value}
            </span>
            <span className="text-sm text-gray-500">vs last period</span>
          </div>
        </div>
      ))}
    </div>
  );
}