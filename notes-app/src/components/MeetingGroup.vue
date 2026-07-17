<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  NButton,
  NCard,
  NEmpty,
  NIcon,
  NPopconfirm,
  NTag,
  NThing,
  useMessage,
} from 'naive-ui'
import {
  AddOutline,
  CreateOutline,
  DownloadOutline,
  TrashOutline,
} from '@vicons/ionicons5'

import NoteFormModal from '@/components/NoteFormModal.vue'
import { useNotesStore } from '@/stores/notes'
import { meetingTypeLabels, type Meeting, type Note } from '@/types/note'
import { downloadNote } from '@/utils/noteFile'

const props = defineProps<{ meeting: Meeting }>()
const emit = defineEmits<{ edit: [meeting: Meeting] }>()

const notesStore = useNotesStore()
const message = useMessage()

const notes = computed(() => notesStore.notesByMeeting(props.meeting.id))

const meetingDate = computed(() =>
  new Date(props.meeting.date).toLocaleDateString('ru-RU', {
    dateStyle: 'long',
  }),
)

const formatNoteDate = (value: string) => {
  return new Date(value).toLocaleString('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

const noteModalShow = ref(false)
const editingNote = ref<Note | null>(null)

const openCreateNote = () => {
  editingNote.value = null
  noteModalShow.value = true
}

const openEditNote = (note: Note) => {
  editingNote.value = note
  noteModalShow.value = true
}

const handleRemoveNote = (id: string) => {
  notesStore.removeNote(id)
  message.info('Заметка удалена')
}

const handleDownloadNote = (note: Note) => {
  downloadNote(note, props.meeting)
  message.success('Файл заметки сохранён')
}

const handleRemoveMeeting = () => {
  notesStore.removeMeeting(props.meeting.id)
  message.info('Мероприятие удалено')
}
</script>

<template>
  <NCard class="group" :bordered="true">
    <template #header>
      <div class="group-head">
        <div class="group-title">
          <span class="group-name">{{ meeting.title }}</span>
          <NTag size="small" type="info" round>
            {{ meetingTypeLabels[meeting.type] ?? meeting.type }}
          </NTag>
        </div>
        <span class="group-date">{{ meetingDate }}</span>
      </div>
    </template>

    <template #header-extra>
      <div class="head-actions">
        <NButton
          quaternary
          size="small"
          title="Редактировать мероприятие"
          @click="emit('edit', meeting)"
        >
          <template #icon>
            <NIcon :component="CreateOutline" />
          </template>
        </NButton>
        <NPopconfirm @positive-click="handleRemoveMeeting">
          <template #trigger>
            <NButton
              quaternary
              size="small"
              type="error"
              title="Удалить мероприятие"
            >
              <template #icon>
                <NIcon :component="TrashOutline" />
              </template>
            </NButton>
          </template>
          Удалить мероприятие со всеми заметками?
        </NPopconfirm>
      </div>
    </template>

    <p v-if="meeting.description" class="group-description">
      {{ meeting.description }}
    </p>

    <div v-if="notes.length" class="notes">
      <div v-for="note in notes" :key="note.id" class="note">
        <NThing>
          <template #header>{{ note.title }}</template>
          <template #header-extra>
            <span class="note-date">{{ formatNoteDate(note.datetime) }}</span>
          </template>
          <p class="note-content">{{ note.content }}</p>
          <template #footer>
            <div class="note-actions">
              <NButton text size="tiny" @click="openEditNote(note)">
                <template #icon>
                  <NIcon :component="CreateOutline" />
                </template>
                Изменить
              </NButton>
              <NButton text size="tiny" @click="handleDownloadNote(note)">
                <template #icon>
                  <NIcon :component="DownloadOutline" />
                </template>
                Скачать
              </NButton>
              <NPopconfirm @positive-click="handleRemoveNote(note.id)">
                <template #trigger>
                  <NButton text size="tiny" type="error">
                    <template #icon>
                      <NIcon :component="TrashOutline" />
                    </template>
                    Удалить
                  </NButton>
                </template>
                Удалить заметку?
              </NPopconfirm>
            </div>
          </template>
        </NThing>
      </div>
    </div>

    <NEmpty v-else size="small" description="В этом мероприятии пока нет заметок" />

    <template #action>
      <NButton size="small" dashed block @click="openCreateNote">
        <template #icon>
          <NIcon :component="AddOutline" />
        </template>
        Добавить заметку
      </NButton>
    </template>

    <NoteFormModal
      v-model:show="noteModalShow"
      :meeting-id="meeting.id"
      :note="editingNote"
    />
  </NCard>
</template>

<style scoped>
.group {
  height: 100%;
}

.group-head {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.group-title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.group-name {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.group-title :deep(.n-tag) {
  flex-shrink: 0;
}

.group-date {
  font-size: 0.8rem;
  font-weight: 400;
  color: var(--n-text-color-3, #909399);
}

.head-actions {
  display: flex;
  gap: 0.25rem;
}

.group-description {
  margin: 0 0 1rem;
  color: var(--n-text-color-2, #606266);
}

.notes {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.note {
  padding: 0.75rem 0.9rem;
  border: 1px solid var(--n-border-color, #efeff5);
  border-radius: 8px;
}

.note-date {
  font-size: 0.78rem;
  color: var(--n-text-color-3, #909399);
  white-space: nowrap;
}

.note-content {
  margin: 0.4rem 0 0;
  white-space: pre-wrap;
}

.note-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  margin-top: 0.5rem;
}

@media (max-width: 480px) {
  .group :deep(.n-card-header) {
    padding: 1rem 1rem 0.5rem;
  }

  .group :deep(.n-card__content),
  .group :deep(.n-card__action) {
    padding: 0.75rem 1rem;
  }

  .note {
    padding: 0.6rem 0.7rem;
  }

  .note :deep(.n-thing-header) {
    flex-wrap: wrap;
    gap: 0.15rem 0.5rem;
  }

  .note-date {
    white-space: normal;
  }

  .note-actions {
    gap: 0.4rem 0.85rem;
  }
}
</style>
