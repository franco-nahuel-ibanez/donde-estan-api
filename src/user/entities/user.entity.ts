import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserType } from './user-type.entity';
import { ReportedPerson } from '../../reported-person/entities/reported-person.entity';
import { UserStatus } from './user-status.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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
    length: 150,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    length: 150,
    nullable: false,
  })
  phoneNumber: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  // @Exclude({ toPlainOnly: true })
  password: string;

  @ManyToOne(() => UserType, userType => userType.users)
  userType: UserType;

  @Column()
  userTypeId: number;

  @OneToMany(() => ReportedPerson, reportedPerson => reportedPerson.reportedBy)
  reportedPersons: ReportedPerson[];

  @ManyToOne(() => UserStatus, userStatus => userStatus.users)
  userStatus: UserStatus;

  @Column()
  userStatusId: number;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  accountEnableCode: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  accountEnableDate: Date;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  resetPasswordCode: string;

  @Column({
    type: 'varchar',
    length: 150,
    default: false,
  })
  termsAndConditions: boolean;




  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

}
