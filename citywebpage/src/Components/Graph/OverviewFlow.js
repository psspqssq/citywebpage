import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState
} from 'reactflow';

import { nodes as initialNodes, edges as initialEdges } from './initial-elements';
import CustomNode from './CustomNode';

import 'reactflow/dist/style.css';
import './overview.css';

const nodeTypes = {
  custom: CustomNode,
};

const minimapStyle = {
  height: 120,
};
var baseUrl = "https://localhost:7166/cycles/latest";

const onInit = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance);

const OverviewFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [debugState, setDebugState] = useState();
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
  useEffect(() => {
    const interval = setInterval(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(baseUrl); // Replace with your API endpoint
          const data = response.data[1];
          const newEdges = data.routes.map(item=>{
            return {
              source: `${parseInt(item.from)}`,
              target: `${parseInt(item.to)}`,
              animated: true
            }
          });
          setEdges(newEdges);
          setDebugState(newEdges);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }, 5000);

  //Clearing the interval
  return () => clearInterval(interval);
    
  }, [baseUrl]);

  // we are using a bit of a shortcut here to adjust the edge type
  // this could also be done with a custom edge for example
  const edgesWithUpdatedTypes = edges.map((edge) => {
    if (edge.sourceHandle) {
      const edgeType = nodes.find((node) => node.type === 'custom').data.selects[edge.sourceHandle];
      edge.type = edgeType;
    }
    return edge;
  });

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={onInit}
      fitView
      attributionPosition="top-right"
      nodeTypes={nodeTypes}
    >
      <MiniMap style={minimapStyle} zoomable pannable />
      <Controls />
      <Background color="#aaa" gap={16} />
      {console.log(edges)}
    </ReactFlow>
  );
};

export default OverviewFlow;
