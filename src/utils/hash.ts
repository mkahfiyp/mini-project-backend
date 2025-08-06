import { genSalt, hash } from "bcrypt";

class HashUtil {
    public async hashPassword(password: string) {
        const salt = await genSalt(10);
        return await hash(password, salt);
    }
}

export default new HashUtil();