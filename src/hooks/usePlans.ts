// usePlans.ts
import { useCallback, useEffect, useState } from "react";
import {
  listPlans,
  savePlans,
  getPlanByVentItemId,
  createPlanForVentItem,
  editPlan,
  addPlanStep,
  editPlanStep,
  removePlanStep,
  togglePlanStepCompleted,
  reorderPlanSteps,
  type Plan,
  type PlanPatch,
  type PlanStepPatch,
  type CreatePlanResult,
  type EditPlanResult,
  type RemovePlanResult,
  type CreatePlanStepResult,
  type EditPlanStepResult,
  type RemovePlanStepResult,
} from "../services/braindump";

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(() => {
    setIsLoading(true);
    try {
      const next = listPlans();
      setPlans(next);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getByVentItemId = useCallback(
    (ventItemId: string): Plan | null => {
      if (!ventItemId) return null;

      const fromState = plans.find((p) => p.ventItemId === ventItemId);
      if (fromState) return fromState;

      return getPlanByVentItemId(ventItemId);
    },
    [plans]
  );

  const getById = useCallback(
    (planId: string): Plan | null => {
      if (!planId) return null;
      return plans.find((p) => p.id === planId) ?? null;
    },
    [plans]
  );

  const createForVentItem = useCallback(
    (ventItemId: string, title: string): CreatePlanResult => {
      setIsLoading(true);
      try {
        const res = createPlanForVentItem(ventItemId, title);
        if (!res.ok) return res;

        setPlans((prev) => [res.plan, ...prev]);
        return res;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const edit = useCallback((planId: string, patch: PlanPatch): EditPlanResult => {
    setIsLoading(true);
    try {
      const res = editPlan(planId, patch);
      if (!res.ok) return res;

      setPlans((prev) => prev.map((p) => (p.id === planId ? res.plan : p)));
      return res;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addStep = useCallback(
    (planId: string, title: string): CreatePlanStepResult => {
      setIsLoading(true);
      try {
        const res = addPlanStep(planId, title);
        if (!res.ok) return res;

        // Update local state using the returned updated plan
        setPlans((prev) => prev.map((p) => (p.id === planId ? res.plan : p)));
        return res;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const editStep = useCallback(
    (planId: string, stepId: string, patch: PlanStepPatch): EditPlanStepResult => {
      setIsLoading(true);
      try {
        const res = editPlanStep(planId, stepId, patch);
        if (!res.ok) return res;
  
        setPlans((prev) => prev.map((p) => (p.id === planId ? res.plan : p)));
        return res;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );
  
  const removeStep = useCallback(
    (planId: string, stepId: string): RemovePlanStepResult => {
      setIsLoading(true);
      try {
        const res = removePlanStep(planId, stepId);
        if (!res.ok) return res;
  
        // keep local state in sync (we don't get plan back here)
        setPlans(listPlans());
        return res;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );
  

  const toggleStepCompleted = useCallback(
    (planId: string, stepId: string): EditPlanStepResult => {
      setIsLoading(true);
      try {
        const res = togglePlanStepCompleted(planId, stepId);
        if (!res.ok) return res;
  
        setPlans((prev) => prev.map((p) => (p.id === planId ? res.plan : p)));
        return res;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );
  
  const reorderSteps = useCallback((planId: string, orderedStepIds: string[]): EditPlanStepResult => {
    setIsLoading(true);
    try {
      const res = reorderPlanSteps(planId, orderedStepIds);
      if (!res.ok) return res;
  
      setPlans((prev) => prev.map((p) => (p.id === planId ? res.plan : p)));
      return res;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const remove = useCallback((planId: string): RemovePlanResult => {
    if (!planId) return { ok: false, error: "Invalid Plan ID." };

    setIsLoading(true);
    try {
      const current = listPlans();
      const exists = current.some((p) => p.id === planId);
      if (!exists) return { ok: false, error: "Plan does not exist." };

      const next = current.filter((p) => p.id !== planId);
      savePlans(next);

      setPlans((prev) => prev.filter((p) => p.id !== planId));
      return { ok: true };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    plans,
    isLoading,
    refresh,

    // selectors
    getByVentItemId,
    getById,

    // operations
    createForVentItem,
    edit,
    remove,
    addStep,
    editStep,
    removeStep,
    toggleStepCompleted,
    reorderSteps,
  };
}
