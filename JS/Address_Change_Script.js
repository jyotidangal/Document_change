window.onload = () => {
    var mainInput = document.getElementById("meeting_date")
    mainInput.nepaliDatePicker()
    addAttendeeEntry()
  }
  
  function addAttendeeEntry() {
    const attendeesList = document.getElementById("attendees-list")
    const entryDiv = document.createElement("div")
    entryDiv.className = "attendee-entry"
    entryDiv.innerHTML = `
          <input type="text" class="attendee-name" placeholder="नाम" required>
          <select class="attendee-position" required>
              <option value="" disabled selected>पद छान्नुहोस्</option>
              <option value="सञ्चालक">सञ्चालक</option>
              <option value="शेयरधनी">शेयरधनी</option>
          </select>
          <button type="button" onclick="removeAttendeeEntry(this)">हटाउनुहोस्</button>
      `
    attendeesList.appendChild(entryDiv)
  }
  
  function removeAttendeeEntry(button) {
    const attendeesList = document.getElementById("attendees-list")
    if (attendeesList.children.length >= 1) {
      button.parentElement.remove()
    }
  }
  
  document.getElementById("add-attendee").addEventListener("click", addAttendeeEntry)
  
  // Update the form submission handler to ensure all spans are properly populated
  document.getElementById("meeting-form").addEventListener("submit", (event) => {
    event.preventDefault()
  
    // Get field values
    const companyCurrentNepali = document.getElementById("company_current_nepali").value.trim()
    const currentAddress = document.getElementById("current_address").value.trim()
    const newAddress = document.getElementById("new_address").value.trim()
    const chairperson = document.getElementById("chairperson").value.trim()
  
    // Regular expression for Nepali validation with symbols
    const nepaliRegex = /^[\u0900-\u097F\s.,""'';!?&()-]+$/ // Nepali Unicode range + common symbols
  
    // Language validation with Nepali alerts
    if (companyCurrentNepali && !nepaliRegex.test(companyCurrentNepali)) {
      alert("कम्पनीको नाम (नेपाली) मा नेपाली अक्षरहरू र स्वीकृत चिन्हहरू मात्र प्रयोग गर्नुपर्छ।")
      return
    }
  
    if (currentAddress && !nepaliRegex.test(currentAddress)) {
      alert("हालको ठेगाना (नेपाली) मा नेपाली अक्षरहरू र स्वीकृत चिन्हहरू मात्र प्रयोग गर्नुपर्छ।")
      return
    }
  
    if (newAddress && !nepaliRegex.test(newAddress)) {
      alert("नयाँ ठेगाना (नेपाली) मा नेपाली अक्षरहरू र स्वीकृत चिन्हहरू मात्र प्रयोग गर्नुपर्छ।")
      return
    }
  
    if (chairperson && !nepaliRegex.test(chairperson)) {
      alert("अध्यक्षमा नेपाली अक्षरहरू र स्वीकृत चिन्हहरू मात्र प्रयोग गर्नुपर्छ।")
      return
    }
  
    // Get the date from the input field
    const nepaliDate = document.getElementById("meeting_date").value
  
    // Function to convert English digits to Nepali digits
    function toNepaliDigits(dateStr) {
      const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"]
      return dateStr.replace(/\d/g, (digit) => nepaliDigits[digit])
    }
  
    const convertedDate = toNepaliDigits(nepaliDate.replace(/-/g, "/"))
  
    // Update all elements with the converted date
    document.querySelectorAll("[id^='r_meeting_date']").forEach((el) => {
      el.innerText = convertedDate
    })
  
    // Update all company name elements
    document.querySelectorAll("[id^='r_company_current_nepali']").forEach((el) => {
      el.innerText = companyCurrentNepali
    })
  
    // Update all current address elements
    document.querySelectorAll("[id^='r_current_address']").forEach((el) => {
      el.innerText = currentAddress
    })
  
    // Update all new address elements
    document.querySelectorAll("[id^='r_new_address']").forEach((el) => {
      el.innerText = newAddress
    })
  
    // Update all chairperson elements
    document.querySelectorAll("[id^='r_chairperson']").forEach((el) => {
      el.innerText = chairperson
    })
  
    const chairpersonName = chairperson
    const attendees = [{ name: chairpersonName, position: "अध्यक्ष" }]
  
    const attendeeEntries = document.querySelectorAll(".attendee-entry")
    attendeeEntries.forEach((entry) => {
      const name = entry.querySelector(".attendee-name").value
      const position = entry.querySelector(".attendee-position").value
      if (name && position) {
        attendees.push({ name, position })
      }
    })
  
    let presenceHTML = ""
    const nepaliNumerals = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"] // Mapping for Nepali numerals (0-9)
  
    attendees.forEach((person, index) => {
      const nepaliIndex = String(index + 1) // Get the number (1, 2, 3, etc.)
        .split("") // Split the number into its digits
        .map((digit) => nepaliNumerals[Number.parseInt(digit)]) // Convert each digit to Nepali numeral
        .join("")
      presenceHTML += `<li>${nepaliIndex}. ${person.name} - ${person.position}</li>`
    })
  
    document.getElementById("r_presence1").innerHTML = presenceHTML
  
    document.getElementById("report").classList.remove("hidden")
    showPage(1)
  })
  
  let currentPage = 1
  const totalPages = 5
  
  function showPage(pageNum) {
    document.querySelectorAll(".page").forEach((page) => page.classList.add("hidden"))
    document.getElementById(`page${pageNum}`).classList.remove("hidden")
    currentPage = pageNum
    document.getElementById("prevBtn").disabled = currentPage === 1
    document.getElementById("nextBtn").disabled = currentPage === totalPages
  }
  
  document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentPage > 1) showPage(currentPage - 1)
  })
  
  document.getElementById("nextBtn").addEventListener("click", () => {
    if (currentPage < totalPages) showPage(currentPage + 1)
  })
  
  // Update the PDF generation function to ensure all content is properly captured
  document.getElementById("downloadPdf").addEventListener("click", async () => {
    try {
      const { jsPDF } = window.jspdf
      const html2canvas = window.html2canvas
  
      if (!jsPDF || !html2canvas) {
        console.error("Required libraries not loaded: ", {
          jsPDF: !!window.jspdf,
          html2canvas: !!window.html2canvas,
        })
        alert("PDF generation libraries not loaded properly. Please refresh the page and try again.")
        return
      }
  
      const doc = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      })
  
      const pages = document.querySelectorAll(".page")
      const button = document.getElementById("downloadPdf")
      button.disabled = true
      button.textContent = "Generating..."
  
      // A4 dimensions in mm
      const pageWidth = 210
      const pageHeight = 297
      const margin = 10
  
      // Create a temporary container for rendering
      const container = document.createElement("div")
      container.style.position = "absolute"
      container.style.left = "-9999px"
      container.style.top = "0"
      container.style.width = pageWidth + "mm"
      document.body.appendChild(container)
  
      // Make sure all form values are properly populated before PDF generation
      const companyCurrentNepali = document.getElementById("company_current_nepali").value.trim()
      const currentAddress = document.getElementById("current_address").value.trim()
      const newAddress = document.getElementById("new_address").value.trim()
      const chairperson = document.getElementById("chairperson").value.trim()
  
      // Double-check that all elements are populated
      document.querySelectorAll("[id^='r_company_current_nepali']").forEach((el) => {
        if (!el.innerText) el.innerText = companyCurrentNepali
      })
      document.querySelectorAll("[id^='r_current_address']").forEach((el) => {
        if (!el.innerText) el.innerText = currentAddress
      })
      document.querySelectorAll("[id^='r_new_address']").forEach((el) => {
        if (!el.innerText) el.innerText = newAddress
      })
      document.querySelectorAll("[id^='r_chairperson']").forEach((el) => {
        if (!el.innerText) el.innerText = chairperson
      })
  
      // Show all pages for rendering
      pages.forEach((page) => {
        page.classList.remove("hidden")
        // Ensure all content is visible and properly formatted
        page.style.display = "block"
        page.style.width = pageWidth - 2 * margin + "mm"
        page.style.minHeight = "auto"
        page.style.overflow = "visible"
        page.style.position = "relative"
        page.style.pageBreakAfter = "always"
      })
  
      for (let i = 0; i < pages.length; i++) {
        // Clone the page to avoid modifying the original
        const pageClone = pages[i].cloneNode(true)
        container.innerHTML = "" // Clear container
        container.appendChild(pageClone)
  
        // Make sure all elements are visible and properly populated
        const allElements = pageClone.querySelectorAll("*")
        allElements.forEach((el) => {
          if (el.style) {
            el.style.display = el.tagName === "DIV" ? "block" : ""
            el.style.visibility = "visible"
          }
  
          // Ensure spans with IDs starting with r_ have content
          if (el.id && el.id.startsWith("r_")) {
            if (el.id.includes("company_current_nepali") && !el.innerText) {
              el.innerText = companyCurrentNepali
            } else if (el.id.includes("current_address") && !el.innerText) {
              el.innerText = currentAddress
            } else if (el.id.includes("new_address") && !el.innerText) {
              el.innerText = newAddress
            } else if (el.id.includes("chairperson") && !el.innerText) {
              el.innerText = chairperson
            }
          }
        })
  
        // Wait for any potential reflows
        await new Promise((resolve) => setTimeout(resolve, 500))
  
        // Render the page with higher quality and better handling
        const canvas = await html2canvas(pageClone, {
          scale: 2,
          useCORS: true,
          logging: true,
          allowTaint: true,
          backgroundColor: "#FFFFFF",
          windowWidth: pageWidth * 3.78, // Convert mm to px (1mm ≈ 3.78px)
          windowHeight: pageHeight * 3.78,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
        })
  
        // Add page to PDF
        if (i > 0) doc.addPage()
  
        const imgData = canvas.toDataURL("image/jpeg", 1.0)
        doc.addImage(
          imgData,
          "JPEG",
          margin,
          margin,
          pageWidth - 2 * margin,
          (canvas.height * (pageWidth - 2 * margin)) / canvas.width,
          "",
          "FAST",
        )
      }
  
      // Clean up the container
      document.body.removeChild(container)
  
      // Restore the original view
      pages.forEach((page) => {
        page.classList.add("hidden")
        page.style.display = ""
        page.style.width = ""
        page.style.minHeight = ""
        page.style.overflow = ""
        page.style.position = ""
        page.style.pageBreakAfter = ""
      })
      document.getElementById(`page${currentPage}`).classList.remove("hidden")
  
      // Save the PDF
      doc.save(`Address_Change_${document.getElementById("meeting_date").value.replace(/\//g, "-")}.pdf`)
  
      button.disabled = false
      button.textContent = "Download as PDF"
    } catch (err) {
      console.error("PDF generation failed:", err)
      alert("PDF generation failed: " + err.message)
  
      // Restore the original view
      document.querySelectorAll(".page").forEach((page) => page.classList.add("hidden"))
      document.getElementById(`page${currentPage}`).classList.remove("hidden")
  
      const button = document.getElementById("downloadPdf")
      button.disabled = false
      button.textContent = "Download as PDF"
    }
  })
  