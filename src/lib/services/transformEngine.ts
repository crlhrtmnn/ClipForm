import type {
	Transformation,
	SimpleTransformation,
	StringTransformation,
	RegexTransformation,
	NumberTransformation
} from '$lib/types/template';

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
 * Apply a single transformation to text
 */
export function applyTransformation(text: string, transformation: Transformation): string {
	if (!transformation.enabled) {
		return text;
	}

	switch (transformation.type) {
		case 'remove_blank_lines':
			return removeBlankLines(text);

		case 'trim_lines':
			return trimLines(text);

		case 'to_uppercase':
			return toUpperCase(text);

		case 'to_lowercase':
			return toLowerCase(text);

		case 'remove_duplicates':
			return removeDuplicates(text);

		case 'sort_lines':
			return sortLines(text);

		case 'reverse_lines':
			return reverseLines(text);

		case 'wrap_code_block':
			return wrapCodeBlock(text, (transformation as StringTransformation).value || '');

		case 'add_prefix':
			return addPrefix(text, (transformation as StringTransformation).value);

		case 'add_suffix':
			return addSuffix(text, (transformation as StringTransformation).value);

		case 'regex_replace': {
			const regexTrans = transformation as RegexTransformation;
			return regexReplace(text, regexTrans.pattern, regexTrans.replacement, regexTrans.flags);
		}

		case 'number_lines':
			return numberLines(text, (transformation as NumberTransformation).value || 1);

		case 'indent':
			return indent(text, (transformation as NumberTransformation).value || 2);

		case 'dedent':
			return dedent(text, (transformation as NumberTransformation).value || 2);

		default:
			return text;
	}
}

/**
 * Apply multiple transformations in order
 */
export function applyTransformations(text: string, transformations: Transformation[]): string {
	// Sort transformations by order
	const sorted = [...transformations]
		.filter((t) => t.enabled)
		.sort((a, b) => a.order - b.order);

	// Apply each transformation sequentially
	let result = text;
	for (const transformation of sorted) {
		try {
			result = applyTransformation(result, transformation);
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
		dedent: 'Dedent'
	};
	return names[type] || type;
}
