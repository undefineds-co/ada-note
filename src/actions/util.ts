import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ThreadData } from '../types'

dayjs.extend(duration)
dayjs.extend(relativeTime)

export const processThread = (thread: ThreadData) => {
  const created_at = dayjs(thread.created_at)
  thread.created_date = created_at.format('YYYY-MM-DD')
  thread.created_time = created_at.format('HH:mm')
  thread.created_duration = dayjs.duration(created_at.diff(dayjs())).humanize(true)
  if (thread.follows) {
    thread.follows.forEach(processThread)
  }
  return thread
}

export const dateBeginAndEnd = (date: string) => {
  const today = dayjs(date)
  const tomorrow = today.add(1, 'd')
  return [today.toDate(), tomorrow.toDate()]
}

export const splitN = (str: string, sep: string, n: number) => {
  const parts: string[] = []
  let index = str.indexOf(sep)
  if (index === -1) {
    parts.push(str.trim())
    return parts
  }
  for (let i = 0; i < n; i++) {
    parts.push(str.slice(0, index).trim())
    str = str.slice(index + 1)
    index = str.indexOf(sep)
  }
  if (str) {
    parts.push(str.trim())
  }
  return parts
}

export const parseThreadContent = (text: string) => {
  let group_name: string | undefined = undefined
  let thread_content: string = text
  const [firstLine, restContent = ''] = splitN(text, '\n', 1)
  if (firstLine.startsWith('#') && firstLine.endsWith('#')) {
    group_name = firstLine.slice(1, -1)
    thread_content = restContent.trim()
  }
  return { group_name, thread_content }
}
