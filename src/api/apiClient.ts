import { AutomationAction, SerializedWorkflow, SimulationResult } from '@/types/workflow';

const API_BASE_URL = 'http://localhost:4000';

/**
 * Fetch automation actions from JSON Server
 * GET /automations
 */
export const fetchAutomationsFromAPI = async (): Promise<AutomationAction[]> => {
  const response = await fetch(`${API_BASE_URL}/automations`);
  if (!response.ok) {
    throw new Error('Failed to fetch automations');
  }
  return response.json();
};

/**
 * Simulate workflow execution via JSON Server
 * POST /simulate
 */
export const simulateWorkflowAPI = async (
  workflow: SerializedWorkflow
): Promise<SimulationResult> => {
  const response = await fetch(`${API_BASE_URL}/simulate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workflow),
  });
  
  if (!response.ok) {
    throw new Error('Failed to simulate workflow');
  }
  
  return response.json();
};