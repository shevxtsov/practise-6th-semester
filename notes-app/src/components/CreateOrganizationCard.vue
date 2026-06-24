<script setup lang="ts">
import { ref } from 'vue'
import {
  NButton,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  useMessage,
  type FormInst,
  type FormRules,
} from 'naive-ui'

import { useOrganizationStore } from '@/stores/organization'
import type { OrganizationDraft } from '@/types/organization'

const emit = defineEmits<{ created: [] }>()

const organizationStore = useOrganizationStore()
const message = useMessage()

const formRef = ref<FormInst | null>(null)
const submitting = ref(false)

const model = ref<OrganizationDraft>({
  name: '',
  description: '',
  industry: '',
})

const industryOptions = [
  { label: 'IT и разработка', value: 'it' },
  { label: 'Образование', value: 'education' },
  { label: 'Торговля', value: 'retail' },
  { label: 'Производство', value: 'manufacturing' },
  { label: 'Услуги', value: 'services' },
  { label: 'Другое', value: 'other' },
]

const rules: FormRules = {
  name: {
    required: true,
    trigger: ['blur', 'input'],
    message: 'Укажите название организации',
  },
  industry: {
    required: true,
    trigger: ['blur', 'change'],
    message: 'Выберите сферу деятельности',
  },
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  submitting.value = true
  try {
    organizationStore.createOrganization({
      name: model.value.name.trim(),
      description: model.value.description.trim(),
      industry: model.value.industry,
    })
    message.success('Организация создана')
    emit('created')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="create-form">
    <p class="hint">
      Чтобы начать работу, создайте организацию. Вся дальнейшая логика приложения
      будет строиться в её рамках.
    </p>

    <NForm
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="top"
      @submit.prevent="handleSubmit"
    >
      <NFormItem label="Название" path="name">
        <NInput
          v-model:value="model.name"
          placeholder="Например, ООО «Ромашка»"
          clearable
        />
      </NFormItem>

      <NFormItem label="Сфера деятельности" path="industry">
        <NSelect
          v-model:value="model.industry"
          :options="industryOptions"
          placeholder="Выберите сферу"
        />
      </NFormItem>

      <NFormItem label="Описание" path="description">
        <NInput
          v-model:value="model.description"
          type="textarea"
          placeholder="Краткое описание организации (необязательно)"
          :autosize="{ minRows: 3, maxRows: 6 }"
        />
      </NFormItem>

      <NButton
        type="primary"
        block
        attr-type="submit"
        :loading="submitting"
        @click="handleSubmit"
      >
        Создать организацию
      </NButton>
    </NForm>
  </div>
</template>

<style scoped>
.hint {
  margin: 0 0 1.25rem;
  color: var(--n-text-color-3, #909399);
  font-size: 0.9rem;
}
</style>
