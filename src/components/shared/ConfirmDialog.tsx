import { Loader2, AlertTriangle, Info } from 'lucide-react'
import { Modal } from './Modal'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
  loading?: boolean
  /**
   * 'danger' → red icon, red confirm button, default label "Delete".
   * 'primary' → sky icon, primary confirm button, default label "Confirm".
   * Legacy `danger` boolean is still accepted for backward compat.
   */
  tone?: 'danger' | 'primary'
  danger?: boolean
  confirmLabel?: string
  cancelLabel?: string
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  loading,
  tone,
  danger,
  confirmLabel,
  cancelLabel = 'Cancel',
}: ConfirmDialogProps) {
  // resolve tone: explicit `tone` wins, otherwise legacy `danger` boolean (default true)
  const resolvedTone: 'danger' | 'primary' =
    tone ?? (danger === false ? 'primary' : 'danger')

  const isDanger = resolvedTone === 'danger'
  const Icon = isDanger ? AlertTriangle : Info
  const defaultConfirm = isDanger ? 'Delete' : 'Confirm'
  const confirmText = confirmLabel ?? defaultConfirm

  return (
    <Modal open={open} onOpenChange={onOpenChange} size="sm" hideHeader>
      <div className="text-center pt-2">
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border',
            isDanger
              ? 'bg-red-500/10 border-red-500/20 text-red-400'
              : 'bg-accent/10 border-accent/20 text-accent',
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-text font-semibold text-base mb-2">{title}</h3>
        <p className="text-text-2 text-sm mb-6 leading-relaxed">{description}</p>
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
          <button
            className="btn-secondary flex-1"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            className={cn('flex-1', isDanger ? 'btn-danger' : 'btn-primary')}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Working…
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}
