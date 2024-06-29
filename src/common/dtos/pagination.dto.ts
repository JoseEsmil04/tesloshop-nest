import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto {

  @ApiProperty({ description: 'Limit of Response', default: 10 })
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // esto es igual a enableImplicitConversion: true
  limit?: number;

  @ApiProperty({ description: 'Skip of the Response', default: 0 })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset: number;
}