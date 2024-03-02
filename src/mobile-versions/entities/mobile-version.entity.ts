import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
  OneToOne,
  JoinColumn,
  AfterLoad,
} from 'typeorm';
import { MobileOsType } from './mobile-os-type.entity';

@Entity()
export class MobileVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MobileOsType, mobileOs => mobileOs.mobileVersions)
  mobileOs: MobileOsType

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  version: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
