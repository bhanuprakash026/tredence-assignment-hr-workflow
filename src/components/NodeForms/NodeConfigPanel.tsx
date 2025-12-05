import React from 'react';
import { X, Play, ClipboardList, CheckCircle2, Zap, StopCircle } from 'lucide-react';
import { useWorkflowStore } from '@/hooks/useWorkflowStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StartNodeForm } from './StartNodeForm';
import { TaskNodeForm } from './TaskNodeForm';
import { ApprovalNodeForm } from './ApprovalNodeForm';
import { AutomatedStepNodeForm } from './AutomatedStepNodeForm';
import { EndNodeForm } from './EndNodeForm';
import { cn } from '@/lib/utils';

const nodeTypeConfig = {
  start: {
    label: 'Start Node',
    icon: Play,
    color: 'bg-[hsl(var(--node-start))]',
  },
  task: {
    label: 'Task Node',
    icon: ClipboardList,
    color: 'bg-[hsl(var(--node-task))]',
  },
  approval: {
    label: 'Approval Node',
    icon: CheckCircle2,
    color: 'bg-[hsl(var(--node-approval))]',
  },
  automated: {
    label: 'Automated Step',
    icon: Zap,
    color: 'bg-[hsl(var(--node-automated))]',
  },
  end: {
    label: 'End Node',
    icon: StopCircle,
    color: 'bg-[hsl(var(--node-end))]',
  },
};

export const NodeConfigPanel: React.FC = () => {
  const { nodes, selectedNodeId, setSelectedNodeId } = useWorkflowStore();

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <aside className="w-80 h-full bg-sidebar-background border-l border-sidebar-border p-4 flex flex-col items-center justify-center animate-slide-in-right">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">Select a node to configure</p>
          <p className="text-xs mt-1">Click on any node in the canvas</p>
        </div>
      </aside>
    );
  }

  const nodeType = selectedNode.type as keyof typeof nodeTypeConfig;
  const config = nodeTypeConfig[nodeType];
  const Icon = config?.icon || Play;

  const renderForm = () => {
    switch (nodeType) {
      case 'start':
        return <StartNodeForm nodeId={selectedNode.id} data={selectedNode.data as any} />;
      case 'task':
        return <TaskNodeForm nodeId={selectedNode.id} data={selectedNode.data as any} />;
      case 'approval':
        return <ApprovalNodeForm nodeId={selectedNode.id} data={selectedNode.data as any} />;
      case 'automated':
        return <AutomatedStepNodeForm nodeId={selectedNode.id} data={selectedNode.data as any} />;
      case 'end':
        return <EndNodeForm nodeId={selectedNode.id} data={selectedNode.data as any} />;
      default:
        return <p className="text-sm text-muted-foreground">Unknown node type</p>;
    }
  };

  return (
    <aside className="w-80 h-full bg-sidebar-background border-l border-sidebar-border flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-white', config?.color)}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">{config?.label}</h3>
              <p className="text-xs text-muted-foreground">{selectedNode.id}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedNodeId(null)}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <ScrollArea className="flex-1 p-4">
        {renderForm()}
      </ScrollArea>
    </aside>
  );
};
