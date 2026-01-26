import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProjects } from "../hooks/useProjects";
import { EditIcon, CancelIcon } from "../components/icons/Icon";
import { RichTextEditor } from "../components/RichTextEditor";
//import Tiptap from "../components/Tiptap";

type Params = {
    id?: string;
};

export function ProjectView() {
    const { id } = useParams<Params>();
    const navigate = useNavigate();

    const { projects, edit, remove, addNote, updateNote, deleteNote } =
        useProjects();

    // STATES
    const [isEditing, setIsEditing] = useState(false);
    const [draftName, setDraftName] = useState("");
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [subjectDraft, setSubjectDraft] = useState("");
    const [bodyDraft, setBodyDraft] = useState("");

    const project = useMemo(() => {
        if (!id) return undefined;
        return projects.find((p) => p.id === id);
    }, [projects, id]);

    const projectNotes = project?.notes ?? [];
    const activeNote = projectNotes.find((n) => n.id === activeNoteId);

    function clearNoteSelection() {
        setActiveNoteId(null);
        setSubjectDraft("");
        setBodyDraft("");
    }

    if (!id) {
        return (
            <div>
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
        <div className="dash">
            <div className="dash__left">
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
                    <hr />
                    <h3>Notes</h3>

                    {projectNotes.length === 0 ? (
                        <p>No notes yet...</p>

                    ) : (
                        <ul style={{ paddingLeft: 0 }}>
                            {projectNotes.map((note) => (
                                <li
                                    key={note.id}
                                    data-id={note.id}
                                    onClick={() => {
                                        setActiveNoteId(note.id);
                                        setSubjectDraft(note.subject ?? "");
                                        setBodyDraft(note.body ?? "");
                                    }}
                                    style={{
                                        cursor: "pointer",
                                        fontWeight: note.id === activeNoteId ? 700 : 400,
                                        listStyle: "none",
                                        backgroundColor: note.id === activeNoteId ? "#ffdf00" : "transparent",
                                    }}
                                >
                                    {note.subject || "(Untitled)"}
                                </li>
                            ))}
                        </ul>
                    )}

                    <button
                        type="button"
                        onClick={() => {
                            const result = addNote(project.id);
                            if (!result.ok) {
                                alert(result.error);
                                return;
                            }

                            setActiveNoteId(result.noteId);

                            const createdNote = result.project.notes?.find(
                                (n) => n.id === result.noteId
                            );
                            setSubjectDraft(createdNote?.subject ?? "");
                            setBodyDraft(createdNote?.body ?? "");
                        }}
                        aria-label="Add New Note"
                    >
                        Add New Note
                    </button>
                    <br />
                    <br />
                    <hr />
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

            <div className="dash__right">
                {!activeNote ? (
                    <p>Let's dive in!</p>
                ) : (
                    <>
                        <input
                            type="text"
                            value={subjectDraft}
                            onChange={(e) => setSubjectDraft(e.target.value)}
                        />
                        <RichTextEditor
                            value={bodyDraft}
                            onChange={setBodyDraft} />

                        <button
                            type="button"
                            onClick={() => {
                                const result = updateNote(project.id, activeNote.id, {
                                    subject: subjectDraft,
                                    body: bodyDraft,
                                });

                                if (!result.ok) {
                                    alert(result.error);
                                    return;
                                }
                            }}
                        >
                            Save Note
                        </button>

                        <button
                            type="button"
                            style={{ backgroundColor: "red" }}
                            onClick={() => {
                                const confirmed = window.confirm("Delete this note?");
                                if (!confirmed) return;

                                const result = deleteNote(project.id, activeNote.id);
                                if (!result.ok) {
                                    alert(result.error);
                                    return;
                                }

                                clearNoteSelection();
                            }}
                        >
                            Delete Note
                        </button>
                    </>
                )}
            </div>
        </div >
    );
}
