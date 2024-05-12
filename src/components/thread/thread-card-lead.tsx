import { ThreadData } from '~/types'
import { ThreadCard } from './thread-card'

export const ThreadCardLead = ({
  thread,
  num_follows_show = 3,
}: {
  thread: ThreadData
  num_follows_show?: number
}) => {
  const follows = thread.follows?.slice(0, num_follows_show)
  return (
    <div className="timeline">
      <ThreadCard thread={thread} />
      {follows?.map(thread => (
        <ThreadCard key={thread.id} thread={thread} />
      ))}
    </div>
  )
}
