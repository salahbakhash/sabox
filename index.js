import { SaBox } from "@sabox";

$.ajax({
  url: `localhost/sabox`,
  method: "GET",
}).done((response) => {
  let res = JSON.parse(response);

  let chat = new SaBox("#mycustomchat", {
    position: 1, // 1 => fixed | 2 => static
    geminiApiKey: "AIzaSyA8CxPIZxSt3Wbz-PAV8WWM4dlesJyxKls",
    messages: [
      { user: 1, msg: "hi, how are you", status: "🔵" },
      { user: 2, msg: "please, let me alone, i will make you pay now salah" },
      { user: 1, msg: "ok, i just want to record a video bro", status: "🔵" },
      { user: 2, msg: "ok, speed up please" },
    ],
  });
});

let chat1 = new SaBox("#mycustomchat1", {
  position: 2, // 1 => fixed | 2 => static
  geminiApiKey: "AIzaSyA8CxPIZxSt3Wbz-PAV8WWM4dlesJyxKls",
  messages: [
    { user: 1, msg: "hi, how are you", status: "🔵" },
    { user: 2, msg: "please, let me alone, i will make you pay now salah" },
    { user: 1, msg: "ok, i just want to record a video bro", status: "🔵" },
    { user: 2, msg: "ok, speed up please" },
  ],
});

// $("#chat_first_screen").click(function (e) {
//   hideChat(1);
// });

// $("#chat_second_screen").click(function (e) {
//   hideChat(2);
// });

// $("#chat_third_screen").click(function (e) {
//   hideChat(3);
// });

// $("#chat_fourth_screen").click(function (e) {
//   hideChat(4);
// });

// $("#chat_fullscreen_loader").click(function (e) {
//   $(".fullscreen").toggleClass("zmdi-window-maximize");
//   $(".fullscreen").toggleClass("zmdi-window-restore");
//   $(".chat").toggleClass("chat_fullscreen");
//   $(".fab").toggleClass("is-hide");
//   $(".img_container").toggleClass("change_img");
//   $(".chat_header").toggleClass("chat_header2");
//   $(".fab_field").toggleClass("fab_field2");
//   $(".chat_converse").toggleClass("chat_converse2");
// });

// $("#chat_message_form1").on("submit", function (e) {
//   e.preventDefault();
//   if ($("#chatSend1").val() != "") {
//     $("#chat_converse1").append(
//       `<span class="chat_msg_item chat_msg_item_user">${$(
//         "#chatSend1"
//       ).val()}</span>`
//     );
//     $("#chatSend1").val("");
//   }
// });

// $("#chat_message_form").on("submit", function (e) {
//   e.preventDefault();
//   if ($("#chatSend").val() != "") {
//     $("#chat_converse").append(
//       `<span class="chat_msg_item chat_msg_item_user">${$(
//         "#chatSend"
//       ).val()}</span>`
//     );
//     $("#chatSend").val("");
//   }
// });
