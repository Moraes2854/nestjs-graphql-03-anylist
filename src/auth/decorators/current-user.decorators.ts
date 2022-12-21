import { createParamDecorator, ExecutionContext, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ValidRoles } from '../../users/enum/valid-roles.enum';


export const CurrentUser = createParamDecorator(
    ( roles:ValidRoles[]=[], context:ExecutionContext )=>{
        const ctx = GqlExecutionContext.create(context);

        const user = ctx.getContext().req.user;

        if (!user) throw new InternalServerErrorException(`No user inside request - make sure that we use AuthGuard`);

        if (roles.length === 0) return user;

        for (const role of user.roles) {
            if (roles.includes( role )) return user;
        }

        throw new ForbiddenException(`User ${ user.fullName} need a valid role, [${roles.join(',')}]`);
    }
)