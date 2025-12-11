import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsDateString,
  Min
} from 'class-validator'

export class CreateTaskDto {
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

  @IsInt()
  @Min(1)
  duration: number // in minutes

  @IsDateString()
  scheduledAt: string

  @IsOptional()
  @IsDateString()
  deadline?: string
}

