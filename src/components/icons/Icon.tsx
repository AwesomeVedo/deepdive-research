// Icon.tsx
import { PencilSquareIcon, XMarkIcon, PlusIcon, CalendarDaysIcon, ExclamationTriangleIcon, EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/24/outline'

type MoreActionsIconProps = {
    onClick?: () => void;
};


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
