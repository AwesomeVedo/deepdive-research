// Braindump.tsx
import { useState } from "react";
import { useVentItems } from "../../hooks/useVentItems";
import { VentItemRow } from "../../components/VentItemRow";
import "./braindump.css";

export function Braindump() {
    const { ventItems, create, edit, remove } = useVentItems();
    const [itemTitle, setItemTitle] = useState("");
    const [itemWhen, setItemWhen] = useState<"today" | "soon" | "later">("soon");
    const [itemStress, setItemStress] = useState<number>(0);



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
                {ventItems.map((item) => (
                    <VentItemRow
                        key={item.id}
                        item={item}
                        onEdit={edit}
                        onRemove={remove}
                    />
                ))}
            </ul>

        </div>
    );
}
