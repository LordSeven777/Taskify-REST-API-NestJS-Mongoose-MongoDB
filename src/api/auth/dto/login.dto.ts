import { IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty({
    message: 'The email must not be empty',
  })
  email: string;

  @IsNotEmpty({
    message: 'The password must not be empty',
  })
  password: string;
}
