import React from 'react'
import { CONTRACT_ID } from '../utils/soroban'

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 32px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-surface)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(8px)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 36,
    height: 36,
    background: 'var(--accent)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    flexShrink: 0,
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.2,
  },
  logoTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.3px',
  },
  logoSub: {
    fontSize: 11,
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  contractBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 10px',
    background: 'var(--bg-raised)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    fontSize: 11,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--accent)',
    flexShrink: 0,
    boxShadow: '0 0 6px var(--accent)',
  },
  walletBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    transition: 'all 0.15s ease',
    cursor: 'pointer',
  },
  walletAddress: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 14px',
    background: 'var(--accent-dim)',
    border: '1px solid var(--border-accent)',
    borderRadius: 10,
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent)',
  },
}

function truncate(addr) {
  if (!addr) return ''
  return addr.slice(0, 6) + '…' + addr.slice(-4)
}

export default function Header({ publicKey, isConnected, isLoading, onConnect, onDisconnect }) {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>💰</div>
        <div style={styles.logoText}>
          <span style={styles.logoTitle}>Expense Tracker</span>
          <span style={styles.logoSub}>Stellar Testnet</span>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.contractBadge}>
          <div style={styles.dot} />
          {truncate(CONTRACT_ID)}
        </div>

        {isConnected ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={styles.walletAddress}>
              <span>◈</span>
              {truncate(publicKey)}
            </div>
            <button
              onClick={onDisconnect}
              style={{
                ...styles.walletBtn,
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                fontSize: 12,
                padding: '6px 10px',
              }}
            >
              Keluar
            </button>
          </div>
        ) : (
          <button
            onClick={onConnect}
            disabled={isLoading}
            style={{
              ...styles.walletBtn,
              background: isLoading ? 'var(--bg-raised)' : 'var(--accent)',
              color: isLoading ? 'var(--text-secondary)' : '#0a0e17',
              border: 'none',
            }}
          >
            {isLoading ? (
              <>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', borderTop: '2px solid currentColor', borderRight: '2px solid transparent', width: 12, height: 12, borderRadius: '50%' }} />
                Connecting...
              </>
            ) : (
              <>🔗 Connect Freighter</>
            )}
          </button>
        )}
      </div>
    </header>
  )
}
