/* ============================================================================
   DOMAIN TYPES
   ---------------------------------------------------------------------------
   These define what a Braindump (Vent) is and how operations report success or failure.
============================================================================ */
export type VentItem = {
  id: string;
  title: string;
  when: "today" | "soon" | "later";
  stressLevel: number;
  difficultyLevel: number;
  createdAt: number;
  updatedAt: number;
};

export type Vent = {
  id: string;
  title: string;
  description: string;
  items: VentItem[];
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
};

/* --------------------------------- Results -------------------------------- */

export type CreateVentResult =
  | { ok: true; vent: Vent }
  | { ok: false; error: string };

export type EditVentResult =
  | { ok: true; vent: Vent }
  | { ok: false; error: string };

export type DeleteVentResult =
  | { ok: true }
  | { ok: false; error: string };

export type GetVentResult =
  | { ok: true; vent: Vent }
  | { ok: false; error: string };


/* --------------------------------- Patches -------------------------------- */

export type VentPatch = {
  title?: string;
  description?: string;
  isActive?: boolean;
};

/* ============================================================================
   STORAGE CONFIG
============================================================================ */

const KEY = "dd_braindump";

/* ============================================================================
   LOW-LEVEL STORAGE HELPERS
   ---------------------------------------------------------------------------
   These directly interact with localStorage.
============================================================================ */

// Omit removes `items` so it can be redefined as untrusted.
// Partial makes all remaining Vent fields optional to reflect messy stored data.
// `id` is re-required, and `items` is reintroduced as `unknown` to force validation.
type StoredVent = Partial<Omit<Vent, "items">> & { id: string; items?: unknown };

type StoredVentItem = Partial<VentItem> & { id?: string };

function normalizeVentItem(item: StoredVentItem, now: number): VentItem {
  return {
    id: String(item.id ?? crypto.randomUUID()),
    title: String(item.title ?? ""),
    when: item.when === "today" || item.when === "soon" || item.when === "later" ? item.when : "soon",
    stressLevel: Number(item.stressLevel ?? 0),
    difficultyLevel: Number(item.difficultyLevel ?? 0),
    createdAt: Number(item.createdAt ?? now),
    updatedAt: Number(item.updatedAt ?? now),
  };
}


export function listVents(): Vent[] {
  const storedVents = localStorage.getItem(KEY);
  if (!storedVents) return [];

  try {
    const raw = JSON.parse(storedVents) as StoredVent[];
    return raw.map((v) => normalizeVent(v));
  } catch {
    return [];
  }


}

function normalizeVent(v: StoredVent): Vent {
  const now = Date.now();
  const rawItems = Array.isArray(v.items) ? v.items : [];

  return {
    id: String(v.id),
    title: String(v.title ?? "Untitled Vent"),
    description: String(v.description ?? ""),
    items: rawItems.map((it) => normalizeVentItem(it, now)),
    isActive: Boolean(v.isActive),
    createdAt: Number(v.createdAt ?? now),
    updatedAt: Number(v.updatedAt ?? now),
  };
}

export function saveVents(vents: Vent[]) {
  const normalized = vents.map((v) => normalizeVent(v as StoredVent));
  localStorage.setItem(KEY, JSON.stringify(normalized));
}

/* ============================================================================
 WRITE OPERATIONS
============================================================================ */

export function createVent(title: string): CreateVentResult {

  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    return { ok: false, error: "Let's stay organzied... Title required." }
  }

  const now = Date.now();

  const newVent: Vent = {
    id: crypto.randomUUID(),
    title: trimmedTitle,
    description: "",
    items: [],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  const vents = listVents();
  saveVents([newVent, ...vents]);
  return { ok: true, vent: newVent }
}

export function editVent(id: string, patch: VentPatch): EditVentResult {

  const nextPatch = { ...patch }; // copy patch contents to nextPatch
  // Check if nextPatch title exists
  if (nextPatch.title !== undefined) {
    const t = nextPatch.title.trim();
    if (!t) return { ok: false, error: "Vent title is required" };
    nextPatch.title = t;
  }
  // Check if nextPatch description exists
  if (nextPatch.description !== undefined) {
    nextPatch.description = nextPatch.description.trim(); // trim description
  }

  const vents = listVents(); // grab all vents
  const existingVent = vents.find((v) => v.id === id); // find match

  // Return false if vent doesn't exist
  if (!existingVent) {
    return { ok: false, error: "Vent does not exist." };
  }

  // Create new Vent Object
  const updated: Vent = {
    ...existingVent,
    ...nextPatch,
    updatedAt: Date.now(),
  }

  // Create new Vents array with edited/updated Vent Object
  const nextVents = vents.map((v) =>
    v.id === id ? updated : v
  );

  // Save new Vents array
  saveVents(nextVents);

  return { ok: true, vent: updated }

}