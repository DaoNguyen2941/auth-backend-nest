import {
    Controller,
    Request,
    Get,
  } from "@nestjs/common";
  import { UserService } from './user.service';
 import { CustomUserInRequest } from "src/auth/auth.dto";
 import { userDataDto } from "./user.dto";
 import { plainToInstance } from "class-transformer";

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ) {}

    @Get('/profile')
    async getProfile(@Request() request: CustomUserInRequest): Promise<userDataDto> {
        const userData =  await this.userService.getById(request.user.id)

        return plainToInstance(userDataDto, userData, {
            excludeExtraneousValues: true,
        })
    }

}
