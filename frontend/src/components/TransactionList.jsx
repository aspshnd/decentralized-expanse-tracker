import React, { useState } from 'react'

function formatAmount(n) {
  return new Intl.NumberFormat('id-ID').format(n)
}

function EmptyState({ isLoading }) {
  if (isLoading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <div style={{
          width: 36,
          height: 36,
          border: '3px solid var(--bg-raised)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px',
        }} />
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Memuat dari blockchain...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '48px 0', textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
      <p style={{ color: 'var(--text-secondary)', fontSize: 15, fontWeight: 500 }}>Belum ada transaksi</p>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>Tambahkan transaksi pertama Anda</p>
    </div>
  )
}

export default function TransactionList({ transactions, isLoading, isMutating, onDelete, isConnected }) {
  const [deletingId, setDeletingId] = useState(null)
  const [filter, setFilter] = useState('All')

  async function handleDelete(id) {
    setDeletingId(id)
    await onDelete(id)
    setDeletingId(null)
  }

  const filtered = filter === 'All'
    ? transactions
    : transactions.filter((t) => t.tx_type === filter)

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 24,
      flex: 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
            Riwayat Transaksi
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {transactions.length} transaksi on-chain
          </p>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 6 }}>
          {['All', 'Income', 'Expense'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '5px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.15s',
                borderColor: filter === f
                  ? (f === 'Income' ? 'var(--income)' : f === 'Expense' ? 'var(--expense)' : 'var(--accent)')
                  : 'var(--border)',
                background: filter === f
                  ? (f === 'Income' ? 'var(--income-dim)' : f === 'Expense' ? 'var(--expense-dim)' : 'var(--accent-dim)')
                  : 'transparent',
                color: filter === f
                  ? (f === 'Income' ? 'var(--income)' : f === 'Expense' ? 'var(--expense)' : 'var(--accent)')
                  : 'var(--text-muted)',
              }}
            >
              {f === 'All' ? 'Semua' : f === 'Income' ? 'Pemasukan' : 'Pengeluaran'}
            </button>
          ))}
        </div>
      </div>

      {isLoading || filtered.length === 0 ? (
        <EmptyState isLoading={isLoading} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((tx) => {
            const isIncome = tx.tx_type === 'Income'
            const isDeleting = deletingId === tx.id

            return (
              <div
                key={tx.id}
                className="animate-fade"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 16px',
                  background: 'var(--bg-raised)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'border-color 0.15s',
                  opacity: isDeleting ? 0.5 : 1,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = isIncome ? 'rgba(34,197,94,0.3)' : 'rgba(244,63,94,0.3)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
              >
                {/* Icon */}
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: isIncome ? 'var(--income-dim)' : 'var(--expense-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  flexShrink: 0,
                }}>
                  {isIncome ? '📈' : '📉'}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.description}
                    </span>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: '2px 7px',
                      borderRadius: 20,
                      background: isIncome ? 'var(--income-dim)' : 'var(--expense-dim)',
                      color: isIncome ? 'var(--income)' : 'var(--expense)',
                      letterSpacing: '0.3px',
                      flexShrink: 0,
                    }}>
                      {tx.category}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    ID #{tx.id}
                  </div>
                </div>

                {/* Amount */}
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 15,
                  fontWeight: 700,
                  color: isIncome ? 'var(--income)' : 'var(--expense)',
                  textAlign: 'right',
                  flexShrink: 0,
                }}>
                  {isIncome ? '+' : '-'}{formatAmount(tx.amount)}
                </div>

                {/* Delete */}
                {isConnected && (
                  <button
                    onClick={() => handleDelete(tx.id)}
                    disabled={isMutating || isDeleting}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      color: 'var(--text-muted)',
                      cursor: isMutating ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      transition: 'all 0.15s',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => { if (!isMutating) { e.currentTarget.style.background = 'var(--expense-dim)'; e.currentTarget.style.borderColor = 'var(--expense)'; e.currentTarget.style.color = 'var(--expense)' } }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                    title="Hapus transaksi"
                  >
                    {isDeleting ? '⏳' : '🗑'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
