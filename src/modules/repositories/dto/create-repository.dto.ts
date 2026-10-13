import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRepositoryDto {
  @ApiProperty({ example: 'julianf97', description: 'Usuario u organización de GitHub' })
  @Transform(({ value }: { value: unknown }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9-]+$/)
  owner!: string;

  @ApiProperty({ example: 'code-analysis-agent', description: 'Nombre del repositorio' })
  @Transform(({ value }: { value: unknown }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9._-]+$/)
  name!: string;
}
