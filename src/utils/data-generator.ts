import { faker } from '@faker-js/faker';

/**
 * Test data factory — generates realistic, randomized data per test run
 * to avoid brittle hardcoded fixtures and reduce cross-test collisions.
 */
export const DataGenerator = {
  user() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      zipCode: faker.location.zipCode('#####'),
    };
  },

  checkoutInfo() {
    const { firstName, lastName, zipCode } = this.user();
    return { firstName, lastName, postalCode: zipCode };
  },

  apiUser() {
    return {
      name: faker.person.fullName(),
      job: faker.person.jobTitle(),
    };
  },

  randomInt(min: number, max: number): number {
    return faker.number.int({ min, max });
  },
};
