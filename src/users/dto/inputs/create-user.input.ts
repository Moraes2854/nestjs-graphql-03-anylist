import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsEmail, IsNotEmpty, IsString, MinLength, IsArray } from 'class-validator';

import { ValidRoles } from '../../enum/valid-roles.enum';

@InputType()
export class CreateUserInput {

  @Field( () => String )
  @IsEmail()
  email:string;

  @Field( () => String )
  @IsNotEmpty()
  @IsString()
  fullName:string;

  @Field( () => String )
  @IsString()
  @MinLength(6)
  password:string;


}
