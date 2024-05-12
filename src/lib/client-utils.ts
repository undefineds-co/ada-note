import { startTransition, useEffect, useState } from 'react'

export const useFetchAction = <T>(action: () => Promise<T>) => {
  const [data, setData] = useState<T>()
  const fetchData = () => {
    startTransition(async () => {
      const data = await action()
      setData(data)
    })
  }
  useEffect(() => {
    fetchData()
  }, [])
  return { data, refetch: fetchData }
}
