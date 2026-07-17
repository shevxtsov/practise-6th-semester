<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { NAvatar, NButton, NDrawer, NDrawerContent } from 'naive-ui'

import OrganizationOverview from '@/components/OrganizationOverview.vue'
import OrganizationSelector from '@/components/OrganizationSelector.vue'
import { useOrganizationStore } from '@/stores/organization'

const organizationStore = useOrganizationStore()
const { organization, organizations, hasOrganization } =
  storeToRefs(organizationStore)

const open = ref(false)

const initials = computed(() =>
  organization.value
    ? organization.value.name.trim().charAt(0).toUpperCase()
    : '',
)

const triggerLabel = computed(() =>
  organizations.value.length > 0 ? 'Выбрать организацию' : 'Создать организацию',
)

const drawerTitle = computed(() => {
  if (hasOrganization.value) return 'Организация'
  return organizations.value.length > 0 ? 'Выбор организации' : 'Создание организации'
})
</script>

<template>
  <div class="profile">
    <button
      v-if="hasOrganization"
      type="button"
      class="profile-trigger"
      @click="open = true"
    >
      <NAvatar round size="small" color="#2080f0">{{ initials }}</NAvatar>
      <span class="profile-name">{{ organization?.name }}</span>
    </button>

    <NButton v-else type="primary" size="small" @click="open = true">
      {{ triggerLabel }}
    </NButton>

    <NDrawer v-model:show="open" width="min(480px, 100vw)" placement="right">
      <NDrawerContent :title="drawerTitle" closable>
        <OrganizationOverview v-if="hasOrganization" />
        <OrganizationSelector v-else @created="open = false" />
      </NDrawerContent>
    </NDrawer>
  </div>
</template>

<style scoped>
.profile-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  color: inherit;
  font: inherit;
  transition: background-color 0.2s;
}

.profile-trigger:hover {
  background: rgba(0, 0, 0, 0.05);
}

.profile-name {
  font-weight: 500;
  max-width: 45vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
