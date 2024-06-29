// import { OmitType, PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

// export class UpdateProductDto extends PartialType(OmitType(CreateProductDto, ['slug'])) {}
export class UpdateProductDto extends PartialType(CreateProductDto) {}