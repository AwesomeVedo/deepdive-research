import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProjects } from "../app/useProjects";
import { EditIcon, CancelIcon } from "../components/icons/Icon";

type Params = {
    id?: string;
};

export function ProjectView() {
    const { id } = useParams<Params>();
    const navigate = useNavigate();

    const { projects, edit, remove } = useProjects();

    const project = useMemo(() => {
        if (!id) return undefined;
        return projects.find((p) => p.id === id);
    }, [projects, id]);

    const [isEditing, setIsEditing] = useState(false);
    const [draftName, setDraftName] = useState("");

    if (!id) {
        return (
            <div style={{ padding: 16 }}>
                <h2>Invalid project URL</h2>
                <p>Missing project id.</p>
                <button type="button" onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    if (!project) {
        return (
            <div style={{ padding: 16 }}>
                <h2>Project not found</h2>
                <p>No project exists with id: {id}</p>
                <button type="button" onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div>
            <button type="button" onClick={() => navigate("/dashboard")}>
                ← Back to Dashboard
            </button>

            <div className="project-title-row">
                {!isEditing ? (
                    <span className="project-title">{project.name}</span>
                ) : (
                    <>
                        <label style={{ display: "block" }}>
                            <input
                                className="editing-title"
                                value={draftName}
                                onChange={(e) => setDraftName(e.target.value)}
                                placeholder="Enter new name"
                            />
                        </label>

                        <div style={{ display: "flex", gap: 8 }}>
                            <button
                                type="button"
                                onClick={() => {
                                    const result = edit(project.id, { name: draftName });

                                    if (!result.ok) {
                                        alert(result.error);
                                        return;
                                    }

                                    setIsEditing(false);
                                    setDraftName("");
                                }}
                            >
                                Save
                            </button>

                            <button
                                type="button"
                                className="icon-button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setDraftName("");
                                }}
                            >
                                <CancelIcon />
                            </button>
                        </div>
                    </>
                )}


                <button
                    type="button"
                    className="icon-button"
                    onClick={() => {
                        setIsEditing(true);
                        setDraftName(project.name);
                    }}
                    aria-label="Edit project name"
                >
                    <EditIcon />
                </button>
            </div>
            <>
                <p>
                    <strong>Created:</strong>{" "}
                    {new Date(project.createdAt).toLocaleString()}
                </p>

                <p>
                    <strong>Updated:</strong>{" "}
                    {new Date(project.updatedAt).toLocaleString()}
                </p>

                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>


                    <button
                        type="button"
                        className="delete-button"
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

                            navigate("/dashboard");
                        }}
                    >
                        Delete project
                    </button>
                </div>
            </>
        </div>
    );
}
