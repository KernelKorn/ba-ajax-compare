document.observe("dom:loaded", function() {
    var ajaxCompare = new AjaxCompare();
});

var AjaxCompare = Class.create();
AjaxCompare.prototype = {
    initialize: function(){
        this.successTemplate = new Template(
            '<ul class="messages"><li class="success-msg"><ul><li><span>#{message}</span></li></ul></li></ul>'
        );

        this.setupObservers();
    },
    setupObservers: function(){
        var self = this;
        $$('.link-compare').invoke('observe', 'click', function(){
          self.addToCompare(this);
        });

        $$('.btn-remove').invoke('observe', 'click', function(){
            self.removeItem(this);
        });
    },
    addToCompare: function(element) {
        var self = this
        Event.stop(event);
        new Ajax.Request(element.href, {
            onComplete: function(request){
                var response = JSON.parse(request.responseText);
                var successMessage = {
                    message: response.success
                }

                self.addSuccessMessage(successMessage);
                self.updateComparedBlock(response.compared_html);

                if($$('.block-compare').length){
                    self.updateCompareBlock(response.compare_html);
                } else {
                    self.insertCompareBlock(response.compare_html);
                }
            }
        });
    },
    removeItem: function(element){
        var self = this;
        Event.stop(event);
        new Ajax.Request(element.href, {
            onComplete: function (request) {

            }
        });
        console.log(element);
    },
    addSuccessMessage: function(successMessage){
        var self = this;
        $$('.col-main').each(function(d) {
            d.insert({
                top: self.successTemplate.evaluate(successMessage)
            });
        });
    },
    insertCompareBlock: function(html){
        $$('.col-right').each(function(d){
            d.insert({
                top: html
            });
        })
    },
    updateCompareBlock: function(html){
        $$('.block-compare').each(function (d) {
            d.update(html);
        });
    },
    updateComparedBlock: function(html){
        $$('.block-compared').each(function (d) {
            d.update(html);
        });
    }
}
