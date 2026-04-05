"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ResiRole = "resident" | "contractor" | "chairman";

export type LocalProposal = {
  taskId: string;
  title: string;
  amountUsdt: number;
  description: string;
  contractorAddress: string;
  votesYes: number;
  votesTotal: number;
  hasVoted: boolean;
};

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  category: "Ремонт" | "Озеленение" | "Охрана" | "Уборка" | "Коммуналка";
  date: string;
};

export type Resident = {
  id: string;
  name: string;
  apartment: string;
  role: "Житель" | "Председатель";
};

type ResiDaoContextType = {
  role: ResiRole;
  setRole: (r: ResiRole) => void;

  treasuryBalance: number;
  myContribution: number;
  depositFunds: (amount: number) => void;

  localProposals: LocalProposal[];
  addLocalProposal: (p: LocalProposal) => void;
  voteYes: (taskId: string) => void;

  transactions: Transaction[];
  residents: Resident[];
  addResident: (name: string, apt: string) => void;

  tourActive: boolean;
  setTourActive: (v: boolean) => void;
  tourStep: number;
  setTourStep: (n: number) => void;
};

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "t1", title: "Оплата за вывоз мусора", amount: -150, category: "Уборка", date: "2023-10-25" },
  { id: "t2", title: "Покраска перил (3 подъезд)", amount: -400, category: "Ремонт", date: "2023-10-22" },
  { id: "t3", title: "Стрижка газона", amount: -80, category: "Озеленение", date: "2023-10-18" },
  { id: "t4", title: "Услуги охраны (Октябрь)", amount: -1200, category: "Охрана", date: "2023-10-02" },
  { id: "t5", title: "Взнос (Кв. 42)", amount: +50, category: "Коммуналка", date: "2023-10-01" },
];

const INITIAL_RESIDENTS: Resident[] = [
  { id: "r1", name: "Иван Петров", apartment: "Кв. 12", role: "Председатель" },
  { id: "r2", name: "Алия Нурланова", apartment: "Кв. 42", role: "Житель" },
  { id: "r3", name: "Аскар Болатов", apartment: "Кв. 56", role: "Житель" },
  { id: "r4", name: "Елена Смирнова", apartment: "Кв. 88", role: "Житель" },
];

const ResiDaoContext = createContext<ResiDaoContextType | undefined>(undefined);

export function ResiDaoProvider({ children }: { readonly children: ReactNode }): JSX.Element {
  const [role, setRole] = useState<ResiRole>("resident");
  const [treasuryBalance, setTreasuryBalance] = useState(14500);
  const [myContribution, setMyContribution] = useState(120);

  const [transactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  const [localProposals, setLocalProposals] = useState<LocalProposal[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("residao_proposals");
      if (saved) return JSON.parse(saved);
    }
    return [];
  });

  const [residents, setResidents] = useState<Resident[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("residao_residents");
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_RESIDENTS;
  });

  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  useEffect(() => {
    localStorage.setItem("residao_proposals", JSON.stringify(localProposals));
  }, [localProposals]);

  useEffect(() => {
    localStorage.setItem("residao_residents", JSON.stringify(residents));
  }, [residents]);

  const depositFunds = (amount: number) => {
    setTreasuryBalance((prev) => prev + amount);
    setMyContribution((prev) => prev + amount);
  };

  const addLocalProposal = (p: LocalProposal) => {
    setLocalProposals((prev) => [p, ...prev]);
  };

  const voteYes = (taskId: string) => {
    setLocalProposals((prev) =>
      prev.map((p) => {
        if (p.taskId === taskId && !p.hasVoted) {
          return { ...p, votesYes: p.votesYes + 1, votesTotal: p.votesTotal + 1, hasVoted: true };
        }
        return p;
      })
    );
  };

  const addResident = (name: string, apt: string) => {
    setResidents((prev) => [...prev, { id: Date.now().toString(), name, apartment: apt, role: "Житель" }]);
  };

  return (
    <ResiDaoContext.Provider
      value={{
        role,
        setRole,
        treasuryBalance,
        myContribution,
        depositFunds,
        localProposals,
        addLocalProposal,
        voteYes,
        transactions,
        residents,
        addResident,
        tourActive,
        setTourActive,
        tourStep,
        setTourStep,
      }}
    >
      {children}
    </ResiDaoContext.Provider>
  );
}

export function useResiDao(): ResiDaoContextType {
  const context = useContext(ResiDaoContext);
  if (context === undefined) {
    throw new Error("useResiDao must be used within a ResiDaoProvider");
  }
  return context;
}
