import { SetMetadata } from '@nestjs/common';
export const ALLOW_LOCALHOST_ONLY_KEY = 'allowLocalhostOnly';
export const AllowLocalhostOnly = () =>
  SetMetadata(ALLOW_LOCALHOST_ONLY_KEY, true);
