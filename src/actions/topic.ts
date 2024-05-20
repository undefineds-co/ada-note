'use server'

import * as zfd from '~/lib/zod-form-data'
import { mustAuth } from './auth'
import { createThread, getUserTopics } from './common'
import { revalidatePath } from 'next/cache'

export const createTopicThread = async (topicId: number, formData: FormData) => {
  const session = await mustAuth()
  const form = zfd
    .formData({
      thread_content: zfd.text(),
    })
    .parse(formData)

  await createThread({
    topic_id: topicId,
    thread_content: form.thread_content,
    color: 'None',
    updated_at: new Date(),
    user_id: session.userId,
  })
  revalidatePath(`/topics/${topicId}`)
}

export const getTopicList = async () => {
  const session = await mustAuth()
  return getUserTopics(session.userId)
}
