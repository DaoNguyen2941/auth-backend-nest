import {
  Controller,
  Body,
  Post,
  UseGuards,
  Request,
  Get
} from "@nestjs/common";
import {
  RegisterDto,
  RegisterResponseDto,
  ConfirmOtpDto,
  CustomUserInRequest,
  LoginResponseDto,
  LoginDto
} from "./auth.dto";
import { AuthService } from "./auth.service";
import { SkipAuth } from "src/common/decorate";
import { LocalAuthGuard } from "./guard/local-auth.guard";
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }


  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login2(@Request() req: CustomUserInRequest, @Body() data: LoginDto): Promise<LoginResponseDto> {
    console.log(req.user);
    return this.authService.login(req.user);
  }

  @SkipAuth()
  @Post('register')
  async register(@Body() data: RegisterDto): Promise<RegisterResponseDto> {
    const userNew = await this.authService.register(data)
    await this.authService.authGmail(data.email)
    return userNew
  }

  @SkipAuth()
  @Post('verify-otp')
  async confirm(@Body() confirmOtpData: ConfirmOtpDto) {
    return await this.authService.verifyOTP(confirmOtpData)
  }

}
