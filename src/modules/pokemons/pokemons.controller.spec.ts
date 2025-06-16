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

  describe('/pokemons (GET)', () => {
    it('should return an array of pokemons', async () => {
      // Create two pokemons
      const bulbasaur = await request(app.getHttpServer())
        .post('/pokemons')
        .send({ name: 'Bulbasaur', type: 'grass' })
        .expect(201);
      const charmander = await request(app.getHttpServer())
        .post('/pokemons')
        .send({ name: 'Charmander', type: 'fire' })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/pokemons')
        .expect(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Bulbasaur', type: 'grass' }),
          expect.objectContaining({ name: 'Charmander', type: 'fire' }),
        ])
      );
    });
  });

  describe('/pokemons/:id (GET)', () => {
    it('should return a single pokemon by id', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/pokemons')
        .send({ name: 'Squirtle', type: 'water' })
        .expect(201);
      const id = createRes.body.id;
      const response = await request(app.getHttpServer())
        .get(`/pokemons/${id}`)
        .expect(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          id,
          name: 'Squirtle',
          type: 'water',
          created_at: expect.any(String),
        })
      );
    });
  });
}); 