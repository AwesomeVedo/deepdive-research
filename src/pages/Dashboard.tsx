import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../app/useProjects";
import "../app/App.css";
import "./dashboard.css";

export function Dashboard() {
    const { projects, create, remove } = useProjects();
    const navigate = useNavigate();

    const [name, setName] = useState("");

    const hasProjects = projects.length > 0;

    return (
        <>
            {/*<h2 style={{ textAlign: "center", margin: 0 }}>Dashboard</h2>*/}
            <div className="dash">

                <section className="dash__left">

                    <h3>Start A New Project</h3>
                    {/* Create */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();

                            const result = create(name);

                            if (!result.ok) {
                                alert(result.error);
                                return;
                            }

                            setName("");
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Enter Project Title"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <button type="submit">Create</button>
                    </form>
                </section>
                <section className="dash__right">
                    <h2>All Projects</h2>
                    {!hasProjects ? (
                        <p>No projects yet</p>
                    ) : (

                        <ul className="project-list">
                            {projects.map((project) => (
                                <li key={project.id} className="project-row">
                                    <span className="project-title">
                                        {project.name}
                                    </span>

                                    <div className="project-actions">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(`/dashboard/projects/${project.id}`)
                                            }
                                        >
                                            View
                                        </button>

                                        <button
                                            type="button"
                                            className="danger delete-button"
                                            onClick={() => {
                                                const confirmed = window.confirm(
                                                    `Delete "${project.name}"? This cannot be undone.`
                                                );
                                                if (!confirmed) return;

                                                const result = remove(project.id);
                                                if (!result.ok) {
                                                    alert(result.error);
                                                    return;
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                    )}

                    {/* <pre>{JSON.stringify(projects, null, 2)}</pre> */}
                </section>
            </div>
        </>
    );
}
