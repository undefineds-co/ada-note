'use client'

import { addDays, startOfWeek, format } from 'date-fns'
import { Button } from '~/components/ui/button'

export const WeekdaySelect = ({
  selected,
  onChange,
}: {
  selected: Date
  onChange: (d: Date) => void
}) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = startOfWeek(selected, { weekStartsOn: 1 })
  const weekdays = []
  for (let i = 0; i < 7; i++) {
    weekdays.push(addDays(start, i))
  }

  return (
    <div className="grid grid-cols-7 gap-1 w-full">
      {weekdays.map(d => (
        <Button
          variant={
            d.getTime() === selected.getTime()
              ? 'default'
              : d.getTime() === today.getTime()
              ? 'secondary'
              : 'ghost'
          }
          key={d.getTime()}
          onClick={() => onChange(d)}
        >
          <div className="flex flex-col font-normal text-xs">
            <div className="text-gray-500">{format(d, 'EEE')}</div>
            <div>{format(d, 'd')}</div>
          </div>
        </Button>
      ))}
    </div>
  )
}
