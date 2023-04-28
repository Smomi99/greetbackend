$(document).ready(function() {


    $("#Bubble-Body").on('click',function (){

    })

    var Bubble=$("#Bubble-Body").data("bubbleinfo")

//------------- Adding Current Bubble Styles ------------//
    $(".Bubble-Inner-Title").text(Bubble.bubble_title)
    //------------------------------//
    $(".Bubble-Inner-Title").css('font-size',Bubble.bubble_font_size+'px')
    //-----------------------------------//
    if (Bubble.bubble_style=='Circle'){
        $("#Bubble-Body").css('width',Bubble.bubble_size+'px')
        $("#Bubble-Body").css('height',Bubble.bubble_size+'px')
    }else if(Bubble.bubble_style=='Rectangle'){
        
        $("#Bubble-Body").css('width',Bubble.bubble_size+'px')
        $("#Bubble-Body").css('height',Bubble.bubble_size*1.5+'px')
    }
    //----------------------------------//
    if (Bubble.BubbleBorderColor.length==9&&Bubble.BubbleBorderColor.slice(-2)=="00"){
        if (Bubble.bubble_style=='Circle'){
            $("#Bubble-Body").css('width',(Bubble.bubble_size-6)+'px')
            $("#Bubble-Body").css('height',(Bubble.bubble_size-6)+'px')
        }else if(Bubble.bubble_style=='Rectangle'){
            $("#Bubble-Body").css('width',(Bubble.bubble_size-6)+'px')
            $("#Bubble-Body").css('height',(Bubble.bubble_size*1.5-6)+'px')
        }
        $("#Bubble-Body").css('border',"0px")

    }else {
        $("#Bubble-Body").css('border-color',Bubble.bubble_border_color)

    }
    //--------------------------------------------//

    //------------------------------------//
    $(".Bubble-Inner-Title").css('font-family',Bubble.bubble_font_family)



//---------------------------------------//
    if(Bubble.BubbleDarken) {
        $(".Bubble-Video-Overlay").css('background-color','rgba(0,0,0,0.5)')

    }else {
        $(".Bubble-Video-Overlay").css('background-color','transparent')

    }
//-------------------------------------//
    if(Bubble.bubble_style=='Circle') {

        $("#Bubble-Body").css('border-radius','50%')

    }else if (Bubble.bubble_style=='Rectangle'){

        $("#Bubble-Body").css('border-radius','10px')
    }
    //-------------------------------------//
    if(Bubble.bubble_position=='Right') {
        // $(".Bubble-large-container").css('right','0px')
        // $(".Bubble-large-container").css('left','auto')
        //
        // $("#Bubble-Body").removeClass('Move-Left')


    }else if (Bubble.bubble_position=='Left'){
        // $(".Bubble-large-container").css('right','auto')
        //
        // $(".Bubble-large-container").css('left','0px')
        //
        // $("#Bubble-Body").addClass('Move-Left')

    }
    //-------------------------------------------//
    // document.getElementById("video-bubble").src = 'https://completegreet.com/files/users/'+Bubble.UserId+'/Bubble-Videos/'+Bubble.BubbleVideo

 })