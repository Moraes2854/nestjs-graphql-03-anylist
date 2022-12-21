import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { Item } from '../../items/entities/item.entity';
import { List } from '../../lists/entities/list.entity';

@Entity({ name: 'listItems'})
@ObjectType()
export class ListItem {

  @PrimaryGeneratedColumn('uuid')
  @Field( () => ID )
  id:string;

  @Column({ type: 'numeric', default:0})
  @Field( () => Number )
  quantity:number;

  
  @Column({ type: 'boolean', default:false})
  @Field( () => Boolean )
  completed:boolean;

  @ManyToOne(
    ()=>List,
    (list)=>list.listItems,
    { lazy:true, }
  )
  @Field( () => List )
  list:List;

  @ManyToOne(
    () => Item,
    (item)=>item.listItem,
    { lazy:true,  }
  )
  @Field( () => Item )
  item:Item


}
