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
import { mockModels } from '../../data/mockData';
import { Brain, Activity, TestTube, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function ModelsScreen() {
  const activeModels = mockModels.filter((m) => m.deploymentStatus === 'active').length;

  const handleDeploy = (modelId: string) => {
    const model = mockModels.find((m) => m.id === modelId);
    toast.success('Model deployed', {
      description: `${model?.name} has been deployed to production.`
    });
  };

  const handleDeactivate = (modelId: string) => {
    const model = mockModels.find((m) => m.id === modelId);
    toast.success('Model deactivated', {
      description: `${model?.name} has been deactivated.`
    });
  };

  const handleViewFeedback = () => {
    toast.info('Model Feedback', {
      description: 'Opening feedback inbox for model improvement and validation...'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary">Active</Badge>;
      case 'testing':
        return <Badge variant="default">Testing</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return <Badge variant="outline">{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-1">Models & Rules</h1>
        <p className="text-gray-600">Manage predictive maintenance algorithms and detection rules</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-sm text-gray-600">Total Models</div>
              <div className="text-2xl font-semibold text-gray-900">{mockModels.length}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-sm text-gray-600">Active</div>
              <div className="text-2xl font-semibold text-green-600">{activeModels}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TestTube className="w-8 h-8 text-yellow-600" />
            <div>
              <div className="text-sm text-gray-600">Testing</div>
              <div className="text-2xl font-semibold text-yellow-600">
                {mockModels.filter((m) => m.deploymentStatus === 'testing').length}
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-purple-600" />
            <div>
              <div className="text-sm text-gray-600">Assets Monitored</div>
              <div className="text-2xl font-semibold text-gray-900">
                {mockModels.reduce((sum, m) => sum + m.assetsMonitored, 0)}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Models Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Last Trained</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assets</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockModels.map((model) => (
                <TableRow key={model.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{model.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(model.type)}</TableCell>
                  <TableCell className="text-gray-600">{model.version}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {model.lastTrained
                      ? new Date(model.lastTrained).toLocaleDateString()
                      : '—'}
                  </TableCell>
                  <TableCell>
                    {model.accuracy ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600">Acc:</span>
                          <span className="text-gray-900 font-medium">
                            {Math.round(model.accuracy * 100)}%
                          </span>
                        </div>
                        {model.precision && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600">Prec:</span>
                            <span className="text-gray-900 font-medium">
                              {Math.round(model.precision * 100)}%
                            </span>
                          </div>
                        )}
                        {model.recall && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600">Rec:</span>
                            <span className="text-gray-900 font-medium">
                              {Math.round(model.recall * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(model.deploymentStatus)}</TableCell>
                  <TableCell className="text-gray-900">{model.assetsMonitored}</TableCell>
                  <TableCell>
                    {model.deploymentStatus === 'active' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeactivate(model.id)}
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleDeploy(model.id)}
                      >
                        Deploy
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Feedback Section */}
      <Card className="p-6 bg-blue-50">
        <h3 className="font-medium text-gray-900 mb-2">Model Feedback</h3>
        <p className="text-sm text-gray-600 mb-4">
          Review false positives and confirmed failures to improve model accuracy.
        </p>
        <Button variant="outline" onClick={handleViewFeedback}>View Feedback Inbox</Button>
      </Card>
    </div>
  );
}