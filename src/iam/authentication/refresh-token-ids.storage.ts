import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import Redis from 'ioredis';

export class InvalidatedRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage implements OnApplicationBootstrap, OnApplicationShutdown{

    private redisClient: Redis;

    onApplicationBootstrap() {
        this.redisClient = new Redis({
            host: 'localhost',
            port: 6379
        })
    }
    onApplicationShutdown(signal?: string) {
        return this.redisClient.quit();
    }
     async insert(userId: number, tokenId: string): Promise<void> {
        const key = this.getKey(userId);
        await this.redisClient.set(key, tokenId);
     }

     async validate(userId: number, tokenId: string): Promise<boolean> {
        const key = this.getKey(userId);
        const storedId = await this.redisClient.get(key);
        // if no storedId it means that the refresh token has already been invalidated
        if (!storedId){ 
         console.log('....')
         throw new InvalidatedRefreshTokenError()
      }
        return storedId === tokenId;
     }

     async inValidate(userId: number): Promise<void> {
        const key = this.getKey(userId);
        await this.redisClient.del(key); 
     }

     private getKey(userId: number): string {
        return `user-${userId}`; 
     }
}
