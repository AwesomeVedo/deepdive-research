import { listProjects } from "../app/projects";

const projects = listProjects();
export function Dashboard() {
    return <p>Dashboard page<br /> {projects}</p>;
}
