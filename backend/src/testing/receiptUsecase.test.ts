import { ReceiptUsecase } from "../usecase/receiptUsecase";
import { Context } from "../types/context";
import { UserRepository } from "../gateways/repository/userRepository";
import { PurchaseRepository } from "../gateways/repository/purchaseRepository";
import { ProductRepository } from "../gateways/repository/productRepository";
import User from "../models/user";
import Purchase from "../models/purchase";
import Product from "../models/product";

// モックの設定
jest.mock("../gateways/repository/userRepository");
jest.mock("../gateways/repository/purchaseRepository");
jest.mock("../gateways/repository/productRepository");

describe("ReceiptUsecase Tests", () => {
  let receiptUsecase: ReceiptUsecase;
  let mockContext: Context;
  let mockUser: User;
  let mockPurchase: Purchase;
  let mockProduct: Product;

  beforeEach(() => {
    // テスト用のデータを作成
    mockContext = {
      tx: {
        commit: jest.fn(),
        rollback: jest.fn(),
      } as any,
    };

    mockUser = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    mockPurchase = {
      id: 1,
      userId: 1,
      productId: 1,
      quantity: 2,
      totalPrice: 2000,
      purchasedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Purchase;

    mockProduct = {
      id: 1,
      name: "Test Product",
      price: 1000,
      description: "Test Description",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Product;

    receiptUsecase = new ReceiptUsecase();

    // モックのリセット
    jest.clearAllMocks();
  });

  describe("getReceiptDetails", () => {
    it("正常系: 領収書の詳細情報を取得できること", async () => {
      // リポジトリのモック
      const mockUserRepository = UserRepository as jest.MockedClass<
        typeof UserRepository
      >;
      const mockPurchaseRepository = PurchaseRepository as jest.MockedClass<
        typeof PurchaseRepository
      >;
      const mockProductRepository = ProductRepository as jest.MockedClass<
        typeof ProductRepository
      >;

      mockUserRepository.prototype.getUserByEmail.mockResolvedValue({
        success: true,
        data: mockUser,
      });

      mockPurchaseRepository.prototype.getPurchaseByUserId.mockResolvedValue({
        success: true,
        data: [mockPurchase],
      });

      mockProductRepository.prototype.getProductById.mockResolvedValue({
        success: true,
        data: mockProduct,
      });

      const result = await receiptUsecase.getReceiptDetails(
        mockContext,
        "test@example.com",
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toContain("Test User");
        expect(result.data).toContain("Test Product");
        expect(result.data).toContain("2,000円");
      }
    });

    it("異常系: ユーザーが見つからない場合", async () => {
      const mockUserRepository = UserRepository as jest.MockedClass<
        typeof UserRepository
      >;
      mockUserRepository.prototype.getUserByEmail.mockResolvedValue({
        success: false,
        error: new Error("User not found"),
      });

      const result = await receiptUsecase.getReceiptDetails(
        mockContext,
        "test@example.com",
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    it("異常系: 購入情報が見つからない場合", async () => {
      const mockUserRepository = UserRepository as jest.MockedClass<
        typeof UserRepository
      >;
      const mockPurchaseRepository = PurchaseRepository as jest.MockedClass<
        typeof PurchaseRepository
      >;

      mockUserRepository.prototype.getUserByEmail.mockResolvedValue({
        success: true,
        data: mockUser,
      });

      mockPurchaseRepository.prototype.getPurchaseByUserId.mockResolvedValue({
        success: false,
        error: new Error("Purchase not found"),
      });

      const result = await receiptUsecase.getReceiptDetails(
        mockContext,
        "test@example.com",
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    it("異常系: 商品情報が見つからない場合", async () => {
      const mockUserRepository = UserRepository as jest.MockedClass<
        typeof UserRepository
      >;
      const mockPurchaseRepository = PurchaseRepository as jest.MockedClass<
        typeof PurchaseRepository
      >;
      const mockProductRepository = ProductRepository as jest.MockedClass<
        typeof ProductRepository
      >;

      mockUserRepository.prototype.getUserByEmail.mockResolvedValue({
        success: true,
        data: mockUser,
      });

      mockPurchaseRepository.prototype.getPurchaseByUserId.mockResolvedValue({
        success: true,
        data: [mockPurchase],
      });

      mockProductRepository.prototype.getProductById.mockResolvedValue({
        success: false,
        error: new Error("Product not found"),
      });

      const result = await receiptUsecase.getReceiptDetails(
        mockContext,
        "test@example.com",
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });
  });
});
