import { UserDocument } from '../user/user.schema';

export type TokenType = 'ACCESS' | 'REFRESH';

export interface UserJwtPayload {
  sub: string;
  username: string;
}

export interface AuthResult {
  user: UserDocument;
  accessToken: string;
  refreshToken: string;
}
