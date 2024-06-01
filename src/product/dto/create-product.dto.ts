import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength, Min } from 'class-validator';

export class CreateProductDto {

  @IsString()
  @MinLength(2)
  title: string

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @MinLength(1)
  @IsOptional()
  slug?: string

  @IsInt()
  @Min(0)
  stock: number

  @IsString({ each: true }) // cada propiedad es un string
  @IsArray() // array
  sizes: string[]

  @IsIn(['kid', 'women', 'men', 'unisex'])
  gender: string

  @IsString({ each: true }) // cada propiedad es un string
  @IsArray() // array
  @IsOptional()
  tags: string[]

  @IsString({ each: true }) // cada propiedad es un string
  @IsArray() // array
  @IsOptional()
  images?: string[]
}
