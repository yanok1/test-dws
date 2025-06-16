import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

describe('PokemonsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/pokemons (POST)', () => {
    it('should create a new pokemon and return it', async () => {
      const createDto = { name: 'Bulbasaur', type: 'grass' };
      const response = await request(app.getHttpServer())
        .post('/pokemons')
        .send(createDto)
        .expect(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: 'Bulbasaur',
          type: 'grass',
          created_at: expect.any(String),
        })
      );
    });
  });
}); 