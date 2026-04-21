import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | null | undefined): string {
  const n = typeof amount === 'number' && Number.isFinite(amount) ? amount : 0
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '\u2014'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '\u2014'
  try { return format(d, 'MMM d, yyyy') } catch { return '\u2014' }
}

export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '\u2014'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '\u2014'
  try { return format(d, 'MMM d, yyyy HH:mm') } catch { return '\u2014' }
}

export const ORDER_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  Pending:    { label: 'Pending',    className: 'badge-warning' },
  Processing: { label: 'Processing', className: 'badge-info' },
  Shipped:    { label: 'Shipped',    className: 'badge-neutral' },
  Delivered:  { label: 'Delivered',  className: 'badge-success' },
  Cancelled:  { label: 'Cancelled',  className: 'badge-error' },
}
