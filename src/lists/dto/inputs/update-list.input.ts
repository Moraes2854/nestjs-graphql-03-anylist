import { CreateListInput } from './create-list.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateListInput extends PartialType(CreateListInput) {

  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;

}
