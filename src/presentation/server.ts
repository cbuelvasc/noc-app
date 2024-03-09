import { CheckService } from './../domain/use-cases/cheks/check-service';
import { CronService } from './cron/cron-service';

export class Server {

    constructor() {
    }

    public static start() {
        console.log('Server started...!');

        CronService.createJob(
            '*/5 * * * * *',
            () => {
                new CheckService(
                    () => {
                        console.log('CheckService executed...');
                    },
                    (error) => {
                        console.log('CheckService error: ', error);
                    }
                ).execute('http://localhost:3000');
            },
        );
    }
}