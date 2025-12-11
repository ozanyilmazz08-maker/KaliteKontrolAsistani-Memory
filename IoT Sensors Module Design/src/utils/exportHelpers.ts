// Export helper functions for downloading data as CSV/JSON

export function downloadCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in values
        const stringValue = String(value ?? '');
        return stringValue.includes(',') || stringValue.includes('"') 
          ? `"${stringValue.replace(/"/g, '""')}"` 
          : stringValue;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadJSON(data: any, filename: string) {
  const jsonContent = JSON.stringify(data, null, 2);
  
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportHealthReport(stats: {
  totalSensors: number;
  onlineSensors: number;
  offlineSensors: number;
  warningSensors: number;
  avgDataQuality: number;
  activeAlerts: number;
}) {
  const reportData = [
    { Metric: 'Total Sensors', Value: stats.totalSensors },
    { Metric: 'Online Sensors', Value: stats.onlineSensors },
    { Metric: 'Offline Sensors', Value: stats.offlineSensors },
    { Metric: 'Warning Sensors', Value: stats.warningSensors },
    { Metric: 'Avg Data Quality', Value: `${stats.avgDataQuality}%` },
    { Metric: 'Active Alerts', Value: stats.activeAlerts },
    { Metric: 'Report Generated', Value: new Date().toLocaleString() },
  ];
  
  downloadCSV(reportData, 'iot_health_report');
}
