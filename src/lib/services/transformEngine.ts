import type {
	Transformation,
	SimpleTransformation,
	StringTransformation,
	RegexTransformation,
	NumberTransformation,
	CaptureTransformation,
	CaptureReplaceTransformation,
	InsertCapturedTransformation,
	JsonTransformation,
	TransformContext,
	CapturedValue
} from '$lib/types/template';
import { detectPattern } from './patternDetector';

/**
 * Remove all blank lines from text
 */
export function removeBlankLines(text: string): string {
	return text
		.split('\n')
		.filter((line) => line.trim() !== '')
		.join('\n');
}

/**
 * Trim whitespace from each line
 */
export function trimLines(text: string): string {
	return text
		.split('\n')
		.map((line) => line.trim())
		.join('\n');
}

/**
 * Convert text to uppercase
 */
export function toUpperCase(text: string): string {
	return text.toUpperCase();
}

/**
 * Convert text to lowercase
 */
export function toLowerCase(text: string): string {
	return text.toLowerCase();
}

/**
 * Remove duplicate lines
 */
export function removeDuplicates(text: string): string {
	const lines = text.split('\n');
	const seen = new Set<string>();
	const result: string[] = [];

	for (const line of lines) {
		if (!seen.has(line)) {
			seen.add(line);
			result.push(line);
		}
	}

	return result.join('\n');
}

/**
 * Sort lines alphabetically
 */
export function sortLines(text: string): string {
	return text.split('\n').sort().join('\n');
}

/**
 * Reverse line order
 */
export function reverseLines(text: string): string {
	return text.split('\n').reverse().join('\n');
}

/**
 * Wrap text in code block
 */
export function wrapCodeBlock(text: string, language: string = ''): string {
	return `\`\`\`${language}\n${text}\n\`\`\``;
}

/**
 * Add prefix to each line
 */
export function addPrefix(text: string, prefix: string): string {
	return text
		.split('\n')
		.map((line) => `${prefix}${line}`)
		.join('\n');
}

/**
 * Add suffix to each line
 */
export function addSuffix(text: string, suffix: string): string {
	return text
		.split('\n')
		.map((line) => `${line}${suffix}`)
		.join('\n');
}

/**
 * Apply regex replacement
 */
export function regexReplace(text: string, pattern: string, replacement: string, flags: string): string {
	try {
		const regex = new RegExp(pattern, flags);
		return text.replace(regex, replacement);
	} catch (error) {
		throw new Error(`Invalid regex pattern: ${pattern}`);
	}
}

/**
 * Number lines
 */
export function numberLines(text: string, startFrom: number = 1): string {
	const lines = text.split('\n');
	return lines.map((line, index) => `${index + startFrom}. ${line}`).join('\n');
}

/**
 * Indent lines
 */
export function indent(text: string, spaces: number = 2): string {
	const indentation = ' '.repeat(spaces);
	return text
		.split('\n')
		.map((line) => `${indentation}${line}`)
		.join('\n');
}

/**
 * Dedent lines
 */
export function dedent(text: string, spaces: number = 2): string {
	return text
		.split('\n')
		.map((line) => {
			// Remove up to 'spaces' leading spaces
			let removed = 0;
			let i = 0;
			while (i < line.length && line[i] === ' ' && removed < spaces) {
				i++;
				removed++;
			}
			return line.slice(i);
		})
		.join('\n');
}

/**
 * Create an empty transform context
 */
export function createContext(): TransformContext {
	return { captures: new Map() };
}

/**
 * Capture first match of a pattern and store in context
 */
export function captureFirstMatch(
	text: string,
	context: TransformContext,
	example: string,
	slotName: string
): { text: string; context: TransformContext } {
	const detected = detectPattern(example);
	const matches = text.match(detected.pattern);

	if (matches && matches.length > 0) {
		context.captures.set(slotName, {
			value: matches[0],
			pattern: detected.pattern
		});
	}

	return { text, context };
}

/**
 * Capture last match of a pattern and store in context
 */
export function captureLastMatch(
	text: string,
	context: TransformContext,
	example: string,
	slotName: string
): { text: string; context: TransformContext } {
	const detected = detectPattern(example);
	const matches = text.match(detected.pattern);

	if (matches && matches.length > 0) {
		context.captures.set(slotName, {
			value: matches[matches.length - 1],
			pattern: detected.pattern
		});
	}

	return { text, context };
}

/**
 * Replace all matches of a captured pattern
 */
export function captureReplace(
	text: string,
	context: TransformContext,
	slotName: string,
	replacement: string = ''
): { text: string; context: TransformContext } {
	const captured = context.captures.get(slotName);
	if (!captured) {
		console.warn(`No captured value found for slot: ${slotName}`);
		return { text, context };
	}

	// Create a fresh regex with global flag to replace all occurrences
	const pattern = new RegExp(captured.pattern.source, 'g');
	const result = text.replace(pattern, replacement);

	return { text: result, context };
}

/**
 * Insert a captured value at start or end
 */
export function insertCaptured(
	text: string,
	context: TransformContext,
	slotName: string,
	position: 'start' | 'end',
	format: string = '{value}'
): { text: string; context: TransformContext } {
	const captured = context.captures.get(slotName);
	if (!captured) {
		console.warn(`No captured value found for slot: ${slotName}`);
		return { text, context };
	}

	const insertText = format.replace(/\{value\}/g, captured.value);

	if (position === 'start') {
		return { text: insertText + text, context };
	} else {
		return { text: text + insertText, context };
	}
}

