import { marked } from 'marked'
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'
import { ThreadData } from '~/types'
import { ScrollArea } from '~/components/ui/scroll-area'
import { parseThreadContent } from './util'

export const ThreadContentSheet = ({
  thread,
  children,
}: {
  thread: ThreadData
  children: React.ReactNode
}) => {
  const { thread_title, thread_content } = parseThreadContent(thread.thread_content)
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent withoutClose className="sm:max-w-none w-[600px] stack-lg p-0">
        <ScrollArea className="p-4 lg:p-6 flex-1">
          <article className="prose prose-sm prose-slate">
            <h1>{thread_title}</h1>
            <div dangerouslySetInnerHTML={{ __html: marked(thread_content, { breaks: true }) }} />
          </article>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
