import { createContext } from "svelte";
import type { ClientApi } from "./client-api";

export type ClientApiGetter = () => ClientApi;

export const [getClientApiContext, setClientApiContext] = createContext<ClientApiGetter>();
