import { useState } from "react";
import { useVentItems } from "../../hooks/useVentItems";
import "./braindump.css";

export function Braindump() {
    const { ventItems, create, remove, edit } = useVentItems();
    const [itemTitle, setItemTitle] = useState("");
    const [itemWhen, setItemWhen] = useState<"today" | "soon" | "later">("soon");
    const [itemStress, setItemStress] = useState<number>(0);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [draftTitle, setDraftTitle] = useState("");
    const [draftWhen, setDraftWhen] = useState<"today" | "soon" | "later">("soon");
    const [draftStress, setDraftStress] = useState<number>(0);


    return (
        <div style={{ maxWidth: "800px", margin: "auto", display: "block" }}>
            <center>
                <h2>Braindump</h2>
                <p>Personal Venting Session</p>
                <br />
            </center>

            <form
                onSubmit={async (e) => {
                    e.preventDefault();

                    const result = await create(itemTitle, itemWhen, itemStress);
                    if (!result.ok) {
                        alert(result.error);
                        return;
                    }

                    setItemTitle("");
                    setItemWhen("soon");
                    setItemStress(0);
                }}
            >
                <div className="control-pair--inline">
                    <input
                        className="input"
                        type="text"
                        value={itemTitle}
                        onChange={(e) => setItemTitle(e.target.value)}
                    />
                    <label htmlFor="item-when">When?
                        <select
                            name="item-when"
                            className="input"
                            value={itemWhen}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "soon" || value === "today" || value === "later") {
                                    setItemWhen(value);
                                }
                            }
                            }

                        >
                            <option value="today">Today</option>
                            <option value="soon">Soon</option>
                            <option value="later">Later</option>
                        </select>
                    </label>
                    <label htmlFor="item-stress">Stress
                        <select
                            name="item-stress"
                            className="input"
                            value={itemStress}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= 0 && value <= 9) setItemStress(value);
                            }
                            }

                        >
                            <option value={0}>0 – Calm</option>
                            <option value={1}>1 – Light</option>
                            <option value={2}>2 – Slightly Tense</option>
                            <option value={3}>3 – Uneasy</option>
                            <option value={4}>4 – Pressured</option>
                            <option value={5}>5 – Anxious</option>
                            <option value={6}>6 – Overwhelmed</option>
                            <option value={7}>7 – Distressed</option>
                            <option value={8}>8 – Near Breakdown</option>
                            <option value={9}>9 – Mental Shutdown</option>
                        </select>
                    </label>
                    <button type="submit">Add</button>
                </div>
            </form>

            <ul>
                {ventItems.map((i) => (
                    <li key={i.id} data-id={i.id}>
                        {editingId !== i.id ? (
                            <>
                                {i.title}{" "}
                                {i.when}
                                {"Stress:"}{i.stressLevel}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(i.id);
                                        setDraftTitle(i.title);
                                        setDraftWhen(i.when);
                                        setDraftStress(i.stressLevel);
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
                                    name="title"
                                    value={draftTitle}
                                    onChange={(e) => setDraftTitle(e.target.value)}
                                />
                                <label htmlFor="draft-when">When?
                                    <select
                                        name="draft-when"
                                        className="input"
                                        value={draftWhen}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === "soon" || value === "today" || value === "later") {
                                                setDraftWhen(value);
                                            }
                                        }
                                        }

                                    >
                                        <option value="today">Today</option>
                                        <option value="soon">Soon</option>
                                        <option value="later">Later</option>
                                    </select>
                                </label>
                                <label htmlFor="draft-stress">Stress
                                    <select
                                        name="draft-stress"
                                        className="input"
                                        value={draftStress}
                                        onChange={(e) => {
                                            const value = Number(e.target.value);
                                            if (value >= 0 && value <= 9) setDraftStress(value);
                                        }
                                        }

                                    >
                                        <option value={0}>0 – Calm</option>
                                        <option value={1}>1 – Light</option>
                                        <option value={2}>2 – Slightly Tense</option>
                                        <option value={3}>3 – Uneasy</option>
                                        <option value={4}>4 – Pressured</option>
                                        <option value={5}>5 – Anxious</option>
                                        <option value={6}>6 – Overwhelmed</option>
                                        <option value={7}>7 – Distressed</option>
                                        <option value={8}>8 – Near Breakdown</option>
                                        <option value={9}>9 – Mental Shutdown</option>

                                    </select>
                                </label>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const result = await edit(
                                            i.id,
                                            { title: draftTitle, when: draftWhen, stressLevel: draftStress });
                                        if (!result.ok) {
                                            alert(result.error);
                                            return;
                                        }
                                        setEditingId(null);
                                        setDraftTitle("");
                                        setDraftWhen("soon");
                                        setDraftStress(0);
                                    }}
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null);
                                        setDraftTitle("");
                                        setDraftWhen("soon");
                                        setDraftStress(0);
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
