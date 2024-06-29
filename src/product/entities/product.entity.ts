import { BeforeInsert, BeforeUpdate, Check, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/auth.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' }) // Nombre de Tabla
@Check('"price" >= 0') // Constraint para verificar si el precio es mayor a 0
export class Product {

  @ApiProperty({
    example: '136634de-4197-4895-83ff-1e119fc5f66e',
    description: 'Product ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid') // Llave Primaria tipo uuid
  id: string

  @ApiProperty({
    example: 'teslo shoes',
    description: 'Product Title',
    uniqueItems: true
  })
  @Column('text', { // De tipo text, Unique
    unique: true
  })
  title: string

  @ApiProperty({
    example: 1250.00,
    description: 'Product Price',
    default: 0
  })
  @Column('float', {
    default: 0,
    
  })
  price: number

  @ApiProperty({
    example: 'Aute velit elit exercitation cupidatat eiusmod voluptate cillum veniam amet cillum nisi ipsum ex quis.',
    description: 'Product Description'
  })
  @Column({
    type: 'text',
    nullable: true
  })
  description: string

  @ApiProperty({
    example: 'teslo_shoes',
    description: 'Product Slug - SEO',
    uniqueItems: true
  })
  @Column('text', {
    unique: true
  })
  slug?: string

  @ApiProperty({
    example: 200,
    description: 'Product Stock',
    default: 0
  })
  @Column('int', {
    default: 0
  })
  stock: number

  @ApiProperty({
    example: ['S', 'M', 'L', 'XL'],
    description: 'Product Sizes'
  })
  @Column('text', {
    array: true
  })
  sizes: string[]


  @ApiProperty({
    example: 'women',
    description: 'Product Gender',
    nullable: true
  })
  @Column('text')
  gender: string
  
  @ApiProperty({
    example: ['shoe'],
    description: 'Product Tags'
  })
  @Column('text', {
    array: true,
    default: []
  })
  tags: string[]
  
  /* Relacion con
   tabla product_images, 
   eliminacion en cascada 
   y eager para hacer SELECTS
   con las relaciones
   */
  @OneToMany( 
    () => ProductImage,
    (productImage) => productImage.product,
    { cascade: true, eager: true }
  )
  images?: ProductImage[]
  
  @ApiProperty()
  @ManyToOne(
    () => User,
    (user) => user.product,
    { eager: true } 
  )
  user: User;


  @BeforeInsert() // Metodo para proporcionar el slug en base al title
  checkSlugInsert() {
    if(!this.slug) {
      this.slug = this.title
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(/\s/g, '_')
      .replaceAll(/[^a-zA-Z0-9_]/g, '')
  }

  @BeforeUpdate() // Metodo para actualizar el slug si vieene
  checkSlugUpdate() {
    if(!this.slug) {
      return
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(/\s/g, '_')
      .replaceAll(/[^a-zA-Z0-9_]/g, '')
  }
}
