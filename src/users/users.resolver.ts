import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorators';


import { ItemsService } from '../items/items.service';
import { UsersService } from './users.service';
import { ListsService } from '../lists/lists.service';

import { Item } from '../items/entities/item.entity';
import { User } from './entities/user.entity';
import { List } from '../lists/entities/list.entity';

import { ValidRoles } from './enum/valid-roles.enum';

import { PaginationArgs, SearchArgs } from '../common/dto/args';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { UpdateUserInput } from './dto/inputs';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService
  ) {}


  @Query(() => [User], { name: 'users' })
  async findAll(
    @Args() validRoles:ValidRolesArgs,
    @Args() paginationArgs:PaginationArgs,
    @Args() searchArgs:SearchArgs,
    @CurrentUser([ValidRoles.admin]) user:User
  ):Promise<User[]> {
    return this.usersService.findAll(validRoles, paginationArgs, searchArgs);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user:User
  ):Promise<User> {
    return this.usersService.findOne(id);
  }

  @Mutation( () => User, { name:'updateUser' } )
  update(
    @Args('updateUserInput') updateUserInput:UpdateUserInput,
    @CurrentUser([ValidRoles.admin]) user:User
  ):Promise<User>{
    return this.usersService.update(updateUserInput, user);
  }

  @Mutation(() => User, { name:'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user:User
  ):Promise<User> {
    return this.usersService.block(id, user);
  }

  @ResolveField( () => Int, { name:'itemCount' } )
  async itemCount(
    @Parent() user:User
  ):Promise<number>{
    return this.itemsService.itemCount(user);
  }

  @ResolveField( () => [Item], { name:'items' } )
  async getItemsByUser(
    @Parent() user:User,
    @Args() paginationArgs:PaginationArgs,
    @Args() searchArgs:SearchArgs,
  ):Promise<Item[]>{
    return this.itemsService.findAll(user, paginationArgs, searchArgs);
  }

  @ResolveField( () => Int, { name:'listCount' } )
  async listCount(
    @Parent() user:User
  ):Promise<number>{
    return this.listsService.listCount(user);
  }

  @ResolveField( () => [List], { name:'lists' } )
  async getListByUser(
    @Parent() user:User,
    @Args() paginationArgs:PaginationArgs,
    @Args() searchArgs:SearchArgs,
  ):Promise<List[]>{
    return this.listsService.findAll(user, paginationArgs, searchArgs);
  }
}
