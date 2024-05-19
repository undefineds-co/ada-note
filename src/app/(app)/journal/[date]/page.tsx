import { getJournalTopicAndThreads } from '~/actions/journal'
import { ThreadCardList } from '~/components/thread'
import { CreateForm } from './create-form'

type PageParams = {
  date: string
}
export default async function Page({ params }: { params: PageParams }) {
  const { threads } = await getJournalTopicAndThreads(params.date)
  return (
    <>
      <CreateForm date={params.date} />
      <ThreadCardList threads={threads} num_follows_show={0} />
    </>
  )
}
