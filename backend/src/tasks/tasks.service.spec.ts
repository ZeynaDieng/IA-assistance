import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { TasksService } from './tasks.service'
import { PrismaService } from '../prisma/prisma.service'

jest.mock('../prisma/prisma.service')

describe('TasksService', () => {
  let service: TasksService
  let prismaService: PrismaService

  const mockPrismaService = {
    task: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    reminder: {
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    service = module.get<TasksService>(TasksService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    it('should return paginated tasks', async () => {
      const userId = 'user-123'
      const mockTasks = [
        { id: 'task-1', title: 'Task 1', userId },
        { id: 'task-2', title: 'Task 2', userId },
      ]

      mockPrismaService.task.findMany.mockResolvedValue(mockTasks)
      mockPrismaService.task.count.mockResolvedValue(2)

      const result = await service.findAll(userId, {}, 1, 20)

      expect(result.data).toEqual(mockTasks)
      expect(result.meta.total).toBe(2)
      expect(result.meta.page).toBe(1)
      expect(result.meta.limit).toBe(20)
    })

    it('should filter tasks by date', async () => {
      const userId = 'user-123'
      const date = new Date('2024-01-15')

      mockPrismaService.task.findMany.mockResolvedValue([])
      mockPrismaService.task.count.mockResolvedValue(0)

      await service.findAll(userId, { date }, 1, 20)

      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId,
            scheduledAt: expect.objectContaining({
              gte: expect.any(Date),
              lte: expect.any(Date),
            }),
          }),
        })
      )
    })
  })

  describe('findOne', () => {
    it('should return a task', async () => {
      const taskId = 'task-123'
      const userId = 'user-123'
      const mockTask = { id: taskId, title: 'Test Task', userId }

      mockPrismaService.task.findFirst.mockResolvedValue(mockTask)

      const result = await service.findOne(taskId, userId)

      expect(result).toEqual(mockTask)
    })

    it('should throw NotFoundException if task not found', async () => {
      mockPrismaService.task.findFirst.mockResolvedValue(null)

      await expect(service.findOne('invalid-id', 'user-123')).rejects.toThrow(
        NotFoundException
      )
    })
  })

  describe('complete', () => {
    it('should mark task as completed', async () => {
      const taskId = 'task-123'
      const userId = 'user-123'
      const mockTask = { id: taskId, title: 'Test Task', userId }

      mockPrismaService.task.findFirst.mockResolvedValue(mockTask)
      mockPrismaService.task.update.mockResolvedValue({
        ...mockTask,
        status: 'COMPLETED',
        completedAt: new Date(),
      })

      const result = await service.complete(taskId, userId)

      expect(result.status).toBe('COMPLETED')
      expect(mockPrismaService.reminder.updateMany).toHaveBeenCalled()
    })
  })
})

