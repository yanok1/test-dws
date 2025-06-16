import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/common/cache';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HelloModule } from './modules/hello/hello.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonsModule } from './modules/pokemons/pokemons.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 10,
          ttl: 60,
        },
      ],
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    HelloModule,
    PokemonsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database:
          process.env.NODE_ENV === 'test'
            ? ':memory:'
            : config.get<string>('DATABASE_PATH'),
        autoLoadEntities: true,
        synchronize: true,
        migrations: ['../typeorm/migrations/*.ts'],
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
