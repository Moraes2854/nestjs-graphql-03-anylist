import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorators';

import { List } from './entities/list.entity';
import { ListItem } from '../list-item/entities/list-item.entity';
import { User } from '../users/entities/user.entity';

import { ListsService } from './lists.service';
import { ListItemService } from '../list-item/list-item.service';

import { CreateListInput, UpdateListInput } from './dto/inputs';
import { PaginationArgs, SearchArgs } from '../common/dto/args';


@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListsResolver {
  constructor(
    private readonly listsService: ListsService,
    private readonly listItemService:ListItemService
  ) {}

  @Mutation(() => List)
  createList(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUser() user:User
  ):Promise<List> {
    return this.listsService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'lists' })
  findAll(
    @Args() paginationArgs:PaginationArgs,
    @Args() searchArgs:SearchArgs,
    @CurrentUser() user:User,
  ):Promise<List[]> {
    return this.listsService.findAll(user, paginationArgs, searchArgs);
  }

  @Query(() => List, { name: 'list' })
  findOne(
    @Args('id', { type: () => Int }, ParseUUIDPipe) id: string,
    @CurrentUser() user:User
  ):Promise<List> {
    return this.listsService.findOne(id, user);
  }

  @Mutation(() => List)
  updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUser() user:User
  ):Promise<List> {
    return this.listsService.update(updateListInput, user);
  }

  @Mutation(() => List)
  removeList(
    @Args('id', { type: () => Int }, ParseUUIDPipe) id: string,
    @CurrentUser() user:User
    ):Promise<boolean> {
    return this.listsService.remove(id, user);
  }

  @ResolveField( () => [ListItem], { name: 'items'})
  async getListItems(
    @Parent() list:List,
    @Args() paginationArgs:PaginationArgs,
    @Args() searchArgs:SearchArgs,
  ):Promise<ListItem[]>{
    return this.listItemService.findAll(list, paginationArgs, searchArgs);
  }

  @ResolveField( () => Int, { name: 'countListItems'})
  async countListItemsByList(
    @Parent() list:List,
  ):Promise<number>{
    return this.listItemService.countListItemsByList(list);
  }

}
