module.exports = {
	integer: function ( base, factor, index ) {
		let f = factor || 1.5;
		let m = base;
		for ( let i = 0; i < index; i++ ) {
			m = m * f
		}
		return Math.floor( m );

	}
}