/* ============================================================================
   DOMAIN TYPES
   ---------------------------------------------------------------------------
   These define what a Project is and how operations report success or failure.
============================================================================ */
export type ProjectNote = {
  id: string;
  subject: string;
  body: string;
  createdAt: number;
  updatedAt: number;
  tags: string;
}

export type Project = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  description: string;
  tags: string;   // keep as a simple comma string for now
  notes: ProjectNote[];

};

/* --------------------------------- Results -------------------------------- */

export type CreateProjectResult =
  | { ok: true; project: Project }
  | { ok: false; error: string };

export type EditProjectResult =
  | { ok: true; project: Project }
  | { ok: false; error: string };

export type DeleteProjectResult =
  | { ok: true }
  | { ok: false; error: string };

export type GetProjectResult =
  | { ok: true; project: Project }
  | { ok: false; error: string };

  export type AddProjectNoteResult =
  | { ok: true; project: Project; noteId: string }
  | { ok: false; error: string };

/* --------------------------------- Patches -------------------------------- */

export type ProjectPatch = {
  name?: string;
};
export type ProjectNotePatch = {
  subject?: string;
  body?: string;
  tags?: string;
}
/* ============================================================================
   STORAGE CONFIG
============================================================================ */

const KEY = "dd_projects";

/* ============================================================================
   LOW-LEVEL STORAGE HELPERS
   ---------------------------------------------------------------------------
   These directly interact with localStorage.
============================================================================ */

type StoredProject = Partial<Project> & { id: string };

export function listProjects(): Project[] {
  const storedProjects = localStorage.getItem(KEY);
  if (!storedProjects) return [];

  const raw = JSON.parse(storedProjects) as StoredProject[];
  return raw.map((p) => normalizeProject(p));
}

function normalizeProject(p: StoredProject): Project {
  const now = Date.now();

  return {
    id: String(p.id),
    name: String(p.name ?? ""),
    createdAt: Number(p.createdAt ?? now),
    updatedAt: Number(p.updatedAt ?? now),
    description: String(p.description ?? ""),
    tags: String(p.tags ?? ""),
    notes: Array.isArray(p.notes) ? p.notes : [],
  };
}




export function saveProjects(projects: Project[]) {
  localStorage.setItem(KEY, JSON.stringify(projects));
}

/* ============================================================================
   READ OPERATIONS
============================================================================ */

export function getProjectById(id: string): GetProjectResult {
  const project = listProjects().find((p) => p.id === id);

  if (!project) {
    return { ok: false, error: "Project not found" };
  }

  return { ok: true, project };
}

/* ============================================================================
   WRITE OPERATIONS
============================================================================ */

export function createProject(name: string): CreateProjectResult {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return { ok: false, error: "Project name is required" };
  }

  const now = Date.now();

  const newProject: Project = {
    id: crypto.randomUUID(),
    name: trimmedName,
    createdAt: now,
    updatedAt: now,
    description: "",
    tags:"",
    notes: []
  };

  const projects = listProjects();
  saveProjects([newProject, ...projects]);

  return { ok: true, project: newProject };
}

export function editProject(id: string, patch: ProjectPatch ): EditProjectResult {
  // Validate patch (v1: only name)
  if (patch.name !== undefined) {
    const trimmedName = patch.name.trim();
    if (!trimmedName) {
      return { ok: false, error: "Project name is required" };
    }
    patch = { ...patch, name: trimmedName };
  }

  const projects = listProjects();
  const existing = projects.find((p) => p.id === id);

  if (!existing) {
    return { ok: false, error: "Project not found" };
  }

  const updated: Project = {
    ...existing,
    ...patch,
    updatedAt: Date.now(),
  };

  const nextProjects = projects.map((p) =>
    p.id === id ? updated : p
  );

  saveProjects(nextProjects);

  return { ok: true, project: updated };
}

export function deleteProject(id: string): DeleteProjectResult {
  const projects = listProjects();
  const exists = projects.some((p) => p.id === id);

  if (!exists) {
    return { ok: false, error: "Project not found" };
  }

  const nextProjects = projects.filter((p) => p.id !== id);
  saveProjects(nextProjects);

  return { ok: true };
}
// Creates default values for note.
// Called by addProjectNote.
export function createProjectNote() : ProjectNote {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    subject: "Untitled Note",
    body: "",
    createdAt: now,
    updatedAt: now,
    tags: "",
  }
}

export function addProjectNote(projectId: string): AddProjectNoteResult {
  const projects = listProjects();
  const existing = projects.find((p) => p.id === projectId);

  if (!existing) {
    return { ok: false, error: "Project not found" };
  }

  const newNote = createProjectNote();
  const now = Date.now();

  const updatedProject: Project = {
    ...existing,
    notes: [newNote, ...existing.notes], // newest first
    updatedAt: now,
  };

  const nextProjects = projects.map((p) =>
    p.id === projectId ? updatedProject : p
  );

  saveProjects(nextProjects);

  return { ok: true, project: updatedProject, noteId: newNote.id };
}

export function updateProjectNote(projectId: string, noteId: string, patch: ProjectNotePatch): EditProjectResult
{
  const projects = listProjects();
  const existingProject = projects.find((p) => p.id === projectId);

  if (!existingProject) {
    return { ok: false, error: "Project not found" };
  }

  const existingNote = existingProject.notes.find(
    (n) => n.id === noteId
  );

  if (!existingNote) {
    return { ok: false, error: "Note not found" };
  }

  const now = Date.now();

  // 1) Create the updated note (FULL note, not a patch)
  const updatedNote: ProjectNote = {
    ...existingNote,
    ...patch,
    updatedAt:now,
  }

  const nextNotes = existingProject.notes.map((n) => 
    n.id === noteId ? updatedNote : n
  );

  // 3) Create updated project
  const updatedProject: Project = {
    ...existingProject,
    notes: nextNotes,
    updatedAt: now,
  };

  // 4) Replace project in projects array
  const nextProjects = projects.map((p) =>
    p.id === projectId ? updatedProject : p
  );

  saveProjects(nextProjects);

  return { ok: true, project: updatedProject };
}