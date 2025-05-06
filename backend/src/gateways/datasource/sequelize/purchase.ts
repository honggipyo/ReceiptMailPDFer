import Purchase from "../../../models/purchase";
import { Context } from "../../../types/context";
import { PromiseResult } from "../../../types/result";
import { dsPurchaseInterface } from "../../repository/datasource/dsPurchase";

export class PurchaseDatasource implements dsPurchaseInterface {
  public async findByUserId(
    ctx: Context,
    userId: number,
  ): PromiseResult<Error, Purchase[]> {
    const purchase = await Purchase.findAll({
      where: {
        userId,
      },
      raw: true,
      transaction: ctx.tx || undefined,
    });

    return {
      success: true,
      data: purchase,
    };
  }
}
