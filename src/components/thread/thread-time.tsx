import { formatDate } from 'date-fns'

export default function ThreadTime({ time, format }: { time: Date; format: string }) {
  const timeString = time.toLocaleString()
  return (
    <time dateTime={timeString} suppressHydrationWarning>
      {formatDate(time, format)}
    </time>
  )
}
