import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsStrongPassword, Matches, MaxLength, MinLength } from "class-validator";


export class LoginUserDto {
  
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  // @Matches(
  //     /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //     message: 'The password must have a Uppercase, lowercase letter and a number'
  // })
  @IsStrongPassword({ minLength: 6, minNumbers: 1, minUppercase: 1, minLowercase: 1, minSymbols: 1 })
  password: string;
}
