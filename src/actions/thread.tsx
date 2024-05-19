'use server'

import * as zfd from '~/lib/zod-form-data'
import { mustAuth } from './auth'
import { createThread, getThreadTopicId } from './common'

export const createFollowThread = async (lead_thread_id: number, formData: FormData) => {
  const session = await mustAuth()
  const form = zfd
    .formData({
      thread_content: zfd.text(),
    })
    .parse(formData)

  const topic_id = await getThreadTopicId(lead_thread_id)
  if (!topic_id) {
    throw new Error('topic not found')
  }

  return await createThread({
    topic_id: topic_id,
    lead_thread_id,
    thread_content: form.thread_content,
    color: 'None',
    updated_at: new Date(),
    user_id: session.userId,
  })
}
