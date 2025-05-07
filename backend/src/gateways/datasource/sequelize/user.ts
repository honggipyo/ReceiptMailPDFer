import { EmailEntity } from "../../../entity/mailEntity";
import User from "../../../models/user";
import { Context } from "../../../types/context";
import { PromiseResult } from "../../../types/result";
import { dsUserInterface } from "../../repository/datasource/dsUser";

export class UserDatasource implements dsUserInterface {
  public async findByEmail(
    ctx: Context,
    email: EmailEntity,
  ): PromiseResult<Error, User | null> {
    try {
      const user = await User.findOne({
        where: {
          email,
        },
        raw: true,
        transaction: ctx.tx || undefined,
      });

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new Error("Error in UserDatasource findByEmail"),
      };
    }
  }
}
