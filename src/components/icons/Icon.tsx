// Icon.tsx
import { PencilSquareIcon, XMarkIcon, PlusIcon, CalendarDaysIcon, ExclamationTriangleIcon, EllipsisVerticalIcon, TrashIcon, CheckCircleIcon, CubeTransparentIcon, MinusCircleIcon, PauseCircleIcon, CheckIcon } from '@heroicons/react/24/outline'

type MoreActionsIconProps = {
    onClick?: () => void;
};

export function VentItemSaveIcon() {
    return (
        <div className='icon-button vent-item-save'>
            <CheckIcon />
        </div>
    )
}

export function DefferedIcon() {
    return (
        <div className='icon-button'>
            <PauseCircleIcon />
        </div>
    )
}

export function OpenIcon() {
    return (
        <div className='icon-button'>
            <MinusCircleIcon />
        </div>
    )
}

export function ReleasedIcon() {
    return (
        <div className='icon-button'>
            <CubeTransparentIcon />
        </div>
    )
}

export function CompletedIcon() {
    return (
        <div className='icon-button'>
            <CheckCircleIcon />
        </div>
    )
}

export function EditIcon() {
    return (
        <div className='icon-button'>
            <PencilSquareIcon />
        </div>
    )
}

export function CancelIcon() {
    return (
        <div className='icon-button'>
            <XMarkIcon />
        </div>
    )
}

export function AddIcon() {
    return (
        <div className='icon-button'>
            <PlusIcon />
        </div>
    )
}

export function CalendarIcon() {
    return (
        <div className='icon-button'>
            <CalendarDaysIcon />
        </div>
    )
}

export function StressIcon() {
    return (
        <div className='icon-button'>
            <ExclamationTriangleIcon />
        </div>
    )
}

export function DeleteIcon() {
    return (
        <div className='icon-button'>
            <TrashIcon />
        </div>
    )
}

export function MoreActionsIcon({ onClick }: MoreActionsIconProps) {
    return (
        <button type="button" className='icon-button more-actions' onClick={onClick}>
            <EllipsisVerticalIcon />
        </button>
    )
}
