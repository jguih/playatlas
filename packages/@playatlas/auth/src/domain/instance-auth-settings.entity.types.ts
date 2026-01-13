import type z from "zod";
import type {
  buildInstanceAuthSettingsPropsSchema,
  makeInstanceAuthSettingsPropsSchema,
  rehydrateInstanceAuthSettingsPropsSchema,
} from "./instance-auth-settings.entity.schemas";

export type BuildInstanceAuthSettingsProps = z.infer<
  typeof buildInstanceAuthSettingsPropsSchema
>;
export type MakeInstanceAuthSettingsProps = z.infer<
  typeof makeInstanceAuthSettingsPropsSchema
>;
export type RehydrateInstanceAuthSettingsProps = z.infer<
  typeof rehydrateInstanceAuthSettingsPropsSchema
>;
