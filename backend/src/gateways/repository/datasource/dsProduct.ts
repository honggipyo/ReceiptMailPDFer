import Product from "../../../models/product";
import { Context } from "../../../types/context";
import { PromiseResult } from "../../../types/result";

export interface dsProductInterface {
  findById(
    ctx: Context,
    productId: number,
  ): PromiseResult<Error, Product | null>;

  findAll(ctx: Context): PromiseResult<Error, Product[]>;
}
