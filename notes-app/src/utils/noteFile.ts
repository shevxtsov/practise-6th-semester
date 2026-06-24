import { meetingTypeLabels, type Meeting, type Note } from '@/types/note'

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

export const buildNoteFileContent = (note: Note, meeting: Meeting) => {
  const type = meetingTypeLabels[meeting.type] ?? meeting.type
  return [
    `Заголовок: ${note.title}`,
    `Мероприятие: ${meeting.title} (${type})`,
    `Дата и время: ${formatDateTime(note.datetime)}`,
    '',
    note.content,
    '',
  ].join('\n')
}

const sanitizeFileName = (name: string) =>
  name
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 80) || 'note'

export const downloadNote = (note: Note, meeting: Meeting) => {
  const content = buildNoteFileContent(note, meeting)
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${sanitizeFileName(note.title)}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
