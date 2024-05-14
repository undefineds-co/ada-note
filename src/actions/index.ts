'use server'

import { SelectExpression } from 'kysely'
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '~/db'
import * as zfd from '~/lib/zod-form-data'
import {
  Database,
  ThreadColor,
  ThreadCreate,
  ThreadData,
  ThreadExtend,
  ThreadUpdate,
  TopicCreate,
  TopicData,
  TopicUpdate,
} from '~/types'
import { mustAuth } from './auth'
import { signIn } from '../auth'
import { processThread } from './util'

const threadColors: ThreadColor[] = ['Highlight', 'Todo', 'Idea']
const threadColorEnum = z.enum<ThreadColor, [ThreadColor, ...ThreadColor[]]>([
  'None',
  ...threadColors,
])

const threadCreateSchema = zfd.formData({
  thread_content: zfd.text(),
  color: zfd.text(threadColorEnum),
  topic_id: zfd.numeric().optional(),
  lead_thread_id: zfd.numeric().optional(),
})

const threadUpdateSchema = zfd.formData({
  topic_id: zfd.numeric().optional(),
  thread_content: zfd.text(z.string().optional()),
  color: zfd.text(threadColorEnum.optional()),
  todo_status: zfd.text(z.enum(['doing', 'done']).optional()),
})

export const createThread = async (formData: FormData) => {
  const session = await mustAuth()
  const data = threadCreateSchema.parse(formData)

  const values: ThreadCreate = {
    ...data,
    updated_at: new Date(),
    user_id: session.userId,
  }
  const insertRes = await db
    .insertInto('thread')
    .values(values)
    .returning('id')
    .executeTakeFirstOrThrow()

  if (data.topic_id) {
    revalidatePath(`/topics/${data.topic_id}`)
  } else {
    revalidatePath('/journal')
  }

  return insertRes
}

