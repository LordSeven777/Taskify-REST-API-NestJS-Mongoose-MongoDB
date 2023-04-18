import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsISO8601,
  IsBoolean,
  IsMongoId,
  IsArray,
  Validate,
} from 'class-validator';
import { LabelsExist } from '../validator';

@Injectable()
export class CreateTaskDTO {
  @MaxLength(50, {
    message: 'The task name must exceed 50 charactrers',
  })
  @IsNotEmpty({
    message: 'The task name is required',
  })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsOptional()
  @Transform(({ value }) => value?.trim())
  description: string;

  @IsString({ each: true })
  @IsNotEmpty({ each: true, message: 'A check list item must not be empty' })
  @IsArray({
    message: 'The check list must be an array of check list items',
  })
  @IsOptional()
  checkList: string[];

  @IsISO8601(undefined, {
    message: 'The starting time must be in the ISO8601 format',
  })
  @IsNotEmpty({
    message: 'The starting time is required',
  })
  @Transform(({ value }) => value?.trim())
  startsAt: string;

  @IsISO8601(undefined, {
    message: 'The ending time must be in the ISO8601 format',
  })
  @IsNotEmpty({
    message: 'The ending time is required',
  })
  @Transform(({ value }) => value?.trim())
  endsAt: string;

  @IsBoolean({
    message: 'The completion status must be a boolean',
  })
  @IsOptional()
  isCompleted: boolean;

  @Validate(LabelsExist)
  @IsMongoId({
    each: true,
    message: 'A label id is does not match the Mongo Id format',
  })
  @IsArray({
    message: 'The labels must be an array of label object ids',
  })
  @IsOptional()
  @Transform(({ value }) => {
    return Array.isArray(value) ? [...new Set(value)] : value;
  })
  labels: string[];
}
