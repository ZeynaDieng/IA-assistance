import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import * as express from 'express'
import { join } from 'path'
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  
  // Security headers with Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false, // Allow embedding for PWA
  }))
  
  // Global prefix
  app.setGlobalPrefix('api')
  
          // CORS - Allow multiple origins for development
          const isDevelopment = process.env.NODE_ENV !== 'production'
          
          app.enableCors({
            origin: (origin, callback) => {
              // Allow requests with no origin (mobile apps, curl, Postman, etc.)
              if (!origin) return callback(null, true)
              
              // In development, allow all localhost origins
              if (isDevelopment) {
                if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
                  return callback(null, true)
                }
              }
              
              // In production, check against allowed origins
              const allowedOrigins = [
                process.env.FRONTEND_URL,
                process.env.CORS_ORIGIN
              ].filter(Boolean)
              
              if (allowedOrigins.includes(origin)) {
                callback(null, true)
              } else {
                console.warn(`CORS: Blocked origin ${origin}`)
                callback(new Error('Not allowed by CORS'))
              }
            },
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
          })
  
  // Serve static files (for audio uploads)
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')))
  
  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )
  
  // Health check endpoint
  app.getHttpAdapter().get('/', (req: any, res: any) => {
    res.json({
      status: 'ok',
      message: 'Zeii Backend API',
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth',
        users: '/api/users',
        audio: '/api/audio',
        ai: '/api/ai',
        tasks: '/api/tasks',
        planning: '/api/planning',
        calendar: '/api/calendar',
        notifications: '/api/notifications',
        metrics: '/api/metrics'
      }
    })
  })

  // Metrics endpoint for Prometheus
  app.getHttpAdapter().get('/metrics', async (req: any, res: any) => {
    try {
      const { MetricsService } = await import('./common/metrics/metrics.service')
      const metricsService = app.get(MetricsService)
      const metrics = await metricsService.getMetrics()
      res.set('Content-Type', 'text/plain')
      res.send(metrics)
    } catch (error) {
      console.error('Failed to get metrics:', error)
      res.status(500).json({ error: 'Failed to get metrics' })
    }
  })

  const port = process.env.PORT || 3000
  
  try {
    await app.listen(port)
    console.log(`🚀 Backend running on http://localhost:${port}`)
    console.log(`📋 API Documentation: http://localhost:${port}/api`)
    console.log(`✅ Health check: http://localhost:${port}/`)
  } catch (error: any) {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} is already in use.`)
      console.error(`   Please stop the other process or use a different port:`)
      console.error(`   PORT=3001 npm run start:dev`)
      console.error(`\n   Or kill the process using port ${port}:`)
      console.error(`   lsof -ti:${port} | xargs kill -9`)
      process.exit(1)
    }
    throw error
  }
}
bootstrap()

