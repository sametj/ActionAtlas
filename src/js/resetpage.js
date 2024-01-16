import { API_BASE_URL } from "./APIURL.js";

const resetDiv = document.querySelector(".reset-div");
const resetForm = document.querySelector(".reset-form");
const alert = document.querySelector(".alert-section");

const resetButton = document.querySelector(".reset-button");
const confirmResetButton = document.querySelector("#reset-button");
const loginButton = document.querySelector(".login-btn");

const emailInput = document.querySelector("#user-email");

loginButton.addEventListener("click", () => {
  window.location.href = "index.html";
});

resetButton.addEventListener("click", () => {
  if (emailInput.value === "") {
    alert.classList.add("show");
    alert.innerHTML = "Please enter your email";
    setTimeout(() => {
      alert.classList.remove("show");
    }, 2000);
  } else {
    fetch(`${API_BASE_URL}user/verifyemail`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput.value,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          alert.classList.add("show");
          alert.innerHTML = data.error;
          setTimeout(() => {
            alert.classList.remove("show");
          }, 2000);
        } else {
          alert.classList.add("show");
          alert.innerHTML = data.sucess;
          setTimeout(() => {
            alert.classList.remove("show");
          }, 2000);
          resetDiv.classList.add("hide");
          resetForm.classList.remove("hide");
        }
      });
  }
});

//reset password
const newPassword = document.querySelector("#new-password");
const confirmPassword = document.querySelector("#confirm-new-password");
const resetPassword = document.querySelector("#reset-button");

resetPassword.addEventListener("click", () => {
  if (newPassword.value === "" || confirmPassword.value === "") {
    alert.classList.add("show");
    alert.innerHTML = "Please enter your new password";
    setTimeout(() => {
      alert.classList.remove("show");
    }, 2000);
  } else if (newPassword.value !== confirmPassword.value) {
    alert.classList.add("show");
    alert.innerHTML = "Password does not match";
    setTimeout(() => {
      alert.classList.remove("show");
    }, 2000);
  } else {
    fetch(`${API_BASE_URL}user/resetpassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput.value,
        password: newPassword.value,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        alert.classList.add("show");
        alert.innerHTML = data.sucess + " Redirecting to login page!";
        alert.style.backgroundColor = "green";
        setTimeout(() => {
          alert.classList.remove("show");
          window.location.href = "index.html";
        }, 1000);
      });
  }
});
