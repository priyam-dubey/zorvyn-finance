import React from 'react'
import styles from './Notification.module.css'

export default function Notification({ notifications }) {
  return (
    <div className={styles.container}>
      {notifications.map(n => (
        <div key={n.id} className={styles.toast}>
          {n.message}
        </div>
      ))}
    </div>
  )
}
