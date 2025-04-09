window.onload = function () {
    var mainInput = document.getElementById("meeting_date");
    mainInput.nepaliDatePicker();
    addAttendeeEntry(); 
};

function addAttendeeEntry() {
    const attendeesList = document.getElementById("attendees-list");
    const entryDiv = document.createElement("div");
    entryDiv.className = "attendee-entry";
    entryDiv.innerHTML = `
        <input type="text" class="attendee-name" placeholder="नाम" required>
        <select class="attendee-position" required>
            <option value="" disabled selected>पद छान्नुहोस्</option>
            <option value="सञ्चालक">सञ्चालक</option>
            <option value="शेयरधनी">शेयरधनी</option>
        </select>
        <button type="button" onclick="removeAttendeeEntry(this)">हटाउनुहोस्</button>
    `;
    attendeesList.appendChild(entryDiv);
}

function removeAttendeeEntry(button) {
    const attendeesList = document.getElementById("attendees-list");
    if (attendeesList.children.length >= 1) {
        button.parentElement.remove();
    }
}

document.getElementById("add-attendee").addEventListener("click", addAttendeeEntry);

document.getElementById("meeting-form").addEventListener("submit", function(event) {
    event.preventDefault();
// Get field values
const chairperson = document.getElementById("chairperson").value.trim();
const companyNewEnglish = document.getElementById("company_new_english").value.trim();
const companyNewNepali = document.getElementById("company_new_nepali").value.trim();
const companyCurrentEnglish = document.getElementById("company_current_english").value.trim();
const companyCurrentNepali = document.getElementById("company_current_nepali").value.trim();

// Regular expressions for language validation with symbols
const nepaliRegex = /^[\u0900-\u097F\s.,!?&()-]+$/; // Nepali Unicode range + common symbols
const englishRegex = /^[A-Za-z\s.,!?&()-]+$/; // English letters + common symbols

// Language validation with Nepali alerts
if (chairperson && !nepaliRegex.test(chairperson)) {
    alert('अध्यक्षमा नेपाली अक्षरहरू मात्र प्रयोग गर्नुपर्छ।');
    return;
}

if (companyNewEnglish && !englishRegex.test(companyNewEnglish)) {
    alert('कम्पनीको नयाँ नाम (अंग्रेजी) मा अंग्रेजी अक्षरहरू मात्र प्रयोग गर्नुपर्छ।');
    return;
}

if (companyNewNepali && !nepaliRegex.test(companyNewNepali)) {
    alert('कम्पनीको नयाँ नाम (नेपाली) मा नेपाली अक्षरहरू मात्र प्रयोग गर्नुपर्छ।');
    return;
}

if (companyCurrentEnglish && !englishRegex.test(companyCurrentEnglish)) {
    alert('कम्पनीको हालको नाम (अंग्रेजी) मा अंग्रेजी अक्षरहरू मात्र प्रयोग गर्नुपर्छ।');
    return;
}

if (companyCurrentNepali && !nepaliRegex.test(companyCurrentNepali)) {
    alert('कम्पनीको हालको नाम (नेपाली) मा नेपाली अक्षरहरू मात्र प्रयोग गर्नुपर्छ।');
    return;
}


   // Get the date from the input field
const nepaliDate = document.getElementById("meeting_date").value;

// Function to convert English digits to Nepali digits
function toNepaliDigits(dateStr) {
    const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return dateStr.replace(/\d/g, digit => nepaliDigits[digit]);
}

// Convert the date format from 2081-12-12 to २०८१/१२/१२
const convertedDate = toNepaliDigits(nepaliDate.replace(/-/g, '/'));

// Update the elements with the converted date
document.getElementById("r_meeting_date1").innerText = convertedDate;
document.getElementById("r_meeting_date2").innerText = convertedDate;
document.getElementById("r_meeting_date3").innerText = convertedDate;
document.getElementById("r_meeting_date4").innerText = convertedDate;

    document.querySelectorAll("[id^='r_company_current_nepali']").forEach(el => el.innerText = document.getElementById("company_current_nepali").value);
    document.querySelectorAll("[id^='r_company_current_english']").forEach(el => el.innerText = document.getElementById("company_current_english").value);
   document.querySelectorAll("[id^='r_company_new_nepali']").forEach(el => el.innerText = document.getElementById("company_new_nepali").value);
    document.querySelectorAll("[id^='r_company_new_english']").forEach(el => el.innerText = document.getElementById("company_new_english").value);
    document.querySelectorAll("[id^='r_chairperson']").forEach(el => el.innerText = document.getElementById("chairperson").value);

    const chairpersonName = document.getElementById("chairperson").value;
    const attendees = [{ name: chairpersonName, position: "अध्यक्ष" }];
    
    const attendeeEntries = document.querySelectorAll(".attendee-entry");
    attendeeEntries.forEach(entry => {
        const name = entry.querySelector(".attendee-name").value;
        const position = entry.querySelector(".attendee-position").value;
        if (name && position) {
            attendees.push({ name, position });
        }
    });

    let presenceHTML = "";
    const nepaliNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९']; // Mapping for Nepali numerals (0-9)

    attendees.forEach((person, index) => {
        let nepaliIndex = String(index + 1)  // Get the number (1, 2, 3, etc.)
            .split('')                      // Split the number into its digits
            .map(digit => nepaliNumerals[parseInt(digit)]) // Convert each digit to Nepali numeral
            .join('');    
        presenceHTML += `<li>${nepaliIndex}. ${person.name} - ${person.position}</li>`;
    });
    
    document.getElementById("r_presence1").innerHTML = presenceHTML;

    document.getElementById("report").classList.remove("hidden");
    showPage(1);
});

