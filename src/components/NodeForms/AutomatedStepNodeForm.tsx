import React, { useEffect, useState } from 'react';
import { AutomatedStepNodeData, AutomationAction } from '@/types/workflow';
import { useWorkflowStore } from '@/hooks/useWorkflowStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchAutomationsFromAPI } from '@/api/apiClient';
import { Loader2 } from 'lucide-react';

interface AutomatedStepNodeFormProps {
  nodeId: string;
  data: AutomatedStepNodeData;
}

export const AutomatedStepNodeForm: React.FC<AutomatedStepNodeFormProps> = ({
  nodeId,
  data,
}) => {
  const { updateNodeData, automationActions, setAutomationActions } = useWorkflowStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch automation actions from API on mount
  useEffect(() => {
    console.log('AutomatedStepNodeForm mounted');
    console.log('Current automationActions:', automationActions);

    // Always fetch to ensure we get latest data from API
    setIsLoading(true);
    setError(null);
    console.log('Fetching automations from API...');

    fetchAutomationsFromAPI()
      .then((actions) => {
        console.log('API Response:', actions);
        setAutomationActions(actions);
      })
      .catch((err) => {
        console.error('API Error:', err);
        setError('Failed to load actions. Make sure JSON Server is running on port 4000.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [setAutomationActions]);

  // Get the selected action's parameters from loaded actions
  const selectedAction = automationActions.find((a) => a.id === data.actionId);

  // Initialize actionParams when action changes
  useEffect(() => {
    if (selectedAction && data.actionId) {
      const initialParams: Record<string, string> = {};
      selectedAction.params.forEach((param) => {
        initialParams[param] = data.actionParams?.[param] || '';
      });
      if (JSON.stringify(initialParams) !== JSON.stringify(data.actionParams)) {
        updateNodeData(nodeId, { actionParams: initialParams });
      }
    }
  }, [data.actionId, selectedAction]);

  const handleActionChange = (actionId: string) => {
    const action = automationActions.find((a) => a.id === actionId);
    const initialParams: Record<string, string> = {};
    action?.params.forEach((param) => {
      initialParams[param] = '';
    });
    updateNodeData(nodeId, { actionId, actionParams: initialParams });
  };

  const handleParamChange = (param: string, value: string) => {
    updateNodeData(nodeId, {
      actionParams: { ...data.actionParams, [param]: value },
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Step Title</Label>
        <Input
          id="title"
          value={data.title || ''}
          onChange={(e) => updateNodeData(nodeId, { title: e.target.value })}
          placeholder="Enter step title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="action">
          Action <span className="text-destructive">*</span>
        </Label>
        {isLoading ? (
          <div className="flex items-center gap-2 p-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading actions...</span>
          </div>
        ) : error ? (
          <div className="text-sm text-destructive p-2 bg-destructive/10 rounded">
            {error}
          </div>
        ) : (
          <Select value={data.actionId || ''} onValueChange={handleActionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select an action" />
            </SelectTrigger>
            <SelectContent>
              {automationActions.map((action) => (
                <SelectItem key={action.id} value={action.id}>
                  {action.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedAction && selectedAction.params.length > 0 && (
        <div className="space-y-4 pt-2 border-t border-border">
          <p className="text-sm font-medium text-foreground">Action Parameters</p>
          {selectedAction.params.map((param) => (
            <div key={param} className="space-y-2">
              <Label htmlFor={param} className="capitalize">
                {param.replace(/([A-Z])/g, ' $1').trim()}
              </Label>
              <Input
                id={param}
                value={data.actionParams?.[param] || ''}
                onChange={(e) => handleParamChange(param, e.target.value)}
                placeholder={`Enter ${param}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};