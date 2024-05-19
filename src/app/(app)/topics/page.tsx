import { TopicCardList } from '~/components/topic/topic-card-list'
import { getTopicList } from '~/actions/topic'

const Page = async () => {
  const topics = await getTopicList()
  return <TopicCardList topics={topics} />
}

export default Page
