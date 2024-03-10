import nodemailer from 'nodemailer';
import { envs } from '../../config/plugins/envs.plugin';

interface SendEmailOptions {
    to: string | string[];
    subject: string;
    htmlBody: string;
    attachments?: Attachment[];
}

interface Attachment {
    filename: string;
    path: string;
}

export class EmailService {

    constructor(
    ) { }

    async sendEmail(sendMailOptions: SendEmailOptions): Promise<boolean> {
        const { to, subject, htmlBody, attachments = [] } = sendMailOptions;
        try {
            const sentInformation = await this.transporter.sendMail({
                from: envs.MAILER_EMAIL,
                to: to,
                subject: subject,
                html: htmlBody,
                attachments: attachments
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async sendEmailWithFileSystemLogs(to: string | string[]): Promise<boolean> {
        const subject = 'Logs from server';
        const htmlBody = `
        <h1>Logs from server</h1
        <p>lorem ipIrure culpa fugiat deserunt commodo deserunt. Eu qui in cillum in id ex nostrud deserunt sunt enim labore do. Fugiat do laboris fugiat aliqua officia eiusmod aliquip Lorem velit.</p>
        <p>Log 2</p>`;

        const attachments = [
            {
                filename: 'logs-all.log',
                path: './logs/logs-all.log'
            },
            {
                filename: 'logs-medium.log',
                path: './logs/logs-medium.log'
            },
            {
                filename: 'logs-high.log',
                path: './logs/logs-high.log'
            },
        ];
        return this.sendEmail({
            to: to,
            subject: subject,
            htmlBody: htmlBody,
            attachments: attachments
        });
    }

    private transporter = nodemailer.createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_SECRET_KEY
        }
    });
}