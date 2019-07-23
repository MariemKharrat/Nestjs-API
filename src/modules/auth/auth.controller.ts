import {
  Controller,
  UseGuards,
  Post,
  Request,
  Get,
  Response,
  Body,
  UseFilters,
  UseInterceptors
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { ApiBearerAuth, ApiUseTags } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { Authorize } from "./guards/authorize.guard";
import { IResponse } from "../common/interfaces/response.interface";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./decorators/roles.decorator";
import { IRequest } from "../common/interfaces/request.interface";

@UseInterceptors()
@UseFilters()
@ApiUseTags("Auth")
@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Request() req: IRequest, @Body() user: LoginDto) {
    return this.authService.login(req.user);
  }

  @UseGuards(Authorize, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @Get("auth/user")
  getUser(@Request() req: IRequest) {
    return req.user;
  }

  @ApiBearerAuth()
  @UseGuards(Authorize)
  @Get("auth/admin")
  getAdmin(@Request() req: IRequest) {
    return req.user;
  }

  @Post("register")
  async register(@Response() res: IResponse) {
    res.redirect(307, "/api/users");
  }
}
