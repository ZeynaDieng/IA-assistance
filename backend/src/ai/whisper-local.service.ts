import { Injectable, Logger } from '@nestjs/common'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'

const execAsync = promisify(exec)

@Injectable()
export class WhisperLocalService {
  private readonly logger = new Logger(WhisperLocalService.name)
  private readonly model = 'base' // ou 'small' pour plus de précision

  /**
   * Transcribe audio file using local Whisper installation
   * Requires: pip install openai-whisper
   */
  async transcribe(audioFilePath: string): Promise<string> {
    try {
      this.logger.log(`Starting local Whisper transcription for: ${audioFilePath}`)

      // Check if file exists
      if (!fs.existsSync(audioFilePath)) {
        throw new Error(`Audio file not found: ${audioFilePath}`)
      }

      // Create temporary output directory
      const outputDir = path.join(process.cwd(), 'tmp', 'whisper-output')
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
      }

      // Run Whisper command
      // Note: This requires Whisper to be installed: pip install openai-whisper
      const command = `whisper "${audioFilePath}" --language fr --model ${this.model} --output_format txt --output_dir "${outputDir}"`

      this.logger.log(`Executing: ${command}`)

      const { stdout, stderr } = await execAsync(command, {
        timeout: 300000, // 5 minutes timeout
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      })

      if (stderr) {
        this.logger.warn(`Whisper stderr: ${stderr}`)
      }

      // Read the transcription file
      const baseName = path.basename(audioFilePath, path.extname(audioFilePath))
      const txtPath = path.join(outputDir, `${baseName}.txt`)

      if (!fs.existsSync(txtPath)) {
        throw new Error(`Transcription file not found: ${txtPath}`)
      }

      const transcription = fs.readFileSync(txtPath, 'utf-8').trim()

      // Clean up temporary files
      try {
        fs.unlinkSync(txtPath)
        // Also try to remove .vtt and .srt files if they exist
        const vttPath = path.join(outputDir, `${baseName}.vtt`)
        const srtPath = path.join(outputDir, `${baseName}.srt`)
        if (fs.existsSync(vttPath)) fs.unlinkSync(vttPath)
        if (fs.existsSync(srtPath)) fs.unlinkSync(srtPath)
      } catch (cleanupError) {
        this.logger.warn(`Error cleaning up temporary files: ${cleanupError}`)
      }

      this.logger.log(`Transcription completed: ${transcription.substring(0, 50)}...`)

      return transcription
    } catch (error: any) {
      this.logger.error(`Error in local Whisper transcription: ${error.message}`, error.stack)

      // Check if Whisper is installed
      if (error.message?.includes('whisper: command not found') || error.code === 'ENOENT') {
        throw new Error(
          'Whisper is not installed. Please install it with: pip install openai-whisper'
        )
      }

      throw new Error(`Local Whisper transcription failed: ${error.message}`)
    }
  }

  /**
   * Check if Whisper is available on the system
   */
  async isAvailable(): Promise<boolean> {
    try {
      await execAsync('whisper --version', { timeout: 5000 })
      return true
    } catch {
      return false
    }
  }
}

