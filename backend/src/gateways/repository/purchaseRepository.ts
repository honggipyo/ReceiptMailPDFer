import Purchase from "../../models/purchase";
import { Context } from "../../types/context";
import { PromiseResult } from "../../types/result";
import { PurchaseRepositoryInterface } from "../../usecase/repository/purchaseRepositoryInterface";
import { PurchaseDatasource } from "../datasource/sequelize/purchase";
import { dsPurchaseInterface } from "./datasource/dsPurchase";

export class PurchaseRepository implements PurchaseRepositoryInterface {
  private purchaseDatasource: dsPurchaseInterface;

  constructor() {
    this.purchaseDatasource = new PurchaseDatasource();
  }

  public async getPurchaseByUserId(
    ctx: Context,
    userId: number,
  ): PromiseResult<Error, Purchase[]> {
    const purchase = await this.purchaseDatasource.findByUserId(ctx, userId);
    return purchase;
  }
}
