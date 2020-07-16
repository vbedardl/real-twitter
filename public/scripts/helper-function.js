export const charCounter = function(){
  $('.counter').text(() => 140 - this.value.length)
  if(this.value.length>140){
    $('.counter').css('color','red')
  }else{
    $('.counter').css('color','black')
  }
}
// $(document).ready(function() {
//   $("textarea#tweet-text").on('keydown', function(){
//     $('.counter').text(() => 140 - this.value.length)
//     if(this.value.length>140){
//       $('.counter').css('color','red')
//     }else{
//       $('.counter').css('color','black')
//     }
//   })
// })

$("textarea#tweet-text").on('keydown', charCounter)
