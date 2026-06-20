import { useState, useEffect, useCallback } from 'react'

export function useFreighter() {
  const [publicKey, setPublicKey] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Check if already connected on mount
  useEffect(() => {
    checkConnection()
  }, [])

  async function checkConnection() {
    try {
      const { isConnected: connected, getPublicKey } = await import('@stellar/freighter-api')
      const connResult = await connected()
      const conn = typeof connResult === 'object' ? connResult.isConnected : connResult
      if (conn) {
        const pkResult = await getPublicKey()
        const pk = typeof pkResult === 'object' ? pkResult.publicKey : pkResult
        if (pk) {
          setPublicKey(pk)
          setIsConnected(true)
        }
      }
    } catch (e) {
      // Freighter not installed or not accessible
    }
  }

  const connect = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { isConnected: connected, requestAccess, getPublicKey } = await import('@stellar/freighter-api')

      const connResult = await connected()
      const conn = typeof connResult === 'object' ? connResult.isConnected : connResult

      if (!conn) {
        throw new Error('Freighter wallet tidak ditemukan. Silakan install ekstensi Freighter.')
      }

      await requestAccess()
      const pkResult = await getPublicKey()
      const pk = typeof pkResult === 'object' ? pkResult.publicKey : pkResult

      setPublicKey(pk)
      setIsConnected(true)
    } catch (e) {
      setError(e.message || 'Gagal connect ke Freighter')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setPublicKey(null)
    setIsConnected(false)
  }, [])

  return { publicKey, isConnected, isLoading, error, connect, disconnect }
}
