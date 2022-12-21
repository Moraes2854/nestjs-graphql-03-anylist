import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsBoolean, IsString, IsUUID, IsArray, IsOptional } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { ValidRoles } from '../../enum/valid-roles.enum';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  
  @Field(() => ID)
  @IsString()
  @IsUUID()
  id: string;

  @Field( () => [ ValidRoles ], { nullable:true })
  @IsArray()
  @IsOptional()
  roles?:ValidRoles[];


  @Field( () => Boolean, { nullable:true })
  @IsBoolean()
  @IsOptional()
  isActive?:boolean;

}
