var viewController = new ViewController($("#content-wrapper")),
  user = JSON.parse(localStorage.getItem("user"));
viewController.initTheme();
// if (user && user.stsTokenManager && user.stsTokenManager.accessToken &&
// user.apiKey && user.uid) {
if (true) {
  // var settings = {   "async": true,   "crossDomain": true,   "url":
  // "https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?ke
  // y =" + user.apiKey,   "method": "POST",   "headers": {},   "data": {
  // "idToken": user.stsTokenManager.accessToken   },   "error": (err, text, code)
  // => {     if (err.status == 400) {       var poep = alert("Your session has
  // expired. Please log in again.");       !poep ? location.href = "login" :
  // location.href = "login"     }   } } $.ajax(settings).done((response) => {
  // var whitelisted = ["i6g61bCjB3MVI6Db0t2Idw5xbsF2"]
  // if (response.users[0].localId == user.uid && whitelisted.includes(user.uid))
  // {} else {   var poep = confirm("Your account does not meet the required
  // permissions to use the admin features of our dashboard.\nPress cancel to
  // continue to the login page, or press ok to use the dashboard view only.");
  // !poep ? location.href = "login" : console.log('')
  // $("#command_wrapper").remove() }
  // $("#userDropdown > span").text(user.email)
  // $("#name").text(user.displayName)
  // $("#imgelem").attr("src", user.photoURL) //src(user.user.email)
  // viewController.setConfig()
  // $('.container-fluid').click(function () {
  //     if (!$('body').hasClass('sidenav-open') && $(window).width() < 767) {
  //         $('#sidebarToggleTop').click()
  //     }
  // });
  // }) //.error((err => alert(err))) } else location.href = "login"
}
function logOut() {
  localStorage.clear();
  location.href = "login";
}

String.prototype.capitalize = function (poep) {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

Array.prototype.remove = function () {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

//event listener
window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);

function onKeyDown(e) {
  let input = {};
  e.preventDefault();
  if (e.repeat) return;
  e = e || window.event;

  if (e.keyCode == "38") {
    // up arrow
    socket.emit("input", { u: true });
    input.u = true;
  } else if (e.keyCode == "40") {
    // down arrow
    socket.emit("input", { d: true });
    input.d = true;
  } else if (e.keyCode == "37") {
    // left arrow
    socket.emit("input", { l: true });
    input.l = true;
  } else if (e.keyCode == "39") {
    // right arrow
    socket.emit("input", { r: false });
    input.r = true;
  }
  $("#data").html(library.json.prettyPrint(input));
}

function onKeyUp(e) {
  let input = {};
  if (e.repeat) return;
  e = e || window.event;
  if (e.keyCode == "38") {
    e.preventDefault();
    // up arrow
    socket.emit("input", { u: false });
    input.u = false;
  } else if (e.keyCode == "40") {
    e.preventDefault();
    // down arrow
    socket.emit("input", { d: false });
    input.d = false;
  } else if (e.keyCode == "37") {
    e.preventDefault();
    // left arrow
    socket.emit("input", { l: false });
    input.l = false;
  } else if (e.keyCode == "39") {
    e.preventDefault();
    // right arrow
    socket.emit("input", { r: true });
    input.r = false;
  }
  $("#data").html(library.json.prettyPrint(input));
}
