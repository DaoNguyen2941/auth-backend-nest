import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from "class-transformer";

import { BaseEntity } from 'src/common/base.entity';
@Entity()
export class Users extends BaseEntity {
  @Column({ type: "varchar", nullable: false, unique: true })
  account: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  email: string;

  @Column({ type: "varchar", nullable: false})
  @Exclude()
  password: string;

  @Column({ type: "varchar",  nullable: true})
  @Exclude()
  refresh_token: string | null;

}