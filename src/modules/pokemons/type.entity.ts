import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany } from 'typeorm';
import { Pokemon } from './pokemon.entity';

@Entity('types')
export class Type {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @ManyToMany(() => Pokemon, (pokemon) => pokemon.types)
  pokemons: Pokemon[];
} 