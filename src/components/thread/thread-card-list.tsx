import { ThreadData } from '~/types'
import { ThreadCardLead } from './thread-card-lead'

export const ThreadCardList = ({
  threads,
  num_follows_show = 3,
}: {
  threads: ThreadData[]
  num_follows_show?: number
}) => {
  return (
    <div className="stack-xl">
      {threads.map(thread => (
        <ThreadCardLead key={thread.id} thread={thread} num_follows_show={num_follows_show} />
      ))}
    </div>
  )
}
