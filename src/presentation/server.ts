import { LogRepositoryImpl } from './../domain/infrastructure/repositories/log.repository.impl';
import { FyleSystemDatasource } from './../domain/infrastructure/datasources/fyle-system.datasource';
import { CheckService } from './../domain/use-cases/cheks/check-service';
import { CronService } from './cron/cron-service';

const fileSystemLogRepository = new LogRepositoryImpl(new FyleSystemDatasource());

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
    }
}