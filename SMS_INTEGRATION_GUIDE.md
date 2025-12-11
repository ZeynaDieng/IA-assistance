# Guide d'intégration SMS pour OTP en Production

## État actuel

### Mode Développement
- ✅ L'OTP est retourné dans la réponse JSON de l'API (`otp` field)
- ✅ L'OTP s'affiche dans l'interface utilisateur
- ✅ L'OTP est loggé dans la console du backend

### Mode Production
- ⚠️ L'OTP **n'est PAS** retourné dans la réponse JSON (pour la sécurité)
- ⚠️ L'OTP **n'est PAS** affiché dans l'UI
- ❌ L'OTP **n'est PAS** encore envoyé par SMS (à implémenter)

## Ce qui se passe en production actuellement

Si vous déployez l'application en mode production (`NODE_ENV=production`) :

1. L'utilisateur entre son numéro et demande un OTP
2. Le backend génère un OTP mais **ne le retourne pas** dans la réponse
3. **Aucun SMS n'est envoyé** (car le service SMS n'est pas encore intégré)
4. L'utilisateur **ne peut pas se connecter** car il n'a pas reçu le code

## Comment intégrer un service SMS

### Option 1: Twilio (Recommandé)

#### 1. Installer le package Twilio
```bash
cd backend
npm install twilio
```

#### 2. Ajouter les variables d'environnement (.env)
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

#### 3. Créer un service SMS (backend/src/auth/sms.service.ts)
```typescript
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as twilio from 'twilio'

@Injectable()
export class SmsService {
  private client: twilio.Twilio

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID')
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN')
    
    if (accountSid && authToken) {
      this.client = twilio(accountSid, authToken)
    }
  }

  async sendOtp(phoneNumber: string, code: string): Promise<void> {
    const twilioNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER')
    
    if (!this.client || !twilioNumber) {
      throw new Error('SMS service not configured')
    }

    await this.client.messages.create({
      body: `Votre code de vérification SamaPlanner: ${code}. Ce code expire dans 5 minutes.`,
      from: twilioNumber,
      to: phoneNumber
    })
  }
}
```

#### 4. Modifier auth.service.ts pour utiliser le service SMS
```typescript
// Dans auth.service.ts
import { SmsService } from './sms.service'

// Injecter dans le constructeur
constructor(
  private prisma: PrismaService,
  private jwtService: JwtService,
  private smsService: SmsService // Ajouter
) {}

// Modifier la méthode sendOtp
async sendOtp(phoneNumber: string, purpose: OtpPurpose = OtpPurpose.REGISTER) {
  // ... code existant pour générer OTP ...

  if (process.env.NODE_ENV === 'development') {
    // Dev mode: return OTP
    return { success: true, message: 'OTP sent successfully', otp: code }
  } else {
    // Production: send SMS
    await this.smsService.sendOtp(phoneNumber, code)
    return { success: true, message: 'OTP sent successfully via SMS' }
  }
}
```

#### 5. Enregistrer SmsService dans AuthModule
```typescript
// Dans auth.module.ts
import { SmsService } from './sms.service'

@Module({
  // ...
  providers: [AuthService, JwtStrategy, SmsService], // Ajouter SmsService
})
```

### Option 2: AWS SNS

#### 1. Installer AWS SDK
```bash
npm install @aws-sdk/client-sns
```

#### 2. Variables d'environnement
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

#### 3. Service SMS avec AWS SNS
```typescript
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'

@Injectable()
export class SmsService {
  private snsClient: SNSClient

  constructor(private configService: ConfigService) {
    this.snsClient = new SNSClient({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY')!
      }
    })
  }

  async sendOtp(phoneNumber: string, code: string): Promise<void> {
    const command = new PublishCommand({
      PhoneNumber: phoneNumber,
      Message: `Votre code de vérification SamaPlanner: ${code}. Ce code expire dans 5 minutes.`
    })

    await this.snsClient.send(command)
  }
}
```

### Option 3: Autres services SMS

- **Vonage (Nexmo)**: `npm install @vonage/server-sdk`
- **MessageBird**: `npm install messagebird`
- **SendGrid**: `npm install @sendgrid/mail` (pour emails) ou API SMS

## Checklist pour le déploiement en production

- [ ] Intégrer un service SMS (Twilio, AWS SNS, etc.)
- [ ] Configurer les variables d'environnement pour le service SMS
- [ ] Tester l'envoi d'OTP par SMS en staging/pre-production
- [ ] Vérifier que `NODE_ENV=production` est bien défini
- [ ] Vérifier que l'OTP n'apparaît plus dans les logs/console
- [ ] Tester le flux complet d'inscription/connexion
- [ ] Ajouter un système de rate limiting pour éviter le spam d'OTP
- [ ] Configurer des templates SMS personnalisés si nécessaire

## Rate Limiting recommandé

Pour éviter le spam d'OTP, ajoutez un rate limiter :

```typescript
// Exemple avec @nestjs/throttler
@Throttle(5, 300) // 5 requêtes max par 5 minutes
@Post('send-otp')
async sendOtp(...) {
  // ...
}
```

## Coûts estimés

- **Twilio**: ~$0.0075 par SMS (varie selon le pays)
- **AWS SNS**: ~$0.00645 par SMS (varie selon la région)
- **Vonage**: ~$0.0059 par SMS

Pour 1000 utilisateurs actifs/jour avec 2 OTP par utilisateur : ~$15/mois

## Sécurité

✅ **Bonnes pratiques déjà implémentées :**
- OTP expire après 5 minutes
- OTP à usage unique (marqué comme vérifié après utilisation)
- Rate limiting recommandé (à ajouter)
- OTP non retourné en production

⚠️ **À améliorer :**
- Ajouter un délai minimum entre les envois (rate limiting)
- Logger les tentatives d'OTP invalides pour détecter les attaques
- Limiter le nombre de tentatives de vérification d'OTP

