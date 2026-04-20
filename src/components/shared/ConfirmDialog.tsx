import { Loader2, AlertTriangle } from 'lucide-react'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
  loading?: boolean
  danger?: boolean
}

export function ConfirmDialog({
  open, onOpenChange, title, description, onConfirm, loading, danger = true,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title="" size="sm">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-5 h-5 text-red-400" />
        </div>
        <h3 className="text-text font-semibold mb-2">{title}</h3>
        <p className="text-muted text-sm mb-6">{description}</p>
        <div className="flex gap-3">
          <button className="btn-secondary flex-1" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</button>
          <button
            className={danger ? 'btn-danger flex-1 justify-center' : 'btn-primary flex-1 justify-center'}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting…</> : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
