import { Module } from '@nestjs/common';
import { PostgresExceptionHandler } from './exceptions/pg-handle-exceptions';

@Module({
  providers: [PostgresExceptionHandler],
  exports: [PostgresExceptionHandler]
})
export class CommonModule {}
