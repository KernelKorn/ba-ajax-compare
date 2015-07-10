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
        $$('.btn-remove').each(function(element){
            element.writeAttribute('onClick', false);
        })
        $$('.btn-remove').invoke('observe', 'click', function(){
            self.removeItem(this);
        });
        $$('.actions a').invoke('observe', 'click', function(){
            self.clearAll(this);
        });
        $$('.actions a').each( function(element){
            element.writeAttribute('onClick', false);
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
                self.removeMessage();
                self.addSuccessMessage(successMessage);
                self.updateComparedBlock(response.compared_html);

                if($$('.block-compare').length){
                    self.updateCompareBlock(response.compare_html);
                } else {
                    self.insertCompareBlock(response.compare_html);
                }
                self.setupObservers();
            }
        });
    },
    removeItem: function(element){
        var self = this;
        Event.stop(event);
        this.removeMessage;
        new Ajax.Request(element.href, {
            onComplete: function (request) {
                var response = JSON.parse(request.responseText);
                var successMessage = {
                    message: response.success
                }
                self.removeMessage();
                self.updateCompareBlock(response.compare_html);
                self.addSuccessMessage(successMessage);
                if($$('.block-compared').length){
                    self.updateComparedBlock(response.compared_html);
                } else {
                    self.insertComparedBlock(response.compared_html);
                }
                self.setupObservers();
            }
        });
    },
    clearAll: function(element){
        Event.stop(event);
        console.log("WHAT!!");
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
    insertComparedBlock: function(html){
        $$('.col-right').each(function(d){
            d.insert({
                top: html
            });
        })
    },
    updateComparedBlock: function(html){
        $$('.block-compared').each(function (d) {
            d.update(html);
        });
    },
    removeMessage: function(){
        $$('.messages').invoke('remove');
    }
}
