import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interfaces';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ){

    constructor(
        private readonly configService:ConfigService,
        private readonly authService:AuthService,
    ){
        super({
            secretOrKey:configService.get('JWT_SECRET'),
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate( { id }:JwtPayload ):Promise<User>{

        const user = await this.authService.validateUser( id );

        if (!user) throw new UnauthorizedException('Token not valid :/')
        
        return user; // = req.user;
    }


}