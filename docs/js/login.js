var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
firebase.auth().useDeviceLanguage();

async function emailLogin() {

}


async function googleLogin() {
    firebase.auth().signInWithPopup(provider).then(function (result) {
        var token = result.credential.accessToken;
        var user = result.user;
        console.log(result)
        localStorage.setItem("user", JSON.stringify(result.user))
        // var settings = {
        //     "async": true,
        //     "crossDomain": true,
        //     "url": "https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=" + result.user.l,
        //     "method": "POST",
        //     "headers": {},
        //     "data": {
        //         "idToken": result.user._lat
        //     }
        // }

        // $.ajax(settings).done(function (response) {
        //     console.log(response);
        location.href = "../"
        // });
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
}

// firebase.auth().getRedirectResult().then(function (result) {
//     if (result.credential) {
//         // This gives you a Google Access Token. You can use it to access the Google API.
//         var token = result.credential.accessToken;
//         // ...
//     }
//     // The signed-in user info.
//     var user = result.user;
//     console.log(result)
// }).catch(function (error) {
//     alert(error)
// });