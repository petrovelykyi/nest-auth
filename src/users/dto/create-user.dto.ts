import { IsEmail, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Matches(/^(?=.*\d)(?=.*[a-zа-яґіїє])(?=.*[A-ZА-ЯҐІЇЄ])(?=.*[^a-zA-Zа-яА-ЯґҐіІїЇєЄ0-9])(?!.*\s).{8,24}$/, {
    message: 'Password must contain at least 8 characters, including UPPER/lowercase/digits and one special symbol.',
  })
  password: string;
}
