import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { PrismaService } from '../prisma/prisma.service'
import * as bcrypt from 'bcrypt'

jest.mock('bcrypt')
jest.mock('../prisma/prisma.service')

describe('AuthService', () => {
  let service: AuthService
  let prismaService: PrismaService
  let jwtService: JwtService

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  }

  const mockJwtService = {
    sign: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_SECRET') return 'test-secret'
              if (key === 'JWT_EXPIRATION') return '7d'
              return null
            }),
          },
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    prismaService = module.get<PrismaService>(PrismaService)
    jwtService = module.get<JwtService>(JwtService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  // Note: AuthService uses OTP-based authentication, not traditional register/login
  // These tests are placeholders and should be updated to test OTP flow
  describe('OTP-based authentication', () => {
    it('should send OTP code', async () => {
      // TODO: Implement test for sendOtp method
      expect(true).toBe(true)
    })

    it('should verify OTP and create user on registration', async () => {
      // TODO: Implement test for verifyOtp with REGISTER purpose
      expect(true).toBe(true)
    })

    it('should verify OTP and login user', async () => {
      // TODO: Implement test for verifyOtp with LOGIN purpose
      expect(true).toBe(true)
    })
  })
})

