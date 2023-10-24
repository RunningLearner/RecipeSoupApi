import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as fs from 'fs';
import * as path from 'path';
import * as jwt from 'jsonwebtoken';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let fakeToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('게시글 생성', () => {
    const filePath1 = path.resolve(__dirname, './test-assets/testImage.jpeg');
    const filePath2 = path.resolve(__dirname, './test-assets/testFile.pdf');
    const user = { email: 'test@test.com' };
    fakeToken = jwt.sign(user, process.env.JWT_SECRET);

    const menues = [
      {
        id: 0,
        menuName: 'Test Menu',
        isProductUsed: true,
        productName: 'Test Product',
        productBrand: 'Test Brand',
      },
      // ... other menu items
    ];

    return request(app.getHttpServer())
      .post('/boards/diet')
      .set('authorization', `Bearer ${fakeToken}`)
      .field('date', '2021-12-12') // 별도의 필드로 추가
      .field('institute', 'Test Institute')
      .field('peopleNum', '5')
      .field('price', '10000')
      .field('explanation', 'This is a test')
      .field('whichSchool', 'Test School')
      .field('menues', JSON.stringify(menues))
      .attach('recipeImg', fs.readFileSync(filePath1), 'testImage.jpeg')
      .attach('recipeFile', fs.readFileSync(filePath2), 'testFile.pdf')
      .expect(201)
      .then((response) => {
        expect(response.body).toBeDefined();
        // 여기에 추가적으로 응답 데이터에 대한 검증 로직을 넣을 수 있습니다.
      });
  });
});
