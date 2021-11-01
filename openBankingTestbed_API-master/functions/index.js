const functions = require('firebase-functions');
var admin = require("firebase-admin");
const request = require('request');
admin.initializeApp();
/*
email : william@ido.so
이용기관코드 : 	T991667950

출금이체계좌목록
  - 이용기관일련번호 : 2020166795
  - 계좌/계정번호 : 4218413406
  - 예금주 : IDO
입금이체계좌목록
  - 이용기관일련번호 : 2020166795
  - 계좌/계정번호 : 4531442347
  - 예금주 : IDO
수수료계좌목록
  - 이용기관일련번호 : 2020166795
  - 계좌/계정번호 : 1750932807
  - 예금주 : IDO

API Key  : 8lg3dqDwMNCK6o1XSQlm9qVzEuDPBM0ExFRbAYqT
API Secret : pOc6q4lXQfhJPqv7Vwm6QkzbEtSfu2OZMAwpKxHu

var user_seq_no = "1100765290";

*/
var access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJUOTkxNjY3OTUwIiwic2NvcGUiOlsib29iIl0sImlzcyI6Imh0dHBzOi8vd3d3Lm9wZW5iYW5raW5nLm9yLmtyIiwiZXhwIjoxNjE0MDU0OTUwLCJqdGkiOiIxNzVhNDNkMi0xNDExLTQ1OGEtOTI3NS05YWJlOTFlMDM0NTYifQ.ypzMJqSHmw7XxXJvHq6qfJi5dXpsHhRkT3h0fFaN4XI";
/*                  
금융API 기능함수

#사용자 인증
  사용자토큰갱신 
#사용자/계좌 관리
  사용자정보조회 /  scope = login, sa 
  사용자 로그인 연결 동의 해제 API /  scope = login 
  등록계좌조회 /  scope = login, sa 
  계좌정보변경 API /  scope = login
  계좌정보변경 API(참가은행에 등록된 내역까지 변경) / scope = sa - 사용 X
  계좌정보조회 API / scope = sa - 사용 X
  계좌해지 API - 참가은행에러  / scope = login, sa
  사용자탈퇴 API  / scope = login, sa
#조회서비스(사용자)
  잔액조회 /  scope = inquiry, sa 
  거래내역조회 API /  scope = inquiry, sa 
#조회서비스(이용기관) 
  계좌실명조회 API  / scope = oob,sa 
  송금인정보조회 API / scope= oob,sa
  수취조회 API / scope= oob,sa
#이체서비스  
  출금이체 API - 계좌정보 , 핀테크이용번호 / scope = transfer, sa
  입금이체 API - 계좌정보 , 핀테크이용번호 / scope = oob, sa 
  이체결과조회 API - 확인기간초과 /scope = oob, sa 
  자금반환 청구 API - 확인기간초과 /  scope = oob, sa 
  자금반환 결과조회 API /  scope = oob, sa 
#관리 API  
  참가은행상태조회 API / scope = oob, sa   not found
  수수료조회 API /  scope = oob, sa 
  집계조회 API / scope = oob, sa
  출금이체한도조회 API / scope = oob, sa 
  이상금융거래 탐지내역 조회 API / scope = oob, sa 
*/

