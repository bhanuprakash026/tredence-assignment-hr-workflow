import React, { useState } from 'react';
import { StartNodeData } from '@/types/workflow';
import { useWorkflowStore } from '@/hooks/useWorkflowStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface StartNodeFormProps {
  nodeId: string;
  data: StartNodeData;
}

export const StartNodeForm: React.FC<StartNodeFormProps> = ({ nodeId, data }) => {
  const { updateNodeData } = useWorkflowStore();
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAddMetadata = () => {
    if (newKey.trim()) {
      updateNodeData(nodeId, {
        metadata: { ...data.metadata, [newKey]: newValue },
      });
      setNewKey('');
      setNewValue('');
    }
  };

  const handleRemoveMetadata = (key: string) => {
    const newMetadata = { ...data.metadata };
    delete newMetadata[key];
    updateNodeData(nodeId, { metadata: newMetadata });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Start Title</Label>
        <Input
          id="title"
          value={data.title || ''}
          onChange={(e) => updateNodeData(nodeId, { title: e.target.value })}
          placeholder="Enter workflow start title"
        />
      </div>

      <div className="space-y-2">
        <Label>Metadata (Key-Value Pairs)</Label>
        <div className="space-y-2">
          {Object.entries(data.metadata || {}).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <Input value={key} disabled className="flex-1 bg-muted" />
              <Input
                value={value}
                onChange={(e) =>
                  updateNodeData(nodeId, {
                    metadata: { ...data.metadata, [key]: e.target.value },
                  })
                }
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveMetadata(key)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="Key"
            className="flex-1"
          />
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Value"
            className="flex-1"
          />
          <Button variant="outline" size="icon" onClick={handleAddMetadata}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
