import React from 'react';
import { NodeProps } from 'reactflow';
import { ClipboardList } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { TaskNodeData } from '@/types/workflow';

export const TaskNode: React.FC<NodeProps<TaskNodeData>> = (props) => {
  return (
    <BaseNode
      {...props}
      color="bg-[hsl(var(--node-task))]"
      icon={<ClipboardList className="w-4 h-4" />}
    >
      <div className="flex flex-col">
        <span>{props.data.title || 'Task'}</span>
        {props.data.assignee && (
          <span className="text-xs opacity-80">@{props.data.assignee}</span>
        )}
      </div>
    </BaseNode>
  );
};
