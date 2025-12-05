import { Node, Edge } from 'reactflow';
import { WorkflowNodeData, SerializedWorkflow } from '@/types/workflow';

/**
 * Serialize the workflow into a JSON-compatible structure
 */
export const serializeWorkflow = (
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): SerializedWorkflow => {
  return {
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    })) as Node<WorkflowNodeData>[],
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
    })),
  };
};

/**
 * Generate a readable execution path from workflow
 */
export const generateExecutionPath = (
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): string[] => {
  const steps: string[] = [];
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  
  // Find start node
  const startNode = nodes.find((n) => n.type === 'start');
  if (!startNode) return ['No start node found'];

  const visited = new Set<string>();
  const queue = [startNode.id];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const currentNode = nodeMap.get(currentId);
    if (!currentNode) continue;

    // Add step description
    const stepDesc = getNodeDescription(currentNode);
    steps.push(stepDesc);

    // Find next nodes
    const outgoingEdges = edges.filter((e) => e.source === currentId);
    outgoingEdges.forEach((edge) => {
      if (!visited.has(edge.target)) {
        queue.push(edge.target);
      }
    });
  }

  return steps;
};

/**
 * Get a human-readable description for a node
 */
const getNodeDescription = (node: Node<WorkflowNodeData>): string => {
  const data = node.data;
  
  switch (node.type) {
    case 'start':
      return `▶ START: ${'title' in data ? data.title : 'Workflow begins'}`;
    case 'task':
      if ('title' in data && 'assignee' in data) {
        return `📋 TASK: ${data.title}${data.assignee ? ` (Assigned to: ${data.assignee})` : ''}`;
      }
      return `📋 TASK: ${node.id}`;
    case 'approval':
      if ('title' in data && 'approverRole' in data) {
        return `✅ APPROVAL: ${data.title}${data.approverRole ? ` (Approver: ${data.approverRole})` : ''}`;
      }
      return `✅ APPROVAL: ${node.id}`;
    case 'automated':
      if ('title' in data && 'actionId' in data) {
        return `⚡ AUTOMATED: ${data.title}${data.actionId ? ` (Action: ${data.actionId})` : ''}`;
      }
      return `⚡ AUTOMATED: ${node.id}`;
    case 'end':
      if ('endMessage' in data) {
        return `⏹ END: ${data.endMessage}`;
      }
      return `⏹ END: Workflow complete`;
    default:
      return `❓ UNKNOWN: ${node.id}`;
  }
};

/**
 * Export workflow as JSON string
 */
export const exportWorkflowAsJSON = (
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): string => {
  const serialized = serializeWorkflow(nodes, edges);
  return JSON.stringify(serialized, null, 2);
};

/**
 * Import workflow from JSON string
 */
export const importWorkflowFromJSON = (
  jsonString: string
): SerializedWorkflow | null => {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.nodes && Array.isArray(parsed.nodes) && 
        parsed.edges && Array.isArray(parsed.edges)) {
      return parsed as SerializedWorkflow;
    }
    return null;
  } catch {
    return null;
  }
};
