import { CanActivate, ConflictException, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from 'src/auth/entities/auth.entity';

// Guard para verificar los Roles.
@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector // reflector para obtener la metadata
  ){}
  canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
    
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler()); // aqui se obtiene la metadata

    if(!validRoles) return true; // Validaciones
    if(validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest(); // se Obtiene la request
    const user = req.user as User; // se saca el user que viene en la request

    if(!user) {
      throw new NotFoundException('User not found!');
    }

    for (const role of user.roles) {
      if(validRoles.includes(role)) {
        return true;
      }
    }

    throw new ForbiddenException(
      `User: ${ user.fullName } need a valid role ${ validRoles }`
    )
  }
}
