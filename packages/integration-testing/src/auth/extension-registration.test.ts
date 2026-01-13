import { faker } from "@faker-js/faker";
import {
  ApproveExtensionRegistrationCommand,
  RegisterExtensionCommand,
  RejectExtensionRegistrationCommand,
  RevokeExtensionRegistrationCommand,
} from "@playatlas/auth/commands";
import { ExtensionRegistration } from "@playatlas/auth/domain";
import { DomainEvent } from "@playatlas/common/application";
import { api, factory } from "../vitest.global.setup";

const buildRegisterCommand = (): {
  registration: ExtensionRegistration;
  command: RegisterExtensionCommand;
} => {
  const registration = factory.getExtensionRegistrationFactory().build();
  const command: RegisterExtensionCommand = {
    extensionId: registration.getExtensionId(),
    publicKey: registration.getPublicKey(),
    extensionVersion: registration.getExtensionVersion(),
    hostname: registration.getHostname(),
    os: registration.getOs(),
  };
  return { registration, command };
};

const recordDomainEvents = () => {
  const events: DomainEvent[] = [];
  api.getEventBus().subscribe((event) => events.push(event));
  return events;
};

describe("Auth / Extension Registration", () => {
  it("approves an extension registration", () => {
    // Arrange
    const recordedEvents = recordDomainEvents();

    const { command } = buildRegisterCommand();
    const registerResult = api.auth.commands
      .getRegisterExtensionCommandHandler()
      .execute(command);
    const registrationId = registerResult.success
      ? registerResult.registrationId
      : null;
    expect(registrationId).toBeDefined();

    // Act
    const approveResult = api.auth.commands
      .getApproveExtensionRegistrationCommandHandler()
      .execute({ registrationId: registrationId! });
    const queryResult = api.auth.queries
      .getGetAllExtensionRegistrationsQueryHandler()
      .execute();
    const registrations = queryResult.type === "ok" ? queryResult.data : [];
    const approved = registrations.find((r) => r.Id === registrationId);

    // Assert
    expect(approved?.Status).toBe("trusted");
    expect(queryResult.type).not.toBe("not_modified");

    expect(registerResult.success).toBe(true);
    expect(registerResult.reason_code).toBe("extension_registered");

    expect(approveResult.success).toBe(true);
    expect(approveResult.reason_code).toBe("extension_registration_approved");

    expect(recordedEvents).toHaveLength(1);
    expect(recordedEvents).toEqual([
      expect.objectContaining({
        name: "extension-registration-approved",
        payload: { registrationId: registrationId! },
      } satisfies Partial<DomainEvent>),
    ]);
  });

  it("gracefully handles rejecting a registration that doesn't exist", () => {
    // Arrange
    const recordedEvents = recordDomainEvents();

    // Act
    const rejectResult = api.auth.commands
      .getRejectExtensionRegistrationCommandHandler()
      .execute({ registrationId: faker.number.int() });
    const queryResult = api.auth.queries
      .getGetAllExtensionRegistrationsQueryHandler()
      .execute();
    const registrations = queryResult.type === "ok" ? queryResult.data : [];

    // Assert
    expect(rejectResult.success).toBe(false);
    expect(rejectResult.reason_code).toBe("not_found");

    expect(queryResult.type).toBe("ok");
    expect(registrations).toHaveLength(0);

    expect(recordedEvents).toHaveLength(0);
  });

  it("gracefully handles approving a registration that doesn't exist", () => {
    // Arrange
    const recordedEvents = recordDomainEvents();

    // Act
    const approveResult = api.auth.commands
      .getApproveExtensionRegistrationCommandHandler()
      .execute({ registrationId: faker.number.int() });
    const queryResult = api.auth.queries
      .getGetAllExtensionRegistrationsQueryHandler()
      .execute();
    const registrations = queryResult.type === "ok" ? queryResult.data : [];

    // Assert
    expect(approveResult.success).toBe(false);
    expect(approveResult.reason_code).toBe("not_found");

    expect(queryResult.type).toBe("ok");
    expect(registrations).toHaveLength(0);

    expect(recordedEvents).toHaveLength(0);
  });

  it("gracefully handles revoking a registration that doesn't exist", () => {
    // Arrange
    const recordedEvents = recordDomainEvents();

    // Act
    const revokeResult = api.auth.commands
      .getRevokeExtensionRegistrationCommandHandler()
      .execute({ registrationId: faker.number.int() });
    const queryResult = api.auth.queries
      .getGetAllExtensionRegistrationsQueryHandler()
      .execute();
    const registrations = queryResult.type === "ok" ? queryResult.data : [];

    // Assert
    expect(revokeResult.success).toBe(false);
    expect(revokeResult.reason_code).toBe("not_found");

    expect(queryResult.type).toBe("ok");
    expect(registrations).toHaveLength(0);

    expect(recordedEvents).toHaveLength(0);
  });

  it("gracefully handles approving an already approved registration", () => {
    // Arrange
    const recordedEvents = recordDomainEvents();

    const { command } = buildRegisterCommand();
    const registerResult = api.auth.commands
      .getRegisterExtensionCommandHandler()
      .execute(command);
    const registrationId = registerResult.success
      ? registerResult.registrationId
      : null;
    expect(registrationId).toBeDefined();

    const approveCommand: ApproveExtensionRegistrationCommand = {
      registrationId: registrationId!,
    };

    // Act
    const approveResult1 = api.auth.commands
      .getApproveExtensionRegistrationCommandHandler()
      .execute(approveCommand);
    const approveResult2 = api.auth.commands
      .getApproveExtensionRegistrationCommandHandler()
      .execute(approveCommand);
    const queryResult = api.auth.queries
      .getGetAllExtensionRegistrationsQueryHandler()
      .execute();
    const registrations = queryResult.type === "ok" ? queryResult.data : [];

    // Assert
    expect(approveResult1.success).toBe(true);
    expect(approveResult1.reason_code).toBe("extension_registration_approved");

    expect(approveResult2.success).toBe(true);
    expect(approveResult2.reason_code).toBe(
      "extension_registration_already_approved"
    );

    expect(queryResult.type).toBe("ok");
    expect(registrations).toHaveLength(1);
    expect(registrations[0].Status).toBe("trusted");

    expect(recordedEvents).toHaveLength(1);
    expect(recordedEvents).toEqual([
      expect.objectContaining({
        name: "extension-registration-approved",
        payload: { registrationId: registrationId! },
      } satisfies Partial<DomainEvent>),
    ]);
  });

  it("does not approve rejected extension registration", () => {
    // Arrange
    const recordedEvents = recordDomainEvents();

    const { command } = buildRegisterCommand();
    const registerResult = api.auth.commands
      .getRegisterExtensionCommandHandler()
      .execute(command);
    const registrationId = registerResult.success
      ? registerResult.registrationId
      : null;
    expect(registrationId).toBeDefined();

    const rejectCommand: RejectExtensionRegistrationCommand = {
      registrationId: registrationId!,
    };
    const approveCommand: ApproveExtensionRegistrationCommand = {
      registrationId: registrationId!,
    };

    // Act
    const rejectResult = api.auth.commands
      .getRejectExtensionRegistrationCommandHandler()
      .execute(rejectCommand);
    const approveResult = api.auth.commands
      .getApproveExtensionRegistrationCommandHandler()
      .execute(approveCommand);
    const queryResult = api.auth.queries
      .getGetAllExtensionRegistrationsQueryHandler()
      .execute();
    const registrations = queryResult.type === "ok" ? queryResult.data : [];

    // Assert
    expect(rejectResult.success).toBe(true);
    expect(rejectResult.reason_code).toBe("extension_registration_rejected");

    expect(approveResult.success).toBe(false);
    expect(approveResult.reason_code).toBe(
      "cannot_approve_rejected_registration"
    );

    expect(queryResult.type).toBe("ok");
    expect(registrations).toHaveLength(1);
    expect(registrations[0].Status).toBe("rejected");

    expect(recordedEvents).toHaveLength(1);
    expect(recordedEvents).toEqual([
      expect.objectContaining({
        name: "extension-registration-rejected",
        payload: { registrationId: registrationId! },
      } satisfies Partial<DomainEvent>),
    ]);
  });

  it("revokes approved extension registration", () => {
    // Arrange
    const recordedEvents = recordDomainEvents();

    const { command } = buildRegisterCommand();
    const registerResult = api.auth.commands
      .getRegisterExtensionCommandHandler()
      .execute(command);
    const registrationId = registerResult.success
      ? registerResult.registrationId
      : null;
    expect(registrationId).toBeDefined();

    const approveCommand: ApproveExtensionRegistrationCommand = {
      registrationId: registrationId!,
    };
    const revokeCommand: RevokeExtensionRegistrationCommand = {
      registrationId: registrationId!,
    };

    // Act
    const approveResult = api.auth.commands
      .getApproveExtensionRegistrationCommandHandler()
      .execute(approveCommand);
    const revokeResult = api.auth.commands
      .getRevokeExtensionRegistrationCommandHandler()
      .execute(revokeCommand);
    const queryResult = api.auth.queries
      .getGetAllExtensionRegistrationsQueryHandler()
      .execute();
    const registrations = queryResult.type === "ok" ? queryResult.data : [];

    // Assert
    expect(approveResult.success).toBe(true);
    expect(approveResult.reason_code).toBe("extension_registration_approved");

    expect(revokeResult.success).toBe(true);
    expect(revokeResult.reason_code).toBe("extension_registration_revoked");

    expect(queryResult.type).toBe("ok");
    expect(registrations).toHaveLength(1);
    expect(registrations[0].Status).toBe("rejected");

    expect(recordedEvents).toHaveLength(2);
    expect(recordedEvents).toEqual([
      expect.objectContaining({
        name: "extension-registration-approved",
        payload: { registrationId: registrationId! },
      } satisfies Partial<DomainEvent>),
      expect.objectContaining({
        name: "extension-registration-revoked",
        payload: { registrationId: registrationId! },
      } satisfies Partial<DomainEvent>),
    ]);
  });
});
