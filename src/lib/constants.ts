export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://e-commerce-dotnet-api-dkbsfuhaffbxhfar.southafricanorth-01.azurewebsites.net'

export const ROLES = {
  ADMIN: 'Admin',
  SUPER_ADMIN: 'SuperAdmin',
} as const
