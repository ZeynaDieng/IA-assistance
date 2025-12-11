import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class TaskInputDto {
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsString()
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

  @IsString()
  duration: string // in minutes

  @IsOptional()
  @IsString()
  deadline?: string

  @IsOptional()
  @IsString()
  suggestedTime?: string

  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @IsString()
  dependsOn?: string

  @IsOptional()
  requiresFocus?: boolean

  @IsOptional()
  @IsString()
  location?: string

  @IsOptional()
  @IsString()
  energyLevel?: 'LOW' | 'MEDIUM' | 'HIGH'
}

export class GeneratePlanningDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskInputDto)
  tasks: TaskInputDto[]

  @IsOptional()
  @IsString()
  date?: string // ISO date string

  @IsOptional()
  includeRoutines?: boolean // Whether to include routine tasks (default: true)
}

