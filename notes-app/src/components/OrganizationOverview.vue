<script setup lang="ts">
import { computed } from 'vue'
import {
  NButton,
  NDescriptions,
  NDescriptionsItem,
  NIcon,
  NPopconfirm,
  NTag,
  useMessage,
} from 'naive-ui'
import { LogOutOutline, TrashOutline } from '@vicons/ionicons5'

import { useOrganizationStore } from '@/stores/organization'

const organizationStore = useOrganizationStore()
const message = useMessage()

const org = computed(() => organizationStore.organization)

const industryLabels: Record<string, string> = {
  it: 'IT и разработка',
  education: 'Образование',
  retail: 'Торговля',
  manufacturing: 'Производство',
  services: 'Услуги',
  other: 'Другое',
}

const createdAt = computed(() =>
  org.value
    ? new Date(org.value.createdAt).toLocaleString('ru-RU', {
        dateStyle: 'long',
        timeStyle: 'short',
      })
    : '',
)

const handleRemove = () => {
  organizationStore.removeOrganization()
  message.info('Организация удалена')
}

const handleLeave = () => {
  organizationStore.leaveOrganization()
  message.info('Вы вышли из организации')
}
</script>

<template>
  <div v-if="org" class="overview">
    <div class="overview-head">
      <h2 class="overview-title">{{ org.name }}</h2>
      <NTag type="success" size="small" round>Активна</NTag>
    </div>

    <NDescriptions label-placement="left" :column="1" bordered>
      <NDescriptionsItem label="Сфера деятельности">
        {{ industryLabels[org.industry] ?? org.industry }}
      </NDescriptionsItem>
      <NDescriptionsItem label="Описание">
        {{ org.description || '—' }}
      </NDescriptionsItem>
      <NDescriptionsItem label="Создана">
        {{ createdAt }}
      </NDescriptionsItem>
    </NDescriptions>

    <div class="overview-actions">
      <NButton size="small" @click="handleLeave">
        <template #icon>
          <NIcon :component="LogOutOutline" />
        </template>
        Выйти из организации
      </NButton>

      <NPopconfirm @positive-click="handleRemove">
        <template #trigger>
          <NButton type="error" ghost size="small">
            <template #icon>
              <NIcon :component="TrashOutline" />
            </template>
            Удалить организацию
          </NButton>
        </template>
        Удалить организацию? Все связанные данные будут потеряны.
      </NPopconfirm>
    </div>
  </div>
</template>

<style scoped>
.overview-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.overview-title {
  margin: 0;
  font-size: 1.2rem;
}

.overview-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
}
</style>
