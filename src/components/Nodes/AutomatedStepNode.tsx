import React from 'react';
import { NodeProps } from 'reactflow';
import { Zap } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { AutomatedStepNodeData } from '@/types/workflow';

export const AutomatedStepNode: React.FC<NodeProps<AutomatedStepNodeData>> = (props) => {
  return (
    <BaseNode
      {...props}
      color="bg-[hsl(var(--node-automated))]"
      icon={<Zap className="w-4 h-4" />}
    >
      <div className="flex flex-col">
        <span>{props.data.title || 'Automated Step'}</span>
        {props.data.actionId && (
          <span className="text-xs opacity-80">{props.data.actionId}</span>
        )}
      </div>
    </BaseNode>
  );
};
