import React, { useState } from 'react';
import { Play, X, AlertCircle, CheckCircle2, Loader2, FileJson } from 'lucide-react';
import { useWorkflowStore } from '@/hooks/useWorkflowStore';
import { simulateWorkflowAPI } from '@/api/apiClient';
import { serializeWorkflow, exportWorkflowAsJSON } from '@/utils/serializers';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export const SimulationPanel: React.FC = () => {
  const { nodes, edges } = useWorkflowStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{
    success: boolean;
    steps: string[];
    errors: string[];
  } | null>(null);

  const handleSimulate = async () => {
    setIsSimulating(true);
    setSimulationResult(null);

    try {
      const serialized = serializeWorkflow(nodes, edges);
      const result = await simulateWorkflowAPI(serialized);
      setSimulationResult(result);
    } catch (error) {
      setSimulationResult({
        success: false,
        steps: [],
        errors: ['Simulation failed: Could not connect to API. Make sure JSON Server is running on port 4000.'],
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleExportJSON = () => {
    const json = exportWorkflowAsJSON(nodes, edges);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const jsonPreview = exportWorkflowAsJSON(nodes, edges);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Play className="w-4 h-4" />
          Test Workflow
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Workflow Simulation
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="simulation" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="simulation">Simulation</TabsTrigger>
            <TabsTrigger value="json">JSON Export</TabsTrigger>
          </TabsList>

          <TabsContent value="simulation" className="flex-1 flex flex-col gap-4">
            <div className="flex gap-2">
              <Button onClick={handleSimulate} disabled={isSimulating}>
                {isSimulating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Run Simulation
              </Button>
            </div>

            <ScrollArea className="flex-1 border rounded-lg p-4 bg-muted/30">
              {!simulationResult && !isSimulating && (
                <div className="text-center text-muted-foreground py-8">
                  <p>Click "Run Simulation" to test your workflow.</p>
                </div>
              )}

              {isSimulating && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-2">Simulating workflow...</span>
                </div>
              )}

              {simulationResult && (
                <div className="space-y-4">
                  {/* Status Header */}
                  <div
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-lg',
                      simulationResult.success
                        ? 'bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))]'
                        : 'bg-destructive/10 text-destructive'
                    )}
                  >
                    {simulationResult.success ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    <span className="font-medium">
                      {simulationResult.success ? 'Simulation Successful' : 'Validation Failed'}
                    </span>
                  </div>

                  {/* Errors */}
                  {simulationResult.errors.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-destructive">Errors:</h4>
                      <ul className="space-y-1">
                        {simulationResult.errors.map((error, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-destructive"
                          >
                            <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Execution Steps */}
                  {simulationResult.steps.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Execution Log:</h4>
                      <div className="space-y-1 font-mono text-sm">
                        {simulationResult.steps.map((step, index) => (
                          <div
                            key={index}
                            className="p-2 bg-card rounded border border-border animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="json" className="flex-1 flex flex-col gap-4">
            <Button variant="outline" onClick={handleExportJSON} className="w-fit">
              <FileJson className="w-4 h-4 mr-2" />
              Download JSON
            </Button>

            <ScrollArea className="flex-1 border rounded-lg bg-muted/30">
              <pre className="p-4 text-xs font-mono overflow-x-auto">{jsonPreview}</pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};