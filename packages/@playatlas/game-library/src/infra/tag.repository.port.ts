import type { TagId } from "@playatlas/common/domain";
import type { IEntityRepositoryPort } from "@playatlas/common/infra";
import type { Tag } from "../domain/tag.entity";
import type { TagRepositoryFilters } from "./tag.repository.types";

export type ITagRepositoryPort = IEntityRepositoryPort<TagId, Tag, TagRepositoryFilters>;
