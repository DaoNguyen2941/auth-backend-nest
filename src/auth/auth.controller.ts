import {
  Controller,
  Body,
  Post,
} from "@nestjs/common";
import { RegisterDto, RegisterResponseDto, ConfirmOtpDto, LoginDto } from "./auth.dto";
import { UserService } from 'src/user/user.service';
import { AuthService } from "./auth.service";
import { SkipAuth } from "src/common/decorate";
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) { }

  @SkipAuth()
  @Post('login')
  async Login(@Body() data: LoginDto) {
    return await this.authService.userLogin(data)
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
