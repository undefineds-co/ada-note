import { getTopicThreads } from '~/actions/topic'
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
  const threads = await getTopicThreads(topic_id)
  const groupSet = new Set<string>()
  threads.forEach(t => {
    if (t.group_name) {
      groupSet.add(t.group_name)
    }
  })
  const g = searchParams.group

  return (
    <div className="sm:w-full md:w-[768px] mx-auto flex flex-col gap-4 lg:gap-6">
      <CreateForm topicId={topic_id} />
      <ThreadGroupSelect groups={Array.from(groupSet)} />
      <ThreadCardList threads={threads.filter(t => !g || t.group_name === g)} />
    </div>
  )
}

export default Page
