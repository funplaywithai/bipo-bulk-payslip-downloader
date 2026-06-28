/**
 * BIPO HRMS Bulk Payslip Downloader
 * Description: Automates the multi-year extraction of payslips from the BIPO Cloud Portal 
 *              by natively manipulating DevExpress Client-Side Control Layout instances.
 * Author: Office Assistant
 * License: MIT
 */

(async () => {
    // 1. Identify underlying DevExpress JavaScript core components
    const yearControl = window.cboPayslipPayYear;
    const payRunControl = window.cboPayslipPayRun;
    const downloadButtonSelector = '#btnDownload';

    if (!yearControl || !payRunControl) {
        console.error("CRITICAL ERROR: Could not find BIPO DevExpress controls. Ensure you are logged in and looking at the main Payslip View Screen.");
        return;
    }

    console.log("Initialization successful. Scanning document dropdown arrays...");

    // 2. Scan and extract all active year choices
    const years = [];
    for (let i = 0; i < yearControl.GetItemCount(); i++) {
        const val = yearControl.GetItem(i).value;
        // Strip non-numeric selection options like '-- All --'
        if (val && val !== '*' && !isNaN(val)) { years.push(val); }
    }
    years.sort();
    console.log(`Discovered target payroll years:`, years);

    // 3. Sequential traversal across discovered operational years
    for (const year of years) {
        console.log(`\n==================================================`);
        console.log(`>>> PROCESSING TARGET YEAR: ${year} <<<`);
        console.log(`==================================================`);
        
        // Match the target text structure back to its literal memory array pointer
        const yearIndex = Array.from({length: yearControl.GetItemCount()}, (_, idx) => yearControl.GetItem(idx))
                               .findIndex(item => item && item.value === year);
        
        if (yearIndex !== -1) {
            yearControl.SetSelectedIndex(yearIndex);
            
            // Execute BIPO framework callback to notify database mapping coordinates to update
            if (window.ResetPayRun) {
                window.ResetPayRun(yearControl, null);
            } else if (typeof yearControl.RaiseSelectedIndexChanged === 'function') {
                yearControl.RaiseSelectedIndexChanged();
            }
        }

        // Wait 5 seconds for the database callback workflow layer to complete rendering
        console.log("Pausing for pay run drop-down items to sync...");
        await new Promise(r => setTimeout(r, 5000));

        // 4. Gather operational month tokens generated for this active year
        const months = [];
        for (let j = 0; j < payRunControl.GetItemCount(); j++) {
            const item = payRunControl.GetItem(j);
            if (item && item.value && item.value !== '*' && !item.value.includes('select')) {
                months.push({ value: item.value, index: j });
            }
        }

        console.log(`Found ${months.length} total active pay cycles for year ${year}.`);

        // 5. Iterate through available payroll month cycles
        for (const month of months) {
            console.log(`[Processing] Selecting Pay Run Index #${month.index}: Token -> ${month.value}`);
            
            // Change index position to force internal update triggers to validate downstream security cookies
            payRunControl.SetSelectedIndex(month.index);
            
            if (typeof payRunControl.RaiseSelectedIndexChanged === 'function') {
                payRunControl.RaiseSelectedIndexChanged();
            }

            // Wait 5 seconds for the asynchronous framework to load the preview pane and compile the PDF binary address
            console.log("Waiting for document preview container metadata generation...");
            await new Promise(r => setTimeout(r, 5000));

            // Locate and trigger the target native button
            const dlBtn = document.querySelector(downloadButtonSelector);
            if (dlBtn) {
                console.log(`SUCCESS: Triggering browser native save event for -> ${month.value}`);
                dlBtn.click();
            } else {
                console.warn(`WARNING: Failed to target download button context on item descriptor: ${month.value}`);
            }

            // Wait 3.5 seconds before navigating to the next file loop path to preserve pipeline bandwidth
            await new Promise(r => setTimeout(r, 3500));
        }
    }
    
    console.log("\n==================================================");
    console.log("🎉 SUCCESS: Bulk script operation successfully completed!");
    console.log("==================================================");
})();
