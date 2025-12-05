import React, { useState } from 'react';
import { TaskNodeData } from '@/types/workflow';
import { useWorkflowStore } from '@/hooks/useWorkflowStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface TaskNodeFormProps {
  nodeId: string;
  data: TaskNodeData;
}

export const TaskNodeForm: React.FC<TaskNodeFormProps> = ({ nodeId, data }) => {
  const { updateNodeData } = useWorkflowStore();
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAddCustomField = () => {
    if (newKey.trim()) {
      updateNodeData(nodeId, {
        customFields: { ...data.customFields, [newKey]: newValue },
      });
      setNewKey('');
      setNewValue('');
    }
  };

  const handleRemoveCustomField = (key: string) => {
    const newFields = { ...data.customFields };
    delete newFields[key];
    updateNodeData(nodeId, { customFields: newFields });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          value={data.title || ''}
          onChange={(e) => updateNodeData(nodeId, { title: e.target.value })}
          placeholder="Enter task title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={data.description || ''}
          onChange={(e) => updateNodeData(nodeId, { description: e.target.value })}
          placeholder="Describe this task..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignee">Assignee</Label>
        <Input
          id="assignee"
          value={data.assignee || ''}
          onChange={(e) => updateNodeData(nodeId, { assignee: e.target.value })}
          placeholder="Enter assignee name or email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={data.dueDate || ''}
          onChange={(e) => updateNodeData(nodeId, { dueDate: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Custom Fields</Label>
        <div className="space-y-2">
          {Object.entries(data.customFields || {}).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <Input value={key} disabled className="flex-1 bg-muted" />
              <Input
                value={value}
                onChange={(e) =>
                  updateNodeData(nodeId, {
                    customFields: { ...data.customFields, [key]: e.target.value },
                  })
                }
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveCustomField(key)}
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
            placeholder="Field name"
            className="flex-1"
          />
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Field value"
            className="flex-1"
          />
          <Button variant="outline" size="icon" onClick={handleAddCustomField}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
