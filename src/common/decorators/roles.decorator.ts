import { SetMetadata } from '@nestjs/common';

/**
 * Roles Decorator
 * Used to specify which roles can access a particular endpoint
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
