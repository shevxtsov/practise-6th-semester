<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import {
  NButton,
  NDatePicker,
  NForm,
  NFormItem,
  NIcon,
  NInput,
  NInputGroup,
  NModal,
  NSelect,
  useMessage,
  type FormInst,
  type FormRules,
} from 'naive-ui'
import { AddOutline } from '@vicons/ionicons5'

import MeetingFormModal from '@/components/MeetingFormModal.vue'
import { useNotesStore } from '@/stores/notes'
import type { Meeting, Note } from '@/types/note'

const props = defineProps<{
  meetingId?: string
  note?: Note | null
}>()

const show = defineModel<boolean>('show', { default: false })

const notesStore = useNotesStore()
const { organizationMeetings } = storeToRefs(notesStore)
const message = useMessage()

const formRef = ref<FormInst | null>(null)
const submitting = ref(false)

const meetingModalShow = ref(false)

interface NoteForm {
  meetingId: string
  title: string
  datetime: number
  content: string
}

const emptyModel = (): NoteForm => {
  return {
    meetingId: '',
    title: '',
    datetime: Date.now(),
    content: '',
  }
}

const model = ref<NoteForm>(emptyModel())

const isEdit = computed(() => Boolean(props.note))

const showMeetingPicker = computed(() => !props.meetingId && !props.note)

const meetingOptions = computed(() =>
  organizationMeetings.value.map((m) => ({ label: m.title, value: m.id })),
)

watch(show, (open) => {
  if (!open) return
  if (props.note) {
    model.value = {
      ...emptyModel(),
      title: props.note.title,
      datetime: new Date(props.note.datetime).getTime(),
      content: props.note.content,
    }
  } else {
    const fresh = emptyModel()
    
    if (organizationMeetings.value.length > 0) {
      fresh.meetingId = organizationMeetings.value[0].id
    }
    model.value = fresh
  }
})

const handleMeetingCreated = (meeting: Meeting) => {
  model.value.meetingId = meeting.id
}

const rules = computed<FormRules>(() => {
  const base: FormRules = {
    title: {
      required: true,
      trigger: ['blur', 'input'],
      message: 'Укажите заголовок заметки',
    },
    content: {
      required: true,
      trigger: ['blur', 'input'],
      message: 'Заполните содержание заметки',
    },
  }

  if (showMeetingPicker.value) {
    base.meetingId = {
      required: true,
      trigger: ['blur', 'change'],
      message: 'Выберите мероприятие',
    }
  }

  return base
})

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  submitting.value = true
  try {
    const targetMeetingId = showMeetingPicker.value
      ? model.value.meetingId
      : props.meetingId ?? props.note?.meetingId ?? null

    const draft = {
      title: model.value.title.trim(),
      datetime: new Date(model.value.datetime).toISOString(),
      content: model.value.content.trim(),
    }

    if (props.note) {
      notesStore.updateNote(props.note.id, draft)
      message.success('Заметка обновлена')
    } else if (targetMeetingId) {
      notesStore.createNote(targetMeetingId, draft)
      message.success('Заметка добавлена')
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
    :title="isEdit ? 'Редактирование заметки' : 'Новая заметка'"
    :style="{ maxWidth: '520px' }"
  >
    <NForm
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="top"
      @submit.prevent="handleSubmit"
    >
      <NFormItem v-if="showMeetingPicker" label="Мероприятие" path="meetingId">
        <NInputGroup>
          <NSelect
            v-model:value="model.meetingId"
            :options="meetingOptions"
            placeholder="Выберите мероприятие"
          />
          <NButton title="Новое мероприятие" @click="meetingModalShow = true">
            <template #icon>
              <NIcon :component="AddOutline" />
            </template>
          </NButton>
        </NInputGroup>
      </NFormItem>

      <NFormItem label="Заголовок" path="title">
        <NInput
          v-model:value="model.title"
          placeholder="Например, Итоги обсуждения"
          clearable
        />
      </NFormItem>

      <NFormItem label="Дата и время" path="datetime">
        <NDatePicker
          v-model:value="model.datetime"
          type="datetime"
          class="full"
        />
      </NFormItem>

      <NFormItem label="Содержание" path="content">
        <NInput
          v-model:value="model.content"
          type="textarea"
          placeholder="Текст заметки"
          :autosize="{ minRows: 4, maxRows: 12 }"
        />
      </NFormItem>
    </NForm>

    <MeetingFormModal
      v-model:show="meetingModalShow"
      @created="handleMeetingCreated"
    />

    <template #footer>
      <div class="footer">
        <NButton @click="show = false">Отмена</NButton>
        <NButton type="primary" :loading="submitting" @click="handleSubmit">
          {{ isEdit ? 'Сохранить' : 'Добавить' }}
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
