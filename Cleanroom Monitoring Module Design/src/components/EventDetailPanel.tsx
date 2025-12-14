import React, { useState } from 'react';
import { X, TrendingUp, FileText, User, Clock, AlertCircle, Brain } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';
import { toast } from 'sonner@2.0.3';

interface Event {
  id: string;
  room: string;
  parameter: string;
  severity: string;
  startTime: string;
  endTime: string | null;
  duration: string;
  batches: string[];
  status: string;
  capaIds: string[];
  value: string;
  limit: string;
}

interface EventDetailPanelProps {
  event: Event;
  onClose: () => void;
}

export default function EventDetailPanel({ event, onClose }: EventDetailPanelProps) {
  const [investigationNotes, setInvestigationNotes] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [showCAPAForm, setShowCAPAForm] = useState(false);

  // Mock time-series data around the event
  const eventData = [
    { time: '14:00', value: 2900, alert: 3000, action: 3500 },
    { time: '14:30', value: 3050, alert: 3000, action: 3500 },
    { time: '15:00', value: 3200, alert: 3000, action: 3500 },
    { time: '15:30', value: 3400, alert: 3000, action: 3500 },
    { time: '16:00', value: 3520, alert: 3000, action: 3500 },
    { time: '16:30', value: 3480, alert: 3000, action: 3500 },
    { time: '17:00', value: 3150, alert: 3000, action: 3500 },
    { time: '17:30', value: 2850, alert: 3000, action: 3500 },
  ];

  const aiSuggestions = [
    {
      id: 'suggestion-1',
      category: 'HVAC / Pressure',
      hypothesis: 'Differential pressure drop coincided with particle increase',
      evidence: 'Room 105 pressure dropped from 15 Pa to 10.8 Pa starting at 14:30',
      confidence: 'High'
    },
    {
      id: 'suggestion-2',
      category: 'Personnel Activity',
      hypothesis: 'Increased door openings during shift change',
      evidence: 'Access log shows 12 entries between 15:45-16:15 (normal: 3-4)',
      confidence: 'Medium'
    },
    {
      id: 'suggestion-3',
      category: 'Equipment',
      hypothesis: 'Filter differential pressure trending upward',
      evidence: 'HEPA filter F-201 ΔP increased from 180 Pa to 245 Pa over last 7 days',
      confidence: 'Medium'
    }
  ];

  const auditLog = [
    { timestamp: '2024-12-11 16:00:15', user: 'System', action: 'Event detected and logged' },
    { timestamp: '2024-12-11 16:02:30', user: 'J. Smith (QA Lead)', action: 'Event acknowledged' },
    { timestamp: '2024-12-11 16:05:00', user: 'J. Smith (QA Lead)', action: 'Investigation initiated' },
    { timestamp: '2024-12-11 16:10:45', user: 'M. Johnson (QA)', action: 'CAPA-2024-089 created and linked' }
  ];

  const selectSuggestion = (suggestionId: string) => {
    const suggestion = aiSuggestions.find(s => s.id === suggestionId);
    if (suggestion) {
      setSelectedSuggestion(suggestionId);
      setRootCause(suggestion.hypothesis);
      setInvestigationNotes(`Category: ${suggestion.category}\n\nEvidence: ${suggestion.evidence}\n\nConfidence: ${suggestion.confidence}`);
      toast.success('AI suggestion applied', {
        description: 'Root cause and investigation notes populated'
      });
    }
  };

  const createCAPA = () => {
    setShowCAPAForm(true);
  };

  const saveInvestigation = () => {
    toast.success('Investigation data saved', {
      description: `Event ${event.id} investigation notes and root cause recorded with e-signature`
    });
  };

  return (
    <div className="w-[600px] flex-shrink-0 bg-white rounded-lg border border-gray-200 max-h-[calc(100vh-200px)] overflow-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="text-gray-900">Event Details</h3>
          <p className="text-gray-600 mt-1">{event.id}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Event Info */}
        <div>
          <h4 className="text-gray-900 mb-3">Event Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Room/Zone</p>
              <p className="text-gray-900 mt-1">{event.room}</p>
            </div>
            <div>
              <p className="text-gray-600">Parameter</p>
              <p className="text-gray-900 mt-1">{event.parameter}</p>
            </div>
            <div>
              <p className="text-gray-600">Severity</p>
              <p className="text-red-600 mt-1">{event.severity.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-gray-600">Status</p>
              <p className="text-yellow-600 mt-1">{event.status}</p>
            </div>
            <div>
              <p className="text-gray-600">Value</p>
              <p className="text-red-600 mt-1">{event.value}</p>
            </div>
            <div>
              <p className="text-gray-600">Limit</p>
              <p className="text-gray-900 mt-1">{event.limit}</p>
            </div>
            <div>
              <p className="text-gray-600">Start Time</p>
              <p className="text-gray-900 mt-1">{event.startTime}</p>
            </div>
            <div>
              <p className="text-gray-600">Duration</p>
              <p className="text-gray-900 mt-1">{event.duration}</p>
            </div>
          </div>
        </div>

        {/* Time Series Chart */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h4 className="text-gray-900">Before, During, After Event</h4>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={eventData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" style={{ fontSize: '12px' }} />
                <YAxis style={{ fontSize: '12px' }} />
                <Tooltip />
                <ReferenceLine y={3000} stroke="#f59e0b" strokeDasharray="3 3" label="Alert" />
                <ReferenceLine y={3500} stroke="#ef4444" strokeDasharray="3 3" label="Action" />
                <ReferenceArea x1="15:30" x2="17:00" fill="#ef444420" label="Excursion Period" />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Impacted Batches */}
        {event.batches.length > 0 && (
          <div>
            <h4 className="text-gray-900 mb-3">Impacted Batches/Lots</h4>
            <div className="space-y-2">
              {event.batches.map(batch => (
                <div key={batch} className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-blue-900">Batch #{batch}</p>
                    <p className="text-blue-700">Manufacturing in progress during event</p>
                  </div>
                  <button className="text-blue-600 hover:underline">
                    View Batch
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI-Assisted Root Cause */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-purple-600" />
            <h4 className="text-gray-900">AI-Assisted Root Cause Suggestions</h4>
          </div>
          <div className="space-y-3">
            {aiSuggestions.map(suggestion => (
              <div
                key={suggestion.id}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedSuggestion === suggestion.id
                    ? 'bg-purple-50 border-purple-500'
                    : 'bg-gray-50 border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => selectSuggestion(suggestion.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-purple-900">{suggestion.category}</p>
                    <p className="text-gray-900 mt-1">{suggestion.hypothesis}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    suggestion.confidence === 'High' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {suggestion.confidence}
                  </span>
                </div>
                <p className="text-gray-700">
                  <strong>Evidence:</strong> {suggestion.evidence}
                </p>
                {selectedSuggestion === suggestion.id && (
                  <p className="text-purple-600 mt-2">✓ Applied to investigation</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Investigation */}
        <div>
          <h4 className="text-gray-900 mb-3">Investigation</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-700 mb-2">Root Cause Hypothesis</label>
              <textarea
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                placeholder="Enter identified root cause or select from AI suggestions above..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Investigation Notes</label>
              <textarea
                value={investigationNotes}
                onChange={(e) => setInvestigationNotes(e.target.value)}
                placeholder="Enter investigation details, contributing factors, and findings..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* CAPA */}
        <div>
          <h4 className="text-gray-900 mb-3">CAPA (Corrective & Preventive Actions)</h4>
          {event.capaIds.length > 0 ? (
            <div className="space-y-2">
              {event.capaIds.map(capaId => (
                <div key={capaId} className="p-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-purple-900">{capaId}</p>
                    <p className="text-purple-700">Status: In Progress</p>
                  </div>
                  <button 
                    onClick={() => toast.info('Opening CAPA details', { description: `Loading ${capaId}...` })}
                    className="text-purple-600 hover:underline"
                  >
                    View CAPA
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-gray-600">No CAPA linked to this event</p>
            </div>
          )}
          <button
            onClick={createCAPA}
            className="mt-3 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create New CAPA
          </button>
        </div>

        {/* Audit Trail */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-gray-600" />
            <h4 className="text-gray-900">Audit Trail</h4>
          </div>
          <div className="space-y-2">
            {auditLog.map((entry, idx) => (
              <div key={idx} className="flex gap-3 p-2 bg-gray-50 rounded">
                <User className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">{entry.user}</span>
                    <span className="text-gray-500">{entry.timestamp}</span>
                  </div>
                  <p className="text-gray-700 mt-1">{entry.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={saveInvestigation}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Investigation (E-Sign)
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* CAPA Creation Form */}
      {showCAPAForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowCAPAForm(false)}>
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-gray-900">Create New CAPA</h3>
              <button onClick={() => setShowCAPAForm(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">CAPA Title</label>
                <input
                  type="text"
                  defaultValue={`Investigation of ${event.parameter} excursion in ${event.room}`}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Linked Event</label>
                <input
                  type="text"
                  value={event.id}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Containment Actions</label>
                <textarea
                  placeholder="Immediate actions taken to contain the issue..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Corrective Actions</label>
                <textarea
                  placeholder="Actions to correct the specific issue..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Preventive Actions</label>
                <textarea
                  placeholder="Actions to prevent recurrence..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Responsible Person</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>J. Smith (QA Lead)</option>
                    <option>M. Johnson (QA Mgr)</option>
                    <option>K. Williams (QA)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Target Completion</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    toast.success('CAPA created', {
                      description: 'CAPA-2024-090 has been created and linked to this event'
                    });
                    setShowCAPAForm(false);
                  }}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Create CAPA (E-Sign)
                </button>
                <button
                  onClick={() => setShowCAPAForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}