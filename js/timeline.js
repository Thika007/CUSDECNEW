document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const instanceID = urlParams.get('Instance_ID');
    const officeCode = urlParams.get('Office_Code');
    const Ser = urlParams.get('Ser');
    const regNo = urlParams.get('Reg_No');
    const Reg_Date = urlParams.get('Reg_Date');
    const ContainerCount = urlParams.get('Container_Count');

    // Display Office_Code,Reg_No and etc
    if (ContainerCount > 0) {
        document.getElementById('officeCodeRegNo').innerHTML = `
        ${officeCode} ${Ser} ${regNo} of ${Reg_Date}`;
    } else {
        document.getElementById('officeCodeRegNo').innerHTML = `
        ${officeCode} ${Ser} ${regNo} of ${Reg_Date} - LCL`;
    }

    // Display collaps table buttons
    if (ContainerCount > 0) {
        document.getElementById('collapseTable').innerHTML = `
        <button class="btn btn-link" data-bs-toggle="collapse" data-bs-target="#details-table">Total
                    Taxes</button>
                <div id="details-table" class="collapse">
                    <table class="table table-bordered">
                        <thead class="thead-dark">
                            <tr style="text-align: center;">
                                <th>Type</th>
                                <th>Amount(LKR)</th>
                            </tr>
                        </thead>
                        <tbody id="taxTableBody" style="text-align: center;">
                            <!-- Tax data will be injected here via JavaScript -->
                        </tbody>
                        <tfoot>
                            <tr style="text-align: center;">
                                <th>Total</th>
                                <th id="totalAmount"></th>
                            </tr>
                        </tfoot>
                    </table>
                </div><br>
                <button class="btn btn-link" data-bs-toggle="collapse" data-bs-target="#CUSDEC">CUSDEC Details</button>
                <div id="CUSDEC" class="collapse">
                    <div class="table-responsive mb-4">
                <table class="table table-bordered">
                    <tbody>
                        <tr>
                            <td data-label="Exporter" style="font-weight: bold;">Exporter</td>
                            <td id="exporterName" data-label="Exporter Name"></td>
                        </tr>
                        <tr>
                            <td data-label="Declarant" style="font-weight: bold;">Declarant</td>
                            <td id="declarantName" data-label="Declarant Name"></td>
                        </tr>
                        <tr>
                            <td data-label="Invoice Value" style="font-weight: bold;">Invoice Value</td>
                            <td>LKR <span id="invoiceValue" data-label="Invoice Amount"></span></td>
                        </tr>
                        <tr>
                            <td data-label="B/L Number" style="font-weight: bold;">B/L Number</td>
                            <td>Currently Under Maintenance</td>
                        </tr>
                        <tr>
                            <td data-label="Country of Export" style="font-weight: bold;">Country of Export(CODE)</td>
                            <td id="exportCty" data-label="Export Country"></td>
                        </tr>
                        <tr>
                            <td data-label="Terminal" style="font-weight: bold;">Terminal</td>
                            <td>Currently Under Maintenance</td>
                        </tr>
                    </tbody>
                </table>
            </div>
                </div><br>
                <button class="btn btn-link" data-bs-toggle="collapse" data-bs-target="#con-table">Container
                    Location</button>
                <div id="con-table" class="collapse">
                    <div class="table-responsive">
    <table class="table table-bordered table-striped table-hover text-center" id="operationTable">
        <thead class="thead-dark">
            <tr>
                <th class="small">Container Number</th>
                <th class="small">Destination</th>
                <th class="small">Scanned</th>
                <th class="small">Last Location</th>
                <th class="small">Date</th>
                <th class="small">Time</th>
            </tr>
        </thead>
        <tbody>
            <!-- data will be injected here via JavaScript -->
        </tbody>
    </table>
</div>

                </div>`;
    } else {
        document.getElementById('collapseTable').innerHTML = `
        <button class="btn btn-link" data-bs-toggle="collapse" data-bs-target="#details-table">Total
                    Taxes</button>
                <div id="details-table" class="collapse">
                    <table class="table table-bordered">
                        <thead class="thead-dark">
                            <tr style="text-align: center;">
                                <th>Type</th>
                                <th>Amount(LKR)</th>
                            </tr>
                        </thead>
                        <tbody id="taxTableBody" style="text-align: center;">
                            <!-- Tax data will be injected here via JavaScript -->
                        </tbody>
                        <tfoot>
                            <tr style="text-align: center;">
                                <th>Total</th>
                                <th id="totalAmount"></th>
                            </tr>
                        </tfoot>
                    </table>
                </div><br>
                <button class="btn btn-link" data-bs-toggle="collapse" data-bs-target="#CUSDEC">CUSDEC Details</button>
                <div id="CUSDEC" class="collapse">
                    <div class="table-responsive mb-4">
                <table class="table table-bordered">
                    <tbody>
                        <tr>
                            <td data-label="Exporter" style="font-weight: bold;">Exporter</td>
                            <td id="exporterName" data-label="Exporter Name"></td>
                        </tr>
                        <tr>
                            <td data-label="Declarant" style="font-weight: bold;">Declarant</td>
                            <td id="declarantName" data-label="Declarant Name"></td>
                        </tr>
                        <tr>
                            <td data-label="Invoice Value" style="font-weight: bold;">Invoice Value</td>
                            <td>LKR <span id="invoiceValue" data-label="Invoice Amount"></span></td>
                        </tr>
                        <tr>
                            <td data-label="B/L Number" style="font-weight: bold;">B/L Number</td>
                            <td>Currently Under Maintenance</td>
                        </tr>
                        <tr>
                            <td data-label="Country of Export" style="font-weight: bold;">Country of Export(CODE)</td>
                            <td id="exportCty" data-label="Export Country"></td>
                        </tr>
                        <tr>
                            <td data-label="Terminal" style="font-weight: bold;">Terminal</td>
                            <td>Currently Under Maintenance</td>
                        </tr>
                    </tbody>
                </table>
            </div>
                </div>`;
    }

    // Display All Total taxes Link
    //     document.getElementById('Totaltaxes').innerHTML = `
    //    ${officeCode} | ${regNo} |  <a href="tax.html?Instance_ID=${instanceID}">View All Total taxes</a>`;

    // Display Timeline
    if (instanceID) {
        fetch(`fetchTimelineData.php?Instance_ID=${instanceID}`)
            .then(response => response.json())
            .then(data => {
                const timeline = document.getElementById('timeline');
                timeline.innerHTML = '';

                data.forEach(op => {
                    const timelineItem = document.createElement('div');
                    timelineItem.classList.add('timeline-item');
                    timelineItem.innerHTML = `
                        <div class="timeline-icon">
                            <i class="fa fa-check-circle fa-2x" style="color: green;"></i>
                        </div>
                        <div class="timeline-content">
                            <p>${op.op_name}</p>
                            <p>Date: ${new Date(op.op_date_time).toLocaleDateString()}</p>
                            <p>Time: ${new Date(op.op_date_time).toLocaleTimeString()}</p>
                        </div>
                    `;
                    timeline.appendChild(timelineItem);
                });
            })
            .catch(error => console.error('Error fetching timeline data:', error));
    }
});

