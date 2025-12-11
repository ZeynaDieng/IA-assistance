import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { GptService } from "../ai/gpt.service";
import { NotificationsService } from "../notifications/notifications.service";
import { RoutinesService } from "../routines/routines.service";
import { UserPreferencesService } from "../users/user-preferences.service";

interface TaskInput {
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  duration: number;
  deadline?: Date;
  suggestedTime?: string;
  category?: string;
  dependsOn?: string;
  requiresFocus?: boolean;
  location?: string;
  energyLevel?: "LOW" | "MEDIUM" | "HIGH";
}

interface PlannedTask {
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  duration: number;
  scheduledAt: Date;
  deadline?: Date;
}

@Injectable()
export class PlanningService {
  private readonly DEFAULT_WORK_START_HOUR = 8; // 08:00
  private readonly DEFAULT_WORK_END_HOUR = 20; // 20:00

  constructor(
    private prisma: PrismaService,
    private gptService: GptService,
    private notificationsService: NotificationsService,
    private userPreferencesService: UserPreferencesService,
    @Inject(forwardRef(() => RoutinesService))
    private routinesService: RoutinesService
  ) {}

  /**
   * Sort tasks by priority (URGENT > HIGH > MEDIUM > LOW)
   */
  private sortTasksByPriority(tasks: TaskInput[]): TaskInput[] {
    const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    return [...tasks].sort(
      (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
    );
  }

  /**
   * Parse time string (HH:MM) to hours and minutes
   */
  private parseTime(timeStr: string): { hour: number; minute: number } {
    const [hour, minute] = timeStr.split(':').map(Number);
    return { hour: hour || 0, minute: minute || 0 };
  }

  /**
   * Check if time slot is available (not during lunch, within work hours)
   */
  private isTimeSlotAvailable(
    hour: number,
    minute: number,
    workStartHour: number,
    workEndHour: number,
    lunchStartHour?: number,
    lunchEndHour?: number,
    lunchBreakEnabled: boolean = true
  ): boolean {
    // Validate hour and minute values
    if (
      isNaN(hour) ||
      isNaN(minute) ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      console.warn(
        `[PlanningService] Invalid time values: hour=${hour}, minute=${minute}`
      );
      return false;
    }

    const totalMinutes = hour * 60 + minute;
    const workStartMinutes = workStartHour * 60;
    const workEndMinutes = workEndHour * 60;

    if (totalMinutes < workStartMinutes || totalMinutes >= workEndMinutes) {
      return false;
    }

    // Check lunch break if enabled
    if (lunchBreakEnabled && lunchStartHour !== undefined && lunchEndHour !== undefined) {
      const lunchStartMinutes = lunchStartHour * 60;
      const lunchEndMinutes = lunchEndHour * 60;
      if (totalMinutes >= lunchStartMinutes && totalMinutes < lunchEndMinutes) {
        return false;
      }
    }

    return true;
  }

  /**
   * Calculate next available time slot
   * Returns null if no slot available instead of throwing
   */
  private calculateNextAvailableTime(
    currentTime: Date,
    duration: number,
    workStartHour: number,
    workEndHour: number,
    lunchStartHour?: number,
    lunchEndHour?: number,
    lunchBreakEnabled: boolean = true,
    bufferMinutes: number = 15
  ): Date | null {
    // Validate inputs
    if (!(currentTime instanceof Date) || isNaN(currentTime.getTime())) {
      console.error(
        "[PlanningService] Invalid currentTime in calculateNextAvailableTime"
      );
      return null;
    }

    if (isNaN(duration) || duration <= 0 || duration > 1440) {
      console.error(
        `[PlanningService] Invalid duration in calculateNextAvailableTime: ${duration} (must be between 1 and 1440 minutes)`
      );
      return null;
    }

    let nextTime = new Date(currentTime);
    const maxIterations = 1000; // Safety limit
    let iterations = 0;

    while (iterations < maxIterations) {
      const hour = nextTime.getHours();
      const minute = nextTime.getMinutes();

      // Check if current time is available
      if (this.isTimeSlotAvailable(hour, minute, workStartHour, workEndHour, lunchStartHour, lunchEndHour, lunchBreakEnabled)) {
        // Check if task fits in current slot
        const endTime = new Date(nextTime);
        endTime.setMinutes(endTime.getMinutes() + duration);

        const endHour = endTime.getHours();
        const endMinute = endTime.getMinutes();

        // Check if end time is within work hours and available
        if (
          endHour < workEndHour &&
          this.isTimeSlotAvailable(endHour, endMinute, workStartHour, workEndHour, lunchStartHour, lunchEndHour, lunchBreakEnabled)
        ) {
          return nextTime;
        }
      }

      // Move to next slot based on buffer (minimum 5 minutes)
      nextTime.setMinutes(nextTime.getMinutes() + Math.max(5, Math.floor(bufferMinutes / 3)));

      // If past work hours, return null
      if (nextTime.getHours() >= workEndHour) {
        return null;
      }

      iterations++;
    }

    console.warn(
      `[PlanningService] calculateNextAvailableTime exceeded max iterations (${maxIterations})`
    );
    return null; // Safety fallback
  }

  /**
   * Resolve task dependencies - ensures dependent tasks come after their dependencies
   */
  private resolveDependencies(tasks: TaskInput[]): TaskInput[] {
    const taskMap = new Map<string, TaskInput>();
    tasks.forEach((task) => taskMap.set(task.title, task));

    // Build dependency graph
    const sorted: TaskInput[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (task: TaskInput) => {
      if (visiting.has(task.title)) {
        console.warn(
          `[PlanningService] Circular dependency detected for task: ${task.title}`
        );
        return;
      }
      if (visited.has(task.title)) {
        return;
      }

      visiting.add(task.title);

      // Visit dependencies first
      if (task.dependsOn) {
        const dependency = taskMap.get(task.dependsOn);
        if (dependency) {
          visit(dependency);
        } else {
          console.warn(
            `[PlanningService] Dependency "${task.dependsOn}" not found for task "${task.title}"`
          );
        }
      }

      visiting.delete(task.title);
      visited.add(task.title);
      sorted.push(task);
    };

    tasks.forEach((task) => {
      if (!visited.has(task.title)) {
        visit(task);
      }
    });

    return sorted;
  }

  /**
   * Group tasks by category for better organization
   */
  private groupTasksByCategory(tasks: TaskInput[]): Map<string, TaskInput[]> {
    const groups = new Map<string, TaskInput[]>();

    tasks.forEach((task) => {
      const category = task.category || "other";
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(task);
    });

    return groups;
  }

  /**
   * Calculate energy score for a time slot (morning = higher, afternoon = lower)
   */
  private getEnergyScoreForTime(date: Date): number {
    const hour = date.getHours();
    // Morning (8-11) = high energy (score 3)
    if (hour >= 8 && hour < 11) return 3;
    // Mid-day (11-14) = medium energy (score 2)
    if (hour >= 11 && hour < 14) return 2;
    // Afternoon (14-17) = medium-low energy (score 1.5)
    if (hour >= 14 && hour < 17) return 1.5;
    // Evening (17-20) = low energy (score 1)
    if (hour >= 17 && hour < 20) return 1;
    return 1;
  }

  /**
   * Convert routine tasks to TaskInput format
   */
  private convertRoutineTasksToTaskInput(routineTasks: any[]): TaskInput[] {
    return routineTasks.map((rt) => ({
      title: rt.title,
      description: rt.description || undefined,
      priority: rt.priority || "MEDIUM",
      duration: rt.duration,
      deadline: rt.scheduledAt ? new Date(rt.scheduledAt) : undefined,
      suggestedTime: rt.scheduledAt
        ? new Date(rt.scheduledAt).toTimeString().slice(0, 5)
        : undefined,
      category: "routine",
      energyLevel: "MEDIUM" as const,
    }));
  }

  /**
   * Generate intelligent planning from tasks and optionally include routines
   */
  async generatePlanning(
    tasks: TaskInput[],
    userId: string,
    targetDate?: Date,
    includeRoutines: boolean = true
  ): Promise<PlannedTask[]> {
    // Load user preferences
    const preferences = await this.userPreferencesService.getOrCreatePreferences(userId);
    
    // Parse work hours from preferences
    const workStartTime = this.parseTime(preferences.workHoursStart || '09:00');
    const workEndTime = this.parseTime(preferences.workHoursEnd || '17:00');
    const workStartHour = workStartTime.hour;
    const workEndHour = workEndTime.hour;
    const preferredTaskDuration = preferences.preferredTaskDuration || 30;
    
    // Parse lunch break
    const lunchStartTime = preferences.lunchBreakStart ? this.parseTime(preferences.lunchBreakStart) : { hour: 12, minute: 0 };
    const lunchEndTime = preferences.lunchBreakEnd ? this.parseTime(preferences.lunchBreakEnd) : { hour: 13, minute: 0 };
    const lunchStartHour = lunchStartTime.hour;
    const lunchEndHour = lunchEndTime.hour;
    const lunchBreakEnabled = preferences.lunchBreakEnabled !== false; // Default true
    
    // Buffer between tasks
    const bufferMinutes = preferences.taskBufferMinutes || 15;
    
    // Work days
    const workDays = preferences.workDays || ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    
    // Category durations
    const categoryDurations = (preferences.categoryDurations as Record<string, number>) || {};
    
    // Advanced preferences
    const maxTasksPerDay = preferences.maxTasksPerDay;
    const allowTaskOverlap = preferences.allowTaskOverlap || false;
    
    console.log(
      `[PlanningService] Using user preferences: workHours=${workStartHour}:00-${workEndHour}:00, workDays=${workDays.join(',')}, preferredDuration=${preferredTaskDuration}min, buffer=${bufferMinutes}min, lunchBreak=${lunchBreakEnabled ? `${lunchStartHour}:00-${lunchEndHour}:00` : 'disabled'}, energyMorning=${preferences.energyMorning}, energyAfternoon=${preferences.energyAfternoon}, energyEvening=${preferences.energyEvening}, maxTasksPerDay=${maxTasksPerDay || 'unlimited'}, allowOverlap=${allowTaskOverlap}`
    );

    // Determine target date first
    let planningDate = targetDate || new Date();
    if (isNaN(planningDate.getTime())) {
      planningDate = new Date();
    }
    // Extract just the date part (without time)
    planningDate.setHours(0, 0, 0, 0);

    // Generate tasks from active routines if requested
    let allTasks = [...tasks];

    if (includeRoutines) {
      try {
        console.log(
          `[PlanningService] Generating tasks from active routines for date: ${planningDate.toISOString().split("T")[0]}`
        );
        const routineTasks =
          await this.routinesService.generateTasksFromRoutines(
            userId,
            planningDate
          );

        if (routineTasks.length > 0) {
          console.log(
            `[PlanningService] Generated ${routineTasks.length} tasks from routines`
          );
          const routineTasksAsInput =
            this.convertRoutineTasksToTaskInput(routineTasks);
          allTasks = [...tasks, ...routineTasksAsInput];
          console.log(
            `[PlanningService] Total tasks for planning: ${allTasks.length} (${tasks.length} punctual + ${routineTasks.length} from routines)`
          );
        } else {
          console.log(
            `[PlanningService] No routine tasks to generate for this date`
          );
        }
      } catch (error: any) {
        console.warn(
          `[PlanningService] Error generating tasks from routines:`,
          error.message
        );
        // Continue with only punctual tasks if routine generation fails
      }
    }

    if (!allTasks || allTasks.length === 0) {
      // If no tasks at all (neither punctual nor from routines), provide helpful error
      if (includeRoutines && tasks.length === 0) {
        // No punctual tasks and no routine tasks generated
        throw new BadRequestException(
          "Aucune tâche à planifier pour cette date. Les routines créées seront actives selon leur fréquence (quotidienne, hebdomadaire, etc.)."
        );
      } else if (includeRoutines) {
        throw new BadRequestException(
          "Aucune tâche à planifier pour cette date. Les routines actives ne génèrent pas de tâches pour cette date spécifique."
        );
      } else {
        throw new BadRequestException("No tasks provided");
      }
    }

    console.log(
      `[PlanningService] Starting intelligent planning for ${allTasks.length} tasks (${tasks.length} punctual${includeRoutines ? ` + routines` : ""})`
    );

    // Apply preferred task duration to tasks without duration
    // Use category-specific duration if available, otherwise use preferredTaskDuration
    allTasks = allTasks.map(task => {
      let taskDuration = task.duration;
      if (!taskDuration) {
        // Try category-specific duration first
        if (task.category && categoryDurations[task.category]) {
          taskDuration = categoryDurations[task.category];
        } else {
          taskDuration = preferredTaskDuration;
        }
      }
      return {
        ...task,
        duration: taskDuration
      };
    });

    // Step 1: Resolve dependencies
    const tasksWithResolvedDeps = this.resolveDependencies(allTasks);
    console.log(
      `[PlanningService] Resolved dependencies, task order:`,
      tasksWithResolvedDeps.map((t) => t.title).join(" → ")
    );

    // Step 2: Sort tasks intelligently
    // PRIORITÉ aux horaires suggérés (pour respecter les horaires définis par l'utilisateur)
    // 1. Tâches avec suggestedTime triées par horaire croissant
    // 2. Tâches sans suggestedTime triées par priorité puis par énergie requise (HIGH first)
    const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    const energyOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };

    let sortedTasks = [...tasksWithResolvedDeps].sort((a, b) => {
      const hasTimeA = !!a.suggestedTime;
      const hasTimeB = !!b.suggestedTime;

      // Si les deux ont un horaire suggéré, trier par horaire croissant
      if (hasTimeA && hasTimeB) {
        try {
          const timeA = a.suggestedTime!.split(":").map(Number);
          const timeB = b.suggestedTime!.split(":").map(Number);
          const minutesA = timeA[0] * 60 + timeA[1];
          const minutesB = timeB[0] * 60 + timeB[1];
          return minutesA - minutesB;
        } catch (error) {
          console.warn(`Error comparing suggestedTimes for sorting:`, error);
          return 0;
        }
      }

      // Tâches avec horaire suggéré avant celles sans
      if (hasTimeA && !hasTimeB) return -1;
      if (!hasTimeA && hasTimeB) return 1;

      // Si aucune n'a d'horaire suggéré, trier par priorité puis par énergie requise
      const priorityDiff =
        priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // If same priority, prefer HIGH energy tasks first (they need better time slots)
      const energyA = energyOrder[a.energyLevel || "MEDIUM"];
      const energyB = energyOrder[b.energyLevel || "MEDIUM"];
      return energyB - energyA;
    });

    const tasksWithTime = sortedTasks.filter((t) => t.suggestedTime).length;
    const tasksWithoutTime = sortedTasks.filter((t) => !t.suggestedTime).length;
    console.log(
      `[PlanningService] Sorted ${sortedTasks.length} tasks: ${tasksWithTime} with suggestedTime (in chronological order), ${tasksWithoutTime} without (sorted by priority)`
    );

    // Detect if multiple tasks have the same suggestedTime (especially 08:00)
    const timeGroups = new Map<string, TaskInput[]>();
    sortedTasks.forEach((task) => {
      if (task.suggestedTime) {
        if (!timeGroups.has(task.suggestedTime)) {
          timeGroups.set(task.suggestedTime, []);
        }
        timeGroups.get(task.suggestedTime)!.push(task);
      }
    });

    // If multiple tasks share the same time (especially 08:00), space them out
    timeGroups.forEach((tasks, time) => {
      if (tasks.length > 1) {
        console.warn(
          `[PlanningService] ⚠️ ${tasks.length} tasks share the same suggestedTime ${time}. Spacing them out automatically.`
        );

        // Space out tasks starting from the suggested time
        tasks.forEach((task, index) => {
          if (index > 0) {
            // Remove suggestedTime for duplicates (keep first one)
            // They will be scheduled sequentially starting from the first task's time
            console.log(
              `[PlanningService] Removing suggestedTime "${time}" from "${task.title}" to avoid overlap (will be scheduled sequentially)`
            );
            task.suggestedTime = undefined;
          }
        });
      }
    });

    // Re-sort after removing duplicate suggestedTimes
    sortedTasks = [...sortedTasks].sort((a, b) => {
      const hasTimeA = !!a.suggestedTime;
      const hasTimeB = !!b.suggestedTime;

      if (hasTimeA && hasTimeB) {
        try {
          const timeA = a.suggestedTime!.split(":").map(Number);
          const timeB = b.suggestedTime!.split(":").map(Number);
          const minutesA = timeA[0] * 60 + timeA[1];
          const minutesB = timeB[0] * 60 + timeB[1];
          return minutesA - minutesB;
        } catch (error) {
          console.warn(`Error comparing suggestedTimes for sorting:`, error);
          return 0;
        }
      }

      if (hasTimeA && !hasTimeB) return -1;
      if (!hasTimeA && hasTimeB) return 1;

      const priorityDiff =
        priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      const energyA = energyOrder[a.energyLevel || "MEDIUM"];
      const energyB = energyOrder[b.energyLevel || "MEDIUM"];
      return energyB - energyA;
    });

    // Log the order for debugging
    if (tasksWithTime > 0) {
      console.log(
        `[PlanningService] Tasks with suggestedTime order (after deduplication):`,
        sortedTasks
          .filter((t) => t.suggestedTime)
          .map((t) => `${t.title} @ ${t.suggestedTime}`)
          .join(", ")
      );
    }

    // Use planningDate (already determined at the start)
    // If no explicit target date was provided, try to infer from task deadlines
    if (!targetDate) {
      const taskDates: Date[] = [];

      for (const task of sortedTasks) {
        if (task.deadline) {
          const deadlineDate = new Date(task.deadline);
          // Only consider deadlines that are valid dates
          if (!isNaN(deadlineDate.getTime())) {
            taskDates.push(deadlineDate);
          }
        }
      }

      // If we have task deadlines, use the earliest one as the target date
      if (taskDates.length > 0) {
        taskDates.sort((a, b) => a.getTime() - b.getTime());
        const earliestDeadline = taskDates[0];
        // Extract just the date part (without time) for planning
        planningDate.setTime(earliestDeadline.getTime());
        planningDate.setHours(0, 0, 0, 0);
        console.log(
          `[PlanningService] Using earliest deadline as target date: ${planningDate.toISOString().split("T")[0]}`
        );
      }
    }

    // Validate date
    if (isNaN(planningDate.getTime())) {
      throw new BadRequestException(`Invalid target date: ${targetDate}`);
    }

    // Start at work start hour (from user preferences)
    // This is only for tasks without suggestedTime - tasks with suggestedTime use their specific time
    let currentTime = new Date(planningDate);
    currentTime.setHours(workStartHour, 0, 0, 0);

    const plannedTasks: PlannedTask[] = [];
    const unplannedTasks: TaskInput[] = [];

    console.log(
      `[PlanningService] Generating planning for ${sortedTasks.length} tasks on ${planningDate.toISOString().split("T")[0]}`
    );

    // Check max tasks per day limit
    if (maxTasksPerDay && sortedTasks.length > maxTasksPerDay) {
      console.warn(
        `[PlanningService] Task limit exceeded: ${sortedTasks.length} tasks requested, max is ${maxTasksPerDay}. Planning first ${maxTasksPerDay} tasks.`
      );
      sortedTasks = sortedTasks.slice(0, maxTasksPerDay);
    }

    for (const task of sortedTasks) {
      // Check for deadline
      if (task.deadline) {
        const deadlineDate = new Date(task.deadline);
        if (deadlineDate < currentTime) {
          // Deadline passed, still schedule it but mark as urgent
          console.warn(
            `Task "${task.title}" has a deadline before available time slots, scheduling anyway`
          );
        }
      }

      let scheduledAt: Date | null = null;

      // PRIORITÉ 1: Use suggested time if provided and valid - RESPECTER L'HORAIRE EXACT
      if (task.suggestedTime) {
        try {
          const timeParts = task.suggestedTime.split(":");
          if (timeParts.length !== 2) {
            console.warn(
              `Invalid suggestedTime format for task "${task.title}": ${task.suggestedTime}, expected HH:mm`
            );
          } else {
            const suggestedHour = parseInt(timeParts[0], 10);
            const suggestedMinute = parseInt(timeParts[1], 10);

            // Validate hour and minute
            if (
              isNaN(suggestedHour) ||
              isNaN(suggestedMinute) ||
              suggestedHour < 0 ||
              suggestedHour > 23 ||
              suggestedMinute < 0 ||
              suggestedMinute > 59
            ) {
              console.warn(
                `Invalid suggestedTime values for task "${task.title}": ${task.suggestedTime} (hour: ${suggestedHour}, minute: ${suggestedMinute})`
              );
            } else {
              const suggestedTimeDate = new Date(planningDate);
              suggestedTimeDate.setHours(suggestedHour, suggestedMinute, 0, 0);

              // Vérifier que l'horaire suggéré est dans les heures de travail
              if (!this.isTimeSlotAvailable(suggestedHour, suggestedMinute, workStartHour, workEndHour, lunchStartHour, lunchEndHour, lunchBreakEnabled)) {
                console.warn(
                  `[PlanningService] Suggested time ${task.suggestedTime} for task "${task.title}" is outside work hours or during lunch break, adjusting to nearest available slot`
                );
                // Si hors heures de travail, ajuster au créneau disponible le plus proche
                // Mais d'abord, essayer de l'utiliser quand même si c'est juste pendant la pause déjeuner
                if (lunchBreakEnabled && suggestedHour >= lunchStartHour && suggestedHour < lunchEndHour) {
                  // Si c'est pendant la pause, décaler après la pause
                  suggestedTimeDate.setHours(lunchEndHour, 0, 0);
                  scheduledAt = suggestedTimeDate;
                  console.log(
                    `[PlanningService] Adjusted suggested time from ${task.suggestedTime} to ${lunchEndHour}:00 for task "${task.title}" (lunch break)`
                  );
                } else {
                  // Pour les autres cas, utiliser calculateNextAvailableTime
                  scheduledAt = null; // Sera calculé plus bas
                }
              } else if (suggestedTimeDate < currentTime) {
                console.warn(
                  `[PlanningService] Suggested time ${task.suggestedTime} for task "${task.title}" is in the past (currentTime: ${currentTime.toTimeString().slice(0, 5)}), using calculated time`
                );
                // Si dans le passé, calculer le prochain créneau disponible
                scheduledAt = null; // Sera calculé plus bas
              } else {
                // Utiliser directement l'horaire suggéré EXACT - PRIORITÉ ABSOLUE
                scheduledAt = suggestedTimeDate;
                console.log(
                  `[PlanningService] ✓ Using EXACT suggested time ${task.suggestedTime} for task "${task.title}" (scheduledAt: ${scheduledAt.toISOString()})`
                );
              }
            }
          }
        } catch (error) {
          console.warn(
            `Error parsing suggestedTime for task "${task.title}": ${task.suggestedTime}`,
            error
          );
        }
      }

      // PRIORITÉ 2: Calculate next available time slot only if no suggestedTime was used
      if (!scheduledAt) {
        // For HIGH energy tasks, try to place them in periods with highest user energy
        if (task.energyLevel === "HIGH" || task.requiresFocus) {
          // Determine best time slot based on user energy preferences
          let bestStartHour = workStartHour;
          let bestEndHour = workStartHour + 3; // Default 3-hour window
          
          // Find period with highest energy
          const energyScores = {
            morning: preferences.energyMorning === "HIGH" ? 3 : preferences.energyMorning === "MEDIUM" ? 2 : 1,
            afternoon: preferences.energyAfternoon === "HIGH" ? 3 : preferences.energyAfternoon === "MEDIUM" ? 2 : 1,
            evening: preferences.energyEvening === "HIGH" ? 3 : preferences.energyEvening === "MEDIUM" ? 2 : 1,
          };
          
          const maxEnergy = Math.max(energyScores.morning, energyScores.afternoon, energyScores.evening);
          
          // Determine best period
          if (energyScores.morning === maxEnergy && currentTime.getHours() < 12) {
            bestStartHour = Math.max(workStartHour, currentTime.getHours());
            bestEndHour = 12;
          } else if (energyScores.afternoon === maxEnergy && currentTime.getHours() < 17) {
            bestStartHour = Math.max(13, currentTime.getHours()); // After lunch
            bestEndHour = 17;
          } else if (energyScores.evening === maxEnergy && currentTime.getHours() < workEndHour) {
            bestStartHour = Math.max(17, currentTime.getHours());
            bestEndHour = workEndHour;
          }

          // Try to schedule in the best energy period
          if (currentTime.getHours() < bestEndHour) {
            const bestSlot = new Date(planningDate);
            bestSlot.setHours(Math.max(bestStartHour, currentTime.getHours()), 0, 0, 0);
            
            const energySlot = this.calculateNextAvailableTime(
              bestSlot,
              task.duration,
              workStartHour,
              workEndHour,
              lunchStartHour,
              lunchEndHour,
              lunchBreakEnabled,
              bufferMinutes
            );

            // If slot found and it's within the best energy period, use it
            if (energySlot && energySlot.getHours() < bestEndHour) {
              scheduledAt = energySlot;
              console.log(
                `[PlanningService] ✓ Scheduled HIGH energy task "${task.title}" in optimal energy slot: ${scheduledAt.toTimeString().slice(0, 5)}`
              );
            }
          }
        }

        // If no specific slot found, use standard calculation
        // This will use currentTime which progresses sequentially through the day
        if (!scheduledAt) {
          scheduledAt = this.calculateNextAvailableTime(
            currentTime,
            task.duration,
            workStartHour,
            workEndHour,
            lunchStartHour,
            lunchEndHour,
            lunchBreakEnabled,
            bufferMinutes
          );
        }
      }

      // If no slot available, schedule for next day or skip
      if (!scheduledAt) {
        // Schedule for next day at work start
        const nextDay = new Date(planningDate);
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(workStartHour, 0, 0, 0);

        plannedTasks.push({
          title: task.title,
          description: task.description,
          priority: task.priority,
          duration: task.duration,
          scheduledAt: nextDay,
          deadline: task.deadline ? new Date(task.deadline) : undefined,
        });

        unplannedTasks.push(task);
        continue;
      }

      plannedTasks.push({
        title: task.title,
        description: task.description,
        priority: task.priority,
        duration: task.duration,
        scheduledAt,
        deadline: task.deadline ? new Date(task.deadline) : undefined,
      });

      // Move current time to end of task + buffer
      currentTime = new Date(scheduledAt);
      currentTime.setMinutes(
        currentTime.getMinutes() + task.duration + bufferMinutes
      );
    }

    // If some tasks couldn't fit today, log a warning but return what we have
    if (
      unplannedTasks.length > 0 &&
      unplannedTasks.length === sortedTasks.length
    ) {
      // All tasks couldn't fit - this shouldn't happen, but if it does, at least schedule them for tomorrow
      console.warn(
        `[PlanningService] All tasks scheduled for next day due to insufficient time slots`
      );
    } else if (unplannedTasks.length > 0) {
      console.info(
        `[PlanningService] ${unplannedTasks.length} task(s) scheduled for next day due to time constraints`
      );
    }

    console.log(
      `[PlanningService] Generated ${plannedTasks.length} planned tasks`
    );

    // Validate all tasks have scheduledAt
    for (const task of plannedTasks) {
      if (!task.scheduledAt || !(task.scheduledAt instanceof Date)) {
        console.error(
          `[PlanningService] Task "${task.title}" has invalid scheduledAt:`,
          task.scheduledAt
        );
        throw new BadRequestException(
          `Task "${task.title}" has invalid scheduledAt`
        );
      }
      if (isNaN(task.scheduledAt.getTime())) {
        console.error(
          `[PlanningService] Task "${task.title}" has NaN scheduledAt:`,
          task.scheduledAt
        );
        throw new BadRequestException(
          `Task "${task.title}" has invalid scheduledAt date`
        );
      }
    }

    // Sort all tasks chronologically by scheduledAt (CRITICAL: ensure chronological order)
    plannedTasks.sort((a, b) => {
      const timeA = a.scheduledAt.getTime();
      const timeB = b.scheduledAt.getTime();
      return timeA - timeB; // Ascending order: earliest first
    });

    console.log(
      `[PlanningService] Tasks sorted chronologically. First task: ${plannedTasks[0]?.title} @ ${plannedTasks[0]?.scheduledAt.toISOString()}, Last task: ${plannedTasks[plannedTasks.length - 1]?.title} @ ${plannedTasks[plannedTasks.length - 1]?.scheduledAt.toISOString()}`
    );

    return plannedTasks;
  }

  /**
   * Validate and save planning to database
   */
  async validatePlanning(
    planningData: {
      date: Date;
      tasks: PlannedTask[];
      audioLogId?: string;
    },
    userId: string
  ) {
    console.log(
      `[PlanningService] validatePlanning called for user ${userId}`,
      {
        date: planningData.date,
        tasksCount: planningData.tasks.length,
        audioLogId: planningData.audioLogId,
      }
    );

    // Check if planning already exists for this date
    const existingPlanning = await this.prisma.planning.findUnique({
      where: {
        userId_date: {
          userId,
          date: planningData.date,
        },
      },
    });

    let planning;

    if (existingPlanning) {
      console.log(
        `[PlanningService] Updating existing planning ${existingPlanning.id}`
      );
      // Update existing planning
      planning = await this.prisma.planning.update({
        where: { id: existingPlanning.id },
        data: {
          status: "VALIDATED",
          validatedAt: new Date(),
          audioLogId: planningData.audioLogId || existingPlanning.audioLogId,
        },
      });

      // Delete existing tasks
      const deletedCount = await this.prisma.task.deleteMany({
        where: { planningId: existingPlanning.id },
      });
      console.log(
        `[PlanningService] Deleted ${deletedCount.count} existing tasks`
      );
    } else {
      console.log(`[PlanningService] Creating new planning`);
      // Create new planning
      planning = await this.prisma.planning.create({
        data: {
          userId,
          date: planningData.date,
          status: "VALIDATED",
          validatedAt: new Date(),
          audioLogId: planningData.audioLogId,
        },
      });
      console.log(`[PlanningService] Created planning ${planning.id}`);
    }

    // Create tasks
    console.log(
      `[PlanningService] Creating ${planningData.tasks.length} tasks`
    );
    const tasks = await Promise.all(
      planningData.tasks.map((taskData, index) => {
        console.log(
          `[PlanningService] Creating task ${index + 1}/${planningData.tasks.length}:`,
          {
            title: taskData.title,
            priority: taskData.priority,
            duration: taskData.duration,
            scheduledAt: taskData.scheduledAt,
          }
        );
        return this.prisma.task.create({
          data: {
            userId,
            planningId: planning.id,
            title: taskData.title,
            description: taskData.description,
            priority: taskData.priority,
            duration: taskData.duration,
            scheduledAt: taskData.scheduledAt,
            deadline: taskData.deadline,
            status: "PENDING",
          },
        });
      })
    );

    console.log(`[PlanningService] Created ${tasks.length} tasks successfully`);

    // Generate reminders for tasks
    if (tasks.length > 0) {
      try {
        await this.notificationsService.createRemindersForTasks(
          tasks.map((task) => ({
            id: task.id,
            userId,
            scheduledAt: task.scheduledAt,
          }))
        );
        console.log(
          `[PlanningService] Created reminders for ${tasks.length} tasks`
        );
      } catch (reminderError) {
        console.error(
          `[PlanningService] Error creating reminders:`,
          reminderError
        );
        // Don't fail the whole operation if reminders fail
      }
    }

    return {
      planning,
      tasks,
    };
  }
}
