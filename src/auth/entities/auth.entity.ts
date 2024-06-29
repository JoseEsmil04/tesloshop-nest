import { ApiProperty } from "@nestjs/swagger";
import { Product } from "src/product/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

  @ApiProperty({
    example: '136634de-4197-4895-83ff-1e119fc5f66e',
    description: 'User ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('text', {
    unique: true,
    nullable: false
  })
  email: string;

  @ApiProperty()
  @Column('text', {
    nullable: false,
    select: false
  })
  password: string;

  @ApiProperty()
  @Column('text', {
    nullable: false
  })
  fullName: string;

  @ApiProperty()
  @Column('bool', {
    default: true
  })
  isActive: boolean;

  @ApiProperty()
  @Column('text', {
    array: true,
    default: ['user']
  })
  roles: string[];

  @OneToMany(
    () => Product,
    (product) => product.user
  )
  product: Product;

  @BeforeInsert()
  checkEmailBeforeInsert() {
    this.email = this.email.toLowerCase().trim()
  }

  @BeforeUpdate()
  CheckFieldsBeforeUpdate() {
    this.checkEmailBeforeInsert()
  }
}
