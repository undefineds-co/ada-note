import { SelectExpression } from 'kysely'
import { db } from '../db'
import { Database, ThreadCreate, ThreadData, ThreadTable, TopicCreate, TopicData } from '../types'
import { processThread } from './util'
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres'

export const TOPIC_SELECTS: SelectExpression<Database, 'topic'>[] = [
  'topic.id',
  'topic.topic_name',
  'topic.builtin_topic_name',
  'topic.topic_desc',
  'topic.pin',
  'topic.is_private',
  'topic.is_collaborate',
  'topic.created_at',
  'topic.updated_at',
]

export const THREAD_SELECTS: SelectExpression<Database, 'thread'>[] = [
  'thread.id',
  'thread.lead_thread_id',
  'thread.thread_content',
  'thread.color',
  'thread.extend',
  'thread.created_at',
  'thread.updated_at',
]

const THREAD_SELECTS_T: SelectExpression<Database & { t: ThreadTable }, 't'>[] = [
  't.id',
  't.lead_thread_id',
  't.thread_content',
  't.color',
  't.extend',
  't.created_at',
  't.updated_at',
]

const THREAD_SELECTS_FT: SelectExpression<Database & { ft: ThreadTable }, 'ft'>[] = [
  'ft.id',
  'ft.lead_thread_id',
  'ft.thread_content',
  'ft.color',
  'ft.extend',
  'ft.created_at',
  'ft.updated_at',
]

export const createTopic = async (values: TopicCreate): Promise<TopicData | undefined> => {
  const created = await db
    .insertInto('topic')
    .values(values)
    .returning(TOPIC_SELECTS)
    .executeTakeFirst()
  return created
}

export const getTopic = async (id: number) => {
  const topic = await db
    .selectFrom('topic')
    .select(TOPIC_SELECTS)
    .where('id', '=', id)
    .executeTakeFirst()
  return topic
}

export const getUserTopics = async (userId: number) => {
  const topics = await db
    .selectFrom('topic')
    .select(TOPIC_SELECTS)
    .where('user_id', '=', userId)
    .where('builtin_topic_name', 'is', null)
    .orderBy('created_at', 'desc')
    .execute()
  return topics
}

export const getTopicByBuiltInName = async (name: string, userId: number) => {
  const topic = await db
    .selectFrom('topic')
    .select(TOPIC_SELECTS)
    .where('builtin_topic_name', '=', name)
    .where('user_id', '=', userId)
    .executeTakeFirst()
  return topic
}

export const getTopicThreads = async (topicId: number, userId: number) => {
  const threads = await db
    .selectFrom('thread as t')
    .select(THREAD_SELECTS_T)
    .select(eb =>
      jsonObjectFrom(
        eb.selectFrom('topic').select(['id', 'topic_name']).whereRef('t.topic_id', '=', 'topic.id')
      ).as('topic')
    )
    .select(eb =>
      jsonArrayFrom(
        eb
          .selectFrom('thread as ft')
          .select(THREAD_SELECTS_FT)
          .whereRef('ft.lead_thread_id', '=', 't.id')
          .orderBy('ft.created_at', 'asc')
          .limit(5)
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
    .where('topic_id', '=', topicId)
    .where('user_id', '=', userId)
    .orderBy('top_on_topic', 'desc')
    .orderBy('created_at', 'desc')
    .limit(100)
    .execute()
  threads.forEach(processThread)
  return threads
}

export const createThread = async (values: ThreadCreate): Promise<ThreadData | undefined> => {
  const created = await db
    .insertInto('thread')
    .values(values)
    .returning(THREAD_SELECTS)
    .executeTakeFirst()
  return created
}
export const getThreadTopic = async (threadId: number) => {
  const topic = await db
    .selectFrom('topic')
    .innerJoin('thread', 'thread.topic_id', 'topic.id')
    .select(TOPIC_SELECTS)
    .where('thread.id', '=', threadId)
    .executeTakeFirst()
  return topic
}
