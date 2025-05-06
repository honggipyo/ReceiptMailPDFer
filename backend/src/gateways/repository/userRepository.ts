import { EmailEntity } from "../../entity/mailEntity";
import User from "../../models/user";
import { Context } from "../../types/context";
import { PromiseResult } from "../../types/result";
import { UserRepositoryInterface } from "../../usecase/repository/userRepositoryInterface";
import { UserDatasource } from "../datasource/sequelize/user";
import { dsUserInterface } from "./datasource/dsUser";

export class UserRepository implements UserRepositoryInterface {
  private userDatasource: dsUserInterface;

  constructor() {
    this.userDatasource = new UserDatasource();
  }

  public async getUserByEmail(
    ctx: Context,
    email: EmailEntity,
  ): PromiseResult<Error, User | null> {
    const user = await this.userDatasource.findByEmail(ctx, email);
    return user;
  }
}
