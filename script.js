const countries = [
  "United State",
  "India",
  "France",
  "Germany",
  "Japan",
  "Australia",
];

let index = 0;
const countryEl = document.getElementById("country-name");

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTomorrow(dateStr) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  return formatDate(date);
}

function initCountryRotation() {
  if (!countryEl) return;

  countryEl.textContent = countries[0];

  setInterval(() => {
    index = (index + 1) % countries.length;
    countryEl.textContent = countries[index];
  }, 200);
}

function initBookingForm() {
  const form = document.getElementById("booking-form");
  const startDate = document.getElementById("start-date");
  const endDate = document.getElementById("end-date");
  const description = document.getElementById("description");
  const charCount = document.getElementById("char-count");
  const formError = document.getElementById("form-error");

  if (!form || !startDate || !endDate || !description || !charCount || !formError) {
    return;
  }

  const today = formatDate(new Date());
  startDate.min = today;
  endDate.min = today;

  startDate.addEventListener("change", () => {
    if (startDate.value) {
      endDate.min = getTomorrow(startDate.value);
      if (endDate.value && endDate.value <= startDate.value) {
        endDate.value = "";
      }
    } else {
      endDate.min = today;
    }
  });

  description.addEventListener("input", () => {
    charCount.textContent = `${description.value.length} / 500`;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formError.hidden = true;
    formError.textContent = "";

    const whereTo = document.getElementById("where-to").value.trim();
    const persons = parseInt(document.getElementById("persons").value, 10);
    const start = startDate.value;
    const end = endDate.value;
    const desc = description.value.trim();

    if (!whereTo) {
      formError.textContent = "Please select a destination.";
      formError.hidden = false;
      return;
    }

    if (!persons || persons < 1) {
      formError.textContent = "Please enter a valid number of persons (minimum 1).";
      formError.hidden = false;
      return;
    }

    if (!start || start < today) {
      formError.textContent = "Start date must be today or a future date.";
      formError.hidden = false;
      return;
    }

    if (!end || end <= start) {
      formError.textContent = "End date must be greater than start date.";
      formError.hidden = false;
      return;
    }

    if (desc.length < 50 || desc.length > 500) {
      formError.textContent = "Description must be between 50 and 500 characters.";
      formError.hidden = false;
      return;
    }

    alert("booking successful");
    form.reset();
    charCount.textContent = "0 / 500";
    startDate.min = today;
    endDate.min = today;
  });
}

function initPackageButtons() {
  document.querySelectorAll(".package-book").forEach((button) => {
    button.addEventListener("click", () => {
      alert("booking successful");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initCountryRotation();
  initBookingForm();
  initPackageButtons();
});
