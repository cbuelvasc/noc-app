import { SendEmailLogs } from '../domain/use-cases/email/send-email-logs';
import { EmailService } from './email/email.service';
import { FyleSystemDatasource } from '../infrastructure/datasources/fyle-system.datasource';
import { LogRepositoryImpl } from '../infrastructure/repositories/log.repository.impl';
import { CheckService } from './../domain/use-cases/cheks/check-service';
import { CronService } from './cron/cron-service';

const fileSystemLogRepository = new LogRepositoryImpl(new FyleSystemDatasource());
const emailService = new EmailService();

export class Server {

    constructor() {
    }

    public static start() {
        console.log('Server started...!');

        CronService.createJob(
            '*/5 * * * * *',
            () => {
                new CheckService(
                    fileSystemLogRepository,
                    () => {
                        console.log('CheckService executed...');
                    },
                    (error) => {
                        console.log('CheckService error: ', error);
                    }
                ).execute('http://localhost:3000');
            },
        );

        new SendEmailLogs(fileSystemLogRepository, emailService)
            .execute(['cbuelvasc@gmail.com', 'cbuelvasc@hotmail.com']);
    }
}