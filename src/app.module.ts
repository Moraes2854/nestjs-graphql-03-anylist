import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ItemsModule } from './items/items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { posix } from 'path/win32';


@Module({
  imports: [
    ConfigModule.forRoot(),

    GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    // debug: false,
    playground: false,
    autoSchemaFile: join( process.cwd(), 'src/schema.gql'),
    plugins:[
      ApolloServerPluginLandingPageLocalDefault
    ]
    }),

    TypeOrmModule.forRoot({
      type:'postgres',
      host:process.env.DB_HOST,
      port:Number(process.env.DB_PORT),
      username:process.env.DB_USERNAME,
      password:process.env.DB_PASSWORD,
      database:process.env.DB_NAME,
      entities:[],
      synchronize:true
    }),
    ItemsModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
