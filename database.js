// database.js

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('BusinessNavigatorDB.db');

const createTables = () => {
  db.transaction((tx) => {
    // Create Stock table
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS Stock (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        quantity INTEGER,
        buyingPrice REAL,
        sellingPrice REAL,
        expiryDate TEXT,
        expectedProfit REAL,
        datePurchased TEXT
      );
    `);

    // Create Sales table
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS Sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        quantitySold INTEGER,
        amount REAL,
        saleDate TEXT,
        saleType TEXT,
        profitLoss REAL,
        FOREIGN KEY (product_id) REFERENCES Stock(id)
      );
    `);

    // Create Loans table
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS Loans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        loanAmount REAL,
        loanDate TEXT,
        FOREIGN KEY (product_id) REFERENCES Stock(id)
      );
    `);
  });
};

const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        // Drop tables for demonstration purposes (remove this in production)
        tx.executeSql('DROP TABLE IF EXISTS Stock;');
        tx.executeSql('DROP TABLE IF EXISTS Sales;');
        tx.executeSql('DROP TABLE IF EXISTS Loans;');

        // Create tables
        createTables();
      },
      (error) => reject(error),
      () => resolve()
    );
  });
};

export { db, initDatabase };
