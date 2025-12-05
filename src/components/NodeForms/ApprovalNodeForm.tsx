import React from 'react';
import { ApprovalNodeData } from '@/types/workflow';
import { useWorkflowStore } from '@/hooks/useWorkflowStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ApprovalNodeFormProps {
  nodeId: string;
  data: ApprovalNodeData;
}

export const ApprovalNodeForm: React.FC<ApprovalNodeFormProps> = ({ nodeId, data }) => {
  const { updateNodeData } = useWorkflowStore();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">
          Approval Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          value={data.title || ''}
          onChange={(e) => updateNodeData(nodeId, { title: e.target.value })}
          placeholder="Enter approval title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="approverRole">Approver Role</Label>
        <Input
          id="approverRole"
          value={data.approverRole || ''}
          onChange={(e) => updateNodeData(nodeId, { approverRole: e.target.value })}
          placeholder="e.g., Manager, HR Director, Team Lead"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="autoApproveThreshold">Auto-Approve Threshold</Label>
        <Input
          id="autoApproveThreshold"
          type="number"
          min="0"
          value={data.autoApproveThreshold || 0}
          onChange={(e) =>
            updateNodeData(nodeId, { autoApproveThreshold: parseInt(e.target.value) || 0 })
          }
          placeholder="0 = no auto-approve"
        />
        <p className="text-xs text-muted-foreground">
          If the amount is below this threshold, the step will be auto-approved.
        </p>
      </div>
    </div>
  );
};
