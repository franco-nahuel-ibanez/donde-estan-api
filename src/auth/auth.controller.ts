import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}  

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('verify-account')
  codeVerification(@Body() {email, code}: { code: string, email: string }) {
    console.log("LLegue al controlador")
    console.log(email, code)
    return this.authService.verifyAccount(email, code);
  }

  @Post('accept-terms-and-conditions')
  acceptTermsAndConditions(@Body() { email, accept }: { email: string, accept: boolean}) {
    console.log("LLegue al controlador")
    return this.authService.acceptTermsAndConditions(email, accept);
  }

  @Post('login')
  login(@Body() { email, password }: { email: string; password: string }) {
    return this.authService.login(email, password);
  }

  @Post('forgot-password')
  forgotPassword(@Body() { email }: { email: string }) {
    console.log("LLegue al controlador")
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  resetPassword(@Body() { email, password, code }: { email: string; password: string; code: string }) {
    return this.authService.resetPassword(email, password, code);
  }

  @Get('profile')
  async profile() {
    const res = await fetch('https://sisfet-blockchain.educacion.gob.ar/SelladorFederalTitulos.sol')
      console.log(res)
      
      if (!res.ok) {
        throw new Error('No se pudo obtener el archivo');
      }
      
      const file = await res.text();
      console.log(file);


    // console.log(image)

    return file
  }

}
