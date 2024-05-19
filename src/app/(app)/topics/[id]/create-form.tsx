'use client'

import { ThreadCreateForm } from '~/components/thread'
import { createTopicThread } from '~/actions/topic'

export const CreateForm = ({ topicId }: { topicId: number }) => {
  const handleSubmit = async (formData: FormData) => {
    createTopicThread(topicId, formData)
  }
  return <ThreadCreateForm onSubmit={handleSubmit} />
}
