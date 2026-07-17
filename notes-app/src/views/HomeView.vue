<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
  NButton,
  NDatePicker,
  NEmpty,
  NIcon,
  NInput,
  NInputGroup,
} from 'naive-ui'
import { AddOutline, CloseOutline, SearchOutline } from '@vicons/ionicons5'

import MeetingFormModal from '@/components/MeetingFormModal.vue'
import MeetingGroup from '@/components/MeetingGroup.vue'
import NoteFormModal from '@/components/NoteFormModal.vue'
import { useOrganizationStore } from '@/stores/organization'
import { useNotesStore } from '@/stores/notes'
import type { Meeting } from '@/types/note'

const organizationStore = useOrganizationStore()
const { organization, hasOrganization } = storeToRefs(organizationStore)

const notesStore = useNotesStore()
const {
  organizationMeetings,
  visibleMeetings,
  searchQuery,
  searchRange,
  hasActiveSearch,
  matchedNotesCount,
} = storeToRefs(notesStore)

const noteModalShow = ref(false)

const meetingModalShow = ref(false)
const editingMeeting = ref<Meeting | null>(null)

const hasMeetings = computed(() => organizationMeetings.value.length > 0)

const openCreateNote = () => {
  noteModalShow.value = true
}

const openEditMeeting = (meeting: Meeting) => {
  editingMeeting.value = meeting
  meetingModalShow.value = true
}
</script>

<template>
  <div class="home">
    <NEmpty
      v-if="!hasOrganization"
      class="home-empty"
      description="Сначала выберите или создайте организацию"
    />

    <template v-else>
      <div class="home-head">
        <div>
          <h2 class="home-title">Заметки</h2>
          <p class="home-subtitle">Организация: {{ organization?.name }}</p>
        </div>
        <NButton type="primary" @click="openCreateNote">
          <template #icon>
            <NIcon :component="AddOutline" />
          </template>
          Новая заметка
        </NButton>
      </div>

      <template v-if="hasMeetings">
        <div class="search">
          <NInputGroup class="search-keyword">
            <NInput
              v-model:value="searchQuery"
              placeholder="Поиск по заголовку и тексту заметки"
              clearable
            >
              <template #prefix>
                <NIcon :component="SearchOutline" />
              </template>
            </NInput>
          </NInputGroup>

          <NDatePicker
            v-model:value="searchRange"
            type="datetimerange"
            class="search-range"
            clearable
            placeholder="Дата и время"
          />

          <NButton v-if="hasActiveSearch" quaternary @click="notesStore.clearSearch">
            <template #icon>
              <NIcon :component="CloseOutline" />
            </template>
            Сбросить
          </NButton>
        </div>

        <p v-if="hasActiveSearch" class="search-summary">
          Найдено заметок: {{ matchedNotesCount }}
        </p>

        <div v-if="visibleMeetings.length" class="groups">
          <MeetingGroup
            v-for="meeting in visibleMeetings"
            :key="meeting.id"
            :meeting="meeting"
            @edit="openEditMeeting"
          />
        </div>

        <NEmpty
          v-else
          class="home-empty"
          description="По заданным условиям ничего не найдено"
        >
          <template #extra>
            <NButton size="small" @click="notesStore.clearSearch">
              Сбросить поиск
            </NButton>
          </template>
        </NEmpty>
      </template>

      <NEmpty v-else class="home-empty" description="Пока нет заметок">
        <template #extra>
          <NButton size="small" @click="openCreateNote">
            Создать первую заметку
          </NButton>
        </template>
      </NEmpty>
    </template>

    <NoteFormModal v-model:show="noteModalShow" />
    <MeetingFormModal v-model:show="meetingModalShow" :meeting="editingMeeting" />
  </div>
</template>

<style scoped>
.home {
  padding: 2rem 1rem 4rem;
}

.home-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.home-title {
  margin: 0;
  font-size: 1.3rem;
}

.home-subtitle {
  margin: 0.25rem 0 0;
  color: var(--n-text-color-3, #909399);
  font-size: 0.88rem;
}

.search {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.search-keyword {
  flex: 1 1 260px;
}

.search-range {
  flex: 0 1 360px;
}

.search-summary {
  margin: 0 0 1.25rem;
  color: var(--n-text-color-3, #909399);
  font-size: 0.85rem;
}

.groups {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  align-items: start;
}

@media (max-width: 860px) {
  .groups {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .home {
    padding: 1.25rem 0.75rem 3rem;
  }

  .home-head {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 1.25rem;
  }

  .search-keyword,
  .search-range {
    flex: 1 1 100%;
  }

  .groups {
    gap: 1rem;
  }
}

.home-empty {
  padding: 4rem 1rem;
}
</style>
