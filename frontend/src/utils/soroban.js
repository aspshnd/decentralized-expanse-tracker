import {
  Contract,
  SorobanRpc,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  xdr,
  nativeToScVal,
  scValToNative,
  Keypair,
  Account,
} from '@stellar/stellar-sdk'

export const CONTRACT_ID = 'CB5FFSZN6PDTL6HEI5FDYXJEHQNIKYVXPSZK4QOGDIPOU4F2B3MVBYOB'
export const NETWORK_PASSPHRASE = Networks.TESTNET
export const RPC_URL = 'https://soroban-testnet.stellar.org'

const server = new SorobanRpc.Server(RPC_URL)
const contract = new Contract(CONTRACT_ID)

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Parse retval dari simulasi — bisa berupa xdr.ScVal object atau base64 string.
 */
function parseRetval(retval) {
  if (!retval) return null
  // Jika sudah xdr.ScVal object, langsung pakai
  if (typeof retval === 'object' && typeof retval.switch === 'function') {
    return retval
  }
  // Jika string base64 XDR, decode dulu
  if (typeof retval === 'string') {
    return xdr.ScVal.fromXDR(retval, 'base64')
  }
  return retval
}

/**
 * Untuk read-only simulation, tidak perlu account nyata.
 * Gunakan random keypair + sequence 0 agar tidak perlu network call.
 */
function makeFakeAccount() {
  const kp = Keypair.random()
  return new Account(kp.publicKey(), '0')
}

// ─── Simulation (read-only calls) ───────────────────────────────────────────

async function simulateCall(operation) {
  const source = makeFakeAccount()
  const tx = new TransactionBuilder(source, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(operation)
    .setTimeout(30)
    .build()

  const result = await server.simulateTransaction(tx)
  if (SorobanRpc.Api.isSimulationError(result)) {
    throw new Error(result.error)
  }
  return result
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function getTransactions() {
  const op = contract.call('get_transactions')
  const sim = await simulateCall(op)
  const retval = parseRetval(sim.result?.retval)
  if (!retval) return []

  const items = scValToNative(retval)
  if (!Array.isArray(items)) return []

  return items.map((item) => ({
    id: Number(item.id),
    amount: Number(item.amount),
    category: String(item.category),
    description: String(item.description),
    tx_type: String(item.tx_type) === 'Income' ? 'Income' : 'Expense',
  }))
}

export async function getTotalIncome() {
  const op = contract.call('total_income')
  const sim = await simulateCall(op)
  const retval = parseRetval(sim.result?.retval)
  if (!retval) return 0
  return Number(scValToNative(retval))
}

export async function getTotalExpense() {
  const op = contract.call('total_expense')
  const sim = await simulateCall(op)
  const retval = parseRetval(sim.result?.retval)
  if (!retval) return 0
  return Number(scValToNative(retval))
}

export async function getBalance() {
  const op = contract.call('get_balance')
  const sim = await simulateCall(op)
  const retval = parseRetval(sim.result?.retval)
  if (!retval) return 0
  return Number(scValToNative(retval))
}

// ─── Write operations (requires wallet) ─────────────────────────────────────

export async function addTransaction({ amount, category, description, tx_type }, publicKey) {
  const source = await server.getAccount(publicKey)

  const txTypeVal = xdr.ScVal.scvVec([xdr.ScVal.scvSymbol(tx_type)])

  const op = contract.call(
    'add_transaction',
    nativeToScVal(BigInt(amount), { type: 'i128' }),
    nativeToScVal(category, { type: 'string' }),
    nativeToScVal(description, { type: 'string' }),
    txTypeVal,
  )

  const tx = new TransactionBuilder(source, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(op)
    .setTimeout(30)
    .build()

  // Simulate first to get footprint
  const sim = await server.simulateTransaction(tx)
  if (SorobanRpc.Api.isSimulationError(sim)) {
    throw new Error('Simulation failed: ' + sim.error)
  }

  const assembled = SorobanRpc.assembleTransaction(tx, sim).build()
  return assembled.toXDR()
}

export async function deleteTransaction(id, publicKey) {
  const source = await server.getAccount(publicKey)

  const op = contract.call(
    'delete_transaction',
    nativeToScVal(BigInt(id), { type: 'u64' }),
  )

  const tx = new TransactionBuilder(source, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(op)
    .setTimeout(30)
    .build()

  const sim = await server.simulateTransaction(tx)
  if (SorobanRpc.Api.isSimulationError(sim)) {
    throw new Error('Simulation failed: ' + sim.error)
  }

  const assembled = SorobanRpc.assembleTransaction(tx, sim).build()
  return assembled.toXDR()
}

export async function signAndSubmit(xdrTx) {
  const { signTransaction } = await import('@stellar/freighter-api')
  const signed = await signTransaction(xdrTx, {
    networkPassphrase: NETWORK_PASSPHRASE,
  })

  // signed may be string or object depending on freighter version
  const signedXdr = typeof signed === 'string' ? signed : signed.signedTxXdr

  const tx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)
  const result = await server.sendTransaction(tx)

  if (result.status === 'ERROR') {
    throw new Error('Transaction failed: ' + JSON.stringify(result.errorResult))
  }

  // Poll for confirmation
  let getResult = await server.getTransaction(result.hash)
  let attempts = 0
  while (getResult.status === SorobanRpc.Api.GetTransactionStatus.NOT_FOUND && attempts < 20) {
    await new Promise((r) => setTimeout(r, 1500))
    getResult = await server.getTransaction(result.hash)
    attempts++
  }

  if (getResult.status === SorobanRpc.Api.GetTransactionStatus.FAILED) {
    throw new Error('Transaction failed on-chain')
  }

  return getResult
}