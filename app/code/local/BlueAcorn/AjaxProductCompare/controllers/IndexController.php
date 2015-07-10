<?php
/**
 * @package     BlueAcorn\AjaxProductCompare
 * @version     
 * @author      Blue Acorn, Inc. <code@blueacorn.com>
 * @copyright   Copyright © 2015 Blue Acorn, Inc.
 */
class BlueAcorn_AjaxProductCompare_IndexController extends Mage_Core_Controller_Front_Action {
    public function indexAction() {
        $html = Mage::app()->getLayout()->createBlock('catalog/product_compare_sidebar')->setTemplate('catalog/product/compare/sidebar.phtml')->toHtml();
        Mage::app()->getResponse()->setBody($html);
        return;
    }
}