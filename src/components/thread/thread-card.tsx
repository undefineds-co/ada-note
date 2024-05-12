'use client'
import { Check, CheckCircle } from 'lucide-react'
import { MouseEvent, startTransition, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { cn } from '~/lib/utils'
import { ThreadColor, ThreadData, ThreadExtend } from '~/types'
import { updateThread } from '../../actions'
import { Button } from '../ui/button'
import { ThreadCardSheet } from './thread-card-sheet'
import { ThreadContentSheet } from './thread-content-sheet'
import { ThreadTopicSelect } from './thread-topic-select'
import { ThreadUpdateForm } from './thread-update-form'
import { parseThreadContent } from './util'
import { ThreadTime } from './thread-time'

export const ThreadCard = ({
  thread,
  onEditSuccess,
}: {
  thread: ThreadData
  onEditSuccess?: () => void
}) => {
  const showExtra = onEditSuccess === undefined && !thread.lead_thread_id
  const editable = onEditSuccess !== undefined
  const showDuration = onEditSuccess !== undefined
  const [isEditing, setEditing] = useState(false)

  const { thread_title, thread_content } = parseThreadContent(thread.thread_content)

  const handleEdit = () => {
    if (!editable) return
    setEditing(true)
  }

  const handleSuccess = () => {
    onEditSuccess?.()
    setEditing(false)
  }

  let replyText = 'no reply'
  if (thread.num_follows) {
    replyText = thread.num_follows === 1 ? '1 reply' : `${thread.num_follows} replies`
  }

  const handleColorChange = (color: ThreadColor) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('color', color)
      await updateThread(thread.id, formData)
      onEditSuccess?.()
    })
  }

  const handleTodoChange = (status: 'done' | 'doing') => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('todo_status', status)
      console.log('formData', formData)
      await updateThread(thread.id, formData)
      onEditSuccess?.()
    })
  }

  return (
    <div className={cn('timeline-item')} onDoubleClick={handleEdit}>
      <ThreadDot
        color={thread.color}
        extend={thread.extend}
        onColorChange={handleColorChange}
        onTodoChange={handleTodoChange}
      />
      {!isEditing && (
        <ThreadTime date={thread.created_at} format={showDuration ? 'duration' : 'date'} />
      )}
      <div className="timeline-content">
        {isEditing ? (
          <ThreadUpdateForm thread={thread} onSuccess={handleSuccess} />
        ) : (
          <>
            {showExtra && (
              <div className="flex gap-2 text-xs text-gray-400 dark:text-gray-500 mb-1">
                <ThreadTopicSelect thread={thread}>
                  <span>@{thread.topic?.topic_name ?? 'Journal'}</span>
                </ThreadTopicSelect>
                <span>·</span>
                <ThreadCardSheet lead_thread_id={thread.id}>
                  <Button variant="link" size="none" className="text-xs text-gray-400">
                    {replyText}
                  </Button>
                </ThreadCardSheet>
              </div>
            )}

            {thread_title && <h3>{thread_title}</h3>}
            <pre>{thread_content}</pre>
            <ThreadContentSheet thread={thread}>
              <Button variant="link" size="none" className="text-xs text-gray-400">
                [Open]
              </Button>
            </ThreadContentSheet>
          </>
        )}
      </div>
    </div>
  )
}

const ThreadDot = ({
  color,
  extend,
  onColorChange,
  onTodoChange,
}: {
  color: ThreadColor
  extend: ThreadExtend
  onColorChange?: (color: ThreadColor) => void
  onTodoChange?: (status: 'done' | 'doing') => void
}) => {
  const [open, setOpen] = useState(false)
  const colors: ThreadColor[] = ['None', 'Highlight', 'Todo', 'Idea']
  const handleClick = (c: ThreadColor) => (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
    e.currentTarget.dataset.color
    onColorChange?.(c)
    setOpen(false)
  }

  const handleTodoDone = (e: MouseEvent<HTMLDivElement>) => {
    const isDone = extend?.todoDoneAt ? true : false
    const triggerStatus = isDone ? 'doing' : 'done'
    e.stopPropagation()
    e.preventDefault()
    onTodoChange?.(triggerStatus)
    setOpen(false)
  }
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div className="timeline-dot" data-color={color}>
          {extend?.todoDoneAt && <Check className="w-4 h-4 text-white" />}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="p-3 w-[180px]">
        {colors.map(c => (
          <DropdownMenuItem key={c} className="gap-2" onClick={handleClick(c)}>
            <div className="thread-dot" data-color={c} />
            <span>{c}</span>
          </DropdownMenuItem>
        ))}
        {color === 'Todo' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2" onClick={handleTodoDone}>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Done this todo</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
