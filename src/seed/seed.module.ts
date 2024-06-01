import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from 'src/product/products.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ProductsModule] // Importar Modulo(Products) para usar el ProductsService
})
export class SeedModule {}
