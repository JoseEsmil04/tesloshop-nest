import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";


@Entity({ name: 'product_images' }) // Nombre de la tabla
export class ProductImage {

  @PrimaryGeneratedColumn('increment') // Id Llave Primaria
  id: number;

  @Column('text', {
    unique: true
  })
  url: string;

  @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' }) // Relacion con tabla Products
  product: Product
}