import { Controller, Post, Body, Get, Param, ParseIntPipe, NotFoundException, Patch, Delete, HttpCode } from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { Pokemon } from './pokemon.entity';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Controller('pokemons')
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Post()
  async create(@Body() createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    return this.pokemonsService.create(createPokemonDto);
  }

  @Get()
  async findAll(): Promise<Pokemon[]> {
    return this.pokemonsService.findAll();
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