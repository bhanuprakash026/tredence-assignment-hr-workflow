import { AutomationAction, SimulationResult, SerializedWorkflow } from '@/types/workflow';
import { validateWorkflow } from '@/utils/validators';
import { generateExecutionPath } from '@/utils/serializers';

// Simulated network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock automation actions database
 */
const automationActions: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'slack_notify', label: 'Slack Notification', params: ['channel', 'message'] },
  { id: 'create_ticket', label: 'Create Support Ticket', params: ['title', 'priority', 'assignee'] },
  { id: 'update_crm', label: 'Update CRM Record', params: ['recordId', 'field', 'value'] },
  { id: 'schedule_meeting', label: 'Schedule Meeting', params: ['attendees', 'duration', 'subject'] },
  { id: 'webhook_call', label: 'Call Webhook', params: ['url', 'method', 'payload'] },
  { id: 'data_transform', label: 'Transform Data', params: ['source', 'transformation'] },
];

/**
 * GET /automations - Fetch available automation actions
 */
export const fetchAutomationActions = async (): Promise<AutomationAction[]> => {
  await delay(300); // Simulate network latency
  return automationActions;
};

/**
 * POST /simulate - Simulate workflow execution
 */
export const simulateWorkflow = async (
  workflow: SerializedWorkflow
): Promise<SimulationResult> => {
  await delay(500); // Simulate processing time

  // Validate the workflow first
  const validation = validateWorkflow(workflow.nodes, workflow.edges);

  if (!validation.isValid) {
    return {
      success: false,
      steps: [],
      errors: validation.errors,
    };
  }

  // Generate execution steps
  const steps = generateExecutionPath(workflow.nodes, workflow.edges);

  // Add simulation timestamps
  const timestampedSteps = steps.map((step, index) => {
    const simulatedTime = new Date(Date.now() + index * 1000).toISOString();
    return `[${simulatedTime.split('T')[1].split('.')[0]}] ${step}`;
  });

  return {
    success: true,
    steps: timestampedSteps,
    errors: [],
  };
};

/**
 * Get action by ID
 */
export const getAutomationAction = (actionId: string): AutomationAction | undefined => {
  return automationActions.find((action) => action.id === actionId);
};
