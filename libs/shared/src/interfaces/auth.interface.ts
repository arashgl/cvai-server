// Define the interface for the context object
// export interface IJwtContext {
//   wallet_address: string;
// }

import { RoleEnum } from '../database';

// Define the interface for the JWT response

export interface IJwtPayload {
  context: {
    username: string;
    role: RoleEnum;
    id: number;
  };
  iat?: number;
  exp?: number;
  sub: number;
}
