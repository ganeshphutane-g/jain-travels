const USERS_KEY = "jainTravelsUsers";
const SESSION_KEY = "jainTravelsSession";

const EVALUATOR_ACCOUNT = {
  fullName: "Evaluator Account",
  contact: "9876543210",
  dob: "1990-01-01",
  email: "evaluator@jaintravels.com",
  password: "JainTravels@123",
  gender: "Other",
};

function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function seedEvaluatorAccount() {
  const users = getUsers();
  const exists = users.some(
    (user) => user.email.toLowerCase() === EVALUATOR_ACCOUNT.email.toLowerCase()
  );

  if (!exists) {
    users.push({ ...EVALUATOR_ACCOUNT, contact: "9876543210" });
    saveUsers(users);
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
}

function isValidName(name) {
  return /^[A-Za-z\s]{2,}$/.test(name.trim());
}

function isValidContact(contact) {
  return /^[0-9]{10}$/.test(contact.trim());
}

function getAgeFromDob(dob) {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age;
}

function showError(element, message) {
  if (!element) return;
  element.textContent = message;
  element.hidden = false;
}

function hideError(element) {
  if (!element) return;
  element.textContent = "";
  element.hidden = true;
}

function initRegisterForm() {
  const form = document.getElementById("register-form");
  if (!form) return;

  const formError = document.getElementById("form-error");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    hideError(formError);

    const fullName = document.getElementById("fullname").value.trim();
    const contact = document.getElementById("contact").value.trim();
    const dob = document.getElementById("dob").value;
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const genderInput = form.querySelector('input[name="gender"]:checked');

    if (!isValidName(fullName)) {
      showError(formError, "Please enter a valid full name (letters only, min 2 characters).");
      return;
    }

    if (!isValidContact(contact)) {
      showError(formError, "Please enter a valid 10-digit contact number.");
      return;
    }

    if (!dob) {
      showError(formError, "Please select your date of birth.");
      return;
    }

    const age = getAgeFromDob(dob);
    const today = new Date();
    const birthDate = new Date(dob);

    if (birthDate >= today) {
      showError(formError, "Date of birth must be in the past.");
      return;
    }

    if (age < 18) {
      showError(formError, "You must be at least 18 years old to register.");
      return;
    }

    if (!isValidEmail(email)) {
      showError(formError, "Please enter a valid email address.");
      return;
    }

    if (!isValidPassword(password)) {
      showError(
        formError,
        "Password must be at least 8 characters with 1 uppercase letter and 1 number."
      );
      return;
    }

    if (!genderInput) {
      showError(formError, "Please select your gender.");
      return;
    }

    const users = getUsers();
    const emailTaken = users.some((user) => user.email.toLowerCase() === email);

    if (emailTaken) {
      showError(formError, "This email is already registered. Please login instead.");
      return;
    }

    users.push({
      fullName,
      contact,
      dob,
      email,
      password,
      gender: genderInput.value,
    });

    saveUsers(users);
    alert("Registration successful");
    window.location.href = "login.html";
  });
}

function initLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;

  const formError = document.getElementById("form-error");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    hideError(formError);

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    if (!isValidEmail(email)) {
      showError(formError, "Please enter a valid email address.");
      return;
    }

    if (!password) {
      showError(formError, "Please enter your password.");
      return;
    }

    const users = getUsers();
    const user = users.find(
      (entry) => entry.email.toLowerCase() === email && entry.password === password
    );

    if (!user) {
      showError(formError, "Invalid email or password.");
      return;
    }

    sessionStorage.setItem(SESSION_KEY, user.email);
    alert("Login successful");
    window.location.href = "index.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  seedEvaluatorAccount();
  initRegisterForm();
  initLoginForm();
});
