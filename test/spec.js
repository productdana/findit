// var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
describe("testing search function", function(){
	// var setText = function(text, selector){
	// var input = $(selector || '#pac-input');
 //    var e = $.Event("keypress");
 //    e.which = e.keyCode = 13;
 //    return input.val(text).trigger(e);
	// }
	var input = 'restaurants';

	it('should return some results', function(){
		// setText('restaurants');
		newSearch();
		expect($('#list button').length).to.not.equal(0);
	})

	// it('should display a query box', function(){

	// })
});
// var chai = require('chai');
// var assert = chai.assert;

// describe('Array', function() {
//   it('should start empty', function() {
//     var arr = [];

//     assert.equal(arr.length, 0);
//   });
// });