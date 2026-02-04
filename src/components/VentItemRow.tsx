// VentItemRow.tsx
import { useState } from "react";
import type { EditVentItemResult, RemoveVentItemResult, VentItem, VentItemPatch } from "../services/braindump";

type VentItemRowProps = {
    item: VentItem;
    onEdit: (id: string, patch: VentItemPatch) => Promise<EditVentItemResult>
    onRemove: (id: string) => Promise<RemoveVentItemResult>
}

export function VentItemRow({ item, onEdit, onRemove }: VentItemRowProps) {

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [draftTitle, setDraftTitle] = useState("");
    const [draftWhen, setDraftWhen] = useState<"today" | "soon" | "later">("soon");
    const [draftStress, setDraftStress] = useState<number>(0);

    const id = item.id;
    const title = item.title;
    const when = item.when;
    const stressLevel = item.stressLevel

    return (
        !isEditing ? (
            <>
                {title}{" "}
                {when}
                {"Stress Level: "}{stressLevel}
                <button
                    type="button"
                    onClick={() => {
                        setIsEditing(true);
                        setDraftTitle(title);
                        setDraftWhen(when);
                        setDraftStress(stressLevel);
                    }}
                >
                    Edit
                </button>
                <button
                    type="button"
                    onClick={async () => {
                        const result = await onRemove(id);
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
                        const result = await onEdit(
                            id,
                            { title: draftTitle, when: draftWhen, stressLevel: draftStress });
                        if (!result.ok) {
                            alert(result.error);
                            return;
                        }
                        setIsEditing(false);
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
                        setIsEditing(false);
                        setDraftTitle("");
                        setDraftWhen("soon");
                        setDraftStress(0);
                    }}
                >
                    Cancel
                </button>
            </>
        )
    );
}