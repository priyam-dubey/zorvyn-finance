import React from 'react'
import { useApp } from '../context/AppContext'
import { exportToCSV } from '../utils'
import styles from './Topbar.module.css'

export default function Topbar({ onExport }) {
  const { state, dispatch } = useApp()

  function handleRoleChange(e) {
    dispatch({ type: 'SET_ROLE', payload: e.target.value })
    onExport?.(`Switched to ${e.target.value} role`)
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.logo}>
        Zorvyn <span>Finance</span>
      </div>
      <div className={styles.right}>
        <div className={styles.roleBadge}>{state.role.toUpperCase()}</div>
        <select
          className={styles.roleSelect}
          value={state.role}
          onChange={handleRoleChange}
        >
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>
        <button
          className={styles.exportBtn}
          onClick={() => {
            exportToCSV(state.transactions)
            onExport?.('CSV exported successfully')
          }}
        >
          Export CSV
        </button>
      </div>
    </header>
  )
}
