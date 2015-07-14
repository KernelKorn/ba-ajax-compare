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
        $$('.sidebar .actions a').invoke('observe', 'click', function(){
            self.clearAll(this);
        });
        $$('.sidebar .actions a').each( function(element){
            element.writeAttribute('onClick', false);
        });
        $$('.sidebar .actions .button').invoke('observe', 'click', function(){
            self.compareBox(this);
        });
        $$('.sidebar .actions .button').each( function(element){
            element.writeAttribute('onClick', false);
        });
    },
    stopObservers:function(){
        $$('.link-compare').each(function(element){
            element.stopObserving('click');
        })
    },
    addToCompare: function(element) {
        var self = this
        var url = element.href

        Event.stop(event);
        this.stopObservers();
        element.writeAttribute('href', false);

        new Ajax.Request(url, {
            onComplete: function(request){
                var response = JSON.parse(request.responseText);
                var message = {
                    message: response.message
                }

                self.removeMessage();
                self.addMessage(message);
                self.updateComparedBlock(response.compared_html);

                if($$('.block-compare').length){
                    self.updateCompareBlock(response.compare_html);
                    self.setupObservers();
                } else {
                    self.insertCompareBlock(response.compare_html);
                    self.setupObservers();
                }
                element.writeAttribute('href', url);
            }
        });
    },
    removeItem: function(element){
        var self = this;
        Event.stop(event);
        new Ajax.Request(element.href, {
            onComplete: function (request) {
                var response = JSON.parse(request.responseText);
                var message = {
                    message: response.message
                }
                self.removeMessage();
                self.updateCompareBlock(response.compare_html);
                self.addMessage(message);
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
        var self = this;
        Event.stop(event);
        this.removeMessage;
        new Ajax.Request(element.href,{
            onSuccess: function (request) {
                var response = JSON.parse(request.responseText);
                var message = {
                    message: response.message
                }
                self.removeMessage();
                self.updateCompareBlock(response.compare_html);
                self.addMessage(message);

                if($$('.block-compared').length){
                    self.updateComparedBlock(response.compared_html);
                } else {
                    self.insertComparedBlock(response.compared_html);
                }
            },
            onException: function (request){
                var response = JSON.parse(request.responseText);
                var message = {
                    message: response.message
                }
                self.removeMessage();
                self.addMessage(message);
            }
        })
    },
    compareBox: function(element){
        var self = this;
        $j.fancybox({
            width: 820,
            height: 800,
            autoSize: false,
            href: '/catalog/product_compare/index/"',
            type: 'ajax',
            afterShow: function() {
                $j('.buttons-set').hide();
                $j('.compare-table .btn-remove').hide();
            }
        });
    },
    addMessage: function(message){
        var self = this;
        $$('.col-main').each(function(d) {
            d.insert({
                top: self.successTemplate.evaluate(message)
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