'use client'

import { formatDate } from 'date-fns'
import { useState } from 'react'
import { ThreadData } from '~/types'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ThreadCardReply } from './thread-card-reply'
import { ThreadFormUpdate } from './thread-form-update'
import { parseThreadContent } from './util'
import { ThreadFollowItem } from './thread-follow-item'

export const ThreadCard = ({ thread }: { thread: ThreadData }) => {
  const [isEditing, setEditing] = useState(false)
  const { thread_title, thread_content } = parseThreadContent(thread.thread_content)

  if (isEditing) {
    return (
      <Card>
        <div className="p-4">
          <ThreadFormUpdate thread={thread} onSuccess={() => setEditing(false)} />
        </div>
      </Card>
    )
  }
  return (
    <Card>
      <CardHeader className="p-4 space-y-1" onDoubleClick={() => setEditing(true)}>
        <div className="flex justify-between">
          <CardTitle className="text-sm flex gap-1">
            {thread.group_name && <span>[{thread.group_name}]</span>}
            {thread_title}
          </CardTitle>
          <div className="flex gap-1 text-xs text-gray-500">
            <time>{formatDate(thread.created_at, 'yyyy/MM/dd')}</time>
          </div>
        </div>
        <pre className="text-sm text-gray-600 dark:text-gray-400 font-sans leading-5 break-all text-wrap whitespace-pre-wrap;">
          {thread_content}
        </pre>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="timeline ml-2">
          {thread.follows?.map(thread => (
            <ThreadFollowItem key={thread.id} thread={thread} />
          ))}
          <div className="timeline-item pb-0">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <ThreadCardReply thread_id={thread.id} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
