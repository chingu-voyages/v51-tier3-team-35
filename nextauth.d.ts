import { DefaultUser } from "next-auth";
import { User as AppUser } from "/app/lib/models/user.model";

declare module "next-auth" {
  interface User extends Partial<AppUser> {
    _id?: string;
  }

  interface Session {
    user?: DefaultUser & Partial<User> & { _id: string };
  }
}
