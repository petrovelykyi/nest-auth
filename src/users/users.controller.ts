import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  UseGuards,
  Get,
  Res,
  HttpCode,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { Response } from 'express';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.signup(createUserDto);
  }

  @HttpCode(200)
  @Post('/signin')
  @UseGuards(AuthGuard('local'))
  async signin(@Req() req, @Res() res: Response): Promise<void> {
    const cookie = this.usersService.getCookieWithJwtToken(req.user);
    res.setHeader('Set-Cookie', cookie);
    return res.end();
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  async me(@Req() req): Promise<{ id: string; email: string }> {
    console.log(req);
    return req.user;
  }

  @HttpCode(200)
  @Post('/signout')
  @UseGuards(AuthGuard('jwt'))
  async signout(@Res() res: Response): Promise<void> {
    const cookie = this.usersService.getCookieForLogOut();
    res.setHeader('Set-Cookie', cookie);
    return res.end();
  }
}
