// src/components/PlanPanel/PlanPanel.tsx
import { useState } from "react";
import type { Plan, VentItem, CreatePlanStepResult, EditPlanStepResult, RemovePlanStepResult } from "../../services/braindump";
import "./PlanPanel.css";

type PlanPanelProps = {
    ventItem: VentItem | null;
    plan: Plan | null;
    onCreatePlan: (ventItemId: string, title: string) => void;

    // used when a plan exists
    onAddStep: (planId: string, title: string) => CreatePlanStepResult;
    onToggleStep: (planId: string, stepId: string) => void;
    onEditStep: (planId: string, stepId: string, title: string) => EditPlanStepResult;
    onRemoveStep: (planId: string, stepId: string) => RemovePlanStepResult;
    onReorderSteps: (planId: string, orderedStepIds: string[]) => EditPlanStepResult;
};

export function PlanPanel({ ventItem, plan, onCreatePlan, onAddStep, onToggleStep, onEditStep, onRemoveStep, onReorderSteps }: PlanPanelProps) {
    const [isAddingStep, setIsAddingStep] = useState(false);
    const [draftStepTitle, setDraftStepTitle] = useState("");
    const [editingStepId, setEditingStepId] = useState<string | null>(null);
    const [draftEditTitle, setDraftEditTitle] = useState("");
    const [draggingStepId, setDraggingStepId] = useState<string | null>(null);

    // -------------- HELPER FUNCTIONS -------------- //
    function startEdit(stepId: string, currentTitle: string) {
        setEditingStepId(stepId);
        setDraftEditTitle(currentTitle);
    }

    function cancelEdit() {
        setEditingStepId(null);
        setDraftEditTitle("");
    }

    function commitEdit(planId: string, stepId: string) {
        const nextTitle = draftEditTitle.trim();
        if (!nextTitle) return;

        const res = onEditStep(planId, stepId, nextTitle);
        if (!res.ok) {
            alert(res.error);
            return;
        }
        cancelEdit();
    }

    function moveId(list: string[], fromId: string, toId: string): string[] {
        if (fromId === toId) return list;

        const fromIndex = list.indexOf(fromId);
        const toIndex = list.indexOf(toId);
        if (fromIndex === -1 || toIndex === -1) return list;

        const next = [...list];
        const [removed] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, removed);
        return next;
    }



    function resetAddStep() {
        setIsAddingStep(false);
        setDraftStepTitle("");
    }

    // Nothing selected
    if (!ventItem) {
        return (
            <div className="plan-panel">
                <p className="plan-panel__muted">Select a Vent Item to view or create a plan.</p>
            </div>
        );
    }

    // Selected vent item, but no plan yet
    if (!plan) {
        return (
            <div className="plan-panel">
                <div className="plan-panel__section">
                    <div className="plan-panel__label">Vent Item</div>
                    <div className="plan-panel__value">{ventItem.title}</div>
                </div>

                <div className="plan-panel__empty">
                    <p className="plan-panel__muted">No plan exists yet.</p>

                    <button
                        type="button"
                        className="plan-panel__cta button"
                        onClick={() => onCreatePlan(ventItem.id, ventItem.title)}
                    >
                        Start a Plan
                    </button>
                </div>
            </div>
        );
    }

    // Plan exists
    return (
        <div className="plan-panel">
            <div className="plan-panel__section">
                <div className="plan-panel__label">Steps</div>

                {plan.steps.length === 0 ? (
                    <p className="plan-panel__muted">No steps added yet.</p>
                ) : (
                    <ul className="plan-panel__steps">
                        {plan.steps.map((step) => {
                            const isEditing = editingStepId === step.id;

                            return (
                                <li
                                    key={step.id}
                                    className={`plan-panel__step ${step.completed ? "completed" : ""}`}
                                    draggable
                                    onDragStart={(e) => {
                                        setDraggingStepId(step.id);
                                        e.dataTransfer.effectAllowed = "move";
                                        e.dataTransfer.setData("text/plain", step.id);
                                    }}
                                    onDragOver={(e) => {
                                        // Allow dropping
                                        e.preventDefault();
                                        e.dataTransfer.dropEffect = "move";
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();

                                        const fromId = draggingStepId ?? e.dataTransfer.getData("text/plain");
                                        const toId = step.id;
                                        if (!plan) return;
                                        if (!fromId || fromId === toId) return;

                                        const currentIds = plan.steps.map((s) => s.id);
                                        const nextIds = moveId(currentIds, fromId, toId);

                                        const res = onReorderSteps(plan.id, nextIds);
                                        if (!res.ok) alert(res.error);

                                        setDraggingStepId(null);
                                    }}
                                    onDragEnd={() => setDraggingStepId(null)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={step.completed}
                                        onChange={() => onToggleStep(plan.id, step.id)}
                                    />

                                    {!isEditing ? (
                                        <>
                                            <button
                                                type="button"
                                                className="plan-panel__step-title"
                                                onClick={() => startEdit(step.id, step.title)}
                                            >
                                                {step.title}
                                            </button>

                                            <button
                                                type="button"
                                                className="plan-panel__step-delete"
                                                onClick={() => {
                                                    const res = onRemoveStep(plan.id, step.id);
                                                    if (!res.ok) {
                                                        alert(res.error);
                                                        return;
                                                    }
                                                    if (editingStepId === step.id) cancelEdit();
                                                }}
                                                aria-label="Delete step"
                                                title="Delete"
                                            >
                                                ×
                                            </button>
                                        </>
                                    ) : (
                                        <input
                                            className="plan-panel__step-edit input"
                                            value={draftEditTitle}
                                            onChange={(e) => setDraftEditTitle(e.target.value)}
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === "Escape") cancelEdit();
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    commitEdit(plan.id, step.id);
                                                }
                                            }}
                                            onBlur={() => commitEdit(plan.id, step.id)}
                                        />
                                    )}
                                </li>
                            );
                        })}
                    </ul>

                )}

                {/* Trello-style add step */}
                {!isAddingStep ? (
                    <button
                        type="button"
                        className="plan-panel__add-link button"
                        onClick={() => setIsAddingStep(true)}
                    >
                        + Add a step
                    </button>
                ) : (
                    <div className="plan-panel__add">
                        <input
                            className="plan-panel__add-input input"
                            type="text"
                            placeholder="Enter a step..."
                            value={draftStepTitle}
                            onChange={(e) => setDraftStepTitle(e.target.value)}
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === "Escape") resetAddStep();
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    const title = draftStepTitle.trim();
                                    if (!title) return;

                                    const res = onAddStep(plan.id, title);
                                    if (!res.ok) {
                                        alert(res.error);
                                        return;
                                    }
                                    resetAddStep();
                                }
                            }}
                        />

                        <div className="plan-panel__add-actions">
                            <button
                                type="button"
                                className="button"
                                onClick={() => {
                                    const title = draftStepTitle.trim();
                                    if (!title) return;

                                    const res = onAddStep(plan.id, title);
                                    if (!res.ok) {
                                        alert(res.error);
                                        return;
                                    }
                                    resetAddStep();
                                }}
                            >
                                Add
                            </button>

                            <button type="button" className="button" onClick={resetAddStep}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
