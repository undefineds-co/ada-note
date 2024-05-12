import { getJournalThreads } from '~/actions'
import { ThreadCardList, ThreadCreateForm } from '~/components/thread'
import { ScrollArea } from '~/components/ui/scroll-area'
import { UserMenu } from '../layout-components'

export default async function Page() {
  const threads = await getJournalThreads()
  return (
    <>
      <header className="header">
        <h2>Journal</h2>
        <div className="md:hidden">
          <UserMenu />
        </div>
      </header>

      <ScrollArea className="flex-1">
        <main className="sm:w-full md:w-[768px] mx-auto flex flex-col gap-4 lg:gap-6 py-4 px-6 lg:p-6">
          <ThreadCreateForm />
          <ThreadCardList threads={threads} />
        </main>
      </ScrollArea>
    </>
  )
}
