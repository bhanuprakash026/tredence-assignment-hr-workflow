import React from 'react';
import { NodeProps } from 'reactflow';
import { CheckCircle2 } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { ApprovalNodeData } from '@/types/workflow';

export const ApprovalNode: React.FC<NodeProps<ApprovalNodeData>> = (props) => {
  return (
    <BaseNode
      {...props}
      color="bg-[hsl(var(--node-approval))]"
      icon={<CheckCircle2 className="w-4 h-4" />}
    >
      <div className="flex flex-col">
        <span>{props.data.title || 'Approval'}</span>
        {props.data.approverRole && (
          <span className="text-xs opacity-80">{props.data.approverRole}</span>
        )}
      </div>
    </BaseNode>
  );
};
