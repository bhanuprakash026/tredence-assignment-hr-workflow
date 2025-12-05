# HR Workflow Designer

A visual workflow builder for designing and simulating HR processes using React Flow.

## How to Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) to view the application.

## Architecture Overview

```
src/
├── api/                    # Mock API layer
│   └── mockApi.ts          # Simulated backend endpoints
├── components/
│   ├── Canvas/             # React Flow canvas wrapper
│   ├── Nodes/              # Custom node components
│   ├── NodeForms/          # Configuration forms for each node type
│   ├── Sidebar/            # Node palette for drag-and-drop
│   └── SimulationPanel/    # Workflow testing and export
├── hooks/
│   └── useWorkflowStore.ts # Zustand state management
├── types/
│   └── workflow.ts         # TypeScript type definitions
├── utils/
│   ├── validators.ts       # Workflow validation logic
│   └── serializers.ts      # JSON serialization utilities
└── pages/
    └── Index.tsx           # Main application page
```

## Components Overview

### Node Types
- **StartNode**: Entry point for the workflow (green)
- **TaskNode**: Manual task with assignee and due date (blue)
- **ApprovalNode**: Approval step with role and threshold (orange)
- **AutomatedStepNode**: Automated action with configurable params (purple)
- **EndNode**: Workflow termination point (red)

### Key Features
1. **Drag-and-Drop Canvas**: Build workflows visually by dragging nodes from the sidebar
2. **Dynamic Forms**: Each node type has a tailored configuration form
3. **Real-time Updates**: Changes in forms instantly update the canvas
4. **Workflow Validation**: Checks for isolated nodes, missing start/end, unreachable paths
5. **Simulation**: Mock execution with step-by-step logging
6. **JSON Export**: Download workflow as JSON for external processing

## Node System

Each node extends a `BaseNode` component that provides:
- Consistent styling with color-coded headers
- Source/target handles for connections
- Delete functionality on hover
- Selection state management

Node data is managed via Zustand store with type-safe updates.

## Assumptions

1. Workflows are DAGs (Directed Acyclic Graphs) - cycles are not supported
2. Only one Start node is allowed per workflow
3. Multiple End nodes are permitted for different termination paths
4. Automated actions are fetched from a mock API
5. All form validation is client-side only

## Future Improvements

1. **Persistence**: Save/load workflows from localStorage or backend
2. **Undo/Redo**: History management for canvas operations
3. **Conditional Branching**: Add decision nodes with multiple outputs
4. **Real API Integration**: Replace mocks with actual backend
5. **Collaboration**: Real-time multi-user editing
6. **Templates**: Pre-built workflow templates for common HR processes
7. **Mobile Support**: Touch-friendly canvas interactions
8. **Advanced Validation**: Cycle detection, path analysis
9. **Execution Engine**: Actually run workflows with real actions
10. **Analytics**: Track workflow performance metrics
