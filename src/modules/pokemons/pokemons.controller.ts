import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  NotFoundException,
  Patch,
  Delete,
  HttpCode,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { Pokemon } from './pokemon.entity';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { FindPokemonsDto } from './dto/find-pokemons.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('pokemons')
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Post()
  async create(@Body() createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    return this.pokemonsService.create(createPokemonDto);
  }

  @Get()
  @Throttle({ default: { limit: 5, ttl: 60 } })
  async findAll(
    @Query(new ValidationPipe({ transform: true })) query: FindPokemonsDto,
  ): Promise<Pokemon[]> {
    return this.pokemonsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Pokemon> {
    const pokemon = await this.pokemonsService.findOne(id);
    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id ${id} not found`);
    }
    return pokemon;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePokemonDto,
  ): Promise<Pokemon> {
    const updated = await this.pokemonsService.update(id, updateDto);
    if (!updated) {
      throw new NotFoundException(`Pokemon with id ${id} not found`);
    }
    return updated;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const deleted = await this.pokemonsService.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Pokemon with id ${id} not found`);
    }
  }
}
