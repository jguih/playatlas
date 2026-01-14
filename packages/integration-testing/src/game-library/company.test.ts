import { faker } from "@faker-js/faker";
import { describe, expect, it } from "vitest";
import { api, factory, root } from "../vitest.global.setup";

describe("Get All Companies Query Handler", () => {
	it("returns companies array", () => {
		// Arrange
		const queryResult = api.gameLibrary.queries.getGetAllCompaniesQueryHandler().execute();
		if (queryResult.type !== "ok") throw new Error("Invalid result");
		const companies = queryResult.data;
		const oneCompany = faker.helpers.arrayElement(companies);
		// Act
		const result = api.gameLibrary.queries.getGetAllCompaniesQueryHandler().execute();
		if (result.type !== "ok") throw new Error("Result type must be 'ok'");
		const oneResult = result.data.find((p) => p.Id === oneCompany.Id);
		// Assert
		expect(result.data.length === companies.length).toBeTruthy();
		expect(oneCompany.Id).toBe(oneResult?.Id);
		expect(oneCompany.Name).toBe(oneResult?.Name);
	});

	it("return 'not_modified' when provided a matching etag", () => {
		// Arrange
		// Act
		const firstResult = api.gameLibrary.queries.getGetAllCompaniesQueryHandler().execute();
		if (firstResult.type !== "ok") throw new Error("Invalid result");
		const secondResult = api.gameLibrary.queries
			.getGetAllCompaniesQueryHandler()
			.execute({ ifNoneMatch: firstResult.etag });
		// Assert
		expect(secondResult.type === "not_modified").toBeTruthy();
	});

	it("does not return 'not_modified' when company list changes after first call", () => {
		// Arrange
		const newCompany = factory.getCompanyFactory().build();
		// Act
		const firstResult = api.gameLibrary.queries.getGetAllCompaniesQueryHandler().execute();
		if (firstResult.type !== "ok") throw new Error("Invalid result");
		root.seedCompany(newCompany);
		const secondResult = api.gameLibrary.queries
			.getGetAllCompaniesQueryHandler()
			.execute({ ifNoneMatch: firstResult.etag });
		// Assert
		expect(secondResult.type === "not_modified").toBeFalsy();
		expect(
			secondResult.type === "ok" && secondResult.data.length === firstResult.data.length + 1,
		).toBeTruthy();
		expect(secondResult.type === "ok" && secondResult.etag !== firstResult.etag).toBeTruthy();
	});
});