let currentPage = 1;
const totalPages = 5;

function showPage(pageNum) {
    document.querySelectorAll(".page").forEach(page => page.classList.add("hidden"));
    document.getElementById(`page${pageNum}`).classList.remove("hidden");
    currentPage = pageNum;
    document.getElementById("prevBtn").disabled = currentPage === 1;
    document.getElementById("nextBtn").disabled = currentPage === totalPages;
}

document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentPage > 1) showPage(currentPage - 1);
});

document.getElementById("nextBtn").addEventListener("click", () => {
    if (currentPage < totalPages) showPage(currentPage + 1);
});

document.getElementById("downloadPdf").addEventListener("click", async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        unit: 'in',
        format: 'a4',
        orientation: 'portrait'
    });
    
    const pages = document.querySelectorAll(".page");
    const button = document.getElementById("downloadPdf");
    button.disabled = true;
    button.textContent = "Generating...";

    // A4 dimensions in inches (with 0.5in margins)
    const pageWidth = 8.27;
    const pageHeight = 11.69;
    const margin = 0.5;
    const contentWidth = pageWidth - 2 * margin;
    const contentHeight = pageHeight - 2 * margin;

    try {
        // Temporarily show all pages to capture them
        pages.forEach(page => page.classList.remove("hidden"));

        // Render page 1 as a single page
        const page1 = document.getElementById("page1");
        const canvas1 = await html2canvas(page1, {
            scale: 2,
            width: contentWidth * 96,
            height: contentHeight * 96, // Cap at one page height
            useCORS: true,
            logging: false,
            windowHeight: contentHeight * 96 // Ensure viewport matches content height
        });

        const imgData1 = canvas1.toDataURL('image/jpeg', 0.95);
        doc.addImage(imgData1, 'JPEG', margin, margin, contentWidth, contentHeight);

        // Render pages 2, 3, and 4
        for (let i = 1; i < pages.length; i++) {
            const page = pages[i];
            const canvas = await html2canvas(page, {
                scale: 2,
                width: contentWidth * 96,
                height: contentHeight * 96,
                useCORS: true,
                logging: false
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            doc.addPage();
            doc.addImage(imgData, 'JPEG', margin, margin, contentWidth, contentHeight);
        }

        // Save the PDF
        doc.save(`Special_General_Meeting_${document.getElementById("meeting_date").value.replace(/\//g, '-')}.pdf`);
        
        // Restore the original page view
        showPage(currentPage);
        button.disabled = false;
        button.textContent = "Download as PDF";
    } catch (err) {
        console.error("PDF generation failed:", err);
        alert("PDF generation failed. Please try again.");
        showPage(currentPage);
        button.disabled = false;
        button.textContent = "Download as PDF";
    }
});