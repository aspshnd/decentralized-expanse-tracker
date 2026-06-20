# 💰 Expense Tracker — Frontend

Frontend React + Vite untuk Decentralized Expense Tracker di Stellar Testnet.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Install Freighter Wallet

Download ekstensi browser Freighter:
https://www.freighter.app/

Setelah install:
- Buat/import wallet di Freighter
- **Switch ke Testnet**: Settings → Network → Testnet
- Pastikan akun Anda punya sedikit XLM testnet (untuk fee):
  https://laboratory.stellar.org/#account-creator?network=test

### 3. Jalankan dev server

```bash
npm run dev
```

Buka http://localhost:5173

---

## Contract Info

| Key | Value |
|-----|-------|
| Contract ID | `CB5FFSZN6PDTL6HEI5FDYXJEHQNIKYVXPSZK4QOGDIPOU4F2B3MVBYOB` |
| Network | Stellar Testnet |
| RPC | `https://soroban-testnet.stellar.org` |

---

## Cara Pakai

1. **Connect wallet** — klik tombol "Connect Freighter" di kanan atas
2. **Lihat saldo** — balance, total income, total expense tampil di dashboard
3. **Tambah transaksi** — isi form di sebelah kiri, klik "Simpan ke Blockchain"
4. **Freighter akan muncul** — approve transaksi di popup Freighter
5. **Tunggu konfirmasi** — ~5-10 detik sampai on-chain
6. **Hapus transaksi** — klik ikon 🗑 di transaksi (perlu wallet terconnect)

---

## Struktur Project

```
src/
├── components/
│   ├── Header.jsx          # Navbar + wallet connect
│   ├── StatCards.jsx       # Balance, income, expense cards
│   ├── AddTransactionForm.jsx  # Form tambah transaksi
│   ├── TransactionList.jsx # Daftar + filter transaksi
│   └── Toast.jsx           # Notifikasi
├── hooks/
│   ├── useFreighter.js     # Wallet connection state
│   └── useExpenses.js      # Contract data & mutations
├── utils/
│   └── soroban.js          # Semua Soroban contract calls
└── styles/
    └── global.css          # Design system & CSS variables
```

---

## Catatan Penting

- **Amount dalam stroops** — 1 XLM = 10,000,000 stroops
- Semua transaksi bersifat **global** (shared state di contract)
- Untuk production, perlu menambahkan auth per-wallet
