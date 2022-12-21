import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';

import { PaginationArgs, SearchArgs } from '../common/dto/args';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto/';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorators';
import { User } from '../users/entities/user.entity';

@Resolver(() => Item)
@UseGuards(JwtAuthGuard)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item, { name: 'createItem'})
  async createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @CurrentUser() user:User
  ):Promise<Item> {
    return this.itemsService.create(createItemInput, user);
  }

  @Query(() => [Item], { name: 'findAllItems' })
  async findAll(
    @Args() paginationArgs:PaginationArgs,
    @Args() searchArgs:SearchArgs,
    @CurrentUser() user:User,
  ):Promise<Item[]> {
    return this.itemsService.findAll(user, paginationArgs, searchArgs);
  }

  @Query(() => Item, { name: 'findOneItem' })
  async findOne(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user:User

  ):Promise<Item> {
    return this.itemsService.findOne(id, user);
  }

  @Mutation(() => Item, { name:'updateItem' })
  async updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @CurrentUser() user:User
  ):Promise<Item> {
    return this.itemsService.update(updateItemInput, user);
  }

  @Mutation(() => Boolean, { name:'removeItem' })
  async removeItem(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user:User

    ):Promise<boolean> {
    return this.itemsService.remove(id, user);
  }
}
