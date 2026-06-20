import React, { useState } from 'react'

const inputStyle = {
  width: '100%',
  background: 'var(--bg-base)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  padding: '10px 14px',
  color: 'var(--text-primary)',
  fontSize: 14,
  transition: 'border-color 0.2s',
}

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

export default function AddTransactionForm({ onAdd, isMutating, isConnected }) {
  const [form, setForm] = useState({
    amount: '',
    category: '',
    description: '',
    tx_type: 'Income',
  })
  const [focused, setFocused] = useState(null)

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.amount || !form.category || !form.description) return
    const success = await onAdd({
      ...form,
      amount: parseInt(form.amount, 10),
    })
    if (success) {
      setForm({ amount: '', category: '', description: '', tx_type: 'Income' })
    }
  }

  const isIncome = form.tx_type === 'Income'

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 24,
    }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          Tambah Transaksi
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Data disimpan langsung di Stellar blockchain
        </p>
      </div>

      {/* Type toggle */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8,
        marginBottom: 20,
        background: 'var(--bg-base)',
        padding: 4,
        borderRadius: 'var(--radius-sm)',
      }}>
        {['Income', 'Expense'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setForm((f) => ({ ...f, tx_type: type }))}
            style={{
              padding: '9px 0',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s',
              background: form.tx_type === type
                ? (type === 'Income' ? 'var(--income)' : 'var(--expense)')
                : 'transparent',
              color: form.tx_type === type ? '#fff' : 'var(--text-muted)',
            }}
          >
            {type === 'Income' ? '📈 Pemasukan' : '📉 Pengeluaran'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>Jumlah (stroops)</label>
          <input
            name="amount"
            type="number"
            min="1"
            placeholder="e.g. 5000000"
            value={form.amount}
            onChange={handleChange}
            onFocus={() => setFocused('amount')}
            onBlur={() => setFocused(null)}
            required
            style={{
              ...inputStyle,
              borderColor: focused === 'amount' ? (isIncome ? 'var(--income)' : 'var(--expense)') : 'var(--border)',
              fontFamily: 'var(--font-mono)',
            }}
          />
        </div>

        <div>
          <label style={labelStyle}>Kategori</label>
          <input
            name="category"
            type="text"
            placeholder="e.g. Gaji, Makan, Transport"
            value={form.category}
            onChange={handleChange}
            onFocus={() => setFocused('category')}
            onBlur={() => setFocused(null)}
            required
            style={{
              ...inputStyle,
              borderColor: focused === 'category' ? (isIncome ? 'var(--income)' : 'var(--expense)') : 'var(--border)',
            }}
          />
        </div>

        <div>
          <label style={labelStyle}>Deskripsi</label>
          <input
            name="description"
            type="text"
            placeholder="e.g. Gaji bulanan Oktober"
            value={form.description}
            onChange={handleChange}
            onFocus={() => setFocused('desc')}
            onBlur={() => setFocused(null)}
            required
            style={{
              ...inputStyle,
              borderColor: focused === 'desc' ? (isIncome ? 'var(--income)' : 'var(--expense)') : 'var(--border)',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isMutating || !isConnected || !form.amount || !form.category || !form.description}
          style={{
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 14,
            fontWeight: 700,
            border: 'none',
            cursor: isMutating || !isConnected ? 'not-allowed' : 'pointer',
            background: !isConnected
              ? 'var(--bg-raised)'
              : isMutating
                ? 'var(--bg-raised)'
                : isIncome ? 'var(--income)' : 'var(--expense)',
            color: !isConnected || isMutating ? 'var(--text-muted)' : '#fff',
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {isMutating ? (
            <>
              <span style={{
                display: 'inline-block',
                width: 14,
                height: 14,
                border: '2px solid var(--text-muted)',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
              Mengirim ke blockchain...
            </>
          ) : !isConnected ? (
            '🔒 Connect wallet dulu'
          ) : (
            `+ Simpan ke Blockchain`
          )}
        </button>
      </form>
    </div>
  )
}
