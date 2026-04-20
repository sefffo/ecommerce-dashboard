import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export function formatDate(dateStr: string): string {
  try { return format(new Date(dateStr), 'MMM d, yyyy') } catch { return dateStr }
}

export function formatDateTime(dateStr: string): string {
  try { return format(new Date(dateStr), 'MMM d, yyyy HH:mm') } catch { return dateStr }
}

export const ORDER_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  Pending:    { label: 'Pending',    className: 'badge-warning' },
  Processing: { label: 'Processing', className: 'badge-info' },
  Shipped:    { label: 'Shipped',    className: 'badge-neutral' },
  Delivered:  { label: 'Delivered',  className: 'badge-success' },
  Cancelled:  { label: 'Cancelled',  className: 'badge-error' },
}
