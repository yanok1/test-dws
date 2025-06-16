import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from './pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { FindPokemonsDto } from './dto/find-pokemons.dto';

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

  async findAll(query?: FindPokemonsDto): Promise<Pokemon[]> {
    const qb = this.pokemonRepository.createQueryBuilder('pokemon');
    if (query?.type) {
      qb.andWhere('pokemon.type = :type', { type: query.type });
    }
    if (query?.name) {
      qb.andWhere('pokemon.name LIKE :name', { name: `%${query.name}%` });
    }
    qb.orderBy(`pokemon.${query?.sort || 'name'}`, query?.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
    qb.skip(query?.offset ?? 0);
    qb.take(query?.limit ?? 20);
    return qb.getMany();
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