// Braindump.tsx
import { useState } from "react";
import { useVentItems } from "../../hooks/useVentItems";
import { VentItemRow } from "../../components/VentItemRow/VentItemRow";
import { FilterIcon, ShowIcon } from "../../components/icons/Icon";
import { usePlans } from "../../hooks/usePlans";
import { RightPanel } from "../../components/RightPanel/RightPanel";
import { PlanPanel } from "../../components/PlanPanel/PlanPanel";

import "./braindump.css";

type sortMode = "Smart" | "Stress" | "When" | "Newest" | "Oldest";
type showMode = "Open" | "Resolved" | "All";

export function Braindump() {
    const { ventItems, create, edit, remove } = useVentItems();
    const [itemTitle, setItemTitle] = useState("");
    const [itemWhen, setItemWhen] = useState<"Today" | "Soon" | "Later">("Soon");
    const [itemStress, setItemStress] = useState<number>(0);
    const [sortMode, setSortMode] = useState<sortMode>("Smart");
    const [showMode, setShowMode] = useState<showMode>("Open");
    const [openVentItemId, setOpenVentItemId] = useState<string | null>(null);

    // Plan variables
    const plans = usePlans();
    const selectedVentItem = openVentItemId
        ? ventItems.find((v) => v.id === openVentItemId) ?? null
        : null;

    const selectedPlan = openVentItemId
        ? plans.getByVentItemId(openVentItemId)
        : null;


    function whenRank(when?: string): number {
        switch (when) {
            case "Today":
                return 0;
            case "Soon":
                return 1;
            case "Later":
                return 2;
            default:
                return 99;
        }
    }

    function resolutionRank(resolution?: string): number {
        switch (resolution) {
            case "Open":
                return 0;
            case "Deferred":
                return 1;
            case "Completed":
                return 2;
            case "Released":
                return 3;
            default:
                return 99;
        }
    }

    function isResolved(resolution?: string): boolean {
        switch (resolution) {
            case "Completed":
                return true;
            case "Released":
                return true;
            default:
                return false;
        }
    }

    const visibleVentItems = ventItems.filter((item) => {
        if (showMode === "All") return true;
        if (showMode === "Open") return !isResolved(item.resolution);
        // "Resolved"
        return isResolved(item.resolution);
    });

    const copied = [...visibleVentItems];
    copied.sort((a, b) => {
        if (sortMode === "Newest") { return b.createdAt - a.createdAt; }
        if (sortMode === "Oldest") { return a.createdAt - b.createdAt; }
        if (sortMode === "Stress") {
            const s = b.stressLevel - a.stressLevel;
            if (s !== 0) return s;
            return b.createdAt - a.createdAt;
        }
        if (sortMode === "When") {
            const w = whenRank(a.when) - whenRank(b.when);
            if (w !== 0) return w;
            const s = b.stressLevel - a.stressLevel;
            if (s !== 0) return s;
            return b.createdAt - a.createdAt;
        }

        const r = resolutionRank(a.resolution) - resolutionRank(b.resolution);
        if (r !== 0) return r;

        const w = whenRank(a.when) - whenRank(b.when);
        if (w !== 0) return w;

        const s = b.stressLevel - a.stressLevel;
        if (s !== 0) return s;

        return b.createdAt - a.createdAt;
    });

    const sortedVentItems = copied;

    return (
        <div className="dash">
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
                                }}
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

                        <button type="submit">Add</button>
                    </form>
                </>
            </div>

            <div className="dash__panel">
                <div className="vent-filter--controls">
                    <ShowIcon />
                    <select
                        name="vent-filter--show"
                        className="input vent-filter--show"
                        value={showMode}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === "Open" || value === "Resolved" || value === "All") {
                                setShowMode(value);
                            }
                        }}
                    >
                        <option value="All">All</option>
                        <option value="Open">Open</option>
                        <option value="Resolved">Resolved</option>
                    </select>

                    <FilterIcon />
                    <select
                        name="vent-filter--sort"
                        className="input vent-filter--sort"
                        value={sortMode}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === "Smart" || value === "Stress" || value === "When" || value === "Newest" || value === "Oldest") {
                                setSortMode(value);
                            }
                        }}
                    >
                        <option value="Smart">Smart</option>
                        <option value="Stress">Stress</option>
                        <option value="When">When</option>
                        <option value="Newest">Newest</option>
                        <option value="Oldest">Oldest</option>
                    </select>
                </div>

                <h3>Vents</h3>

                <ul className="vent-list">
                    {sortedVentItems.map((item) => {
                        const plan = plans.getByVentItemId(item.id);

                        return (
                            <VentItemRow
                                key={item.id}
                                item={item}
                                plan={plan}
                                isPlanOpen={openVentItemId === item.id}
                                isSelected={openVentItemId === item.id}
                                onSelect={(ventItemId) => setOpenVentItemId(ventItemId)}
                                onCreatePlan={(ventItemId: string, title: string) => {
                                    const result = plans.createForVentItem(ventItemId, title);
                                    if (!result.ok) {
                                        alert(result.error);
                                        return;
                                    }
                                    // focus the right panel after create
                                    setOpenVentItemId(ventItemId);
                                }}
                                onViewPlan={(ventItemId) => setOpenVentItemId(ventItemId)}
                                onEdit={edit}
                                onRemove={remove}
                            />

                        );
                    })}
                </ul>
            </div>
            <div className="dash__right">
                <RightPanel
                    title="Plan"
                    subtitle={selectedVentItem ? selectedVentItem.title : undefined}
                >
                    <PlanPanel
                        ventItem={selectedVentItem}
                        plan={selectedPlan}
                        onCreatePlan={(ventItemId, title) => {
                            const res = plans.createForVentItem(ventItemId, title);
                            if (!res.ok) {
                                alert(res.error);
                                return;
                            }
                            setOpenVentItemId(ventItemId);
                        }}
                        onAddStep={(planId, title) => plans.addStep(planId, title)}
                        onToggleStep={(planId, stepId) => {
                            const res = plans.toggleStepCompleted(planId, stepId);
                            if (!res.ok) alert(res.error);
                        }}
                        onEditStep={(planId, stepId, title) => plans.editStep(planId, stepId, { title })}
                        onRemoveStep={(planId, stepId) => plans.removeStep(planId, stepId)}
                        onReorderSteps={(planId, orderedStepIds) => plans.reorderSteps(planId, orderedStepIds)}
                    />

                </RightPanel>
            </div>

        </div>
    );
}
