/**
 * Transformation operation types
 */
export type TransformationType =
	| 'remove_blank_lines'
	| 'trim_lines'
	| 'wrap_code_block'
	| 'add_prefix'
	| 'add_suffix'
	| 'regex_replace'
	| 'to_uppercase'
	| 'to_lowercase'
	| 'remove_duplicates'
	| 'sort_lines'
	| 'reverse_lines'
	| 'number_lines'
	| 'indent'
	| 'dedent';

/**
 * Base transformation operation
 */
export interface BaseTransformation {
	id: string;
	type: TransformationType;
	enabled: boolean;
	order: number;
}

/**
 * Simple operation with no parameters
 */
export interface SimpleTransformation extends BaseTransformation {
	type:
		| 'remove_blank_lines'
		| 'trim_lines'
		| 'to_uppercase'
		| 'to_lowercase'
		| 'remove_duplicates'
		| 'sort_lines'
		| 'reverse_lines';
}

/**
 * Operation with string parameter
 */
export interface StringTransformation extends BaseTransformation {
	type: 'add_prefix' | 'add_suffix' | 'wrap_code_block';
	value: string;
}

/**
 * Regex-based transformation
 */
export interface RegexTransformation extends BaseTransformation {
	type: 'regex_replace';
	pattern: string;
	replacement: string;
	flags: string; // 'g', 'gi', 'gm', etc.
}

/**
 * Number-based operations
 */
export interface NumberTransformation extends BaseTransformation {
	type: 'number_lines' | 'indent' | 'dedent';
	value: number;
}

/**
 * Union type of all transformations
 */
export type Transformation =
	| SimpleTransformation
	| StringTransformation
	| RegexTransformation
	| NumberTransformation;

/**
 * Template model
 */
export interface Template {
	id: string;
	name: string;
	description: string;
	transformations: Transformation[];
	starred: boolean;
	category?: string;
	tags?: string[];
	createdAt: string; // ISO timestamp
	updatedAt: string; // ISO timestamp
	usageCount: number;
}

/**
 * Template with metadata for display
 */
export interface TemplateWithMeta extends Template {
	lastUsed?: string; // ISO timestamp
}
