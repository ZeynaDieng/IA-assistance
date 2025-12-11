<template>
  <div
    class="min-h-screen flex flex-col bg-white dark:bg-[#0D0F33] transition-colors duration-300 pb-safe-bottom"
  >
    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-4 pt-4 pb-24">
      <!-- Header -->
      <div class="mb-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Paramètres
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Personnalisez votre planification
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <Loader2 :size="32" class="animate-spin text-primary" />
      </div>

      <!-- Settings Content -->
      <div v-else class="space-y-4">
        <!-- Section: Assistant IA -->
        <div>
          <h2
            class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-1"
          >
            Assistant IA
          </h2>

          <!-- Assistant Name -->
          <div
            class="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 mb-3"
          >
            <h3
              class="text-sm font-semibold text-gray-900 dark:text-white mb-3"
            >
              Nom de l'assistant
            </h3>
            <input
              v-model="preferences.assistantName"
              type="text"
              placeholder="Zeii"
              maxlength="20"
              class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              @input="debouncedSave"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Personnalisez le nom de votre assistant IA
            </p>
          </div>

          <!-- Voice Response -->
          <div
            class="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                  Réponses vocales
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Activer les réponses vocales de l'assistant
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="preferences.voiceResponseEnabled"
                  @change="debouncedSave"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
                ></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Section: Travail -->
        <div>
          <h2
            class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-1"
          >
            Travail
          </h2>

          <!-- Work Hours -->
          <div
            class="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 mb-3"
          >
            <h3
              class="text-sm font-semibold text-gray-900 dark:text-white mb-3"
            >
              Heures de travail
            </h3>
            <div class="grid grid-cols-2 gap-3">
              <TimePicker
                v-model="preferences.workHoursStart"
                @change="debouncedSave"
              />
              <TimePicker
                v-model="preferences.workHoursEnd"
                @change="debouncedSave"
              />
            </div>
          </div>

          <!-- Work Days -->
          <div
            class="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 mb-3"
          >
            <h3
              class="text-sm font-semibold text-gray-900 dark:text-white mb-3"
            >
              Jours de travail
            </h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="day in weekDays"
                :key="day.value"
                @click="toggleWorkDay(day.value)"
                :class="[
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  preferences.workDays?.includes(day.value)
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
                ]"
              >
                {{ day.label }}
              </button>
            </div>
          </div>

          <!-- Lunch Break -->
          <div
            class="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
          >
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                Pause déjeuner
              </h3>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="preferences.lunchBreakEnabled"
                  @change="debouncedSave"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
                ></div>
              </label>
            </div>
            <div
              v-if="preferences.lunchBreakEnabled"
              class="grid grid-cols-2 gap-3"
            >
              <TimePicker
                v-model="preferences.lunchBreakStart"
                @change="debouncedSave"
              />
              <TimePicker
                v-model="preferences.lunchBreakEnd"
                @change="debouncedSave"
              />
            </div>
          </div>
        </div>

        <!-- Section: Planification -->
        <div>
          <h2
            class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-1"
          >
            Planification
          </h2>

          <!-- Task Duration -->
          <div
            class="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 mb-3"
          >
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                Durée préférée
              </h3>
              <span class="text-sm font-medium text-primary">
                {{ preferences.preferredTaskDuration }} min
              </span>
            </div>
            <input
              v-model.number="preferences.preferredTaskDuration"
              type="range"
              min="15"
              max="120"
              step="15"
              class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-primary"
              @change="debouncedSave"
            />
          </div>

          <!-- Buffer between tasks -->
          <div
            class="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 mb-3"
          >
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                Pause entre tâches
              </h3>
              <span class="text-sm font-medium text-primary">
                {{ preferences.taskBufferMinutes }} min
              </span>
            </div>
            <input
              v-model.number="preferences.taskBufferMinutes"
              type="range"
              min="5"
              max="30"
              step="5"
              class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-primary"
              @change="debouncedSave"
            />
          </div>

          <!-- Energy Levels -->
          <div
            class="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 mb-3"
          >
            <h3
              class="text-sm font-semibold text-gray-900 dark:text-white mb-3"
            >
              Niveaux d'énergie
            </h3>
            <div class="space-y-3">
              <div>
                <label
                  class="text-xs text-gray-500 dark:text-gray-400 mb-2 block"
                >
                  Matin
                </label>
                <select
                  v-model="preferences.energyMorning"
                  class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  @change="debouncedSave"
                >
                  <option value="LOW">Faible</option>
                  <option value="MEDIUM">Moyen</option>
                  <option value="HIGH">Élevé</option>
                </select>
              </div>
              <div>
                <label
                  class="text-xs text-gray-500 dark:text-gray-400 mb-2 block"
                >
                  Après-midi
                </label>
                <select
                  v-model="preferences.energyAfternoon"
                  class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  @change="debouncedSave"
                >
                  <option value="LOW">Faible</option>
                  <option value="MEDIUM">Moyen</option>
                  <option value="HIGH">Élevé</option>
                </select>
              </div>
              <div>
                <label
                  class="text-xs text-gray-500 dark:text-gray-400 mb-2 block"
                >
                  Soir
                </label>
                <select
                  v-model="preferences.energyEvening"
                  class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  @change="debouncedSave"
                >
                  <option value="LOW">Faible</option>
                  <option value="MEDIUM">Moyen</option>
                  <option value="HIGH">Élevé</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Category Durations -->
          <div
            class="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 mb-3"
          >
            <h3
              class="text-sm font-semibold text-gray-900 dark:text-white mb-3"
            >
              Durées par catégorie
            </h3>
            <div class="space-y-2">
              <div
                v-for="(duration, category) in categoryDurations"
                :key="category"
                class="flex items-center gap-2"
              >
                <input
                  v-model="categoryDurations[category]"
                  type="number"
                  min="5"
                  max="240"
                  step="5"
                  :placeholder="category"
                  class="flex-1 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  @change="updateCategoryDurations"
                />
                <span class="text-xs text-gray-500 dark:text-gray-400 w-10"
                  >min</span
                >
                <button
                  @click="removeCategory(category)"
                  class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <X :size="16" />
                </button>
              </div>
              <div class="flex items-center gap-2">
                <input
                  v-model="newCategoryName"
                  type="text"
                  placeholder="Nouvelle catégorie"
                  class="flex-1 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  @keyup.enter="addCategory"
                />
                <button
                  @click="addCategory"
                  class="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 active:scale-95 transition-all shadow-md"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          <!-- Advanced Planning Options -->
          <div
            class="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
          >
            <h3
              class="text-sm font-semibold text-gray-900 dark:text-white mb-3"
            >
              Options avancées
            </h3>
            <div class="space-y-3">
              <!-- Max tasks per day -->
              <div>
                <label
                  class="text-xs text-gray-500 dark:text-gray-400 mb-2 block"
                >
                  Max tâches par jour
                </label>
                <input
                  v-model.number="preferences.maxTasksPerDay"
                  type="number"
                  min="1"
                  placeholder="Illimité"
                  class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  @change="debouncedSave"
                />
              </div>

              <!-- Prefer morning tasks -->
              <label class="flex items-center justify-between cursor-pointer">
                <span class="text-sm text-gray-900 dark:text-white">
                  Préférer le matin
                </span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="preferences.preferMorningTasks"
                    @change="debouncedSave"
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
                  ></div>
                </label>
              </label>

              <!-- Allow task overlap -->
              <label class="flex items-center justify-between cursor-pointer">
                <span class="text-sm text-gray-900 dark:text-white">
                  Autoriser chevauchement
                </span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="preferences.allowTaskOverlap"
                    @change="debouncedSave"
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
                  ></div>
                </label>
              </label>
            </div>
          </div>
        </div>

        <!-- Section: Rappels -->
        <div>
          <h2
            class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-1"
          >
            Rappels
          </h2>

          <div
            class="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
          >
            <h3
              class="text-sm font-semibold text-gray-900 dark:text-white mb-3"
            >
              Paramètres de rappels
            </h3>
            <div class="space-y-3">
              <!-- Reminder before task -->
              <div>
                <label
                  class="text-xs text-gray-500 dark:text-gray-400 mb-2 block"
                >
                  Rappel avant tâche normale
                </label>
                <select
                  v-model.number="preferences.reminderBeforeTask"
                  class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  @change="debouncedSave"
                >
                  <option :value="15">15 minutes avant</option>
                  <option :value="30">30 minutes avant</option>
                  <option :value="45">45 minutes avant</option>
                  <option :value="60">1 heure avant</option>
                </select>
              </div>

              <!-- Reminder for urgent tasks -->
              <div>
                <label
                  class="text-xs text-gray-500 dark:text-gray-400 mb-2 block"
                >
                  Rappel avant tâche urgente
                </label>
                <select
                  v-model.number="preferences.reminderForUrgent"
                  class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  @change="debouncedSave"
                >
                  <option :value="30">30 minutes avant</option>
                  <option :value="45">45 minutes avant</option>
                  <option :value="60">1 heure avant</option>
                </select>
              </div>

              <!-- Reminder for early tasks -->
              <label class="flex items-center justify-between cursor-pointer">
                <span class="text-sm text-gray-900 dark:text-white">
                  Rappel veille (tâches matinales)
                </span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="preferences.reminderForEarlyTasks"
                    @change="debouncedSave"
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
                  ></div>
                </label>
              </label>
            </div>
          </div>
        </div>

        <!-- Section: Général -->
        <div>
          <h2
            class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-1"
          >
            Général
          </h2>

          <!-- Language -->
          <div
            class="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
          >
            <h3
              class="text-sm font-semibold text-gray-900 dark:text-white mb-3"
            >
              Langue
            </h3>
            <select
              v-model="preferences.language"
              class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              @change="handleLanguageChange"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <BottomNavigationBar
      :items="navItems"
      :fab="{ icon: Mic, onClick: () => router.push('/record') }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import {
  Mic,
  Home,
  Calendar,
  BarChart2,
  List,
  Loader2,
  X,
} from "lucide-vue-next";
import BottomNavigationBar from "~/components/ui/BottomNavigationBar.vue";
import TimePicker from "~/components/ui/TimePicker.vue";
import { useAuthStore } from "~/stores/auth";
import { useToast } from "~/composables/useToast";
import { useI18n } from "vue-i18n";

