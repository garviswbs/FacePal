$(document).ready(function() {
  $(".datepicker").pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 100,
    max: moment().format("YYYY"),
    today: "Today",
    clear: "Clear",
    close: "Ok",
    closeOnSelect: false // Close upon selecting a date,
  });
  $("select").material_select();

  var config = {
    // Kairos Keys
    app_id: "299078c0",
    app_key: "0004235442d8fe37c6a315b2de0a40e8",
    // Firebase Keys
    apiKey: "AIzaSyDUnxL1x14WGo0ZFV2okfnh6ekHWVsL6Hs",
    authDomain: "facepal-a9ecc.firebaseapp.com",
    databaseURL: "https://facepal-a9ecc.firebaseio.com",
    projectId: "facepal-a9ecc",
    storageBucket: "facepal-a9ecc.appspot.com",
    messagingSenderId: "603932838503"
  };
  //console.log("25 app.js testing for verifyimage: " + verifyImage);
  let firstName = "";
  let lastName = "";
  //let verifyImage = "";
  let email = "";
  let dob = "";
  const today = moment().format("DD MMMM, YYYY");
  let age = "";
  let img = "";
  let paymentTokens = [];

  firebase.initializeApp(config);
  let ref = firebase.database().ref();

  function validate() {
    return $("#signup").validate({
      rules: {
        firstname: "required",
        lastname: "required",
        email: {
          required: true,
          email: true
        },
        password: {
          required: true,
          minlength: 5
        },
        dob: "required",
        img: "required"
      },
      messages: {
        firstname: "Please enter your firstname",
        lastname: "Please enter your lastname",
        email: "email is required",
        dob: "Date of birth is required",
        password: "Password is required",
        img: "An image is required for facial recognition"
      },
      errorElement: "div",
      errorPlacement: function(error, element) {
        var placement = $(element).data("error");
        if (placement) {
          $(placement).append(error);
        } else {
          error.insertAfter(element);
        }
      }
    });
  }
  // Initialize Materialize elements
  $("#submit").on("click", function(event) {
    event.preventDefault();
    //move to verify page
    if (validate().form()) {
      firstName = $("#first-name")
        .val()
        .trim();
      lastName = $("#last-name")
        .val()
        .trim();
      email = $("#email")
        .val()
        .trim();
      password = $("#password")
        .val()
        .trim();
      dob = $("#dob")
        .val()
        .trim();
      img = $("#img")
        .val()
        .trim();
      ref.push({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        dob: dob,
        img: img
      });

      $("input").val("");

      //test
      console.log("firebase log" + img);
      console.log("firebase log" + firstName);
      console.log("firebase log" + lastName);

      window.location.assign("./2_Your_Info.html");
    }
  });

  //Page 2 Enroll Button
  $("#enrollButton").on("click", function() {
    enrollUser(firstName, lastName, img);
    //test
    console.log("submit log" + img);
    console.log("submit log" + firstName);
    console.log("submit log" + lastName);
  });



  ref.on(
    "child_added",
    function(snapshot) {
      firstName = snapshot.val().firstName;
      lastName = snapshot.val().lastName;
      email = snapshot.val().email;
      dob = snapshot.val().dob;
      age = moment(today).diff(moment(dob), "years");
      img = snapshot.val().img;

      // Log everything that's coming out of snapshot
      console.log(`Name: ${firstName} ${lastName}`);
      console.log(`Email: ${email}`);
      console.log(`Born: ${dob} (${age} years old)`);
      console.log(`Img: ${img}`);

      let print = `
      <ul class="collection">
        <li class="collection-item">
          <div class="center-align">
              <ul id="files"></ul>
              <img src="./user_images/${img}" class="img-fluid" id="user-img">
          </div>
        </li>
        <li class="collection-item">Name:
          ${firstName} ${lastName}
        </li>
        <li class="collection-item">Email:
          ${email}
        </li>
      </ul>
      <tr>`;
      $("#new-user").html(print);
    },
    function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    }
  );

  $("#verifyButton").on("click", function() {
    var testFirst = firstName;
    var testLast = lastName;
    var verifyString = verifyImage;


    //TestPrinting
    console.log("App.js Verify Button test: Input Parms to verifyUser " + testFirst + testLast + " " + verifyString);
    //Call api and pass in verifyIMage
    verifyUser(testFirst, testLast, verifyString);
  });

  $("#compareButton").on("click", function() {
    console.log(confNums);
    if(confNums>0.60){
    
      $('.modal').modal();
      $('#modal1').modal('open')
      $("#modal-header").text("Success!");
      $("#modal-message").text("Your payment has been sent.");
        console.log("Success!");
    }else{
      $("#modal-header").text("Uh oh!");
      $("#modal-message").text("You aren't the authorized user for this transaction.");
      $('.modal').modal();
      $('#modal1').modal('open');
      console.log("Fail");
    };
    
  });

    // if confidence is greater than .6, show modal
    
     // else show failure message in modal

  

  

});
