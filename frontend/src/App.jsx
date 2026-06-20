import React from 'react'
import Header from './components/Header'
import StatCards from './components/StatCards'
import AddTransactionForm from './components/AddTransactionForm'
import TransactionList from './components/TransactionList'
import Toast from './components/Toast'
import { useFreighter } from './hooks/useFreighter'
import { useExpenses } from './hooks/useExpenses'

export default function App() {
  const { publicKey, isConnected, isLoading: walletLoading, error: walletError, connect, disconnect } = useFreighter()
  const {
    transactions,
    totalIncome,
    totalExpense,
    balance,
    isLoading,
    isMutating,
    error,
    toast,
    fetchAll,
    handleAdd,
    handleDelete,
  } = useExpenses(publicKey)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Header
        publicKey={publicKey}
        isConnected={isConnected}
        isLoading={walletLoading}
        onConnect={connect}
        onDisconnect={disconnect}
      />

      <main style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '32px 24px 64px',
      }}>
        {/* Page title */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{
            fontSize: 26,
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.5px',
            marginBottom: 6,
          }}>
            Dashboard Keuangan
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Data disimpan dan dibaca langsung dari Soroban smart contract di Stellar Testnet
          </p>
        </div>

        {/* Wallet error banner */}
        {walletError && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            padding: '14px 18px',
            background: 'var(--expense-dim)',
            border: '1px solid rgba(244,63,94,0.3)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 24,
            fontSize: 13,
            color: 'var(--expense)',
          }}>
            <span>⚠️</span>
            <div>
              <strong>Wallet Error:</strong> {walletError}
              {walletError.includes('install') && (
                <div style={{ marginTop: 4 }}>
                  <a
                    href="https://www.freighter.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--accent)', textDecoration: 'underline' }}
                  >
                    Download Freighter Wallet →
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Fetch error */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            padding: '14px 18px',
            background: 'rgba(251,191,36,0.08)',
            border: '1px solid rgba(251,191,36,0.3)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 24,
            fontSize: 13,
            color: '#fbbf24',
          }}>
            <span>⚠️ {error}</span>
            <button
              onClick={fetchAll}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                background: 'rgba(251,191,36,0.15)',
                border: '1px solid rgba(251,191,36,0.3)',
                color: '#fbbf24',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Stat cards */}
        <StatCards
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          balance={balance}
          isLoading={isLoading}
        />

        {/* Main content: form + list side by side */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '340px 1fr',
          gap: 20,
          alignItems: 'start',
        }}>
          <AddTransactionForm
            onAdd={handleAdd}
            isMutating={isMutating}
            isConnected={isConnected}
          />

          <TransactionList
            transactions={transactions}
            isLoading={isLoading}
            isMutating={isMutating}
            onDelete={handleDelete}
            isConnected={isConnected}
          />
        </div>

        {/* Refresh button */}
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <button
            onClick={fetchAll}
            disabled={isLoading}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              fontSize: 12,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ display: 'inline-block', animation: isLoading ? 'spin 1s linear infinite' : 'none' }}>↻</span>
            {isLoading ? 'Memuat...' : 'Refresh dari blockchain'}
          </button>
        </div>
      </main>

      <Toast toast={toast} />
    </div>
  )
}
