<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  NButton,
  NDatePicker,
  NForm,
  NFormItem,
  NInput,
  NModal,
  NSelect,
  useMessage,
  type FormInst,
  type FormRules,
} from 'naive-ui'

import { useNotesStore } from '@/stores/notes'
import { meetingTypeOptions, type Meeting } from '@/types/note'

const props = defineProps<{ meeting?: Meeting | null }>()

const emit = defineEmits<{ created: [meeting: Meeting] }>()

const show = defineModel<boolean>('show', { default: false })

const notesStore = useNotesStore()
const message = useMessage()

const formRef = ref<FormInst | null>(null)
const submitting = ref(false)

interface MeetingForm {
  title: string
  type: string
  date: number
  description: string
}

const emptyModel = (): MeetingForm => {
  return {
    title: '',
    type: 'meeting',
    date: Date.now(),
    description: '',
  }
}

const model = ref<MeetingForm>(emptyModel())

const isEdit = computed(() => Boolean(props.meeting))

watch(show, (open) => {
  if (!open) return
  if (props.meeting) {
    model.value = {
      title: props.meeting.title,
      type: props.meeting.type,
      date: new Date(props.meeting.date).getTime(),
      description: props.meeting.description,
    }
  } else {
    model.value = emptyModel()
  }
})

const rules: FormRules = {
  title: {
    required: true,
    trigger: ['blur', 'input'],
    message: 'Укажите название мероприятия',
  },
  type: {
    required: true,
    trigger: ['blur', 'change'],
    message: 'Выберите тип мероприятия',
  },
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  submitting.value = true
  try {
    const draft = {
      title: model.value.title.trim(),
      type: model.value.type,
      date: new Date(model.value.date).toISOString(),
      description: model.value.description.trim(),
    }

    if (props.meeting) {
      notesStore.updateMeeting(props.meeting.id, draft)
      message.success('Мероприятие обновлено')
    } else {
      const meeting = notesStore.createMeeting(draft)
      message.success('Мероприятие создано')
      if (meeting) emit('created', meeting)
    }
    show.value = false
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <NModal
    v-model:show="show"
    preset="card"
    class="meeting-modal"
    :title="isEdit ? 'Редактирование мероприятия' : 'Новое мероприятие'"
    :style="{ maxWidth: '520px' }"
  >
    <NForm
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="top"
      @submit.prevent="handleSubmit"
    >
      <NFormItem label="Название" path="title">
        <NInput
          v-model:value="model.title"
          placeholder="Например, Планёрка отдела разработки"
          clearable
        />
      </NFormItem>

      <NFormItem label="Тип мероприятия" path="type">
        <NSelect v-model:value="model.type" :options="meetingTypeOptions" />
      </NFormItem>

      <NFormItem label="Дата проведения" path="date">
        <NDatePicker v-model:value="model.date" type="date" class="full" />
      </NFormItem>

      <NFormItem label="Описание" path="description">
        <NInput
          v-model:value="model.description"
          type="textarea"
          placeholder="Краткое описание мероприятия (необязательно)"
          :autosize="{ minRows: 2, maxRows: 5 }"
        />
      </NFormItem>
    </NForm>

    <template #footer>
      <div class="footer">
        <NButton @click="show = false">Отмена</NButton>
        <NButton type="primary" :loading="submitting" @click="handleSubmit">
          {{ isEdit ? 'Сохранить' : 'Создать' }}
        </NButton>
      </div>
    </template>
  </NModal>
</template>

<style scoped>
.full {
  width: 100%;
}

.footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
</style>
