import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteAllUsers() {
  try {
    console.log('🗑️  Suppression de tous les utilisateurs...')
    
    // Supprimer d'abord les OTPs associés
    const deletedOtps = await prisma.otp.deleteMany({})
    console.log(`✅ ${deletedOtps.count} OTP(s) supprimé(s)`)
    
    // Supprimer les utilisateurs (les relations seront supprimées en cascade)
    const deletedUsers = await prisma.user.deleteMany({})
    console.log(`✅ ${deletedUsers.count} utilisateur(s) supprimé(s)`)
    
    console.log('✨ Suppression terminée avec succès!')
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

deleteAllUsers()

