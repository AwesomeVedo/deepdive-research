// Braindump.tsx
import { useState } from "react";
import { useVentItems } from "../../hooks/useVentItems";
import { VentItemRow } from "../../components/VentItemRow/VentItemRow";
import "./braindump.css";

export function Braindump() {
    const { ventItems, create, edit, remove } = useVentItems();
    const [itemTitle, setItemTitle] = useState("");
    const [itemWhen, setItemWhen] = useState<"Today" | "Soon" | "Later">("Soon");
    const [itemStress, setItemStress] = useState<number>(0);



    return (
        <div className="dash">
            {/* <div className="dash__top">
                <h2>Braindump</h2>
            </div> */}
            <div className="dash__left">
                <>
                    <h3>Add New Vent Item</h3>
                    <form
                        className="vent-item-form"
                        onSubmit={async (e) => {
                            e.preventDefault();

                            const result = await create(itemTitle, itemWhen, itemStress);
                            if (!result.ok) {
                                alert(result.error);
                                return;
                            }

                            setItemTitle("");
                            setItemWhen("Soon");
                            setItemStress(0);
                        }}
                    >
                        <label htmlFor="item-title">
                            <input
                                className="input"
                                type="text"
                                placeholder="What's on your mind?..."
                                value={itemTitle}
                                onChange={(e) => setItemTitle(e.target.value)}
                            />
                        </label>
                        <label htmlFor="item-when"><span>When?</span>
                            <select
                                name="item-when"
                                className="input"
                                value={itemWhen}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === "Soon" || value === "Today" || value === "Later") {
                                        setItemWhen(value);
                                    }
                                }
                                }

                            >
                                <option value="Today">Today</option>
                                <option value="Soon">Soon</option>
                                <option value="Later">Later</option>
                            </select>
                        </label>
                        <label htmlFor="item-stress"><span>Stress Level</span>
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
                    </form>

                </>


            </div>
            <div className="dash__right">
                <h3>Vents</h3>
                <ul className="vent-list">
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
        </div>

    );
}
