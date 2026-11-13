import { tsdownConfig } from '@alessiofrittoli/package-configs/tsdown'
import { resolve } from 'path'

export default tsdownConfig(() => ({
	entry: ['src/**/index.(ts|tsx)'],
	tsconfig: resolve(process.cwd(), 'tsconfig.build.json'),
	checks: {
		moduleLevelDirective: false, // to suppress warnings about "use client" directives in non-entry modules
	},
}))
