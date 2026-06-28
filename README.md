# BIPO Cloud HRMS Bulk Payslip Downloader 🚀

An elegant, developer-console automation solution to bulk download historical employee payslips directly from the **BIPO HRMS Platform**. 

Enterprise HR portals built with the **DevExpress Framework** (such as BIPO) rely on intricate asynchronous JavaScript component architectures and anti-forgery request states. This script directly hooks into the client-side component controller pipeline (`window.cboPayslipPayYear` and `window.cboPayslipPayRun`) to systematically cycle through available fiscal periods and cleanly trigger native browser save operations.

## Key Features
* **Zero Software Dependencies:** No need to setup or maintain local setups for Selenium or Playwright.
* **Auto-Looping Matrix:** Sequentially transitions between **Pay Years** and **Pay Runs (Months)**.
* **Bypasses Authentication Roadblocks:** Operates completely inside an active browser session—completely bypasses Multi-Factor Authentication (MFA), CAPTCHAs, and hidden CSRF protection barriers.
* **Safeguarded Throttling:** Includes adaptive structural timing parameters (delays) to guarantee server execution without hitting platform web application firewalls (WAF).

---

## Technical Configuration Checklist (Crucial)

Before running the automation, you must configure Google Chrome's download settings to prevent manual popup confirmations for every individual file:

1. Open a new Chrome tab and go to: `chrome://settings/downloads`
2. Locate **"Ask where to save each file before downloading"** and toggle it **OFF**.
3. Clear your standard system `Downloads` folder or check that you have enough storage space for your historical file backlog.

---

## Execution Guide

1. Log into your company's proprietary **BIPO Cloud Dashboard**.
2. Navigate to your personal **Payslip View / Payroll History** screen where your payroll records are displayed.
3. Open your browser's Developer Tools Console:
   * **Windows/Linux:** Press `F12` or `Ctrl + Shift + I`
   * **Mac:** Press `Cmd + Option + I`
4. Click on the **Console** tab.
5. Copy the entire contents of `bipo_downloader.js` from this repository, paste it directly into the prompt line, and press `Enter`.
6. Keep an eye out for a prompt near the right side of your Chrome URL browser omnibar asking: *"This site is trying to download multiple files. Do you want to allow this?"*. Click **Allow**.
7. Keep the browser tab open and focused. The console will print progress logs detailing exactly which files are downloading.

---

## Troubleshooting Log Alerts

* **Error: `Could not find DevExpress controls.`**  
  You ran the script on the wrong webpage view. Ensure you are on the actual UI panel that renders your physical payslip statement container.
* **The Dropdown Updates but Nothing Downloads:**  
  BIPO portals vary slightly by international territory and enterprise setup configurations. Right-click the on-screen "Download" button, select **Inspect**, and verify its HTML parameters. If its `id` is not `#btnDownload`, change line 11 of `bipo_downloader.js` to match the exact class name or identification string of your portal.
* **The Downloads are Interrupted or Sticking:**  
  Your company's cloud host cluster latency may be slightly delayed. Open the script file and raise the `setTimeout` buffer integers on lines 41, 66, and 76 from `5000` to `7000` (7 seconds) to grant the framework more time to fetch structural assets from the database.

## License
Distributed under the MIT License. See `LICENSE` for more information.
