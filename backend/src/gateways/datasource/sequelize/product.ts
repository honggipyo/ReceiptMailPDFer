import Product from "../../../models/product";
import { Context } from "../../../types/context";
import { PromiseResult } from "../../../types/result";
import { dsProductInterface } from "../../repository/datasource/dsProduct";

export class ProductDatasource implements dsProductInterface {
  public async findById(
    ctx: Context,
    productId: number,
  ): PromiseResult<Error, Product | null> {
    const product = await Product.findByPk(productId, {
      raw: true,
      transaction: ctx.tx || undefined,
    });

    return {
      success: true,
      data: product,
    };
  }
}
