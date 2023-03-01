import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Sections } from './sections.entity';

@Entity({
  name: 'tasks',
})
export class Tasks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  taskId: string;

  @Column({ type: 'uuid' })
  sectionId: string;

  @Column({ type: 'uuid' })
  boardId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'integer' })
  position: number;

  @ManyToOne(() => Sections, (section) => section.tasks, {
    onDelete: 'CASCADE',
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'sectionId', referencedColumnName: 'sectionId' })
  section: Sections;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
