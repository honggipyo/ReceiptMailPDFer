import Product from "../../models/product";
import { Context } from "../../types/context";
import { PromiseResult } from "../../types/result";
import { ProductRepositoryInterface } from "../../usecase/repository/productRepositoryInterface";
import { ProductDatasource } from "../datasource/sequelize/product";
import { dsProductInterface } from "./datasource/dsProduct";

export class ProductRepository implements ProductRepositoryInterface {
  private productDatasource: dsProductInterface;

  constructor() {
    this.productDatasource = new ProductDatasource();
  }

  public async getProductById(
    ctx: Context,
    productId: number,
  ): PromiseResult<Error, Product | null> {
    const product = await this.productDatasource.findById(ctx, productId);
    return product;
  }
}
