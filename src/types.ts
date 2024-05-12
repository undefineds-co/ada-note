import { ColumnType, Generated, Insertable, JSONColumnType, Selectable, Updateable } from 'kysely'

export interface Database {
  thread: ThreadTable
  topic: TopicTable
  user: UserTable
}

type NoSelectColumnType<T> = ColumnType<never, T | undefined, T | undefined>

export type ThreadColor = 'None' | 'Highlight' | 'Todo' | 'Idea'
export type ThreadExtend = {
  todoDoneAt?: Date
} | null

export interface ThreadTable {
  id: Generated<number>
  thread_content: string
  lead_thread_id?: number
  topic_id: number | null
  top_on_journal: NoSelectColumnType<boolean>
  top_on_topic: NoSelectColumnType<boolean>
  order_on_topic: NoSelectColumnType<number>
  order_on_thread: NoSelectColumnType<number>
  color: ThreadColor
  extend: JSONColumnType<ThreadExtend, ThreadExtend>
  created_at: ColumnType<Date, Date | undefined, never>
  updated_at: ColumnType<Date, Date, Date>
  user_id: number

  follows: ColumnType<ThreadData[], never, never>
  num_follows: ColumnType<number, never, never>
}

export type ThreadData = {
  id: number
  lead_thread_id?: number | null
  topic_id?: number | null
  thread_content: string
  color: ThreadColor
  extend: ThreadExtend
  created_at: Date
  updated_at: Date
  follows?: ThreadData[]
  num_follows?: number | null
  topic?: Pick<TopicData, 'id' | 'topic_name'> | null
}

export type ThreadGroupData = {
  lead: ThreadData
  follows: ThreadData[]
}

export type ThreadCreate = Insertable<ThreadTable>
export type ThreadUpdate = Updateable<ThreadTable>

export interface TopicTable {
  id: Generated<number>
  topic_type_id?: number
  topic_name: string
  topic_desc: string
  builtin_topic_name: ColumnType<string | undefined, never, never>
  is_private: boolean
  is_collaborate: boolean
  pin?: boolean
  extend: JSONColumnType<{} | null, {} | null>
  created_at: ColumnType<Date, Date | undefined, never>
  updated_at: ColumnType<Date, Date, Date>
  user_id: number
}

export type TopicData = Selectable<TopicTable>
export type TopicCreate = Insertable<TopicTable>
export type TopicUpdate = Updateable<TopicTable>

export type UserRole = 'admin' | 'user'
export interface UserTable {
  id: Generated<number>
  email: string
  password: string
  role: UserRole
  username?: string | null
  nickname?: string | null
  created_at: ColumnType<Date, Date | undefined, never>
  updated_at: ColumnType<Date, Date, Date>
}

export type UserData = Selectable<UserTable>
export type UserCreate = Insertable<UserTable>
export type UserUpdate = Updateable<UserTable>
