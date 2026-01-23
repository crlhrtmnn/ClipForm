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
	| 'dedent'
	| 'capture_first_match'
	| 'capture_last_match'
	| 'capture_replace'
	| 'insert_captured'
	| 'json_beautify';

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
 * Capture transformation - captures first/last match of auto-detected pattern
 */
export interface CaptureTransformation extends BaseTransformation {
	type: 'capture_first_match' | 'capture_last_match';
	example: string; // User-provided example for auto-detect
	slotName: string; // Name of capture slot (e.g., "timestamp")
}

/**
 * Capture replace - replaces all matches of a captured pattern
 */
export interface CaptureReplaceTransformation extends BaseTransformation {
	type: 'capture_replace';
	slotName: string; // Which capture's pattern to use
	replacement: string; // What to replace with (default: "")
}

/**
 * Insert captured - inserts a captured value at start/end
 */
export interface InsertCapturedTransformation extends BaseTransformation {
	type: 'insert_captured';
	slotName: string;
	position: 'start' | 'end';
	format: string; // Template like "\n\nTimestamp: {value}"
}

/**
 * JSON beautify transformation
 */
export interface JsonTransformation extends BaseTransformation {
	type: 'json_beautify';
	indent: number; // Default: 2
}

/**
 * Captured value stored during transformation chain
 */
export interface CapturedValue {
	value: string;
	pattern: RegExp;
}

/**
 * Context passed through transformation chain
 */
export interface TransformContext {
	captures: Map<string, CapturedValue>;
}

/**
 * Union type of all transformations
 */
export type Transformation =
	| SimpleTransformation
	| StringTransformation
	| RegexTransformation
	| NumberTransformation
	| CaptureTransformation
	| CaptureReplaceTransformation
	| InsertCapturedTransformation
	| JsonTransformation;

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
	exampleText?: string; // Custom example text for preview
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
