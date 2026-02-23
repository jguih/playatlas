import type { IClockPort, IPlayAtlasSyncStatePort } from "$lib/modules/common/application";
import { SyncRunner } from "./sync-runner";

describe("Sync Runner", () => {
	const clock: IClockPort = {
		now: () => new Date(),
	};
	const syncState: IPlayAtlasSyncStatePort = {
		getLastServerSyncCursor: vi.fn(),
		setLastServerSyncCursor: vi.fn(),
	};
	const sut = new SyncRunner({ clock, syncState });

	it("only calls persist if fetched data contains more than 0 items", async () => {
		// Arrange
		const persistAsync = vi.fn();

		// Act
		await sut.runAsync({
			syncTarget: "games",
			fetchAsync: async () => ({ items: [], nextCursor: "", success: true }),
			mapDtoToEntity: vi.fn(),
			persistAsync,
		});

		// Assert
		expect(persistAsync).not.toHaveBeenCalled();
	});
});
