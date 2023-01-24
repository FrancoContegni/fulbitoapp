import { ProcessEnv } from './environment';
declare global {
    namespace NodeJS {
        interface ProcessEnv {
        PORT?: string;
        NODE_ENV: 'development' | 'production';
        URI_MONGO: string;
    }
}

}

export {};