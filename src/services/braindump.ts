/* ============================================================================
   DOMAIN TYPES
   ---------------------------------------------------------------------------
   These define what a Braindump (Vent) is and how operations report success or failure.
============================================================================ */
export type VentItem = {
  id: string;
  title: string;
  when: "today" | "soon" | "later";
  stressLevel: number; // 1-10
  difficultyLevel: number; // 1-10
  focusAreaId: string | null;
  status: "active" | "archived";
  createdAt: number;
  updatedAt: number;
};

/* --------------------------------- Results -------------------------------- */
export type CreateVentItemResult =
  | { ok: true; ventItem: VentItem }
  | { ok: false; error: string };

export type EditVentItemResult =
  | { ok: true, ventItem: VentItem }
  | { ok: false, error: string };

  export type RemoveVentItemResult =
  | { ok: true }
  | { ok: false, error: string };
/* --------------------------------- Patches -------------------------------- */
export type VentItemPatch = {
  title?: string;
  when?: VentItem["when"];
  stressLevel?: number;
  difficultyLevel?: number;
  focusAreaId?: VentItem["focusAreaId"];
  status?: VentItem["status"];
}
/* ============================================================================
   STORAGE CONFIG
============================================================================ */

const KEY = "dd_vent_item";
/* ============================================================================
   LOW-LEVEL STORAGE HELPERS
   ---------------------------------------------------------------------------
   These directly interact with localStorage.
============================================================================ */

// Omit removes `items` so it can be redefined as untrusted.
// Partial makes all remaining Vent fields optional to reflect messy stored data.
// `id` is re-required, and `items` is reintroduced as `unknown` to force validation.

type StoredVentItem = Partial<Omit<VentItem, "when" | "status" | "focusAreaId">> & {
  id?: unknown;
  when?: unknown;
  status?: unknown;
  focusAreaId?: unknown;
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
  return {
    id: String(item.id ?? crypto.randomUUID()),
    title: String(item.title ?? ""),
    when: item.when === "today" || item.when === "soon" || item.when === "later" ? item.when : "soon",
    stressLevel: Number(item.stressLevel ?? 0),
    difficultyLevel: Number(item.difficultyLevel ?? 0),
    focusAreaId: typeof item.focusAreaId === "string" ? item.focusAreaId : null,
    status: item.status === "active" || item.status === "archived" ? item.status : "active",
    createdAt: Number(item.createdAt ?? now),
    updatedAt: Number(item.updatedAt ?? now),
  };
}
export function saveVentItems(ventItems: VentItem[]) {
  const now = Date.now();
  const normalized = ventItems.map((i) => normalizeVentItem(i, now));
  localStorage.setItem(KEY, JSON.stringify(normalized));
}

/* ============================================================================
 WRITE OPERATIONS
============================================================================ */

export function createVentItem(title: string): CreateVentItemResult {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return { ok: false, error: "Vent Item title is required" };

  const now = Date.now();

  const newVentItem: VentItem = {
    id: crypto.randomUUID(),
    title: trimmedTitle,
    when: "soon",
    stressLevel: 2,
    difficultyLevel: 2,
    focusAreaId: null,
    status: "active",
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
      return { ok: false, error: "Vent Item not found" };
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

  return { ok: true };
} 