const router = useRouter();
const authStore = useAuthStore();
const { success, error } = useToast();
const { locale, setLocale } = useI18n();

const navItems = [
  { id: "home", icon: Home },
  { id: "tasks", icon: List },
  { id: "calendar", icon: Calendar },
  { id: "stats", icon: BarChart2 },
];

const weekDays = [
  { value: "MONDAY", label: "Lun" },
  { value: "TUESDAY", label: "Mar" },
  { value: "WEDNESDAY", label: "Mer" },
  { value: "THURSDAY", label: "Jeu" },
  { value: "FRIDAY", label: "Ven" },
  { value: "SATURDAY", label: "Sam" },
  { value: "SUNDAY", label: "Dim" },
];

interface Preferences {
  workHoursStart: string;
  workHoursEnd: string;
  preferredTaskDuration: number;
  energyMorning: "LOW" | "MEDIUM" | "HIGH";
  energyAfternoon: "LOW" | "MEDIUM" | "HIGH";
  energyEvening: "LOW" | "MEDIUM" | "HIGH";
  timezone?: string;
  language: "fr" | "en";
  // New fields
  lunchBreakStart?: string;
  lunchBreakEnd?: string;
  lunchBreakEnabled?: boolean;
  taskBufferMinutes?: number;
  workDays?: string[];
  reminderBeforeTask?: number;
  reminderForUrgent?: number;
  reminderForEarlyTasks?: boolean;
  categoryDurations?: Record<string, number>;
  autoScheduleTasks?: boolean;
  maxTasksPerDay?: number | null;
  preferMorningTasks?: boolean;
  allowTaskOverlap?: boolean;
  assistantName?: string;
  voiceResponseEnabled?: boolean;
}

