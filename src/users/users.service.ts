import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { SignupInput } from '../auth/dto/inputs/signup.input';
import { User } from './entities/user.entity';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { UpdateUserInput } from './dto/inputs/update-user.input';
import { Item } from '../items/entities/item.entity';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

@Injectable()
export class UsersService {

  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,

  ){}

  async create( signupInput: SignupInput ):Promise<User> {

    try {
      
      const newUser = this.userRepository.create({
        ...signupInput,
        password:bcrypt.hashSync(signupInput.password, 10),
      });

      return await this.userRepository.save(newUser);

    } catch (error) {
      this.handleError(error);
    }


  }

  async update(updateUserInput:UpdateUserInput, updatedBy:User):Promise<User>{

    try {
      
      const user = await this.userRepository.preload({
        ...updateUserInput,
      })
      
      if (updateUserInput.password) user.password = bcrypt.hashSync(updateUserInput.password, 10);

      user.lastUpdateBy = updatedBy;
  
      return await this.userRepository.save(user);
    
    } catch (error) {
      this.handleError(error);
    }

    // throw new Error('Not implemented yet')
  }

  async findAll(validRolesArgs:ValidRolesArgs, { limit, offset }:PaginationArgs, { search }:SearchArgs):Promise<User[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user')
    .take(limit)
    .skip(offset)

    if (search){
      queryBuilder.where('LOWER(fullName) LIKE :fullName', { fullName: `%${ search.toLowerCase() }%` });
    }

    if (validRolesArgs.roles.length > 0) {
      return queryBuilder
      .andWhere('user.roles && :validRoles', { validRoles: validRolesArgs.roles})
      .getMany();
    }

    return queryBuilder.getMany()


  }

  async findOne(id:string):Promise<User>{
    try {
      return this.userRepository.findOneByOrFail({id});
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOneById(id:string):Promise<User>{
    try {

      return await this.userRepository.findOneOrFail({
        where:{
          id
        }
      });

    } catch (error) {
      this.handleError({
        code:'customErrorID',
        detail:`User with id:'${id}' not found`
      });
    }
  }

  async findOneByEmail(email:string):Promise<User> {

    try {

      return await this.userRepository.findOneOrFail({
        where:{
          email
        }
      });

    } catch (error) {
      this.handleError({
        code:'customErrorEmail',
        detail:`User with email:'${email}' not found`
      });
    }

  }


  async block(id: string, adminUser:User):Promise<User> {
    const userToBlock = await this.findOneById(id);
    userToBlock.isActive=false;
    userToBlock.lastUpdateBy = adminUser;
    return this.userRepository.save(userToBlock);
  }

  private handleError(error:any):never{
    
    if (error.code === '23505') throw new BadRequestException(error.detail);
    if (error.code === 'customErrorEmail') throw new NotFoundException(error.detail);
    if (error.code === 'customErrorID') throw new NotFoundException(error.detail);

    this.logger.error(error);

    
    throw new InternalServerErrorException('Algo salio mal...')
  }

}
