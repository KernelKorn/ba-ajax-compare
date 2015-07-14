<?php
/**
 * @package     BlueAcorn\AjaxProductCompare
 * @version     
 * @author      Blue Acorn, Inc. <code@blueacorn.com>
 * @copyright   Copyright © 2015 Blue Acorn, Inc.
 */
class BlueAcorn_AjaxProductCompare_Helper_Data extends Mage_Core_Helper_Abstract {

    public function isEnabled(){
        return Mage::getStoreConfig('ajaxproductcompare/general/select');
    }

    public function printOut() {
        echo "Worked";
    }
}
