const functions = require('firebase-functions');
var admin = require("firebase-admin");
var url = require('url');
const { stringify } = require('querystring');
//const { request } = require('http');
const cors = require('cors')({origin: true});
const request = require('request');
const { user } = require('firebase-functions/lib/providers/auth');
const { securityRules } = require('firebase-admin');
const { FORMERR } = require('dns');
admin.initializeApp();


exports.Notification = functions.https.onCall((data, context) => {
    
  const id = data.user_id;
  const pw = data.user_pw;
  const yourToken = data.yourToken;
  const myToken = data.myToken;

  const payload = {
    notification:{
       title : "notify",
       body : "suceess to send.",
       click_action : ".activity.GetActivity"
    },
    data:{
       user_id : id,
       user_pw : pw,
       myToken : myToken,
       yourToken : yourToken,
       }
    };
  
  return admin.messaging().sendToDevice(yourToken,payload);
  });

exports.sendNotification = functions.https.onRequest((request,response)=>{

  const id = request.body.user_id;
  const pw = request.body.user_pw;
  const yourToken = request.body.yourToken;
  const myToken = request.body.myToken;

  var message = {
  
    notification:{
      title : "notify",
      body : "suceess to send.",
      click_action : ".activity.GetActivity"
    },
    data:{
      user_id : id,
      user_pw : pw,
      myToken : myToken,
      yourToken : yourToken,
    }
  };
  
  response.send(admin.messaging().sendToDevice(yourToken, message));
});
