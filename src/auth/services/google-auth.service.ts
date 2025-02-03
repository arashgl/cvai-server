import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;

  constructor(private configService: ConfigService) {
    this.client = new OAuth2Client(
      this.configService.getOrThrow('GOOGLE_CLIENT_ID'),
    );
  }

  async verifyWithAudience(token: string, audience: string) {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      throw new UnauthorizedException('Invalid Google token');
    }

    return {
      id: payload['sub'],
      email: payload['email'],
      name: payload['name'],
      picture: payload['picture'],
    };
  }

  async verifyToken(token: string) {
    try {
      return await this.verifyWithAudience(
        token,
        this.configService.get('GOOGLE_CLIENT_ID'),
      );
    } catch (e) {
      try {
        return await this.verifyWithAudience(
          token,
          this.configService.get('GOOGLE_CLIENT_ID_APPLE'),
        );
      } catch (e) {
        throw new UnauthorizedException();
      }
    }
  }

  async verifyFirebaseToken(token: string) {
    console.log(token);
    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      console.log(decodedToken, '<<');
      return {
        id: decodedToken['sub'],
        email: decodedToken['email'],
        name: decodedToken['name'],
        picture: decodedToken['picture'],
      };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }
}
