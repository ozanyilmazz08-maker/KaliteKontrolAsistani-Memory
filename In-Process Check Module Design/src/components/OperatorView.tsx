import { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, Phone, FileText, BookOpen, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import Dialog from './Dialog';

interface OperatorViewProps {
  context: any;
}

const controlItems = [
  {
    id: 1,
    name: 'Hole Diameter',
    type: 'numeric',
    unit: 'mm',
    lsl: 9.95,
    usl: 10.05,
    target: 10.0,
    lcl: 9.96,
    ucl: 10.04,
    cl: 10.0,
    samplingRule: 'Every 30 minutes',
    status: 'due',
    lastCheck: '28 min ago'
  },
  {
    id: 2,
    name: 'Torque',
    type: 'numeric',
    unit: 'Nm',
    lsl: 45,
    usl: 55,
    target: 50,
    lcl: 46,
    ucl: 54,
    cl: 50,
    samplingRule: 'Every hour',
    status: 'ok',
    lastCheck: '15 min ago'
  },
  {
    id: 3,
    name: 'Visual: Surface Scratch',
    type: 'attribute',
    samplingRule: 'Per part',
    status: 'ok',
    lastCheck: '2 min ago'
  },
  {
    id: 4,
    name: 'Depth Measurement',
    type: 'numeric',
    unit: 'mm',
    lsl: 24.8,
    usl: 25.2,
    target: 25.0,
    lcl: 24.85,
    ucl: 25.15,
    cl: 25.0,
    samplingRule: 'Every 50 parts',
    status: 'overdue',
    lastCheck: '3 hours ago'
  }
];

export default function OperatorView({ context }: OperatorViewProps) {
  const [selectedItem, setSelectedItem] = useState(controlItems[0]);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<'ok' | 'warning' | 'ooc' | 'oos' | null>(null);
  const [timeToNext, setTimeToNext] = useState(120); // seconds
  const [showInstructions, setShowInstructions] = useState(false);
  const [attributeResult, setAttributeResult] = useState<'pass' | 'fail' | null>(null);
  const [comment, setComment] = useState('');
  const [showNCDialog, setShowNCDialog] = useState(false);
  const [showSupervisorDialog, setShowSupervisorDialog] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeToNext(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    if (selectedItem.type === 'numeric' && inputValue) {
      const value = parseFloat(inputValue);
      
      // Check OOS (out of specification)
      if (value < selectedItem.lsl! || value > selectedItem.usl!) {
        setResult('oos');
      }
      // Check OOC (out of control)
      else if (value < selectedItem.lcl! || value > selectedItem.ucl!) {
        setResult('ooc');
      }
      // Check warning (near limits)
      else if (
        value < selectedItem.lcl! + (selectedItem.cl! - selectedItem.lcl!) * 0.3 ||
        value > selectedItem.ucl! - (selectedItem.ucl! - selectedItem.cl!) * 0.3
      ) {
        setResult('warning');
      }
      // OK
      else {
        setResult('ok');
      }
    }
  };

  const handlePassFail = (isPassing: boolean) => {
    setAttributeResult(isPassing ? 'pass' : 'fail');
    if (isPassing) {
      setComment('');
    }
  };

  const handleAcknowledge = () => {
    setInputValue('');
    setResult(null);
    setAttributeResult(null);
    setComment('');
    setTimeToNext(1800); // Reset to 30 minutes
    toast.success('Measurement recorded successfully!');
  };

  const handleCreateNC = () => {
    toast.info('Opening Nonconformance form...', {
      description: 'NC form will be created for this OOS event'
    });
    // In a real app, this would open a modal or navigate to NC creation
    setShowNCDialog(true);
  };

  const handleCallSupervisor = () => {
    toast.warning('Supervisor notification sent', {
      description: 'Line supervisor has been alerted to the OOC condition'
    });
    // In a real app, this would trigger a notification or call
    setShowSupervisorDialog(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'text-green-600 bg-green-50 border-green-200';
      case 'due': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-6">
      {/* Context & Next Check Panel */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 mb-2">{context.operation} - {context.product}</h2>
            <p className="text-gray-600">Order #ORD-2024-1523 · Lot L-8842 · Sampling: Check 1 part every 30 minutes</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">Next check in</span>
            </div>
            <div className={`text-3xl tabular-nums ${timeToNext < 60 ? 'text-yellow-600' : 'text-green-600'}`}>
              {formatTime(timeToNext)}
            </div>
            <p className="text-sm text-gray-500 mt-1">or 20 parts</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Active Control Items List */}
        <div>
          <h3 className="text-gray-900 mb-4">Control Items</h3>
          <div className="space-y-3">
            {controlItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                  setInputValue('');
                  setResult(null);
                  setAttributeResult(null);
                  setComment('');
                }}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedItem.id === item.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.samplingRule}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(item.status)}`}>
                    {item.status === 'ok' ? 'OK' : item.status === 'due' ? 'Due' : 'Overdue'}
                  </span>
                </div>
                <p className="text-xs text-gray-400">Last check: {item.lastCheck}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Data Entry Panel */}
        <div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-gray-900 mb-2">{selectedItem.name}</h3>
                <p className="text-sm text-gray-600">
                  Type: {selectedItem.type === 'numeric' ? 'Numeric Measurement' : 'Pass/Fail Check'}
                </p>
              </div>
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">Instructions</span>
              </button>
            </div>

            {selectedItem.type === 'numeric' ? (
              <div className="space-y-6">
                {/* Specification Context */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-3">Specification Limits</p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">LSL</p>
                      <p className="text-gray-900">{selectedItem.lsl} {selectedItem.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Target</p>
                      <p className="text-gray-900">{selectedItem.target} {selectedItem.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">USL</p>
                      <p className="text-gray-900">{selectedItem.usl} {selectedItem.unit}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center mt-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">LCL</p>
                      <p className="text-sm text-blue-600">{selectedItem.lcl} {selectedItem.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">CL</p>
                      <p className="text-sm text-blue-600">{selectedItem.cl} {selectedItem.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">UCL</p>
                      <p className="text-sm text-blue-600">{selectedItem.ucl} {selectedItem.unit}</p>
                    </div>
                  </div>
                </div>

                {/* Input Field */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Enter Measurement</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      step="0.01"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={`Enter value in ${selectedItem.unit}`}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-2xl text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSubmit}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Auto-capture: Manual entry required</p>
                </div>

                {/* Result Feedback */}
                {result && (
                  <div className={`p-4 rounded-lg border-2 ${
                    result === 'ok' ? 'bg-green-50 border-green-500' :
                    result === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                    result === 'ooc' ? 'bg-orange-50 border-orange-500' :
                    'bg-red-50 border-red-500'
                  }`}>
                    <div className="flex items-center gap-3">
                      {result === 'ok' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      )}
                      <div>
                        <p className={`${
                          result === 'ok' ? 'text-green-900' :
                          result === 'warning' ? 'text-yellow-900' :
                          result === 'ooc' ? 'text-orange-900' :
                          'text-red-900'
                        }`}>
                          {result === 'ok' ? 'Result OK - Within Specification & Control' :
                           result === 'warning' ? 'Result OK - But Trending Near Limit' :
                           result === 'ooc' ? 'Out of Control (OOC)' :
                           'Out of Specification (OOS)'}
                        </p>
                        <p className={`text-sm mt-1 ${
                          result === 'ok' ? 'text-green-700' :
                          result === 'warning' ? 'text-yellow-700' :
                          result === 'ooc' ? 'text-orange-700' :
                          'text-red-700'
                        }`}>
                          Value: {inputValue} {selectedItem.unit}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">Inspect the part for surface scratches</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className="py-6 bg-green-100 hover:bg-green-200 text-green-900 rounded-lg transition-colors"
                    onClick={() => handlePassFail(true)}
                  >
                    <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                    Pass
                  </button>
                  <button
                    className="py-6 bg-red-100 hover:bg-red-200 text-red-900 rounded-lg transition-colors"
                    onClick={() => handlePassFail(false)}
                  >
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                    Fail
                  </button>
                </div>
                <textarea
                  placeholder="Add comment (optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              {result ? (
                <p className={`${
                  result === 'ok' ? 'text-green-600' :
                  result === 'warning' ? 'text-yellow-600' :
                  result === 'ooc' ? 'text-orange-600' :
                  'text-red-600'
                }`}>
                  {result === 'ok' ? '✓ Result OK' :
                   result === 'warning' ? '⚠ Result OK - Watch for trends' :
                   result === 'ooc' ? '⚠ Out of Control' :
                   '✗ Out of Specification'}
                </p>
              ) : (
                <p className="text-gray-500">Enter measurement to continue</p>
              )}
            </div>
            <div>
              {result && result !== 'ok' ? (
                <p className="text-gray-700">
                  {result === 'warning' ? 'Monitor next readings closely' :
                   result === 'ooc' ? 'Pause production and notify supervisor' :
                   'Stop machine immediately and start containment'}
                </p>
              ) : (
                <p className="text-gray-700">Continue production</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {result === 'oos' && (
                <>
                  <button className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors" onClick={handleCreateNC}>
                    <FileText className="w-4 h-4" />
                    Create Nonconformance
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors" onClick={handleCallSupervisor}>
                    <Phone className="w-4 h-4" />
                    Call Supervisor
                  </button>
                </>
              )}
              {result === 'ooc' && (
                <button className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors" onClick={handleCallSupervisor}>
                  <Phone className="w-4 h-4" />
                  Call Supervisor
                </button>
              )}
              {result === 'ok' && (
                <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" onClick={handleAcknowledge}>
                  Acknowledge & Continue
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Instructions Panel */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-gray-900">Visual Work Instructions: {selectedItem.name}</h3>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <p className="text-gray-500">[Image: Measurement setup diagram]</p>
              </div>
              <div>
                <h4 className="text-gray-900 mb-2">Step 1: Position the part</h4>
                <p className="text-gray-600">Place the part in the fixture ensuring proper alignment with the reference datum.</p>
              </div>
              <div>
                <h4 className="text-gray-900 mb-2">Step 2: Zero the caliper</h4>
                <p className="text-gray-600">Close the caliper jaws and press the zero button to calibrate.</p>
              </div>
              <div>
                <h4 className="text-gray-900 mb-2">Step 3: Measure the hole diameter</h4>
                <p className="text-gray-600">Insert the inside measurement jaws into the hole and read the value. Record to 0.01mm precision.</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">💡 Tip: Ensure the caliper is perpendicular to the hole axis for accurate readings.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nonconformance Dialog */}
      {showNCDialog && (
        <Dialog
          title="In-Process Check - Create Nonconformance"
          onClose={() => setShowNCDialog(false)}
          size="lg"
          actions={[
            {
              label: 'Create NC Form',
              onClick: () => {
                toast.success('Nonconformance report created successfully');
                setShowNCDialog(false);
              },
              color: 'red'
            },
            {
              label: 'Cancel',
              onClick: () => setShowNCDialog(false),
              color: 'gray'
            }
          ]}
        >
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="text-red-900">Out of Specification Detected</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Characteristic: <strong>{selectedItem.name}</strong> · Value: <strong>{inputValue} {selectedItem.unit}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Part Number</label>
                <input
                  type="text"
                  value={context.product}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Lot Number</label>
                <input
                  type="text"
                  value="L-8842"
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Station</label>
                <input
                  type="text"
                  value={context.station}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Operation</label>
                <input
                  type="text"
                  value={context.operation}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Defect Description</label>
              <textarea
                placeholder="Describe the defect details..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Containment Action</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Stop production immediately</option>
                <option>Quarantine affected parts</option>
                <option>100% inspection of lot</option>
                <option>Engineering review required</option>
              </select>
            </div>
          </div>
        </Dialog>
      )}

      {/* Supervisor Notification Dialog */}
      {showSupervisorDialog && (
        <Dialog
          title="In-Process Check - Supervisor Notification"
          onClose={() => setShowSupervisorDialog(false)}
          size="md"
          actions={[
            {
              label: 'OK',
              onClick: () => setShowSupervisorDialog(false),
              color: 'blue'
            }
          ]}
        >
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="text-orange-900">Supervisor Notified</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Line supervisor has been alerted to the {result === 'ooc' ? 'out of control' : 'out of specification'} condition.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Characteristic</p>
                <p className="text-gray-900">{selectedItem.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Measured Value</p>
                <p className="text-gray-900">{inputValue} {selectedItem.unit}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className={result === 'ooc' ? 'text-orange-600' : 'text-red-600'}>
                  {result === 'ooc' ? 'Out of Control (OOC)' : 'Out of Specification (OOS)'}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                💡 Please pause production and wait for supervisor guidance before continuing.
              </p>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}