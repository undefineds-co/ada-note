import dayjs from 'dayjs'
import { redirect } from 'next/navigation'

export default function Page() {
  const today = dayjs().format('YYYYMMDD')
  redirect(`/journal/${today}`)
}
