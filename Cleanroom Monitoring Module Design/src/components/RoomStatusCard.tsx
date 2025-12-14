import React from 'react';
import { Droplets, Wind, Thermometer, Gauge, Activity, Filter } from 'lucide-react';

interface RoomStatusCardProps {
  room: {
    id: string;
    name: string;
    grade: string;
    isoClass: string;
    status: 'ok' | 'warning' | 'excursion';
    parameters: {
      particle: 'ok' | 'warning' | 'excursion';
      micro: 'ok' | 'warning' | 'excursion';
      temp: 'ok' | 'warning' | 'excursion';
      humidity: 'ok' | 'warning' | 'excursion';
      pressure: 'ok' | 'warning' | 'excursion';
      airflow: 'ok' | 'warning' | 'excursion';
    };
    lastSampling: string;
  };
  onClick: () => void;
}

export default function RoomStatusCard({ room, onClick }: RoomStatusCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'excursion':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'ok':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'excursion':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getParameterIcon = (param: string, status: string) => {
    const iconClass = `w-5 h-5 ${status === 'ok' ? 'text-green-600' : status === 'warning' ? 'text-yellow-600' : 'text-red-600'}`;
    
    switch (param) {
      case 'particle':
        return <Activity className={iconClass} />;
      case 'micro':
        return <Droplets className={iconClass} />;
      case 'temp':
        return <Thermometer className={iconClass} />;
      case 'humidity':
        return <Droplets className={iconClass} />;
      case 'pressure':
        return <Gauge className={iconClass} />;
      case 'airflow':
        return <Wind className={iconClass} />;
      default:
        return <Filter className={iconClass} />;
    }
  };

  return (
    <div 
      className={`border-2 ${room.status === 'ok' ? 'border-green-200' : room.status === 'warning' ? 'border-yellow-200' : 'border-red-200'} rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-3 h-3 rounded-full ${getStatusDot(room.status)}`} />
            <h4 className="text-gray-900">{room.name}</h4>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <span>{room.grade}</span>
            <span>·</span>
            <span>{room.isoClass}</span>
            <span>·</span>
            <span className="text-gray-500">ID: {room.id}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full border ${getStatusColor(room.status)}`}>
          {room.status === 'ok' ? 'In Spec' : room.status === 'warning' ? 'Warning' : 'Excursion'}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-2">
        <div className="flex items-center gap-1" title="Particle">
          {getParameterIcon('particle', room.parameters.particle)}
        </div>
        <div className="flex items-center gap-1" title="Microbial">
          {getParameterIcon('micro', room.parameters.micro)}
        </div>
        <div className="flex items-center gap-1" title="Temperature">
          {getParameterIcon('temp', room.parameters.temp)}
        </div>
        <div className="flex items-center gap-1" title="Humidity">
          {getParameterIcon('humidity', room.parameters.humidity)}
        </div>
        <div className="flex items-center gap-1" title="Differential Pressure">
          {getParameterIcon('pressure', room.parameters.pressure)}
        </div>
        <div className="flex items-center gap-1" title="Airflow">
          {getParameterIcon('airflow', room.parameters.airflow)}
        </div>
      </div>

      <p className="text-gray-500">Last sampling: {room.lastSampling}</p>
    </div>
  );
}