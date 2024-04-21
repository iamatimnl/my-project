document.addEventListener("DOMContentLoaded", function() {
  const dateElements = {
    mon: document.getElementById('mon'),
    tue: document.getElementById('tue'),
    wed: document.getElementById('wed'),
    thu: document.getElementById('thu'),
    fri: document.getElementById('fri'),
    sat: document.getElementById('sat'),
    sun: document.getElementById('sun')
  };
  const timesElements = {
    mon: document.getElementById('times-mon'),
    tue: document.getElementById('times-tue'),
    wed: document.getElementById('times-wed'),
    thu: document.getElementById('times-thu'),
    fri: document.getElementById('times-fri'),
    sat: document.getElementById('times-sat'),
    sun: document.getElementById('times-sun')
  };
  const weekSelect = document.getElementById("weekSelect");
  const monthSelect = document.getElementById("monthSelect");
  const yearSelect = document.getElementById("yearSelect");
  const submitButton = document.getElementById("submit");
  const resetButton = document.getElementById("reset");
  const nameSelect = document.getElementById("nameSelect");
  const allButtons = document.querySelectorAll('.button'); // Assume all actionable buttons have class 'button'

  function updateButtonStyles() {
      const isActive = nameSelect.value && nameSelect.value !== "Aanmelden";
      allButtons.forEach(button => {
          if (isActive) {
              button.classList.add('active-select');
          } else {
              button.classList.remove('active-select');
          }
      });
  }

  nameSelect.addEventListener("change", updateButtonStyles);
  updateButtonStyles(); // Call this function initially to set the correct state based on the default selection

  function disableControls(disable) {
    const buttons = document.querySelectorAll('.time-slot, #reset');
    buttons.forEach(button => {
      button.disabled = disable;
    });
  }

  function populateYearSelect() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 10; i <= currentYear; i++) {
      let option = document.createElement("option");
      option.value = i;
      option.text = i;
      if (i === currentYear) {
        option.selected = true;
      }
      yearSelect.appendChild(option);
    }
  }

  function populateMonthSelect() {
    const months = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
    const currentMonth = new Date().getMonth();
    monthSelect.innerHTML = '';
    months.forEach((month, index) => {
      let option = document.createElement("option");
      option.value = index + 1;
      option.text = month;
      if (index === currentMonth) {
        option.selected = true;
      }
      monthSelect.appendChild(option);
    });
  }

  function updateCalendarDatesByMonth(year, month) {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    const startWeek = Math.ceil(((firstDayOfMonth - new Date(year, 0, 1)) / 86400000 + firstDayOfMonth.getDay() + 1) / 7);
    const endWeek = Math.ceil(((lastDayOfMonth - new Date(year, 0, 1)) / 86400000 + lastDayOfMonth.getDay() + 1) / 7);
    populateWeekNumbers(startWeek, endWeek);
    updateCalendarDates(startWeek);
  }

  function getCurrentWeek() {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const startOffset = firstDayOfYear.getDay(); // the day of week the year started on
    const pastDaysOfYear = Math.floor((today - firstDayOfYear) / 86400000); // floor used to complete current day
    return Math.ceil((pastDaysOfYear + startOffset) / 7);
 }

  function populateWeekNumbers(startWeek, endWeek) {
    weekSelect.innerHTML = ''; // Clear existing options
    const currentWeek = getCurrentWeek();
    for (let i = startWeek; i <= endWeek; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.text = "Week " + i;
        if (i === currentWeek) {
            option.selected = true;  // Ensure current week is selected by default
        }
        weekSelect.appendChild(option);
    }
 }


  function updateCalendarDates(weekNumber) {
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value) - 1;
    const startOfYear = new Date(year, 0, 1);
    const startDay = startOfYear.getDay() || 7;
    const daysOffset = (weekNumber - 1) * 7 - (startDay - 1);
    startOfYear.setDate(startOfYear.getDate() + daysOffset);

    Object.keys(dateElements).forEach((day, index) => {
      const dayDate = new Date(startOfYear.getFullYear(), startOfYear.getMonth(), startOfYear.getDate() + index);
      dateElements[day].textContent = `${dayDate.getDate()}/${dayDate.getMonth() + 1}`;
    });
    populateTimeSlots();
  }

  function populateTimeSlots() {
    Object.keys(timesElements).forEach(day => {
        const timesContainer = timesElements[day];
        timesContainer.innerHTML = ''; // Clear previous buttons
        for (let hour = 12; hour <= 20; hour++) {
            const button = document.createElement("button");
            button.textContent = `${hour}:00`; // Set button text to the hour
            button.classList.add("time-slot"); // Ensure class name "time-slot" matches with CSS
            button.dataset.day = day; // Store day information on the button for later reference
            button.dataset.hour = hour; // Store hour information on the button for later reference

            button.addEventListener('click', function() {
                // Find any selected button within the same day and deselect it
                document.querySelectorAll('.time-slot[data-day="' + this.dataset.day + '"].selected').forEach(btn => {
                    btn.classList.remove('selected');
                });

                // Select this button
                this.classList.add('selected');
                
                // Display a custom message based on the day and time
                displayCustomMessage(this.dataset.day, this.dataset.hour);
                
                // Optionally, update UI or other elements based on the selection
                updateSelectedTimesDisplay(); // This function updates the UI to show selected times
            });
            timesContainer.appendChild(button);
        }
    });
 }

 

  function updateSelectedTimesDisplay() {
    const selectedButtons = document.querySelectorAll('.time-slot.selected');
    const selectedTimes = Array.from(selectedButtons).map(btn => {
        return `${btn.dataset.day} at ${btn.dataset.hour}:00`;
    });
    console.log("Selected Times: ", selectedTimes.join(", "));
    // Additional code to update the display or handle other UI elements based on selected times
 }

  // Initialize the calendar with current date settings
  populateYearSelect();
  populateMonthSelect(parseInt(yearSelect.value));

  // Initially disable controls until a valid selection is made
  disableControls(true);  // 禁用所有控制，直到进行选择

  // Add event listeners to handle user changes
  yearSelect.addEventListener("change", function() {
    populateMonthSelect(parseInt(yearSelect.value));
  });

  monthSelect.addEventListener("change", function() {
    updateCalendarDatesByMonth(parseInt(yearSelect.value), parseInt(monthSelect.value));
  });

  weekSelect.addEventListener("change", function() {
    updateCalendarDates(parseInt(weekSelect.value));
  });

  // Initially populate weekSelect and trigger update
  updateCalendarDatesByMonth(parseInt(yearSelect.value), parseInt(monthSelect.value));
  weekSelect.dispatchEvent(new Event('change'));
});
