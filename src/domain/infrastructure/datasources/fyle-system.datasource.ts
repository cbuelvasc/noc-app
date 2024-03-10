import { LogEntity, LogSeverityLevel } from './../../entities/log.entity';
import { LogDataSource } from "../../datasources/log.datasource";
import fs from 'fs';


export class FyleSystemDatasource implements LogDataSource {

    private readonly logFilePath: string = 'logs/';
    private readonly allLogsPath: string = 'logs/logs-all.log';
    private readonly mediumLogsPath: string = 'logs/logs-medium.log';
    private readonly highLogsPath: string = 'logs/logs-high.log';

    constructor() {
        this.createLogsFile(this.logFilePath, [this.allLogsPath, this.mediumLogsPath, this.highLogsPath]);
    }

    async saveLog(newLog: LogEntity): Promise<void> {
        const logAsJson = `${JSON.stringify(newLog)}\n`;
        fs.appendFileSync(this.allLogsPath, logAsJson);

        if (newLog.level === LogSeverityLevel.low) {
            return;
        }

        if (newLog.level === LogSeverityLevel.medium) {
            fs.appendFileSync(this.mediumLogsPath, logAsJson);
        } else {
            fs.appendFileSync(this.highLogsPath, logAsJson);
        }
    }

    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {

        switch (severityLevel) {
            case LogSeverityLevel.low:
                return this.getLogsFromFile(this.allLogsPath);

            case LogSeverityLevel.medium:
                return this.getLogsFromFile(this.mediumLogsPath);

            case LogSeverityLevel.high:
                return this.getLogsFromFile(this.highLogsPath);

            default:
                throw new Error('Invalid severity level');
        }
    }

    private createLogsFile = (filePath: string, logs: string[]) => {
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath);
        }

        logs.forEach((path) => {
            if (!fs.existsSync(path)) {
                fs.writeFileSync(path, '');
            }
        });
    };

    private getLogsFromFile = (filePath: string): LogEntity[] => {
        const content = fs.readFileSync(filePath, 'utf-8');
        return content.split('\n')
            .map(LogEntity.fromJson);
    };
}