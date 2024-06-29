import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([ Product, ProductImage ]), // Modulo de TypeOrm para usar las tablas.
    AuthModule
  ],
  exports: [ProductsService, TypeOrmModule] // Exportar el ProductsService para usarlo afuera
})
export class ProductsModule {}
