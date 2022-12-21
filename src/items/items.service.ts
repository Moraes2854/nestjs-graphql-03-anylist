import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { PaginationArgs, SearchArgs } from '../common/dto/args';
import { CreateItemInput, UpdateItemInput } from './dto/';
import { Item } from './entities/item.entity';
import { User } from '../users/entities/user.entity';


@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>
  ){}

  async create(createItemInput: CreateItemInput, user:User):Promise<Item> {
    
    const newItem = this.itemRepository.create({...createItemInput, user});
    return await this.itemRepository.save(newItem);

  }

  async findAll(user:User, {limit, offset}:PaginationArgs, {search}:SearchArgs):Promise<Item[]> {
    
    const queryBuilder = this.itemRepository.createQueryBuilder()
    .take(limit)
    .skip(offset)
    .where(`"userId" = :userId`, {userId: user.id})
    
    if (search){
      queryBuilder.andWhere('LOWER(name) LIKE :name', { name: `%${ search.toLowerCase() }%` });
    }

    return await queryBuilder.getMany();
    
    // return await this.itemRepository.find({
    //   where:{
    //     user:{id:user.id},
    //     name:Like(`%${searchArgs.search}%`)
    //   }, 
    //   relations:{user:true},
    //   take:paginationArgs.limit,
    //   skip:paginationArgs.offset
    // });
  }

  async findOne(id: string, user:User):Promise<Item> {
    const item = await this.itemRepository.findOne({
      where:{ id, user:{id:user.id} },
      relations:{user:true}
    });

    if (!item) throw new NotFoundException(`Item with id: ${id} was not found`);

    return item;
  }

  async update(updateItemInput: UpdateItemInput, user:User):Promise<Item> {
    await this.findOne(updateItemInput.id, user);

    const item = await this.itemRepository.preload({...updateItemInput, user});
    
    if (!item) throw new NotFoundException(`Item with id: ${updateItemInput.id} was not found`);
    
    return await this.itemRepository.save(item);
    
  }

  async remove(id: string, user:User):Promise<boolean> {
    // TODO: soft delete, integridad refencial
    const item = await this.findOne(id, user);

    await this.itemRepository.remove(item);

    return true;

  }

  async itemCount(user:User):Promise<number>{
    return await this.itemRepository.count({
      where:{
        user:{
          id:user.id
        }
      }
    })
  }
}