//사용자토큰갱신
exports.Token = functions.https.onRequest((req,res)=>{
  var client_id = "8lg3dqDwMNCK6o1XSQlm9qVzEuDPBM0ExFRbAYqT";
  var client_secret = "pOc6q4lXQfhJPqv7Vwm6QkzbEtSfu2OZMAwpKxHu";
  var refresh_token = "";
  var scope = "login inquiry transfer";
  var grant_type = "refresh_token";

  var option = {
    method : "POST",
    url : "https://testapi.openbanking.or.kr/oauth/2.0/token",
    headers : {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    qs : {
      client_id : client_id,
      client_secret : client_secret,
      refresh_token : refresh_token,
      scope : scope,
      grant_type : grant_type
    },
  }
  request.post(option, function (error, response, body) {
    //var requestResultJSON = JSON.parse(body);
    //console.log(error);
    res.send(body);
    });
})
//사용자정보조회
exports.UserInquiry = functions.https.onRequest((req,res)=>{
  var user_seq_no = "1100765290";

  var option = {
    method : "GET",
    url : "https://testapi.openbanking.or.kr/v2.0/user/me",
    headers : {
        'Authorization' : 'Bearer ' + access_token
    },
    qs : {// post방식 qs
        user_seq_no : user_seq_no
    }
  }
  request.get(option, function (error, response, body) {
    var requestResultJSON = JSON.parse(body);
    res.send(requestResultJSON)
    });
})
//사용자 로그인 연결 동의 해제 API
exports.UserUnlink = functions.https.onRequest((req,res)=>{
  var client_use_code ="T991667950";
  var user_seq_no = "1100765290";

  var option = {
    method : "POST",
    url : "https://testapi.openbanking.or.kr/v2.0/user/unlink",
    headers : {
      'Content-Type' : 'application/json; charset=UTF-8',
      'Authorization' : 'Bearer' + access_token
    },
    body :JSON.stringify({
      client_use_code : client_use_code,
      user_seq_no : user_seq_no
    })
  }
  request.post(option, function (error, response, body) {
    res.send(body);
    });
})
//등록계좌조회 
exports.AccountList = functions.https.onRequest((req,res)=>{
  var user_seq_no = "1100765290";
  var include_cancel_yn = "Y";
  var sort_order = "D";

  var option = {
    method : "GET",
    url : "https://testapi.openbanking.or.kr/v2.0/account/list",
    headers : {
        'Authorization' : 'Bearer ' + access_token
    },
    qs : {// post방식 qs
        user_seq_no : user_seq_no,
        include_cancel_yn : include_cancel_yn,
        sort_order : sort_order
    }
  }
  request.get(option, function (error, response, body) {
    //var requestResultJSON = JSON.parse(body);
    res.send(body)
    });
})
//계좌정보변경 API 
exports.AccountUpdateInfo = functions.https.onRequest((req,res)=>{
  var fintech_use_num = "199166795057887769188341";
  var account_alias = "계좌이름변경"; 

  var option = {
    method : "POST",
    url : "https://testapi.openbanking.or.kr/v2.0/account/update_info",
    headers : {
      'Content-Type' : 'application/json; charset=UTF-8',
      'Authorization' : 'Bearer' + access_token
    },
    body :JSON.stringify({
      fintech_use_num : fintech_use_num,
      account_alias : account_alias
    })
  }
  request.post(option, function (error, response, body) {
    res.send(body);
    });
})
//계좌정보변경 API - 참가은행에 등록된 내역까지 변경
//scope =sa
exports.AccountUpdate = functions.https.onRequest((req,res)=>{
  var trans_id ="T991667950";
  var RandomInt = Math.floor(Math.random()*(999999999 - 100000000)) + 100000000;
  var bank_tran_id = trans_id+"U"+RandomInt; //은행거래고유번호 
  var user_seq_no = "1100765290";
  var bank_code_std = "002"
  var account_num = "87654321000"
  var scope = "inquiry"
  var update_user_email = "testbed@kftc.or.kr";

  var option = {
    method : "POST",
    url : "https://testapi.openbanking.or.kr/v2.0/account/update",
    headers : {
      'Content-Type' : 'application/json; charset=UTF-8',
      'Authorization' : 'Bearer' + access_token
    },
    body :JSON.stringify({
      bank_tran_id : bank_tran_id,
      user_seq_no : user_seq_no,
      bank_code_std : bank_code_std,
      account_num : account_num,
      scope : scope,
      update_user_email : update_user_email
    })
  }
  request.post(option, function (error, response, body) {
    res.send(body);
    });
})
//계좌정보조회 API
//scope = sa
exports.AccountInfo = functions.https.onRequest((req,res)=>{
  var trans_id ="T991667950"; //이용기관코드
  var RandomInt = Math.floor(Math.random()*(999999999 - 100000000)) + 100000000;
  var bank_tran_id = trans_id+"U"+RandomInt; //은행거래고유번호 
  var user_seq_no = "1100765290";
  var bank_code_std = "002"
  var account_num = "87654321000"
  var scope = "inquiry"


  var option = {
    method : "POST",
    url : "https://testapi.openbanking.or.kr/v2.0/account/info",
    headers : {
      'Content-Type' : 'application/json; charset=UTF-8',
      'Authorization' : 'Bearer' + access_token
    },
    body :JSON.stringify({
      bank_tran_id : bank_tran_id,
      user_seq_no : user_seq_no,
      bank_code_std : bank_code_std,
      account_num : account_num,
      scope : scope
    })
  }
  request.post(option, function (error, response, body) {
    res.send(body);
    });
})
//계좌해지 API -- 참가은행에러 -- 
exports.AccountCancel = functions.https.onRequest((req,res)=>{
  var trans_id ="T991667950";
  var RandomInt = Math.floor(Math.random()*(999999999 - 100000000)) + 100000000;
  var bank_tran_id = trans_id+"U"+RandomInt; //은행거래고유번호
  var scope = "inquiry";
  var fintech_use_num = "199166795057887769188341";

  var option = {
    method : "POST",
    url : "https://testapi.openbanking.or.kr/v2.0/account/cancel",
    headers : {
      'Content-Type' : 'application/json; charset=UTF-8',
      'Authorization' : 'Bearer' + access_token
    },
    body :JSON.stringify({
        bank_tran_id : bank_tran_id,
        scope : scope ,
        fintech_use_num : fintech_use_num
    }),
  }
  request.post(option, function (error, response, body) {
    res.send(body);
    });
})
//사용자탈퇴 API  
exports.UserClose = functions.https.onRequest((req,res)=>{
  var client_use_code ="T991667950";
  var user_seq_no = "1100765290";
  
  var option = {
    method : "POST",
    url : "https://testapi.openbanking.or.kr/v2.0/user/close",
    headers : {
      'Content-Type' : 'application/json; charset=UTF-8',
      'Authorization' : 'Bearer' + access_token
    },
    body :JSON.stringify({
      client_use_code : client_use_code,
      user_seq_no : user_seq_no
    }),
  }
  request.post(option, function (error, response, body) {
    res.send(body);
    });
})
//잔액조회
exports.AccountBalance = functions.https.onRequest((req,res)=>{
  var fintech_use_num = "199166795057887769040540"; //핀테크이용번호

  var trans_id ="T991667950"; //이용기관코드
  var RandomInt = Math.floor(Math.random()*(999999999 - 100000000)) + 100000000;
  var bank_tran_id = trans_id+"U"+RandomInt; //은행거래고유번호

  var option = {  
    method : "GET",
    url : "https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num",
    headers : {
        'Authorization' : 'Bearer ' + access_token
    },
    qs : {
        bank_tran_id : bank_tran_id,
        fintech_use_num : fintech_use_num,
        tran_dtime : "20201113100000"
    }
  }
  request.get(option, function (error, response, body) {
    //var requestResultJSON = JSON.parse(body);
    res.send(body)
    });
})
//거래내역조회 API 
exports.TransactionlistFin = functions.https.onRequest((req,res)=>{   
  var fintech_use_num = "199166795057887769188341"; //핀테크이용번호
  var trans_id ="T991667950"; //이용기관코드
  var RandomInt = Math.floor(Math.random()*(999999999 - 100000000)) + 100000000;
  var bank_tran_id = trans_id+"U"+RandomInt; //은행거래고유번호

  var option = {  
    method : "GET",
    url : "https://testapi.openbanking.or.kr/v2.0/account/transaction_list/fin_num",
    headers : {
        'Authorization' : 'Bearer ' + access_token
    },
    qs : {
        bank_tran_id : bank_tran_id,
        fintech_use_num : fintech_use_num,
        inquiry_type : "A",
        inquiry_base : "D",
        from_date : "20190101",
        to_date : "20190102",
        sort_order : "D",
        tran_dtime : "20201116100000"
    }
  }
  request.get(option, function (error, response, body) {
    res.send(body)
    });
})
//계좌실명조회 API
exports.InquiryRealname = functions.https.onRequest((req,res)=>{
  var trans_id ="T991667950"; //이용기관코드
  var RandomInt = Math.floor(Math.random()*(999999999 - 100000000)) + 100000000;
  var bank_tran_id = trans_id+"U"+RandomInt; //은행거래고유번호
  var bank_code_std = "002"; //개설기관 표준코드
  var account_num = "123456789";
  var account_holder_info= "960829";
  var tran_dtime = "20201118151921"

  var option = {
    method : "POST",
    url : "https://testapi.openbanking.or.kr/v2.0/inquiry/real_name",
    headers : {
      'Content-Type' : 'application/json; charset=UTF-8',
      'Authorization' : 'Bearer' + access_token
    },
    body :JSON.stringify({
      bank_tran_id : bank_tran_id,
      bank_code_std : bank_code_std,
      account_num : account_num,
      account_holder_info : account_holder_info,
      tran_dtime : tran_dtime
    }),
  }
  request.post(option, function (error, response, body) {
    res.send(body);
    });
})
//송금인정보조회 API
exports.InquiryRemitlist = functions.https.onRequest((req,res)=>{
  var trans_id ="T991667950"; //이용기관코드
  var RandomInt = Math.floor(Math.random()*(999999999 - 100000000)) + 100000000;
  var bank_tran_id = trans_id+"U"+RandomInt; //은행거래고유번호
  var bank_code_std ="002";
  var account_num ="123456789";
  var from_date ="20171101";
  var from_time ="000000";
  var to_date ="20171102";
  var to_time ="000000";
  var sort_order = "D";
  var tran_dtime = "20171001143000";

  var option = {
    method : "POST",
    url : "https://testapi.openbanking.or.kr/v2.0/inquiry/remit_list",
    headers : {
      'Content-Type' : 'application/json; charset=UTF-8',
      'Authorization' : 'Bearer' + access_token
    },
    body :JSON.stringify({
      bank_tran_id : bank_tran_id,
      bank_code_std : bank_code_std,
      account_num : account_num,
      from_date : from_date,
      from_time : from_time,
      to_date : to_date,
      to_time : to_time,
      sort_order : sort_order,
      tran_dtime : tran_dtime
    }),
  }
  request.post(option, function (error, response, body) {
    res.send(body);
    });
})
//수취조회 API
exports.InquiryReceive = functions.https.onRequest((req,res)=>{
  var trans_id ="T991667950"; //이용기관코드
  var RandomInt = Math.floor(Math.random()*(999999999 - 100000000)) + 100000000;
  var bank_tran_id = trans_id+"U"+RandomInt; //은행거래고유번호
  var cntr_account_type = "N";
  var cntr_account_num = "4531442347"; //마이페이지/약정계좌관리
  var bank_code_std = "002"; //계좌인증방식
  var account_num = "87654321000"
  var account_seq = "001" //회차번호

  var print_content = "홍길동송금";
  var tran_amt = "1000";
  var req_client_name = "홍길동";
  var req_client_bank_code = "002";
  var req_client_account_num = "87654321000";
  var req_client_fintech_use = "199166795057887769188341";
  var req_client_num = "HONGGILDONG1234"; //임의값
  var transfer_purpose = "TR";

  var option = {
    method : "POST",
    url : "https://testapi.openbanking.or.kr/v2.0/inquiry/receive",
    headers : {
      'Content-Type' : 'application/json; charset=UTF-8',
      'Authorization' : 'Bearer' + access_token
    },
    body :JSON.stringify({
      bank_tran_id : bank_tran_id,
      cntr_account_type : cntr_account_type,
      cntr_account_num : cntr_account_num,
      bank_code_std : bank_code_std,
      account_num : account_num,
      account_seq : account_seq,
      print_content : print_content,
      tran_amt : tran_amt ,
      req_client_name : req_client_name ,
      req_client_bank_code : req_client_bank_code,
      req_client_account_num : req_client_account_num,
      req_client_fintech_use : req_client_fintech_use ,
      req_client_num : req_client_num ,
      transfer_purpose : transfer_purpose,
    }),
  }
  request.post(option, function (error, response, body) {
    res.send(body);
    });
})

//출금이체 API - 계좌정보 , 핀테크이용번호
exports.WithdrawFin = functions.https.onRequest((req,res)=>{
  var trans_id ="T991667950"; //이용기관코드
  var RandomInt = Math.floor(Math.random()*(999999999 - 100000000)) + 100000000;
  var bank_tran_id = trans_id+"U"+RandomInt; //은행거래고유번호
  var cntr_account_type = "N";
  var cntr_account_num = "4218413406"; //마이페이지/약정계좌관리
  var dps_print_content= "쇼핑몰환불";
  var fintech_use_num = "199166795057887769188341";
  var tran_amt = "1000";
  var tran_dtime = "20201117101921";
  var req_client_name = "홍길동";
  var req_client_bank_code = "002";
  var req_client_account_num = "87654321000";
  var req_client_fintech_use = "199166795057887769188341";
  var req_client_num = "HONGGILDONG1234"; //임의값
  var transfer_purpose = "TR";
  var recv_client_name = "홍길동";
  var recv_client_bank_code = "002";
  var recv_client_account_num = "87654321000";

  var option = {
    method : "POST",
    url : "https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num",
    headers : {
      'Content-Type' : 'application/json; charset=UTF-8',
      'Authorization' : 'Bearer' + access_token
    },
    body :JSON.stringify({
      bank_tran_id : bank_tran_id,
      cntr_account_type : cntr_account_type,
      cntr_account_num : cntr_account_num,
      dps_print_content : dps_print_content,
      fintech_use_num : fintech_use_num,
      tran_amt : tran_amt ,
      tran_dtime : tran_dtime ,
      req_client_name : req_client_name ,
      req_client_bank_code : req_client_bank_code,
      req_client_account_num : req_client_account_num,
      req_client_fintech_use : req_client_fintech_use , 
      req_client_num : req_client_num ,
      transfer_purpose : transfer_purpose,
      recv_client_name : recv_client_name,
      recv_client_bank_code : recv_client_bank_code,
      recv_client_account_num : recv_client_account_num
    }),
  }
  request.post(option, function (error, response, body) {
    res.send(body);
    });
})

//입금이체 API - 계좌정보 , 핀테크이용번호
exports.DepositFin = functions.https.onRequest((req,res)=>{
  var cntr_account_type = "N";
  var cntr_account_num = "4531442347"; //마이페이지/약정계좌관리
  var wd_pass_phrase = "NONE";
  var wd_print_content = "환불금액";
  var name_check_option = "on";
  var tran_dtime = "20201117101921";
  var req_cnt = "1";
  var tran_no = "1";
  var trans_id ="T991667950"; //이용기관코드
  var RandomInt = Math.floor(Math.random()*(999999999 - 100000000)) + 100000000;
  var bank_tran_id = trans_id+"U"+RandomInt; //은행거래고유번호
  var fintech_use_num = "199166795057887769188341";
  var print_content ="쇼핑몰 환불";
  var tran_amt = "500";
  var req_client_name = "홍길동";
  var req_client_bank_code = "002";
  var req_client_account_num = "87654321000";
  var req_client_fintech_use = "199166795057887769188341";
  var req_client_num = "HONGGILDONG1234"; //임의값
  var transfer_purpose = "TR";


  var option = {
    method : "POST",
    url : "https://testapi.openbanking.or.kr/v2.0/transfer/deposit/fin_num",
    headers : {
      'Content-Type' : 'application/json; charset=UTF-8',
      'Authorization' : 'Bearer' + access_token
    },
    body :JSON.stringify({
      cntr_account_type : cntr_account_type,
      cntr_account_num : cntr_account_num,
      wd_pass_phrase :wd_pass_phrase,
      wd_print_content : wd_print_content,
      name_check_option : name_check_option,
      tran_dtime : tran_dtime ,
      req_cnt : req_cnt,
      req_list :[{
        tran_no : tran_no,
        bank_tran_id : bank_tran_id,
        fintech_use_num : fintech_use_num,
        print_content : print_content,
        tran_amt : tran_amt ,
        req_client_name : req_client_name ,
        req_client_bank_code : req_client_bank_code,
        req_client_account_num : req_client_account_num,
        req_client_fintech_use : req_client_fintech_use , 
        req_client_num : req_client_num ,
        transfer_purpose : transfer_purpose
      }]
    }),
  }
  request.post(option, function (error, response, body) {
    res.send(body);
    });
})

//이체결과조회 API
exports.TransferResult = functions.https.onRequest((req,res)=>{
  var check_type = "2"; //출금 1 입금 2
  var tran_dtime = "20191210192100"; //요청일시
  var req_cnt ="1"; //요청건수 한번에 최대 25개
  var tran_no = "1"; //거래순번
  var org_bank_tran_id ="T991667950U383129167"; // 원거래고유번호(참가은행)
  var org_bank_tran_date = "20201125"; // 원거래거래일자(참가은행)
  var org_tran_amt = "500"; //원거래금액

  var option = {
    method : "POST",
    url : "https://testapi.openbanking.or.kr/v2.0/transfer/result",
    headers : {
      'Content-Type' : 'application/json; charset=UTF-8',
      'Authorization' : 'Bearer' + access_token
    },
    body :JSON.stringify({
      check_type : check_type,
      tran_dtime : tran_dtime,
      req_cnt : req_cnt,
      req_list : [{
        tran_no : tran_no,
        org_bank_tran_id : org_bank_tran_id,
        org_bank_tran_date : org_bank_tran_date,
        org_tran_amt : org_tran_amt
      }]
    }),
  }
  request.post(option, function (error, response, body) {
    res.send(body);
    });
})

//자금반환 청구 API
exports.RetrunClaim = functions.https.onRequest((req,res)=>{
  var trans_id ="T991667950"; //이용기관코드
  var RandomInt = Math.floor(Math.random()*(999999999 - 100000000)) + 100000000;
  var bank_tran_id = trans_id+"U"+RandomInt; //은행거래고유번호
  var org_bank_tran_date = "20191210";
  var org_bank_tran_id ="T991667950U772927241";
  //var org_dps_bank_code_std ="002";
  //var org_dps_account_num ="87654321000";
  var org_dps_fintech_use_num = "199166795057887769188341";
  var org_tran_amt ="500";
  var org_wd_bank_code_std ="002";
  var claim_code = "02";
  var total_return_yn = "Y";
  var return_account_num ="87654321000";
  var use_org_contact ="010-1234-5678";
  var use_org_email = "william@ido.so";

  var option = {
    method : "POST",
    url : "https://testapi.openbanking.or.kr/v2.0/return/claim",
    headers : {
      'Content-Type' : 'application/json; charset=UTF-8',
      'Authorization' : 'Bearer' + access_token
    },
    body :JSON.stringify({
      bank_tran_id : bank_tran_id,
      org_bank_tran_date : org_bank_tran_date,
      org_bank_tran_id : org_bank_tran_id,
     //org_dps_bank_code_std : org_dps_bank_code_std,
     // org_dps_account_num : org_dps_account_num,
      org_dps_fintech_use_num : org_dps_fintech_use_num,
      org_tran_amt : org_tran_amt,
      org_wd_bank_code_std : org_wd_bank_code_std,
      claim_code : claim_code,
      total_return_yn : total_return_yn,
      return_account_num : return_account_num,
      use_org_contact : use_org_contact,
      use_org_email : use_org_email
    }),
  }
  request.post(option, function (error, response, body) {
    res.send(body);
    });
})

//참가은행상태조회 API
exports.BankStatus = functions.https.onRequest((req,res)=>{
  var option = {
    method : "GET",
    url : "https://testapi.openbanking.or.kr/v2.0/bank/status",
    headers : {
        'Authorization' : 'Bearer ' + access_token
    },
  }
  request.get(option, function (error, response, body) {
    res.send(body)
    });

})

//수수료조회 API
exports.ManageFee = functions.https.onRequest((req,res)=>{
  var from_date = "20201001";
  var to_date = "20201002"

  var option = {
    method : "GET",
    url : "https://testapi.openbanking.or.kr/v2.0/manage/fee",
    headers : {
        'Authorization' : 'Bearer ' + access_token
    },
    qs : {// post방식 qs
        from_date : from_date,
        to_date : to_date
    }
  }
  request.get(option, function (error, response, body) {
    res.send(body)
    });
})

//집계조회 API
exports.ManageCount = functions.https.onRequest((req,res)=>{
  var inquiry_date = "20201001";

  var option = {
    method : "GET",
    url : "https://testapi.openbanking.or.kr/v2.0/manage/count",
    headers : {
        'Authorization' : 'Bearer ' + access_token
    },
    qs : {// post방식 qs
        inquiry_date : inquiry_date
    }
  }
  request.get(option, function (error, response, body) {
    res.send(body)
    });
})

//출금이체한도조회 API
exports.ManageWdlimit = functions.https.onRequest((req,res)=>{
  var option = {
    method : "GET",
    url : "https://testapi.openbanking.or.kr/v2.0/manage/wd_limit",
    headers : {
        'Authorization' : 'Bearer ' + access_token
    }
  }
  request.get(option, function (error, response, body) {
    res.send(body)
    });
})

//이상금융거래 탐지내역 조회 API
exports.InquiryFdsdetect = functions.https.onRequest((req,res)=>{
  var inquiry_date = "20201118";
  var from_time = "100000";
  var to_time = "100500";

  var option = {
    method : "GET",
    url : "https://testapi.openbanking.or.kr/v2.0/inquiry/fds_detect",
    headers : {
        'Authorization' : 'Bearer ' + access_token
    },
    qs : {
      inquiry_date : inquiry_date,
      from_time : from_time,
      to_time : to_time
    }
  }
  request.get(option, function (error, response, body) {
    res.send(body)
    });
})

// sa 토큰 발급
exports.sa = functions.https.onRequest((req,res)=>{
  var client_id = "8lg3dqDwMNCK6o1XSQlm9qVzEuDPBM0ExFRbAYqT";
  var client_secret = "pOc6q4lXQfhJPqv7Vwm6QkzbEtSfu2OZMAwpKxHu";
  var scope = "sa";
  var grant_type = "client_credentials";

  var option = {
    method : "POST",
    url : "https://testapi.openbanking.or.kr/oauth/v2.0/token",
    headers : {
      'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body :JSON.stringify({
      client_id : client_id,
      client_secret : client_secret,
      scope : scope,
      grant_type : grant_type
    }),
  }
  request.post(option, function (error, response, body) {
    res.send(body);
    });
})                      

