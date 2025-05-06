import { EmailEntity } from "../../entity/mailEntity";
import User from "../../models/user";
import { Context } from "../../types/context";
import { PromiseResult } from "../../types/result";

export interface UserRepositoryInterface {
  getUserByEmail(
    ctx: Context,
    email: EmailEntity,
  ): PromiseResult<Error, User | null>;
}
