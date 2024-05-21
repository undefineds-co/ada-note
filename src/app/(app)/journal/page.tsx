import { formatDate } from 'date-fns'
import { redirect } from 'next/navigation'

export default function Page() {
  const today = formatDate(new Date(), 'yyyyMMdd')
  redirect(`/journal/${today}`)
}
