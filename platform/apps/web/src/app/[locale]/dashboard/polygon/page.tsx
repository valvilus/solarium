"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect, useRef } from "react";
import { Play } from "@phosphor-icons/react";
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  useNodesState,
  useEdgesState,
  Edge,
  Node,
  addEdge,
  Connection,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { DAppTriggerNode } from "@/components/polygon/nodes/DAppTriggerNode";
import { AgentNode } from "@/components/polygon/nodes/AgentNode";
import { ConsensusNode } from "@/components/polygon/nodes/ConsensusNode";
import { UserInputNode } from "@/components/polygon/nodes/UserInputNode";
import { DeveloperConfigNode } from "@/components/polygon/nodes/DeveloperConfigNode";
import { IPFSAssemblerNode } from "@/components/polygon/nodes/IPFSAssemblerNode";
import { EscrowNode } from "@/components/polygon/nodes/EscrowNode";
import { DisputeNode } from "@/components/polygon/nodes/DisputeNode";

import { NodePalette } from "@/components/polygon/NodePalette";
import { usePolygonBus } from "@/hooks/usePolygonBus";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useNetwork } from "@/providers/wallet-provider";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import { SolariumClient, TaskType, NodeType } from "@solarium-labs/sdk";
import { toast } from "sonner";
import bs58 from "bs58";

const nodeTypes = {
  userInput: UserInputNode,
  devConfig: DeveloperConfigNode,
  ipfsManifest: IPFSAssemblerNode,
  escrow: EscrowNode,
  worker: AgentNode,
  validator: AgentNode,
  dispute: DisputeNode,
  dapp: DAppTriggerNode,
  agent: AgentNode,
  consensus: ConsensusNode,
};

let idCounter = 1;
const getId = () => `v2_${idCounter++}`;

const initialNodes: Node[] = [
  { id: "n-dev", type: "devConfig", position: { x: 50, y: 100 }, data: { label: "1. Developer Config" } },
  { id: "n-user", type: "userInput", position: { x: 50, y: 400 }, data: { label: "2. User Input (DApp)" } },
  {
    id: "n-ipfs",
    type: "ipfsManifest",
    position: { x: 400, y: 250 },
    data: { label: "3. IPFS Off-chain Upload", status: "idle" },
  },
  {
    id: "n-escrow",
    type: "escrow",
    position: { x: 750, y: 250 },
    data: { label: "4. Escrow (CreateTask)", status: "idle" },
  },

  {
    id: "n-worker",
    type: "worker",
    position: { x: 1150, y: 100 },
    data: { label: "5a. Worker Engine", role: "worker", status: "idle" },
  },

  {
    id: "v-spawned-0",
    type: "validator",
    position: { x: 1150, y: 350 },
    data: { label: "Validator Node 1", role: "validator", status: "idle" },
  },
  {
    id: "v-spawned-1",
    type: "validator",
    position: { x: 1150, y: 470 },
    data: { label: "Validator Node 2", role: "validator", status: "idle" },
  },
  {
    id: "v-spawned-2",
    type: "validator",
    position: { x: 1150, y: 590 },
    data: { label: "Validator Node 3", role: "validator", status: "idle" },
  },

  {
    id: "n-consensus",
    type: "consensus",
    position: { x: 1550, y: 350 },
    data: { label: "6. Finalize (Smart Contract)", verdict: "pending" },
  },
];

