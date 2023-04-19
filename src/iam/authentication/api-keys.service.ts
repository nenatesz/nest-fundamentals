import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { HashingService } from '../hashing/hashing.service';
import { GeneratedApiKeyPayload } from '../interfaces/active-user.interface';

@Injectable()
export class ApiKeysService {
    constructor(private readonly hashingService: HashingService) {}

    async createAndHash(uuid: string): Promise<GeneratedApiKeyPayload> {
        const apiKey = this.generateApiKey(uuid);
        const hashedKey = await this.hashingService.hash(apiKey);
        return {apiKey, hashedKey};
    }

    async validate(apiKey: string, hashedKey: string): Promise<boolean>{
       return this.hashingService.compare(apiKey, hashedKey)
    }

    extractIdFromApiKey(apiKey: string): string {
        const [id] = Buffer.from(apiKey, 'base64').toString('ascii').split(' ');
        return id;
    }

    private generateApiKey (uuid: string) {
        const apiKey = `${uuid} ${randomUUID}`;
        return Buffer.from(apiKey).toString('base64');
    }
}
