<?php
/**
 * @package     BlueAcorn\AjaxProductCompare
 * @version     
 * @author      Blue Acorn, Inc. <code@blueacorn.com>
 * @copyright   Copyright © 2015 Blue Acorn, Inc.
 */
require_once "Mage/Catalog/controllers/Product/CompareController.php";

class BlueAcorn_AjaxProductCompare_Product_CompareController extends Mage_Catalog_Product_CompareController{

    public function addAction()
    {
        if (!$this->_validateFormKey()) {
            $this->_redirectReferer();
            return;
        }

        $productId = (int) $this->getRequest()->getParam('product');
        if ($productId
            && (Mage::getSingleton('log/visitor')->getId() || Mage::getSingleton('customer/session')->isLoggedIn())
        ) {
            $product = Mage::getModel('catalog/product')
                ->setStoreId(Mage::app()->getStore()->getId())
                ->load($productId);

            if ($product->getId()/* && !$product->isSuper()*/) {
                Mage::getSingleton('catalog/product_compare_list')->addProduct($product);
//                Mage::getSingleton('catalog/session')->addSuccess(
//                    $this->__('The product %s has been added to comparison list.', Mage::helper('core')->escapeHtml($product->getName()))
//                );
                Mage::dispatchEvent('catalog_product_compare_add_product', array('product'=>$product));
            }

            Mage::helper('catalog/product_compare')->calculate();
        }

        $compareHtml = Mage::app()->getLayout()->createBlock('catalog/product_compare_sidebar')->setTemplate('ba_ajaxCompare/sidebar.phtml')->toHtml();
        $comparedHtml = Mage::app()->getLayout()->createBlock('reports/product_compared')->setTemplate('reports/product_compared.phtml')->toHtml();
        $response = new Varien_Object();
        $response->setCompareHtml($compareHtml);
        $response->setComparedHtml($comparedHtml);
        $response->setSuccess($this->__('The product %s has been added to comparison list.',Mage::helper('core')->escapeHtml($product->getName())));
        Mage::app()->getResponse()->setBody($response->toJson());
        return;
    }
}