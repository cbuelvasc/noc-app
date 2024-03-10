import { LogEntity, LogSeverityLevel } from './../../entities/log.entity';
import { LogRepository } from '../../repository/log.repository';

interface CheckServiceUseCase {
    execute(url: string): Promise<boolean>;
}

type SuccessCallback = (() => void) | undefined;
type ErrorCallback = ((error: string) => void) | undefined;

export class CheckService implements CheckServiceUseCase {

    constructor(
        private readonly LogRepository: LogRepository,
        private readonly successCallback: SuccessCallback,
        private readonly errorCallback: ErrorCallback
    ) { }

    public async execute(url: string): Promise<boolean> {
        try {
            const req = await fetch(url);
            if (!req.ok) {
                throw new Error(`Error on check service ${url}`);
            }
            const log = new LogEntity(LogSeverityLevel.low, `Service ${url} is ok`);
            this.LogRepository.saveLog(log);
            this.successCallback && this.successCallback();
            return true;
        } catch (error) {
            const errorMesage = `Error on check service ${url} - ${error}`;
            const log = new LogEntity(LogSeverityLevel.high, errorMesage);
            this.LogRepository.saveLog(log);
            
            this.errorCallback && this.errorCallback(errorMesage);
            return false;
        }
    }
}