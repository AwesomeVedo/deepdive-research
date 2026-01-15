import { useState } from "react";
import {
  listProjects,
  createProject,
  editProject,
  deleteProject,
  addProjectNote,
  updateProjectNote,
  type Project,
  type ProjectPatch,
  type ProjectNotePatch,
} from "./projects";

export function useProjects() {
  // Lazy init: runs listProjects() only once on first render
  const [projects, setProjects] = useState<Project[]>(() => listProjects());

  function refresh() {
    setProjects(listProjects());
  }

  function create(name: string) {
    const result = createProject(name);
    if (!result.ok) return result;
    refresh();
    return result;
  }

  function edit(id: string, patch: ProjectPatch) {
    const result = editProject(id, patch);
    if (!result.ok) return result;
    refresh();
    return result;
  }

  function remove(id: string) {
    const result = deleteProject(id);
    if (!result.ok) return result;
    refresh();
    return result;
  }

  function addNote(projectId: string) {
    const result = addProjectNote(projectId);
    if (!result.ok) return result;
    refresh();
    return result;
  }

  function updateNote(projectId: string, noteId: string, patch: ProjectNotePatch) {
    const result = updateProjectNote(projectId, noteId, patch);
    if (!result.ok) return result;
    refresh();
    return result;
  }

  return { projects, refresh, create, edit, remove, addNote, updateNote };
}