const preferences = ref<Preferences>({
  workHoursStart: "09:00",
  workHoursEnd: "17:00",
  preferredTaskDuration: 30,
  energyMorning: "MEDIUM",
  energyAfternoon: "MEDIUM",
  energyEvening: "LOW",
  language: "fr",
  lunchBreakStart: "12:00",
  lunchBreakEnd: "13:00",
  lunchBreakEnabled: true,
  taskBufferMinutes: 15,
  workDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
  reminderBeforeTask: 15,
  reminderForUrgent: 45,
  reminderForEarlyTasks: true,
  categoryDurations: {},
  autoScheduleTasks: true,
  maxTasksPerDay: null,
  preferMorningTasks: false,
  allowTaskOverlap: false,
  assistantName: "Zeii",
  voiceResponseEnabled: true,
});

const newCategoryName = ref("");
const categoryDurations = computed({
  get: () => preferences.value.categoryDurations || {},
  set: (value) => {
    preferences.value.categoryDurations = value;
  },
});

const loading = ref(true);
const saving = ref(false);
let saveTimeout: ReturnType<typeof setTimeout> | null = null;

// Debounced save function to avoid too many requests
const debouncedSave = () => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(() => {
    savePreferences();
  }, 500); // Wait 500ms after last change before saving
};

