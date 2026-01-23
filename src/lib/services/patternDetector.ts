/**
 * Pattern detector service
 * Auto-detects common patterns from user-provided examples
 */

export interface DetectedPattern {
	pattern: RegExp;
	type: string;
	description: string;
}

interface PatternMatcher {
	name: string;
	description: string;
	test: RegExp;
	pattern: RegExp;
}

// Pattern matchers ordered by specificity (most specific first)
const patternMatchers: PatternMatcher[] = [
	// ISO 8601 timestamp with timezone
	{
		name: 'iso_timestamp',
		description: 'ISO 8601 timestamp',
		test: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z?$/,
		pattern: /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z?/g
	},
	// Grafana-style timestamp (date space time with ms)
	{
		name: 'grafana_timestamp',
		description: 'Grafana timestamp',
		test: /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\.\d{3}$/,
		pattern: /\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\.\d{3}/g
	},
	// Standard datetime (date space time)
	{
		name: 'datetime',
		description: 'Date and time',
		test: /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/,
		pattern: /\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}/g
	},
	// Date only
	{
		name: 'date',
		description: 'Date (YYYY-MM-DD)',
		test: /^\d{4}-\d{2}-\d{2}$/,
		pattern: /\d{4}-\d{2}-\d{2}/g
	},
	// UUID
	{
		name: 'uuid',
		description: 'UUID',
		test: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
		pattern: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi
	},
	// Email
	{
		name: 'email',
		description: 'Email address',
		test: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
		pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
	},
	// URL
	{
		name: 'url',
		description: 'URL',
		test: /^https?:\/\/[^\s]+$/,
		pattern: /https?:\/\/[^\s]+/g
	},
	// IPv4
	{
		name: 'ipv4',
		description: 'IPv4 address',
		test: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
		pattern: /(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/g
	},
	// Time only (HH:MM:SS with optional ms)
	{
		name: 'time',
		description: 'Time (HH:MM:SS)',
		test: /^\d{2}:\d{2}:\d{2}(\.\d{1,3})?$/,
		pattern: /\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?/g
	},
	// Integer
	{
		name: 'integer',
		description: 'Integer number',
		test: /^-?\d+$/,
		pattern: /-?\d+/g
	},
	// Decimal number
	{
		name: 'decimal',
		description: 'Decimal number',
		test: /^-?\d+\.\d+$/,
		pattern: /-?\d+\.\d+/g
	}
];

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Detect pattern from a user-provided example
 * @param example - The example string to analyze
 * @returns Detected pattern info with regex, type name, and description
 */
export function detectPattern(example: string): DetectedPattern {
	const trimmed = example.trim();

	// Try each pattern matcher
	for (const matcher of patternMatchers) {
		if (matcher.test.test(trimmed)) {
			return {
				pattern: matcher.pattern,
				type: matcher.name,
				description: matcher.description
			};
		}
	}

	// Fallback: escape the literal string and use as exact match
	const escaped = escapeRegex(trimmed);
	return {
		pattern: new RegExp(escaped, 'g'),
		type: 'literal',
		description: 'Exact match'
	};
}

/**
 * Get all available pattern types for documentation/UI
 */
export function getAvailablePatternTypes(): { name: string; description: string }[] {
	return patternMatchers.map((m) => ({
		name: m.name,
		description: m.description
	}));
}
