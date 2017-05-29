$(document).ready(function() {
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
  $('#chatwindow').hide()
$('#chatchooser').hide();
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
    firebase.auth().signOut().then(function() {
      window.location.reload()
    }).catch(function(error) {
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
    $('#chatchooser').fadeIn(400);
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
      $("#newchat").after("<li class='chatchoice' data-recipient='" + sender + "' ><a href='#'>" + sender + "</a></li>");
      $("#choicebox").append("<div class='card-panel waves-effect chatchoice' data-recipient='" + sender + "' >" + sender + "</div>");
      $('.chatchoice').click(function() {
        $('#chatchooser').fadeOut(400);
        $('.active').removeClass('active');
        $('.message').remove();
        $('#chatwindow').hide().fadeIn(400, function() {
          //Stuff to do *after* the animation takes place
        })
        console.log(this);
        var recipient = $(this).data('recipient')
        console.log(recipient + 'opened');
        $(this).addClass('active')
        recipient = encode(recipient);
        useremail = encode(user.email);
        var currentchat = firebase.database().ref('/chats/' + useremail + '/' + recipient + '/');
        currentchat.on('child_added', function(data) {
          console.log('newmessage');
          message = data.val().message;
          sender = data.val().sender;
          if (sender == useremail) {
            $('<p class="message flow-text me blue-text">' + message + '</p>').appendTo('#messages').hide().fadeIn(400);
          } else {
            $('<p class="message flow-text you green-text">' + message + '</p>').appendTo('#messages').hide().fadeIn(400);
          }
          var element = document.getElementById('messages');
          element.scrollTop = element.scrollHeight - element.clientHeight;
        });

      })
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
    $("#newchatemail").val('');
    recipient = encode(recipient);
    useremail = encode(user.email);
    console.log(recipient);
    console.log(useremail);
    updatechat(true, recipient, useremail)

  } else {
    Materialize.toast('Please Login', 4000)
  }
})
$('#newmessageform').submit(function(e) {
  e.preventDefault();
  recipient = $('.active').data('recipient');
  var user = firebase.auth().currentUser;
  recipient = encode(recipient);
  useremail = encode(user.email);
  message = $('#newmessage').val()
  $('#newmessage').val('')
  var newPostRef = firebase.database().ref('/chats/' + recipient + '/' + useremail).push();
  newPostRef.set({
    'message': message,
    'sender': useremail
  });
  var newPostRef = firebase.database().ref('/chats/' + useremail + '/' + recipient).push();
  newPostRef.set({
    'message': message,
    'sender': useremail
  });
})

function encode(a) {
  return encodeURI(a).replace(/\@/g, '*a').replace(/\./g, '*d');
}

function decode(a) {
  return decodeURI(a).replace(/\*a/g, '@').replace(/\*d/g, '.');
}

function updatechat(a, recipient, useremail) {
  var updates = {};
  updates['/chats/' + recipient + '/' + useremail + '/-KlJTbl0OivPHNk9OQFoKlJTbl0OivPHNk9OQFo/message'] = 'new chat with ' + decode(useremail);
  updates['/chats/' + useremail + '/' + recipient + '/-KlJTbl0OivPHNk9OQFo/message'] = 'new chat with ' + decode(recipient);
  return firebase.database().ref().update(updates);
}
