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
        $successString = 'The product %s has been added to comparison list.';

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
                Mage::dispatchEvent('catalog_product_compare_add_product', array('product'=>$product));
            }

            Mage::helper('catalog/product_compare')->calculate();
        }

        $this->setResponse($product, $successString);
        return;
    }

    public function removeAction()
    {
        $successString = 'The product %s has been removed from comparison list.';

        if ($productId = (int) $this->getRequest()->getParam('product')) {
            $product = Mage::getModel('catalog/product')
                ->setStoreId(Mage::app()->getStore()->getId())
                ->load($productId);

            if($product->getId()) {
                /** @var $item Mage_Catalog_Model_Product_Compare_Item */
                $item = Mage::getModel('catalog/product_compare_item');
                if(Mage::getSingleton('customer/session')->isLoggedIn()) {
                    $item->addCustomerData(Mage::getSingleton('customer/session')->getCustomer());
                } elseif ($this->_customerId) {
                    $item->addCustomerData(
                        Mage::getModel('customer/customer')->load($this->_customerId)
                    );
                } else {
                    $item->addVisitorId(Mage::getSingleton('log/visitor')->getId());
                }

                $item->loadByProduct($product);

                if($item->getId()) {
                    $item->delete();
                    Mage::dispatchEvent('catalog_product_compare_remove_product', array('product'=>$item));
                    Mage::helper('catalog/product_compare')->calculate();
                }
            }
        }
        $this->setResponse($product, $successString);
        return;
    }

    public function clearAction()
    {
        $message = "";
        $items = Mage::getResourceModel('catalog/product_compare_item_collection');

        if (Mage::getSingleton('customer/session')->isLoggedIn()) {
            $items->setCustomerId(Mage::getSingleton('customer/session')->getCustomerId());
        } elseif ($this->_customerId) {
            $items->setCustomerId($this->_customerId);
        } else {
            $items->setVisitorId(Mage::getSingleton('log/visitor')->getId());
        }

        /** @var $session Mage_Catalog_Model_Session */
//        $session = Mage::getSingleton('catalog/session');

        try {
            $items->clear();
//            $session->addSuccess($this->__('The comparison list was cleared.'));
            $messgae = 'The comparison list was cleared.';
            Mage::helper('catalog/product_compare')->calculate();
        } catch (Mage_Core_Exception $e) {
//            $session->addError($e->getMessage());
        } catch (Exception $e) {
//            $session->addException($e, $this->__('An error occurred while clearing comparison list.'));
        }

//        $this->_redirectReferer();
        $this->setResponse($items,$message);
    }

    protected function setResponse($product,$successString){
        $compareHtml = Mage::app()->getLayout()->createBlock('catalog/product_compare_sidebar')->setTemplate('catalog/product/compare/sidebar.phtml')->toHtml();
        $comparedHtml = Mage::app()->getLayout()->createBlock('reports/product_compared')->setTemplate('reports/product_compared.phtml')->toHtml();
        $response = new Varien_Object();
        $response->setCompareHtml($compareHtml);
        $response->setComparedHtml($comparedHtml);
        $response->setSuccess($this->__($successString, $product->getName()));
        Mage::app()->getResponse()->setBody($response->toJson());
    }
}