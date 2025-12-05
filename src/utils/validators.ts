import { Node, Edge } from 'reactflow';
import { WorkflowNodeData, ValidationResult } from '@/types/workflow';

/**
 * Validates the workflow structure
 * Checks for:
 * - Presence of start node
 * - Presence of end node
 * - No isolated nodes
 * - No cycles (optional)
 * - Start node must be first (no incoming edges)
 * - End node must be last (no outgoing edges)
 */
export const validateWorkflow = (
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): ValidationResult => {
  const errors: string[] = [];

  // Check for empty workflow
  if (nodes.length === 0) {
    return { isValid: false, errors: ['Workflow is empty. Add at least one node.'] };
  }

  // Find start and end nodes
  const startNodes = nodes.filter((node) => node.type === 'start');
  const endNodes = nodes.filter((node) => node.type === 'end');

  // Check for start node
  if (startNodes.length === 0) {
    errors.push('Workflow must have a Start node.');
  } else if (startNodes.length > 1) {
    errors.push('Workflow can only have one Start node.');
  }

  // Check for end node
  if (endNodes.length === 0) {
    errors.push('Workflow must have an End node.');
  }

  // Check that start node has no incoming edges
  if (startNodes.length === 1) {
    const startNode = startNodes[0];
    const hasIncomingEdges = edges.some((edge) => edge.target === startNode.id);
    if (hasIncomingEdges) {
      errors.push('Start node cannot have incoming connections.');
    }
  }

  // Check that end nodes have no outgoing edges
  endNodes.forEach((endNode) => {
    const hasOutgoingEdges = edges.some((edge) => edge.source === endNode.id);
    if (hasOutgoingEdges) {
      errors.push(`End node "${endNode.id}" cannot have outgoing connections.`);
    }
  });

  // Check for isolated nodes (nodes without any connections)
  const connectedNodeIds = new Set<string>();
  edges.forEach((edge) => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });

  const isolatedNodes = nodes.filter(
    (node) => !connectedNodeIds.has(node.id) && nodes.length > 1
  );
  
  if (isolatedNodes.length > 0) {
    const nodeLabels = isolatedNodes.map((n) => n.data.label || n.id).join(', ');
    errors.push(`Isolated nodes detected: ${nodeLabels}. Connect them to the workflow.`);
  }

  // Check for reachability from start node
  if (startNodes.length === 1 && nodes.length > 1) {
    const reachable = getReachableNodes(startNodes[0].id, edges);
    const unreachableNodes = nodes.filter(
      (node) => node.type !== 'start' && !reachable.has(node.id)
    );
    
    if (unreachableNodes.length > 0) {
      const nodeLabels = unreachableNodes.map((n) => n.data.label || n.id).join(', ');
      errors.push(`Unreachable nodes from Start: ${nodeLabels}.`);
    }
  }

  // Validate node-specific data
  nodes.forEach((node) => {
    const nodeErrors = validateNodeData(node);
    errors.push(...nodeErrors);
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get all nodes reachable from a given node via edges
 */
const getReachableNodes = (startId: string, edges: Edge[]): Set<string> => {
  const reachable = new Set<string>();
  const queue = [startId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    edges.forEach((edge) => {
      if (edge.source === current && !reachable.has(edge.target)) {
        reachable.add(edge.target);
        queue.push(edge.target);
      }
    });
  }

  return reachable;
};

/**
 * Validate individual node data
 */
const validateNodeData = (node: Node<WorkflowNodeData>): string[] => {
  const errors: string[] = [];
  const data = node.data;

  switch (node.type) {
    case 'task':
      if (!('title' in data) || !data.title?.trim()) {
        errors.push(`Task node "${node.id}" requires a title.`);
      }
      break;
    case 'approval':
      if (!('title' in data) || !data.title?.trim()) {
        errors.push(`Approval node "${node.id}" requires a title.`);
      }
      break;
    case 'automated':
      if (!('actionId' in data) || !data.actionId) {
        errors.push(`Automated step "${node.id}" requires an action to be selected.`);
      }
      break;
    default:
      break;
  }

  return errors;
};

/**
 * Check if workflow has any cycles
 */
export const hasCycle = (nodes: Node[], edges: Edge[]): boolean => {
  const adjacencyList = new Map<string, string[]>();
  nodes.forEach((node) => adjacencyList.set(node.id, []));
  edges.forEach((edge) => {
    const neighbors = adjacencyList.get(edge.source) || [];
    neighbors.push(edge.target);
    adjacencyList.set(edge.source, neighbors);
  });

  const visited = new Set<string>();
  const recStack = new Set<string>();

  const dfs = (nodeId: string): boolean => {
    visited.add(nodeId);
    recStack.add(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recStack.has(neighbor)) {
        return true;
      }
    }

    recStack.delete(nodeId);
    return false;
  };

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true;
    }
  }

  return false;
};
