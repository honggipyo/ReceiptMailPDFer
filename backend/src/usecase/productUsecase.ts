import Product from "../models/product";
import { Context } from "../types/context";
import { PromiseResult } from "../types/result";
import { ProductRepositoryInterface } from "./repository/productRepositoryInterface";
import { ProductUsecaseInterface } from "./inputport/productUsecaseInterface";
import { ProductRepository } from "../gateways/repository/productRepository";

/**
 * 商品関連のビジネスロジックを実装するクラス
 * リポジトリを使用してデータアクセスを抽象化し、商品情報の取得を行う
 */
export class ProductUsecase implements ProductUsecaseInterface {
  private productRepository: ProductRepositoryInterface;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  /**
   * 全商品リストを取得するメソッド
   */
  public async getAllProducts(ctx: Context): PromiseResult<Error, Product[]> {
    try {
      // リポジトリを通じて全商品データを取得
      const result = await this.productRepository.getAllProducts(ctx);

      // リポジトリからのエラーを処理
      if (!result.success) {
        return {
          success: false,
          error: result.error,
        };
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      // 予期しないエラーの処理
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new Error("Error in ProductUsecase getAllProducts"),
      };
    }
  }
}
