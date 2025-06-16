import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonsController } from './pokemons.controller';
import { PokemonsService } from './pokemons.service';
import { Pokemon } from './pokemon.entity';
import { Type } from './type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pokemon, Type])],
  controllers: [PokemonsController],
  providers: [PokemonsService],
})
export class PokemonsModule {} 