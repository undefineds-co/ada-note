'use server'

import * as zfd from '~/lib/zod-form-data'
import { checkOwner, mustAuth } from './auth'
import { createThread, getUserTopics, getTopicThreads as getTopicThreads_ } from './common'
import { revalidatePath } from 'next/cache'
import { parseThreadContent } from './util'

export const getTopicThreads = async (topicId: number, filter: { group?: string }) => {
  checkOwner('topic', topicId)
  return getTopicThreads_(topicId, filter)
}

export const createTopicThread = async (topicId: number, formData: FormData) => {
  const session = await mustAuth()
  const form = zfd
    .formData({
      thread_content: zfd.text(),
    })
    .parse(formData)

  const { thread_content, group_name } = parseThreadContent(form.thread_content)
  if (!thread_content) {
    throw new Error('thread content is required')
  }
  await createThread({
    topic_id: topicId,
    thread_content,
    group_name,
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
