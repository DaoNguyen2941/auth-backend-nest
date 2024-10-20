import {
    Controller,
    Request,
    Get,
    Post,
    Body
} from "@nestjs/common";
import { UserService } from './user.service';
import { CustomUserInRequest } from "src/auth/auth.dto";
import { userDataDto, searchAccountOrEmailDto } from "./user.dto";
import { plainToInstance } from "class-transformer";
import { SkipAuth } from "src/common/decorate";

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @SkipAuth()
    @Post('/search-and-retrieve')
    async searchAccount(@Body() data: searchAccountOrEmailDto) {
        let user = await this.userService.findUserByIdentifier(data.keyword)
        if (!user) {
            return {
                message: "không tìm thấy tài khoản nào tương ứng với thông tin của bạn!"
            }
        }
        return user
    }

    @Get('/profile')
    async getProfile(@Request() request: CustomUserInRequest): Promise<userDataDto> {
        const userData = await this.userService.getById(request.user.id)

        return plainToInstance(userDataDto, userData, {
            excludeExtraneousValues: true,
        })
    }

}
