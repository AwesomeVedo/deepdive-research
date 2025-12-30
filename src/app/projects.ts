export type Project = {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
  };
  
  const KEY = "dd_projects";

  export function listProjects(): Project[] {

    const storedProjects = localStorage.getItem(KEY);
  
    if (!storedProjects) {
      return [];
    }
  
    return JSON.parse(storedProjects) as Project[];

  }
  
  export function saveProjects(projects: Project[]) {
    localStorage.setItem(KEY, JSON.stringify(projects));
  }
  
  export function createProject(name:string) : Project | null {
    const trimmedName = name.trim();
    if (!trimmedName) return null;
    const now = Date.now();

    const newProject : Project = {
      id: crypto.randomUUID(),
      name: trimmedName,
      createdAt: now,
      updatedAt: now
    };

    const projects = listProjects();
    saveProjects([newProject, ...projects]);
    return newProject;

  }