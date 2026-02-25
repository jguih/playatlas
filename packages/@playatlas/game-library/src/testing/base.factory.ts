import { faker } from "@faker-js/faker";

export const makeBaseTestFactory = () => {
	const pickMany = <T>(options: readonly T[], { min, max }: { min: number; max: number }) =>
		faker.helpers.arrayElements(options, { min, max });

	const pickOne = <T>(options: readonly T[]) => faker.helpers.arrayElement(options);

	/**
	 * Allows setting `null` values from override props.
	 * Return prop when not `undefined` or `value` otherwise.
	 *
	 * @param value Non-optional value. Used if `prop` is `undefined`.
	 * @param prop Optional override prop. Used over `value` if not `undefined`.
	 * @returns
	 */
	const p = <T, V>(value: V, prop?: T) => {
		if (prop === undefined) return value;
		return prop;
	};

	return {
		pickMany,
		pickOne,
		p,
	};
};
