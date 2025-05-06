import { EmailEntity } from "../entity/mailEntity";
import { ProductRepository } from "../gateways/repository/productRepository";
import { PurchaseRepository } from "../gateways/repository/purchaseRepository";
import { UserRepository } from "../gateways/repository/userRepository";
import Product from "../models/product";
import Purchase from "../models/purchase";
import User from "../models/user";
import { Context } from "../types/context";
import { handleGetDataResult, PromiseResult } from "../types/result";
import { ReceiptUsecaseInterface } from "./inputport/receiptUsecaseInterface";
import { ProductRepositoryInterface } from "./repository/productRepositoryInterface";
import { PurchaseRepositoryInterface } from "./repository/purchaseRepositoryInterface";
import { UserRepositoryInterface } from "./repository/userRepositoryInterface";
import { notFound } from "@hapi/boom";

/**
 * 購入と商品情報を組み合わせたインターフェース
 * 領収書を生成する際に、購入情報と商品情報を一緒に扱うために使用
 */
interface PurchaseWithProduct {
  purchase: Purchase;
  product: Product;
}

export class ReceiptUsecase implements ReceiptUsecaseInterface {
  private userRepository: UserRepositoryInterface;
  private purchaseRepository: PurchaseRepositoryInterface;
  private productRepository: ProductRepositoryInterface;

  constructor() {
    this.userRepository = new UserRepository();
    this.purchaseRepository = new PurchaseRepository();
    this.productRepository = new ProductRepository();
  }

  /**
   * 領収書の詳細情報を取得する関数
   * 以下の処理を行います：
   * 1. ユーザー情報の取得
   * 2. 購入情報の取得
   * 3. 商品情報の取得
   * 4. 領収書HTMLの生成
   *
   * クリーンアーキテクチャの原則に従って、データの流れは一方向に保たれます。
   * 各ステップで失敗した場合は、適切なエラーメッセージと共に処理を中断します。
   */
  public async getReceiptDetails(
    ctx: Context,
    email: EmailEntity,
  ): PromiseResult<Error, string> {
    // ユーザー情報を取得
    // handleGetDataResultは、データ取得の成否をチェックし、成否に応じてエラーハンドリングを行う関数
    const userResult = await handleGetDataResult(
      this.userRepository.getUserByEmail(ctx, email),
      "User not Found",
    );
    if (!userResult.success) {
      console.log("userResult", userResult);
      return userResult;
    }

    // ユーザーの購入情報を取得
    const purchaseResult = await handleGetDataResult(
      this.purchaseRepository.getPurchaseByUserId(ctx, userResult.data.id),
      "Purchase not Found",
    );
    if (!purchaseResult.success) {
      console.log("purchaseResult", purchaseResult);
      return purchaseResult;
    }
  }

  /**
   * 領収書のHTMLを生成する関数
   * 以下の処理を行います：
   * 1. 合計金額の計算
   * 2. 購入商品一覧のHTML生成
   * 3. 領収書全体のHTML生成
   *
   * 各購入商品の詳細情報と合計金額を含む、整形されたHTML文書を作成します。
   * 金額は日本円の形式（3桁区切り）で表示されます。
   */
  private async getReceiptHtml(
    user: User,
    purchasesWithProducts: PurchaseWithProduct[],
  ): Promise<string> {
    // 合計金額を計算
    const totalAmount = purchasesWithProducts.reduce(
      (sum, { purchase, product }) => sum + product.price * purchase.quantity,
      0,
    );

    // 購入商品一覧のHTMLを生成
    const purchaseItems = purchasesWithProducts
      .map(
        ({ purchase, product }) => `
      <div class="purchase-item">
        <p>商品名: ${product.name}</p>
        <p>数量: ${purchase.quantity}</p>
        <p>単価: ${product.price.toLocaleString()}円</p>
        <p>小計: ${(product.price * purchase.quantity).toLocaleString()}円</p>
      </div>
    `,
      )
      .join("");

    // 領収書全体のHTMLを生成
    const html = `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .receipt {
          border: 1px solid #ddd;
          padding: 20px;
          border-radius: 8px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .info {
          margin-bottom: 15px;
        }
        .purchase-item {
          border-bottom: 1px solid #eee;
          padding: 10px 0;
        }
        .total {
          font-weight: bold;
          margin-top: 20px;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <h1>購入領収書</h1>
          <p>${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="info">
          <h3>購入者情報</h3>
          <p>名前: ${user.name}</p>
          <p>メールアドレス: ${user.email}</p>
        </div>

        <div class="info">
          <h3>購入履歴</h3>
          ${purchaseItems}
        </div>

        <div class="total">
          <p>総 支払額: ${totalAmount.toLocaleString()}円</p>
        </div>
      </div>
    </body>
    </html>
    `;

    return html;
  }
}
