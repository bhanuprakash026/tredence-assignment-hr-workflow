import { Node, Edge } from 'reactflow';

// Node type identifiers
export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

// Base node data structure
export interface BaseNodeData {
  label: string;
}

// Start Node
export interface StartNodeData extends BaseNodeData {
  title: string;
  metadata: Record<string, string>;
}

// Task Node
export interface TaskNodeData extends BaseNodeData {
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: Record<string, string>;
}

// Approval Node
export interface ApprovalNodeData extends BaseNodeData {
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
}

// Automated Step Node
export interface AutomatedStepNodeData extends BaseNodeData {
  title: string;
  actionId: string;
  actionParams: Record<string, string>;
}

// End Node
export interface EndNodeData extends BaseNodeData {
  endMessage: string;
  showSummary: boolean;
}

// Union type for all node data
export type WorkflowNodeData = 
  | StartNodeData 
  | TaskNodeData 
  | ApprovalNodeData 
  | AutomatedStepNodeData 
  | EndNodeData;

// Typed workflow node
export type WorkflowNode = Node<WorkflowNodeData>;

// Workflow edge
export type WorkflowEdge = Edge;

// Automation action from API
export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

// Simulation result
export interface SimulationResult {
  success: boolean;
  steps: string[];
  errors: string[];
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Serialized workflow for API
export interface SerializedWorkflow {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}
