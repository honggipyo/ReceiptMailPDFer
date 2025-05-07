/**
 * 商品データの型定義
 * バックエンドAPIから取得される商品情報の構造
 */
export interface Product {
  id: number; // 商品ID
  name: string; // 商品名
  price: number; // 価格
  description: string; // 商品説明
}
