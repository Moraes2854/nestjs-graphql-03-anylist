import { registerEnumType } from "@nestjs/graphql";

export enum ValidRoles {
    admin     = 'ADMIN', 
    user      = 'USER',  
    superUser = 'SUPER-USER'
}

registerEnumType( ValidRoles, { name: 'ValidRoles'} );