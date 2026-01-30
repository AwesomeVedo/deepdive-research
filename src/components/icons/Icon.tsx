import { PencilSquareIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/solid'

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

