import type { Pool } from "pg";
import type { IUsersRepository } from "./i-user-repository.js";
import type { User, UserWithPassword } from "../schemas/user.js";
import { UserNotFoundError } from "../errors/user-not-found.js";

export class UserRepository implements IUsersRepository {
    protected pg: Pool;

    constructor(pg: Pool) {
        this.pg = pg;
    }

    async get(id: string): Promise<User> {
        const res = await this.pg.query(
            `
            SELECT user_id, username, email, first_name, last_name
            FROM users
            WHERE user_id = $1
            `,
            [id],
        );
        
        if(res.rowCount === 0)
            throw new UserNotFoundError(id);

        return res.rows[0] as User;
    }

    async create(user: UserWithPassword): Promise<User> {
        console.log("lag", user);
        const res = await this.pg.query(
            `
            INSERT INTO users (username, email, password, first_name, last_name) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING user_id, username, email, first_name, last_name
            `,
            [
                user["username"],
                user["email"],
                user["password"],
                user["first_name"],
                user["last_name"],
            ],
        );

        return res.rows[0] as User;
    }
    async update(user: User): Promise<User> {
        const res = await this.pg.query(
            `
            UPDATE users
            SET username = $1, email = $2, first_name = $3, last_name = $4
            WHERE user_id = $5
            RETURNING user_id, username, email, first_name, last_name
            `,
            [
                user.username,
                user.email,
                user.first_name,
                user.last_name,
                user.user_id,
            ],
        );

        if (res.rowCount === 0)
            throw new UserNotFoundError(user.user_id);

        return res.rows[0] as User;
    }

    async delete(id: string): Promise<User> {
        const res = await this.pg.query(
            `
            DELETE FROM users
            WHERE user_id = $1
            RETURNING user_id, username, email, first_name, last_name
            `,
            [id],
        );

        if (res.rowCount === 0)
            throw new UserNotFoundError(id);

        return res.rows[0] as User;
    }
}
