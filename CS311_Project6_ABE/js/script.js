document.addEventListener('DOMContentLoaded', function() {
    
    let buttonClickCount = 0;
    const totalButtons = 5;

    // Function to insert user entry fields after a button is clicked, and calculate total
    function setupFields(buttonSelector, fields, totalFieldId) {
        const button = document.querySelector(buttonSelector);
        button.addEventListener('click', function() {
            
            // Generate input fields
            let inputFields = fields.map(field => {
                return `<label for="${field}">${field}: </label><input type="number" id="${field}" name="${field}" value="" min="0" onchange="calculateTotal('${fields.join(',')}', '${totalFieldId}')"><br>`;
            }).join('');

            // Add a total field
            inputFields += `<p>Total: <span id="${totalFieldId}">0</span></p>`;

            // Create a div to hold new fields and insert after the button
            const fieldsDiv = document.createElement('div');
            fieldsDiv.classList.add('new-fields-container');
            fieldsDiv.innerHTML = inputFields;
            button.parentNode.insertBefore(fieldsDiv, button.nextSibling);

            // Remove the button
            button.parentNode.removeChild(button);

            //Increment the button click count; if all clicked, the Calculate Position button appears.
            buttonClickCount++;
            if (buttonClickCount === totalButtons){
                calculatePositionButton.style.display = 'block';
            }
        });
    }

            // Setup for each data entry section
            setupFields('.add-button[data-fieldName="newAsset"]', ['Cash', 'Inventory', 'Supplies', 'Temporary Investments (Current)'], 'totalCurrentAssets');
            setupFields('.add-button[data-fieldName="newInvestment"]', ['Land', 'Buildings and Improvements', 'Equipment', 'Temporary Investments'], 'totalInvestmentProperty');
            setupFields('.add-button[data-fieldName="newIntangible"]', ['Trade Names', 'Goodwill'], 'totalIntangibles');
            setupFields('.add-button[data-fieldName="newLiability"]', ['Accounts Payable', 'Notes Payable (Current)', 'Interest Payable', 'Wages Payable', 'Accrued Expenses'], 'totalCurrentLiabilities');
            setupFields('.add-button[data-fieldName="newLongTermLiability"]', ['Notes Payable', 'Bonds Payable'], 'totalLongTermLiabilities');


            // Function to calculate the total for each section
            window.calculateTotal = function(fieldNames, totalFieldId) {
            let total = 0;
            fieldNames.split(',').forEach(fieldName => {
                const value = parseFloat(document.getElementById(fieldName).value) || 0;
                total += value;
            });
    
            document.getElementById(totalFieldId).textContent = total.toFixed(2);
            updateTotalPosition();
            };

    //Calculate total for a section
    function calculateSectionTotal(sectionIds){
        return sectionIds.reduce((total, sectionId) => {
            const sectionTotal = parseFloat(document.getElementById(sectionId).textContent) || 0;
            return total + sectionTotal;
        }, 0);
    }

        function updateTotalPosition(){
            //Calculate total assets
            const totalAssets = calculateSectionTotal(['totalCurrentAssets', 'totalInvestmentProperty', 'totalIntangibles']);
    
            //Calculate total liabilities
            const totalLiabilities = calculateSectionTotal(['totalCurrentLiabilities', 'totalLongTermLiabilities']);
    
            //Calculate position (assets - liabilities)
            const position = totalAssets - totalLiabilities;
    
            //UPdate the Total Position section in the HTML
            document.getElementById('totalAssetsDisplay').textContent = '$' + totalAssets.toLocaleString('en-US', { style: 'decimal', maximumFractionDigits: 2 });
            document.getElementById('totalLiabilitiesDisplay').textContent = '$' + totalLiabilities.toLocaleString('en-US', { style: 'decimal', maximumFractionDigits: 2 });
            document.getElementById('positionDisplay').textContent = '$' + position.toLocaleString('en-US', { style: 'decimal', maximumFractionDigits: 2 });
        }

        //Calculate the total position
        calculatePositionButton = document.querySelector('.calculate-position');
        calculatePositionButton.addEventListener('click', function() {
            updateTotalPosition();
        });
});
