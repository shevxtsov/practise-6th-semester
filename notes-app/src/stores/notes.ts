import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { useOrganizationStore } from '@/stores/organization'
import type {
  Meeting,
  MeetingDraft,
  Note,
  NoteDraft,
} from '@/types/note'

export const useNotesStore = defineStore(
  'notes',
  () => {
    const organizationStore = useOrganizationStore()

    const meetings = ref<Meeting[]>([])
    const notes = ref<Note[]>([])

    const searchQuery = ref('')
    const searchRange = ref<[number, number] | null>(null)

    const normalizedQuery = computed(() =>
      searchQuery.value.trim().toLowerCase(),
    )

    const hasActiveSearch = computed(
      () => normalizedQuery.value !== '' || searchRange.value !== null,
    )

    const noteMatches = (note: Note) => {
      if (normalizedQuery.value) {
        const haystack = `${note.title} ${note.content}`.toLowerCase()
        if (!haystack.includes(normalizedQuery.value)) return false
      }
      if (searchRange.value) {
        const time = new Date(note.datetime).getTime()
        const [from, to] = searchRange.value
        if (time < from || time > to) return false
      }
      return true
    }

    const clearSearch = () => {
      searchQuery.value = ''
      searchRange.value = null
    }

    const organizationMeetings = computed(() =>
      meetings.value
        .filter(
          (m) => m.organizationId === organizationStore.currentOrganizationId,
        )
        .sort((a, b) => b.date.localeCompare(a.date)),
    )

    const visibleMeetings = computed(() => {
      if (!hasActiveSearch.value) return organizationMeetings.value
      return organizationMeetings.value.filter((m) =>
        notes.value.some((n) => n.meetingId === m.id && noteMatches(n)),
      )
    })

    const matchedNotesCount = computed(
      () =>
        organizationMeetings.value.reduce(
          (sum, m) =>
            sum +
            notes.value.filter((n) => n.meetingId === m.id && noteMatches(n))
              .length,
          0,
        ),
    )

    const notesByMeeting = computed(() => (meetingId: string) =>
      notes.value
        .filter((n) => n.meetingId === meetingId && noteMatches(n))
        .sort((a, b) => a.datetime.localeCompare(b.datetime)),
    )

    const createMeeting = (draft: MeetingDraft) => {
      const organizationId = organizationStore.currentOrganizationId
      if (!organizationId) return null

      const meeting: Meeting = {
        id: crypto.randomUUID(),
        organizationId,
        createdAt: new Date().toISOString(),
        ...draft,
      }
      meetings.value.push(meeting)
      return meeting
    }

    const updateMeeting = (id: string, patch: Partial<MeetingDraft>) => {
      const index = meetings.value.findIndex((m) => m.id === id)
      if (index === -1) return
      meetings.value[index] = { ...meetings.value[index], ...patch }
    }

    const removeMeeting = (id: string) => {
      meetings.value = meetings.value.filter((m) => m.id !== id)
      notes.value = notes.value.filter((n) => n.meetingId !== id)
    }

    const createNote = (meetingId: string, draft: NoteDraft) => {
      const meeting = meetings.value.find((m) => m.id === meetingId)
      if (!meeting) return null

      const note: Note = {
        id: crypto.randomUUID(),
        meetingId,
        organizationId: meeting.organizationId,
        createdAt: new Date().toISOString(),
        ...draft,
      }
      notes.value.push(note)
      return note
    }

    const updateNote = (id: string, patch: Partial<NoteDraft>) => {
      const index = notes.value.findIndex((n) => n.id === id)
      if (index === -1) return
      notes.value[index] = { ...notes.value[index], ...patch }
    }

    const removeNote = (id: string) => {
      notes.value = notes.value.filter((n) => n.id !== id)
    }

    return {
      meetings,
      notes,
      searchQuery,
      searchRange,
      hasActiveSearch,
      matchedNotesCount,
      clearSearch,
      organizationMeetings,
      visibleMeetings,
      notesByMeeting,
      createMeeting,
      updateMeeting,
      removeMeeting,
      createNote,
      updateNote,
      removeNote,
    }
  },
  {
    persist: {
      pick: ['meetings', 'notes']
    }
  }
)
