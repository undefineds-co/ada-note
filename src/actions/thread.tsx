'use server'

import * as zfd from '~/lib/zod-form-data'
import { mustAuth } from './auth'
import { createThread, getThreadTopic } from './common'
import { revalidatePath } from 'next/cache'

export const createFollowThread = async (lead_thread_id: number, formData: FormData) => {
  const session = await mustAuth()
  const form = zfd
    .formData({
      thread_content: zfd.text(),
    })
    .parse(formData)

  const topic = await getThreadTopic(lead_thread_id)
  if (!topic) {
    throw new Error('topic not found')
  }

  await createThread({
    topic_id: topic.id,
    lead_thread_id,
    thread_content: form.thread_content,
    color: 'None',
    updated_at: new Date(),
    user_id: session.userId,
  })

  if (topic.builtin_topic_name?.startsWith('journal_')) {
    const [, date] = topic.builtin_topic_name.split('_')
    revalidatePath(`/journal/${date}`)
  } else {
    revalidatePath(`/topics/${topic.id}`)
  }
}
