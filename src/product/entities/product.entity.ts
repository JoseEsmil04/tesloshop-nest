import { BeforeInsert, BeforeUpdate, Check, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";

@Entity({ name: 'products' }) // Nombre de Tabla
@Check('"price" >= 0') // Constraint para verificar si el precio es mayor a 0
export class Product {


  @PrimaryGeneratedColumn('uuid') // Llave Primaria tipo uuid
  id: string

  @Column('text', { // De tipo text, Unique
    unique: true
  })
  title: string

  @Column('float', {
    default: 0,
    
  })
  price: number

  @Column({
    type: 'text',
    nullable: true
  })
  description: string

  @Column('text', {
    unique: true
  })
  slug?: string

  @Column('int', {
    default: 0
  })
  stock: number

  @Column('text', {
    array: true
  })
  sizes: string[]

  @Column('text')
  gender: string
  
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
