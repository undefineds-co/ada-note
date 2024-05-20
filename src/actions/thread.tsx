'use server'

import * as zfd from '~/lib/zod-form-data'
import { checkOwner, mustAuth } from './auth'
import { createThread, getThreadTopic, updateThread as updateThread_ } from './common'
import { revalidatePath } from 'next/cache'
import { ThreadUpdate } from '../types'
import { parseThreadContent } from './util'
import { db } from '../db'

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

export const updateThread = async (id: number, formData: FormData) => {
  const thread = await checkOwner('thread', id)
  const form = zfd
    .formData({
      thread_content: zfd.text(),
    })
    .parse(formData)
  const updateData: ThreadUpdate = {
    thread_content: form.thread_content,
  }
  if (!thread.lead_thread_id) {
    const { thread_content, group_name } = parseThreadContent(form.thread_content)
    updateData.thread_content = thread_content
    updateData.group_name = group_name
  }
  await updateThread_(id, updateData)

  revalidatePath(`/topics/${thread.topic_id}`)
}

export const deleteThread = async (id: number) => {
  const session = await mustAuth()
  const deleteRes = await db
    .deleteFrom('thread')
    .where('id', '=', id)
    .where('user_id', '=', session.userId)
    .returning('id')
    .executeTakeFirstOrThrow()

  return deleteRes
}
