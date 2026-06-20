import React from 'react'

function formatAmount(n) {
  if (n === null || n === undefined) return '—'
  return new Intl.NumberFormat('id-ID').format(n)
}

const card = {
  padding: '24px',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border)',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  background: 'var(--bg-surface)',
  transition: 'border-color 0.2s',
}

const Skeleton = () => (
  <div style={{ height: 32, width: '70%', borderRadius: 6, background: 'var(--bg-raised)', animation: 'pulse 1.5s ease-in-out infinite' }} />
)

export default function StatCards({ totalIncome, totalExpense, balance, isLoading }) {
  const cards = [
    {
      label: 'Saldo',
      value: balance,
      prefix: balance >= 0 ? '+' : '',
      color: balance >= 0 ? 'var(--accent)' : 'var(--expense)',
      bg: balance >= 0 ? 'var(--accent-dim)' : 'var(--expense-dim)',
      border: balance >= 0 ? 'var(--border-accent)' : 'rgba(244,63,94,0.3)',
      icon: '⚖️',
      large: true,
    },
    {
      label: 'Total Pemasukan',
      value: totalIncome,
      prefix: '+',
      color: 'var(--income)',
      bg: 'var(--income-dim)',
      border: 'rgba(34,197,94,0.2)',
      icon: '📈',
    },
    {
      label: 'Total Pengeluaran',
      value: totalExpense,
      prefix: '-',
      color: 'var(--expense)',
      bg: 'var(--expense-dim)',
      border: 'rgba(244,63,94,0.2)',
      icon: '📉',
    },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr',
      gap: 16,
      marginBottom: 32,
    }}>
      {cards.map((c) => (
        <div
          key={c.label}
          style={{
            ...card,
            background: c.bg,
            borderColor: c.border,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              {c.label}
            </span>
            <span style={{ fontSize: 20 }}>{c.icon}</span>
          </div>

          {isLoading ? (
            <Skeleton />
          ) : (
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: c.large ? 28 : 22,
              fontWeight: 700,
              color: c.color,
              letterSpacing: '-1px',
              lineHeight: 1.1,
            }}>
              {c.prefix}{formatAmount(c.value)}
            </div>
          )}

          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            XLM (stroops)
          </div>
        </div>
      ))}
    </div>
  )
}
