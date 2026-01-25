import { createContext } from "svelte";
import type { ClientApiV1 } from "./client-api.v1";

export type ClientApiGetter = () => ClientApiV1;

export const [getClientApiContext, setClientApiContext] = createContext<ClientApiGetter>();