/**
 * Beautify JSON objects in text
 */
export function jsonBeautify(text: string, indentSpaces: number = 2): string {
	const lines = text.split('\n');
	const result: string[] = [];

	for (const line of lines) {
		const trimmed = line.trim();
		if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
			try {
				const parsed = JSON.parse(trimmed);
				result.push(JSON.stringify(parsed, null, indentSpaces));
			} catch {
				// Not valid JSON, keep original line
				result.push(line);
			}
		} else {
			result.push(line);
		}
	}

	return result.join('\n');
}

/**
 * Validate regex pattern
 */
export function validateRegex(pattern: string, flags: string = ''): boolean {
	try {
		new RegExp(pattern, flags);
		return true;
	} catch {
		return false;
	}
}

/**
 * Apply a single transformation to text (with context for capture operations)
 */
export function applyTransformationWithContext(
	text: string,
	transformation: Transformation,
	context: TransformContext
): { text: string; context: TransformContext } {
	if (!transformation.enabled) {
		return { text, context };
	}

	switch (transformation.type) {
		case 'remove_blank_lines':
			return { text: removeBlankLines(text), context };

		case 'trim_lines':
			return { text: trimLines(text), context };

		case 'to_uppercase':
			return { text: toUpperCase(text), context };

		case 'to_lowercase':
			return { text: toLowerCase(text), context };

		case 'remove_duplicates':
			return { text: removeDuplicates(text), context };

		case 'sort_lines':
			return { text: sortLines(text), context };

		case 'reverse_lines':
			return { text: reverseLines(text), context };

		case 'wrap_code_block':
			return { text: wrapCodeBlock(text, (transformation as StringTransformation).value || ''), context };

		case 'add_prefix':
			return { text: addPrefix(text, (transformation as StringTransformation).value), context };

		case 'add_suffix':
			return { text: addSuffix(text, (transformation as StringTransformation).value), context };

		case 'regex_replace': {
			const regexTrans = transformation as RegexTransformation;
			return { text: regexReplace(text, regexTrans.pattern, regexTrans.replacement, regexTrans.flags), context };
		}

		case 'number_lines':
			return { text: numberLines(text, (transformation as NumberTransformation).value || 1), context };

		case 'indent':
			return { text: indent(text, (transformation as NumberTransformation).value || 2), context };

		case 'dedent':
			return { text: dedent(text, (transformation as NumberTransformation).value || 2), context };

		case 'capture_first_match': {
			const captureTrans = transformation as CaptureTransformation;
			return captureFirstMatch(text, context, captureTrans.example, captureTrans.slotName);
		}

		case 'capture_last_match': {
			const captureTrans = transformation as CaptureTransformation;
			return captureLastMatch(text, context, captureTrans.example, captureTrans.slotName);
		}

		case 'capture_replace': {
			const replaceTrans = transformation as CaptureReplaceTransformation;
			return captureReplace(text, context, replaceTrans.slotName, replaceTrans.replacement);
		}

		case 'insert_captured': {
			const insertTrans = transformation as InsertCapturedTransformation;
			return insertCaptured(text, context, insertTrans.slotName, insertTrans.position, insertTrans.format);
		}

		case 'json_beautify': {
			const jsonTrans = transformation as JsonTransformation;
			return { text: jsonBeautify(text, jsonTrans.indent || 2), context };
		}

		default:
			return { text, context };
	}
}

/**
 * Apply a single transformation to text (backward compatible, no context)
 */
export function applyTransformation(text: string, transformation: Transformation): string {
	const context = createContext();
	return applyTransformationWithContext(text, transformation, context).text;
}

/**
 * Apply multiple transformations in order (with context threading)
 */
export function applyTransformations(text: string, transformations: Transformation[]): string {
	// Sort transformations by order
	const sorted = [...transformations]
		.filter((t) => t.enabled)
		.sort((a, b) => a.order - b.order);

	// Apply each transformation sequentially with context
	let result = text;
	let context = createContext();

	for (const transformation of sorted) {
		try {
			const output = applyTransformationWithContext(result, transformation, context);
			result = output.text;
			context = output.context;
		} catch (error) {
			console.error(`Error applying transformation ${transformation.type}:`, error);
			throw error;
		}
	}

	return result;
}

/**
 * Get human-readable name for transformation type
 */
export function getTransformationName(type: string): string {
	const names: Record<string, string> = {
		remove_blank_lines: 'Remove Blank Lines',
		trim_lines: 'Trim Lines',
		to_uppercase: 'To Uppercase',
		to_lowercase: 'To Lowercase',
		remove_duplicates: 'Remove Duplicates',
		sort_lines: 'Sort Lines',
		reverse_lines: 'Reverse Lines',
		wrap_code_block: 'Wrap in Code Block',
		add_prefix: 'Add Prefix',
		add_suffix: 'Add Suffix',
		regex_replace: 'Regex Replace',
		number_lines: 'Number Lines',
		indent: 'Indent',
		dedent: 'Dedent',
		capture_first_match: 'Capture First Match',
		capture_last_match: 'Capture Last Match',
		capture_replace: 'Capture Replace',
		insert_captured: 'Insert Captured',
		json_beautify: 'JSON Beautify'
	};
	return names[type] || type;
}
