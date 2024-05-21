import { useState } from 'react'
import { ThreadFormCreate } from './thread-form-create'
import { createFollowThread } from '~/actions/thread'

export const ThreadCardReply = ({ thread_id }: { thread_id: number }) => {
  const [isReplying, setReplying] = useState(false)
  const handleReply = async (formData: FormData) => {
    await createFollowThread(thread_id, formData)
    setReplying(false)
  }
  if (isReplying) {
    return <ThreadFormCreate onSubmit={handleReply} onCancel={() => setReplying(false)} />
  }
  return (
    <div
      className="border rounded p-2 text-gray-500 text-xs cursor-text"
      onClick={() => {
        setReplying(true)
      }}
    >
      Add a reply ...
    </div>
  )
}
