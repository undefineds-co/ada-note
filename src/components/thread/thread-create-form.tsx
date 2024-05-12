'use client'

import { startTransition, useRef } from 'react'
import { createThread } from '~/actions'
import { Button } from '~/components/ui/button'
import { TextareaExtend } from '~/components/ui/textarea-extend'

export const ThreadCreateForm = ({
  topic_id,
  lead_thread_id,
  onSuccess,
}: {
  topic_id?: number
  lead_thread_id?: number
  onSuccess?: () => void
}) => {
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    if (topic_id) {
      formData.append('topic_id', topic_id.toString())
    }
    if (lead_thread_id) {
      formData.append('lead_thread_id', lead_thread_id.toString())
    }
    formData.append('color', 'None')
    startTransition(async () => {
      await createThread(formData)
    })
    formRef.current?.reset()
    onSuccess?.()
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="stack">
      <TextareaExtend
        name="thread_content"
        placeholder="What's on your mind?"
        className="bg-white"
        onSubmit={() => {
          formRef.current?.requestSubmit()
        }}
      />
      <div className="flex items-center justify-end">
        <Button type="submit" className="rounded-full" size="sm">
          Post
        </Button>
      </div>
    </form>
  )
}
