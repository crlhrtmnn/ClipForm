import { diff_match_patch, DIFF_DELETE, DIFF_INSERT, DIFF_EQUAL } from 'diff-match-patch';

export type DiffType = 'added' | 'removed' | 'unchanged';

export interface DiffLine {
	type: DiffType;
	content: string;
	lineNumber?: number;
}

export interface DiffResult {
	original: DiffLine[];
	transformed: DiffLine[];
}

/**
 * Generate line-by-line diff between original and transformed text
 */
export function generateDiff(original: string, transformed: string): DiffResult {
	const dmp = new diff_match_patch();

	// Generate character-level diff
	const diffs = dmp.diff_main(original, transformed);
	dmp.diff_cleanupSemantic(diffs);

	const originalLines: DiffLine[] = [];
	const transformedLines: DiffLine[] = [];

	let originalLineNumber = 1;
	let transformedLineNumber = 1;

	// Process diffs to create line-by-line comparison
	for (const [operation, text] of diffs) {
		const lines = text.split('\n');

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const isLastLine = i === lines.length - 1;

			// Skip empty last line from split
			if (isLastLine && line === '' && lines.length > 1) {
				continue;
			}

			switch (operation) {
				case DIFF_DELETE:
					originalLines.push({
						type: 'removed',
						content: line,
						lineNumber: originalLineNumber++
					});
					break;

				case DIFF_INSERT:
					transformedLines.push({
						type: 'added',
						content: line,
						lineNumber: transformedLineNumber++
					});
					break;

				case DIFF_EQUAL:
					originalLines.push({
						type: 'unchanged',
						content: line,
						lineNumber: originalLineNumber++
					});
					transformedLines.push({
						type: 'unchanged',
						content: line,
						lineNumber: transformedLineNumber++
					});
					break;
			}
		}
	}

	return {
		original: originalLines,
		transformed: transformedLines
	};
}

/**
 * Simple line-by-line diff (faster for very large texts)
 */
export function generateSimpleDiff(original: string, transformed: string): DiffResult {
	const originalLines = original.split('\n');
	const transformedLines = transformed.split('\n');

	const originalResult: DiffLine[] = originalLines.map((line, index) => ({
		type: 'unchanged' as DiffType,
		content: line,
		lineNumber: index + 1
	}));

	const transformedResult: DiffLine[] = transformedLines.map((line, index) => ({
		type: 'unchanged' as DiffType,
		content: line,
		lineNumber: index + 1
	}));

	// Mark changed lines (simple comparison)
	const maxLen = Math.max(originalLines.length, transformedLines.length);
	for (let i = 0; i < maxLen; i++) {
		if (i >= originalLines.length) {
			transformedResult[i].type = 'added';
		} else if (i >= transformedLines.length) {
			originalResult[i].type = 'removed';
		} else if (originalLines[i] !== transformedLines[i]) {
			originalResult[i].type = 'removed';
			transformedResult[i].type = 'added';
		}
	}

	return {
		original: originalResult,
		transformed: transformedResult
	};
}

/**
 * Get diff statistics
 */
export interface DiffStats {
	originalLines: number;
	transformedLines: number;
	added: number;
	removed: number;
	unchanged: number;
}

export function getDiffStats(diff: DiffResult): DiffStats {
	return {
		originalLines: diff.original.length,
		transformedLines: diff.transformed.length,
		added: diff.transformed.filter((line) => line.type === 'added').length,
		removed: diff.original.filter((line) => line.type === 'removed').length,
		unchanged: diff.transformed.filter((line) => line.type === 'unchanged').length
	};
}
