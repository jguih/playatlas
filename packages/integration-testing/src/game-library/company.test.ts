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
		const companies = factory.getCompanyFactory().buildList(500);
		root.seedCompany(companies);

		// Act
		const firstResult = api.gameLibrary.queries.getGetAllCompaniesQueryHandler().execute();
		const firstEtag = firstResult.type === "ok" ? firstResult.etag : null;

		const secondResult = api.gameLibrary.queries
			.getGetAllCompaniesQueryHandler()
			.execute({ ifNoneMatch: firstEtag });

		// Assert
		expect(secondResult.type === "not_modified").toBeTruthy();
	});

	it("does not return 'not_modified' when company list changes after first call", () => {
		// Arrange
		const companies = factory.getCompanyFactory().buildList(500);
		root.seedCompany(companies);

		// Act
		const firstResult = api.gameLibrary.queries.getGetAllCompaniesQueryHandler().execute();
		const firstEtag = firstResult.type === "ok" ? firstResult.etag : null;
		const firstData = firstResult.type === "ok" ? firstResult.data : [];

		const newCompanies = factory.getCompanyFactory().buildList(500);
		root.seedCompany(newCompanies);

		const secondResult = api.gameLibrary.queries
			.getGetAllCompaniesQueryHandler()
			.execute({ ifNoneMatch: firstEtag });
		const secondEtag = secondResult.type === "ok" ? secondResult.etag : null;
		const secondData = secondResult.type === "ok" ? secondResult.data : [];

		// Assert
		expect(secondResult.type).not.toBe("not_modified");
		expect(secondData).toHaveLength(firstData.length + 500);
		expect(secondEtag).not.toBe(firstEtag);
	});
});
