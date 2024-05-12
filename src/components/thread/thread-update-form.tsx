'use client'

import { startTransition, useRef } from 'react'
import { deleteThread, updateThread } from '~/actions'
import { Button } from '~/components/ui/button'
import { TextareaExtend } from '~/components/ui/textarea-extend'
import { ThreadData } from '~/types'

export const ThreadUpdateForm = ({
  thread,
  onSuccess,
  onClose,
}: {
  thread: ThreadData
  onSuccess?: () => void
  onClose?: () => void
}) => {
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    startTransition(async () => {
      const thread_content = formData.get('thread_content')
      if (thread_content) {
        updateThread(thread.id, formData)
      } else {
        deleteThread(thread.id)
      }
    })
    formRef.current?.reset()
    onSuccess?.()
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="stack">
      <TextareaExtend
        name="thread_content"
        className="border-none p-0"
        defaultValue={thread.thread_content}
        onSubmit={() => formRef.current?.requestSubmit()}
        onEsc={() => onClose?.()}
      />
      <div className="flex items-center justify-end gap-2">
        <Button className="rounded-full" variant="secondary" size="sm" onClick={() => onClose?.()}>
          Cancel
        </Button>
        <Button type="submit" className="rounded-full" variant="default" size="sm">
          Update
        </Button>
      </div>
    </form>
  )
}
