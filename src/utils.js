export function fmtAmt(n) {
  return '$' + Number(n).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: '2-digit',
  })
}

export function exportToCSV(transactions) {
  const rows = [
    ['ID', 'Name', 'Date', 'Amount', 'Category', 'Type'],
    ...transactions.map(t => [t.id, t.name, t.date, t.amount, t.category, t.type]),
  ]
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'zorvyn_transactions.csv'
  a.click()
  URL.revokeObjectURL(url)
}
