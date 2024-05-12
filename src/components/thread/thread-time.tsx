import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(duration)
dayjs.extend(relativeTime)

export const ThreadTime = ({
  date,
  format = 'date',
}: {
  date: Date
  format?: 'date' | 'datetime' | 'duration'
}) => {
  const thisTime = dayjs(date)
  let time: string = ''
  if (format === 'date') {
    time = thisTime.format('YYYY-MM-DD')
  } else if (format === 'datetime') {
    time = thisTime.format('YYYY-MM-DD HH:mm')
  } else if (format === 'duration') {
    time = dayjs.duration(thisTime.diff(dayjs())).humanize(true)
  }
  return <time>{time}</time>
}
