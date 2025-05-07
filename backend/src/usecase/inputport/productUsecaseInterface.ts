import Product from "../../models/product";
import { Context } from "../../types/context";
import { PromiseResult } from "../../types/result";

export interface ProductUsecaseInterface {
  getAllProducts(ctx: Context): PromiseResult<Error, Product[]>;
}
