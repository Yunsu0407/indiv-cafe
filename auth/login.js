const { getQueryParam, getCurrentUser, login } = window.CafeUtils;

const form = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");
const signupLink = document.getElementById("signup-link");
const redirectPath = getQueryParam("redirect") || getDefaultRedirectPath();

function getDefaultRedirectPath() {
  try {
    const referrerPath = new URL(document.referrer).pathname;

    if (referrerPath.includes("/orders/")) {
      return "../orders/list.html";
    }
  } catch (error) {
    return "../my/index.html";
  }

  return "../my/index.html";
}

function isSafeRedirect(value) {
  return value && !value.startsWith("http://") && !value.startsWith("https://") && !value.startsWith("//");
}

function getRedirectPath() {
  return isSafeRedirect(redirectPath) ? redirectPath : "../my/index.html";
}

if (getCurrentUser()) {
  window.location.href = getRedirectPath();
}

signupLink.href = `./signup.html?redirect=${encodeURIComponent(getRedirectPath())}`;

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const result = login(email, password);

  if (!result.success) {
    errorMessage.textContent = result.message;
    errorMessage.hidden = false;
    return;
  }

  window.location.href = getRedirectPath();
});
