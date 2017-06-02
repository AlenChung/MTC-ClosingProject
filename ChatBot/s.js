//ASDFGHJWERTYUIDFGHJ
var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
var urlencode = require('urlencode');
var httprequest = require('request').defaults({ encoding: null });
var Entities = require('html-entities').XmlEntities;
var htmlparser = require("htmlparser2");
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var request = require("superagent");
var Face = require('oxford-face-api');
var MovieDB = require('moviedb')('9093cb6efaffcba8a0ae900bb885c014');//Movies API https://www.themoviedb.org/documentation/api
var FACEKEY = "8f7a031e5133417aa8b1f1ab525efec1";
var max_age = 999;
var max_smile_value = 0;
var man_count = 0;
var woman_count = 0;
var azure = require('azure-storage');
const needle = require("needle"),
  url = require('url');
var blobSvc = azure.createBlobService('13thclosingproject', 'Ol2bfKtBH5nkw1kxQw6X3IYBe0ziHQvaP4i82ZDUoQDtq4pexMOperzsn4DYv1DwBA6oSttAuGrjq4svcOIjDg==');
var person_index = -1;
var personid;
var person_confidence = 1;
var young_person_index;
var smile_person_index = -1;
var filename, smile_filename, dir_filename, smdir_filename, found_filename;
var FACEKEY = "8f7a031e5133417aa8b1f1ab525efec1";
var EMOKEY = "595015ecc51247bfbbb308224459b183";
var CROP = true;
var KC_ID = "7c1e96f9-c73c-4eea-951b-61aab07c1b16";
var JERRY_ID = "16ef3542-84b4-448e-9250-9f57773f183b";
var PERSONGROUP_ID = "mtcbotdemo";
var MAXNumOf_CA_Returned = 1 ;
var CONFID_THRESHOLD = 0.623 ;
var FinalName = "";
var found = false;
var tmpface="";
var tmp_attach;
var tmpsad;
var tmpage;
var random_num;
var joke;
var express = require('express');
var router = express.Router();
var CLIENT_ID = "331adb39-ee9a-429f-aae1-75f2474c871c";
var CLIENT_SECRECT = "9KbNi1dCe2t6dQDE0kFffym";
var httprequest = require('request').defaults({
  encoding: null
});
//IoT Hub
var iothub = require('azure-iothub');
var connectionString = 'HostName=iotmtc13th.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=bYyfU78hLUBbrWxXw0NZO+EfrG2VOViEEvrndDB9sws=';
var registry = iothub.Registry.fromConnectionString(connectionString);
//IoT Hub
//var OAuth = require('oauth-sign');
var uuid = require('node-uuid');
//var authHelper = require('../authHelper.js');
entities = new Entities();
//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

 
var useEmulator = (process.env.NODE_ENV == 'development');
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID ,//||"39e398aa-5e7a-43c7-9079-fcb4f07a6dbc",
    appPassword: process.env.MICROSOFT_APP_PASSWORD //||"tZtei6Px5cY90yxTkP9HdQ6"
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());
//====================================================================
// Create a new device  IoTHub

//=========================================================
// Bots Dialogs
//=========================================================

// Create LUIS recognizer 
var model = process.env.LUIS_MODEL_URL || "https://api.projectoxford.ai/luis/v1/application?id=a0032871-6f04-4d29-a669-286fd45a22a8&subscription-key=35820529a1be4e389462b5b4fd14ef90";
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);
dialog.onDefault(builder.DialogAction.send("很抱歉我不確定您想做什麼？試試用「請問」開頭，\n來查詢想要的行政單位資訊或是職缺唷!，也能問我最近是否有好看的電影!"));
//上傳照片
dialog.matches('你好', [
  function(session, args, next) {
    console.log("Function Hello");
    //builder.Prompts.attachment(session, '您好~我是MTC史黛拉,請問今天想做怎樣服務呢!');
    session.send( '您好~我是MTC史黛拉,請問今天想做怎樣服務呢!');
  }

]);
function getClientIp(req) {
  var ipAddress;
  // The request may be forwarded from local web server.
  var forwardedIpsStr = req.header('x-forwarded-for'); 
  if (forwardedIpsStr) {
    // 'x-forwarded-for' header may return multiple IP addresses in
    // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
    // the first one
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    // If request was not forwarded
    ipAddress = req.connection.remoteAddress;
  }
  return ipAddress;
};
//
function upLoadImage(att_url, session) {
  found = false;
  man_count = 0;
  woman_count = 0;
  httprequest.get(att_url, function(error, response, body) {
    if(!error && response.statusCode == 200) {
      var attachment_img = new Buffer(body, 'binary');
      tmp_attach=attachment_img;
      FaceAnalyze(att_url,attachment_img,session);
      return;
    }else {
      console.log(response.statusCode);
      console.log(error);
      console.log(body);
    }

  });

}

