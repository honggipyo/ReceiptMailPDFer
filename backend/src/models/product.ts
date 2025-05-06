import { Model, DataTypes } from "sequelize";
import { sequelize } from ".";

class Product extends Model {
  public id!: number;
  public name!: string;
  public price!: number;
  public description?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "Products",
    timestamps: true,
  },
);

export default Product;
