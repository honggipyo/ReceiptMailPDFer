import Purchase from "../../../models/purchase";
import { Context } from "../../../types/context";
import { PromiseResult } from "../../../types/result";
import { dsPurchaseInterface } from "../../repository/datasource/dsPurchase";

export class PurchaseDatasource implements dsPurchaseInterface {
  public async findByUserId(
    ctx: Context,
    userId: number,
  ): PromiseResult<Error, Purchase[]> {
    try {
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
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new Error("Error in PurchaseDatasource findByUserId"),
      };
    }
  }
}
