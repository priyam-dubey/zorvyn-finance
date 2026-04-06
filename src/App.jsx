import React from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { useStats } from './hooks/useStats'
import { useNotification } from './hooks/useNotification'
import Topbar from './components/Topbar'
import Navbar from './components/Navbar'
import Overview from './components/Overview'
import TransactionsTable from './components/TransactionsTable'
import Insights from './components/Insights'
import Notification from './components/Notification'
import styles from './App.module.css'

function Dashboard() {
  const { state } = useApp()
  const stats = useStats(state.transactions)
  const { notifications, notify } = useNotification()

  return (
    <div className={styles.layout}>
      <Topbar onExport={notify} />
      <Navbar />

      <main className={styles.main}>
        {state.activeTab === 'overview' && (
          <Overview stats={stats} txCount={state.transactions.length} />
        )}
        {state.activeTab === 'transactions' && (
          <TransactionsTable onNotify={notify} />
        )}
        {state.activeTab === 'insights' && (
          <Insights stats={stats} txCount={state.transactions.length} />
        )}
      </main>

      <Notification notifications={notifications} />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  )
}
