var socketio = io();

//user info
var user_name="匿名";
var user_id=-1;
var user_password="";
var is_login_user=false;

//event info
var event_name="承認会議";

//voter info
var voter_name="匿名団体";
var num_attending_user=30;

//voting info
var num_accept=0;
var num_deny=0;
var is_accepted=false;
var has_result=false;
var is_voting=false;

//cookie info
document.cookie = 'user_id=0';
document.cookie = 'user_name=匿名団体';



function alert(msg) {
    return $('<div class="alert" role="alert"></div>')
        .text(msg);
}

// アラート要素(Closeボタン付き)を生成する 
function alertWithCloseBtn(msg) {
return alert(msg)
    .addClass('alert-success alert-dismissable')
    .append(
    $('<button class="close" data-dismiss="alert"></button>')
        .append(
        $('<span aria-hidden="true">☓</span>')
        )
    );
}



function rewriteResult() {
  if(has_result){
    if(is_accptd){
      $('#is_accptd').text('承認されました');
    }else{
      $('#is_accptd').text('否認されました');
    }
  }else{
    if(is_voting){
      $('#is_accptd').text('投票中...');
    }else{
      $('#is_accptd').text('');
    }
  }
  return false;
}


function rewriteGraph() {
  $('#num_accpt').text(num_accept);
  $('#num_deny').text(num_deny);
  $('#bar_accept').attr({
    'aria-valuenow': num_accept,
    'aria-valuemax': num_attending_user
  });
  return false;
}

function rewritePreference(){
  $('#voter').text("現在の発表者は"+voter_name); 
}

function rewrite() {
  rewriteResult();
  rewriteGraph();
  rewritePreference();
}

function init() {
  $('.modal').modal('show');
}

function login() {
  socketio.emit('user_info', $('#user_id').val()+","+$('#user_name_input').val());
  user_id=$('#user_id').val();
  user_name=$('#user_name_input').val();

  // modalを閉じる
  $('body').removeClass('modal-open'); // 1
  $('.modal-backdrop').remove();       // 2
  $('#input_user_info').modal('hide'); 

  // アラートを表示して、一定時間経過後消去する。
  const e = alertWithCloseBtn(user_name+'として登録が完了しました！ 入力ありがとうございます。').addClass('alert-success');
  $('#alert-1').append(e);
  setTimeout(() => {
      e.alert('close');
  }, 5000);

  $('#user_id').val('');
  $('#input_name_input').val('');
  return false;
}

function vote() {
  socketio.emit('vote', $("input[name='votes']:checked").val()+","+user_id);
  $('#vote_submit').prop('disabled', true);
  const e = alertWithCloseBtn(voter_name+'への投票を送信しました。').addClass('alert-primary');
  $('#alert-1').append(e);
  setTimeout(() => {
      e.alert('close');
  }, 5000);
  return false;
}

function nextVoter() {
  $('#vote_submit').prop('disabled', false);
  num_accept=0;
  num_deny=0;
  has_result=false;
  is_accepted=false;
  is_voting=true;
  rewrite();
}



$(document).ready(function(){
  init();
  return false;
});

$(function(){
  $('#ballot_form').submit(function(){
    vote();
    return false;
  });

  $('#user_info_form').submit(function(){
    login();
    return false;
  });

  socketio.on('is_accepted',function(is_accptd){
    is_accepted=is_accptd;
    rewriteResult();
    return false;
  });

  socketio.on('num_accept',function(num_accpt){
    num_accept=num_accpt;
    rewriteGraph();
    return false;
  });
  
  socketio.on('num_deny',function(num_dny){
    num_deny=num_dny;
    rewriteGraph();
    return false;
  });

  socketio.on('voter',function(vtr){
    voter_name=vtr;
    nextVoter();
    return false;
  });
  socketio.on('num_voter',function(num_vtr){
    num_attending_user=num_vtr;
    return false;
  });

  //event情報更新を実装する
  socketio.on('event',function(event){
    rewrite();
    return false;
  });



// デバッグ用メッセージ機能
  $('#message_form').submit(function(){
    socketio.emit('message', $('#input_msg').val());
    $('#input_msg').val('');
    return false;
  });

  socketio.on('message',function(msg){
    $('#messages').append($('<li>').text(msg));
    return false;
  });
});