import {
    Controller,
    Body,
    Post,
    HttpCode,
    Param,
    Put,
    UploadedFile,
    HttpException,
    HttpStatus,
    UseInterceptors,
    ParseFilePipe,
    ParseFilePipeBuilder,
    Req,
    Get,
    Query,
  } from "@nestjs/common";
  import { RegisterDto, RegisterResponseDto } from "./auth.dto";
import { UserService } from 'src/user/user.service';
import { AuthService } from "./auth.service";
  @Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) { }

    @Post('register')
    async register(@Body() data: RegisterDto): Promise<RegisterResponseDto> {
        return this.authService.register(data)
    }
}
