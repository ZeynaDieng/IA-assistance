import { IsDateString } from 'class-validator'

export class PostponeTaskDto {
  @IsDateString()
  newDate: string
}

