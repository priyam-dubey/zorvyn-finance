import { useState, useCallback } from 'react'

let notifId = 0

export function useNotification() {
  const [notifications, setNotifications] = useState([])

  const notify = useCallback((message) => {
    const id = ++notifId
    setNotifications(prev => [...prev, { id, message }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3000)
  }, [])

  return { notifications, notify }
}
