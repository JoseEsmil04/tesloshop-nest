import { applyDecorators } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { Product } from "../entities";


export function ProductPostResponse() {
  return applyDecorators(
    ApiResponse({ status: 201, description: 'Product Created!', type: Product }),
    ApiResponse({ status: 400, description: 'Bad Request!' }),
    ApiResponse({ status: 403, description: 'Forbidden!!' })
  )
}