import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from './pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonsService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    const pokemon = this.pokemonRepository.create(createPokemonDto);
    return this.pokemonRepository.save(pokemon);
  }

  async findAll(): Promise<Pokemon[]> {
    return this.pokemonRepository.find();
  }

  async findOne(id: number): Promise<Pokemon | null> {
    return this.pokemonRepository.findOneBy({ id });
  }

  async update(id: number, updateDto: UpdatePokemonDto): Promise<Pokemon | null> {
    const pokemon = await this.pokemonRepository.findOneBy({ id });
    if (!pokemon) return null;
    Object.assign(pokemon, updateDto);
    return this.pokemonRepository.save(pokemon);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.pokemonRepository.delete(id);
    return result.affected === 1;
  }
} 