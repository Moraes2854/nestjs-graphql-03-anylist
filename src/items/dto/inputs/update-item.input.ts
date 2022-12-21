import { CreateItemInput } from './create-item.input';
import { InputType, Field, Int, PartialType, Float, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;

}
