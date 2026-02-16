// braindump.ts
/* --------------------------------- Unions -------------------------------- */

export type When = "Today" | "Soon" | "Later";
export type Resolution = "Open" | "Deferred" | "Completed" | "Released";

/* ============================================================================
   DOMAIN TYPES
   ---------------------------------------------------------------------------
   These define what a Braindump is and how operations report success or failure.

============================================================================ */

export type VentItem = {
  id: string;
  title: string;
  when: When;
  stressLevel: number; // 1-10
  focusAreaId: string | null;
  status: "Active" | "Archived";
  resolution: Resolution;
  createdAt: number;
  updatedAt: number;
};
export type Plan = {
  id: string;
  ventItemId: string;
  title: string;
  steps: PlanStep[];
  createdAt: number;
  updatedAt: number;
};
export type PlanStep = {
  id: string;
  title: string;
  completed: boolean;
};


/* --------------------------------- Results -------------------------------- */
/* -------- Vent Item --------- */
export type CreateVentItemResult =
  | { ok: true; ventItem: VentItem }
  | { ok: false; error: string };

export type EditVentItemResult =
  | { ok: true, ventItem: VentItem }
  | { ok: false, error: string };

export type RemoveVentItemResult =
  | { ok: true }
  | { ok: false, error: string };

/* -------- Plan --------- */

export type CreatePlanResult =
  | { ok: true; plan: Plan }
  | { ok: false; error: string };

export type EditPlanResult =
  | { ok: true, plan: Plan }
  | { ok: false, error: string };

export type RemovePlanResult =
  | { ok: true }
  | { ok: false, error: string };

  /* -------- PlanStep --------- */

export type CreatePlanStepResult =
  | { ok: true; plan: Plan }
  | { ok: false; error: string };

export type EditPlanStepResult =
  | { ok: true, plan: Plan }
  | { ok: false, error: string };

export type RemovePlanStepResult =
  | { ok: true }
  | { ok: false, error: string };


/* --------------------------------- Patches -------------------------------- */
export type VentItemPatch = {
  title?: string;
  when?: VentItem["when"];
  stressLevel?: number;
  focusAreaId?: VentItem["focusAreaId"];
  status?: VentItem["status"];
  resolution?: VentItem["resolution"];
}

export type PlanPatch = {
  title?: string;
  steps?: PlanStep[];
}

export type PlanStepPatch = {
  title?: string;
  completed?: boolean;
}

/* ============================================================================
   STORAGE CONFIG
============================================================================ */

const KEY = "dd_vent_item";
const PLANS_KEY = "dd_plans_v1";

/* ============================================================================
   LOW-LEVEL STORAGE HELPERS
   ---------------------------------------------------------------------------
   These directly interact with localStorage.
============================================================================ */
/* --------------- VENT ITEM --------------- */

type StoredVentItem = Partial<Omit<VentItem, "when" | "status" | "focusAreaId" | "resolution">> & {
  id?: unknown;
  when?: unknown;
  status?: unknown;
  focusAreaId?: unknown;
  resolution?: unknown;
}

export function listVentItems(): VentItem[] {
  const stored = localStorage.getItem(KEY);
  const now = Date.now();
  if (!stored) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch {
    return [];
  }

  const raw = Array.isArray(parsed) ? (parsed as StoredVentItem[]) : [];
  return raw.map((i) => normalizeVentItem(i, now));
}

function normalizeVentItem(item: StoredVentItem, now: number): VentItem {
  const rawStress = Number(item.stressLevel ?? 0);
  const safeStress = Number.isFinite(rawStress) ? rawStress : 0;
  const clampedStress = Math.min(9, Math.max(0, safeStress));

  return {
    id: String(item.id ?? crypto.randomUUID()),
    title: String(item.title ?? ""),
    when: item.when === "Today" || item.when === "Soon" || item.when === "Later" ? item.when : "Soon",
    stressLevel: clampedStress,
    focusAreaId: typeof item.focusAreaId === "string" ? item.focusAreaId : null,
    status: item.status === "Active" || item.status === "Archived" ? item.status : "Active",
    resolution: item.resolution === "Completed" || item.resolution === "Deferred" || item.resolution === "Open" || item.resolution === "Released" ? item.resolution : "Open",
    createdAt: Number(item.createdAt ?? now),
    updatedAt: Number(item.updatedAt ?? now),
  };
}

export function saveVentItems(ventItems: VentItem[]) {
  const now = Date.now();
  const normalized = ventItems.map((i) => normalizeVentItem(i, now));
  localStorage.setItem(KEY, JSON.stringify(normalized));
}

/* --------------- PLAN --------------- */

