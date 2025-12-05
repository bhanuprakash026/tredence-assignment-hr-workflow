import React, { useEffect } from 'react';
import { AutomatedStepNodeData } from '@/types/workflow';
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
import { getAutomationAction } from '@/api/mockApi';

interface AutomatedStepNodeFormProps {
  nodeId: string;
  data: AutomatedStepNodeData;
}

export const AutomatedStepNodeForm: React.FC<AutomatedStepNodeFormProps> = ({
  nodeId,
  data,
}) => {
  const { updateNodeData, automationActions } = useWorkflowStore();

  // Get the selected action's parameters
  const selectedAction = getAutomationAction(data.actionId);

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
  }, [data.actionId]);

  const handleActionChange = (actionId: string) => {
    const action = getAutomationAction(actionId);
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
