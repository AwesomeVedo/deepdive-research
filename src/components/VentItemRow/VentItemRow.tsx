// VentItemRow.tsx
import { useState } from "react";
import type { EditVentItemResult, RemoveVentItemResult, VentItem, VentItemPatch } from "../../services/braindump";
import { CalendarIcon, StressIcon, MoreActionsIcon, DeleteIcon, EditIcon } from "../icons/Icon";

import "./VentItemRow.css";

type VentItemRowProps = {
    item: VentItem;
    onEdit: (id: string, patch: VentItemPatch) => Promise<EditVentItemResult>
    onRemove: (id: string) => Promise<RemoveVentItemResult>
}

export function VentItemRow({ item, onEdit, onRemove }: VentItemRowProps) {

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [draftTitle, setDraftTitle] = useState("");
    const [draftWhen, setDraftWhen] = useState<"Today" | "Soon" | "Later">("Soon");
    const [draftStress, setDraftStress] = useState<number>(0);

    const id = item.id;
    const title = item.title;
    const when = item.when;
    const stressLevel = item.stressLevel;

    return (
        !isEditing ? (
            <>
                <li className="vent-item">
                    <div className="vent-item-col-left">
                        <div className="vent-item-title">{title}</div>
                    </div>
                    <div className="vent-item-col-right">
                        <div className="vent-item-options">
                            <span className="when-text vent-item-option">
                                <CalendarIcon />
                                <span>{when}</span>
                            </span>
                            <span className="stress-level-text vent-item-option">
                                <StressIcon />
                                <span>Stress Lvl:</span>
                                <span>{stressLevel}</span>
                            </span>
                        </div>

                        <MoreActionsIcon
                            onClick={() => setIsMenuOpen((v) => !v)}
                        />

                        {
                            isMenuOpen &&
                            <div className="vent-item-menu">

                                <button
                                    type="button"
                                    className="edit"
                                    onClick={() => {
                                        setIsEditing(true);
                                        setIsMenuOpen(false);
                                        setDraftTitle(title);
                                        setDraftWhen(when);
                                        setDraftStress(stressLevel);
                                    }}
                                >
                                    <EditIcon /> Edit
                                </button>
                                <button
                                    type="button"
                                    className="delete"
                                    onClick={async () => {
                                        const result = await onRemove(id);
                                        if (!result.ok) {
                                            alert(result.error);
                                            return;
                                        }
                                    }}
                                >
                                    <DeleteIcon /> Delete
                                </button>
                            </div>
                        }


                    </div>
                </li>
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
                            if (value === "Soon" || value === "Today" || value === "Later") {
                                setDraftWhen(value);
                            }
                        }
                        }

                    >
                        <option value="Today">Today</option>
                        <option value="Soon">Soon</option>
                        <option value="Later">Later</option>
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
                        setDraftWhen("Soon");
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
                        setDraftWhen("Soon");
                        setDraftStress(0);
                    }}
                >
                    Cancel
                </button>
            </>
        )
    );
}