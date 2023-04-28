var CheckJquery = false;
(function () {
  // Load the script
  const script = document.createElement("script");
  script.src =
    "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js";
  script.type = "text/javascript";
  script.addEventListener("load", () => {
    CheckJquery = true;
    // BubbleInsert()
  });
  document.head.appendChild(script);
})();

var intervals = setInterval(function (e) {
  waitJquery();
}, 500);
function waitJquery() {
  if (CheckJquery) {
    clearInterval(intervals);
    BubbleInsert();
  } else {
  }
}
waitJquery();
function BubbleInsert() {
  clearInterval(intervals);

  $(document).ready(function () {
    $.ajax({
      type: "POST",
      url: "http://localhost:5000/bubble/bubble_info",

      data: { CompleteGreet_ID: CompleteGreet_ID },
      success: function (data, status) {
        // alert()
        console.log(data);
        var availablePage = true;
        if (data.error == false) {
          if (
            data.data.bubble_exc_pages != null &&
            data.data.bubble_exc_pages != ""
          ) {
            // var url=window.location.href
            //  var url=window.location.href.replace(window.location.search,'')
            var url = window.location.href
              .replace(window.location.search, "")
              .replace(/^.*\/\/[^\/]+/, "");
            // alert(url)

            // console.log(window.location.href.replace(window.location.search,'').replace(/^.*\/\/[^\/]+/, ''))
            var ExcludedPages = data.data.bubble_exc_pages;
            ExcludedPages = ExcludedPages.replace("[", "[")
              .replace("]", "]")
              .replace(/'/g, '"');
            ExcludedPages = JSON.parse(ExcludedPages);

            var ModifiedExcludedPages = [];
            ExcludedPages.forEach(function (page) {
              ModifiedExcludedPages.push(page.replace(/^.*\/\/[^\/]+/, ""));
            });

            // var el = ExcludedPages.find(a =>a.includes(url));
            var el = ModifiedExcludedPages.includes(url);

            if (data.data.bubble_all_pages) {
              availablePage = true;
            } else {
              if (el == undefined || el == "" || el == null) {
                availablePage = true;
              } else {
                availablePage = false;
              }
            }
          }
        }
        if (data.error == false && availablePage) {
          //------ Adding new visitor --//
          var VisitorBubbleId = data.data.id;
          $.getJSON("https://geolocation-db.com/json/").done(function (
            location
          ) {
            $.ajax({
              type: "GET",
              url: "https://ipapi.co/" + location.IPv4 + "/json/",

              success: function (data, status) {
                let IPAddress = location.IPv4;
                let City = data.city;
                let Country = data.country_name;
                $.ajax({
                  type: "POST",
                  url: "https://completegreet.com/users/VisitorInfo",
                  data: { IPAddress, City, Country, VisitorBubbleId },
                  success: function (data, status) {},
                  error: function (data) {
                    // alert("fail");
                  },
                });
              },
              error: function (data) {
                alert("fail in user");
              },
            });
          });
          //----------------------------------------//
          //--------- Bubble Large Container Iframe -------//
          var LargeBubbleContainer = document.createElement("iframe");
          LargeBubbleContainer.src = "about:blank";
          LargeBubbleContainer.style =
            "transition: all .5s ease-in-out;transform: translateY(calc(100% + 15px));border-radius:10px;filter: drop-shadow(0 0 6px rgba(0,0,0,0.2) );box-shadow: 0 12px 28px 0 rgba(0,0,0,0.2), 0 2px 4px 0 rgba(0,0,0,0.2);overflow:hidden;position:fixed;bottom:10px;right:8px;border:none;width:400px;height:80vh;z-index:100000000000;";

          //-------------------- Checking window size to display -----------//
          if (window.matchMedia("(max-width: 410px)").matches) {
            LargeBubbleContainer.style.width = "100%";
            LargeBubbleContainer.style.height = "100%";
            LargeBubbleContainer.style.bottom = "0px";
            LargeBubbleContainer.style.borderRadius = "0px";
            LargeBubbleContainer.style.right = "0px";
            LargeBubbleContainer.style.left = "0px";
            if (data.data.bubble_position == "Right") {
              LargeBubbleContainer.style.right = "0px";
              $(LargeBubbleContainer).css("left", "");
            } else if (data.data.bubble_position == "Left") {
              LargeBubbleContainer.style.left = "0px";
              $(LargeBubbleContainer).css("right", "");
            }
          } else {
            LargeBubbleContainer.style.width = "400px";
            LargeBubbleContainer.style.height = "80vh";
            LargeBubbleContainer.style.borderRadius = "10px";

            LargeBubbleContainer.style.bottom = "10px";

            if (data.data.bubble_position == "Right") {
              LargeBubbleContainer.style.right = "10px";
              $(LargeBubbleContainer).css("left", "");
            } else if (data.data.bubble_position == "Left") {
              LargeBubbleContainer.style.left = "10px";
              $(LargeBubbleContainer).css("right", "");
            }
          }
          $(window).on("resize", function () {
            if (window.matchMedia("(max-width: 410px)").matches) {
              LargeBubbleContainer.style.width = "100%";
              LargeBubbleContainer.style.height = "100%";
              LargeBubbleContainer.style.bottom = "0px";
              LargeBubbleContainer.style.borderRadius = "0px";
              LargeBubbleContainer.style.right = "0px";
              LargeBubbleContainer.style.left = "0px";
              if (data.data.bubble_position == "Right") {
                LargeBubbleContainer.style.right = "0px";
                $(LargeBubbleContainer).css("left", "");
              } else if (data.data.bubble_position == "Left") {
                LargeBubbleContainer.style.left = "0px";
                $(LargeBubbleContainer).css("right", "");
              }
            } else {
              LargeBubbleContainer.style.width = "400px";
              LargeBubbleContainer.style.height = "80vh";
              LargeBubbleContainer.style.borderRadius = "10px";

              LargeBubbleContainer.style.bottom = "10px";

              if (data.data.bubble_position == "Right") {
                LargeBubbleContainer.style.right = "10px";
                $(LargeBubbleContainer).css("left", "");
              } else if (data.data.bubble_position == "Left") {
                LargeBubbleContainer.style.left = "10px";
                $(LargeBubbleContainer).css("right", "");
              }
            }
          });
          //--------------------------------------------------------------------------//
          var time = new Date();
          var FakeDate = time.toISOString();

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
                  data.data
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
                                                ${data.data.bubble_name}
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
                <script type="text/javascript" src="http://localhost:5000/jquery-3.5.1.min.js"></script>
                <script type="application/javascript" src="http://localhost:5000/popper.min.js"></script>
                <script type="application/javascript" src="http://localhost:5000/bootstrap.min.js"></script>
                <script type="application/javascript" src="http://localhost:5000/fontawesome.js"></script>
                <script src="https://completegreet.com/socket.io/socket.io.js"></script>
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
                <script type="application/javascript" src="http://localhost:5000/LargeBubbleContainerIframe.js"></script>
            </body>
        </html> `;

          document.body.appendChild(LargeBubbleContainer);
          LargeBubbleContainer.contentWindow.document.open();
          LargeBubbleContainer.contentWindow.document.write(
            LargeBubbleContainerhtml
          );
          LargeBubbleContainer.contentWindow.document.close();
          LargeBubbleContainer.setAttribute("id", "LContainer");

          var Large_Bubble_Container =
            LargeBubbleContainer.contentWindow.document.getElementsByClassName(
              "Bubble-large-container"
            );
          // $(Large_Bubble_Container).attr("data-bubbleinfo",JSON.stringify(data.Bubble))
          // $(Large_Bubble_Container).attr("data-notisound",data.NotificationSound)
          //---------------------------------------------------------------------//

          //-------- Bubble Frame --------//
          var BubbleFrame = document.createElement("iframe");
          BubbleFrame.src = "about:blank";
          var Styles =
            "transition: all .5s ease-in-out;border-radius:10px;overflow:hidden;position:fixed;bottom:-10px;right:-10px;border:none;width:400px;height:80vh;z-index:10000;";
          $(BubbleFrame).addClass("invisible");

          $(BubbleFrame).on({
            mouseenter: function () {
              $(this).css("transition", "all .2s ease-in-out");
              $(this).css("transform", "scale(1.03)");
            },
            mouseleave: function () {
              $(this).css("transform", "scale(1)");
            },
          });
          BubbleFrame.style = Styles;
          if (data.data.bubble_style == "Circle") {
            BubbleFrame.style = Styles +"border-radius:50%;width:" +(data.data.bubble_size + 80) +"px;height:" + (data.data.bubble_size + 80) + "px;";
          } else if (data.data.bubble_style == "Rectangle") {
            
            BubbleFrame.style = Styles+"border-radius:10px;width:"+(data.data.bubble_size + 140)+"px;height:"+(data.data.bubble_size * 1.5 + 140) +"px;";
          }
          if (data.data.bubble_position == "Right") {
          } else if (data.data.bubble_position == "Left") {
            BubbleFrame.style.left = "-10px";
            LargeBubbleContainer.style.left = "10px";
            if (window.matchMedia("(max-width: 410px)").matches) {
              LargeBubbleContainer.style.left = "0px";
            }
          }
          if (data.data.bubble_animation == "Left-to-right") {
            BubbleFrame.style.transform = "translateX(-1500%)";
            $(BubbleFrame).removeClass("invisible");

            setTimeout(function () {
              BubbleFrame.style.transform = "translateX(0%)";
            }, (data.data.bubble_delay + 0.5) * 1500);
          } else if (data.data.bubble_animation == "Top-to-bottom") {
            BubbleFrame.style.transform = "translateY(-1000%)";
            $(BubbleFrame).removeClass("invisible");

            setTimeout(function () {
              BubbleFrame.style.transform = "translateY(0%)";
            }, (data.data.bubble_delay + 0.5) * 1500);
          } else if (data.data.bubble_animation == "Right-to-left") {
            BubbleFrame.style.transform = "translateX(1500%)";
            $(BubbleFrame).removeClass("invisible");

            setTimeout(function () {
              BubbleFrame.style.transform = "translateX(0%)";
            }, (data.data.bubble_delay + 0.5) * 1500);
          } else if (data.data.bubble_animation == "No-Animation") {
            $(BubbleFrame).removeClass("invisible");
            $(BubbleFrame).css("opacity", 0);

            setTimeout(function () {
              $(BubbleFrame).css("opacity", 1);
            }, (data.data.bubble_delay + 0.5) * 1500);
          }
          // '                                                <img style="opacity: 1; border-radius: 0px" class="video-content  w-100 h-100" src="https://completegreet.com/files/users/'+data.Bubble.UserId+'/Bubble-Videos/'+data.Bubble.BubbleGif+'">\n' +
          // '                                                <video class="video-content  w-100 h-100" autoplay loop id="video-bubble" muted src=""></video>\n' +

          if (data.is_deleted !== 1) {
            
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
            <video style="opacity: 1; border-radius: 0px" class="video-content  w-100 h-100" src="http://localhost:5000/files/users/${data.data.user_id}/Bubble-Videos/${data.data.bubble_video}"></video>
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
<script type="text/javascript" src="http://localhost:5000/jquery-3.5.1.min.js"></script>
<script type="application/javascript" src="hhttp://localhost:5000/popper.min.js"></script>
<script type="application/javascript" src="http://localhost:5000/bootstrap.min.js"></script>
<script type="application/javascript" src="http://localhost:5000/fontawesome.js"></script>
<script type="application/javascript" src="http://localhost:5000/BubbleIframe.js"></script>



</body>
</html>`;
          } else if (data.is_deleted === 0) {
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
                      <img style="opacity: 1; border-radius: 0px" class="video-content  w-100 h-100" src="http://localhost:5000/files/users/${data.data.user_id}/Bubble-Videos/${data.data.bubble_video}">
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
                <script type="text/javascript" src="http://localhost:5000/jquery-3.5.1.min.js"></script>
                <script type="application/javascript" src="http://localhost:5000/popper.min.js"></script>
                <script type="application/javascript" src="http://localhost:5000/bootstrap.min.js"></script>
                <script type="application/javascript" src="http://localhost:5000/fontawesome.js"></script>
                <script type="application/javascript" src="http://localhost:5000/Sidebar.js"></script>
                <script type="application/javascript" src="http://localhost:5000/BubbleIframe.js"></script>
              </body>
            </html>
          `;
          }
          document.body.appendChild(BubbleFrame);

          BubbleFrame.contentWindow.document.open();
          BubbleFrame.contentWindow.document.write(BubbleFramehtml);
          BubbleFrame.contentWindow.document.close();
          //----------- Toggling Large Bubble ----------------------//
          var video1 =
            LargeBubbleContainer.contentWindow.document.getElementById(
              "Large-container-video"
            );
          var Step1 =
            LargeBubbleContainer.contentWindow.document.getElementsByClassName(
              "Step-1"
            );

          var Bubble_Body =
            BubbleFrame.contentWindow.document.getElementById("Bubble-Body");
          $(Bubble_Body).attr("data-bubbleinfo", JSON.stringify(data.data));
          $(Bubble_Body).on("click", function (e) {
            e.preventDefault();
            $(LargeBubbleContainer).css("transform", "translateY(0%)");
            if ($(Step1).hasClass("go-left")) {
            } else {
              video1.play();
            }
          });
          var LargeContainerExit_btn =
            LargeBubbleContainer.contentWindow.document.getElementsByClassName(
              "exit-btn"
            );
          for (var i = 0; i < LargeContainerExit_btn.length; i++) {
            LargeContainerExit_btn[i].addEventListener("click", function () {
              $(LargeBubbleContainer).css(
                "transform",
                "translateY(calc(100% + 15px))"
              );
            });
          }
          var test = LargeBubbleContainer.contentWindow.document;
          $(test).on("click", ".exit-btn", function () {
            $(LargeBubbleContainer).css(
              "transform",
              "translateY(calc(100% + 15px))"
            );
          });
          $(document).on("keyup", function (e) {
            if (e.key === "Escape" || e.keyCode === 27 || e.keyCode === "Esc") {
              $(LargeContainerExit_btn).click();
            }
          });
          $(LargeBubbleContainer.contentWindow.document).on(
            "keyup",
            function (e) {
              if (
                e.key === "Escape" ||
                e.keyCode === 27 ||
                e.keyCode === "Esc"
              ) {
                $(LargeContainerExit_btn).click();
              }
            }
          );
          $(BubbleFrame.contentWindow.document).on("keyup", function (e) {
            if (e.key === "Escape" || e.keyCode === 27 || e.keyCode === "Esc") {
              $(LargeContainerExit_btn).click();
            }
          });

          //-------------- Adding Close btn -------------------//
          var Close_Btn =
            BubbleFrame.contentWindow.document.getElementById("close-frame");

          if (data.data.bubble_style == "Circle") {
            $(Close_Btn).css(
              "right",
              15 +
                data.data.bubble_size / 2 -
                (Math.sqrt(2) * data.data.bubble_size) / 4 -
                10
            );
            $(Close_Btn).css(
              "top",
              15 +
                data.data.bubble_size / 2 -
                (Math.sqrt(2) * data.data.bubble_size) / 4 -
                10
            );
            // $(Close_Btn).css('right',(20+data.Bubble.BubbleSize/2)-(Math.sqrt(3)*data.Bubble.BubbleSize/4)-10)
            //                        $(Close_Btn).css('top',(20+data.Bubble.BubbleSize/2)-(0.5*data.Bubble.BubbleSize/2)-10)
          }
          //------------------ Removing Bubbles if Closed -------------------//
          $(Close_Btn).on("click", function () {
            $(BubbleFrame).remove();
            $(LargeBubbleContainer).remove();
          });
          $(LargeBubbleContainer).attr("crossorigin", "anonymous");
        } else if (data.error == true) {
          console.log(data.message);
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
        alert("fail in Catch");
      },
    });
  });
}
