/**
 * @package     BlueAcorn\AjaxProductCompare
 * @version     0.1.0
 * @author      Blue Acorn, Inc. <code@blueacorn.com>
 * @copyright   Copyright © 2015 Blue Acorn, Inc.
 */
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
            self.ajaxRequest(this);
        });

        $$('.btn-remove').each(function(element){
            element.writeAttribute('onClick', false);
        });

        $$('.btn-remove').invoke('observe', 'click', function(){
            self.ajaxRequest(this);
        });

        $$('.sidebar .actions a').invoke('observe', 'click', function(){
            self.ajaxRequest(this);
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
    ajaxRequest: function(element) {
        var self = this;
        var url = element.href;
        
        Event.stop(event);
        element.writeAttribute('href', false);

        new Ajax.Request(url, {
            onComplete: function(request){
                var response = JSON.parse(request.responseText);
                var message = {
                    message: response.message
                };

                if($$('.block-compare').length){
                    self.updateCompareBlock(response.compare_html);
                } else {
                    self.insertCompareBlock(response.compare_html);
                }

                if($$('.block-compared').length){
                    self.updateRecentlyComparedBlock(response.recently_compared_html);
                } else {
                    self.insertRecentlyComparedBlock(response.recently_compared_html);
                }

                self.removeMessage();
                self.addMessage(message);
                self.setupObservers();
                element.writeAttribute('href', url);
            }
        });
    },
    compareBox: function(){
        $j.fancybox({
            width: 820,
            height: 800,
            autoSize: false,
            href: '/catalog/product_compare/index/"',
            type: 'ajax',
            afterShow: function() {
                $j('.buttons-set').hide();
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
    insertRecentlyComparedBlock: function(html){
        $$('.col-right').each(function(d){
            d.insert({
                top: html
            });
        })
    },
    updateRecentlyComparedBlock: function(html){
        $$('.block-compared').each(function (d) {
            d.update(html);
        });
    },
    removeMessage: function(){
        $$('.messages').invoke('remove');
    }
};