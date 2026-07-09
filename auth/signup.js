const { getQueryParam, registerUser } = window.CafeUtils;

const form = document.getElementById("signup-form");
const errorMessage = document.getElementById("error-message");
const loginLink = document.getElementById("login-link");
const redirectPath = getQueryParam("redirect") || "../my/index.html";

function isSafeRedirect(value) {
  return value && !value.startsWith("http://") && !value.startsWith("https://") && !value.startsWith("//");
}

function getRedirectPath() {
  return isSafeRedirect(redirectPath) ? redirectPath : "../my/index.html";
}

loginLink.href = `./login.html?redirect=${encodeURIComponent(getRedirectPath())}`;

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const result = registerUser({ name, email, password });

  if (!result.success) {
    errorMessage.textContent = result.message;
    errorMessage.hidden = false;
    return;
  }

  window.location.href = getRedirectPath();
});
