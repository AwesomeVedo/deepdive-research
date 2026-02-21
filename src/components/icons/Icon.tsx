// Icon.tsx
import {
    PencilSquareIcon,
    XMarkIcon,
    PlusIcon,
    CalendarDaysIcon,
    ExclamationTriangleIcon,
    EllipsisVerticalIcon,
    TrashIcon,
    CheckCircleIcon,
    CubeTransparentIcon,
    MinusCircleIcon,
    PauseCircleIcon,
    CheckIcon,
} from "@heroicons/react/24/outline";
import { EyeIcon, FunnelIcon } from "@heroicons/react/16/solid";
import type React from "react";

type MoreActionsIconProps = {
    onClick?: (e: React.MouseEvent) => void;
};

export function ShowIcon() {
    return (
        <div className="icon-button show-icon">
            <EyeIcon />
        </div>
    );
}

export function FilterIcon() {
    return (
        <div className="icon-button filter-icon">
            <FunnelIcon />
        </div>
    );
}

export function VentItemSaveIcon() {
    return (
        <div className="icon-button vent-item-save">
            <CheckIcon />
        </div>
    );
}

export function DefferedIcon() {
    return (
        <div className="icon-button">
            <PauseCircleIcon />
        </div>
    );
}

export function OpenIcon() {
    return (
        <div className="icon-button">
            <MinusCircleIcon />
        </div>
    );
}

export function ReleasedIcon() {
    return (
        <div className="icon-button">
            <CubeTransparentIcon />
        </div>
    );
}

export function CompletedIcon() {
    return (
        <div className="icon-button">
            <CheckCircleIcon />
        </div>
    );
}

export function EditIcon() {
    return (
        <div className="icon-button">
            <PencilSquareIcon />
        </div>
    );
}

export function CancelIcon() {
    return (
        <div className="icon-button">
            <XMarkIcon />
        </div>
    );
}

export function AddIcon() {
    return (
        <div className="icon-button">
            <PlusIcon />
        </div>
    );
}

export function CalendarIcon() {
    return (
        <div className="icon-button">
            <CalendarDaysIcon />
        </div>
    );
}

export function StressIcon() {
    return (
        <div className="icon-button">
            <ExclamationTriangleIcon />
        </div>
    );
}

export function DeleteIcon() {
    return (
        <div className="icon-button">
            <TrashIcon />
        </div>
    );
}

/**
 * IMPORTANT:
 * This must NOT be a <button>, because the parent (VentItemRow) already wraps
 * this icon in a <button>. Nested buttons cause validateDOMNesting + hydration errors.
 */
export function MoreActionsIcon({ onClick }: MoreActionsIconProps) {
    return (
        <div className="icon-button more-actions" onClick={onClick} role="img" aria-hidden="true">
            <EllipsisVerticalIcon />
        </div>
    );
}