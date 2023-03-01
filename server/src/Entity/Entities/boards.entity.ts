import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Sections } from './sections.entity';
import { Users } from './users.entity';

@Entity({
  name: 'boards',
})
export class Boards {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  boardId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  title: string;

  @Column()
  icon: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'integer' })
  position: number;

  @Column({ type: 'boolean' })
  isFavorite: boolean;

  @Column({ type: 'integer' })
  favoritePosition: number;

  @ManyToOne(() => Users, (user) => user.boards)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: Users;

  @OneToMany(() => Sections, (section) => section.board, {
    nullable: true,
  })
  sections: Sections[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
