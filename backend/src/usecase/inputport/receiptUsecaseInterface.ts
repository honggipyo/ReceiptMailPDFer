import { EmailEntity } from "../../entity/mailEntity";
import User from "../../models/user";
import { Context } from "../../types/context";
import { PromiseResult } from "../../types/result";

export interface ReceiptUsecaseInterface {
  getReceiptDetails(ctx: Context, email: string): PromiseResult<Error, string>;
}
