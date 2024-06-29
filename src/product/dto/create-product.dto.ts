import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength, Min } from 'class-validator';

export class CreateProductDto {

  @ApiProperty()
  @IsString()
  @MinLength(2)
  title: string

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @IsOptional()
  slug?: string

  @ApiProperty()
  @IsInt()
  @Min(0)
  stock: number

  @ApiProperty()
  @IsString({ each: true }) // cada propiedad es un string
  @IsArray() // array
  sizes: string[]

  @ApiProperty()
  @IsIn(['kid', 'women', 'men', 'unisex'])
  gender: string

  @ApiProperty()
  @IsString({ each: true }) // cada propiedad es un string
  @IsArray() // array
  @IsOptional()
  tags: string[]

  @ApiProperty()
  @IsString({ each: true }) // cada propiedad es un string
  @IsArray() // array
  @IsOptional()
  images?: string[]
}
