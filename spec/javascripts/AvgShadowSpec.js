describe('average shadow', function() {
    var testDiv;

    beforeEach(function(){         
        this.addMatchers({
            toHaveBoxShadow: function() {
                if (this.actual.css('boxShadow') && this.actual.css('boxShadow') !== 'none') return true;
            }
        });
    });

    describe('with default options', function () {        
        beforeEach(function(){
            jasmine.getFixtures().set('<div id="test"></div>');
            testDiv = $('#test').avgShadow();
        });
        
        it('adds box-shadow', function () {
            expect(testDiv).toHaveBoxShadow();
        });

    });
    
});