//
testGraph = async(function (session) {
    console.log("#########################################");
    var test_response=Test();
    //session.send(test_response)
    console.log("#########################################111111"+JSON.stringify(test_response.req));
    var myJson = JSON.parse(test_response);
    console.log(myJson);
});
//
registerperson = async(function(session,name){
      var Create_response = sendCreatePerson(PERSONGROUP_ID,name);
      var cperson_Json = JSON.parse(JSON.stringify(Create_response.body));
      console.log("hahahah"+cperson_Json.personId);
      var face_respone=sendperson_face(tmp_attach,cperson_Json.personId);
      var train_respone=sendtrain(PERSONGROUP_ID);
});
FaceAnalyze = async(function(att_url,request_body,session){
    session.send("開始分析...");
    var detect_response=sendDetectedFace(request_body,true,true,true,true,true);
    session.send("再給我一下下...");
    if(detect_response.statusCode != 200){
     console.log("detect error");
      return;
    }
    var myJson = JSON.parse(JSON.stringify(detect_response.body));
    if(myJson.length>1 || myJson.length==0){
        session.send("嗨～親愛的使用者你好，請使用只有一張人臉的相片做為登入喔");
        return;
    }
    tmpface=myJson[0].faceId;
    tmpage=myJson[0].faceAttributes.age;
    for (i = 0; i < myJson.length; i++) {
      if (myJson[i].faceAttributes.age < max_age) {
        young_person_index = i;
        max_age = myJson[i].faceAttributes.age;
      }
      if (myJson[i].faceAttributes.gender == 'male') {
        man_count = man_count + 1;
      } else if (myJson[i].faceAttributes.gender == 'female') {
        woman_count = woman_count + 1;
      }
      if (myJson[i].faceAttributes.smile > max_smile_value) {
        max_smile_value = myJson[i].faceAttributes.smile;
        smile_person_index = i;

      }

    }
    var emo_response=sendEmotion(request_body);
    var myEmo = JSON.parse(JSON.stringify(emo_response.body));
    tmpsad=myEmo[0].scores.sadness;

   // cropSmileFace(att_url, myJson, smile_person_index);
    session.send("小娜已註冊您的人臉!!");

    var total_iter = Math.ceil(myJson.length / 10);
    var residue = myJson.length % 10;
    var count = 0;
    for (count = 0; count < total_iter; count++) {
      var facelist = [];
      for (j = 0; j < Math.min(count == total_iter - 1 ? residue : myJson.length, 10); j++) {
        facelist.push(myJson[j + count * 10].faceId);
      }  
      var identify_response = sendIdentifyFace(PERSONGROUP_ID,facelist,MAXNumOf_CA_Returned,CONFID_THRESHOLD);
      var identify_Json = JSON.parse(JSON.stringify(identify_response.body));
      var i_index;  

      for (i_index = 0; i_index < identify_Json.length; i_index++) {

        if (identify_Json[i_index].candidates.length != 0) {
          
          person_index = i_index + count * 10;
          personid = identify_Json[i_index].candidates[0].personId;
          console.log("identify found!!!!   "+personid);
          person_confidence = identify_Json[i_index].candidates[0].confidence;
          found=true;
          var getperson_res=sendget_person(personid);
          var myperson = JSON.parse(JSON.stringify(getperson_res.body));
          console.log("wowowowoow                "+myperson.name);
          session.userData.name=myperson.name;
        }
      }
    }

    if(person_index == -1) {
     console.log("Allen");//不要GM
    }else {
      console.log("cat");//不要GM
    }
    session.send("分析完畢 :)");
    setTimeout(function() {
      replyGuestNum(session,man_count,woman_count);//your code to be executed after 2.5 second
    }, 2500);

});
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
function replyGuestNum(session,man_count,woman_count){
  if(found==true){
        session.send("嗨 %s 歡迎回來，今天想要做怎樣的服務呢？",session.userData.name);
  }else{
      var reply_str = '註冊照片為';
      if (man_count != 0) {
        reply_str = reply_str + man_count + '位帥哥';
      }
      if (woman_count != 0) {
        if (man_count != 0) {
          reply_str = reply_str + '和' + woman_count + '位美女';
        } else {
          reply_str = reply_str + woman_count + '位美女';
        }
      }
      reply_str = reply_str + '，小娜很開心認識你 :-)';
      session.send(reply_str);
      builder.Prompts.text(session, "請輸入自己的名字讓小娜更加熟悉你喔！！");
  }
  

  //session.beginDialog('/name');
}

