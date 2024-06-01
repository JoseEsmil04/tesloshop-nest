import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([ Product, ProductImage ]) // Modulo de TypeOrm para usar las tablas.
  ],
  exports: [ProductsService, TypeOrmModule] // Exportar el ProductsService para usarlo afuera
})
export class ProductsModule {}
