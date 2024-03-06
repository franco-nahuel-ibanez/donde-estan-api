import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ReportingStatus } from './reporting-status.entity';
import { personStatus } from './person-status.entity';

@Entity()
export class ReportedPerson {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.reportedPersons)
  reportedBy: User;
  
  @ManyToOne(() => ReportingStatus, reportingStatus => reportingStatus.reportedPersons)
  status: ReportingStatus;


  @ManyToOne(() => personStatus, personStatus => personStatus.reportedPersons)
  personStatus: personStatus;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
  })
  image: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  dateOfDisappearance: Date;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  country: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  province: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  locality: string;

  @Column({
    type: 'longtext',
  })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
