import { OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
export declare class AppService implements OnApplicationBootstrap {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    getHello(): string;
    onApplicationBootstrap(): Promise<void>;
}
