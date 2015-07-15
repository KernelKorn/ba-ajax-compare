<?php
/**
 * @package     BlueAcorn\AjaxProductCompare
 * @version     0.1.0
 * @author      Blue Acorn, Inc. <code@blueacorn.com>
 * @copyright   Copyright © 2015 Blue Acorn, Inc.
 */

require_once Mage::getModuleDir('controllers', 'Mage_Catalog') . DS . 'Product/CompareController.php';;

class BlueAcorn_AjaxProductCompare_Product_CompareController extends Mage_Catalog_Product_CompareController{

    public function addAction()
    {
        if (Mage::helper('ba_ajaxproductcompare')->isEnabled()) {

            if (!$this->_validateFormKey()) {
                $this->_redirectReferer();
                return;
            }

            $productId = (int)$this->getRequest()->getParam('product');
            if ($productId
                && (Mage::getSingleton('log/visitor')->getId() || Mage::getSingleton('customer/session')->isLoggedIn())
            ) {
                $product = Mage::getModel('catalog/product')
                    ->setStoreId(Mage::app()->getStore()->getId())
                    ->load($productId);

                if ($product->getId()/* && !$product->isSuper()*/) {
                    Mage::getSingleton('catalog/product_compare_list')->addProduct($product);
                    Mage::dispatchEvent('catalog_product_compare_add_product', array('product' => $product));
                }

                Mage::helper('catalog/product_compare')->calculate();
            }
            $message = $this->__('The product %s has been added to comparison list.', $product->getName());

            $this->setResponse($message);
            return;
        } else {
            parent::addAction();
        }
    }

    public function removeAction()
    {
        if (Mage::helper('ba_ajaxproductcompare')->isEnabled()) {
            if ($productId = (int)$this->getRequest()->getParam('product')) {
                $product = Mage::getModel('catalog/product')
                    ->setStoreId(Mage::app()->getStore()->getId())
                    ->load($productId);

                if ($product->getId()) {
                    /** @var $item Mage_Catalog_Model_Product_Compare_Item */
                    $item = Mage::getModel('catalog/product_compare_item');
                    if (Mage::getSingleton('customer/session')->isLoggedIn()) {
                        $item->addCustomerData(Mage::getSingleton('customer/session')->getCustomer());
                    } elseif ($this->_customerId) {
                        $item->addCustomerData(
                            Mage::getModel('customer/customer')->load($this->_customerId)
                        );
                    } else {
                        $item->addVisitorId(Mage::getSingleton('log/visitor')->getId());
                    }

                    $item->loadByProduct($product);

                    if ($item->getId()) {
                        $item->delete();
                        Mage::dispatchEvent('catalog_product_compare_remove_product', array('product' => $item));
                        Mage::helper('catalog/product_compare')->calculate();
                    }
                }
            }
            $message = $this->__('The product %s has been removed from comparison list.', $product->getName());
            $this->setResponse($message);
            return;
        } else {
            parent::removeAction();
        }
    }

    public function clearAction()
    {
        if (Mage::helper('ba_ajaxproductcompare')->isEnabled()) {
            $message = '';
            $items = Mage::getResourceModel('catalog/product_compare_item_collection');

            if (Mage::getSingleton('customer/session')->isLoggedIn()) {
                $items->setCustomerId(Mage::getSingleton('customer/session')->getCustomerId());
            } elseif ($this->_customerId) {
                $items->setCustomerId($this->_customerId);
            } else {
                $items->setVisitorId(Mage::getSingleton('log/visitor')->getId());
            }

            try {
                $items->clear();
                $message = 'The comparison list was cleared.';
                Mage::helper('catalog/product_compare')->calculate();
            } catch (Mage_Core_Exception $e) {
                $message = $e->getMessage();
            } catch (Exception $e) {
                $message = $this->__('An error occurred while clearing comparison list.');
            }

            $this->setResponse($message);
        } else {
            parent::clearAction();
        }
    }

    protected function setResponse($message){
        $compareHtml = Mage::app()->getLayout()->createBlock('catalog/product_compare_sidebar')->setTemplate('catalog/product/compare/sidebar.phtml')->toHtml();
        $recentlyComparedHtml = Mage::app()->getLayout()->createBlock('reports/product_compared')->setTemplate('reports/product_compared.phtml')->toHtml();
        $response = new Varien_Object();
        $response->setCompareHtml($compareHtml);
        $response->setRecentlyComparedHtml($recentlyComparedHtml);
        $response->setMessage($message);
        Mage::app()->getResponse()->setBody($response->toJson());
    }
}