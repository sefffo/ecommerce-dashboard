export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://web-api-revesion-c2chh0cyctd7dpcn.eastasia-01.azurewebsites.net'

export const ROLES = {
  ADMIN: 'Admin',
  SUPER_ADMIN: 'SuperAdmin',
} as const
