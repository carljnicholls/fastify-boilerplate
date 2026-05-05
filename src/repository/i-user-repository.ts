import type { UserWithPassword } from "../schemas/public/user-with-password.js";
import type { User } from "../schemas/public/user.js";

export interface IUsersRepository {
    get(id: string): Promise<User>;
    create(user: UserWithPassword): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: string): Promise<User>;
}