import React, { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import AddTransactionModal from './AddTransactionModal'
import { fmtAmt, fmtDate } from '../utils'
import styles from './TransactionsTable.module.css'

export default function TransactionsTable({ onNotify }) {
  const { state, dispatch } = useApp()
  const { transactions, filters, sort, role } = state
  const [showModal, setShowModal] = useState(false)
  const [editingTx, setEditingTx] = useState(null)

  const categories = useMemo(
    () => [...new Set(transactions.map(t => t.category))].sort(),
    [transactions]
  )

  const filtered = useMemo(() => {
    let list = transactions.filter(t => {
      if (filters.type && t.type !== filters.type) return false
      if (filters.category && t.category !== filters.category) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (!t.name.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) return false
      }
      return true
    })

    list = [...list].sort((a, b) => {
      if (sort.key === 'amount') return (a.amount - b.amount) * sort.dir
      return a.date.localeCompare(b.date) * sort.dir
    })

    return list
  }, [transactions, filters, sort])

  function handleAdd(tx) {
    dispatch({ type: 'ADD_TRANSACTION', payload: { id: state.nextId, ...tx } })
    onNotify('Transaction added successfully')
  }

  function handleEdit(tx) {
    dispatch({ type: 'EDIT_TRANSACTION', payload: tx })
    onNotify('Transaction updated')
  }

  function handleDelete(id) {
    if (!window.confirm('Delete this transaction?')) return
    dispatch({ type: 'DELETE_TRANSACTION', payload: id })
    onNotify('Transaction deleted')
  }

  function openEdit(tx) {
    setEditingTx(tx)
  }

  function closeModal() {
    setShowModal(false)
    setEditingTx(null)
  }

  function SortBtn({ sortKey, label }) {
    const active = sort.key === sortKey
    return (
      <button
        className={`${styles.sortBtn} ${active ? styles.active : ''}`}
        onClick={() => dispatch({ type: 'SET_SORT', payload: sortKey })}
      >
        {label} {active ? (sort.dir === -1 ? '↓' : '↑') : ''}
      </button>
    )
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>Transactions</div>
          <div className={styles.count}>{filtered.length} of {transactions.length} records</div>
        </div>
        {role === 'admin' && (
          <button className={styles.addBtn} onClick={() => setShowModal(true)}>
            + Add Transaction
          </button>
        )}
      </div>

      {role === 'viewer' && (
        <div className={styles.viewerNotice}>
          ◉ Viewer mode — read only. Switch to Admin to add or edit transactions.
        </div>
      )}

      <div className={styles.controls}>
        <input
          className={styles.search}
          type="text"
          placeholder="Search transactions..."
          value={filters.search}
          onChange={e => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
        />
        <select
          className={styles.filterSel}
          value={filters.type}
          onChange={e => dispatch({ type: 'SET_TYPE_FILTER', payload: e.target.value })}
        >
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          className={styles.filterSel}
          value={filters.category}
          onChange={e => dispatch({ type: 'SET_CAT_FILTER', payload: e.target.value })}
        >
          <option value="">All categories</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <SortBtn sortKey="amount" label="Amount" />
        <SortBtn sortKey="date" label="Date" />
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>Description</div>
          <div>Date</div>
          <div>Category</div>
          <div className={styles.right}>Amount</div>
          <div className={styles.center}>Type</div>
          {role === 'admin' && <div className={styles.center}>Actions</div>}
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>◎</div>
            No transactions found
          </div>
        ) : (
          filtered.map(t => (
            <div key={t.id} className={`${styles.row} ${role === 'admin' ? styles.rowAdmin : ''}`}>
              <div>
                <div className={styles.txName}>{t.name}</div>
              </div>
              <div className={styles.txDate}>{fmtDate(t.date)}</div>
              <div>
                <span className={styles.catBadge}>{t.category}</span>
              </div>
              <div className={`${styles.txAmt} ${styles.right} ${styles[t.type]}`}>
                {t.type === 'expense' ? '−' : '+'} {fmtAmt(t.amount)}
              </div>
              <div className={styles.center}>
                <span className={`${styles.badge} ${styles[t.type]}`}>{t.type}</span>
              </div>
              {role === 'admin' && (
                <div className={styles.actions}>
                  <button className={styles.editBtn} onClick={() => openEdit(t)}>Edit</button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(t.id)}>Del</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {(showModal || editingTx) && (
        <AddTransactionModal
          onAdd={handleAdd}
          onEdit={handleEdit}
          onClose={closeModal}
          existing={editingTx}
        />
      )}
    </div>
  )
}