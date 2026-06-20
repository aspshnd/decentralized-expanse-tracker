# 💰 Decentralized Expense Tracker

A decentralized expense tracking smart contract built on the Stellar blockchain using Soroban SDK.

## Project Description

Decentralized Expense Tracker is a blockchain-based application that enables users to record and manage financial transactions directly on the Stellar network. The smart contract stores transaction data on-chain, allowing users to track income, expenses, and account balances without relying on a centralized database.

The application demonstrates how Soroban smart contracts can be used to build transparent and secure financial management systems using blockchain technology.

---

## Project Vision

The goal of this project is to provide a simple and transparent expense tracking system powered by blockchain technology.

Our vision includes:

* Promoting decentralized financial record management.
* Demonstrating practical use cases of Soroban Smart Contracts.
* Providing transparent and immutable transaction storage.
* Reducing dependence on centralized databases.
* Encouraging Web3 adoption through real-world applications.

---

## Features

### 📈 Add Transactions

Users can add financial transactions and classify them as:

* Income
* Expense

Each transaction contains:

* Unique ID
* Amount
* Category
* Description
* Transaction Type

---

### 📋 View Transactions

Retrieve all stored transactions from the smart contract.

---

### 🗑 Delete Transactions

Remove a transaction using its unique ID.

---

### 💵 Calculate Total Income

Calculate the total amount of all income transactions.

---

### 💸 Calculate Total Expense

Calculate the total amount of all expense transactions.

---

### ⚖️ Calculate Balance

Automatically calculate the current balance using:

```text
Balance = Total Income - Total Expense
```

---

## Smart Contract Functions

### add_transaction()

Create a new transaction.

Parameters:

```rust
add_transaction(
    amount: i128,
    category: String,
    description: String,
    tx_type: TransactionType,
)
```

Returns:

```text
"Transaksi berhasil ditambahkan"
```

---

### get_transactions()

Retrieve all stored transactions.

Returns:

```rust
Vec<Transaction>
```

---

### delete_transaction()

Delete a transaction by its ID.

Parameters:

```rust
delete_transaction(id: u64)
```

Returns:

```text
"Transaksi berhasil dihapus"
```

or

```text
"Transaksi tidak ditemukan"
```

---

### total_income()

Calculate total income.

Returns:

```rust
i128
```

---

### total_expense()

Calculate total expenses.

Returns:

```rust
i128
```

---

### get_balance()

Calculate current balance.

Returns:

```rust
i128
```

---

## Data Structures

### Transaction Type

```rust
#[contracttype]
#[derive(Clone, Debug)]
pub enum TransactionType {
    Income,
    Expense,
}
```

### Transaction

```rust
#[contracttype]
#[derive(Clone, Debug)]
pub struct Transaction {
    pub id: u64,
    pub amount: i128,
    pub category: String,
    pub description: String,
    pub tx_type: TransactionType,
}
```

---

## Storage

The contract stores all transactions using Soroban Instance Storage.

Storage Key:

```rust
const TRANSACTION_DATA: Symbol = symbol_short!("TX_DATA");
```

All transaction records are stored in a vector:

```rust
Vec<Transaction>
```

---

## Contract Architecture

```text
User
 │
 ▼
Expense Tracker Contract
 │
 ├── add_transaction()
 ├── get_transactions()
 ├── delete_transaction()
 ├── total_income()
 ├── total_expense()
 └── get_balance()
 │
 ▼
Soroban Instance Storage
```

---

## Example Usage

### Add Income

```text
Amount      : 5000000
Category    : Salary
Description : Monthly Salary
Type        : Income
```

### Add Expense

```text
Amount      : 50000
Category    : Food
Description : Lunch
Type        : Expense
```

### Balance Result

```text
Total Income  : 5000000
Total Expense : 50000
Balance       : 4950000
```

---

## Technical Stack

### Blockchain

* Stellar Testnet

### Smart Contract Framework

* Soroban SDK

### Programming Language

* Rust

### Storage

* Soroban Instance Storage

---

## Future Improvements

Future versions may include:

* Wallet-based authentication
* User-specific transaction records
* Transaction update functionality
* Monthly financial reports
* Budget planning features
* Transaction categories analytics
* Dashboard integration
* Event logging
* Multi-user support

---

## Learning Outcomes

This project demonstrates:

* Soroban Smart Contract Development
* Rust Programming Fundamentals
* Blockchain Data Storage
* Transaction Management Logic
* Financial Data Processing
* Smart Contract Deployment on Stellar

---

## Conclusion

Decentralized Expense Tracker is a simple yet practical decentralized application that showcases how Soroban smart contracts can be used to manage financial records on-chain. By storing transaction data directly on the Stellar blockchain, the application provides transparency, integrity, and a foundation for more advanced decentralized finance and budgeting solutions.
