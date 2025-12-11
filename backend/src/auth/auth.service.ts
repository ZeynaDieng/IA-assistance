import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { OtpPurpose } from './dto/send-otp.dto'

@Injectable()
export class AuthService {
  private readonly OTP_EXPIRATION_MINUTES = 3 // Réduit à 3 minutes pour plus de sécurité
  private readonly OTP_LENGTH = 6
  // Rate limiting in-memory (en production, utiliser Redis pour la scalabilité)
  private readonly otpAttempts = new Map<string, { count: number; lastAttempt: Date }>()
  private readonly MAX_OTP_ATTEMPTS_PER_HOUR = 5 // Maximum 5 demandes d'OTP par heure par numéro
  private readonly MAX_VERIFY_ATTEMPTS = 3 // Maximum 3 tentatives de vérification par OTP

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  /**
   * Generate a random OTP code (6 digits)
   */
  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  /**
   * Check rate limiting for OTP requests
   */
  private checkRateLimit(phoneNumber: string): void {
    const key = `otp:${phoneNumber}`
    const attempt = this.otpAttempts.get(key)
    const now = new Date()
    
    if (attempt) {
      const timeDiff = now.getTime() - attempt.lastAttempt.getTime()
      const oneHour = 60 * 60 * 1000
      
      // Reset count if more than 1 hour has passed
      if (timeDiff > oneHour) {
        this.otpAttempts.set(key, { count: 1, lastAttempt: now })
        return
      }
      
      // Check if limit exceeded
      if (attempt.count >= this.MAX_OTP_ATTEMPTS_PER_HOUR) {
        const remainingMinutes = Math.ceil((oneHour - timeDiff) / (60 * 1000))
        throw new BadRequestException(
          `Trop de tentatives. Veuillez réessayer dans ${remainingMinutes} minute(s).`
        )
      }
      
      // Increment count
      attempt.count++
      attempt.lastAttempt = now
    } else {
      // First attempt
      this.otpAttempts.set(key, { count: 1, lastAttempt: now })
    }
  }

  /**
   * Send OTP to user (generate and store)
   */
  async sendOtp(phoneNumber: string, purpose: OtpPurpose = OtpPurpose.REGISTER) {
    // Rate limiting check
    this.checkRateLimit(phoneNumber)
    
    // For REGISTER, check if user already exists
    if (purpose === OtpPurpose.REGISTER) {
      const existingUser = await this.prisma.user.findUnique({
        where: { phoneNumber }
      })
      if (existingUser) {
        throw new ConflictException('Phone number already registered')
      }
    }

    // For LOGIN, check if user exists
    if (purpose === OtpPurpose.LOGIN) {
      const existingUser = await this.prisma.user.findUnique({
        where: { phoneNumber }
      })
      if (!existingUser) {
        throw new NotFoundException('Phone number not registered')
      }
    }

    // Invalidate all previous unverified OTPs for this phone number and purpose
    await this.prisma.otp.updateMany({
      where: {
        phoneNumber,
        purpose,
        verified: false
      },
      data: {
        verified: true // Mark as "used" (invalidated)
      }
    })

    // Generate new OTP
    const code = this.generateOtpCode()
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRATION_MINUTES)

    // Store OTP
    const otp = await this.prisma.otp.create({
      data: {
        phoneNumber,
        code,
        expiresAt,
        purpose
      }
    })

    // OTP mode gratuit : le code est toujours retourné dans la réponse
    // Pas d'envoi SMS (économie de coûts)
    // L'utilisateur reçoit l'OTP dans la réponse API et l'UI l'affiche
    // Sécurité améliorée : expiration réduite (3 min) + rate limiting
    console.log(`[OTP] Code for ${phoneNumber} (${purpose}): ${code} - Expires in ${this.OTP_EXPIRATION_MINUTES} minutes`)
    
