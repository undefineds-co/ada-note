'use client'

import { startTransition, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { getTopics, updateThread } from '../../actions'
import { ThreadData, TopicData } from '../../types'
import { useFetchAction } from '../../lib/client-utils'

export const ThreadTopicSelect = ({
  children,
  thread,
}: {
  children: React.ReactNode
  thread: ThreadData
}) => {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start" className="p-4">
        <ThreadTopicSelectForm thread={thread} onSuccess={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  )
}

export function ThreadTopicSelectForm({
  thread,
  onSuccess,
}: {
  thread: ThreadData
  onSuccess?: () => void
}) {
  const [open, setOpen] = useState(false)
  const { data: topics } = useFetchAction<TopicData[]>(() => getTopics())

  const topic_id_str = thread.topic?.id.toString() ?? '0'

  const handleSelect = (v: string) => {
    const formData = new FormData()
    formData.append('topic_id', v || '0')
    startTransition(async () => {
      await updateThread(thread.id, formData)
      setOpen(false)
      onSuccess?.()
    })
  }

  if (!topics) {
    return null
  }
  return (
    <Select open={open} onOpenChange={setOpen} value={topic_id_str} onValueChange={handleSelect}>
      <SelectTrigger className="w-[240px]">
        <SelectValue placeholder="Select a topic" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="0">Journal</SelectItem>
          {topics.map(topic => (
            <SelectItem key={topic.id} value={topic.id.toString()}>
              {topic.topic_name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
