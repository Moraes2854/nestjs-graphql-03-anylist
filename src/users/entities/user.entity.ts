import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ValidRoles } from '../enum/valid-roles.enum';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Item } from '../../items/entities/item.entity';
import { List } from '../../lists/entities/list.entity';

@Entity({ name:'users' })
@ObjectType()
export class User {
  
  @PrimaryGeneratedColumn('uuid')
  @Field( () => ID)
  id:string;

  @Column()
  @Field( () => String)
  fullName:string;

  @Column({ unique:true })
  @Field( () => String)
  email:string;

  @Column()
  // @Field( () => String) 
  password:string;

  @Column({
    type:'enum',
    enum:ValidRoles,
    array:true,
    default:['USER'],
  })
  @Field( () => [ ValidRoles ], { nullable:true })
  roles:ValidRoles[];

  @Column({
    type:'boolean',
    default:true
  })
  @Field( () => Boolean)
  isActive:boolean;

  @ManyToOne(
    ()=>User,
    (user)=>user.lastUpdateBy, 
    { nullable:true, lazy:true }
  )
  @JoinColumn({ name:'lastUpdateBy' })
  @Field( () => User, { nullable:true })
  lastUpdateBy?:User;

  @OneToMany(
    () => Item,
    (item) => item.user,
    { lazy:true }
  )
  // @Field( () => [Item] )
  items:Item[];

  @OneToMany(
    () => List,
    (list) => list.user,
    {  }
  )
  lists:List[]

}
