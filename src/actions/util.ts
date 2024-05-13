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
