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
  }
