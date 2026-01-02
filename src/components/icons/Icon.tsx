import { PencilSquareIcon } from '@heroicons/react/24/solid'
import { XMarkIcon } from '@heroicons/react/24/solid'

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
