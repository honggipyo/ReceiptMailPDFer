import { Transaction } from "sequelize";

export type Context = {
  tx: Transaction;
};
