function check_pass() {
  let password = document.getElementById('password').value;
  let confirmedPassword = document.getElementById('confirm_password').value;
  // requiring passwords to be the same and have at least 6 characters including one letter and digit
  if (password === confirmedPassword && password.length > 5 && password.match("[0-9]") && password.match("[A-z]")) {
    document.getElementById('submit').disabled = false;
  }
  else {
    document.getElementById('submit').disabled = false;
  }
}