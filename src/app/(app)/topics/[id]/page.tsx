import { ThreadCardList } from '~/components/thread'
import { getTopicThreads } from '~/actions'
import { CreateForm } from './create-form'

type PageParams = {
  id: string
}
const Page = async ({ params }: { params: PageParams }) => {
  const { id } = params
  const topic_id = Number(id)
  const threads = await getTopicThreads(topic_id)
  return (
    <div className="sm:w-full md:w-[768px] mx-auto flex flex-col gap-4 lg:gap-6">
      <CreateForm topicId={topic_id} />
      <ThreadCardList threads={threads} num_follows_show={0} />
    </div>
  )
}

export default Page
