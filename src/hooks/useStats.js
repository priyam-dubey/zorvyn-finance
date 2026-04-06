import { useMemo } from 'react'
import { MONTHS } from '../data/transactions'

export function useStats(transactions) {
  return useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0)

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0)

    const balance = income - expenses
    const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : '0.0'

    // Monthly breakdown
    const monthly = {}
    MONTHS.forEach(m => { monthly[m] = { income: 0, expense: 0 } })
    transactions.forEach(t => {
      const m = new Date(t.date).toLocaleString('en', { month: 'short' })
      if (monthly[m]) monthly[m][t.type] += t.amount
    })

    // Category breakdown (expenses only)
    const catMap = {}
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + t.amount })
    const catData = Object.entries(catMap).sort((a, b) => b[1] - a[1])

    // Balance trend
    const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date))
    let running = 0
    const trend = sorted.map(t => {
      running += t.type === 'income' ? t.amount : -t.amount
      return { date: t.date, balance: Math.round(running) }
    }).slice(-12)

    // Income sources
    const incomeSources = [...new Set(
      transactions.filter(t => t.type === 'income').map(t => t.category)
    )]

    const avgExpense = expenses / Math.max(
      transactions.filter(t => t.type === 'expense').length, 1
    )

    return {
      income,
      expenses,
      balance,
      savingsRate,
      monthly,
      catData,
      trend,
      incomeSources,
      avgExpense,
    }
  }, [transactions])
}
