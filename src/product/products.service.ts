import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid'
import { ProductImage } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService'); // Logger de Nest

  constructor(
    @InjectRepository(Product) // Decorador para Inyectar Repositorios(Tablas)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly datasource: DataSource
  ){}

  async create(createProductDto: CreateProductDto) {

    const { images = [], ...productDetails } = createProductDto;
    try {
      const product = this.productsRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image })) //? Se inserta en product_images
      });
      await this.productsRepository.save(product); //? se Salva TODO

      return { ...product, images }
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto

    const [ products, count ] = await this.productsRepository.findAndCount({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    })

    return {
      totalProducts: count,
      products: products.map(product => ({
        ...product,
        images: product.images.map(img => img.url) // Mapeo para barrer los id de las img
      }))
    }
  }

  async findOne(term: string) {

    let product: Product

    if(isUUID(term)) {
      product = await this.productsRepository.findOneBy({ id: term })
    } else {
      const queryBuilder = this.productsRepository.createQueryBuilder('prod') // QueryBuilder para hacer querys

      product = await queryBuilder // Para evitar SQL Injections
        .where('LOWER(title) = LOWER(:title) or slug = LOWER(:slug)', {
          title: term,
          slug: term
        })
        .leftJoinAndSelect('prod.images', 'prodImages') // Propiedad y Apodo
        .getOne()
    }

    if(!product) {
      throw new NotFoundException(`Product with term: ${term} not Found!`)
    }

    return product
  }

  // Intermediario para no alterar el metodo findOne que regresa un Product(Entity)
  async findOnePlain(term: string) {
    const { images = [], ...product  } = await this.findOne(term);

    return {
      ...product,
      images: images.map(img => img.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productsRepository.preload({ // Preload busca por id y actualiza
      id: id,
      ...toUpdate
    });

    if(!product) {
      throw new NotFoundException(`Product with id; ${id} not Found!!`);
    }

    const queryRunner = this.datasource.createQueryRunner(); // QueryRunner para crear una transaccion
    await queryRunner.connect(); // se Conecta
    await queryRunner.startTransaction(); // se inicia (solo afecta a la BD con un commit o rollback)

    
    try {
      if(images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } }); // Manager para borrar
  
        product.images = images.map(
          img => this.productImageRepository.create({ url: img })
        );
      } else {
        // Cargar de alguna manera...
      }
  
      await queryRunner.manager.save(product) // Guardar
      await queryRunner.commitTransaction(); // Finalmente el commit

      // await this.productsRepository.save(product);
  
      return this.findOnePlain(id)
    } catch (error) {
      await queryRunner.rollbackTransaction(); // o el rollback en caso de que haya error
      
      this.handleDBExceptions(error);
    } finally {
      await queryRunner.release(); // Release obligatorio en cada transaction
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id)

    await this.productsRepository.delete({
      id: product.id
    })

    return {
      message: 'Deleted',
      product: product.title
    }
  }

  private handleDBExceptions(error: any) {
    // Unique Constraint error
    if(error.code === '23505') {
      throw new BadRequestException(error.detail)
    }

    this.logger.error(error)
    throw new InternalServerErrorException('Internal Server Error - Check Log')
  }

  async deleteAllProducts() {
    const query = this.productsRepository.createQueryBuilder('product')

    try {
      return await query.delete().where({}).execute()

    } catch (error) {
      this.handleDBExceptions(error)
    }
  
  }
} 
