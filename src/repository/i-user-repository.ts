import type { User, UserWithPassword } from "../schemas/user.js";

export interface IUsersRepository {
    get(id: string): Promise<User>;
    create(user: UserWithPassword): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: string): Promise<User>;
}