'use server'

import { formatDate } from 'date-fns'
import { revalidatePath } from 'next/cache'
import { RedirectType, redirect } from 'next/navigation'
import * as zfd from '~/lib/zod-form-data'
import { ThreadData, TopicCreate } from '../types'
import { mustAuth } from './auth'
import { createThread, createTopic, getTopicByBuiltInName, getTopicThreads } from './common'

export const getJournalTopicAndThreads = async (date: string) => {
  const session = await mustAuth()
  const builtin_topic_name = `journal_${date}`
  const topic = await getTopicByBuiltInName(builtin_topic_name, session.userId)
  let threads: ThreadData[] = []
  if (topic) {
    threads = await getTopicThreads(topic.id)
  }
  return { topic, threads }
}

export const createJournalThread = async (date: string, formData: FormData) => {
  const session = await mustAuth()
  const form = zfd
    .formData({
      thread_content: zfd.text(),
    })
    .parse(formData)

  const builtin_topic_name = `journal_${date}`
  let topic = await getTopicByBuiltInName(builtin_topic_name, session.userId)
  if (!topic) {
    const topicCreateData: TopicCreate = {
      topic_name: `Journal ${date}`,
      builtin_topic_name,
      is_private: true,
      is_collaborate: false,
      updated_at: new Date(),
      user_id: session.userId,
    }
    topic = await createTopic(topicCreateData)
  }
  if (!topic) {
    throw new Error('topic not found')
  }
  await createThread({
    topic_id: topic.id,
    thread_content: form.thread_content,
    color: 'None',
    updated_at: new Date(),
    user_id: session.userId,
  })

  revalidatePath(`/journal/${date}`)
}

export const getJournalTodayDate = async () => {
  const today = new Date()
  const date = formatDate(today, 'yyyyMMdd')
  return date
}
