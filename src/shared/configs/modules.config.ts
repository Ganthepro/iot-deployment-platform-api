export const RabbitMQ = (status: 'running' | 'stopped' = 'running') => {
    return {
        restartPolicy: 'always',
        settings: {
            image: 'rabbitmq:4.0-management',
            createOptions:
                '{"HostConfig":{"PortBindings":{"5672/tcp":[{"HostPort":"5672"}],"15672/tcp":[{"HostPort":"15672"}]}}}',
        },
        status,
        type: 'docker',
    };
};

export const Postgres = (status: 'running' | 'stopped' = 'running') => {
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
            image: 'postgres:alpine3.20',
            createOptions:
                '{"HostConfig":{"PortBindings":{"5432/tcp":[{"HostPort":"5432"}]}}}',
        },
        status,
        type: 'docker',
    };
};

export const DataLoggerAgent = (
    tag: string,
    status: 'running' | 'stopped' = 'running',
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
            image: `tamtikorn.azurecr.io/tamtikorn/data-logger:${tag}`,
        },
        status,
        type: 'docker',
    };
};

export const IQASensorAgent = (
    tag: string,
    status: 'running' | 'stopped' = 'running',
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
            image: `tamtikorn.azurecr.io/tamtikorn/iaq-sensor:${tag}`,
        },
        status,
        type: 'docker',
    };
};
