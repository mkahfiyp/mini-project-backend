import { sign } from "jsonwebtoken";

class TokenUtil {
    public createToken(user: any, expiresIn: any) {
        return sign(
            { user_id: user.user_id, role: user.role },
            process.env.TOKEN_KEY || "secret",
            { expiresIn }
        );
    }
}

export default new TokenUtil();