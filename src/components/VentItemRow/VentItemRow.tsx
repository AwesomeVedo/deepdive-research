// VentItemRow.tsx
import { useState, useRef, useEffect } from "react";
import type {
    EditVentItemResult,
    RemoveVentItemResult,
    VentItem,
    VentItemPatch,
    Plan,
} from "../../services/braindump";
import {
    CalendarIcon,
    StressIcon,
    MoreActionsIcon,
    DeleteIcon,
    DefferedIcon,
    OpenIcon,
    CompletedIcon,
    ReleasedIcon,
} from "../icons/Icon";
import "./VentItemRow.css";

type VentItemRowProps = {
    item: VentItem;
    plan: Plan | null;

    isSelected: boolean;
    onSelect: (ventItemId: string) => void;

    onCreatePlan: (ventItemId: string, title: string) => void;
    onViewPlan: (ventItemId: string) => void;

    onEdit: (id: string, patch: VentItemPatch) => Promise<EditVentItemResult>;
    onRemove: (id: string) => Promise<RemoveVentItemResult>;

    isPlanOpen: boolean;
};

type EditableField = "title" | "when" | "resolution" | "stress";

export function VentItemRow({
    item,
    plan,
    isSelected,
    onSelect,
    onCreatePlan,
    onViewPlan,
    onEdit,
    onRemove,
}: VentItemRowProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeField, setActiveField] = useState<EditableField | null>(null);

    const { id, title, when, stressLevel, resolution } = item;
    const hasPlan = !!plan;

    // Drafts (seed from item once; refresh again when beginEdit is called)
    const [draftTitle, setDraftTitle] = useState(() => title);
    const [draftWhen, setDraftWhen] = useState<VentItem["when"]>(() => when);
    const [draftResolution, setDraftResolution] = useState<VentItem["resolution"]>(
        () => resolution
    );
    const [draftStress, setDraftStress] = useState<number>(() => stressLevel);

    const actionsRef = useRef<HTMLDivElement>(null);

    const iconMap = {
        Open: <OpenIcon />,
        Released: <ReleasedIcon />,
        Completed: <CompletedIcon />,
        Deferred: <DefferedIcon />,
    } as const;

    const fillPercent = (stressLevel / 9) * 100;

    // Helper: ensures any interaction also focuses/selects this row
    function focusRow(e: React.MouseEvent) {
        e.stopPropagation();
        onSelect(id);
    }

    // Close menu on outside click
    useEffect(() => {
        if (!isMenuOpen) return;

        function onDocMouseDown(e: MouseEvent) {
            const el = actionsRef.current;
            if (!el) return;
            if (e.target instanceof Node && !el.contains(e.target)) setIsMenuOpen(false);
        }

        document.addEventListener("mousedown", onDocMouseDown);
        return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, [isMenuOpen]);

    function beginEdit(field: EditableField) {
        setActiveField(field);

        // Seed drafts from latest item values
        setDraftTitle(title);
        setDraftWhen(when);
        setDraftResolution(resolution);
        setDraftStress(stressLevel);

        setIsMenuOpen(false);
    }

    function cancelEdit() {
        setActiveField(null);

        // Restore drafts back to source of truth
        setDraftTitle(title);
        setDraftWhen(when);
        setDraftResolution(resolution);
        setDraftStress(stressLevel);
    }

    async function commitEdit(field: EditableField) {
        let patch: VentItemPatch = {};

        if (field === "title") {
            const next = draftTitle.trim();
            const prev = title.trim();

            if (!next || next === prev) {
                setActiveField(null);
                setDraftTitle(title);
                return;
            }

            patch = { title: next };
        }

        if (field === "when") {
            if (draftWhen === when) {
                setActiveField(null);
                return;
            }
            patch = { when: draftWhen };
        }

        if (field === "resolution") {
            if (draftResolution === resolution) {
                setActiveField(null);
                return;
            }
            patch = { resolution: draftResolution };
        }

        if (field === "stress") {
            if (draftStress === stressLevel) {
                setActiveField(null);
                return;
            }
            patch = { stressLevel: draftStress };
        }

        const result = await onEdit(id, patch);
        if (!result.ok) {
            alert(result.error);
            cancelEdit();
            return;
        }

        setActiveField(null);
    }

    return (
        <li
            className={`vent-item ${isSelected ? "is-selected" : ""}`}
            onClick={() => onSelect(id)}
            style={{ "--fill": `${fillPercent}%` } as React.CSSProperties}
        >
            <div className="vent-item-col-left">
                {/* Title: inline edit + ALSO focuses row */}
                {activeField !== "title" ? (
                    <button
                        type="button"
                        className="vent-item-title vent-item-inline-button"
                        onClick={(e) => {
                            focusRow(e);
                            beginEdit("title");
                        }}
                    >
                        {title}
                    </button>
                ) : (
                    <input
                        type="text"
                        className="vent-item-title vent-item-inline-input input"
                        value={draftTitle}
                        autoFocus
                        onClick={(e) => focusRow(e)}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") cancelEdit();
                            if (e.key === "Enter") {
                                e.preventDefault();
                                void commitEdit("title");
                            }
                        }}
                        onBlur={() => void commitEdit("title")}
                    />
                )}
            </div>

            <div className="vent-item-col-right">
                <div className="vent-item-options">
                    {/* {!hasPlan ? (
                        <button
                            type="button"
                            className="start-a-plan plan-button button"
                            onClick={(e) => {
                                focusRow(e);
                                onCreatePlan(id, title);
                            }}
                        >
                            Start a Plan
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="view-plan plan-button button"
                            onClick={(e) => {
                                focusRow(e);
                                onViewPlan(id);
                            }}
                        >
                            View Plan
                        </button>
                    )} */}

                    {/* Resolution */}
                    <span className="resolution-text vent-item-option">
                        {activeField !== "resolution" ? (
                            <button
                                type="button"
                                className="vent-item-inline-pill"
                                onClick={(e) => {
                                    focusRow(e);
                                    beginEdit("resolution");
                                }}
                            >
                                {iconMap[resolution]}
                                <span>{resolution}</span>
                            </button>
                        ) : (
                            <select
                                className="vent-item-inline-select input"
                                value={draftResolution}
                                autoFocus
                                onClick={(e) => focusRow(e)}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (
                                        value === "Completed" ||
                                        value === "Released" ||
                                        value === "Open" ||
                                        value === "Deferred"
                                    ) {
                                        setDraftResolution(value);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Escape") cancelEdit();
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        void commitEdit("resolution");
                                    }
                                }}
                                onBlur={() => void commitEdit("resolution")}
                            >
                                <option value="Open">Open</option>
                                <option value="Released">Released</option>
                                <option value="Deferred">Deferred</option>
                                <option value="Completed">Completed</option>
                            </select>
                        )}
                    </span>

                    {/* When */}
                    <span className="when-text vent-item-option">
                        {activeField !== "when" ? (
                            <button
                                type="button"
                                className="vent-item-inline-pill"
                                onClick={(e) => {
                                    focusRow(e);
                                    beginEdit("when");
                                }}
                            >
                                <CalendarIcon />
                                <span>{when}</span>
                            </button>
                        ) : (
                            <select
                                className="vent-item-inline-select input"
                                value={draftWhen}
                                autoFocus
                                onClick={(e) => focusRow(e)}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === "Soon" || value === "Today" || value === "Later") {
                                        setDraftWhen(value);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Escape") cancelEdit();
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        void commitEdit("when");
                                    }
                                }}
                                onBlur={() => void commitEdit("when")}
                            >
                                <option value="Today">Today</option>
                                <option value="Soon">Soon</option>
                                <option value="Later">Later</option>
                            </select>
                        )}
                    </span>

                    {/* Stress */}
                    <span className="stress-level-text vent-item-option">
                        {activeField !== "stress" ? (
                            <button
                                type="button"
                                className="vent-item-inline-pill"
                                onClick={(e) => {
                                    focusRow(e);
                                    beginEdit("stress");
                                }}
                            >
                                <StressIcon />
                                <span>SL:</span>
                                <span>{stressLevel}</span>
                            </button>
                        ) : (
                            <select
                                className="vent-item-inline-select input"
                                value={draftStress}
                                autoFocus
                                onClick={(e) => focusRow(e)}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value >= 0 && value <= 9) setDraftStress(value);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Escape") cancelEdit();
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        void commitEdit("stress");
                                    }
                                }}
                                onBlur={() => void commitEdit("stress")}
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
                        )}
                    </span>
                </div>

                {/* Actions menu */}
                <div
                    ref={actionsRef}
                    className="vent-item-actions"
                    onClick={(e) => focusRow(e)}
                >
                    <button
                        type="button"
                        className="icon-button"
                        onClick={(e) => {
                            focusRow(e);
                            setIsMenuOpen((v) => !v);
                        }}
                    >
                        <MoreActionsIcon />
                    </button>

                    {isMenuOpen && (
                        <div className="vent-item-menu">
                            <button
                                type="button"
                                className="delete"
                                onClick={async (e) => {
                                    focusRow(e);
                                    const result = await onRemove(id);
                                    if (!result.ok) alert(result.error);
                                }}
                            >
                                <DeleteIcon /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </li>
    );
}