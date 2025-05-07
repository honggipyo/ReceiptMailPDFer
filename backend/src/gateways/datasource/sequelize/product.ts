import Product from "../../../models/product";
import { Context } from "../../../types/context";
import { PromiseResult } from "../../../types/result";
import { dsProductInterface } from "../../repository/datasource/dsProduct";

export class ProductDatasource implements dsProductInterface {
  public async findById(
    ctx: Context,
    productId: number,
  ): PromiseResult<Error, Product | null> {
    try {
      const product = await Product.findByPk(productId, {
        raw: true,
        transaction: ctx.tx || undefined,
      });

      return {
        success: true,
        data: product,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new Error("Error in ProductDatasource findById"),
      };
    }
  }

  public async findAll(ctx: Context): PromiseResult<Error, Product[]> {
    try {
      const products = await Product.findAll({
        raw: true,
        order: [["id", "ASC"]],
        transaction: ctx.tx || undefined,
      });

      return {
        success: true,
        data: products,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new Error("Error in ProductDatasource findAll"),
      };
    }
  }
}
