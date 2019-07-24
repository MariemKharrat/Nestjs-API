import {
  Controller,
  Post,
  Header,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  UseGuards,
  UseFilters,
  UseInterceptors
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserPostDto } from "./dto/users.post";
import { UserPatchDto } from "./dto/user.patch";
import { UserResponse } from "./interfaces/response.interface";
import { ApiBearerAuth, ApiUseTags } from "@nestjs/swagger";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "./users.role";
import { Authorize } from "../auth/guards/authorize.guard";
import { Anonymous, Roles, Claim } from "../auth/decorators/auth.decorator";
import { ClaimGuard } from "../auth/guards/claim.guard";
import { User } from "./users.entity";

@UseFilters()
@UseInterceptors()
@UseGuards(Authorize, RolesGuard, ClaimGuard)
@ApiUseTags("Users")
@Controller("api/users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @Anonymous()
  @Header("Content-Type", "application/json")
  @HttpCode(201)
  addUser(@Body() newUser: UserPostDto): Promise<UserResponse> {
    return this.userService.create(newUser);
  }

  @ApiBearerAuth()
  @Roles(UserRole.admin)
  @Get()
  @Header("Content-Type", "application/json")
  getAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Claim()
  @ApiBearerAuth()
  @Get(":id")
  @Header("Content-Type", "application/json")
  getById(@Param("id") id: number): Promise<User> {
    return this.userService.findOne({ id: id });
  }

  @Claim()
  @ApiBearerAuth()
  @Patch(":id")
  @Header("Content-Type", "application/json")
  updateUser(
    @Param("id") id: number,
    @Body() user: UserPatchDto
  ): Promise<User> {
    return this.userService.update(user, { id: id });
  }

  @Claim()
  @ApiBearerAuth()
  @Delete(":id")
  @Header("Content-Type", "application/json")
  deleteUser(@Param("id") id: number) {
    this.userService.detele({ id: id });
    return { message: "Delete user successfully!" };
  }
  @Get("test/rawquery")
  @Anonymous()
  async runRawQuery() {
    return await this.userService.runRawQuery();
  }
}
