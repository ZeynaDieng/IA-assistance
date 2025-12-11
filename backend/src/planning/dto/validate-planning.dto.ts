import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class PlannedTaskDto {
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsString()
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

  @IsString()
  duration: string // in minutes

  @IsString()
  scheduledAt: string // ISO datetime string

  @IsOptional()
  @IsString()
  deadline?: string
}

export class RoutineRenewalDto {
  @IsString()
  routineId: string

  @IsString()
  shouldRenew: boolean // true = renouveler, false = ne pas renouveler
}

export class ValidatePlanningDto {
  @IsString()
  date: string // ISO date string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlannedTaskDto)
  tasks: PlannedTaskDto[]

  @IsOptional()
  @IsString()
  audioLogId?: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoutineRenewalDto)
  routineRenewals?: RoutineRenewalDto[] // Décisions de renouvellement des routines
}

