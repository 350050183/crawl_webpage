//待抓取主播Url列表
var anchor_list = [
'http://www.douyu.com/580964',
'http://www.douyu.com/757172'
];
var current_anchor_idx = 0;


//step1 在空白tab时，点击一次开启自动抓取任务
window.onload = function(){
  chrome.tabs.update( { url: anchor_list[current_anchor_idx]} );  
};

//step2 当页面加载完后执行抓取分析
chrome.tabs.onUpdated.addListener(
  function ( tabId, changeInfo, tab )
  { 
    if ( changeInfo.status === "complete" )
    {
      // chrome.tabs.executeScript({
      // code: "console.log('page load fininshed!!! deal with the anchor!');"
    // });

    //待待几秒页面加载完整
    setTimeout(function(){onWindowLoad();},3000);    
  }
});

//step3 获取当前页面源文件并发出事件
function onWindowLoad() {

  var message = document.querySelector('#message');

  chrome.tabs.executeScript(null, {
    file: "getPagesSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });
}

//step4 处理获取完源代码的事件
chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    //message.innerText = request.source;

    //get anchor weight
    var weight = $('a.weight-v',$(request.source)).html();
    $('#weight').html('Anchor weight is '+weight);

    //get anchor id
    var anchor_id = '';
    var anchor_url = $('div.assort-ad a',$(request.source)).attr('href');
    if(anchor_url!=undefined){
      var url_token = parse_url(anchor_url);
      anchor_id = url_token['roomid']==undefined?'':url_token['roomid'];
    }

    message.innerText = 'OK.';    

    //save weight
    save_anchor_weight(anchor_id,weight);
  }
});

//step5 保存主播的数据
function save_anchor_weight(anchor_id,weight){
      tips('saving...');
      $.get('http://dev.domain.com/foo.php',{'anchor_id':anchor_id,'weight':weight},function(data){
        
        //是否有一个主播要抓取
        if(current_anchor_idx+1 < anchor_list.length){          
          current_anchor_idx += 1;
          chrome.tabs.update( { url: anchor_list[current_anchor_idx]} );  
          tips('next anchor,please waiting...');       
        }else{
          tips('All done.');
        }

    },'json'); 
}

//提示
function tips(message){
  $('#message').html(message);
}
