import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsDateString,
  Min
} from 'class-validator'

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number

  @IsOptional()
  @IsDateString()
  scheduledAt?: string

  @IsOptional()
  @IsDateString()
  deadline?: string
}

