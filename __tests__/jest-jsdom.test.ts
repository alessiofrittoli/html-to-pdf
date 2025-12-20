/**
 * @jest-environment jsdom
 */

describe( 'Jest', () => {
	it( 'runs with jest-environment-jsdom', () => {
	
		expect( window ).not.toBeUndefined()
	
	} )
} )