import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { Organization, OrganizationDraft } from '@/types/organization'

export const useOrganizationStore = defineStore(
  'organization',
  () => {
    const organizations = ref<Organization[]>([])
    const currentOrganizationId = ref<string | null>(null)

    const organization = computed(
      () =>
        organizations.value.find((o) => o.id === currentOrganizationId.value) ??
        null,
    )

    const hasOrganization = computed(() => organization.value !== null)

    const createOrganization = (draft: OrganizationDraft) => {
      const org: Organization = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...draft,
      }
      organizations.value.push(org)
      currentOrganizationId.value = org.id
      return org
    }

    const updateOrganization = (patch: Partial<OrganizationDraft>) => {
      const index = organizations.value.findIndex(
        (o) => o.id === currentOrganizationId.value,
      )
      if (index === -1) return
      organizations.value[index] = { ...organizations.value[index], ...patch }
    }

    const leaveOrganization = () => {
      currentOrganizationId.value = null
    }

    const enterOrganization = (id: string) => {
      if (organizations.value.some((o) => o.id === id)) {
        currentOrganizationId.value = id
      }
    }

    const removeOrganization = (id?: string) => {
      const targetId = id ?? currentOrganizationId.value
      if (!targetId) return
      organizations.value = organizations.value.filter((o) => o.id !== targetId)
      if (currentOrganizationId.value === targetId) {
        currentOrganizationId.value = null
      }
    }

    return {
      organizations,
      currentOrganizationId,
      organization,
      hasOrganization,
      createOrganization,
      updateOrganization,
      leaveOrganization,
      enterOrganization,
      removeOrganization,
    }
  },
  {
    persist: true
  }
)
