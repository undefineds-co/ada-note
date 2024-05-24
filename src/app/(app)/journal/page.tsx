import { RedirectType, redirect } from 'next/navigation'
import { getJournalTodayDate } from '~/actions/journal'

export default async function Page() {
  const date = await getJournalTodayDate()
  redirect(`/journal/${date}`, RedirectType.replace)
}
