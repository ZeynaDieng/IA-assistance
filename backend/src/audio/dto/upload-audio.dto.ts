import { IsNotEmpty, IsString } from 'class-validator'

export class UploadAudioDto {
  @IsNotEmpty()
  @IsString()
  userId: string
}

