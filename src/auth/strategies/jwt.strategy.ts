import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/auth.entity";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable() // TOdas las estategias son providers
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    configService: ConfigService
  ){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET')
    })
  }

  async validate(payload: JwtPayload): Promise<User> {

    const { id } = payload;
    
    const user = await this.userRepository.findOneBy({ id })

    if(!user) {
      throw new UnauthorizedException('Token not Valid!')
    }

    if(!user.isActive) {
      throw new UnauthorizedException('User is inactive, talk with an admin!')
    }

    return user;
  }
}