const initialEdges: Edge[] = [
  { id: "e-d-ipfs", source: "n-dev", target: "n-ipfs", style: { stroke: "#555" }, animated: true },
  { id: "e-u-ipfs", source: "n-user", target: "n-ipfs", style: { stroke: "#555" }, animated: true },

  { id: "e-ipfs-es", source: "n-ipfs", target: "n-escrow", style: { stroke: "#555" }, animated: true },

  { id: "e-es-w", source: "n-escrow", target: "n-worker", style: { stroke: "#555" }, animated: true },
  { id: "e-es-v0", source: "n-escrow", target: "v-spawned-0", style: { stroke: "#555" }, animated: true },
  { id: "e-es-v1", source: "n-escrow", target: "v-spawned-1", style: { stroke: "#555" }, animated: true },
  { id: "e-es-v2", source: "n-escrow", target: "v-spawned-2", style: { stroke: "#555" }, animated: true },

  { id: "e-w-cons", source: "n-worker", target: "n-consensus", style: { stroke: "#555" }, animated: true },
  { id: "e-v0-cons", source: "v-spawned-0", target: "n-consensus", style: { stroke: "#555" }, animated: true },
  { id: "e-v1-cons", source: "v-spawned-1", target: "n-consensus", style: { stroke: "#555" }, animated: true },
  { id: "e-v2-cons", source: "v-spawned-2", target: "n-consensus", style: { stroke: "#555" }, animated: true },
];

