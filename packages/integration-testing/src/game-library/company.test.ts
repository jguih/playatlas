import type { CompanyResponseDto } from "@playatlas/game-library/dtos";
import { describe, expect, it } from "vitest";
import { api, factory, root } from "../vitest.global.setup";

describe("Game Library / Company", () => {
	it("persists a company", () => {
		// Arrange
		const company = factory.getCompanyFactory().build();
		root.seedCompany(company);

		// Act
		const result = api.gameLibrary.queries.getGetAllCompaniesQueryHandler().execute();
		const companies = result.type === "ok" ? result.data : [];
		const addedCompany = companies.find((c) => c.Id === company.getId());

		// Assert
		expect(addedCompany).toBeDefined();
		expect(addedCompany).toMatchObject({
			Id: company.getId(),
			Name: company.getName(),
		} satisfies CompanyResponseDto);
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
