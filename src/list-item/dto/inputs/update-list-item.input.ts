import { CreateListItemInput } from './create-list-item.input';
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateListItemInput extends PartialType(CreateListItemInput) {
  @Field(() => ID)
  @IsUUID()
  @IsString()
  id: string;
}
