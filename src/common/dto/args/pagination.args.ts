import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsString, IsOptional, Min } from 'class-validator';


@ArgsType()
export class PaginationArgs {

    @Field( () => Int, { nullable:true })
    @IsOptional()
    @Min(0)
    offset: number = 0;

    @Field( () => Int, { nullable:true })
    @IsOptional()
    @Min(0)
    limit: number = 5;


}