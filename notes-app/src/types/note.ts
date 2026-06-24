export interface Meeting {
  id: string
  organizationId: string
  title: string
  type: string
  date: string
  description: string
  createdAt: string
}

export type MeetingDraft = Omit<
  Meeting,
  'id' | 'organizationId' | 'createdAt'
>

export interface Note {
  id: string
  meetingId: string
  organizationId: string
  title: string
  datetime: string
  content: string
  createdAt: string
}

export type NoteDraft = Omit<
  Note,
  'id' | 'meetingId' | 'organizationId' | 'createdAt'
>

export const meetingTypeOptions = [
  { label: 'Совещание', value: 'meeting' },
  { label: 'Собрание', value: 'assembly' },
  { label: 'Конференция', value: 'conference' },
  { label: 'Деловая встреча', value: 'business' },
  { label: 'Другое', value: 'other' },
]

export const meetingTypeLabels: Record<string, string> =
  Object.fromEntries(meetingTypeOptions.map((o) => [o.value, o.label]))
