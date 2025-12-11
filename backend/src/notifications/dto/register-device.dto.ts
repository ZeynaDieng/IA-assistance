import { IsString, IsOptional, IsNotEmpty } from 'class-validator'

export class RegisterDeviceDto {
  @IsString()
  @IsNotEmpty()
  token: string

  @IsString()
  @IsOptional()
  deviceId?: string

  @IsString()
  @IsOptional()
  platform?: 'ios' | 'android' | 'web'
}

