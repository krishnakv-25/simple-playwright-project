import 'dotenv/config';

/**
 * Centralized environment configuration.
 * Supports multiple environments via ENV variable: dev | staging | prod
 * Falls back to sensible public-demo defaults so the suite runs out of the box.
 */

export type Environment = 'dev' | 'staging' | 'prod';

interface EnvConfig {
  env: Environment;
  baseUrl: string;
  apiBaseUrl: string;
  defaultUser: {
    username: string;
    password: string;
  };
  headless: boolean;
  retries: number;
  workers: number | undefined;
  slowMo: number;
}

const environments: Record<Environment, Omit<EnvConfig, 'env' | 'headless' | 'retries' | 'workers' | 'slowMo'>> = {
  dev: {
    baseUrl: 'https://www.saucedemo.com',
    apiBaseUrl: 'https://dummyjson.com',
    defaultUser: { username: 'standard_user', password: 'secret_sauce' },
  },
  staging: {
    baseUrl: 'https://www.saucedemo.com',
    apiBaseUrl: 'https://dummyjson.com',
    defaultUser: { username: 'standard_user', password: 'secret_sauce' },
  },
  prod: {
    baseUrl: 'https://www.saucedemo.com',
    apiBaseUrl: 'https://dummyjson.com',
    defaultUser: { username: 'standard_user', password: 'secret_sauce' },
  },
};

const currentEnv = (process.env.ENV as Environment) || 'dev';

export const config: EnvConfig = {
  env: currentEnv,
  ...environments[currentEnv],
  headless: process.env.HEADLESS !== 'false',
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  slowMo: Number(process.env.SLOW_MO ?? 0),
};
