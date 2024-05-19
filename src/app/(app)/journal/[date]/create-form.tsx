'use client'

import { ThreadCreateForm } from '~/components/thread'
import { createJournalThread } from '~/actions/journal'

export const CreateForm = ({ date }: { date: string }) => {
  const createJournalThread_ = async (formData: FormData) => {
    createJournalThread(date, formData)
  }
  return <ThreadCreateForm onSubmit={createJournalThread_} />
}
