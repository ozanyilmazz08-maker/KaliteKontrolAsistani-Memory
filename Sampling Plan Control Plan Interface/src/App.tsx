import { useState } from 'react';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { HelpCircle, History, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip';
import { Alert, AlertDescription } from './components/ui/alert';
import { OverviewTab } from './components/OverviewTab';
import { MappingTab } from './components/MappingTab';
import { AutomationTab } from './components/AutomationTab';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import {
  validateSampleSize,
  validateAQL,
  validateCpk,
  validateNonConformanceRate,
  validateAcceptanceNumber,
  validateRejectionNumber,
} from './components/ValidationUtils';

// ============================================================================
// SCIENTIFIC CONFIGURATION TYPES
// ============================================================================

export interface PhaseMetrics {
  timeInPhase: number; // days
  cpk: number;
  nonConformanceRate: number; // percentage
  customerComplaints: number;
  customerReturns: number;
}

export interface PhaseCriteria {
  name: 'PPAP' | 'Safe Launch' | 'Production' | 'Reduced Inspection';
  minimumDays?: number;
  requiredCpk?: number;
  maxNonConformanceRate?: number;
  maxComplaints?: number;
  maxReturns?: number;
  samplingStrategy: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  enabled: boolean;
}

export interface QualityConfiguration {
  phase: 'PPAP' | 'Safe Launch' | 'Production' | 'Reduced Inspection';
  phaseMetrics: PhaseMetrics;
  samplingPlans: any[]; // Will be populated from MappingTab
  automationRules: AutomationRule[];
  lastModified: Date;
  isDraft: boolean;
}

// ============================================================================
// DEFAULT CONFIGURATIONS (per TECHNICAL_SPECIFICATION.md)
// ============================================================================

const DEFAULT_PHASE_CRITERIA: Record<string, PhaseCriteria> = {
  PPAP: {
    name: 'PPAP',
    minimumDays: undefined, // Based on units (300)
    requiredCpk: 1.67,
    maxNonConformanceRate: 0.5,
    samplingStrategy: '100% Inspection',
  },
  'Safe Launch': {
    name: 'Safe Launch',
    minimumDays: 90,
    requiredCpk: 1.33,
    maxNonConformanceRate: 1.0,
    maxComplaints: 0,
    samplingStrategy: 'AQL 0.65 - Tightened',
  },
  Production: {
    name: 'Production',
    minimumDays: 180,
    requiredCpk: 1.67,
    maxNonConformanceRate: 0.5,
    maxReturns: 0,
    samplingStrategy: 'AQL 1.0 - Normal',
  },
  'Reduced Inspection': {
    name: 'Reduced Inspection',
    requiredCpk: 1.67,
    maxNonConformanceRate: 1.0,
    samplingStrategy: 'AQL 2.5 - Reduced',
  },
};

const DEFAULT_CONFIGURATION: QualityConfiguration = {
  phase: 'Production',
  phaseMetrics: {
    timeInPhase: 245,
    cpk: 1.52,
    nonConformanceRate: 0.8,
    customerComplaints: 0,
    customerReturns: 0,
  },
  samplingPlans: [],
  automationRules: [
    {
      id: 'rule-1',
      name: 'Non-conformance Escalation',
      condition: 'IF non-conformance rate >1.5% in 10 consecutive lots',
      action: 'THEN switch to Tightened AQL 0.65',
      enabled: true,
    },
    {
      id: 'rule-2',
      name: 'Process Capability De-escalation',
      condition: 'IF Cpk >1.67 for 30 days AND zero defects',
      action: 'THEN switch to Reduced Sampling',
      enabled: true,
    },
    {
      id: 'rule-3',
      name: 'Critical Feature Alert',
      condition: 'IF any critical feature fails',
      action: 'THEN notify Quality Manager AND hold lot',
      enabled: true,
    },
  ],
  lastModified: new Date(),
  isDraft: false,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // ============================================================================
  // SCIENTIFIC CONFIGURATION STATE
  // ============================================================================
  const [configuration, setConfiguration] = useState<QualityConfiguration>(DEFAULT_CONFIGURATION);
  const [originalConfiguration, setOriginalConfiguration] = useState<QualityConfiguration>(DEFAULT_CONFIGURATION);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // ============================================================================
  // SCIENTIFIC VALIDATION PIPELINE
  // ============================================================================
  
  const validateConfiguration = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validate Phase Metrics
    const cpkValidation = validateCpk(configuration.phaseMetrics.cpk.toString());
    if (!cpkValidation.isValid) {
      errors.push(`Cpk Validation: ${cpkValidation.error}`);
    }

    const ncrValidation = validateNonConformanceRate(configuration.phaseMetrics.nonConformanceRate.toString());
    if (!ncrValidation.isValid) {
      errors.push(`Non-conformance Rate: ${ncrValidation.error}`);
    }

    // Check Phase Criteria (per TECHNICAL_SPECIFICATION.md)
    const phaseCriteria = DEFAULT_PHASE_CRITERIA[configuration.phase];
    
    if (phaseCriteria.minimumDays && configuration.phaseMetrics.timeInPhase < phaseCriteria.minimumDays) {
      errors.push(
        `Phase "${configuration.phase}" requires minimum ${phaseCriteria.minimumDays} days. ` +
        `Current: ${configuration.phaseMetrics.timeInPhase} days (per IATF 16949).`
      );
    }

    if (phaseCriteria.requiredCpk && configuration.phaseMetrics.cpk < phaseCriteria.requiredCpk) {
      errors.push(
        `Phase "${configuration.phase}" requires Cpk ≥ ${phaseCriteria.requiredCpk}. ` +
        `Current: ${configuration.phaseMetrics.cpk} (per Six Sigma methodology).`
      );
    }

    if (phaseCriteria.maxNonConformanceRate && configuration.phaseMetrics.nonConformanceRate > phaseCriteria.maxNonConformanceRate) {
      errors.push(
        `Phase "${configuration.phase}" allows maximum ${phaseCriteria.maxNonConformanceRate}% non-conformance. ` +
        `Current: ${configuration.phaseMetrics.nonConformanceRate}% (per ANSI/ASQ Z1.4).`
      );
    }

    if (phaseCriteria.maxComplaints !== undefined && configuration.phaseMetrics.customerComplaints > phaseCriteria.maxComplaints) {
      errors.push(
        `Phase "${configuration.phase}" allows maximum ${phaseCriteria.maxComplaints} customer complaints. ` +
        `Current: ${configuration.phaseMetrics.customerComplaints}.`
      );
    }

    if (phaseCriteria.maxReturns !== undefined && configuration.phaseMetrics.customerReturns > phaseCriteria.maxReturns) {
      errors.push(
        `Phase "${configuration.phase}" allows maximum ${phaseCriteria.maxReturns} customer returns. ` +
        `Current: ${configuration.phaseMetrics.customerReturns}.`
      );
    }

    // Validate Sampling Plans (if any exist)
    // This would be populated from MappingTab in production
    
    // Validate Automation Rules
    if (configuration.automationRules.length === 0) {
      errors.push('Warning: No automation rules defined. Manual monitoring required.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const checkPhaseTransitionEligibility = (targetPhase: string): { eligible: boolean; reasons: string[] } => {
    const reasons: string[] = [];
    const currentCriteria = DEFAULT_PHASE_CRITERIA[configuration.phase];
    const targetCriteria = DEFAULT_PHASE_CRITERIA[targetPhase];

    if (!targetCriteria) {
      return { eligible: false, reasons: ['Invalid target phase'] };
    }

    // Check all exit criteria for current phase
    if (targetCriteria.minimumDays && configuration.phaseMetrics.timeInPhase < targetCriteria.minimumDays) {
      reasons.push(`Insufficient time in phase. Required: ${targetCriteria.minimumDays} days, Current: ${configuration.phaseMetrics.timeInPhase} days`);
    }

    if (targetCriteria.requiredCpk && configuration.phaseMetrics.cpk < targetCriteria.requiredCpk) {
      reasons.push(`Cpk below threshold. Required: ${targetCriteria.requiredCpk}, Current: ${configuration.phaseMetrics.cpk}`);
    }

    if (targetCriteria.maxNonConformanceRate && configuration.phaseMetrics.nonConformanceRate > targetCriteria.maxNonConformanceRate) {
      reasons.push(`Non-conformance rate too high. Max: ${targetCriteria.maxNonConformanceRate}%, Current: ${configuration.phaseMetrics.nonConformanceRate}%`);
    }

    return {
      eligible: reasons.length === 0,
      reasons,
    };
  };

  const handleDiscardChanges = () => {
    if (confirm('Are you sure you want to discard all changes? This action cannot be undone.')) {
      toast.info('Changes discarded');
      setConfiguration(originalConfiguration);
      setHasUnsavedChanges(false);
    }
  };

  const handleResetToDefault = () => {
    if (confirm('Reset all configurations to default values? This will override any custom settings.')) {
      toast.success('Configuration reset to defaults');
      setConfiguration(DEFAULT_CONFIGURATION);
      setOriginalConfiguration(DEFAULT_CONFIGURATION);
      setHasUnsavedChanges(false);
    }
  };

  const handleSaveAsDraft = () => {
    toast.success('Changes saved as draft');
    setConfiguration({ ...configuration, isDraft: true });
    setHasUnsavedChanges(false);
  };

  const handleSaveAndApply = () => {
    const validation = validateConfiguration();
    if (!validation.isValid) {
      toast.error('Configuration contains errors. Please fix them before saving.');
      setValidationErrors(validation.errors);
      return;
    }

    toast.success('Changes saved and applied to control plan');
    setConfiguration({ ...configuration, isDraft: false });
    setHasUnsavedChanges(false);
  };

  const handleViewHistory = () => {
    toast.info('Opening version history');
    // In production, this would open a history dialog or navigate to history view
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Bar */}
      <div className="border-b bg-white px-6 py-4 flex-shrink-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h2 className="mb-1">Sampling Plan / Control Plan Linkage</h2>
            <p className="text-slate-600">Engine Block Assembly • Line A3 • Customer: Premium Auto Corp</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Link sampling inspection strategies with control plans to ensure quality compliance and traceability.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleViewHistory}>
                    <History className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View version history</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Active Control Plan v5.2
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            IATF 16949
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            ISO 9001:2015
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            APQP Phase: Production
          </Badge>
        </div>
      </div>

      {/* Validation Errors Display */}
      {validationErrors.length > 0 && (
        <div className="border-b bg-red-50 px-6 py-3">
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-900">
              <div className="mb-1">Configuration validation failed. Please address the following issues:</div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b bg-slate-50 px-6">
          <TabsList className="bg-transparent h-12">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="mapping" className="data-[state=active]:bg-white">
              Sampling Plan Mapping
            </TabsTrigger>
            <TabsTrigger value="automation" className="data-[state=active]:bg-white">
              Advanced Rules & Automation
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto">
          <TabsContent value="overview" className="m-0 p-6">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="mapping" className="m-0 p-0 h-full">
            <MappingTab />
          </TabsContent>

          <TabsContent value="automation" className="m-0 p-6">
            <AutomationTab />
          </TabsContent>
        </div>
      </Tabs>

      {/* Bottom Action Bar */}
      <div className="border-t bg-white px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={handleDiscardChanges}>
            Discard Changes
          </Button>
          <Button variant="outline" onClick={handleResetToDefault}>
            Reset to Default
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              const validation = validateConfiguration();
              if (validation.isValid) {
                toast.success('Configuration is valid');
                setValidationErrors([]);
              } else {
                toast.error(`Validation failed: ${validation.errors.length} issues found`);
                setValidationErrors(validation.errors);
              }
            }}
          >
            Validate Configuration
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSaveAsDraft}>
            Save as Draft
          </Button>
          <Button onClick={handleSaveAndApply}>
            Save & Apply
          </Button>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}