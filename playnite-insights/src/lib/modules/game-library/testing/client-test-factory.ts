import { faker } from "@faker-js/faker";

export class ClientTestFactory {
	protected pickOne = <T>(...args: T[]): T => {
		return faker.helpers.arrayElement(args);
	};
}
