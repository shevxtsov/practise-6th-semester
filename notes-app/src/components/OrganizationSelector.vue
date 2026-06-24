<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
  NButton,
  NEmpty,
  NIcon,
  NList,
  NListItem,
  NPopconfirm,
  NThing,
  useMessage,
} from 'naive-ui'
import { AddOutline, ArrowBackOutline, TrashOutline } from '@vicons/ionicons5'

import CreateOrganizationCard from '@/components/CreateOrganizationCard.vue'
import { useOrganizationStore } from '@/stores/organization'

const emit = defineEmits<{ created: [] }>()

const organizationStore = useOrganizationStore()
const { organizations } = storeToRefs(organizationStore)
const message = useMessage()

const industryLabels: Record<string, string> = {
  it: 'IT и разработка',
  education: 'Образование',
  retail: 'Торговля',
  manufacturing: 'Производство',
  services: 'Услуги',
  other: 'Другое',
}

const mode = ref<'list' | 'create'>(
  organizations.value.length > 0 ? 'list' : 'create',
)

const handleEnter = (id: string) => {
  organizationStore.enterOrganization(id)
}

const handleRemove = (id: string) => {
  organizationStore.removeOrganization(id)
  message.info('Организация удалена')
  if (organizations.value.length === 0) mode.value = 'create'
}
</script>

<template>
  <div class="selector">
    <template v-if="mode === 'list'">
      <NList v-if="organizations.length" bordered clickable>
        <NListItem v-for="org in organizations" :key="org.id">
          <NThing
            :title="org.name"
            :description="industryLabels[org.industry] ?? org.industry"
          />
          <template #suffix>
            <div class="item-actions">
              <NButton size="small" type="primary" @click="handleEnter(org.id)">
                Войти
              </NButton>
              <NPopconfirm @positive-click="handleRemove(org.id)">
                <template #trigger>
                  <NButton size="small" quaternary type="error">
                    <template #icon>
                      <NIcon :component="TrashOutline" />
                    </template>
                  </NButton>
                </template>
                Удалить организацию? Все связанные данные будут потеряны.
              </NPopconfirm>
            </div>
          </template>
        </NListItem>
      </NList>

      <NEmpty v-else description="Организаций пока нет" />

      <NButton class="create-btn" block dashed @click="mode = 'create'">
        <template #icon>
          <NIcon :component="AddOutline" />
        </template>
        Создать новую организацию
      </NButton>
    </template>

    <template v-else>
      <NButton
        v-if="organizations.length"
        class="back-btn"
        size="small"
        quaternary
        @click="mode = 'list'"
      >
        <template #icon>
          <NIcon :component="ArrowBackOutline" />
        </template>
        К списку организаций
      </NButton>

      <CreateOrganizationCard @created="emit('created')" />
    </template>
  </div>
</template>

<style scoped>
.item-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.create-btn {
  margin-top: 1rem;
}

.back-btn {
  margin-bottom: 1rem;
}
</style>
