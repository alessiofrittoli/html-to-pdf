import type {
	Browser as Engine,
	Page as Renderer,
	FrameAddStyleTagOptions as _FrameAddStyleTagOptions,
	HTTPResponse,
	PDFOptions,
	PDFMargin as _PDFMargin,
} from 'puppeteer'
import {
	binaryToString,
	coerceToUint8Array,
	type CoerceToUint8ArrayInput,
} from '@alessiofrittoli/crypto-buffer'
import { Url, type UrlInput } from '@alessiofrittoli/url-utils'
import { existsSync, mkdirSync } from 'fs'
import { dirname } from 'path'

export type PDFMargin = _PDFMargin
export type StyleTagOptions = _FrameAddStyleTagOptions
export type StyleTagsOptions = StyleTagOptions[]

export interface GeneratePdfOptions extends PDFOptions {
	/**
	 * Load additional styles.
	 *
	 */
	styles?: StyleTagsOptions
	/**
	 * Inline CSS properties into the style attribute in an html document.
	 *
	 * @default true
	 */
	inlineCss?: boolean
	/**
	 * Wait requests to be done.
	 *
	 * e.g [ 'fonts.googleapis.com', 'fonts.gstatic.com' ]
	 */
	waitRequests?: string[]
	/**
	 * Content to render in the PDF.
	 *
	 */
	content?: CoerceToUint8ArrayInput | ReadableStream<Buffer>
	/**
	 * An URL used to set content from.
	 *
	 */
	url?: UrlInput
	/**
	 * Set to `true` to print background graphics.
	 *
	 * @default true
	 */
	printBackground?: boolean
}

// Puppeteer doc - https://pptr.dev/category/introduction

/**
 * Create a new PDF render engine.
 *
 */
export class PDF {
	/**
	 * Base options defined in the PDF constructor.
	 *
	 * These options could then be overwritten when invoking the `PDF.generate()` method.
	 */
	private options: GeneratePdfOptions
	/**
	 * Defines the engine used to generate the PDF.
	 *
	 */
	private engine?: Engine
	/**
	 * Defines the renderer which hosts the content.
	 *
	 */
	private renderer?: Renderer

	/**
	 * Create a new PDF render engine.
	 *
	 * @param data The data to print in the PDF.
	 * @param options An object defining custom options. See {@link GeneratePdfOptions}.
	 */
	public constructor(options?: GeneratePdfOptions) {
		this.options = {
			printBackground: true,
			inlineCss: true,
			...options,
		}
	}

	/**
	 * Get the engine used to generate the PDF.
	 *
	 * @returns The engine used to generate the PDF.
	 */
	public async getEngine(): Promise<Engine> {
		if (this.engine && this.engine.connected) {
			return this.engine
		}

		const { launch } = await import('puppeteer')

		this.engine = await launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		})

		return this.engine
	}

	/**
	 * Get the renderer which hosts the content.
	 *
	 * @returns The renderer which hosts the content.
	 */
	public async getRenderer(): Promise<Renderer> {
		if (this.renderer && !this.renderer.isClosed()) {
			return this.renderer
		}

		this.renderer = await (await this.getEngine()).newPage()

		return this.renderer
	}

	/**
	 * Generate and optionally save to a file the PDF.
	 *
	 * @param	options (Optional) An object defining customization for this specific PDF generation.
	 * @returns A new Promise which resolves the generated PDF data Buffer.
	 */
	public async generate(options?: GeneratePdfOptions): Promise<Uint8Array> {
		const resolvedOptions = this.resolveOptions(options)

		const { content, url, path, styles, waitRequests, ...rest } = resolvedOptions

		const browser = await this.getEngine()
		const page = await this.getRenderer()

		let requestsLoaded: Promise<HTTPResponse> | undefined

		if (waitRequests && waitRequests.length > 0) {
			requestsLoaded = page.waitForResponse(res => {
				const response = res.ok() && res.url()
				return waitRequests.every(url => response && response.includes(url))
			})
		}

		if (content) {
			const output = await this.compileMarkup(content, options)

			/**
			 * Set page content.
			 *
			 */
			await page.setContent(output, {
				waitUntil: 'domcontentloaded',
			})
		} else if (url) {
			/**
			 * Set page content from URL.
			 *
			 */
			await page.goto(Url.format(url), {
				waitUntil: 'networkidle0',
			})
		} else {
			/**
			 * Set page no content.
			 *
			 */
			await page.setContent('No content provided.', {
				waitUntil: 'domcontentloaded',
			})
		}

		/**
		 * Load additional page styles.
		 *
		 */
		if (styles && styles.length > 0) {
			await Promise.all(styles.map(style => page.addStyleTag(style)))
		}

		if (requestsLoaded) await requestsLoaded

		if (path) {
			const dir = dirname(path)
			if (!existsSync(dir)) {
				mkdirSync(dir, { recursive: true })
			}
		}

		// this is already done by `resolvedOptions.waitForFonts`
		// await page.evaluate( () => document.fonts.ready )

		const buffer = await page.pdf({ ...rest, path })

		await browser.close()

		return buffer
	}

	/**
	 * Compile the given data to static markup.
	 *
	 * @param	data	The data to compile.
	 * @param	options	(Optional) An object defining additional options.
	 *
	 * @returns A new Promise which resolves the compiled markup string.
	 */
	private async compileMarkup(
		data: CoerceToUint8ArrayInput | ReadableStream<Buffer>,
		options?: GeneratePdfOptions,
	): Promise<string> {
		const { inlineCss } = this.resolveOptions(options)

		if (!inlineCss) {
			return this.markupToString(data)
		}

		const parse = (await import('inline-css')).default

		return await parse(await this.markupToString(data), { url: '/' })
	}

	/**
	 * Convert data to string.
	 *
	 * @param	data The data to convert.
	 * @returns	A new Promise which resolves the given stringified data.
	 */
	private async markupToString(data: CoerceToUint8ArrayInput | ReadableStream<Buffer>): Promise<string> {
		if (data instanceof ReadableStream) {
			const { StreamReader } = await import('@alessiofrittoli/stream-reader')

			const stream = new StreamReader(data)

			return Buffer.concat(await stream.read()).toString()
		}

		return binaryToString(coerceToUint8Array(data))
	}

	/**
	 * Resolve options.
	 *
	 * @param	options (Optional) Additional options to merge with the initial defined options.
	 * @returns	A new object defining merged options.
	 */
	private resolveOptions(options?: GeneratePdfOptions): GeneratePdfOptions {
		return { ...this.options, ...options }
	}
}
