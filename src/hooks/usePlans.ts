import { useCallback, useEffect, useState } from "react";
import {
  listPlans,
  savePlans,
  getPlanByVentItemId,
  createPlanForVentItem,
  editPlan,
  type Plan,
  type PlanPatch,
  type CreatePlanResult,
  type EditPlanResult,
  type RemovePlanResult,
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

  // Optional: auto-load once on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  const getByVentItemId = useCallback(
    (ventItemId: string): Plan | null => {
      if (!ventItemId) return null;

      // Prefer local state if already loaded
      const fromState = plans.find((p) => p.ventItemId === ventItemId);
      if (fromState) return fromState;

      // Fallback to storage helper
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

        // Keep local state in sync without re-reading everything
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

  // v1 removal implemented here (no new service function required)
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
  };
}
