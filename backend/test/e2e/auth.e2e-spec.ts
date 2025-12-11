import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../../src/app.module'

describe('Auth (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('/api/auth/register (POST)', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          phoneNumber: '+221771234567',
          pinHash: 'hashed-pin',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('token')
          expect(res.body).toHaveProperty('user')
        })
    })

    it('should return 409 if user already exists', async () => {
      // First registration
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          phoneNumber: '+221771234568',
          pinHash: 'hashed-pin',
        })

      // Second registration with same phone number
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          phoneNumber: '+221771234568',
          pinHash: 'hashed-pin',
        })
        .expect(409)
    })
  })

  describe('/api/auth/login (POST)', () => {
    it('should login with correct credentials', async () => {
      // Register first
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          phoneNumber: '+221771234569',
          pinHash: 'hashed-pin',
        })

      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          phoneNumber: '+221771234569',
          pin: '1234',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('token')
          expect(res.body).toHaveProperty('user')
        })
    })

    it('should return 401 with incorrect credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          phoneNumber: '+221771234570',
          pin: 'wrong-pin',
        })
        .expect(401)
    })
  })
})

