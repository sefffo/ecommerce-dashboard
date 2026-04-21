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
  Pending:          { label: 'Pending',           className: 'badge-warning' },
  Processing:       { label: 'Processing',        className: 'badge-info' },
  PaymentPending:   { label: 'Payment pending',   className: 'badge-warning' },
  PaymentReceived:  { label: 'Payment received',  className: 'badge-info' },
  Paid:             { label: 'Paid',              className: 'badge-success' },
  Preparing:        { label: 'Preparing',         className: 'badge-info' },
  Shipped:          { label: 'Shipped',           className: 'badge-accent' },
  Delivered:        { label: 'Delivered',         className: 'badge-success' },
  Cancelled:        { label: 'Cancelled',         className: 'badge-error' },
}

// Used by the Topbar to show a contextual page title. Keep in sync with App routes.
export const ROUTE_TITLES: { match: (pathname: string) => boolean; title: string; subtitle?: string }[] = [
  { match: (p) => p === '/dashboard',                          title: 'Overview',        subtitle: 'Key metrics and recent activity' },
  { match: (p) => p.startsWith('/dashboard/products'),         title: 'Products',        subtitle: 'Manage your catalog' },
  { match: (p) => p.startsWith('/dashboard/brands'),           title: 'Brands',          subtitle: 'Product brands' },
  { match: (p) => p.startsWith('/dashboard/types'),            title: 'Types',           subtitle: 'Product categories' },
  { match: (p) => /^\/dashboard\/orders\/.+/.test(p),           title: 'Order detail' },
  { match: (p) => p.startsWith('/dashboard/orders'),           title: 'Orders',          subtitle: 'Customer orders' },
  { match: (p) => p.startsWith('/dashboard/users'),            title: 'Users',           subtitle: 'Accounts and roles' },
]

export function getRouteTitle(pathname: string): { title: string; subtitle?: string } {
  return ROUTE_TITLES.find((r) => r.match(pathname)) ?? { title: 'Dashboard' }
}
