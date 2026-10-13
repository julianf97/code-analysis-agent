import { ApiProperty } from '@nestjs/swagger';

export class RepositoryResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'github' })
  provider!: string;

  @ApiProperty({ example: 'julianf97' })
  owner!: string;

  @ApiProperty({ example: 'code-analysis-agent' })
  name!: string;

  @ApiProperty({ format: 'date-time' })
  createdAt!: Date;
}

export class RepositoryDataResponseDto {
  @ApiProperty({ type: () => RepositoryResponseDto })
  data!: RepositoryResponseDto;
}

export class RepositoriesDataResponseDto {
  @ApiProperty({ type: () => [RepositoryResponseDto] })
  data!: RepositoryResponseDto[];
}
