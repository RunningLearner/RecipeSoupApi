import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { NaverAuthGuard } from './gurads/naver-auth.guard';
import { KakaoAuthGuard } from './gurads/kakao-auth.guard';
import { CustomLoggerDecorator } from 'src/common/decorators/custom-logger.decorator';
import { WINSTON_MODULE_PROVIDER, WinstonLogger } from 'nest-winston';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(NaverAuthGuard) // 여기에서 'naver'는 NaverStrategy의 이름과 일치해야 합니다.
  @Get('login/naver')
  @CustomLoggerDecorator()
  async naverLogin() {
    // 함수 본문은 실행되지 않습니다. Guard에 의해 Naver 로그인 페이지로 리다이렉트됩니다.
  }

  @UseGuards(NaverAuthGuard)
  @Get('login/naver/callback')
  @CustomLoggerDecorator()
  async naverLoginCallback(@Req() req, @Res() res) {
    // 사용자 정보는 req.user에 저장됩니다.
    // 로그인 처리를 여기에서 합니다.
    console.log('naverlogincallback called!');
    const accessToken = await this.authService.OAuthLogin(req);
    // cookie 메서드를 사용할 수 있습니다.
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      // secure: true,
    });

    res.redirect(`${process.env.DOMAIN}/home`);
  }

  @UseGuards(KakaoAuthGuard) // 여기에서 'naver'는 NaverStrategy의 이름과 일치해야 합니다.
  @Get('login/kakao')
  @CustomLoggerDecorator()
  async kakaoLogin() {
    // 함수 본문은 실행되지 않습니다. Guard에 의해 Naver 로그인 페이지로 리다이렉트됩니다.
  }

  @UseGuards(KakaoAuthGuard)
  @Get('login/kakao/callback')
  @CustomLoggerDecorator()
  async kakaoLoginCallback(@Req() req, @Res() res) {
    // 사용자 정보는 req.user에 저장됩니다.
    // 로그인 처리를 여기에서 합니다.
    console.log('kakaologincallback called!');
    const accessToken = await this.authService.OAuthLogin(req);
    // cookie 메서드를 사용할 수 있습니다.
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      // secure: true,
    });

    res.redirect(`${process.env.DOMAIN}/home`);
  }

  @Get('logout')
  @CustomLoggerDecorator()
  async logout(@Res() res) {
    res.clearCookie('access_token'); // JWT 쿠키 제거
    res.status(HttpStatus.OK).json({ isLogIn: false });
  }
}
