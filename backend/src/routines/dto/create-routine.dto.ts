import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsArray,
  IsBoolean,
  Min,
  Matches
} from 'class-validator'

export class CreateRoutineDto {
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsEnum(['DAILY', 'WEEKLY', 'WEEKDAYS', 'WEEKENDS', 'CUSTOM'])
  frequency: 'DAILY' | 'WEEKLY' | 'WEEKDAYS' | 'WEEKENDS' | 'CUSTOM'

  @IsOptional()
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in HH:mm format'
  })
  time?: string // HH:mm format

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  daysOfWeek?: string[] // ["MONDAY", "TUESDAY", ...]

  @IsInt()
  @Min(1)
  duration: number // in minutes

  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean // Renouvellement automatique après 1 mois
}

