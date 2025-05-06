import { Model, DataTypes } from "sequelize";
import { sequelize } from ".";
import User from "./user";
import Product from "./product";

class Purchase extends Model {
  public id!: number;
  public userId!: number;
  public productId!: number;
  public quantity!: number;
  public totalPrice!: number;
  public purchasedAt!: Date;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Purchase.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    purchasedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Purchase",
    tableName: "Purchases",
    timestamps: true,
  },
);

User.hasMany(Purchase, { foreignKey: "userId" });
Purchase.belongsTo(User, { foreignKey: "userId" });

Product.hasMany(Purchase, { foreignKey: "productId" });
Purchase.belongsTo(Product, { foreignKey: "productId" });

export default Purchase;
