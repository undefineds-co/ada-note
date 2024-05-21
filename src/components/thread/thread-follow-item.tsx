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
import { formatDate } from 'date-fns'
import { ThreadFormUpdate } from './thread-form-update'

export const ThreadFollowItem = ({ thread }: { thread: ThreadData }) => {
  const [isEditing, setEditing] = useState(false)

  const handleColorChange = (color: ThreadColor) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('color', color)
      await updateThread(thread.id, formData)
    })
  }

  const handleTodoChange = (status: 'done' | 'doing') => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('todo_status', status)
      await updateThread(thread.id, formData)
    })
  }

  return (
    <div className={cn('timeline-item')}>
      <ThreadDot
        color={thread.color}
        extend={thread.extend}
        onColorChange={handleColorChange}
        onTodoChange={handleTodoChange}
      />
      <div className="timeline-content" onDoubleClick={() => setEditing(true)}>
        <div className="timeline-header">
          <time>{formatDate(thread.created_at, 'MM/dd HH:mm')}</time>
        </div>
        {isEditing ? (
          <ThreadFormUpdate thread={thread} onSuccess={() => setEditing(false)} />
        ) : (
          <pre>{thread.thread_content}</pre>
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
