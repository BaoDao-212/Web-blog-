import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class StoredFile {
  @ApiProperty({ description: 'file Url' })
  @IsString()
  @IsOptional()
  fileUrl: string;

  @ApiProperty({ description: 'file Path' })
  @IsString()
  @IsOptional()
  filePath: string;
}
