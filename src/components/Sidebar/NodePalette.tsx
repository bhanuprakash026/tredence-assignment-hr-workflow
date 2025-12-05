import React from 'react';
import { Play, ClipboardList, CheckCircle2, Zap, StopCircle } from 'lucide-react';
import { NodeType } from '@/types/workflow';
import { cn } from '@/lib/utils';

interface DraggableNodeProps {
  type: NodeType;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const DraggableNode: React.FC<DraggableNodeProps> = ({ type, label, icon, color }) => {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg cursor-grab active:cursor-grabbing',
        'bg-card border border-border hover:border-primary/50 transition-all duration-200',
        'hover:shadow-md hover:scale-[1.02] select-none'
      )}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center text-white',
          color
        )}
      >
        {icon}
      </div>
      <span className="font-medium text-sm text-foreground">{label}</span>
    </div>
  );
};

export const NodePalette: React.FC = () => {
  const nodes: DraggableNodeProps[] = [
    {
      type: 'start',
      label: 'Start',
      icon: <Play className="w-4 h-4" />,
      color: 'bg-[hsl(var(--node-start))]',
    },
    {
      type: 'task',
      label: 'Task',
      icon: <ClipboardList className="w-4 h-4" />,
      color: 'bg-[hsl(var(--node-task))]',
    },
    {
      type: 'approval',
      label: 'Approval',
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: 'bg-[hsl(var(--node-approval))]',
    },
    {
      type: 'automated',
      label: 'Automated Step',
      icon: <Zap className="w-4 h-4" />,
      color: 'bg-[hsl(var(--node-automated))]',
    },
    {
      type: 'end',
      label: 'End',
      icon: <StopCircle className="w-4 h-4" />,
      color: 'bg-[hsl(var(--node-end))]',
    },
  ];

  return (
    <aside className="w-64 h-full bg-sidebar-background border-r border-sidebar-border p-4 flex flex-col animate-slide-in-left">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">Node Types</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Drag nodes to the canvas to build your workflow
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {nodes.map((node) => (
          <DraggableNode key={node.type} {...node} />
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground space-y-1">
          <p>💡 <strong>Tip:</strong> Connect nodes by dragging from one handle to another.</p>
          <p>🗑️ Hover over nodes to delete them.</p>
        </div>
      </div>
    </aside>
  );
};
