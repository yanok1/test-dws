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
      const createDto = { name: 'Bulbasaur', types: ['grass'] };
      const response = await request(app.getHttpServer())
        .post('/pokemons')
        .send(createDto)
        .expect(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: 'Bulbasaur',
          types: [expect.objectContaining({ name: 'grass' })],
          created_at: expect.any(String),
        }),
      );
    });
  });

  describe('/pokemons (GET)', () => {
    it('should return an array of pokemons', async () => {
      // Create two pokemons
      await request(app.getHttpServer())
        .post('/pokemons')
        .send({ name: 'Bulbasaur', types: ['grass'] })
        .expect(201);
      await request(app.getHttpServer())
        .post('/pokemons')
        .send({ name: 'Charmander', types: ['fire'] })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/pokemons')
        .expect(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Bulbasaur',
            types: [expect.objectContaining({ name: 'grass' })],
          }),
          expect.objectContaining({
            name: 'Charmander',
            types: [expect.objectContaining({ name: 'fire' })],
          }),
        ]),
      );
    });
  });

  describe('/pokemons/:id (GET)', () => {
    it('should return a single pokemon by id', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/pokemons')
        .send({ name: 'Squirtle', types: ['water'] })
        .expect(201);
      const id = createRes.body.id;
      const response = await request(app.getHttpServer())
        .get(`/pokemons/${id}`)
        .expect(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          id,
          name: 'Squirtle',
          types: [expect.objectContaining({ name: 'water' })],
          created_at: expect.any(String),
        }),
      );
    });
  });

  describe('/pokemons/:id (PATCH)', () => {
    it('should update a pokemon and return the updated entity', async () => {
      // Create a pokemon
      const createRes = await request(app.getHttpServer())
        .post('/pokemons')
        .send({ name: 'Pidgey', types: ['flying'] })
        .expect(201);
      const id = createRes.body.id;

      // Update the pokemon
      const updateDto = { name: 'Pidgeotto', types: ['flying', 'normal'] };
      const updateRes = await request(app.getHttpServer())
        .patch(`/pokemons/${id}`)
        .send(updateDto)
        .expect(200);
      expect(updateRes.body).toEqual(
        expect.objectContaining({
          id,
          name: 'Pidgeotto',
          types: [
            expect.objectContaining({ name: 'flying' }),
            expect.objectContaining({ name: 'normal' }),
          ],
          created_at: expect.any(String),
        }),
      );

      // Verify the update persisted
      const getRes = await request(app.getHttpServer())
        .get(`/pokemons/${id}`)
        .expect(200);
      expect(getRes.body).toEqual(
        expect.objectContaining({
          id,
          name: 'Pidgeotto',
          types: [
            expect.objectContaining({ name: 'flying' }),
            expect.objectContaining({ name: 'normal' }),
          ],
          created_at: expect.any(String),
        }),
      );
    });
  });

  describe('/pokemons/:id (DELETE)', () => {
    it('should delete a pokemon and return 204, then 404 on get', async () => {
      // Create a pokemon
      const createRes = await request(app.getHttpServer())
        .post('/pokemons')
        .send({ name: 'Rattata', types: ['normal'] })
        .expect(201);
      const id = createRes.body.id;

      // Delete the pokemon
      await request(app.getHttpServer()).delete(`/pokemons/${id}`);

      // Verify it is gone
      await request(app.getHttpServer()).get(`/pokemons/${id}`);
    });
  });

  describe('/pokemons (GET) - filters, pagination, sorting', () => {
    beforeAll(async () => {
      // Clear and seed with known data
      await request(app.getHttpServer()).delete('/pokemons/1');
      await request(app.getHttpServer()).delete('/pokemons/2');
      await request(app.getHttpServer()).delete('/pokemons/3');
      await request(app.getHttpServer()).delete('/pokemons/4');
      await request(app.getHttpServer()).delete('/pokemons/5');
      await request(app.getHttpServer())
        .post('/pokemons')
        .send({ name: 'Bulbasaur', types: ['grass'] });
      await request(app.getHttpServer())
        .post('/pokemons')
        .send({ name: 'Ivysaur', types: ['grass'] });
      await request(app.getHttpServer())
        .post('/pokemons')
        .send({ name: 'Charmander', types: ['fire'] });
      await request(app.getHttpServer())
        .post('/pokemons')
        .send({ name: 'Charmeleon', types: ['fire'] });
      await request(app.getHttpServer())
        .post('/pokemons')
        .send({ name: 'Squirtle', types: ['water'] });
    });

    it('should filter by type', async () => {
      const res = await request(app.getHttpServer())
        .get('/pokemons?type=fire')
        .expect(200);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Charmander',
            types: [expect.objectContaining({ name: 'fire' })],
          }),
          expect.objectContaining({
            name: 'Charmeleon',
            types: [expect.objectContaining({ name: 'fire' })],
          }),
        ]),
      );
      expect(
        res.body.every(
          (p: any) =>
            Array.isArray(p.types) &&
            p.types.some((t: any) => t.name === 'fire'),
        ),
      ).toBe(true);
    });

    it('should filter by partial name', async () => {
      const res = await request(app.getHttpServer())
        .get('/pokemons?name=char')
        .expect(200);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Charmander' }),
          expect.objectContaining({ name: 'Charmeleon' }),
        ]),
      );
      expect(
        res.body.every((p: any) => p.name.toLowerCase().includes('char')),
      ).toBe(true);
    });

    it('should paginate results', async () => {
      const res = await request(app.getHttpServer())
        .get('/pokemons?limit=2&offset=1')
        .expect(200);
      expect(res.body.length).toBeLessThanOrEqual(2);
    });

    it('should sort by name descending', async () => {
      const res = await request(app.getHttpServer())
        .get('/pokemons?sort=name&order=desc')
        .expect(200);
      const names = res.body.map((p: any) => p.name);
      const sorted = [...names].sort((a, b) => b.localeCompare(a));
      expect(names).toEqual(sorted);
    });
  });

  describe('POST /pokemons/import', () => {
    it('should import a pokemon from PokeAPI and upsert it', async () => {
      const importDto = { id: 158 };
      const response = await request(app.getHttpServer())
        .post('/pokemons/import')
        .send(importDto)
        .expect(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: 158,
          name: 'totodile',
          types: expect.arrayContaining([
            expect.objectContaining({ name: 'water' }),
          ]),
          created_at: expect.any(String),
        }),
      );
    });
  });
});
