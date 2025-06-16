import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Type } from './type.entity';

@Entity('pokemons')
export class Pokemon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Type, (type) => type.pokemons, { cascade: true })
  @JoinTable({ name: 'pokemon_types' })
  types: Type[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