//
router.get('/microsoft/callback', function(req, res){
    console.log("omogmogmgomgomgomgogmgvo");
    var code = req.query.code;
    
});
function Test(){
  /* var response 
    = await(
      request
      .get("https://login.microsoftonline.com/common/oauth2/v2.0/authorize?")
      .set('client_id',CLIENT_ID)
      .set('redirect_uri','https://www.google.com.tw/')
      .set('response_type','code')    
      .set('state','1234')
      .set('scope','mail.read')
      .send()         
    );*/
    httprequest.get({url: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize", 
        qs: {client_id: CLIENT_ID,redirect_url:'https://login.microsoftonline.com/common/oauth2/nativeclient' ,response_type:"code",response_mode:'query',state:'1234',nonce:uuid.v4(),scope:'mail.read'}}, 
        function(err, res, body) {
    if(err) {
        return console.error(err);
    }
    var code=res.query['authorization_code'];
    console.log(code+"hhghghghg");
    var setcookie = res.headers["set-cookie"];
    if ( setcookie ) {
      setcookie.forEach(
        function ( cookiestr ) {
          console.log( "#######COOKIE:" + cookiestr);
        }
      );
    }
    console.log("hi here is the shit reponse !!! "+res.query.code);
   // console.log("hi here is the shit reponse !!! "+body.query.code);
   // return res;
    });
   // return response;
    //console.log("hi here is the shit reponse !!! "+response);

    
   
}
function sendEmotion(request_body){
    
    var response = await(
    request
      .post("https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize")
      .set('Content-Type', 'application/octet-stream')
      .set('Ocp-Apim-Subscription-Key', EMOKEY)
      .send(request_body)
    );

    return response;
}
function sendget_person(personid){
  
    var response = await(
    request
      .get("https://api.projectoxford.ai/face/v1.0/persongroups/"+PERSONGROUP_ID+"/persons/"+personid)
      .set('Content-Type', 'application/json')
      .set('Ocp-Apim-Subscription-Key', FACEKEY)
      .send()
    );

    return response;
}
function sendperson_face(request_body,personid){
    
    var response = await(
    request
      .post("https://api.projectoxford.ai/face/v1.0/persongroups/"+PERSONGROUP_ID+"/persons/"+personid)
      .set('Content-Type', 'application/octet-stream')
      .set('Ocp-Apim-Subscription-Key', FACEKEY)
      .send(request_body)
    );

    return response;
}
function sendDetectedFace(request_body,FaceId,FaceLandmarks,AGE,GENDER,SMILE){
    var faceAttributes="";
    if(AGE){
      faceAttributes=faceAttributes+",age";
    }
    if(GENDER){
      faceAttributes=faceAttributes+",gender";
    }
    if(SMILE){
      faceAttributes=faceAttributes+",smile";
    }
    faceAttributes=faceAttributes.substring(1,faceAttributes.length);
    var response = await(
    request
      .post("https://api.projectoxford.ai/face/v1.0" + "/detect?")
      .query({
        returnFaceId: FaceId
      })
      .query({
         returnFaceLandmarks: FaceLandmarks
      })
      .query({
        returnFaceAttributes: faceAttributes
      })
      .set('Content-Type', 'application/octet-stream')
      .set('Ocp-Apim-Subscription-Key', FACEKEY)
      .send(request_body)
    );

    return response;
}
//
function sendtrain(personGroupId){
  
    var response 
      = await( 
              request
                .post("https://api.projectoxford.ai/face/v1.0" + "/persongroups/"+personGroupId+"/train")
                .set('Content-Type', 'application/json')
                .set('Ocp-Apim-Subscription-Key', FACEKEY)
                .send()          
              );
    return response;    
}
function sendCreatePerson(personGroupId,name){
    var identify_reqbody = {
      "name": name
    };
    var response 
      = await( 
              request
                .post("https://api.projectoxford.ai/face/v1.0" + "/persongroups/"+personGroupId+"/persons")
                .set('Content-Type', 'application/json')
                .set('Ocp-Apim-Subscription-Key', FACEKEY)
                .send(identify_reqbody)          
              );
    return response;    
}
function sendIdentifyFace(personGroupId,faceIds,maxNumOfCandidatesReturned,confidenceThreshold){
    var identify_reqbody = {
      "personGroupId": personGroupId,
      "faceIds": faceIds,
      "maxNumOfCandidatesReturned": maxNumOfCandidatesReturned,
      "confidenceThreshold": confidenceThreshold
    };
    var response 
      = await( 
              request
                .post("https://api.projectoxford.ai/face/v1.0" + "/identify")
                .set('Content-Type', 'application/json')
                .set('Ocp-Apim-Subscription-Key', FACEKEY)
                .send(identify_reqbody)          
              );
    return response;    
}
//開始LUIS
dialog.matches('查詢', [
    function (session, args, next) {
        // Resolve entities passed from LUIS.
            console.log("asdasdasdasdasd");
            var Room_entity = builder.EntityRecognizer.findEntity(args.entities, '處室');
            var Inf_entity = builder.EntityRecognizer.findEntity(args.entities, '資訊');
            var Job_entity = builder.EntityRecognizer.findEntity(args.entities, '工作');
           // console.log(Room_entity.entity);
           // console.log(Inf_entity.entity);
            //console.log(Job_entity.entity);       
            if(Job_entity != null){
                var url="";
                if(Room_entity != null){
                    var Eng="\"postUnit\"";
                    var Unit="\""+urlencode(Room_entity.entity)+"\"";
                    url="http://data.tycg.gov.tw/api/v1/rest/datastore/c900ce98-0089-47cc-b044-ce87235078b4?"+"filters={"+Eng+":"+Unit+"}";
                }else{
                    url="http://data.tycg.gov.tw/api/v1/rest/datastore/c900ce98-0089-47cc-b044-ce87235078b4?"+"limit=3";
                }
                 console.log(url);
                httprequest(url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body)
                     if(info.result.records.length==0){
                        var reply_str = '不好意思目前沒有'+Room_entity.entity+'的相關'+Job_entity.entity+'，謝謝您';
                        session.send(reply_str);  
                    }
                    else
                    {
                        console.log(info.result.records[0].postUnit);
                        var s=entities.decode(info.result.records[0].jobContent);
                        var card_text="";
                        var parser = new htmlparser.Parser({
                            onopentag: function(name, attribs){
                                if(name === "script" && attribs.type === "text/javascript"){
                                    console.log("JS! Hooray!");
                                }
                            },
                            ontext: function(text){
                                card_text=card_text+text;
                                console.log("-->", text);
                            },
                            onclosetag: function(tagname){
                                if(tagname === "script"){
                                    console.log("That's it?!");
                                }
                            }
                        }, {decodeEntities: true});
                        parser.write(s);
                        parser.end();
                       // s=s.replace(/<br\s*[\/]?>/gi,"\r");
                        var msg = new builder.Message(session)
                            .textFormat(builder.TextFormat.xml)
                            .attachments([
                                new builder.HeroCard(session)
                                    .title(info.result.records[0].needGovOrg)
                                    .subtitle(info.result.records[0].pdiffer+"-"+info.result.records[0].subject+"-"+info.result.records[0].postDate)
                                    .text("http://www.tycg.gov.tw/ch/home.jsp?id=11&parentpath=0,1&mcustomize=job_view.jsp&dataserno="+info.result.records[0].id)
                            ]);
                        session.endDialog(msg); 
                    }
                }else{
                    
                    console.log(response.statusCode);
                }
                });
            }
            if(Inf_entity != null ){
                var url="";
                if(Room_entity != null){
                    var Eng="\"postUnit\"";
                    var Unit="\""+urlencode(Room_entity.entity)+"\"";
                    url="http://data.tycg.gov.tw/api/v1/rest/datastore/73644460-c76f-4afa-aa30-064bfef291d8?"+"filters={"+Eng+":"+Unit+"}";
                }else{
                    url="http://data.tycg.gov.tw/api/v1/rest/datastore/73644460-c76f-4afa-aa30-064bfef291d8?"+"limit=3";
                }
                console.log(url);
                 
                httprequest(url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body)
                    if(info.result.records.length==0){
                        var reply_str = '不好意思目前沒有'+Room_entity.entity+'的相關'+Inf_entity.entity+'，謝謝您';
                        session.send(reply_str);  
                    }
                    else
                    {
                        console.log(info.result.records[0].postUnit);
                        var s=entities.decode(info.result.records[0].detailContent);
                        var card_text="";
                        var parser = new htmlparser.Parser({
                            onopentag: function(name, attribs){
                                if(name === "script" && attribs.type === "text/javascript"){
                                    console.log("JS! Hooray!");
                                }
                            },
                            ontext: function(text){
                                card_text=card_text+text;
                                console.log("-->", text);
                            },
                            onclosetag: function(tagname){
                                if(tagname === "script"){
                                    console.log("That's it?!");
                                }
                            }
                        }, {decodeEntities: true});
                        parser.write(s);
                        parser.end();
                       // s=s.replace(/<br\s*[\/]?>/gi,"\r");
                       if(info.result.records[0].img != null){
                            var msg = new builder.Message(session)
                                .textFormat(builder.TextFormat.xml)
                                .attachments([
                                    new builder.HeroCard(session)
                                        .title(info.result.records[0].subject)
                                        .subtitle("http://www.tycg.gov.tw/ch/home.jsp?id=7&parentpath=0,1&mcustomize=multimessage_view.jsp&dataserno="+info.result.records[0].id)
                                        .text(card_text)
                                        .images([
                                            builder.CardImage.create(session,info.result.records[0].img[0].imgurl)
                                        ])
                                        .tap(builder.CardAction.openUrl(session, "http://www.tycg.gov.tw/ch/home.jsp?id=7&parentpath=0,1&mcustomize=multimessage_view.jsp&dataserno="+info.result.records[0].id))
                                ]);
                            session.endDialog(msg); 
                       }
                       else{
                             var msg = new builder.Message(session)
                                .textFormat(builder.TextFormat.xml)
                                .attachments([
                                    new builder.HeroCard(session)
                                        .title(info.result.records[0].subject)
                                        .subtitle("http://www.tycg.gov.tw/ch/home.jsp?id=7&parentpath=0,1&mcustomize=multimessage_view.jsp&dataserno="+info.result.records[0].id)
                                        .text(card_text)
                                        .tap(builder.CardAction.openUrl(session, "http://www.tycg.gov.tw/ch/home.jsp?id=7&parentpath=0,1&mcustomize=multimessage_view.jsp&dataserno="+info.result.records[0].id))
                                        
                                ]);
                            session.endDialog(msg); 
                       }
                    }
                   
                }else{
                    console.log(response.statusCode);
                }
                });
            }
            if(Job_entity==null&& Inf_entity==null){
                var reply_str = "很抱歉我不確定您想做什麼？試試用「請問」開頭，\n來查詢想要的行政單位資訊或是職缺唷!"
                session.send(reply_str);  
            }
                          
    },
    function(session,results){

    }     
]);
//開始看電影
dialog.matches('看電影', [
    function (session, args, next) {
         MovieDB.miscPopularMovies({}, function(err, res){
          //console.log(res);
          var movie_info = JSON.parse(JSON.stringify(res));
          console.log("long "+movie_info.results.length);
          var i;
          var count=randomIntFromInterval(1,3);
          var name =session.userData.name;
          session.send("沒問題！！%s %d歲 \n 小娜為您推薦這些專屬熱門電影 :)",session.userData.name,tmpage);
          for(i=0;i<count;i++){
          var movie_title=movie_info.results[i].title;
          var movie_image="https://image.tmdb.org/t/p/w370_and_h556_bestv2"+movie_info.results[i].poster_path;
          var msg = new builder.Message(session)
                                .textFormat(builder.TextFormat.xml)
                                .attachments([
                                    new builder.HeroCard(session)
                                        .title(movie_title)
                                        .subtitle(movie_title)
                                        .text(movie_info.results[i].overview)
                                        .images([
                                            builder.CardImage.create(session,movie_image)
                                        ])
                                        .tap(builder.CardAction.openUrl(session, "https://www.themoviedb.org/movie/"+movie_info.results[i].id))
                                ]);
           session.send(msg); 
          }
          session.endDialog();
         // session.send(res);
        });
    },
    function(session,results){

    

    }
    
]);
//笑話
dialog.matches('講笑話', [
     function (session, args, next) {
         random_num = Math.floor((Math.random() * 10) + 1); 

         if(random_num <= 4){
             joke = "\"I wasn't that drunk yesterday.\" \"Oh boy you took the shower head in your arms and told it to stop crying.\"";
         };
         if(random_num > 4 && random_num <= 7){
             joke = "I just got a photo from a speeding camera through the mail. I sent it right back – way too expensive and really bad quality";
         };
         if(random_num > 7){
             joke = "Two elephants meet a totally naked guy. After a while one elephant says to the other: \"I really don’t get how he can feed himself with that thing!\"";
         };
         
         session.send(joke);
     },
     function(session,results){
      
     }
]);
//找東西
dialog.matches('找東西', [
     function (session, args, next) {
     
          var people_entity = builder.EntityRecognizer.findEntity(args.entities, '人');
          var cellphone_entity = builder.EntityRecognizer.findEntity(args.entities, '手機');
          var cup_entity = builder.EntityRecognizer.findEntity(args.entities, '瓶子');
          var tv_entity = builder.EntityRecognizer.findEntity(args.entities, '電視機');
          var chair_entity = builder.EntityRecognizer.findEntity(args.entities, '椅子');
          var plant_entity = builder.EntityRecognizer.findEntity(args.entities, '盆栽');
          
          var blob_name= "davidclosing-";
          console.log(blob_name);

          if(people_entity!=null){
             console.log(people_entity.entity); 
             session.send(people_entity.entity);
             blob_name=blob_name+"person";
          }
          else if(tv_entity!=null){
             console.log(tv_entity.entity);
             session.send(tv_entity.entity);
             blob_name=blob_name+"tvmonitor";
          }
          else  if(chair_entity!=null){
             console.log(chair_entity.entity);
             session.send(chair_entity.entity);
             blob_name=blob_name+"chair";
          }
          else if(plant_entity!=null){
            console.log(plant_entity.entity);
            session.send(plant_entity.entity);
            blob_name=blob_name+"pottedplant";
          }
          
          console.log(blob_name);

          blobSvc.listBlobsSegmented(blob_name, null, function(error, result, response){
          if(!error){
              
              console.log("downloads");
              console.log(result.entries.length);
              var lastfile_name;
             
              lastfile_name="https://13thclosingproject.blob.core.windows.net/"+blob_name+"/"+result.entries[0].name;
              //url="https://13thclosingproject.blob.core.windows.net/davidclosing/"+result.entries[0].name;
              
              

              var msg = new builder.Message(session)
                                .attachments([
                                    new builder.HeroCard(session)  
                                        .subtitle("LIVE MTC") 
                                        .images([
                                            builder.CardImage.create(session,lastfile_name)
                                        ])  
                                        .tap(builder.CardAction.openUrl(session, lastfile_name))         
                                ]);
               session.endDialog(msg); 
             
            
              //  session.send(lastfile_name);
                //session.endDialog(msg);
             // session.send(msg);
                              // result.entries contains the entries
              // If not all blobs were returned, result.continuationToken has the continuation token.
          }
        });
       
     }
]);

