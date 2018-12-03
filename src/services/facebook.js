import * as api from './api_access'
let delayed = null;

window.fbAsyncInit = function() {
    FB.init({
      appId      : '296547064527762',
      cookie     : true,
      xfbml      : true,
      version    : 'v3.0'
    });
      
    FB.AppEvents.logPageView();   
    
    if(delayed){
        delayed();
     }
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

   export function FBLogin(){
       const p = new Promise((resolve, reject)=>{
            FB.login(
                response => statusChangeCallback(response, resolve, reject),
                {scope: 'public_profile,email,user_photos'}
            )
        });
        return p;
   }

   export function getLoginStatus(){
        return new Promise((resolve, reject)=>{
            delayed = ()=> FB.getLoginStatus(function(response) { 
                    statusChangeCallback(response, resolve, reject);
            });
            if(typeof FB != 'undefined'){
                delayed();
                delayed = null;
            }
        })
   }

   export function GetPhotos(callback){
       FB.api("/me/photos?fields=name,picture,images", photos => {
           console.log(photos);
           callback(photos);
       })
   }

   function statusChangeCallback(response, resolve, reject){
        console.log(response);
        if(!response.authResponse){

            reject("The user did not login")

        }else{

            FB.api("/me?fields=name,email,birthday,picture", me => {
                console.log(me);
                api.Login(me.name, response.authResponse.userID, response.authResponse.accessToken)
                .then(x=> {
                     resolve(x)
                });
            })

        }

   }