import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { useWorkflowStore } from '@/hooks/useWorkflowStore';

interface BaseNodeProps extends NodeProps {
  children: React.ReactNode;
  color: string;
  icon: React.ReactNode;
  showSourceHandle?: boolean;
  showTargetHandle?: boolean;
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  id,
  selected,
  children,
  color,
  icon,
  showSourceHandle = true,
  showTargetHandle = true,
}) => {
  const { setSelectedNodeId, deleteNode } = useWorkflowStore();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNodeId(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'relative min-w-[180px] rounded-xl bg-card border-2 shadow-lg transition-all duration-200 cursor-pointer group',
        selected
          ? 'border-primary ring-2 ring-primary/20 scale-105'
          : 'border-border hover:border-primary/50 hover:shadow-xl'
      )}
    >
      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-110 z-10"
      >
        <Trash2 className="w-3 h-3" />
      </button>

      {/* Header with icon */}
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-t-[10px] text-white font-medium text-sm',
          color
        )}
      >
        {icon}
        <span className="truncate">{children}</span>
      </div>

      {/* Handles */}
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !-left-1.5 !border-2 !border-card"
          style={{ background: 'hsl(var(--primary))' }}
        />
      )}
      {showSourceHandle && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !-right-1.5 !border-2 !border-card"
          style={{ background: 'hsl(var(--primary))' }}
        />
      )}
    </div>
  );
};
