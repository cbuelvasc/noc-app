
export enum LogSeverityLevel {
    low = 'low',
    medium = 'medium',
    high = 'high'
}

export class LogEntity {

    public level: LogSeverityLevel;
    public message: string;
    public createdAt: Date;

    constructor(
        level: LogSeverityLevel,
        message: string,
        createdAt: Date = new Date()
    ) {
        this.level = level;
        this.message = message;
        this.createdAt = createdAt;
    }

    static fromJson = (json: string): LogEntity => {
        const { message, level, createdAt } = JSON.parse(json);
        return new LogEntity(level, message, new Date(createdAt));
    }
}