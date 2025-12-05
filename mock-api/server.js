const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom GET /automations endpoint
server.get('/automations', (req, res) => {
  const automations = [
    { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
    { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] }
  ];
  res.json(automations);
});
server.post('/simulate', (req, res) => {
  const workflow = req.body;

  if (!workflow || !workflow.nodes || !workflow.edges) {
    return res.status(400).json({
      success: false,
      steps: [],
      errors: ['Invalid workflow structure: missing nodes or edges']
    });
  }

  const { nodes, edges } = workflow;

  // Validation
  const errors = [];
  const startNodes = nodes.filter(n => n.type === 'start');
  const endNodes = nodes.filter(n => n.type === 'end');

  if (startNodes.length === 0) {
    errors.push('Workflow must have a Start node');
  }
  if (startNodes.length > 1) {
    errors.push('Workflow can only have one Start node');
  }
  if (endNodes.length === 0) {
    errors.push('Workflow must have an End node');
  }

  // Check for isolated nodes
  const connectedNodeIds = new Set();
  edges.forEach(edge => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });

  if (nodes.length > 1) {
    nodes.forEach(node => {
      if (!connectedNodeIds.has(node.id)) {
        errors.push(`Node "${node.data?.title || node.id}" is not connected`);
      }
    });
  }

  if (errors.length > 0) {
    return res.json({
      success: false,
      steps: [],
      errors
    });
  }

  // Generate execution path
  const steps = [];
  const visited = new Set();
  const adjacencyMap = new Map();

  edges.forEach(edge => {
    if (!adjacencyMap.has(edge.source)) {
      adjacencyMap.set(edge.source, []);
    }
    adjacencyMap.get(edge.source).push(edge.target);
  });

  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  // Find start node and traverse
  const startNode = startNodes[0];
  const queue = [startNode.id];

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const node = nodeMap.get(currentId);
    if (!node) continue;

    const timestamp = new Date(Date.now() + steps.length * 1000).toISOString();
    const time = timestamp.split('T')[1].split('.')[0];

    let stepDescription = '';
    switch (node.type) {
      case 'start':
        stepDescription = `[${time}] Start: ${node.data?.title || 'Workflow Started'}`;
        break;
      case 'task':
        stepDescription = `[${time}] Task: ${node.data?.title || 'Untitled Task'}`;
        if (node.data?.assignee) {
          stepDescription += ` (Assignee: ${node.data.assignee})`;
        }
        break;
      case 'approval':
        stepDescription = `[${time}] Approval: ${node.data?.title || 'Approval Required'}`;
        if (node.data?.approverRole) {
          stepDescription += ` (Role: ${node.data.approverRole})`;
        }
        break;
      case 'automated':
        stepDescription = `[${time}] Automated: ${node.data?.title || 'Automated Step'}`;
        if (node.data?.actionId) {
          stepDescription += ` (Action: ${node.data.actionId})`;
        }
        break;
      case 'end':
        stepDescription = `[${time}] End: ${node.data?.endMessage || 'Workflow Complete'}`;
        break;
      default:
        stepDescription = `[${time}] ${node.type}: ${node.data?.title || 'Unknown'}`;
    }

    steps.push(stepDescription);

    const nextNodes = adjacencyMap.get(currentId) || [];
    nextNodes.forEach(nextId => {
      if (!visited.has(nextId)) {
        queue.push(nextId);
      }
    });
  }

  res.json({
    success: true,
    steps,
    errors: []
  });
});

server.use(router);

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  /automations');
  console.log('  POST /simulate');
});
