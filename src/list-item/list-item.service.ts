import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


import { ListItem } from './entities/list-item.entity';
import { User } from '../users/entities/user.entity';

import { CreateListItemInput, UpdateListItemInput } from './dto/inputs/';
import { PaginationArgs, SearchArgs } from '../common/dto/args';
import { List } from '../lists/entities/list.entity';

@Injectable()
export class ListItemService {

  constructor(
    @InjectRepository(ListItem)
    private readonly listItemsRepository:Repository<ListItem>
  ){}

  async create({itemId, listId, ...rest}: CreateListItemInput):Promise<ListItem> {

    if (await this.listItemsRepository.findOneBy({item:{id:itemId}, list:{id:listId}})) throw new BadRequestException('A similar record already exists on the list')

    const newListItem = this.listItemsRepository.create({
      ...rest,
      item:{id:itemId},
      list:{id:listId},
    })
    
    await this.listItemsRepository.save( newListItem )

    return this.findOne(newListItem.id);

  }

  async findAll(list:List, {limit, offset}:PaginationArgs, {search}:SearchArgs):Promise<ListItem[]> {

    const queryBuilder = this.listItemsRepository.createQueryBuilder('listItem')
    .innerJoin('listItem.item', 'item')
    .take(limit)
    .skip(offset)
    .where(`"listId" = :listId`, {listId: list.id})
    
    if (search){
      queryBuilder.andWhere('LOWER(item.name) LIKE :name', { name: `%${ search.toLowerCase() }%` });
    }

    return await queryBuilder.getMany();

  }

  async findOne(id: string, ):Promise<ListItem> {

    const listItem = await this.listItemsRepository.findOneBy({id});

    if (!listItem) throw new NotFoundException(`List item with id: ${id} not found`);

    return listItem;

  }

  async update({itemId, listId, ...rest}: UpdateListItemInput):Promise<ListItem> {

    const queryBuilder = this.listItemsRepository.createQueryBuilder('listItem')
      .update()
      .set({ ...rest })
      .where('id = :id', {id:rest.id});

    if (listId) queryBuilder.set({ list: { id: listId}});
    if (itemId) queryBuilder.set({ item: { id: itemId}});

    await queryBuilder.execute();
   
    return await this.findOne(rest.id);
  }

  // async remove(id: string):Promise<boolean> {
  //   return `This action removes a #${id} listItem`;
  // }

  async countListItemsByList(list:List):Promise<number>{
    return await this.listItemsRepository.count({
      where:{
        list:{
          id:list.id
        }
      }
    });
  }
}