    return {
      success: true,
      message: `Code généré avec succès. Expire dans ${this.OTP_EXPIRATION_MINUTES} minutes.`,
      otp: code, // Toujours retourné pour un accès gratuit et facile
      expiresIn: this.OTP_EXPIRATION_MINUTES * 60 // en secondes
    }
  }

  /**
   * Verify OTP for registration
   */
  async verifyOtpRegister(phoneNumber: string, otp: string, firstName: string, lastName: string) {
    // Rate limiting for verification attempts
    const verifyKey = `verify:${phoneNumber}:${otp}`
    const verifyAttempt = this.otpAttempts.get(verifyKey)
    
    if (verifyAttempt && verifyAttempt.count >= this.MAX_VERIFY_ATTEMPTS) {
      throw new UnauthorizedException(
        'Trop de tentatives de vérification. Veuillez demander un nouveau code.'
      )
    }
    
    // Find valid OTP
    const otpRecord = await this.prisma.otp.findFirst({
      where: {
        phoneNumber,
        code: otp,
        purpose: OtpPurpose.REGISTER,
        verified: false,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!otpRecord) {
      // Increment failed verification attempts
      if (!verifyAttempt) {
        this.otpAttempts.set(verifyKey, { count: 1, lastAttempt: new Date() })
      } else {
        verifyAttempt.count++
        verifyAttempt.lastAttempt = new Date()
      }
      
      throw new UnauthorizedException('Code invalide ou expiré. Veuillez réessayer.')
    }
    
    // Reset verification attempts on success
    this.otpAttempts.delete(verifyKey)

    // Check if user already exists (double check)
    const existingUser = await this.prisma.user.findUnique({
      where: { phoneNumber }
    })
    if (existingUser) {
      throw new ConflictException('Phone number already registered')
    }

    // Mark OTP as verified
    await this.prisma.otp.update({
      where: { id: otpRecord.id },
      data: { verified: true }
    })

    // Create user (sans PIN pour l'instant)
    const user = await this.prisma.user.create({
      data: {
        phoneNumber,
        firstName,
        lastName
        // pinHash: null // Optionnel, commenté temporairement - pas besoin d'inclure si optionnel
      },
      select: {
        id: true,
        phoneNumber: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Link OTP to user
    await this.prisma.otp.update({
      where: { id: otpRecord.id },
      data: { userId: user.id }
    })

    // Generate JWT token
    const token = await this.generateJWT(user.id)

    return {
      user,
      token
    }
  }

  /**
   * Verify OTP for login
   */
  async verifyOtpLogin(phoneNumber: string, otp: string) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber }
    })

    if (!user) {
      throw new NotFoundException('Phone number not registered')
    }

    // Rate limiting for verification attempts
    const verifyKey = `verify:${phoneNumber}:${otp}`
    const verifyAttempt = this.otpAttempts.get(verifyKey)
    
    if (verifyAttempt && verifyAttempt.count >= this.MAX_VERIFY_ATTEMPTS) {
      throw new UnauthorizedException(
        'Trop de tentatives de vérification. Veuillez demander un nouveau code.'
      )
    }

    // Find valid OTP
    const otpRecord = await this.prisma.otp.findFirst({
      where: {
        phoneNumber,
        code: otp,
        purpose: OtpPurpose.LOGIN,
        verified: false,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!otpRecord) {
      // Increment failed verification attempts
      if (!verifyAttempt) {
        this.otpAttempts.set(verifyKey, { count: 1, lastAttempt: new Date() })
      } else {
        verifyAttempt.count++
        verifyAttempt.lastAttempt = new Date()
      }
      
      throw new UnauthorizedException('Code invalide ou expiré. Veuillez réessayer.')
    }
    
    // Reset verification attempts on success
    this.otpAttempts.delete(verifyKey)

    // Mark OTP as verified
    await this.prisma.otp.update({
      where: { id: otpRecord.id },
      data: { verified: true, userId: user.id }
    })

    // Generate JWT token
    const token = await this.generateJWT(user.id)

    return {
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    }
  }

  /**
   * Hash a PIN using bcrypt (COMMENTED - Not used for now)
   */
  // async hashPin(pin: string): Promise<string> {
  //   const saltRounds = 10
  //   return bcrypt.hash(pin, saltRounds)
  // }

  /**
   * Verify a PIN against its hash (COMMENTED - Not used for now)
   */
  // async verifyPin(pin: string, hash: string): Promise<boolean> {
  //   return bcrypt.compare(pin, hash)
  // }

  /**
   * Generate JWT token for a user
   */
  async generateJWT(userId: string): Promise<string> {
    const payload = { sub: userId }
    return this.jwtService.signAsync(payload)
  }

  /**
   * Register a new user (COMMENTED - Using OTP instead)
   */
  // async register(phoneNumber: string, pin: string) {
  //   // ... old code commented
  // }

  /**
   * Login existing user (COMMENTED - Using OTP instead)
   */
  // async login(phoneNumber: string, pin: string) {
  //   // ... old code commented
  // }

  /**
   * Get user by ID (for JWT strategy)
   */
  async findUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phoneNumber: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }
}

