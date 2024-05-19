'use server'

import * as zfd from '~/lib/zod-form-data'
import { mustAuth } from './auth'
import { createThread, getUserTopics } from './common'

export const createTopicThread = async (topicId: number, formData: FormData) => {
  const session = await mustAuth()
  const form = zfd
    .formData({
      thread_content: zfd.text(),
    })
    .parse(formData)

  return await createThread({
    topic_id: topicId,
    thread_content: form.thread_content,
    color: 'None',
    updated_at: new Date(),
    user_id: session.userId,
  })
}

export const getTopicList = async () => {
  const session = await mustAuth()
  return getUserTopics(session.userId)
}
