import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' }

export function Modal({ open, onOpenChange, title, children, size = 'md' }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full',
            'bg-surface border border-white/[0.08] rounded-xl shadow-2xl animate-fadeIn p-6',
            sizes[size]
          )}
        >
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-text font-semibold text-base">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button className="btn-ghost p-1.5"><X className="w-4 h-4" /></button>
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
