import * as bcrypt from 'bcrypt'
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { PostgresExceptionHandler } from 'src/common/exceptions/pg-handle-exceptions';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './strategies/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly postgresExceptionHandler: PostgresExceptionHandler
  ){}

  async create(createUserDto: CreateUserDto) {
    try {

      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJWTToken({ id: user.id })
      }

    } catch (error) {
      this.postgresExceptionHandler.handleDBExceptions(error)
    }

  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase().trim() },
      select: { email: true, password: true, id: true }
    });

    if(!user) {
      throw new UnauthorizedException('Credentials are not valid! (Email)')
    }

    if(!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid! (Password)')
    }

    return {
      ...user,
      token: this.getJWTToken({ id: user.id })
    }
  }

  async checkAuthStatus(user: User) {
    const { id } = user;

    const userQuery = await this.userRepository.findOne({
      where: { id },
      select: { email: true, password: true, fullName: true }
    })

    if(!userQuery) {
      throw new NotFoundException('User Not Found!!')
    }

    return {
      ...userQuery,
      token: this.getJWTToken({ id })
    };
  }

  private getJWTToken(jwtPayload: JwtPayload) {
    const token = this.jwtService.sign(jwtPayload);
    return token;
  }

}
