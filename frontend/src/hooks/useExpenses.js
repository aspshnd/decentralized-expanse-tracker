import { useState, useEffect, useCallback } from 'react'
import {
  getTransactions,
  getTotalIncome,
  getTotalExpense,
  getBalance,
  addTransaction,
  deleteTransaction,
  signAndSubmit,
} from '../utils/soroban'

export function useExpenses(publicKey) {
  const [transactions, setTransactions] = useState([])
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
  const [balance, setBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isMutating, setIsMutating] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchAll = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [txs, inc, exp, bal] = await Promise.all([
        getTransactions(),
        getTotalIncome(),
        getTotalExpense(),
        getBalance(),
      ])
      setTransactions(txs)
      setTotalIncome(inc)
      setTotalExpense(exp)
      setBalance(bal)
    } catch (e) {
      setError('Gagal memuat data dari blockchain: ' + e.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const handleAdd = useCallback(async (form) => {
    if (!publicKey) {
      showToast('Hubungkan wallet Freighter terlebih dahulu', 'error')
      return false
    }
    setIsMutating(true)
    try {
      const xdrTx = await addTransaction(form, publicKey)
      await signAndSubmit(xdrTx)
      showToast('Transaksi berhasil ditambahkan! ✓')
      await fetchAll()
      return true
    } catch (e) {
      showToast('Gagal: ' + (e.message || 'Unknown error'), 'error')
      return false
    } finally {
      setIsMutating(false)
    }
  }, [publicKey, fetchAll])

  const handleDelete = useCallback(async (id) => {
    if (!publicKey) {
      showToast('Hubungkan wallet Freighter terlebih dahulu', 'error')
      return
    }
    setIsMutating(true)
    try {
      const xdrTx = await deleteTransaction(id, publicKey)
      await signAndSubmit(xdrTx)
      showToast('Transaksi berhasil dihapus')
      await fetchAll()
    } catch (e) {
      showToast('Gagal menghapus: ' + (e.message || 'Unknown error'), 'error')
    } finally {
      setIsMutating(false)
    }
  }, [publicKey, fetchAll])

  return {
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
  }
}
