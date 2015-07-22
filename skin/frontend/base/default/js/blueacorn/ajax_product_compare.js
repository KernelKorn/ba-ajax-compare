/**
 * @package     BlueAcorn\AjaxProductCompare
 * @version     0.1.0
 * @author      Blue Acorn, Inc. <code@blueacorn.com>
 * @copyright   Copyright © 2015 Blue Acorn, Inc.
 */
var ajaxCompare;
document.observe("dom:loaded", function() {
    ajaxCompare = new AjaxCompare();
});

var AjaxCompare = Class.create();
AjaxCompare.prototype = {
    initialize: function(){
        this.removeBtn = '.sidebar .btn-remove';
        this.compareLink = '.link-compare';
        this.compareBlock = '.block-compare';
        this.colRightBlock = '.col-right';
        this.recentlyComparedBlock = '.block-compared';
        this.sidebarActions = '.col-right .actions';

        this.successTemplate = new Template(
            '<ul class="messages"><li class="success-msg"><ul><li><span>#{message}</span></li></ul></li></ul>'
        );

        this.errorTemplate = new Template(
            '<ul class="messages"><li class="error-msg"><ul><li><span>#{message}</span></li></ul></li></ul>'
        );

        this.removeOnClickEvents();
        this.setupObservers();
    },
    setupObservers: function(){
        var self = this;

        $$(self.compareLink, self.removeBtn).invoke('observe', 'click', function(){
            self.ajaxRequest(this);
        });

        $$(self.sidebarActions).each(function(element) {
            element.select('a').invoke('observe', 'click', function(){
                self.ajaxRequest(this);
            })
            element.select('button').invoke('observe', 'click', function(){
                self.compareBox(this);
            })
        });
    },
    removeOnClickEvents: function() {
        $$(this.removeBtn).each(function(element){
            element.writeAttribute('onClick', false);
        });

        $$(this.sidebarActions).each(function(element) {
            element.select('a').each(function(e){
                e.writeAttribute('onClick', false);
            })
            element.select('button').each(function(e){
                e.writeAttribute('onClick', false);
            })
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

                if($$(self.compareBlock).length){
                    self.updateCompareBlock(response.compare_html);
                } else {
                    self.insertCompareBlock(response.compare_html);
                }

                if($$(self.recentlyComparedBlock).length){
                    self.updateRecentlyComparedBlock(response.recently_compared_html);
                } else {
                    self.insertRecentlyComparedBlock(response.recently_compared_html);
                }

                self.removeMessage();
                self.addSuccessMessage(message);
                self.setupObservers();
                self.removeOnClickEvents();
                element.writeAttribute('href', url);
            },
            onFailure: function() {
                var message = {
                    message: 'Something went wrong'
                };
                self.addErrorMessage(message);
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
    addSuccessMessage: function(message){
        var self = this;
        $$('.col-main').each(function(d) {
            d.insert({
                top: self.successTemplate.evaluate(message)
            });
        });
    },
    addErrorMessage: function(message){
        var self = this;
        $$('.col-main').each(function(d) {
            d.insert({
                top: self.errorTemplate.evaluate(message)
            });
        });
    },
    insertCompareBlock: function(html){
        $$(this.colRightBlock).each(function(d){
            d.insert({
                top: html
            });
        })
    },
    updateCompareBlock: function(html){
        $$(this.compareBlock).each(function (d) {
            d.update(html);
        });
    },
    insertRecentlyComparedBlock: function(html){
        $$(this.colRightBlock).each(function(d){
            d.insert({
                top: html
            });
        })
    },
    updateRecentlyComparedBlock: function(html){
        $$(this.recentlyComparedBlock).each(function (d) {
            d.update(html);
        });
    },
    removeMessage: function(){
        $$('.messages').invoke('remove');
    }
};