import { Module } from '../enums/module.enum';

export const RabbitMQ = (
    status: 'running' | 'stopped' = 'running',
    tag: string = '4.0-management',
) => {
    return {
        restartPolicy: 'always',
        settings: {
            image: `${Module.RabbitMQ}:${tag}`,
            createOptions:
                '{"HostConfig":{"PortBindings":{"5672/tcp":[{"HostPort":"5672"}],"15672/tcp":[{"HostPort":"15672"}]}}}',
        },
        status,
        type: 'docker',
    };
};

export const Postgres = (
    status: 'running' | 'stopped' = 'running',
    tag: string = 'alpine3.20',
) => {
    return {
        env: {
            POSTGRES_USER: {
                value: 'postgres',
            },
            POSTGRES_PASSWORD: {
                value: 'P@ssw0rd!',
            },
            POSTGRES_DB: {
                value: 'postgres',
            },
        },
        restartPolicy: 'always',
        settings: {
            image: `${Module.Postgres}:${tag}`,
            createOptions:
                '{"HostConfig":{"PortBindings":{"5432/tcp":[{"HostPort":"5432"}]}}}',
        },
        status,
        type: 'docker',
    };
};

export const API = (
    status: 'running' | 'stopped' = 'running',
    tag: string = 'latest',
) => {
    return {
        env: {
            DB_USERNAME: {
                value: 'postgres',
            },
            DB_HOST: {
                value: 'postgres',
            },
            DB_DATABASE: {
                value: 'postgres',
            },
            DB_PASSWORD: {
                value: 'P@ssw0rd!',
            },
        },
        restartPolicy: 'always',
        settings: {
            image: `tamtikorn.azurecr.io/${Module.API}:${tag}`,
            createOptions:
                '{"HostConfig":{"PortBindings":{"8000/tcp":[{"HostPort":"8000"}]}}}',
        },
        status,
        type: 'docker',
    };
};

export const DataLoggerAgent = (
    status: 'running' | 'stopped' = 'running',
    tag: string = 'latest',
) => {
    return {
        env: {
            DB_USERNAME: {
                value: 'postgres',
            },
            DB_HOST: {
                value: 'postgres',
            },
            DB_DATABASE: {
                value: 'postgres',
            },
            RABBITMQ_HOST: {
                value: 'rabbitmq',
            },
            DB_PASSWORD: {
                value: 'P@ssw0rd!',
            },
        },
        restartPolicy: 'always',
        settings: {
            image: `tamtikorn.azurecr.io/${Module.DataLoggerAgent}:${tag}`,
        },
        status,
        type: 'docker',
    };
};

export const IQASensorAgent = (
    status: 'running' | 'stopped' = 'running',
    tag: string = 'latest',
) => {
    return {
        env: {
            DB_USERNAME: {
                value: 'postgres',
            },
            DB_HOST: {
                value: 'postgres',
            },
            DB_DATABASE: {
                value: 'postgres',
            },
            RABBITMQ_HOST: {
                value: 'rabbitmq',
            },
            DB_PASSWORD: {
                value: 'P@ssw0rd!',
            },
        },
        restartPolicy: 'always',
        settings: {
            image: `tamtikorn.azurecr.io/${Module.IQASensorAgent}:${tag}`,
        },
        status,
        type: 'docker',
    };
};
