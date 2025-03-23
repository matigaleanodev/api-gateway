import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  mail: string;

  @IsString()
  @IsNotEmpty()
  massage: string;

  @IsString()
  @IsNotEmpty()
  postId: string;
}
