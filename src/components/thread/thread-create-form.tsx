'use client'

import { useRef, useTransition } from 'react'
import { Button } from '~/components/ui/button'
import { TextareaExtend } from '~/components/ui/textarea-extend'

export const ThreadCreateForm = ({
  onSubmit,
}: {
  onSubmit: (formData: FormData) => Promise<void>
}) => {
  const formRef = useRef<HTMLFormElement>(null)
  const [pending, startTransition] = useTransition()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    startTransition(async () => {
      await onSubmit(formData)
      formRef.current?.reset()
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="stack">
      <TextareaExtend
        name="thread_content"
        placeholder="What's on your mind?"
        className="bg-white"
        disabled={pending}
        onSubmit={() => {
          formRef.current?.requestSubmit()
        }}
      />
      <div className="flex items-center justify-end">
        <Button type="submit" className="rounded-full" size="sm" disabled={pending}>
          Post
        </Button>
      </div>
    </form>
  )
}
