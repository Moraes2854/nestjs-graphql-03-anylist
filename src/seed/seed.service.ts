import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../users/entities/user.entity';
import { Item } from '../items/entities/item.entity';
import { SEED_USERS, SEED_ITEMS, SEED_LISTS } from './data/seed-data';
import { ListItem } from '../list-item/entities/list-item.entity';
import { List } from '../lists/entities/list.entity';
import { ItemsService } from '../items/items.service';

@Injectable()
export class SeedService {

    private seedExecuted:boolean|null;

    constructor(
        private readonly configService:ConfigService,
        private readonly itemsService:ItemsService,


        @InjectRepository(User)
        private usersRepository:Repository<User>,

        @InjectRepository(Item)
        private itemsRepository:Repository<Item>,

        @InjectRepository(List)
        private listsRepository:Repository<List>,

        @InjectRepository(ListItem)
        private listItemsRepository:Repository<ListItem>,

    ){
        this.seedExecuted = (configService.get('SEED_EXECUTED') === 'TRUE') ? true : (configService.get('SEED_EXECUTED') === 'FALSE') ? false : null;
    }

    async executeSeed():Promise<boolean>{
        
        if (this.seedExecuted === null) throw new InternalServerErrorException('ENVIRONMENT VARIABLE FAILING')
        if (this.seedExecuted === true) throw new BadRequestException('Seed has been alredy executed');

        await this.deleteTables();

        await this.insertUsers();

        const users = await this.usersRepository.find({});

        await this.insertItems(users);

        const user = users.find((u)=>u.email === SEED_USERS.at(0).email);

        await this.insertLists(user);

        return true;
    }

    private async deleteTables(){
        await this.listItemsRepository.delete({});
        await this.listsRepository.delete({});
        await this.itemsRepository.delete({});
        await this.usersRepository.delete({});
    }

    private async insertUsers(){
        await this.usersRepository.createQueryBuilder('user')
        .insert()
        .values(
            SEED_USERS.map((user)=>({
                ...user,
                password:bcrypt.hashSync(user.password, 10),
            }))
        )
        .execute();
    }

    private async insertItems(users:User[]){

        await this.itemsRepository.createQueryBuilder('items')
        .insert()
        .values(
            SEED_ITEMS.map((item)=>({
                ...item,
                user:users.at(Math.floor((Math.random()*users.length)))
            }))
        )
        .execute();
    }
    
    private async insertLists(user:User){

        await this.listsRepository.createQueryBuilder('list')
        .insert()
        .values(
            SEED_LISTS.map((list)=>({
                ...list,
                user,
            }))
        )
        .execute();
    }

}
