import {
	existsSync as _existsSync,
	mkdirSync as _mkdirSync,
} from 'fs'
import path from 'path'
import { Stream } from '@alessiofrittoli/stream-writer'
import type { HTTPResponse } from 'puppeteer'
import InlineCss from 'inline-css'
import { PDF } from '@/index'

const mockPdfBuffer	= Buffer.from( 'PDFDATA' )

const mockRenderer = {
	setContent		: jest.fn().mockResolvedValue( undefined ),
	goto			: jest.fn().mockResolvedValue( undefined ),
	addStyleTag		: jest.fn().mockResolvedValue( undefined ),
	pdf				: jest.fn().mockResolvedValue( mockPdfBuffer ),
	isClosed		: jest.fn().mockReturnValue( false ),
	// waitForResponse	: jest.fn().mockReturnValue( Promise.resolve( { ok: () => true, url: () => 'https://fonts.googleapis.com' } ) ),
	waitForResponse	: jest.fn( async ( resolver: ( res: HTTPResponse ) => boolean | Promise<boolean> ) => (
		// eslint-disable-next-line no-async-promise-executor
		new Promise( async resolve => {
			
			const response: HTTPResponse = {
				ok: () => true,
				url: () => 'https://fonts.googleapis.com',
			} as HTTPResponse

			const result = await resolver( response )
			if ( result ) return resolve( response )
		} )
	) ),
}


const mockEngine = {
	newPage		: jest.fn().mockResolvedValue( mockRenderer ),
	close		: jest.fn().mockResolvedValue( undefined ),
	connected	: true,
}


jest.mock( 'puppeteer', () => ( {
	launch: jest.fn( () => mockEngine )
} ) )


jest.mock( 'fs', () => ( {
	statSync	: jest.fn(),
	existsSync	: jest.fn(),
	mkdirSync	: jest.fn(),
} ) )


const mkdirSync		= _mkdirSync as jest.Mock
const existsSync	= _existsSync as jest.Mock

jest.mock( 'inline-css', () => ( {
	__esModule: true,
	default: jest.fn( ( markup ) => Promise.resolve( `<inlined>${ markup }</inlined>` ) )
} ) )

const inlineCss = InlineCss as jest.Mock

describe( 'PDF', () => {

	afterEach( () => {
		jest.clearAllMocks()
	} )

	it( 'instantiates with default options', () => {
		const pdf = new PDF()
		expect( pdf ).toBeInstanceOf( PDF )
	} )


	describe( 'PDF.generate()', () => {

		it( 'generates PDF from content', async () => {
	
			const pdf		= new PDF( { content: '<html>test</html>' } )
			const buffer	= await pdf.generate()
			
			expect( mockRenderer.setContent )
				.toHaveBeenCalledWith(
					expect.stringContaining( '<inlined><html>test</html></inlined>' ),
					expect.any( Object )
				)
			
			expect( mockRenderer.pdf ).toHaveBeenCalled()
			expect( buffer ).toBe( mockPdfBuffer )
			
		} )


		it( 'allows multiple generation with different content and same constructed PDF', async () => {
	
			const pdf		= new PDF()
			const buffer	= await pdf.generate( { content: '<html>test</html>' } )
			const buffer2	= await pdf.generate( { content: '<html>test 2</html>' } )

			expect( mockRenderer.setContent )
				.toHaveBeenNthCalledWith(
					1,
					expect.stringContaining( '<inlined><html>test</html></inlined>' ),
					expect.any( Object )
				)
			expect( mockRenderer.setContent )
				.toHaveBeenNthCalledWith(
					2,
					expect.stringContaining( '<inlined><html>test 2</html></inlined>' ),
					expect.any( Object )
				)
			
			expect( mockRenderer.pdf ).toHaveBeenCalledTimes( 2 )
			
			expect( buffer ).toBe( mockPdfBuffer )
			expect( buffer2 ).toBe( mockPdfBuffer )
			
		} )


		it( 'generates PDF from url', async () => {

			const pdf		= new PDF()
			const buffer	= await pdf.generate( { url: 'http://example.com' } )

			expect( mockRenderer.goto )
				.toHaveBeenCalledWith( 'http://example.com', expect.any( Object ) )
			expect( mockRenderer.pdf ).toHaveBeenCalled()
			expect( buffer ).toBe( mockPdfBuffer )

		} )


		it( 'generates a blank PDF if neither content or url has been provided', async () => {

			await new PDF().generate()

			expect( mockRenderer.setContent )
				.toHaveBeenCalledWith(
					expect.stringContaining( 'No content provided.' ),
					expect.any( Object )
				)
			expect( mockRenderer.pdf ).toHaveBeenCalled()

		} )


		it( 'adds additional provided styles', async () => {

			const styles = [ { content: 'body{color:red;}' } ]

			await new PDF().generate( { content: '<html></html>', styles } )
			expect( mockRenderer.addStyleTag )
				.toHaveBeenCalledWith( styles[ 0 ] )

		} )


		it( 'waits additional provided requests', async () => {

			await new PDF()
				.generate( { content: '<html></html>', waitRequests: [ 'fonts.googleapis.com' ] } )

			expect( mockRenderer.waitForResponse )
				.toHaveBeenCalled()

		} )


		it( 'creates a directory if path is provided and does not exist', async () => {

			existsSync.mockReturnValue( false )

			const pdf		= new PDF()
			const outPath	= path.join( 'output', 'file.pdf' )

			await pdf.generate( { content: '<html></html>', path: outPath } )
			
			expect( existsSync )
				.toHaveBeenCalledWith( path.dirname( outPath ) )
			
			expect( mkdirSync )
				.toHaveBeenCalledWith( path.dirname( outPath ), { recursive: true } )
			
		} )


		it( 'doesn\'t create directory if path already exists', async () => {
			
			existsSync.mockReturnValue( true )
			const pdf		= new PDF()
			const outPath	= path.join( 'output', 'file.pdf' )

			await pdf.generate( { content: '<html></html>', path: outPath } )

			expect( mkdirSync ).not.toHaveBeenCalled()

		} )

	} )


	describe( 'PDF.getEngine()', () => {

		it( 'returns the current engine instance', async () => {

			expect( await new PDF().getEngine() )
				.toBe( mockEngine )
		} )

	} )
	
	
	describe( 'PDF.getRenderer()', () => {

		it( 'returns the current renderer instance', async () => {

			expect( await new PDF().getRenderer() )
				.toBe( mockRenderer )
		} )

	} )


	describe( 'PDF.compileMarkup()', () => {

		it( 'inlines CSS if inlineCss is set to true', async () => {

			const pdf = new PDF()
			await pdf.generate( { content: '<html>css</html>' } )
			expect( inlineCss ).toHaveBeenCalled()

		} )

	
		it( 'doesn\'t inline CSS if inlineCss is set to false', async () => {

			await new PDF()
				.generate( { content: '<html>css</html>', inlineCss: false } )
			
			expect( inlineCss ).not.toHaveBeenCalled()

		} )
		
	} )


	describe( 'PDF.markupToString()', () => {

		it( 'handles stream content', async () => {

			const stream = new Stream<Buffer>()
			
			stream.write( Buffer.from( 'chunk 1' ) )
			stream.write( Buffer.from( 'chunk 2' ) )
				.then( () => stream.close() )

			await new PDF()
				.generate( { content: stream.readable } )

			expect( mockRenderer.setContent )
				.toHaveBeenCalledWith(
					expect.stringContaining( 'chunk 1chunk 2' ),
					expect.any( Object )
				)
		} )
		
	} )

} )