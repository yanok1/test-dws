import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from './pokemon.entity';
import { Type } from './type.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { FindPokemonsDto } from './dto/find-pokemons.dto';

@Injectable()
export class PokemonsService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
    @InjectRepository(Type)
    private readonly typeRepository: Repository<Type>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    const { name, types: typeNames } = createPokemonDto;
    const types = await Promise.all(
      typeNames.map(async (typeName) => {
        let type = await this.typeRepository.findOne({ where: { name: typeName } });
        if (!type) {
          type = this.typeRepository.create({ name: typeName });
          type = await this.typeRepository.save(type);
        }
        return type;
      })
    );
    const pokemon = this.pokemonRepository.create({ name, types });
    return this.pokemonRepository.save(pokemon);
  }

  async findAll(query?: FindPokemonsDto): Promise<Pokemon[]> {
    const qb = this.pokemonRepository.createQueryBuilder('pokemon').leftJoinAndSelect('pokemon.types', 'type');
    if (query?.type) {
      qb.andWhere('type.name = :type', { type: query.type });
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
    return this.pokemonRepository.findOne({ where: { id }, relations: ['types'] });
  }

  async update(id: number, updateDto: UpdatePokemonDto): Promise<Pokemon | null> {
    const pokemon = await this.pokemonRepository.findOne({ where: { id }, relations: ['types'] });
    if (!pokemon) return null;
    if (updateDto.name !== undefined) {
      pokemon.name = updateDto.name;
    }
    if (updateDto.types !== undefined) {
      const types = await Promise.all(
        updateDto.types.map(async (typeName) => {
          let type = await this.typeRepository.findOne({ where: { name: typeName } });
          if (!type) {
            type = this.typeRepository.create({ name: typeName });
            type = await this.typeRepository.save(type);
          }
          return type;
        })
      );
      pokemon.types = types;
    }
    return this.pokemonRepository.save(pokemon);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.pokemonRepository.delete(id);
    return result.affected === 1;
  }
} 