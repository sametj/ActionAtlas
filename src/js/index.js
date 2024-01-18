//imports
import { API_BASE_URL } from "./APIURL.js";

//ALERTS
const alertDiv = document.querySelector(".alert-section");

//container elements
const loginContainer = document.querySelector(".login-div");
const signUpContainer = document.querySelector(".signup-div");

//login elements
const loginEmail = document.querySelector("#user-email");
const loginPassword = document.querySelector("#login-password-input");
const loginBtn = document.querySelector("#account-login-button");
const signUpBtn = document.querySelector("#create-account-button");

signUpBtn.addEventListener("click", () => {
  loginContainer.classList.add("hide");
  signUpContainer.classList.remove("hide");
});

//sign up elements
const username = document.querySelector("#registration-username");
const signUpEmail = document.querySelector("#registration-email");
const signUpPassword = document.querySelector("#registration-password");
const confirmPassword = document.querySelector(
  "#registration-confirm-password"
);
const registerBtn = document.querySelector("#register-button");
const loginButton = document.querySelector("#login-btn");

loginButton.addEventListener("click", () => {
  signUpContainer.classList.add("hide");
  loginContainer.classList.remove("hide");
});

//login Authentication
loginBtn.addEventListener("click", () => {
  const email = loginEmail.value;
  const password = loginPassword.value;
  if (email === "" || password === "") {
    alertDiv.innerHTML = "Please fill in all fields";
    alertDiv.classList.add("show");
    setTimeout(() => {
      alertDiv.classList.remove("show");
    }, 3000);
  } else {
    fetch(`${API_BASE_URL}user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          alertDiv.innerHTML = data.error;
          alertDiv.classList.add("show");
          setTimeout(() => {
            alertDiv.classList.remove("show");
          }, 3000);
        } else {
          localStorage.setItem("userid", data.id);
          localStorage.setItem("username", data.username);
          window.location.href = "todopage.html?user=" + data.id;
        }
      });
  }
});

//sign up Authentication
registerBtn.addEventListener("click", () => {
  const email = signUpEmail.value;
  const password = signUpPassword.value;
  const confirm = confirmPassword.value;
  const usrname = username.value;
  if (email === "" || password === "" || confirm === "" || usrname === "") {
    alertDiv.innerHTML = "Please fill in all fields";
    alertDiv.classList.add("show");
    setTimeout(() => {
      alertDiv.classList.remove("show");
    }, 3000);
  } else if (password !== confirm) {
    alertDiv.innerHTML = "Passwords do not match";
    alertDiv.classList.add("show");
    setTimeout(() => {
      alertDiv.classList.remove("show");
    }, 3000);
  } else {
    fetch(`${API_BASE_URL}user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usrname,
        email: email,
        password: password,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          alertDiv.innerHTML = data.error;
          alertDiv.classList.add("show");
          setTimeout(() => {
            alertDiv.classList.remove("show");
          }, 3000);
        } else {
          localStorage.setItem("userid", data.user.id);
          localStorage.setItem("username", data.user.username);
          alertDiv.innerHTML =
            "Account created successfully! Redirecting to todo page...";
          alertDiv.classList.add("show");
          setTimeout(() => {
            alertDiv.classList.remove("show");
            window.location.href = "todopage.html?user=" + data.user.id;
          }, 3000);
        }
      });
  }
});
