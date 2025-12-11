import { IsString, IsNotEmpty, Matches, IsOptional, IsEnum } from 'class-validator'

export enum OtpPurpose {
  REGISTER = 'REGISTER',
  LOGIN = 'LOGIN'
}

export class SendOtpDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be in valid international format'
  })
  phoneNumber: string

  @IsEnum(OtpPurpose)
  @IsOptional()
  purpose?: OtpPurpose = OtpPurpose.REGISTER
}

