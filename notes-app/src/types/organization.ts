export interface Organization {
  id: string
  name: string
  description: string
  industry: string
  createdAt: string
}

export type OrganizationDraft = Omit<Organization, 'id' | 'createdAt'>
