import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Doughnut, Bar } from 'react-chartjs-2'
import { MONTHS, CAT_COLORS } from '../data/transactions'
import { fmtDate } from '../utils'
import styles from './Charts.module.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
)

const GRID_COLOR = 'rgba(255,255,255,0.04)'
const TICK_COLOR = '#5a6478'

export default function Charts({ stats }) {
  const { monthly, catData, trend } = stats

  // Trend chart
  const trendConfig = {
    labels: trend.map(p => fmtDate(p.date)),
    datasets: [{
      label: 'Balance',
      data: trend.map(p => p.balance),
      borderColor: '#c9a84c',
      backgroundColor: 'rgba(201,168,76,0.08)',
      borderWidth: 2,
      pointRadius: 3,
      pointBackgroundColor: '#c9a84c',
      fill: true,
      tension: 0.4,
    }],
  }

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: TICK_COLOR, font: { size: 10 } }, grid: { color: GRID_COLOR } },
      y: {
        ticks: {
          color: TICK_COLOR,
          font: { size: 10 },
          callback: v => '$' + Math.round(v / 1000) + 'k',
        },
        grid: { color: GRID_COLOR },
      },
    },
  }

  // Donut chart
  const topCats = catData.slice(0, 6)
  const donutColors = ['#c9a84c', '#4a9eff', '#e74c3c', '#2ecc71', '#a78bfa', '#f39c12']
  const donutConfig = {
    labels: topCats.map(c => c[0]),
    datasets: [{
      data: topCats.map(c => Math.round(c[1])),
      backgroundColor: donutColors,
      borderWidth: 2,
      borderColor: '#161b22',
    }],
  }

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    cutout: '68%',
  }

  const totalCatSpend = topCats.reduce((s, c) => s + c[1], 0)

  // Bar chart
  const barConfig = {
    labels: MONTHS,
    datasets: [
      {
        label: 'Income',
        data: MONTHS.map(m => Math.round(monthly[m]?.income || 0)),
        backgroundColor: 'rgba(46,204,113,0.7)',
        borderRadius: 4,
      },
      {
        label: 'Expense',
        data: MONTHS.map(m => Math.round(monthly[m]?.expense || 0)),
        backgroundColor: 'rgba(231,76,60,0.7)',
        borderRadius: 4,
      },
    ],
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: { color: '#8b96a8', font: { size: 11 }, boxWidth: 10, boxHeight: 10 },
      },
    },
    scales: {
      x: { ticks: { color: TICK_COLOR, font: { size: 11 } }, grid: { color: GRID_COLOR } },
      y: {
        ticks: {
          color: TICK_COLOR,
          font: { size: 10 },
          callback: v => '$' + Math.round(v / 1000) + 'k',
        },
        grid: { color: GRID_COLOR },
      },
    },
  }

  if (!trend.length && !topCats.length) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text3)' }}>
        <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>◎</div>
        <div style={{ fontSize: 14 }}>No data yet — add transactions to see charts</div>
      </div>
    )
  }

  return (
    <>
      <div className={styles.chartsGrid}>
        {/* Trend chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>Balance Trend</div>
          <div className={styles.chartSubtitle}>Running balance over all transactions</div>
          <div className={styles.trendWrap}>
            <Line data={trendConfig} options={trendOptions} />
          </div>
        </div>

        {/* Donut chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>Spending Breakdown</div>
          <div className={styles.chartSubtitle}>By category — all time</div>
          <div className={styles.donutWrap}>
            <Doughnut data={donutConfig} options={donutOptions} />
          </div>
          <div className={styles.donutLegend}>
            {topCats.map((c, i) => (
              <div key={c[0]} className={styles.legendItem}>
                <div className={styles.legendLabel}>
                  <div className={styles.legendDot} style={{ background: donutColors[i] }} />
                  {c[0]}
                </div>
                <div className={styles.legendVal}>
                  {totalCatSpend > 0 ? ((c[1] / totalCatSpend) * 100).toFixed(1) : 0}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly bar */}
      <div className={styles.chartCard}>
        <div className={styles.chartTitle}>Monthly Comparison</div>
        <div className={styles.chartSubtitle}>Income vs Expenses — last 6 months</div>
        <div className={styles.barWrap}>
          <Bar data={barConfig} options={barOptions} />
        </div>
      </div>
    </>
  )
}
