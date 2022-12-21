import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { CurrentUser } from 'src/auth/decorators/current-user.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { ListItem } from './entities/list-item.entity';
import { User } from '../users/entities/user.entity';

import { ListItemService } from './list-item.service';

import { CreateListItemInput, UpdateListItemInput } from './dto/inputs/';


@UseGuards(JwtAuthGuard)
@Resolver(() => ListItem)
export class ListItemResolver {
  constructor(private readonly listItemService: ListItemService) {}

  @Mutation(() => ListItem)
  createListItem(
    @Args('createListItemInput') createListItemInput: CreateListItemInput
    //! Todo pedir usuario para validar  
  ):Promise<ListItem>{
  
    return this.listItemService.create(createListItemInput);
  }

  // @Query(() => [ListItem], { name: 'listItem' })
  // findAll(

  // ):Promise<ListItem[]>{
  //   return this.listItemService.findAll();
  // }

  @Query(() => ListItem, { name: 'listItem' })
  async findOne(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
    @CurrentUser() user:User,
  ):Promise<ListItem> {
    return this.listItemService.findOne(id);
  }

  @Mutation(() => ListItem)
  updateListItem(
    @Args('updateListItemInput') updateListItemInput: UpdateListItemInput
  ):Promise<ListItem> {
    return this.listItemService.update(updateListItemInput);
  }

  // @Mutation(() => ListItem)
  // removeListItem(@Args('id', { type: () => Int }) id: number) {
  //   return this.listItemService.remove(id);
  // }
}
