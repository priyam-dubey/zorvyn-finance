import React from 'react'
import { useApp } from '../context/AppContext'
import styles from './Navbar.module.css'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'insights', label: 'Insights' },
]

export default function Navbar() {
  const { state, dispatch } = useApp()

  return (
    <nav className={styles.nav}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`${styles.navBtn} ${state.activeTab === tab.id ? styles.active : ''}`}
          onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id })}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
