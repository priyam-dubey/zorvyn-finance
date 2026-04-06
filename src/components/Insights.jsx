import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { MONTHS, CAT_COLORS } from '../data/transactions'
import { fmtAmt } from '../utils'
import styles from './Insights.module.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

export default function Insights({ stats, txCount }) {
  const { income, expenses, balance, savingsRate, catData, monthly, incomeSources, avgExpense } = stats

  const thisMonth = MONTHS[MONTHS.length - 1]
  const lastMonth = MONTHS[MONTHS.length - 2]
  const thisExp = monthly[thisMonth]?.expense || 0
  const lastExp = monthly[lastMonth]?.expense || 0
  const monthDiff = thisExp - lastExp
  const monthDiffPct = lastExp > 0 ? ((monthDiff / lastExp) * 100).toFixed(1) : '0.0'

  const topCat = catData[0]

  const insightCards = [
    {
      icon: '◈',
      label: 'Top Spending Category',
      value: topCat ? topCat[0] : '—',
      desc: topCat
        ? `${fmtAmt(topCat[1])} spent — ${expenses > 0 ? ((topCat[1] / expenses) * 100).toFixed(1) : 0}% of all expenses`
        : 'No expense data yet',
      progress: topCat && expenses > 0 ? (topCat[1] / expenses) * 100 : 0,
    },
    {
      icon: '↔',
      label: 'Month-over-Month',
      value: `${monthDiff > 0 ? '+' : ''}${monthDiffPct}%`,
      valueColor: monthDiff > 0 ? 'var(--red)' : 'var(--green)',
      desc: `Expenses in ${thisMonth} vs ${lastMonth}. ${monthDiff > 0 ? 'Up' : 'Down'} by ${fmtAmt(Math.abs(monthDiff))}.`,
    },
    {
      icon: '◇',
      label: 'Average Expense',
      value: fmtAmt(avgExpense),
      desc: `Per transaction across all expense records.`,
    },
    {
      icon: '◑',
      label: 'Savings Rate',
      value: `${savingsRate}%`,
      valueColor: parseFloat(savingsRate) >= 0 ? 'var(--green)' : 'var(--red)',
      desc: balance >= 0
        ? 'You are spending less than you earn — great job!'
        : 'Expenses exceed income — consider reviewing your budget.',
      progress: Math.min(Math.max(parseFloat(savingsRate), 0), 100),
    },
    {
      icon: '◎',
      label: 'Income Sources',
      value: `${incomeSources.length} sources`,
      desc: `${incomeSources.join(', ') || 'No income recorded'}`,
    },
    {
      icon: '◐',
      label: 'Category Diversity',
      value: `${catData.length} categories`,
      desc: `Spending tracked across ${catData.length} unique expense categories.`,
    },
  ]

  // Horizontal bar chart for category ranking
  const sorted = catData.slice(0, 8)
  const hbarConfig = {
    labels: sorted.map(c => c[0]),
    datasets: [{
      data: sorted.map(c => Math.round(c[1])),
      backgroundColor: sorted.map((_, i) => CAT_COLORS[i % CAT_COLORS.length]),
      borderRadius: 4,
      borderSkipped: false,
    }],
  }

  const hbarOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: {
          color: '#5a6478',
          font: { size: 10 },
          callback: v => '$' + Math.round(v),
        },
        grid: { color: 'rgba(255,255,255,0.04)' },
      },
      y: {
        ticks: { color: '#8b96a8', font: { size: 11 } },
        grid: { display: false },
      },
    },
  }

  if (!catData.length && income === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text3)' }}>
        <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>◎</div>
        <div style={{ fontSize: 14 }}>No data yet — add transactions to see insights</div>
      </div>
    )
  }

  return (
    <div>
      <div className={styles.sectionTitle}>Insights</div>

      <div className={styles.grid}>
        {insightCards.map((c, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.icon}>{c.icon}</div>
            <div className={styles.label}>{c.label}</div>
            <div className={styles.value} style={{ color: c.valueColor }}>{c.value}</div>
            <div className={styles.desc}>{c.desc}</div>
            {c.progress !== undefined && (
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{ width: `${c.progress}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.chartCard}>
        <div className={styles.chartTitle}>Spending by Category</div>
        <div className={styles.chartSubtitle}>Ranked highest to lowest — all time</div>
        <div style={{ position: 'relative', height: `${Math.max(sorted.length * 40 + 40, 200)}px` }}>
          <Bar data={hbarConfig} options={hbarOptions} />
        </div>
      </div>
    </div>
  )
}
