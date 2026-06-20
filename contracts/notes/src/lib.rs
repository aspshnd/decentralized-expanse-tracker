#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype,
    symbol_short, Env, String, Symbol, Vec,
};

#[contracttype]
#[derive(Clone, Debug)]
pub enum TransactionType {
    Income,
    Expense,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Transaction {
    pub id: u64,
    pub amount: i128,
    pub category: String,
    pub description: String,
    pub tx_type: TransactionType,
}

const TRANSACTION_DATA: Symbol = symbol_short!("TX_DATA");

#[contract]
pub struct ExpenseTrackerContract;

#[contractimpl]
impl ExpenseTrackerContract {

    // Ambil semua transaksi
    pub fn get_transactions(env: Env) -> Vec<Transaction> {
        env.storage()
            .instance()
            .get(&TRANSACTION_DATA)
            .unwrap_or(Vec::new(&env))
    }

    // Tambah transaksi
    pub fn add_transaction(
        env: Env,
        amount: i128,
        category: String,
        description: String,
        tx_type: TransactionType,
    ) -> String {

        let mut transactions: Vec<Transaction> = env
            .storage()
            .instance()
            .get(&TRANSACTION_DATA)
            .unwrap_or(Vec::new(&env));

        let transaction = Transaction {
            id: env.prng().gen::<u64>(),
            amount,
            category,
            description,
            tx_type,
        };

        transactions.push_back(transaction);

        env.storage()
            .instance()
            .set(&TRANSACTION_DATA, &transactions);

        String::from_str(&env, "Transaksi berhasil ditambahkan")
    }

    // Hapus transaksi
    pub fn delete_transaction(env: Env, id: u64) -> String {

        let mut transactions: Vec<Transaction> = env
            .storage()
            .instance()
            .get(&TRANSACTION_DATA)
            .unwrap_or(Vec::new(&env));

        for i in 0..transactions.len() {

            if transactions.get(i).unwrap().id == id {

                transactions.remove(i);

                env.storage()
                    .instance()
                    .set(&TRANSACTION_DATA, &transactions);

                return String::from_str(
                    &env,
                    "Transaksi berhasil dihapus"
                );
            }
        }

        String::from_str(
            &env,
            "Transaksi tidak ditemukan"
        )
    }

    // Total pemasukan
    pub fn total_income(env: Env) -> i128 {

        let transactions: Vec<Transaction> = env
            .storage()
            .instance()
            .get(&TRANSACTION_DATA)
            .unwrap_or(Vec::new(&env));

        let mut total: i128 = 0;

        for i in 0..transactions.len() {

            let tx = transactions.get(i).unwrap();

            match tx.tx_type {
                TransactionType::Income => {
                    total += tx.amount;
                }
                _ => {}
            }
        }

        total
    }

    // Total pengeluaran
    pub fn total_expense(env: Env) -> i128 {

        let transactions: Vec<Transaction> = env
            .storage()
            .instance()
            .get(&TRANSACTION_DATA)
            .unwrap_or(Vec::new(&env));

        let mut total: i128 = 0;

        for i in 0..transactions.len() {

            let tx = transactions.get(i).unwrap();

            match tx.tx_type {
                TransactionType::Expense => {
                    total += tx.amount;
                }
                _ => {}
            }
        }

        total
    }

    // Saldo
    pub fn get_balance(env: Env) -> i128 {

        let income = Self::total_income(env.clone());

        let expense = Self::total_expense(env);

        income - expense
    }
}

mod test;