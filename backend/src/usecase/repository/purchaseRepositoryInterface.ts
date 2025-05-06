import Purchase from "../../models/purchase";
import { Context } from "../../types/context";
import { PromiseResult } from "../../types/result";

export interface PurchaseRepositoryInterface {
  getPurchaseByUserId(
    ctx: Context,
    userId: number,
  ): PromiseResult<Error, Purchase[]>;
}
