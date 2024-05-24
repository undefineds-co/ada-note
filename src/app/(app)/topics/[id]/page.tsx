import { getTopicThreadGroups, getTopicThreads } from '~/actions/topic'
import { ThreadCardList } from '~/components/thread'
import { ThreadGroupSelect } from '~/components/thread'
import { CreateForm } from './create-form'

type PageParams = {
  id: string
}
type SearchParams = {
  group?: string
}
const Page = async ({
  params,
  searchParams,
}: {
  params: PageParams
  searchParams: SearchParams
}) => {
  const { id } = params
  const topic_id = Number(id)
  const { group } = searchParams
  const threads = await getTopicThreads(topic_id, { group })
  const groups = await getTopicThreadGroups(topic_id)

  return (
    <div className="sm:w-full md:w-[768px] mx-auto flex flex-col gap-4 lg:gap-6">
      <CreateForm topicId={topic_id} />
      <ThreadGroupSelect groups={groups} />
      <ThreadCardList threads={threads} />
    </div>
  )
}

export default Page
