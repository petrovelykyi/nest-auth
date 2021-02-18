import { BeforeInsert, Column, CreateDateColumn, Entity, Index, ObjectIdColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  @Exclude()
  @ObjectIdColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column({ default: false })
  isActive: boolean;

  @Exclude()
  @CreateDateColumn()
  creationDate: Date;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await this.getHashPassword();
  }

  async getHashPassword(): Promise<string> {
    return await bcrypt.hash(this.password, 10);
  }

  async verifyPassword(value: string): Promise<boolean> {
    return await bcrypt.compare(value, this.password);
  }
}