export const updateThread = async (id: number, formData: FormData) => {
  const session = await mustAuth()
  const data = threadUpdateSchema.parse(formData)
  const updateData: ThreadUpdate = {
    updated_at: new Date(),
  }
  if (data.topic_id === 0) {
    updateData.topic_id = null
  }
  if (data.topic_id && data.topic_id > 0) {
    updateData.topic_id = data.topic_id
  }
  if (data.thread_content) {
    updateData.thread_content = data.thread_content
  }
  if (data.color) {
    updateData.color = data.color
  }
  const extend: ThreadExtend = {
    todoDoneAt: data.todo_status === 'done' ? new Date() : undefined,
  }
  updateData.extend = JSON.stringify(extend)

  const updateRes = await db
    .updateTable('thread')
    .set(updateData)
    .where('id', '=', id)
    .where('user_id', '=', session.userId)
    .returning('id')
    .executeTakeFirstOrThrow()

  if (data.topic_id) {
    revalidatePath(`/topics/${data.topic_id}`)
  } else {
    revalidatePath('/journal')
  }

  return updateRes
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

export const getJournalThreads = async (): Promise<ThreadData[]> => {
  const session = await mustAuth()
  const threads = await db
    .selectFrom('thread as t')
    .select(['t.id', 't.thread_content', 't.color', 't.extend', 't.created_at', 't.updated_at'])
    .select(eb =>
      jsonObjectFrom(
        eb.selectFrom('topic').select(['id', 'topic_name']).whereRef('t.topic_id', '=', 'topic.id')
      ).as('topic')
    )
    .select(eb =>
      jsonArrayFrom(
        eb
          .selectFrom('thread as ft')
          .select([
            'ft.id',
            'ft.lead_thread_id',
            'ft.thread_content',
            'ft.color',
            'ft.extend',
            'ft.created_at',
            'ft.updated_at',
          ])
          .whereRef('ft.lead_thread_id', '=', 't.id')
          .orderBy('ft.created_at', 'asc')
          .limit(2)
      ).as('follows')
    )
    .select(eb =>
      eb
        .selectFrom('thread')
        .select(eb.fn.count<number>('id').as('num_follows'))
        .whereRef('lead_thread_id', '=', 't.id')
        .as('num_follows')
    )
    .where('lead_thread_id', 'is', null)
    .where('user_id', '=', session.userId)
    .orderBy('top_on_journal', 'desc')
    .orderBy('updated_at', 'desc')
    .limit(30)
    .execute()
  threads.forEach(processThread)
  return threads
}

export const getTopicThreads = async (topic_id: number): Promise<ThreadData[]> => {
  const session = await mustAuth()
  const threads = await db
    .selectFrom('thread as t')
    .select(['t.id', 't.thread_content', 't.color', 't.extend', 't.created_at', 't.updated_at'])
    .select(eb =>
      jsonObjectFrom(
        eb.selectFrom('topic').select(['id', 'topic_name']).whereRef('t.topic_id', '=', 'topic.id')
      ).as('topic')
    )
    .select(eb =>
      jsonArrayFrom(
        eb
          .selectFrom('thread as ft')
          .select([
            'ft.id',
            'ft.lead_thread_id',
            'ft.thread_content',
            'ft.thread_content',
            'ft.color',
            'ft.extend',
            'ft.created_at',
            'ft.updated_at',
          ])
          .whereRef('ft.lead_thread_id', '=', 't.id')
          .orderBy('ft.created_at', 'asc')
          .limit(2)
      ).as('follows')
    )
    .select(eb =>
      eb
        .selectFrom('thread')
        .select(eb.fn.count<number>('id').as('num_follows'))
        .whereRef('lead_thread_id', '=', 't.id')
        .as('num_follows')
    )
    .where('lead_thread_id', 'is', null)
    .where('topic_id', '=', topic_id)
    .where('user_id', '=', session.userId)
    .orderBy('top_on_topic', 'desc')
    .orderBy('created_at', 'desc')
    .limit(30)
    .execute()
  threads.forEach(processThread)
  return threads
}

export const getThread = async (id: number): Promise<ThreadData> => {
  const session = await mustAuth()
  const thread = await db
    .selectFrom('thread as t')
    .select(['t.id', 't.thread_content', 't.color', 't.extend', 't.created_at', 't.updated_at'])
    .select(eb =>
      jsonArrayFrom(
        eb
          .selectFrom('thread as ft')
          .select([
            'ft.id',
            'ft.thread_content',
            'ft.color',
            'ft.extend',
            'ft.created_at',
            'ft.updated_at',
          ])
          .whereRef('ft.lead_thread_id', '=', 't.id')
          .orderBy('ft.created_at', 'asc')
      ).as('follows')
    )
    .select(eb =>
      eb
        .selectFrom('thread')
        .select(eb.fn.count<number>('id').as('num_follows'))
        .whereRef('lead_thread_id', '=', 't.id')
        .as('num_follows')
    )
    .where('t.id', '=', id)
    .where('user_id', '=', session.userId)
    .executeTakeFirstOrThrow()
  processThread(thread)
  return thread
}

export const createTopic = async (formData: FormData) => {
  const session = await mustAuth()
  const data = zfd
    .formData({
      topic_content: zfd.text(),
    })
    .parse(formData)

  const [topic_name, ...topic_desc_parts] = data.topic_content.split('\n')
  const topic_desc = topic_desc_parts.join('\n')
  const values: TopicCreate = {
    topic_name,
    topic_desc,
    is_private: false,
    is_collaborate: false,
    updated_at: new Date(),
    user_id: session.userId,
  }
  const insertRes = await db
    .insertInto('topic')
    .values(values)
    .returning('id')
    .executeTakeFirstOrThrow()

  revalidatePath('/topics')

  return insertRes
}

export const updateTopic = async (id: number, formData: FormData) => {
  const session = await mustAuth()
  console.log('formData', formData)
  const { topic_content, pin } = zfd
    .formData({
      topic_content: zfd.text(z.string().optional()),
      pin: zfd.text(z.enum(['on', 'off']).optional()),
    })
    .parse(formData)
  const data: TopicUpdate = {}
  if (pin !== undefined) {
    data.pin = pin === 'on'
  }
  if (topic_content) {
    const [topic_name, ...topic_desc_parts] = topic_content.split('\n')
    const topic_desc = topic_desc_parts.join('\n')
    data.topic_name = topic_name
    data.topic_desc = topic_desc
  }
  console.log('update topic', data)
  const updateRes = await db
    .updateTable('topic')
    .set({ ...data, updated_at: new Date() })
    .where('id', '=', id)
    .where('user_id', '=', session.userId)
    .returning('id')
    .executeTakeFirstOrThrow()
  revalidatePath('/topics')
  return updateRes
}

export const deleteTopic = async (id: number) => {
  const session = await mustAuth()
  const deleteRes = await db
    .deleteFrom('topic')
    .where('id', '=', id)
    .where('user_id', '=', session.userId)
    .returning('id')
    .executeTakeFirstOrThrow()
  revalidatePath('/topics')
  return deleteRes
}

const topicSelectFields: readonly SelectExpression<Database, 'topic'>[] = [
  'id',
  'topic_type_id',
  'topic_name',
  'builtin_topic_name',
  'topic_desc',
  'is_private',
  'is_collaborate',
  'pin',
  'extend',
  'created_at',
  'updated_at',
]

export const getTopics = async (): Promise<TopicData[]> => {
  const session = await mustAuth()
  const topics = await db
    .selectFrom('topic')
    .select(topicSelectFields)
    .where('user_id', '=', session.userId)
    .orderBy('updated_at', 'desc')
    .execute()
  return topics
}

export const getTopic = async (id: number): Promise<TopicData> => {
  const session = await mustAuth()
  const topic = await db
    .selectFrom('topic')
    .select(topicSelectFields)
    .where('id', '=', id)
    .where('user_id', '=', session.userId)
    .executeTakeFirstOrThrow()
  return topic
}

export const getPinTopics = async (): Promise<TopicData[]> => {
  const session = await mustAuth()
  const topics = await db
    .selectFrom('topic')
    .select(topicSelectFields)
    .where('pin', '=', true)
    .where('user_id', '=', session.userId)
    .orderBy('updated_at', 'desc')
    .execute()
  return topics
}

export const login = async (formData: FormData) => {
  const { email, password } = zfd
    .formData({
      email: zfd.text(z.string().email()),
      password: zfd.text(),
    })
    .parse(formData)
  return signIn('credentials', { email, password, redirectTo: '/journal' })
}
