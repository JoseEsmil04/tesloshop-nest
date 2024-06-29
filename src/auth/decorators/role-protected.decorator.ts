import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../strategies/interfaces/valid-roles.interface';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: ValidRoles[]) => {

  // se encarga de retornar la metadata
  return SetMetadata(META_ROLES, args);
}