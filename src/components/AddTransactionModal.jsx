import React, { useState } from 'react'
import { CATEGORIES } from '../data/transactions'
import styles from './AddTransactionModal.module.css'

const today = new Date().toISOString().split('T')[0]

const defaultForm = {
  name: '',
  amount: '',
  date: today,
  category: CATEGORIES[0],
  type: 'expense',
}

export default function AddTransactionModal({ onAdd, onEdit, onClose, existing }) {
  const isEditing = Boolean(existing)

  const [form, setForm] = useState(
    isEditing
      ? { ...existing, amount: String(existing.amount) }
      : defaultForm
  )
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  function handleSubmit() {
    if (!form.name.trim()) return setError('Description is required.')
    const amt = parseFloat(form.amount)
    if (!form.amount || isNaN(amt) || amt <= 0) return setError('Enter a valid amount.')
    if (!form.date) return setError('Date is required.')

    const data = {
      name: form.name.trim(),
      amount: amt,
      date: form.date,
      category: form.category,
      type: form.type,
    }

    if (isEditing) {
      onEdit({ id: existing.id, ...data })
    } else {
      onAdd(data)
    }
    onClose()
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.overlay} onClick={handleBackdrop}>
      <div className={styles.modal}>
        <div className={styles.title}>{isEditing ? 'Edit Transaction' : 'New Transaction'}</div>

        <div className={styles.formRow}>
          <label className={styles.label}>Description</label>
          <input
            className={styles.input}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Grocery Store"
          />
        </div>

        <div className={styles.formRow}>
          <label className={styles.label}>Amount ($)</label>
          <input
            className={styles.input}
            name="amount"
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>

        <div className={styles.formRow}>
          <label className={styles.label}>Date</label>
          <input
            className={styles.input}
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formRow}>
          <label className={styles.label}>Category</label>
          <select className={styles.input} name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className={styles.formRow}>
          <label className={styles.label}>Type</label>
          <select className={styles.input} name="type" value={form.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.btns}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.addBtn} onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  )
}