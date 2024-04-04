import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorators';
import { User } from './entities/user.entity';

@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser(
    @GetUser() user: User
  ) {
    return this.userService.getUser(user)
  }

  @Patch()
  update(
    @GetUser() user: User,    
    @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user, updateUserDto);
  }

  @Delete()
  remove(
    @GetUser() user: User, 
  ) {
    return this.userService.deleteAccount(user);
  }

  @Post('block')
  bloqued(
    @GetUser() user: User,
    @Body('userId') userId: number, 
  ) {
    return this.userService.block(user, userId);
  }

}
