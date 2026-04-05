import { useEffect, useRef } from "react";
import { Node, Edge } from "@xyflow/react";

export function usePolygonBus(
  nodes: Node[],
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
) {
  const activeStreams = useRef<Map<string, EventSource>>(new Map());

  useEffect(() => {
    const handleStreamEvent = (e: Event) => {
      const ce = e as CustomEvent;
      const { payload, pubkey } = ce.detail;

      const targetNode = nodes.find((n) => n.data.operatorPubkey === pubkey || n.data.pubkey === pubkey);
      if (!targetNode) return;

      const nodeId = targetNode.id;

      try {
        if (payload.text && payload.text.includes("[POLYGON_METRIC]")) {
          const metricStr = payload.text.split("[POLYGON_METRIC]")[1].trim();
          const metric = JSON.parse(metricStr);

          if (metric.step === "INFERENCE_DONE" || metric.step === "VALIDATION_DONE") {
            setNodes((nds) =>
              nds.map((n) =>
                n.id === nodeId
                  ? {
                      ...n,
                      data: {
                        ...n.data,
                        status: "success",
                        workerHash: metric.workerHash || n.data.workerHash,
                        validatorHash: metric.validatorHash || n.data.validatorHash,
                        vote: metric.vote || n.data.vote,
                        workerVerdict: metric.workerVerdict || n.data.workerVerdict,
                        workerReasoning: metric.workerReasoning || n.data.workerReasoning,
                      },
                    }
                  : n
              )
            );
            setEdges((eds) =>
              eds.map((e) => (e.source === nodeId ? { ...e, style: { stroke: "#10D9B0", strokeWidth: 2 } } : e))
            );
          } else if (metric.step === "IPFS_UPLOAD") {
            setNodes((nds) =>
              nds.map((n) =>
                n.id === nodeId ? { ...n, data: { ...n.data, status: "uploading", traceHash: metric.cid } } : n
              )
            );
          }
        } else if (payload.text && payload.text.includes("No such container")) {
          setNodes((nds) =>
            nds.map((n) =>
              n.id === nodeId
                ? {
                    ...n,
                    data: { ...n.data, status: "idle", pubkey: undefined, operatorPubkey: undefined },
                  }
                : n
            )
          );
        }
      } catch (err) {}
    };

    window.addEventListener("polygon_stream_event", handleStreamEvent);
    return () => {
      window.removeEventListener("polygon_stream_event", handleStreamEvent);
    };
  }, [nodes, setNodes, setEdges]);
}
