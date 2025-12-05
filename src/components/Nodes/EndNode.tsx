import React from 'react';
import { NodeProps } from 'reactflow';
import { StopCircle } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { EndNodeData } from '@/types/workflow';

export const EndNode: React.FC<NodeProps<EndNodeData>> = (props) => {
  return (
    <BaseNode
      {...props}
      color="bg-[hsl(var(--node-end))]"
      icon={<StopCircle className="w-4 h-4" />}
      showSourceHandle={false}
    >
      {props.data.endMessage || 'End'}
    </BaseNode>
  );
};
