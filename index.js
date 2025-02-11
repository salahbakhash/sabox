import { SaBox } from "@sabox";

$.ajax({
  url: window.location.href + `/store`,
  method: "GET",
}).done((response) => {
  let res = JSON.parse(response);

  let chat1 = new SaBox("#mycustomchat1", {
    // storeURL: window.location.href + "/store", // store messages end-point
    position: 2, // 1 => fixed | 2 => static
    geminiEndPoint: window.location.href + "/gemini",
    messages: res || [],
  });

  chat1.on("message", function (user, msg) {
    console.log(msg);
  });

  chat1.on("message:received", function (el, msg) {
    console.log("chat", el, msg);
  });
  chat1.on("message:sent", function (el, msg) {
    console.log("me", el, msg);
  });
});
