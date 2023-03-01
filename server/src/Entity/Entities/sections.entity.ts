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
import { Boards } from './boards.entity';
import { Tasks } from './tasks.entity';

@Entity({
  name: 'sections',
})
export class Sections {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  sectionId: string;

  @Column({ type: 'uuid' })
  boardId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  title: string;

  @Column({ type: 'integer' })
  position: number;

  @ManyToOne(() => Boards, (board) => board.sections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'boardId', referencedColumnName: 'boardId' })
  board: Boards;

  @OneToMany(() => Tasks, (task) => task.section)
  tasks: Tasks[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
