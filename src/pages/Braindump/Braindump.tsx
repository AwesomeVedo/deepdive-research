import { useState } from "react";
import { useVentItems } from "../../hooks/useVentItems";
import "./braindump.css";

export function Braindump() {
    const { ventItems, create, remove, edit } = useVentItems();
    const [itemTitle, setItemTitle] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [draftTitle, setDraftTitle] = useState("");

    return (
        <div style={{ maxWidth: "600px", margin: "auto", display: "block" }}>
            <center>
                <h2>Braindump</h2>
                <p>Personal Venting Session</p>
                <br />
            </center>

            <form
                onSubmit={async (e) => {
                    e.preventDefault();

                    const result = await create(itemTitle);
                    if (!result.ok) {
                        alert(result.error);
                        return;
                    }

                    setItemTitle("");
                }}
            >
                <div className="control-pair--inline">
                    <input
                        className="input"
                        type="text"
                        value={itemTitle}
                        onChange={(e) => setItemTitle(e.target.value)}
                    />
                    <button type="submit">Add</button>
                </div>
            </form>

            <ul>
                {ventItems.map((i) => (
                    <li key={i.id} data-id={i.id}>
                        {editingId !== i.id ? (
                            <>
                                {i.title}{" "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(i.id);
                                        setDraftTitle(i.title);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const result = await remove(i.id);
                                        if (!result.ok) {
                                            alert(result.error);
                                            return;
                                        }
                                    }}
                                >
                                    X
                                </button>
                            </>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    className="input"
                                    value={draftTitle}
                                    onChange={(e) => setDraftTitle(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const result = await edit(i.id, { title: draftTitle });
                                        if (!result.ok) {
                                            alert(result.error);
                                            return;
                                        }
                                        setEditingId(null);
                                        setDraftTitle("");
                                    }}
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null);
                                        setDraftTitle("");
                                    }}
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
