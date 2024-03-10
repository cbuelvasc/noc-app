import { LogEntity, LogSeverityLevel } from '../../entities/log.entity';
import { EmailService } from "../../../presentation/email/email.service";
import { LogRepository } from "../../repository/log.repository";

interface SendEmailLogsUseCase {
    execute: (to: string | string[]) => Promise<boolean>;
}

export class SendEmailLogs implements SendEmailLogsUseCase {
    
    constructor(
        private readonly logRepository: LogRepository,
        private readonly emailService: EmailService
    ) { }

    async execute(to: string | string[]): Promise<boolean> {
        try {
            const sent = await this.emailService.sendEmailWithFileSystemLogs(to);
            if (!sent) {
                throw new Error('Email not sent');
            }
            const log = new LogEntity({
                level: LogSeverityLevel.low,
                message: 'Email sent',
                origin: 'email.service.ts',
            });
            this.logRepository.saveLog(log);
            return true;
        } catch (error) {
            const log = new LogEntity({
                level: LogSeverityLevel.high,
                message: `Email not sent: ${error}`,
                origin: 'email.service.ts',
            });
            this.logRepository.saveLog(log);
            return false;
        }
    }
}
