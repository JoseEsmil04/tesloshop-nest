import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './product/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Variables de entorno (.env)
    TypeOrmModule.forRoot({ // Config d TypeOrm
      type: 'postgres',
      host: process.env.DB_HOST,
      database: process.env.POSTGRES_DB,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      autoLoadEntities: true,
      synchronize: true 
    }),
    ProductsModule,
    CommonModule,
    SeedModule
  ],
})
export class AppModule {}
