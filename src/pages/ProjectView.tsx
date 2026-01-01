import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProjects } from "../app/useProjects";

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

            <h1 style={{ marginTop: 12 }}>{project.name}</h1>

            {!isEditing ? (
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
                            onClick={() => {
                                setIsEditing(true);
                                setDraftName(project.name);
                            }}
                        >
                            Edit name
                        </button>

                        <button
                            type="button"
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
            ) : (
                <>
                    <label style={{ display: "block", marginTop: 12 }}>
                        <div style={{ marginBottom: 6 }}>
                            <strong>Project name</strong>
                        </div>
                        <input
                            value={draftName}
                            onChange={(e) => setDraftName(e.target.value)}
                            placeholder="Enter new name"
                        />
                    </label>

                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
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
                            onClick={() => {
                                setIsEditing(false);
                                setDraftName("");
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
