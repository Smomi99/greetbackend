var CheckJquery=false;
(function() {
    // Load the script
    const script = document.createElement("script");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
    script.type = 'text/javascript';
    script.addEventListener('load', () => {
       CheckJquery=true
        // BubbleInsert()
    });
    document.head.appendChild(script);
})();

var intervals   =setInterval(function (e){
    waitJquery()
},500)
function waitJquery(){

    if (CheckJquery){
        clearInterval(intervals)
        BubbleInsert()
    }else {

    }
}
waitJquery()
function BubbleInsert (){
    clearInterval(intervals)

    $(document).ready(function() {

        $.ajax({
            type: "POST",
            url: "http://localhost:5000/bubble/bubble_info",

            data: {CompleteGreet_ID:CompleteGreet_ID},
            success: function (mainData, status) {


                // {
                //     "Status": "Success",
                //     "Bubble": {
                //       "id": 10,
                //       "BubbleName": "test check",
                //       "BubbleVideo": "Bubble-Video-file-1678555008992.webm",
                //       "BubbleGif": "Bubble-Video-file-1678555008992.gif",
                //       "BubbleFontSize": 23,
                //       "BubbleTitle": "Hey!",
                //       "BubbleSize": 175,
                //       "BubbleBorderColor": "#007000",
                //       "BubbleBackgroundColor": "#ffffff",
                //       "BubbleButtonColor": "#CD7D3B",
                //       "BubbleFontFamily": "Helvetica",
                //       "BubbleDarken": false,
                //       "BubbleStyle": "Circle",
                //       "BubblePosition": "Right",
                //       "BubbleVideoFit": true,
                //       "BubbleDelay": 4,
                //       "BubbleFirstMessageDelay": 4,
                //       "IsDeleted": false,
                //       "BubbleAnimation": "No-Animation",
                //       "BubbleCode": "c9ecfb66-427c-52bb-b854-bb4f11e527bc",
                //       "BubbleDeactivated": false,
                //       "BubbleAllPages": true,
                //       "BubbleExcPages": "[[\"\"]]",
                //       "BubbleGreetMsg": "Hey, thanks for visiting! Feel free to ask anything.",
                //       "BubbleAvailable": true,
                //       "createdAt": "2023-03-11T17:16:49.000Z",
                //       "updatedAt": "2023-03-11T17:16:49.000Z",
                //       "UserId": 26
                //     },
                //     "NotificationSound": "https://completegreet.com/images/CompleteGreet/NotificationSoundFile-1672841469730.wav",
                //     "liveOnBubble": true
                //   }

                var data = {
                    Status: mainData.data.Status,
                    NotificationSound:mainData.data.NotificationSound,
                    liveOnBubble:mainData.data.liveOnBubble,
                    Bubble: {
                        id:mainData.data.Bubble.id,
                        BubbleName:mainData.data.Bubble.bubble_name,
                        BubbleVideo:mainData.data.Bubble.bubble_video,
                        
                        BubbleGif:mainData.data.Bubble.bubble_video,
                        BubbleFontSize:mainData.data.Bubble.bubble_font_size,
                        BubbleTitle:mainData.data.Bubble.bubble_title,
                        BubbleSize:mainData.data.Bubble.bubble_size,
                        BubbleBorderColor:mainData.data.Bubble.bubble_border_color,
                        BubbleBackgroundColor:mainData.data.Bubble.bubble_background_color || '#ffffff',
                        BubbleButtonColor:mainData.data.Bubble.bubble_button_color || '#000000',
                        BubbleFontFamily: "Helvetica",
                        BubbleDarken: mainData.data.Bubble.bubble_darken,
                      BubbleStyle: mainData.data.Bubble.bubble_style,
                      BubblePosition:mainData.data.Bubble.bubble_position,
                      BubbleVideoFit: mainData.data.Bubble.bubble_video_fit,
                      BubbleDelay: mainData.data.Bubble.bubble_delay,
                      BubbleFirstMessageDelay: 2,
                      IsDeleted: mainData.data.Bubble.is_deleted,
                      BubbleAnimation: mainData.data.Bubble.bubble_animation,
                      BubbleCode: mainData.data.Bubble.bubble_code,
                      BubbleDeactivated: mainData.data.Bubble.deactivated,
                      BubbleAllPages: mainData.data.Bubble.bubble_all_pages,
                      BubbleExcPages:  mainData.data.Bubble.bubble_exc_pages,
                      BubbleGreetMsg: "Hey, thanks for visiting! Feel free to ask anything.",
                      BubbleAvailable: mainData.data.Bubble.bubble_available,
                      createdAt:mainData.data.Bubble.created_at,
                      updatedAt: mainData.data.Bubble.updated_at,
                      UserId: mainData.data.Bubble.user_id,
                    }
                }


console.log(data);





                var availablePage=true
                if (data.Status=="Success"){
                    alert('1')
                    if (data.Bubble.BubbleExcPages!=null&&data.Bubble.BubbleExcPages!=""){
                        // var url=window.location.href
                        //  var url=window.location.href.replace(window.location.search,'')
                        var url=window.location.href.replace(window.location.search,'').replace(/^.*\/\/[^\/]+/, '')

                        // console.log(window.location.href.replace(window.location.search,'').replace(/^.*\/\/[^\/]+/, ''))
                        var ExcludedPages = data.Bubble.BubbleExcPages; ExcludedPages = ExcludedPages.replace('[[', '[').replace(']]', ']').replace(/'/g, '"') ; ExcludedPages = JSON.parse(ExcludedPages)
                        var ModifiedExcludedPages=[]
                        ExcludedPages.forEach(function (page){
                            ModifiedExcludedPages.push(page.replace(/^.*\/\/[^\/]+/, ''))
                        })

                        // var el = ExcludedPages.find(a =>a.includes(url));
                        var el = ModifiedExcludedPages.includes(url)


                        if (data.Bubble.BubbleAllPages){
                            availablePage=true
                        }else {
                            if (el==undefined||el==''||el==null){
                                availablePage=true
                            }else {
                                availablePage=false
                            }
                        }


                    }

                }
                if (data.Status=="Success"&&availablePage){
                    alert('2')
                    //------ Adding new visitor --//
                    var VisitorBubbleId=data.Bubble.id
                    var userId = data.Bubble.UserId
                    $.getJSON('https://geolocation-db.com/json/')
                        .done (function(location) {

                            $.ajax({
                                type: "GET",
                                url: "https://ipapi.co/"+location.IPv4+"/json/",

                                success: function (data, status) {
                                    console.log(VisitorBubbleId);
                                    let IPAddress=location.IPv4
                                    let City=data.city
                                    let Country=data.country_name
                                    $.ajax({
                                        type: "POST",
                                        url: "http://localhost:5000/add-visitor",
                                        data: {ip_address:IPAddress,city:City,country:Country,bubble_id:VisitorBubbleId,subscriber_id:userId,user_id:userId},
                                        success: function (data, status) {

                                        },
                                        error: function (data) {
                                            // alert("fail");
                                        }
                                    })
                                },
                                error: function (data) {
                                    console.log(data);
                                    alert("fail");
                                }
                            })

                        });
                    //----------------------------------------//
                    //--------- Bubble Large Container Iframe -------//
                var LargeBubbleContainer = document.createElement('iframe');
                    LargeBubbleContainer.src = 'about:blank';
                    LargeBubbleContainer.style="transition: all .5s ease-in-out;transform: translateY(calc(100% + 15px));border-radius:10px;filter: drop-shadow(0 0 6px rgba(0,0,0,0.2) );box-shadow: 0 12px 28px 0 rgba(0,0,0,0.2), 0 2px 4px 0 rgba(0,0,0,0.2);overflow:hidden;position:fixed;bottom:10px;right:8px;border:none;width:400px;height:80vh;z-index:100000000000;"

//-------------------- Checking window size to display -----------//
                    if (window.matchMedia('(max-width: 410px)').matches) {

                        LargeBubbleContainer.style.width='100%'
                        LargeBubbleContainer.style.height='100%'
                        LargeBubbleContainer.style.bottom='0px'
                        LargeBubbleContainer.style.borderRadius='0px'
                        LargeBubbleContainer.style.right='0px'
                        LargeBubbleContainer.style.left='0px'
                        if (data.Bubble.BubblePosition=="Right"){
                            LargeBubbleContainer.style.right='0px'
                            $(LargeBubbleContainer).css('left','')

                        }else if (data.Bubble.BubblePosition=="Left"){
                            LargeBubbleContainer.style.left='0px'
                            $(LargeBubbleContainer).css('right','')

                        }

                    }else {
                        LargeBubbleContainer.style.width='400px'
                        LargeBubbleContainer.style.height='80vh'
                        LargeBubbleContainer.style.borderRadius='10px'

                        LargeBubbleContainer.style.bottom='10px'

                        if (data.Bubble.BubblePosition=="Right"){
                            LargeBubbleContainer.style.right='10px'
                            $(LargeBubbleContainer).css('left','')

                        }else if (data.Bubble.BubblePosition=="Left"){
                            LargeBubbleContainer.style.left='10px'
                            $(LargeBubbleContainer).css('right','')

                        }


                    }
                    $(window).on('resize', function(){
                        if (window.matchMedia('(max-width: 410px)').matches) {

                            LargeBubbleContainer.style.width='100%'
                            LargeBubbleContainer.style.height='100%'
                            LargeBubbleContainer.style.bottom='0px'
                            LargeBubbleContainer.style.borderRadius='0px'
                            LargeBubbleContainer.style.right='0px'
                            LargeBubbleContainer.style.left='0px'
                            if (data.Bubble.BubblePosition=="Right"){
                                LargeBubbleContainer.style.right='0px'
                                $(LargeBubbleContainer).css('left','')

                            }else if (data.Bubble.BubblePosition=="Left"){
                                LargeBubbleContainer.style.left='0px'
                                $(LargeBubbleContainer).css('right','')

                            }

                        }else {
                            LargeBubbleContainer.style.width='400px'
                            LargeBubbleContainer.style.height='80vh'
                            LargeBubbleContainer.style.borderRadius='10px'

                            LargeBubbleContainer.style.bottom='10px'

                            if (data.Bubble.BubblePosition=="Right"){
                                LargeBubbleContainer.style.right='10px'
                                $(LargeBubbleContainer).css('left','')

                            }else if (data.Bubble.BubblePosition=="Left"){
                                LargeBubbleContainer.style.left='10px'
                                $(LargeBubbleContainer).css('right','')

                            }


                        }
                    })
//--------------------------------------------------------------------------//
                    var time=new Date()
                    var FakeDate=time.toISOString()
                    var LargeBubbleContainerhtml = `
          <!DOCTYPE html>
          <html lang="en">
            <head>
                <title>Dashboard</title>
                <link rel="icon" href="/images/CompleteGreet/FavIcon.png">
            
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link rel="stylesheet" href="http://localhost:5000/css/fontawesome.css">
                <link rel="stylesheet" href="http://localhost:5000/css/bootstrap.css">
                <link rel="stylesheet" href="http://localhost:5000/css/Input-Style.css">
                <link rel="stylesheet" type="text/css" href="http://localhost:5000/css/Chatbox.css">
                <link rel="stylesheet" type="text/css" href="http://localhost:5000/css/Videos.css">
                <link rel="stylesheet" type="text/css" href="http://localhost:5000/css/BubbleIframe.css">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
            </head>
            <body class="hold-transition sidebar-mini">
                <div data-bubbleinfo='${JSON.stringify(
                  data.Bubble
                )}' data-notisound='${
            data?.NotificationSound
          }' class='Bubble-large-container h-100'>
                        <div class="multi-step-container h-100">
                        <div class="Step-1 steps-transition h-100 w-100 z-5 position-absolute">
                            <div class="video-container h-100">
                                <video class="video-content h-100" playsinline loop id="Large-container-video" src=""></video>
                                <div id="play-btn" class="video-controls"><i class="fa-solid fa-play fa-xl"></i></div>
                                <div id="pause-btn" class="video-controls"></div>
                                <div id="mute-btn" class="video-controls"><i class="fa-solid fa-volume-high"></i></div>
                                <div id="unmute-btn" class="video-controls"><i class="fa-solid fa-volume-xmark"></i></div>
                                <!-- <div id="stop-btn" class="video-controls">STOP</div> -->
                                <div id="replay-btn" class="video-controls"><i class="fa-solid fa-rotate-right fa-xl"></i></div>
                                <div id="Exit-btn" class="video-controls exit-btn"><i class="fa-solid fa-xmark fa-xl"></i></div>
                                <div class="video-progressbar">
                                    <span class="h-100"></span>
                                </div>
                                
                               
                               <div class='button-container'>
                               <div id="" class="start-live-chat-btn multi-step-btn">
                               Start live chat new
                           </div>
                           <div id="step-1-btn" class="start-live-chat-btn multi-step-btn">
                               Start live chat
                           </div>
                               </div>
                                <div class="company-name">
                                    <a target="_blank" href="https://completegreet.com">   Created with <b> Complete Greet</b></a>
                                </div>
                                <div class="video-overlay">

                                </div>
                            </div>
                        </div>
                    <div class="Fake-Step steps-transition h-100 w-100 z-4 position-absolute">

                        <div class="send-message-container h-100 w-100 position-relative">
                            <div id="Exit-btn" class="video-controls exit-btn z-4"><i class="fa-solid fa-xmark fa-xl"></i></div>
                            <div id="Back-btn" class="video-controls back-btn z-4"><i class="fa-solid fa-arrow-left fa-xl"></i></div>
                            <div class="card h-100 card-danger direct-chat direct-chat-danger">
                                <div class="card-header">
                                    <h3 class="card-title w-75 mx-auto live-chat-name text-uppercase text-dark">Live Chat</h3>
                                </div>
                                <!-- /.card-header -->
                                <div class="card-body p-0">
                                    <!-- Conversations are loaded here -->
                                    <div class="direct-chat-messages h-100">
                                        <!-- /.direct-chat-msg -->
                                        <!-- Message. Default to the left -->
                                        <div class="direct-chat-msg d-none">
                                            <!-- <img class="direct-chat-img" src="/docs/3.0/assets/img/user1-128x128.jpg" alt="message user image"> -->
                                            <!-- /.direct-chat-img -->
                                            <div class="direct-chat-text sender-left-msg">
                                                ${data.Bubble.BubbleGreetMsg}
                                            </div>
                                            <div class="direct-chat-infos clearfix">
                                                <!-- <span class="direct-chat-name float-left">Alexander Pierce</span> -->
                                                <span class="direct-chat-timestamp">${FakeDate.replace(
                                                  "T",
                                                  " "
                                                ).slice(0, -8)}</span>
                                            </div>
                                            <!-- /.direct-chat-text -->
                                            <!-- /.direct-chat-infos -->
                                        </div>
                                        <!-- /.direct-chat-msg -->
                                    <!--/.direct-chat-messages-->
                                    </div>
                                </div>
                                <div class="card-footer">
                                <div class="input-group">
                                    <input type="text" id="fake-msg-content" name="message" placeholder="Type Message ..." class="form-control">
                                    <span class="input-group-append">
                                        <button disabled type="button" id="fake-send-msg-btn" style="border: 0px" class="Button"><i class="fa-solid fa-paper-plane"></i></button>
                                    </span>
                                </div>
                            </div>
                            <!-- /.card-footer-->
                        </div>
                        
                        </div>
                    </div>
                               <div class="Step-2 steps-transition h-100 w-100 z-3 position-absolute">
                                <div class="send-message-container h-100 w-100 position-relative">
                                
                                    <div class="card-header">
                                        <h3 class="card-title w-75 mx-auto live-chat-name text-uppercase">Live Chat</h3>
                                    </div>
                                <div id="Exit-btn" class="video-controls exit-btn"><i class="fa-solid fa-xmark fa-xl"></i></div>
                                <div id="Back-btn" class="video-controls back-btn"><i class="fa-solid fa-arrow-left fa-xl"></i></div>
                                <div class="message-input ">
                                    <label class="Input-Style auto-input-focus w-75 mx-auto d-block mt-4">
                                        <input name="Name-Message" autocomplete="off" id="Name-Message" class="w-100 p-3" type="text" placeholder="Type here...">
                                        <span class="multi-step-input-label">Your Name</span>
                                    </label>
                                    <label class="Input-Style auto-input-focus w-75 mx-auto d-block mt-4">
                                        <input autocomplete="off" name="Email-Message" id="Email-Message" class="w-100 p-3" type="email" placeholder="Type here...">
                                        <span class="multi-step-input-label">Your Email</span>
                                    </label>
                                    <div class="toast Toast-Warning w-75 d-none mb-3 mx-auto mt-1" style="" role="alert" aria-live="assertive" aria-atomic="true">
                                        <div class="toast-header">
                                            <i class="fa fa-2x fa-exclamation-circle mr-2 text-danger"></i>
                                            <strong class="mr-auto Toast-Name">Complete Greet</strong>
                                            <small class="text-white">just now</small>
                                        </div>
                                        <div class="toast-body">
                        
                                        </div>
                                    </div>
                                    <div id="step-2-btn" style="bottom: auto" class="step-2-send-btn mt-2 mx-auto w-50 Button multi-step-btn">
                                        Send
                                    </div>
                                </div>
                                <!-- <div id="start-live-chat" class="mx-auto w-50 Button multi-step-btn">
                                    Start live chat
                                </div>-->
                            </div>
                        </div>
                       <!-- end of step 2 >-->

                       <div class="Step-3 steps-transition h-100 w-100 z-2 position-absolute">
                       <div class="send-message-container h-100 w-100 position-relative">
                           <div id="Exit-btn" class="video-controls exit-btn z-4"><i class="fa-solid fa-xmark fa-xl"></i></div>
                           <div id="Back-btn" class="video-controls back-btn z-4"><i class="fa-solid fa-arrow-left fa-xl"></i></div>
                           <div class="card h-100 card-danger direct-chat direct-chat-danger">
                               <div class="card-header">
                                   <h3 class="card-title w-75 mx-auto live-chat-name text-uppercase text-dark">Live Chat</h3>
                               </div>
                               <!-- /.card-header -->
                               <div class="card-footer">
                                   <div class="input-group">
                                       <input type="text" id="msg-content" name="message" placeholder="Type Message ..." class="form-control">
                                       <span class="input-group-append">
                                           <button disabled type="button" id="send-msg-btn" style="border: 0px" class="Button"><i class="fa-solid fa-paper-plane"></i></button>
                                       </span>
                                   </div>
                               </div>
                               <!-- /.card-footer-->
                           </div>
                       </div>
                   </div>

                    </div>
                </div>
                <script type="text/javascript" src="http://localhost:5000/js/jquery-3.5.1.min.js"></script>
                <script type="application/javascript" src="http://localhost:5000/js/popper.min.js"></script>
                <script type="application/javascript" src="http://localhost:5000/js/bootstrap.min.js"></script>
                <script type="application/javascript" src="http://localhost:5000/js/fontawesome.js"></script>
               <!-- /. <script src="http://localhost:5000/socket.io/socket.io.js"></script> -->


               <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.6.1/socket.io.min.js"
               integrity="sha512-AI5A3zIoeRSEEX9z3Vyir8NqSMC1pY7r5h2cE+9J6FLsoEmSSGLFaqMQw8SWvoONXogkfFrkQiJfLeHLz3+HOg=="
               crossorigin="anonymous" referrerpolicy="no-referrer"></script>

               
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
                <script type="application/javascript" src="http://localhost:5000/js/LargeBubbleContainerIframe.js"></script>
            </body>
        </html> `;
                document.body.appendChild(LargeBubbleContainer);
                    LargeBubbleContainer.contentWindow.document.open();
                    LargeBubbleContainer.contentWindow.document.write(LargeBubbleContainerhtml);
                    LargeBubbleContainer.contentWindow.document.close();
                    LargeBubbleContainer.setAttribute("id", "LContainer");


                    var Large_Bubble_Container = LargeBubbleContainer.contentWindow.document.getElementsByClassName("Bubble-large-container");
                    // $(Large_Bubble_Container).attr("data-bubbleinfo",JSON.stringify(data.Bubble))
                    // $(Large_Bubble_Container).attr("data-notisound",data.NotificationSound)
                //---------------------------------------------------------------------//

                //-------- Bubble Frame --------//
                    var BubbleFrame = document.createElement('iframe');
                    BubbleFrame.src = 'about:blank';
                    var Styles="transition: all .5s ease-in-out;border-radius:10px;overflow:hidden;position:fixed;bottom:-10px;right:-10px;border:none;width:400px;height:80vh;z-index:10000;"
                    $(BubbleFrame).addClass("invisible")

                    $(BubbleFrame).on({
                        mouseenter: function () {
                            $(this).css("transition","all .2s ease-in-out")
                            $(this).css("transform","scale(1.03)")
                        },
                        mouseleave: function () {
                            $(this).css("transform","scale(1)")
                        }
                    });
                    BubbleFrame.style=Styles
                    if (data.Bubble.BubbleStyle=="Circle"){
                        BubbleFrame.style=Styles+"border-radius:50%;width:"+(data.Bubble.BubbleSize+40)+"px;height:"+(data.Bubble.BubbleSize+40)+"px;"

                    }else if (data.Bubble.BubbleStyle=="Rectangle"){
                        BubbleFrame.style=Styles+"border-radius:10px;width:"+(data.Bubble.BubbleSize+40)+"px;height:"+(data.Bubble.BubbleSize*1.5+40)+"px;"

                    }
                    if (data.Bubble.BubblePosition=="Right"){

                    }else if (data.Bubble.BubblePosition=="Left"){
                        BubbleFrame.style.left="-10px"
                        LargeBubbleContainer.style.left="10px"
                        if (window.matchMedia('(max-width: 410px)').matches) {
                            LargeBubbleContainer.style.left="0px"

                        }

                        }
                    if (data.Bubble.BubbleAnimation=="Left-to-right"){

                        BubbleFrame.style.transform="translateX(-1500%)"
                        $(BubbleFrame).removeClass("invisible")

                        setTimeout(function (){

                            BubbleFrame.style.transform="translateX(0%)"

                        },(data.Bubble.BubbleDelay+0.5)*1500)
                    }else if (data.Bubble.BubbleAnimation=="Top-to-bottom"){
                        BubbleFrame.style.transform="translateY(-1000%)"
                        $(BubbleFrame).removeClass("invisible")

                        setTimeout(function (){

                            BubbleFrame.style.transform="translateY(0%)"

                        },(data.Bubble.BubbleDelay+0.5)*1500)

                    }else if (data.Bubble.BubbleAnimation=="Right-to-left"){
                        BubbleFrame.style.transform="translateX(1500%)"
                        $(BubbleFrame).removeClass("invisible")

                        setTimeout(function (){

                            BubbleFrame.style.transform="translateX(0%)"

                        },(data.Bubble.BubbleDelay+0.5)*1500)
                    }else if (data.Bubble.BubbleAnimation=="No-Animation"){
                        $(BubbleFrame).removeClass("invisible")
                        $(BubbleFrame).css("opacity",0)


                        setTimeout(function (){
                            $(BubbleFrame).css("opacity",1)

                            // $(BubbleFrame).fadeIn(1000,"swing");

                        },(data.Bubble.BubbleDelay+0.5)*1500)
                    }
                    // '                                                <img style="opacity: 1; border-radius: 0px" class="video-content  w-100 h-100" src="https://completegreet.com/files/users/'+data.Bubble.UserId+'/Bubble-Videos/'+data.Bubble.BubbleGif+'">\n' +
                    // '                                                <video class="video-content  w-100 h-100" autoplay loop id="video-bubble" muted src=""></video>\n' +

                    if (data.liveOnBubble==true){
                        alert('3')
                        var BubbleFramehtml = `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <title>Bubble</title>
                            <link rel="icon" href="/images/CompleteGreet/FavIcon.png">
                        
                            <meta charset="utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            <link rel="stylesheet" href="http://localhost:5000/css/fontawesome.css">
                            <link rel="stylesheet" href="http://localhost:5000/css/bootstrap.css">
                            <link rel="stylesheet" href="http://localhost:5000/css/Input-Style.css">
                            <link rel="stylesheet" type="text/css" href="http://localhost:5000/css/Chatbox.css">
                            <link rel="stylesheet" type="text/css" href="http://localhost:5000/css/Videos.css">
                            <link rel="stylesheet" type="text/css" href="http://localhost:5000/css/BubbleIframe.css">
                        </head>
                        <body style="padding: 20px;background-color: transparent" class="hold-transition sidebar-mini">
                        
                        
                        
                        <div id="Bubble-Body" style="filter: drop-shadow(0 0 6px rgba(0,0,0,0.2) );box-shadow: 0 12px 20px 0 rgba(0,0,0,0.2), 0 2px 4px 0 rgba(0,0,0,0.2);" class="Bubble-Body position-relative">
                            <div class="Bubble-Inner-Container w-100 h-100 position-relative">
                                <div class="Bubble-Video w-100 h-100">
                                    <video style="opacity: 1; border-radius: 0px" class="video-content  w-100 h-100" src="http://localhost:5000/files/users/${data.Bubble.UserId}/Bubble-Videos/${data.Bubble.BubbleVideo}"></video>
                                </div>
                                <div class="Bubble-Video-Overlay">
                                    <div class="Bubble-Inner-Title text-white p-2">
                                        Hey!
                                    </div>
                                </div>
                                <div class="Bubble-external-overlay">
                        
                                </div>
                            </div>
                        </div>
                        <div id="close-frame" class="close-frame position-fixed"><i class="fa-solid fa-xl fa-xmark"></i></div> 
                        <div id="Live-frame" class="Live-frame position-fixed"><i style="margin-top: 3px" class="fa-solid fa-circle mr-1 fa-2xs"></i><div>Live</div> </div> 
                        <script type="text/javascript" src="http://localhost:5000/js/jquery-3.5.1.min.js"></script>
                        <script type="application/javascript" src="http://localhost:5000/js/popper.min.js"></script>
                        <script type="application/javascript" src="http://localhost:5000/js/bootstrap.min.js"></script>
                        <script type="application/javascript" src="http://localhost:5000/js/fontawesome.js"></script>
                        <script type="application/javascript" src="http://localhost:5000/js/BubbleIframe.js"></script>
                        
                        
                        
                        </body>
                        </html>`;



                        




                    }else if (data.liveOnBubble==false){
                        alert('4')
                        var BubbleFramehtml = `
                        <!DOCTYPE html>
                        <html lang="en">
                          <head>
                            <title>Bubble</title>
                            <link rel="icon" href="/images/CompleteGreet/FavIcon.png">
                            <meta charset="utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            <link rel="stylesheet" href="http://localhost:5000/css/fontawesome.css">
                            <link rel="stylesheet" href="http://localhost:5000/css/bootstrap.css">
                            <link rel="stylesheet" href="http://localhost:5000/css/Input-Style.css">
                            <link rel="stylesheet" type="text/css" href="http://localhost:5000/css/Sidebar.css">
                            <link rel="stylesheet" type="text/css" href="http://localhost:5000/css/Chatbox.css">
                            <link rel="stylesheet" type="text/css" href="http://localhost:5000/css/Videos.css">
                            <link rel="stylesheet" type="text/css" href="http://localhost:5000/css/BubbleIframe.css">
                            <link rel="stylesheet" type="text/css" href="http://localhost:5000/css/Dashboard.css">
                          </head>
                          <body style="padding: 20px;background-color: transparent" class="hold-transition sidebar-mini">
                            <div id="Bubble-Body" style="filter: drop-shadow(0 0 6px rgba(0,0,0,0.2) );box-shadow: 0 12px 20px 0 rgba(0,0,0,0.2), 0 2px 4px 0 rgba(0,0,0,0.2);" class="Bubble-Body position-relative">
                              <div class="Bubble-Inner-Container w-100 h-100 position-relative">
                                <div class="Bubble-Video w-100 h-100">
                                  <img style="opacity: 1; border-radius: 0px" class="video-content  w-100 h-100" src="http://localhost:5000/files/users/${data.Bubble.UserId}/Bubble-Videos/${data.Bubble.BubbleVideo}">
                                </div>
                                <div class="Bubble-Video-Overlay">
                                  <div class="Bubble-Inner-Title text-white p-2">
                                    Hey!
                                  </div>
                                </div>
                                <div class="Bubble-external-overlay"></div>
                              </div>
                            </div>
                            <div id="close-frame" class="close-frame position-fixed"><i class="fa-solid fa-xl fa-xmark"></i></div>
                            <script type="text/javascript" src="http://localhost:5000/js/jquery-3.5.1.min.js"></script>
                            <script type="application/javascript" src="http://localhost:5000/js/popper.min.js"></script>
                            <script type="application/javascript" src="http://localhost:5000/js/bootstrap.min.js"></script>
                            <script type="application/javascript" src="http://localhost:5000/js/fontawesome.js"></script>
                            <script type="application/javascript" src="http://localhost:5000/js/Sidebar.js"></script>
                            <script type="application/javascript" src="http://localhost:5000/js/BubbleIframe.js"></script>
                          </body>
                        </html>
                      `;
                    }
                    document.body.appendChild(BubbleFrame);

                    BubbleFrame.contentWindow.document.open();
                    BubbleFrame.contentWindow.document.write(BubbleFramehtml);
                    BubbleFrame.contentWindow.document.close();
//----------- Toggling Large Bubble ----------------------//
                    var video1 = LargeBubbleContainer.contentWindow.document.getElementById('Large-container-video');
                    var Step1 = LargeBubbleContainer.contentWindow.document.getElementsByClassName('Step-1');

                    var Bubble_Body = BubbleFrame.contentWindow.document.getElementById("Bubble-Body");
                    $(Bubble_Body).attr("data-bubbleinfo",JSON.stringify(data.Bubble))
                    $(Bubble_Body).on('click',function (e){
                        e.preventDefault()
                        $(LargeBubbleContainer).css('transform','translateY(0%)')
                        if ($(Step1).hasClass("go-left")){

                        }else {
                            video1.play()

                        }
                    })
                    var LargeContainerExit_btn = LargeBubbleContainer.contentWindow.document.getElementsByClassName("exit-btn");
                    for (var i = 0; i < LargeContainerExit_btn.length; i++) {
                        LargeContainerExit_btn[i].addEventListener("click", function() {
                            $(LargeBubbleContainer).css('transform','translateY(calc(100% + 15px))')
                        });
                    }
                    var test=LargeBubbleContainer.contentWindow.document
                    $(test).on('click','.exit-btn',function (){
                        $(LargeBubbleContainer).css('transform','translateY(calc(100% + 15px))')

                    })
                    $(document).on('keyup', function (e) {
                        if (e.key === 'Escape' || e.keyCode === 27 || e.keyCode === 'Esc') {
                            $(LargeContainerExit_btn).click()
                        }
                    });
                    $(LargeBubbleContainer.contentWindow.document).on('keyup', function (e) {
                        if (e.key === 'Escape' || e.keyCode === 27 || e.keyCode === 'Esc') {
                            $(LargeContainerExit_btn).click()
                        }
                    });
                    $(BubbleFrame.contentWindow.document).on('keyup', function (e) {
                        if (e.key === 'Escape' || e.keyCode === 27 || e.keyCode === 'Esc') {
                            $(LargeContainerExit_btn).click()
                        }
                    });


//-------------- Adding Close btn -------------------//
                    var Close_Btn = BubbleFrame.contentWindow.document.getElementById("close-frame");

                    if (data.Bubble.BubbleStyle=="Circle"){
                        $(Close_Btn).css('right',(15+data.Bubble.BubbleSize/2)-(Math.sqrt(2)*data.Bubble.BubbleSize/4)-10)
                        $(Close_Btn).css('top',(15+data.Bubble.BubbleSize/2)-(Math.sqrt(2)*data.Bubble.BubbleSize/4)-10)
 // $(Close_Btn).css('right',(20+data.Bubble.BubbleSize/2)-(Math.sqrt(3)*data.Bubble.BubbleSize/4)-10)
 //                        $(Close_Btn).css('top',(20+data.Bubble.BubbleSize/2)-(0.5*data.Bubble.BubbleSize/2)-10)

                    }
                    //------------------ Removing Bubbles if Closed -------------------//
                    $(Close_Btn).on('click',function (){
                        $(BubbleFrame).remove()
                        $(LargeBubbleContainer).remove()
                    })
$(LargeBubbleContainer).attr("crossorigin","anonymous")
                }else if (data.Status=="Fail") {
                    console.log(data.msg)
                        // $(".Toast-Warning").removeClass('d-none')
                        // $(".Toast-Warning .toast-body").text(data.msg)
                        // $(".Toast-Warning").toast('show')
                        // setTimeout(function (){
                        //     $(".Toast-Warning").addClass('d-none')
                        //
                        // },3500)
                }


            },
            error: function (data) {
                alert("fail");
            }
        })

    })
}