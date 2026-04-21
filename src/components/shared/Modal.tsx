import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  // Supports either Radix-style onOpenChange OR legacy onClose. Prefer onOpenChange.
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  // Hide the default header row. Useful when the body renders its own icon + title (ConfirmDialog).
  hideHeader?: boolean
}

const sizes = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
}

export function Modal({
  open,
  onOpenChange,
  onClose,
  title,
  description,
  children,
  size = 'md',
  hideHeader = false,
}: ModalProps) {
  const handleOpenChange = (next: boolean) => {
    onOpenChange?.(next)
    if (!next) onClose?.()
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 data-[state=open]:animate-fadeIn" />
        <Dialog.Content
          className={cn(
            // Mobile-first: bottom sheet feel on small screens, centered dialog on sm+
            'fixed z-50 flex flex-col',
            'inset-x-0 bottom-0 rounded-t-2xl',
            'sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl',
            'w-full sm:w-[calc(100vw-2rem)]',
            sizes[size],
            'max-h-[92dvh] bg-surface border border-white/[0.08] shadow-elev-3',
            'data-[state=open]:animate-slideUp sm:data-[state=open]:animate-scaleIn',
          )}
          aria-describedby={description ? 'modal-description' : undefined}
        >
          {/* Drag handle on mobile */}
          <div className="sm:hidden flex justify-center py-2 shrink-0">
            <div className="h-1 w-10 rounded-full bg-white/10" />
          </div>

          {!hideHeader && (title || onOpenChange || onClose) && (
            <div className="flex items-start justify-between gap-4 px-5 sm:px-6 pt-2 sm:pt-5 pb-4 shrink-0">
              <div className="min-w-0 flex-1">
                {title && (
                  <Dialog.Title className="text-text font-semibold text-base tracking-tight truncate">
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description
                    id="modal-description"
                    className="text-text-2 text-sm mt-1"
                  >
                    {description}
                  </Dialog.Description>
                )}
              </div>
              <Dialog.Close asChild>
                <button className="btn-icon -mt-1 -mr-1 shrink-0" aria-label="Close">
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>
          )}

          {/* Scrollable body */}
          <div className="px-5 sm:px-6 pb-5 sm:pb-6 overflow-y-auto safe-bottom">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
