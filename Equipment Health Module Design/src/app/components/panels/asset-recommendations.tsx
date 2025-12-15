import { useState } from 'react';
import { Asset } from '../../data/mockData';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Wrench,
  Clock,
  DollarSign,
  TrendingDown,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { CreateWorkOrderDialog } from '../dialogs/create-work-order-dialog';
import { NavigationPage } from '../../App';
import {
  AlertDialog as AlertDialogRoot,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

interface AssetRecommendationsProps {
  asset: Asset;
  onNavigate: (page: NavigationPage, assetId?: string) => void;
}

interface Recommendation {
  id: string;
  type: 'inspect' | 'lubricate' | 'align' | 'replace' | 'electrical' | 'oil-change';
  title: string;
  rationale: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  requiredSkills: string[];
  estimatedDuration: number; // hours
  requiredParts: string[];
  riskReduction: number; // percentage
  costImpact: number; // dollars
}

export function AssetRecommendations({ asset, onNavigate }: AssetRecommendationsProps) {
  const [showWorkOrderDialog, setShowWorkOrderDialog] = useState(false);
  const [showDismissDialog, setShowDismissDialog] = useState(false);
  const [dismissReason, setDismissReason] = useState('');
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);

  // Mock recommendations based on asset health
  const recommendations: Recommendation[] = [
    {
      id: 'R1',
      type: 'replace',
      title: 'Replace bearing assembly',
      rationale: 'Vibration RMS exceeds threshold by 45%. BPFO frequency detected in FFT analysis.',
      urgency: 'critical',
      requiredSkills: ['Vibration Analysis', 'Mechanical'],
      estimatedDuration: 4,
      requiredParts: ['BRG-6308-2RS', 'SEAL-45x60x8'],
      riskReduction: 85,
      costImpact: 1200
    },
    {
      id: 'R2',
      type: 'inspect',
      title: 'Thermal inspection of bearing housing',
      rationale: 'Temperature 12°C above baseline. Verify bearing condition and lubrication.',
      urgency: 'high',
      requiredSkills: ['Thermography', 'Vibration Analysis'],
      estimatedDuration: 1,
      requiredParts: [],
      riskReduction: 65,
      costImpact: 200
    },
    {
      id: 'R3',
      type: 'align',
      title: 'Check shaft alignment',
      rationale: 'Elevated 2x line frequency suggests possible misalignment.',
      urgency: 'medium',
      requiredSkills: ['Alignment', 'Mechanical'],
      estimatedDuration: 2,
      requiredParts: [],
      riskReduction: 40,
      costImpact: 300
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    return <Wrench className="w-4 h-4" />;
  };

  const handleConvertToWorkOrder = (recommendationId: string) => {
    setSelectedRecommendation(recommendationId);
    setShowWorkOrderDialog(true);
  };

  const handleSchedule = (recommendationId: string) => {
    const rec = recommendations.find((r) => r.id === recommendationId);
    toast.success('Maintenance scheduled', {
      description: `${rec?.title} has been added to the maintenance schedule.`
    });
  };

  const handleDismiss = () => {
    if (!dismissReason.trim()) {
      toast.error('Reason required', {
        description: 'Please provide a reason for dismissing this recommendation.'
      });
      return;
    }

    toast.success('Recommendation dismissed', {
      description: 'Feedback has been sent to the system for model improvement.'
    });
    setShowDismissDialog(false);
    setDismissReason('');
  };

  const handleViewAllAlerts = () => {
    toast.info('View Alerts', {
      description: `Loading all alerts for ${asset.name}...`
    });
  };

  const handleExportHealthReport = () => {
    toast.success('Export started', {
      description: `Generating health report for ${asset.name}...`
    });
    setTimeout(() => {
      toast.success('Export complete', {
        description: 'Health report has been downloaded successfully.'
      });
    }, 2000);
  };

  const handleScheduleInspection = () => {
    toast.info('Schedule Inspection', {
      description: `Opening inspection scheduler for ${asset.name}...`
    });
  };

  return (
    <>
      <Card className="p-6 lg:sticky lg:top-6">
        <h3 className="text-gray-900 mb-4">Recommended Actions</h3>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <Card key={rec.id} className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {getTypeIcon(rec.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 text-sm">{rec.title}</h4>
                    <Badge variant={getUrgencyColor(rec.urgency) as any} className="text-xs">
                      {rec.urgency}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{rec.rationale}</p>
                  
                  {/* Details */}
                  <div className="space-y-1 text-xs text-gray-700 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Est. {rec.estimatedDuration}h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingDown className="w-3 h-3 text-green-600" />
                      <span>Risk reduction: {rec.riskReduction}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span>Cost impact: ${rec.costImpact.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Required Skills */}
                  <div className="mb-3">
                    <div className="text-xs text-gray-600 mb-1">Required skills:</div>
                    <div className="flex flex-wrap gap-1">
                      {rec.requiredSkills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Required Parts */}
                  {rec.requiredParts.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-600 mb-1">Required parts:</div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-gray-700">
                          {rec.requiredParts.join(', ')} - In stock
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleConvertToWorkOrder(rec.id)}
                    >
                      Convert to Work Order
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSchedule(rec.id)}
                      >
                        Schedule
                      </Button>
                      <AlertDialogRoot open={showDismissDialog} onOpenChange={setShowDismissDialog}>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost">
                            Dismiss
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Dismiss Recommendation</AlertDialogTitle>
                            <AlertDialogDescription>
                              Please provide a reason for dismissing this recommendation. This helps improve our prediction models.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="py-4">
                            <Label htmlFor="dismissReason">Reason *</Label>
                            <Textarea
                              id="dismissReason"
                              placeholder="e.g., Already completed, Not applicable, False positive..."
                              value={dismissReason}
                              onChange={(e) => setDismissReason(e.target.value)}
                              rows={3}
                              className="mt-2"
                            />
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDismissReason('')}>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleDismiss}>
                              Submit & Dismiss
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialogRoot>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t space-y-2">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
          <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleViewAllAlerts}>
            View All Alerts
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleExportHealthReport}>
            Export Health Report
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleScheduleInspection}>
            Schedule Inspection
          </Button>
        </div>
      </Card>

      <CreateWorkOrderDialog
        open={showWorkOrderDialog}
        onOpenChange={setShowWorkOrderDialog}
        preSelectedAssetId={asset.id}
      />
    </>
  );
}