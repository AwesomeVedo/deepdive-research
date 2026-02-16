// ============================================================================
// VentItemRow.tsx
// ============================================================================

// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
import { useState, useRef, useEffect } from "react";
import {
    type EditVentItemResult,
    type RemoveVentItemResult,
    type VentItem,
    type VentItemPatch,
    type Plan,
} from "../../services/braindump";

import {
    CalendarIcon,
    StressIcon,
    MoreActionsIcon,
    DeleteIcon,
    EditIcon,
    DefferedIcon,
    OpenIcon,
    CompletedIcon,
    ReleasedIcon,
    CancelIcon,
    VentItemSaveIcon,
} from "../icons/Icon";

import "./VentItemRow.css";


// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------
type VentItemRowProps = {
    item: VentItem;
    plan: Plan | null;
    onCreatePlan: (ventItemId: string, title: string) => void;
    onViewPlan: (ventItemId: string) => void;
    onEdit: (id: string, patch: VentItemPatch) => Promise<EditVentItemResult>;
    onRemove: (id: string) => Promise<RemoveVentItemResult>;
};


// ============================================================================
// Component
// ============================================================================
export function VentItemRow({ item, plan, onCreatePlan, onViewPlan, onEdit, onRemove }: VentItemRowProps) {

    // ---------------------------------------------------------------------------
    // Local State
    // ---------------------------------------------------------------------------
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    // Draft state (edit mode)
    const [draftTitle, setDraftTitle] = useState("");
    const [draftWhen, setDraftWhen] = useState<"Today" | "Soon" | "Later">("Soon");
    const [draftResolution, setDraftResolution] =
        useState<"Open" | "Released" | "Completed" | "Deferred">("Open");
    const [draftStress, setDraftStress] = useState<number>(0);

    // Refs
    const actionsRef = useRef<HTMLDivElement>(null);

    // ---------------------------------------------------------------------------
    // Derived Values
    // ---------------------------------------------------------------------------
    const id = item.id;
    const title = item.title;
    const when = item.when;
    const stressLevel = item.stressLevel;
    const resolution = item.resolution;

    const hasPlan = !!plan;

    // Resolution icon mapping (view mode)
    const iconMap = {
        Open: <OpenIcon />,
        Released: <ReleasedIcon />,
        Completed: <CompletedIcon />,
        Deferred: <DefferedIcon />,
    } as const;

    // Stress fill percentage for background "bar"
    const fillPercent = (stressLevel / 9) * 100;


    // ---------------------------------------------------------------------------
    // Effects
    // ---------------------------------------------------------------------------
    // Close the actions menu when clicking outside of the menu container
    useEffect(() => {
        if (!isMenuOpen) return;

        function onDocMouseDown(e: MouseEvent) {
            const el = actionsRef.current;
            if (!el) return;
            if (e.target instanceof Node && !el.contains(e.target)) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", onDocMouseDown);
        return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, [isMenuOpen]);


    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------
    return (
        !isEditing ? (

            // =======================================================================
            // View Mode
            // =======================================================================
            <>
                <li
                    className="vent-item"
                    style={{
                        "--fill": `${fillPercent}%`,
                    } as React.CSSProperties}
                >
                    <div className="vent-item-col-left">
                        <div className="vent-item-title">{title}</div>
                    </div>

                    <div className="vent-item-col-right">

                        {/* ---------------------------------------------------------------
               Meta / Options Row
            ---------------------------------------------------------------- */}
                        <div className="vent-item-options">
                            {!hasPlan ?
                                (<button
                                    type="button"
                                    className="start-a-plan button"
                                    onClick={() => onCreatePlan(id, title)}
                                >
                                    Start a Plan
                                </button>)

                                : (<button
                                    type="button"
                                    className="view-plan button"
                                    onClick={() => onViewPlan(id)}
                                >
                                    View Plan
                                </button>)

                            }
                            <span className="resolution-text vent-item-option">
                                {iconMap[resolution]}
                                <span>{resolution}</span>
                            </span>

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


                        {/* ---------------------------------------------------------------
               Actions (3-dot menu)
            ---------------------------------------------------------------- */}
                        <div ref={actionsRef} className="vent-item-actions">
                            <MoreActionsIcon onClick={() => setIsMenuOpen((v) => !v)} />

                            {isMenuOpen && (
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
                                            setDraftResolution(resolution);
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
                            )}
                        </div>

                    </div>
                </li>
            </>

        ) : (

            // =======================================================================
            // Edit Mode
            // =======================================================================
            <>
                <li className="vent-item editing">
                    <div className="vent-item-col-left">

                        {/* Title input */}
                        <input
                            type="text"
                            className="vent-item-input"
                            name="title"
                            value={draftTitle}
                            onChange={(e) => setDraftTitle(e.target.value)}
                        />
                    </div>

                    <div className="vent-item-col-right">

                        {/* Resolution select */}
                        <label htmlFor="draft-resolution">
                            <select
                                name="draft-resolution"
                                className="vent-item-input resolution-text"
                                value={draftResolution}
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
                            >
                                <option value="Open">Open</option>
                                <option value="Released">Released</option>
                                <option value="Deferred">Deferred</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </label>

                        {/* When select */}
                        <label htmlFor="draft-when">
                            <select
                                name="draft-when"
                                className="vent-item-input when-text"
                                value={draftWhen}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === "Soon" || value === "Today" || value === "Later") {
                                        setDraftWhen(value);
                                    }
                                }}
                            >
                                <option value="Today">Today</option>
                                <option value="Soon">Soon</option>
                                <option value="Later">Later</option>
                            </select>
                        </label>

                        {/* Stress select */}
                        <label htmlFor="draft-stress">
                            <select
                                name="draft-stress"
                                className="vent-item-input stress-level-text"
                                value={draftStress}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value >= 0 && value <= 9) setDraftStress(value);
                                }}
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


                        {/* -------------------------------------------------------------
               Save / Cancel Controls
            ------------------------------------------------------------- */}
                        <div className="vent-item-editing-controls">

                            <button
                                type="button"
                                className="icon-button"
                                onClick={async () => {
                                    const result = await onEdit(id, {
                                        title: draftTitle,
                                        when: draftWhen,
                                        stressLevel: draftStress,
                                        resolution: draftResolution,
                                    });

                                    if (!result.ok) {
                                        alert(result.error);
                                        return;
                                    }

                                    setIsEditing(false);
                                    setDraftTitle("");
                                    setDraftWhen("Soon");
                                    setDraftStress(0);
                                    setDraftResolution("Open");
                                }}
                            >
                                <VentItemSaveIcon />
                            </button>

                            <button
                                type="button"
                                className="icon-button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setDraftTitle("");
                                    setDraftWhen("Soon");
                                    setDraftStress(0);
                                    setDraftResolution("Open");
                                }}
                            >
                                <CancelIcon />
                            </button>

                        </div>

                    </div>
                </li>
            </>
        )
    );
}