const toggleWorkDay = (day: string) => {
  if (!preferences.value.workDays) {
    preferences.value.workDays = [];
  }
  const index = preferences.value.workDays.indexOf(day);
  if (index > -1) {
    preferences.value.workDays.splice(index, 1);
  } else {
    preferences.value.workDays.push(day);
  }
  debouncedSave();
};

const addCategory = () => {
  if (!newCategoryName.value.trim()) return;
  const category = newCategoryName.value.trim().toLowerCase();
  if (!categoryDurations.value[category]) {
    categoryDurations.value = {
      ...categoryDurations.value,
      [category]: 30,
    };
    updateCategoryDurations();
  }
  newCategoryName.value = "";
};

const removeCategory = (category: string) => {
  const newDurations = { ...categoryDurations.value };
  delete newDurations[category];
  categoryDurations.value = newDurations;
  updateCategoryDurations();
};

const updateCategoryDurations = () => {
  preferences.value.categoryDurations = categoryDurations.value;
  debouncedSave();
};

const handleLanguageChange = async () => {
  // Update i18n locale immediately
  if (preferences.value.language) {
    await setLocale(preferences.value.language);
  }
  // Save preferences
  debouncedSave();
};

const loadPreferences = async () => {
  try {
    loading.value = true;
    const config = useRuntimeConfig();
    const response = await fetch(
      `${config.public.apiBaseUrl}/users/preferences`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.data) {
        preferences.value = {
          workHoursStart: data.data.workHoursStart || "09:00",
          workHoursEnd: data.data.workHoursEnd || "17:00",
          preferredTaskDuration: data.data.preferredTaskDuration || 30,
          energyMorning: data.data.energyMorning || "MEDIUM",
          energyAfternoon: data.data.energyAfternoon || "MEDIUM",
          energyEvening: data.data.energyEvening || "LOW",
          timezone: data.data.timezone,
          language: data.data.language || "fr",
          lunchBreakStart: data.data.lunchBreakStart || "12:00",
          lunchBreakEnd: data.data.lunchBreakEnd || "13:00",
          lunchBreakEnabled: data.data.lunchBreakEnabled !== false,
          taskBufferMinutes: data.data.taskBufferMinutes || 15,
          workDays: data.data.workDays || [
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
          ],
          reminderBeforeTask: data.data.reminderBeforeTask || 15,
          reminderForUrgent: data.data.reminderForUrgent || 45,
          reminderForEarlyTasks: data.data.reminderForEarlyTasks !== false,
          categoryDurations:
            (data.data.categoryDurations as Record<string, number>) || {},
          autoScheduleTasks: data.data.autoScheduleTasks !== false,
          maxTasksPerDay: data.data.maxTasksPerDay ?? null,
          preferMorningTasks: data.data.preferMorningTasks || false,
          allowTaskOverlap: data.data.allowTaskOverlap || false,
          assistantName:
            data.data.assistantName && data.data.assistantName !== "Sama"
              ? data.data.assistantName
              : "Zeii",
          voiceResponseEnabled: data.data.voiceResponseEnabled !== false,
        };
      }
    } else {
      console.warn("[SettingsPage] Failed to load preferences");
    }
  } catch (err) {
    console.error("[SettingsPage] Error loading preferences:", err);
  } finally {
    loading.value = false;
  }
};

const savePreferences = async () => {
  // Clear any pending debounced save
  if (saveTimeout) {
    clearTimeout(saveTimeout);
    saveTimeout = null;
  }

  if (saving.value) return;

  try {
    saving.value = true;
    const config = useRuntimeConfig();
    const response = await fetch(
      `${config.public.apiBaseUrl}/users/preferences`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify(preferences.value),
      }
    );

    if (response.ok) {
      success("Préférences enregistrées");
    } else if (response.status === 429) {
      // Rate limit exceeded - wait a bit and retry once
      console.warn(
        "[SettingsPage] Rate limit exceeded, retrying in 1 second..."
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const retryResponse = await fetch(
        `${config.public.apiBaseUrl}/users/preferences`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.token}`,
          },
          body: JSON.stringify(preferences.value),
        }
      );
      if (retryResponse.ok) {
        success("Préférences enregistrées");
      } else {
        error("Erreur lors de l'enregistrement. Veuillez réessayer.");
      }
    } else {
      error("Erreur lors de l'enregistrement");
    }
  } catch (err) {
    console.error("[SettingsPage] Error saving preferences:", err);
    error("Erreur lors de l'enregistrement");
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  authStore.initialize();

  if (!authStore.isLoggedIn) {
    router.push("/onboarding");
    return;
  }

  await loadPreferences();
});

useHead({
  title: "Paramètres - Zeii",
});
</script>
