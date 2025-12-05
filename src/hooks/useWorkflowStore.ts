import { create } from 'zustand';
import {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
} from 'reactflow';
import { WorkflowNodeData, NodeType, AutomationAction } from '@/types/workflow';

// Default node data factories
const createDefaultNodeData = (type: NodeType): WorkflowNodeData => {
  switch (type) {
    case 'start':
      return { label: 'Start', title: 'Workflow Start', metadata: {} };
    case 'task':
      return {
        label: 'Task',
        title: 'New Task',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: {},
      };
    case 'approval':
      return {
        label: 'Approval',
        title: 'Approval Required',
        approverRole: '',
        autoApproveThreshold: 0,
      };
    case 'automated':
      return {
        label: 'Automated Step',
        title: 'Automated Action',
        actionId: '',
        actionParams: {},
      };
    case 'end':
      return { label: 'End', endMessage: 'Workflow completed', showSummary: false };
  }
};

interface WorkflowState {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  automationActions: AutomationAction[];
  
  // Node operations
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  
  // Selection
  setSelectedNodeId: (nodeId: string | null) => void;
  
  // Automation actions
  setAutomationActions: (actions: AutomationAction[]) => void;
  
  // Workflow operations
  clearWorkflow: () => void;
  getSerializedWorkflow: () => { nodes: Node<WorkflowNodeData>[]; edges: Edge[] };
}

let nodeIdCounter = 0;

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  automationActions: [],

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection: Connection) => {
    set({ edges: addEdge({ ...connection, animated: true }, get().edges) });
  },

  addNode: (type: NodeType, position: { x: number; y: number }) => {
    const id = `${type}-${++nodeIdCounter}`;
    const newNode: Node<WorkflowNodeData> = {
      id,
      type,
      position,
      data: createDefaultNodeData(type),
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      ),
    });
  },

  deleteNode: (nodeId: string) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    });
  },

  deleteEdge: (edgeId: string) => {
    set({ edges: get().edges.filter((edge) => edge.id !== edgeId) });
  },

  setSelectedNodeId: (nodeId: string | null) => {
    set({ selectedNodeId: nodeId });
  },

  setAutomationActions: (actions: AutomationAction[]) => {
    set({ automationActions: actions });
  },

  clearWorkflow: () => {
    set({ nodes: [], edges: [], selectedNodeId: null });
  },

  getSerializedWorkflow: () => {
    return { nodes: get().nodes, edges: get().edges };
  },
}));
