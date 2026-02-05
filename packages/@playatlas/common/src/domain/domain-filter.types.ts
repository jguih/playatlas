export type DateFilter =
	| { op: "between"; start: Date; end: Date }
	| { op: "gte"; value: Date }
	| { op: "lte"; value: Date }
	| { op: "eq"; value: Date }
	| { op: "overlaps"; start: Date; end: Date };
