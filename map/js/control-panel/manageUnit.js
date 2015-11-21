// (function(window, document, undefined) {

    'use strict'

    /**
     * Store UI components
     */
    var manageUnitButtons = document.querySelectorAll('[ui-role = manageUnit]')
    var manageUnitModal   = document.getElementById('manageUnitModal')
    var manageUnitSection = manageUnitModal.children[0]
    var updateUnitButton  = document.querySelectorAll('[ui-role = updateUnit]')[0]
    var deleteUnitButton  = document.querySelectorAll('[ui-role = deleteUnit]')[0]

    /**
     * Store select dropdowns
     */
    var updateUnitOrder       = document.querySelectorAll('[unit-update = unitOrder]')[0]
    var updateCurrentProvince = document.querySelectorAll('[unit-update = unitProvince]')[0]
    var updateTargetProvince  = document.querySelectorAll('[unit-update = unitTargetProvince]')[0]

    var unitOrdersTable = document.getElementById('orderTable')

    /**
     * Store parent row of unit being managed
     */
    var rowIndex
    var row

    /**
     * Handles extraction of unit information to populate the manage unit modal
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    function manageUnit(e, rowIndex) {

        /**
         * Extract cells in the row that the clicked button belongs to
         * @type {HTMLCollection}
         */
        row = unitOrdersTable.rows[rowIndex].cells

        /**
         * store unit information
         * @type {Object}
         */
        var unitInfo = {

            'gameDataIndex' : {
               'type'           : row[0].attributes['gameDataIndex'].textContent,
               'order'          : row[1].attributes['gameDataIndex'].textContent,
               'province'       : row[2].attributes['gameDataIndex'].textContent,
               'targetProvince' : row[3].attributes['gameDataIndex'].textContent
            },     

            'values' : {
                'type'           : row[0].textContent,
                'order'          : row[1].textContent,
                'province'       : row[2].textContent,
                'targetProvince' : row[3].textContent
            }

        }

        // todo | block out rest of window to prevent clicking  
        // todo | checking if unit type allows a change in province

        // display modal
        manageUnitModal.classList.add('visible')

        debug(manageUnitModal)

        // set selected in select fields as unit info attributes
        updateUnitOrder.options.selectedIndex       = unitInfo.gameDataIndex.order
        updateCurrentProvince.options.selectedIndex = unitInfo.gameDataIndex.province
        updateTargetProvince.options.selectedIndex  = unitInfo.gameDataIndex.targetProvince
    }

    /**
     * Update unit and its respective row in the Unit and Orders table
     * @return {[type]} [description]
     */
    function updateUnit () {

        debug(rowIndex)

        // get unit updates
        var unitUpdates = {

            'gameDataIndex' : {
                'order'          : updateUnitOrder.options.selectedIndex,
                'province'       : updateCurrentProvince.options.selectedIndex,
                'targetProvince' : updateTargetProvince.options.selectedIndex
            },     

            'values' : {
                'order'          : updateUnitOrder.options[updateUnitOrder.selectedIndex].value,
                'province'       : updateCurrentProvince.options[updateCurrentProvince.selectedIndex].value,
                'targetProvince' : updateTargetProvince.options[updateTargetProvince.selectedIndex].value
            }

        }

        // update original row with new unit values 
        row[1].textContent = unitUpdates.values.order
        row[2].textContent = unitUpdates.values.province
        row[3].textContent = unitUpdates.values.targetProvince

        // update original row with new game data index
        row[1].attributes['gameDataIndex'].textContent = unitUpdates.gameDataIndex.order
        row[2].attributes['gameDataIndex'].textContent = unitUpdates.gameDataIndex.province
        row[3].attributes['gameDataIndex'].textContent = unitUpdates.gameDataIndex.targetProvince

        // hide modal
        manageUnitModal.classList.remove('visible')
    }    

    /**
    * Deletes unit specified by user (represented as a table row)
    * @return {[type]} [description]
    */
    function deleteUnit(unitRow) {

        // remove selected row from unit table
        document.getElementById('orderTable').deleteRow(unitRow)

        /**
         * Inform the server that the specified unit has been deleted
         * @return {[type]} [description]
         */
        function communicateServerDeleteUnit() {}
        
        // hide modal
        manageUnitModal.classList.remove('visible')   
    }

    // add event listeners to each manageUnitButton
    // for (i = manageUnitButtons.length; i--;) {
        // (function(i) {
            // manageUnitButtons[i].addEventListener('click', manageUnit, false) 
        // })(i);
    // }

    /**
     * Assign a click event handler on the parent element (units table) and using
     * event delegation, detect when a button is clicked. Compare the click event target 
     * to the element that should react.
     * 
     * This allows for dynamically adding new table rows (with buttons) without having 
     * to loop through all the target elements again to assign click handlers.
     */
    (function() {
        unitOrdersTable.addEventListener('click', function() {
            var nodeName = event.target.nodeName

            // determine element clicked and extract row index
            if (nodeName.toLowerCase() === 'button') {
                rowIndex = event.target.parentNode.parentNode.rowIndex
                manageUnit(event, rowIndex)
            } else if (nodeName.toLowerCase() === 'i') {
                rowIndex = event.target.parentNode.parentNode.parentNode.rowIndex
                manageUnit(event, rowIndex)
            }
        }, false)
    })();

    // add event listener to update unit button
    updateUnitButton.addEventListener('click', function() {
        updateUnit()
    }, false)

    // add event listener to the delete unit button
    deleteUnitButton.addEventListener('click', function() {
        deleteUnit(rowIndex)
    }, false)

// })(window, document);