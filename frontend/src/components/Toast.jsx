import React from 'react'

export default function Toast({ toast }) {
  if (!toast) return null

  const isError = toast.type === 'error'

  return (
    <div
      className="animate-fade"
      style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '14px 20px',
        borderRadius: 'var(--radius-md)',
        background: isError ? '#1a0f12' : '#0a1a14',
        border: `1px solid ${isError ? 'var(--expense)' : 'var(--income)'}`,
        color: isError ? 'var(--expense)' : 'var(--income)',
        fontSize: 14,
        fontWeight: 500,
        boxShadow: 'var(--shadow-md)',
        maxWidth: 380,
      }}
    >
      <span style={{ fontSize: 18 }}>{isError ? '⚠️' : '✓'}</span>
      {toast.message}
    </div>
  )
}