type StoredPlan = Partial<Omit<Plan, "id" | "ventItemId" | "steps" | "createdAt" | "updatedAt">> & {
  id?: unknown;
  ventItemId?: unknown;
  steps?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export function listPlans(): Plan[] {
  const stored = localStorage.getItem(PLANS_KEY);
  const now = Date.now();
  if (!stored) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch {
    return [];
  }

  const raw = Array.isArray(parsed) ? (parsed as StoredPlan[]) : [];

  // Normalize + drop orphan plans (missing/invalid ventItemId)
  return raw
    .map((i) => normalizePlan(i, now))
    .filter((p) => typeof p.ventItemId === "string" && p.ventItemId.trim().length > 0);
}

function normalizePlan(plan: StoredPlan, now: number): Plan {
  return {
    id: String(plan.id ?? crypto.randomUUID()),
    ventItemId: typeof plan.ventItemId === "string" ? plan.ventItemId : "",
    title: String(plan.title ?? ""),
    steps: normalizePlanSteps(plan.steps),
    createdAt: Number(plan.createdAt ?? now),
    updatedAt: Number(plan.updatedAt ?? now),
  };
}

export function savePlans(plans: Plan[]) {
  const now = Date.now();
  const normalized = plans.map((p) => normalizePlan(p, now));
  localStorage.setItem(PLANS_KEY, JSON.stringify(normalized));
}

/* --------------- PLAN STEP --------------- */

// Treat storage as untrusted: everything unknown.
type StoredPlanStep = {
  id?: unknown;
  title?: unknown;
  completed?: unknown;
}

export function normalizePlanSteps(planSteps: unknown): PlanStep[] {
  const raw = Array.isArray(planSteps) ? (planSteps as StoredPlanStep[]) : [];

  return raw.map((s) => {
    const id =
      typeof s.id === "string" && s.id.trim().length > 0
        ? s.id
        : crypto.randomUUID();

    const completed =
      typeof s.completed === "boolean"
        ? s.completed
        : (typeof s.completed === "number" ? s.completed === 1 : false);

    return {
      id,
      title: typeof s.title === "string" ? s.title : String(s.title ?? ""),
      completed,
    };
  });
}

/* ============================================================================
 WRITE OPERATIONS
============================================================================ */

/* --------------- VENT ITEM --------------- */

export function createVentItem(title: string, when: When, stressLevel: number): CreateVentItemResult {
  const trimmedTitle = title.trim();

  if (!when) return { ok: false, error: `"When" field is required` };
  if (when !== "Today" && when !== "Soon" && when !== "Later") return { ok: false, error: `Invalid value: ${when}` };
  if (!trimmedTitle) return { ok: false, error: `"Title" field is required` };
  if (
    stressLevel === undefined ||
    stressLevel === null ||
    stressLevel < 0 ||
    stressLevel > 9
  ) {
    return { ok: false, error: `"Stress Level" must be between 0 and 9` };
  }

  const now = Date.now();

  const newVentItem: VentItem = {
    id: crypto.randomUUID(),
    title: trimmedTitle,
    when: when,
    stressLevel: stressLevel,
    focusAreaId: null,
    status: "Active",
    resolution: "Open",
    createdAt: now,
    updatedAt: now,
  }

  const ventItems = listVentItems();
  saveVentItems([newVentItem, ...ventItems]);

  return { ok: true, ventItem: newVentItem };
}

export function editVentItem(id: string, patch: VentItemPatch) : EditVentItemResult {
  // Validate patch (v1: only name)
  if (patch.title !== undefined) {
    const trimmedName = patch.title.trim();
    if (!trimmedName) {
      return { ok: false, error: "Vent Item title is required" };
    }
    patch = { ...patch, title: trimmedName };
  }

  const ventItems = listVentItems();
  const existing = ventItems.find((i) => i.id === id);

  if (!existing) {
    return { ok: false, error: "Vent Item not found." };
  }

  const updated: VentItem = {
    ...existing,
    ...patch,
    updatedAt: Date.now(),
  };

  const nextVentItems = ventItems.map((i) =>
    i.id === id ? updated : i
  );

  saveVentItems(nextVentItems);

  return { ok: true, ventItem: updated };
}

export function removeVentItem(id: string): RemoveVentItemResult {
  const ventItems = listVentItems();
  const exists = ventItems.some((i) => i.id === id);

  if (!exists) return { ok: false, error: "Vent Item does not exist." }

  const nextVentItems = ventItems.filter((i) => i.id !== id);
  saveVentItems(nextVentItems);

  // Remove linked Plan, if it exists.
  const nextPlans = listPlans().filter((p) => p.ventItemId !== id);
  savePlans(nextPlans);

  return { ok: true };
}

/* --------------- PLAN --------------- */

export function getPlanByVentItemId(ventItemId: string): Plan | null {
  if (!ventItemId) return  null;
  const plans = listPlans();
  const matchedPlan = plans.find((p) => p.ventItemId === ventItemId);
  return matchedPlan ?? null;
}

export function createPlanForVentItem(ventItemId: string, title: string): CreatePlanResult {
  if ( getPlanByVentItemId(ventItemId) !== null ) {
    return { ok: false, error: "Plan already exists for this Vent Item." };
  }
  const doesVentItemExists = listVentItems().some(v => v.id === ventItemId);
  if (!doesVentItemExists) return { ok: false, error: "Vent Item does not exists." }

  const trimmedTitle = title.trim();
  if (!trimmedTitle) return { ok: false, error: `Invalid title.` };

  const newPlan: Plan = {
    id: crypto.randomUUID(),
    ventItemId: ventItemId,
    title: trimmedTitle,
    steps: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  }

  const plans = listPlans();
  savePlans([newPlan, ...plans]);

  return { ok: true, plan: newPlan };
}

export function editPlan(planId: string, patch: PlanPatch) : EditPlanResult {
  if (!planId) return { ok: false, error: "Invalid Plan ID." };

  // Validate patch (v1: only name)
  if (patch.title !== undefined) {
    const trimmedName = patch.title.trim();
    if (!trimmedName) {
      return { ok: false, error: "Plan title is required" };
    }
    patch = { ...patch, title: trimmedName };
  }

  const plans = listPlans();
  const matchedPlan = plans.find((p) => p.id === planId);
  if (!matchedPlan) return { ok: false, error: "Plan not found." };

  const updated: Plan = {
    ...matchedPlan,
    ...patch,
    updatedAt: Date.now(),
  };

  const nextPlans = plans.map((p) =>
    p.id === planId ? updated : p
  );

  savePlans(nextPlans);

  return { ok: true, plan: updated };
  
}

/* --------------- PLAN STEP --------------- */