import React from 'react'
import SummaryCards from './SummaryCards'
import Charts from './Charts'

export default function Overview({ stats, txCount }) {
  return (
    <div>
      <SummaryCards stats={stats} txCount={txCount} />
      <Charts stats={stats} />
    </div>
  )
}
