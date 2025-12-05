import React from 'react';
import { Workflow, Trash2 } from 'lucide-react';
import { NodePalette } from '@/components/Sidebar/NodePalette';
import { WorkflowCanvas } from '@/components/Canvas/WorkflowCanvas';
import { NodeConfigPanel } from '@/components/NodeForms/NodeConfigPanel';
import { SimulationPanel } from '@/components/SimulationPanel/SimulationPanel';
import { useWorkflowStore } from '@/hooks/useWorkflowStore';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  const { clearWorkflow, nodes } = useWorkflowStore();

  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Workflow className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">HR Workflow Designer</h1>
            <p className="text-xs text-muted-foreground">
              {nodes.length} node{nodes.length !== 1 ? 's' : ''} in canvas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearWorkflow}
            className="gap-2"
            disabled={nodes.length === 0}
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </Button>
          <SimulationPanel />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Node Palette */}
        <NodePalette />

        {/* Canvas */}
        <WorkflowCanvas />

        {/* Right Sidebar - Node Configuration */}
        <NodeConfigPanel />
      </main>
    </div>
  );
};

export default Index;
