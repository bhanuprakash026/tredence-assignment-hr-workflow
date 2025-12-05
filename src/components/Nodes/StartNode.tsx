import React from 'react';
import { NodeProps } from 'reactflow';
import { Play } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { StartNodeData } from '@/types/workflow';

export const StartNode: React.FC<NodeProps<StartNodeData>> = (props) => {
  return (
    <BaseNode
      {...props}
      color="bg-[hsl(var(--node-start))]"
      icon={<Play className="w-4 h-4" />}
      showTargetHandle={false}
    >
      {props.data.title || 'Start'}
    </BaseNode>
  );
};
