var user = JSON.parse(localStorage.getItem("user"))
if (user && user.stsTokenManager && user.stsTokenManager.accessToken && user.apiKey && user.uid) {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=" + user.apiKey,
    "method": "POST",
    "headers": {},
    "data": {
      "idToken": user.stsTokenManager.accessToken
    }
  }
  $.ajax(settings).done((response) => {
    if (response.users[0].localId == user.uid) {
      $("#userDropdown > span").text(user.email)
      $("#name").text(user.displayName)
      $("#imgelem").attr("src", user.photoURL) //src(user.user.email)
      var viewController = new ViewController($("#content-wrapper"))

      // viewController.setConfig()
      viewController.initTheme()

      String.prototype.capitalize = function (poep) {
        return this.charAt(0).toUpperCase() + this.slice(1);
      }

      Array.prototype.remove = function () {
        var what, a = arguments,
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

      $('.container-fluid').click(function () {
        if (!$('body').hasClass('sidenav-open') && $(window).width() < 767) {
          $('#sidebarToggleTop').click()
        }
      });
    } else location.href = "login"
  }) //.error((err => alert(err)))
} else location.href = "login"

function logOut() {
  localStorage.clear()
  location.href = "login"
}