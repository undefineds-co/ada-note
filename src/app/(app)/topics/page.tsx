import { TopicCreateForm } from '~/components/topic'
import { TopicCardList } from '~/components/topic/topic-card-list'
import { getTopics } from '~/actions'

const Page = async () => {
  const topics = await getTopics()
  return <TopicCardList topics={topics} />
}

export default Page