function PolygonCanvas() {
  const t = useTranslations("Polygon");
  const { connection } = useConnection();
  const { network } = useNetwork();
  const wallet = useWallet();
  const { screenToFlowPosition } = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const [tabs, setTabs] = useState<{ id: string; name: string }[]>([{ id: "tab-1", name: "Virtual Chain 1" }]);
  const [activeTab, setActiveTab] = useState("tab-1");
  const [isLoaded, setIsLoaded] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [menu, setMenu] = useState<{ id: string; top: number; left: number } | null>(null);

  useEffect(() => {
    const storedTabs = localStorage.getItem("polygon_tabs");
    const storedActive = localStorage.getItem("polygon_active_tab");
    let currentActive = "tab-1";

    if (storedTabs) setTabs(JSON.parse(storedTabs));
    if (storedActive) {
      currentActive = storedActive;
      setActiveTab(currentActive);
    }

    const storedGraph = localStorage.getItem(`polygon_graph_${currentActive}`);
    if (storedGraph) {
      const { nodes: savedNodes, edges: savedEdges } = JSON.parse(storedGraph);
      setNodes(savedNodes?.length ? savedNodes : initialNodes);
      setEdges(savedEdges?.length ? savedEdges : initialEdges);
    } else {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }

    setIsLoaded(true);
  }, [setNodes, setEdges]);

  useEffect(() => {
    if (!isLoaded) return;
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === "n-user") {
          return {
            ...n,
            data: {
              ...n.data,
              onPromptChange: (val: string) => {
                setNodes((prev) =>
                  prev.map((pn) => (pn.id === "n-user" ? { ...pn, data: { ...pn.data, prompt: val } } : pn))
                );
              },
            },
          };
        }
        return n;
      })
    );
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;

    const restoreRunningContainers = async () => {
      try {
        const res = await fetch("/api/nodes/running");
        if (!res.ok) return;
        const { containers } = (await res.json()) as {
          containers: { role: string; operatorPubkey: string; containerName: string }[];
        };
        if (!containers.length) return;

        const workers = containers.filter((c) => c.role === "worker");
        const validators = containers.filter((c) => c.role === "validator");

        setNodes((nds) => {
          const workerNodes = nds.filter((n) => n.type === "worker" || n.data.role === "worker");
          const validatorNodes = nds.filter((n) => n.type === "validator" || n.data.role === "validator");

          return nds.map((n) => {
            const workerIdx = workerNodes.findIndex((w) => w.id === n.id);
            if (workerIdx !== -1 && workers[workerIdx]) {
              return {
                ...n,
                data: { ...n.data, status: "running", operatorPubkey: workers[workerIdx].operatorPubkey },
              };
            }
            const valIdx = validatorNodes.findIndex((v) => v.id === n.id);
            if (valIdx !== -1 && validators[valIdx]) {
              return {
                ...n,
                data: { ...n.data, status: "running", operatorPubkey: validators[valIdx].operatorPubkey },
              };
            }
            return n;
          });
        });
      } catch {}
    };

    restoreRunningContainers();
  }, [isLoaded, setNodes]);

  const sanitizeNodesForStorage = (ns: Node[]): Node[] =>
    ns.map((n) => {
      if (n.type === "worker" || n.type === "validator" || n.type === "agent") {
        return { ...n, data: { ...n.data, status: "idle", pubkey: undefined, operatorPubkey: undefined } };
      }
      return n;
    });

  useEffect(() => {
    if (!isLoaded || nodes.length === 0) return;
    const timeout = setTimeout(() => {
      localStorage.setItem("polygon_tabs", JSON.stringify(tabs));
      localStorage.setItem(
        `polygon_graph_${activeTab}`,
        JSON.stringify({ nodes: sanitizeNodesForStorage(nodes), edges })
      );
    }, 500);
    return () => clearTimeout(timeout);
  }, [nodes, edges, activeTab, tabs, isLoaded]);

  const switchTab = (tabId: string) => {
    localStorage.setItem(
      `polygon_graph_${activeTab}`,
      JSON.stringify({ nodes: sanitizeNodesForStorage(nodes), edges })
    );
    localStorage.setItem("polygon_active_tab", tabId);

    setActiveTab(tabId);
    const storedGraph = localStorage.getItem(`polygon_graph_${tabId}`);
    if (storedGraph) {
      const { nodes: savedNodes, edges: savedEdges } = JSON.parse(storedGraph);
      setNodes(savedNodes?.length ? savedNodes : initialNodes);
      setEdges(savedEdges?.length ? savedEdges : initialEdges);
    } else {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  };

  const addTab = () => {
    const newId = `tab-${Date.now()}`;
    const newTab = { id: newId, name: `Virtual Chain ${tabs.length + 1}` };
    setTabs((prev) => [...prev, newTab]);
    switchTab(newId);
  };

  const closeTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    if (tabs.length === 1) return toast.info("Cannot close the last tab");

    const newTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(newTabs);
    localStorage.removeItem(`polygon_graph_${tabId}`);
    if (activeTab === tabId) {
      switchTab(newTabs[0].id);
    }
  };

  usePolygonBus(nodes, setNodes, setEdges);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      const pane = reactFlowWrapper.current?.getBoundingClientRect();
      if (!pane) return;
      setMenu({
        id: node.id,
        top: event.clientY - pane.top,
        left: event.clientX - pane.left,
      });
    },
    [setMenu]
  );

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  const deleteNode = useCallback(() => {
    if (menu) {
      setNodes((nodes) => nodes.filter((node) => node.id !== menu.id));
      setEdges((edges) => edges.filter((edge) => edge.source !== menu.id && edge.target !== menu.id));
      setMenu(null);
    }
  }, [menu, setNodes, setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const nodeDataStr = event.dataTransfer.getData("application/reactflow");

      if (!nodeDataStr || !reactFlowBounds) return;

      const { type, label } = JSON.parse(nodeDataStr);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `node_${type}_${getId()}`,
        type,
        position,
        data: { label, role: type === "validator" ? "validator" : "worker", status: "idle" },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  const simulateChain = async () => {
    if (nodes.length === 0) {
      toast.error(t("errors.notEnoughNodes"));
      return;
    }

    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          status: n.type === "consensus" ? undefined : "idle",
          verdict: n.type === "consensus" ? "pending" : undefined,
          workerHash: "",
          validatorHash: "",
          workerVerdict: undefined,
          workerReasoning: "",
          transactionSignature: undefined,
        },
      }))
    );

    const tId = toast.loading("Deploying Visual Polygon...");

    setEdges((eds) => eds.map((e) => ({ ...e, style: { stroke: "#555", strokeWidth: 1 }, animated: true })));

    setNodes((nds) =>
      nds.map((n) => (n.type === "ipfsManifest" ? { ...n, data: { ...n.data, status: "uploading" } } : n))
    );

    const devConfigNode = nodes.find((n) => n.type === "devConfig");
    const userInputNode = nodes.find((n) => n.type === "userInput");

    const prompt = userInputNode?.data?.prompt || "Analyze default prompt";
    const sysPrompt = devConfigNode?.data?.sysPrompt || "You are an AI auditor";
    const rewardAmount = parseFloat((devConfigNode?.data?.reward as string) || "1.5");
    const validatorCount = parseInt((devConfigNode?.data?.valCount as string) || "3");

    const manifestPayload = {
      workerPrompt: sysPrompt,
      inputData: { prompt },
      expectedSchema: { verdict: "number", confidence: "number", reasoning: "string" },
    };

    let manifestCid = "local://simulated";
    let hashArray = new Array(32).fill(0);

    try {
      const uploader = await fetch("/api/storage/upload", {
        method: "POST",
        body: JSON.stringify(manifestPayload),
      });
      const upRes = await uploader.json();
      if (upRes.success) {
        manifestCid = upRes.uri;
        hashArray = upRes.hashArray;
      }
    } catch (e) {
      console.warn("Local storage upload skipped");
    }

    setNodes((nds) =>
      nds.map((n) =>
        n.type === "ipfsManifest" ? { ...n, data: { ...n.data, status: "success", hash: manifestCid } } : n
      )
    );

    setEdges((eds) =>
      eds.map((e) =>
        e.target === "n-ipfs" || (e.source === "n-ipfs" && e.target === "n-escrow")
          ? { ...e, style: { stroke: "#10D9B0", strokeWidth: 2 } }
          : e
      )
    );

    setNodes((nds) => nds.map((n) => (n.type === "escrow" ? { ...n, data: { ...n.data, status: "deploying" } } : n)));

    let txSig: string;
    try {
      if (!wallet.publicKey) {
        toast.error("Wallet not connected! Please connect Phantom first.");
        setNodes((nds) => nds.map((n) => (n.type === "escrow" ? { ...n, data: { ...n.data, status: "error" } } : n)));
        return;
      }

      const provider = new AnchorProvider(connection, wallet as any, { preflightCommitment: "confirmed" });
      const client = new SolariumClient(provider);
      const rewardBN = new BN(rewardAmount * LAMPORTS_PER_SOL);

      if (network !== "devnet") {
        try {
          toast.info("Airdropping 10 SOL to your wallet for localnet Escrow testing...");
          const airdropSig = await connection.requestAirdrop(wallet.publicKey, 10 * LAMPORTS_PER_SOL);
          await connection.confirmTransaction(airdropSig, "confirmed");
        } catch (e) {
          console.warn("Airdrop failed (wallet might already have SOL or rate limit hit)", e);
        }
      }

      toast.info("Please accept the Phantom transaction to deploy the Task...");
      const resParams = await client.createTask({
        inputHash: hashArray,
        taskType: TaskType.Analyze,
        tier: 1,
        reward: rewardBN,
        validatorCount,
      });
      txSig = resParams.signature;
    } catch (e: any) {
      console.error("SDK Task Creation Failed:", e);
      toast.error(`Smart Contract Task Creation failed: ${e.message}`);
      setNodes((nds) => nds.map((n) => (n.type === "escrow" ? { ...n, data: { ...n.data, status: "error" } } : n)));
      return;
    }

    setNodes((nds) =>
      nds.map((n) =>
        n.type === "escrow" ? { ...n, data: { ...n.data, status: "success", transactionSignature: txSig } } : n
      )
    );

    setEdges((eds) =>
      eds.map((e) =>
        (e.source === "n-escrow" && e.target.includes("spawned")) || e.target === "n-worker"
          ? { ...e, style: { stroke: "#10D9B0", strokeWidth: 2 } }
          : e
      )
    );

    const tIdClean = toast.loading("Cleaning up old containers...");
    try {
      await fetch("/api/nodes/cleanup", { method: "POST" });
    } catch (e) {
      console.warn("Cleanup step failed (non-fatal):", e);
    }
    toast.dismiss(tIdClean);

    const workerNodes = nodes.filter((n) => n.type === "worker" || n.data.role === "worker");
    const validatorNodes = nodes.filter((n) => n.type === "validator" || n.data.role === "validator");
    const allAgents = [...workerNodes, ...validatorNodes];

    for (const agent of allAgents) {
      setNodes((nds) => nds.map((n) => (n.id === agent.id ? { ...n, data: { ...n.data, status: "spawning" } } : n)));
    }

    const tId2 = toast.loading("Registering nodes on-chain in parallel...");

    const agentConfigs = allAgents.map((agent) => {
      const operatorKp = Keypair.generate();
      const burnerKp = Keypair.generate();
      return {
        agent,
        operatorKp,
        burnerKp,
        operatorKey: operatorKp.publicKey.toBase58(),
        burnerPubKeyStr: burnerKp.publicKey.toBase58(),
        burnerSecretBase58: bs58.encode(burnerKp.secretKey),
      };
    });

    let registrationResults: any[] = [];
    if (network === "devnet") {
      registrationResults = agentConfigs.map((cfg) => ({ status: "fulfilled", value: cfg }));
    } else {
      registrationResults = await Promise.allSettled(
        agentConfigs.map(async (cfg) => {
          const rpcTimeout = new Promise((_, rj) => setTimeout(() => rj(new Error("RPC Timeout")), 20000));

          const registerAction = async () => {
            const sig = await connection.requestAirdrop(cfg.operatorKp.publicKey, 15 * LAMPORTS_PER_SOL);
            const latestBlockhash = await connection.getLatestBlockhash("confirmed");
            await connection.confirmTransaction(
              {
                signature: sig,
                blockhash: latestBlockhash.blockhash,
                lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
              },
              "confirmed"
            );

            const simWallet = {
              publicKey: cfg.operatorKp.publicKey,
              signTransaction: async (tx: any) => {
                tx.partialSign(cfg.operatorKp);
                return tx;
              },
              signAllTransactions: async (txs: any[]) => {
                txs.forEach((tx) => tx.partialSign(cfg.operatorKp));
                return txs;
              },
            };
            const provider = new AnchorProvider(connection, simWallet as any, { preflightCommitment: "confirmed" });
            const nodeClient = new SolariumClient(provider);

            await nodeClient.registerNode(
              cfg.burnerKp.publicKey,
              cfg.agent.data.role === "validator" ? NodeType.Validator : NodeType.Worker,
              1
            );
            await nodeClient.depositStake(new BN("10000000000"));
          };

          await Promise.race([registerAction(), rpcTimeout]);
          return cfg;
        })
      );
    }

    toast.dismiss(tId2);
    const tId3 = toast.loading("Spawning Docker Containers...");

    for (let i = 0; i < agentConfigs.length; i++) {
      const cfg = agentConfigs[i];
      const result = registrationResults[i];

      if (result.status === "rejected") {
        console.error("On-chain registration failed for:", cfg.agent.id, result.reason);
        toast.error(`Node ${cfg.agent.id} registration failed.`);
        setNodes((nds) => nds.map((n) => (n.id === cfg.agent.id ? { ...n, data: { ...n.data, status: "error" } } : n)));
        continue;
      }

      try {
        const res = await fetch("/api/nodes/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pubkey: cfg.operatorKey,
            burnerSecret: cfg.burnerSecretBase58,
            burnerPubkey: cfg.burnerPubKeyStr,
            role: cfg.agent.data.role || "worker",
            network,
          }),
        });
        if (!res.ok) throw new Error("Docker daemon unavailable");
        const payload = await res.json();
        setNodes((nds) =>
          nds.map((n) =>
            n.id === cfg.agent.id
              ? {
                  ...n,
                  data: {
                    ...n.data,
                    status: "running",
                    pubkey: payload.burnerPubkey || cfg.burnerPubKeyStr,
                    operatorPubkey: cfg.operatorKey,
                  },
                }
              : n
          )
        );
      } catch (e) {
        console.error("Docker spawn failed for:", cfg.agent.id, e);
        toast.error(`Node ${cfg.agent.id} failed to boot!`);
        setNodes((nds) => nds.map((n) => (n.id === cfg.agent.id ? { ...n, data: { ...n.data, status: "error" } } : n)));
      }
    }

    toast.dismiss(tId2);
    toast.success("Nodes spawned and registered successfully!");
    toast.success("Agents deployed! Waiting for Event Bus metrics...");
  };

  useEffect(() => {
    const agents = nodes.filter((n) => n.type === "worker" || n.type === "validator");
    if (agents.length > 0 && agents.every((n) => n.data.status === "success")) {
      const consensus = nodes.find((n) => n.type === "consensus");
      if (consensus && consensus.data.verdict === "pending") {
        const worker = agents.find((n) => n.type === "worker");
        const validator = agents.find((n) => n.type === "validator");
        const hasInvalidVote = agents.some((n) => n.data.vote === "INVALID");

        const finalVerdict = hasInvalidVote ? "slashed" : "success";

        toast.info(hasInvalidVote ? "Slash Penalty Detected!" : "Consensus Reached! Executing FinalizeTask...");

        setTimeout(() => {
          setNodes((nds) =>
            nds.map((n) =>
              n.type === "consensus"
                ? {
                    ...n,
                    data: {
                      ...n.data,
                      verdict: finalVerdict,
                      workerHash: (worker?.data?.workerHash as string) || "0xab...",
                      validatorHash: (validator?.data?.validatorHash as string) || "0xab...",
                      workerVerdict: worker?.data?.workerVerdict as number,
                      workerReasoning: worker?.data?.workerReasoning as string,
                      transactionSignature: "4yBf...C2a",
                    },
                  }
                : n
            )
          );
        }, 1000);
      }
    }
  }, [nodes, setNodes]);

  return (
    <div
      className="fixed top-0 bottom-0 left-[240px] right-0 bg-[#050505] animate-in fade-in duration-500 overflow-hidden"
      ref={reactFlowWrapper}
    >
      <NodePalette />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        nodeTypes={nodeTypes}
        fitView
        className="bg-transparent"
      >
        <Background color="#222" gap={20} size={1} />

        <Panel position="bottom-center" className="mb-8 z-50 flex flex-col items-center gap-4">
          <div className="bg-[#050505]/95 backdrop-blur-xl border border-white/10 p-1.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex items-center gap-1 overflow-hidden pointer-events-auto">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 text-[10px] uppercase font-bold tracking-[0.15em] cursor-pointer rounded-full transition-all select-none ${
                  activeTab === tab.id
                    ? "bg-[#151515] text-[#10D9B0] shadow-[inset_0_0_20px_rgba(16,217,176,0.1)] ring-1 ring-[#10D9B0]/40"
                    : "bg-transparent text-[#666] hover:text-[#AAA] hover:bg-white/5"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentcolor] ${activeTab === tab.id ? "bg-[#10D9B0] animate-pulse" : "bg-transparent"}`}
                />
                {tab.name}
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => closeTab(e, tab.id)}
                    className="ml-2 hover:bg-[#FF1515] hover:text-white w-5 h-5 rounded-full flex items-center justify-center text-[#555] transition-all"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addTab}
              className="ml-1 w-9 h-9 flex items-center justify-center text-[#666] hover:text-[#10D9B0] hover:bg-[#10D9B0]/10 border border-transparent hover:border-[#10D9B0]/20 rounded-full transition-all"
              title="Create New Virtual Chain"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M6 1V11M1 6H11" />
              </svg>
            </button>
          </div>

          <button
            onClick={simulateChain}
            className="bg-[#10D9B0]/10 backdrop-blur-xl border border-[#10D9B0]/30 text-[#10D9B0] hover:text-white px-8 py-3 rounded-full shadow-[0_0_20px_rgba(16,217,176,0.1)] flex items-center gap-3 font-mono text-[12px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-[#10D9B0]/20 hover:scale-105 active:scale-95 group hover:shadow-[0_0_30px_rgba(16,217,176,0.25)]"
          >
            <div className="size-2 rounded-full bg-[#10D9B0] animate-pulse group-hover:shadow-[0_0_12px_#10D9B0]" />
            Run Virtual Network
          </button>
        </Panel>

        <Controls
          className="fill-white [&>button]:bg-[#111] [&>button]:border-white/10 [&>button]:hover:bg-[#222]"
          showInteractive={false}
        />
      </ReactFlow>

      {menu && (
        <div
          className="absolute z-50 bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden"
          style={{ top: menu.top, left: menu.left }}
        >
          <div className="flex flex-col text-sm font-exo2 w-32">
            <button
              onClick={deleteNode}
              className="px-4 py-2 text-left text-red-400 hover:bg-white/5 transition-colors border-b border-white/5"
            >
              Delete Node
            </button>
            <button
              onClick={() => setMenu(null)}
              className="px-4 py-2 text-left text-white/70 hover:bg-white/5 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { createContext, useContext } from "react";
import { X, Code as CodeIcon } from "@phosphor-icons/react";

export const InspectorContext = createContext<(payload: any, title: string) => void>(() => {});
export const ExplainerContext = createContext<(type: string) => void>(() => {});

const explainerData: Record<string, { title: string; desc: string; code: string }> = {
  userInput: {
    title: "User Input (Client DApp)",
    desc: "End-users interact with the platform natively through specialized frontend inputs. The SDK prepares this raw prompt data before any blockchain indexing occurs.",
    code: `
const userPrompt = "Explain recursive zk-SNARKs securely";


const preliminaryValidation = preflightCheck(userPrompt);


const payload = { prompt: userPrompt, timestamp: Date.now() };`,
  },
  devConfig: {
    title: "Developer Protocol Configurations",
    desc: "Developers anchor rules by paying deposits. They set minimum validator constraints and strict base-prompts that guide the AI inference engine.",
    code: `
const devConfig = {
  systemInstruction: "You are an AI Smart Contract Auditor...",
  rewardMint: NATIVE_MINT,
  rewardAmount: new BN(1.5 * LAMPORTS_PER_SOL),
  validatorCount: 3
};


await client.depositStake(devConfig.rewardAmount.muln(100));`,
  },
  ipfsManifest: {
    title: "IPFS Builder (Irys / ShdwDrive)",
    desc: "Solana handles verifiable state, while heavy payload lives on decentralized storage. The SDK automatically assembles the input and pushes it to IPFS, retrieving an immutable CID hash.",
    code: `
const manifest = {
   version: "1.0",
   schema: "audit-v2",
   data: mergedPayload
};


const cid = await uploadToIPFS(manifest);
console.log("Immutable Document Hash:", cid);`,
  },
  escrow: {
    title: "Escrow Anchor Contract (Create Task)",
    desc: "The critical on-chain phase. Solarium smart contract intercepts the CID, freezes the specified developer SOL reward, and broadcasts a TaskCreated event.",
    code: `
const params = {
  inputHash: Array.from(bs58.decode(cid)),
  taskType: 1,
  tier: 0,
  reward: new BN(1.5 * LAMPORTS_PER_SOL),
  validatorCount: 3,
};

const result = await client.createTask(params);
console.log("Task Created. SOL frozen in Escrow:", result.signature);`,
  },
  worker: {
    title: "Worker Agent (Node.js Execution)",
    desc: "Listen for new blockchain instructions. A registered Docker Worker parses the IPFS payload, runs the deep Model Inference, and submits a cryptographic COMMIT of its result.",
    code: `
solariumClient.onTaskCreated(async (task) => {

   await claimTask(task.id);
   

   const answer = await runLocalLLM(task.ipfsData);
   const traceCid = await uploadToIPFS(answer.traceLogs);


   const commitment = hash(answer.verdict, salt);
   await solariumClient.commitResult(task.id, {
      commitment,
      reasoningHash: Array.from(bs58.decode(traceCid))
   });
});`,
  },
  validator: {
    title: "Validator Network (Consensus Layer)",
    desc: "Validators redundantly process the identical task and verify the Worker's logic. True Trust-Minimization guarantees the system operates identically regardless of node honesty.",
    code: `
solariumClient.onTaskAwaitingValidation(async (task) => {

   const isHallucination = await checkSanity(task.workerTraceCid);
   

   await solariumClient.revealResult(
      task.id, 
      isHallucination ? 0 : 1,
      95,
      [...salt]
   );
});`,
  },
  consensus: {
    title: "Finalize Contract (Slash or Payout)",
    desc: "The smart contract tallies all validators' reveals. If consensus matches, the frozen Escrow is released. If validators detect foul play, the Worker is permanently slashed.",
    code: `
const sig = await client.finalizeTask(task.id);








console.log("Finality Reached:", sig);`,
  },
};

function ComponentExplainerModal({ type, onClose }: { type: string; onClose: () => void }) {
  const data = explainerData[type];
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#050505] border border-white/10 rounded-2xl w-full max-w-2xl shadow-[0_0_50px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0A0A0A]">
          <span className="font-exo2 text-white font-semibold">SDK Integration: {data.title}</span>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-full">
          <div className="p-5 flex-1 border-b md:border-b-0 md:border-r border-white/5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#777] mb-3">Architecture Role</h3>
            <p className="text-sm font-onest text-white/80 leading-relaxed">{data.desc}</p>
          </div>

          <div className="p-4 md:w-3/5 bg-[#111] relative shadow-inner overflow-hidden custom-scrollbar">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#777] mb-3 sticky top-0 z-20">
              Implementation Code
            </h3>
            <pre className="text-[#4895EF] font-mono text-[11px] leading-relaxed relative z-10 overflow-x-auto pb-4">
              {data.code}
            </pre>
            <div className="absolute inset-0 bg-gradient-to-b from-[#4895EF]/5 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

function RawDataModal({ payload, title, onClose }: { payload: any; title: string; onClose: () => void }) {
  if (!payload) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#050505] border border-white/10 rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0A0A0A]">
          <div className="flex items-center gap-2">
            <CodeIcon weight="bold" className="text-[#8E44AD] size-4" />
            <span className="font-exo2 text-white font-semibold">{title}</span>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-4 bg-[#111] overflow-y-auto max-h-[60vh] custom-scrollbar shadow-inner relative">
          <pre className="text-[#10D9B0] font-mono text-[11px] leading-relaxed relative z-10">
            {JSON.stringify(payload, null, 2)}
          </pre>
          <div className="absolute inset-0 bg-gradient-to-b from-[#10D9B0]/5 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

export default function PolygonOrchestrator() {
  const [inspectorData, setInspectorData] = useState<{ payload: any; title: string } | null>(null);
  const [explainerType, setExplainerType] = useState<string | null>(null);

  const openInspector = (payload: any, title: string) => {
    setInspectorData({ payload, title });
  };

  return (
    <ExplainerContext.Provider value={setExplainerType}>
      <InspectorContext.Provider value={openInspector}>
        <ReactFlowProvider>
          <PolygonCanvas />
        </ReactFlowProvider>
        {inspectorData && (
          <RawDataModal
            payload={inspectorData.payload}
            title={inspectorData.title}
            onClose={() => setInspectorData(null)}
          />
        )}
        {explainerType && <ComponentExplainerModal type={explainerType} onClose={() => setExplainerType(null)} />}
      </InspectorContext.Provider>
    </ExplainerContext.Provider>
  );
}
