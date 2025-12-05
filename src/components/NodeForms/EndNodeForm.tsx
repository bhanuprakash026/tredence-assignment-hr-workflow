import React from 'react';
import { EndNodeData } from '@/types/workflow';
import { useWorkflowStore } from '@/hooks/useWorkflowStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface EndNodeFormProps {
  nodeId: string;
  data: EndNodeData;
}

export const EndNodeForm: React.FC<EndNodeFormProps> = ({ nodeId, data }) => {
  const { updateNodeData } = useWorkflowStore();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="endMessage">End Message</Label>
        <Input
          id="endMessage"
          value={data.endMessage || ''}
          onChange={(e) => updateNodeData(nodeId, { endMessage: e.target.value })}
          placeholder="Message to display when workflow ends"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="showSummary">Show Summary</Label>
          <p className="text-xs text-muted-foreground">
            Display a summary of the workflow execution
          </p>
        </div>
        <Switch
          id="showSummary"
          checked={data.showSummary || false}
          onCheckedChange={(checked) => updateNodeData(nodeId, { showSummary: checked })}
        />
      </div>
    </div>
  );
};
