import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { SendOtpDto } from './dto/send-otp.dto'
import { VerifyOtpRegisterDto } from './dto/verify-otp-register.dto'
import { VerifyOtpLoginDto } from './dto/verify-otp-login.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // NEW OTP-BASED AUTHENTICATION
  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body(ValidationPipe) sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto.phoneNumber, sendOtpDto.purpose)
  }

  @Post('verify-otp-register')
  @HttpCode(HttpStatus.CREATED)
  async verifyOtpRegister(@Body(ValidationPipe) verifyDto: VerifyOtpRegisterDto) {
    return this.authService.verifyOtpRegister(
      verifyDto.phoneNumber,
      verifyDto.otp,
      verifyDto.firstName,
      verifyDto.lastName
    )
  }

  @Post('verify-otp-login')
  @HttpCode(HttpStatus.OK)
  async verifyOtpLogin(@Body(ValidationPipe) verifyDto: VerifyOtpLoginDto) {
    return this.authService.verifyOtpLogin(
      verifyDto.phoneNumber,
      verifyDto.otp
    )
  }

  // OLD PIN-BASED AUTHENTICATION (COMMENTED - Can be uncommented later)
  // @Post('register')
  // @HttpCode(HttpStatus.CREATED)
  // async register(@Body(ValidationPipe) registerDto: RegisterDto) {
  //   return this.authService.register(
  //     registerDto.phoneNumber,
  //     registerDto.pin
  //   )
  // }

  // @Post('login')
  // @HttpCode(HttpStatus.OK)
  // async login(@Body(ValidationPipe) loginDto: LoginDto) {
  //   return this.authService.login(
  //     loginDto.phoneNumber,
  //     loginDto.pin
  //   )
  // }
}

