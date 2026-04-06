import React from 'react'
import { fmtAmt } from '../utils'
import styles from './SummaryCards.module.css'

export default function SummaryCards({ stats, txCount }) {
  const { income, expenses, balance, savingsRate } = stats

  const cards = [
    {
      label: 'Net Balance',
      value: fmtAmt(balance),
      delta: `${balance >= 0 ? '▲' : '▼'} ${Math.abs(savingsRate)}% savings rate`,
      deltaUp: balance >= 0,
      icon: '◎',
    },
    {
      label: 'Total Income',
      value: fmtAmt(income),
      valueColor: 'var(--green)',
      delta: '▲ All time',
      deltaUp: true,
      icon: '↑',
    },
    {
      label: 'Total Expenses',
      value: fmtAmt(expenses),
      valueColor: 'var(--red)',
      delta: '▼ All time',
      deltaUp: false,
      icon: '↓',
    },
    {
      label: 'Transactions',
      value: txCount,
      delta: '▲ Active records',
      deltaUp: true,
      icon: '≡',
    },
  ]

  return (
    <div className={styles.grid}>
      {cards.map((c, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.icon}>{c.icon}</div>
          <div className={styles.label}>{c.label}</div>
          <div className={styles.value} style={{ color: c.valueColor }}>
            {c.value}
          </div>
          <div className={`${styles.delta} ${c.deltaUp ? styles.up : styles.down}`}>
            {c.delta}
          </div>
        </div>
      ))}
    </div>
  )
}
