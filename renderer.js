$(document).ready(function() {
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
});
console.log('ready');
$('#welcome').hide()
$('.button-collapse').sideNav({
  menuWidth: 300, // Default is 300
  edge: 'left', // Choose the horizontal origin
  closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
  draggable: true // Choose whether you can drag to open on touch screens
});

var config = {
  apiKey: "AIzaSyC5IQNOr7949TLbnJBje28x-umSU-J68DI",
  authDomain: "rocketchat-d96c9.firebaseapp.com",
  databaseURL: "https://rocketchat-d96c9.firebaseio.com",
  projectId: "rocketchat-d96c9",
  storageBucket: "rocketchat-d96c9.appspot.com",
  messagingSenderId: "623290563736"
};
firebase.initializeApp(config);
var database = firebase.database();
var provider = new firebase.auth.GoogleAuthProvider();
$('.login').click(function() {

  var user = firebase.auth().currentUser;

  if (user) {
    console.log('loggin out');
    firebase.auth().signOut().then(function() {}).catch(function(error) {
      Materialize.toast('Log Out ERROR try again', 4000)
    });

  } else {
    console.log('logging in');
    Materialize.toast('Logging In', 4000)
    firebase.auth().signInWithRedirect(provider);
  }

})

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    $('#loader').fadeOut(400)
    Materialize.toast('Logged In', 4000)
    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;
    if (user != null) {
      name = user.displayName;
      email = user.email;
      photoUrl = user.photoURL;
      emailVerified = user.emailVerified;
      uid = user.uid;
    }
    firebase.database().ref('users/' + uid + '/info/').set({
      name: name,
      email: email,
      photoUrl: photoUrl
    });
    useremail = encode(user.email);

    firebase.database().ref('/chats/' + useremail + '/').on('child_added', function(data) {

      console.log(data.key);
      var sender = decode(data.key);
      console.log(sender);
      $("#newchat").after("<li><a class='chatchoice' data-recipient='" + sender + "' href='#'>" + sender + "</a></li>");
    });
  } else {
    $('#loader').fadeOut(400)
    $('#welcome').fadeIn(400)


  }
});
$('#newchatcreate').click(function() {
  var user = firebase.auth().currentUser;

  if (user) {
    var recipient = $("#newchatemail").val();
    recipient = encode(recipient);
    useremail = encode(user.email);
    console.log(recipient);
    console.log(useremail);
    updatechat(true, recipient, useremail)

  } else {
    Materialize.toast('Please Login', 4000)
  }
})

function encode(a) {
  return encodeURI(a).replace(/\@/g, '*a').replace(/\./g, '*d');
}

function decode(a) {
  return decodeURI(a).replace(/\*a/g, '@').replace(/\*d/g, '.');
}

function updatechat(a, recipient, useremail) {
  var updates = {};
  updates['/chats/' + recipient + '/' + useremail] = true;
  updates['/chats/' + useremail + '/' + recipient] = true;
  return firebase.database().ref().update(updates);
}
