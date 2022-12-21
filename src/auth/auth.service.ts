import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { LoginInput, SignupInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService:UsersService,
        private readonly jwtService:JwtService,
    ){}

    private getJwtToken(userId:string){
        return this.jwtService.sign({
            id:userId,
        });
    }

    async signup( singupInput:SignupInput):Promise<AuthResponse>{

        const user = await this.userService.create(singupInput);

    
        const token = this.getJwtToken(user.id);



        return {
            token,
            user
        };
        
    }

    async login({ email, password }:LoginInput ):Promise<AuthResponse>{
        
        const user = await this.userService.findOneByEmail(email);

        if (!bcrypt.compareSync(password, user.password)) throw new BadRequestException('Password invalid');
        
        const token = this.getJwtToken(user.id);

        console.log(user);

        return {
            token,
            user
        };


    }

    async validateUser(id:string):Promise<User>{

        const user = await this.userService.findOneById( id );

        if ( !user.isActive ) throw new UnauthorizedException(`User is inactive, talk with an admin`);

        delete user.password;

        return user;
    }

    revalidateToken(user:User):AuthResponse{
        return {
            token:this.getJwtToken(user.id),
            user,
        }
    }
}
