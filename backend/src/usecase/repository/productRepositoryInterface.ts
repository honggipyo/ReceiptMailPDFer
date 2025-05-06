import Product from "../../models/product";
import { Context } from "../../types/context";
import { PromiseResult } from "../../types/result";

export interface ProductRepositoryInterface {
  getProductById(
    ctx: Context,
    productId: number,
  ): PromiseResult<Error, Product | null>;
}
