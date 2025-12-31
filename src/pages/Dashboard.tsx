import { useState } from "react";
import { useProjects } from "../app/useProjects";

export function Dashboard() {
    const { projects, create, edit, remove } = useProjects();

    const [name, setName] = useState("");

    const [editingId, setEditingId] = useState<string | null>(null);
    const [draftName, setDraftName] = useState("");

    const hasProjects = projects.length > 0;

    return (
        <>
            <p>Dashboard page</p>

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

            {!hasProjects ? (
                <p>No projects yet</p>
            ) : (
                <ul>
                    {projects.map((project) => {
                        const isEditing = project.id === editingId;

                        return (
                            <li key={project.id}>
                                {isEditing ? (
                                    <>
                                        <input
                                            value={draftName}
                                            onChange={(e) => setDraftName(e.target.value)}
                                        />

                                        {/* Save */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const result = edit(project.id, { name: draftName });

                                                if (!result.ok) {
                                                    alert(result.error);
                                                    return;
                                                }

                                                setEditingId(null);
                                                setDraftName("");
                                            }}
                                        >
                                            Save
                                        </button>

                                        {/* Cancel */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingId(null);
                                                setDraftName("");
                                            }}
                                        >
                                            Cancel
                                        </button>

                                        {/* Delete */}
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

                                                // If you were editing this item, exit editing mode
                                                if (editingId === project.id) {
                                                    setEditingId(null);
                                                    setDraftName("");
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span>{project.name}</span>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingId(project.id);
                                                setDraftName(project.name);
                                            }}
                                        >
                                            Edit
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
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}

            <pre>{JSON.stringify(projects, null, 2)}</pre>
        </>
    );
}
