'use client'

import { startTransition, useState } from 'react'
import { getThread } from '~/actions'
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'
import { Skeleton } from '~/components/ui/skeleton'
import { ThreadData } from '~/types'
import { ThreadCard } from './thread-card'
import { ThreadCreateForm } from './thread-create-form'
import { ScrollArea } from '~/components/ui/scroll-area'

export const ThreadCardSheet = ({
  lead_thread_id,
  children,
}: {
  lead_thread_id: number
  children: React.ReactNode
}) => {
  const [thread, setThread] = useState<ThreadData>()
  const fetchThread = () => {
    startTransition(async () => {
      const thread = await getThread(lead_thread_id)
      setThread(thread)
    })
  }
  return (
    <Sheet onOpenChange={fetchThread}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent withoutClose className="sm:max-w-full sm:w-[450px] md:w-[600px] stack-lg p-0">
        <ScrollArea className="p-4 lg:p-6 flex-1">
          {thread ? (
            <div className="timeline pb-4 ml-4">
              <ThreadCard thread={thread} onEditSuccess={fetchThread} />
              {thread?.follows?.map(thread => (
                <ThreadCard key={thread.id} thread={thread} onEditSuccess={fetchThread} />
              ))}
            </div>
          ) : (
            <SkeletonCard />
          )}
        </ScrollArea>
        <div className="p-4 bg-gray-50 border-t">
          <ThreadCreateForm lead_thread_id={lead_thread_id} onSuccess={fetchThread} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[100px] w-full rounded-lg bg-gray-100 shadow-sm" />
      <Skeleton className="h-[100px] w-full rounded-lg bg-gray-100 shadow-sm" />
    </div>
  )
}
