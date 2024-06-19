   (function() {
       'use strict';
       window.addEventListener('load', function() {
           var forms = document.getElementsByClassName('needs-validation');
           var validation = Array.prototype.filter.call(forms, function(form) {
               form.addEventListener('submit', function(event) {
                   if (form.checkValidity() === false) {
                       event.preventDefault();
                       event.stopPropagation();
                   }
                   form.classList.add('was-validated');
               }, false);
           });
       }, false);
   })();

   function onSignIn(googleUser) {
       var profile = googleUser.getBasicProfile();
       var id_token = googleUser.getAuthResponse().id_token;
       $.ajax({
           url: "users/login_with_google",
           method: "POST",
           dataType: "JSON",
           data: {
               id: profile.getId(),
               email: profile.getEmail(),
               image: profile.getImageUrl(),
               full_name: profile.getName()
           },
           success: function(response) {
               if (response.login == 1 && response.update_mobile == 1) {
                   $("#user_id").val(response.user_id);
                   $("#myModal").modal('show');
               } else if (response.login == 1 && response.update_mobile == 0) {
                   window.location.href = "users";
               } else {
                   alert("Something Went Wrong!");
               }
           }
       });
   }

   function signOut() {
       var auth2 = gapi.auth2.getAuthInstance();
       auth2.signOut().then(function() {
           console.log('User signed out.');
       });
   }



   function onLoad() {
       gapi.load('auth2', function() {
           gapi.auth2.init();
       });
   }

   $("#btn_update_mobile").click(function() {
       var user_id = $("#user_id").val();
       var mobile = $("#txt_mobile").val();
       var leng = $("#txt_mobile").val().length;
       var filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
       if (mobile == "") {
           $("#errrr").text("PLease enter mobile no!");
           return false;
       }
       if (leng == 10) {
           if (filter.test(mobile)) {
               $.ajax({
                   url: "users/update_mobile",
                   method: "POST",
                   dataType: "JSON",
                   data: {
                       user_id: user_id,
                       mobile: mobile
                   },
                   success: function(response) {

                       if (response.status == 2) {
                           $("#errrr").text(response.msg);
                           return false;
                       } else if (response.status == 1) {
                           window.location.href = "users";
                       } else {
                           return false;
                       }
                   }
               });
           }
       }
       return false;
   });