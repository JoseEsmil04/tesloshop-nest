import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/product/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { Repository } from 'typeorm';
import { hashSync } from 'bcrypt';


@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async runSeed() {
    this.deleteAllTables()
    const user = await this.insertSeedUsers()
    this.insertSeedProducts(user)
    return 'SEED EXECUTED'
  }

  private async deleteAllTables() {
    await this.productService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder()

    await queryBuilder.delete()
      .where({})
      .execute()
  }

  private async insertSeedUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach(({password, ...user }) => {
      password = hashSync(password, 10)
      users.push(this.userRepository.create({...user, password }))
    })

    await this.userRepository.save(users)

    return users[0]
  }

  private async insertSeedProducts(user: User) {

    const products = initialData.products;
    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push(this.productService.create(product, user))
    });

    await Promise.all(insertPromises);

    return true
  }
}
