import type { PlayniteMediaFilesContext } from "./playnite-media-files-context";
import type { MakePlayniteMediaFilesContextProps } from "./playnite-media-files-context.types";

export type IPlayniteMediaFilesContextFactoryPort = {
	buildContext: (props: MakePlayniteMediaFilesContextProps) => PlayniteMediaFilesContext;
};
