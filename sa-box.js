import { GoogleGenerativeAI } from "@google/generative-ai";
import "jquery";

export class SaBox {
  constructor(element, options) {
    this.target = $(element);
    this.avatar = "https://placehold.co/60x60/333/white?text=sa";

    if (options.avatar) {
      this.avatar = options.avatar;
    }

    this.chat = {
      messages: options.messages ?? [],
    };

    saBoxStructureCreation(this, options);

    let history = [];

    if (this.chat && this.chat.messages && this.chat.messages.length > 0) {
      this.chat.messages.forEach((msg) => {
        this.chatMessage(msg);
        history.push({
          role: msg.user == 1 ? "user" : "model",
          parts: msg.msg,
        });
      });
    }

    if (options.geminiApiKey) {
      this.geminiApiKey = options.geminiApiKey;
      // gemini stuff
      const genAI = new GoogleGenerativeAI(this.geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      this.gemini = model.startChat({
        history: history,
      });
    }
  }

  async addMessage(msg) {
    // uiانشاء الرسالة في ال
    let el = this.chatMessage(msg);

    if (this.chat && this.chat.messages) {
      // للرسالة htmlتعيين عنصر ال
      msg.element = el;
      // إدخال الرسالة في مصفوفة الرسائل للشات
      this.chat.messages.push(msg);
      // حفظ الرسالة في قاعدة البيانات
      this.storeMessage(msg);
    }

    if (msg.user == 1) {
      // كان المرسل هو المستخدم (أنا)
      // apiسيرسل الرسالة وينتظر الجواب من ال

      // api modelارسال الرسالة للجيميناي بإستخدام ال
      const result = await this.gemini.sendMessage(msg.msg);
      // تلقي الجواب
      const response = await result.response;
      // استخراج نص الجواب
      const text = response.text();

      // إضافة الرسالة الى مصفوفة الرسائل و الشات
      this.addMessage({
        user: 2,
        msg: text,
      });
    }
  }

  chatMessage(msg) {
    if (msg.user == 1) {
      let messageEL = $("<div/>", {
        class: "my_msg_holder",
        css: {
          display: "flex",
          flexDirection: "row-reverse",
          alignItems: "flex-end",
        },
      }).appendTo(this.chatBody);

      $("<div/>", {
        class: "chat_msg chat_msg_me",
        text: msg.msg,
      }).appendTo(messageEL);

      $("<span/>", {
        class: "msg-status",
        css: {
          float: "none",
          marginBottom: "0",
        },
        text: msg.status,
      }).appendTo(messageEL);

      if (this.messageInput != null) {
        $(this.messageInput).val("");
      }

      return messageEL;
    } else {
      let messageEl = $("<div/>", {
        class: "chat_msg chat_msg_user",
        css: {
          float: "none",
          marginBottom: "0",
        },
        text: msg.msg,
      }).appendTo(this.chatBody);

      let avatar = $("<div/>", { class: "chat_avatar" }).appendTo(messageEl);
      $("<img/>", { src: this.avatar }).appendTo(avatar);

      if (this.chat.messages) {
        for (let i = this.chat.messages.length; i--; i > 0) {
          if (this.chat.messages[i].user == 1) {
            if (this.chat.messages[i].status == "🟡") {
              this.chat.messages[i].status = "🔵";
              $(this.chat.messages[i].element).find(".msg-status").text("🔵");
            } else {
              break;
            }
          } else {
            break;
          }
        }
      }

      return messageEl;
    }
  }

  storeMessage(msg) {
    var settings = {
      url: `localhost/sabox/`,
      method: "POST",
      data: { message: JSON.stringify(msg) },
    };

    $.ajax(settings).done((response) => {
      let res = JSON.parse(response);
      if (!res) {
        console.error("this message did not stored:", res);
        $(msg.element).find(".msg-status").text("🔴");
      }
    });
  }
}

function saBoxStructureCreation(instance, options) {
  let settings = $.extend(
    {
      position: 1, // 1 => fixed, 2 => static
      type: "chating", // chating, options, info
      header: {
        title: "Username Or Title",
        subtitle: "Customer",
        status: "🔴",
      },
      chat: {
        messages: [],
      },
    },
    options
  );

  if (settings.position == 2) {
    instance.target.css({ position: "relative" });
  }

  let saboxEl;
  if (settings.position != 2) {
    saboxEl = $("<div/>", {
      class: settings.position != 2 ? "fabs position-fixed" : "fabs",
    }).appendTo(instance.target);
  }

  let MainBody = $("<div/>", {
    class: settings.position != 2 ? "chat position-fixed" : "chat chat-static",
    style:
      settings.position == 2 ? "opacity: 1;position: relative;inset:0" : "",
  }).appendTo(settings.position == 2 ? instance.target : saboxEl);

  let header = $("<div/>", {
    class: "chat_header",
  }).appendTo(MainBody);

  let headerOptions = $("<div/>", {
    class: "chat_option",
    css: {
      paddingRight: "15px",
      paddingLeft: "15px",
    },
  }).appendTo(header);

  $("<h5/>", {
    class: "title",
    css: {
      margin: 0,
      fontSize: "13px",
      fontFamily: "Roboto",
      fontWeight: "500",
      color: "#f3f3f3",
    },
    text: settings.header.title,
  }).appendTo(headerOptions);

  $("<span/>", {
    class: "header-subtitle",
    text: settings.header.subtitle,
  }).appendTo(headerOptions);

  $("<span/>", {
    class: "header-status",
    css: {
      color: " #dd5050",
      fontSize: "11px",
      fontWeight: "400",
    },
    text: settings.header.status,
  }).appendTo(headerOptions);

  if (settings.type == "options") {
    // other tabs or body slides
  } else if (settings.type == "info") {
    // other tabs or body slides
  } else {
    let chatBody = $("<div/>", {
      class:
        settings.position == 1
          ? "chat_box chat_body"
          : "chat_box chat_body d-block",
    }).appendTo(MainBody);
    instance.chatBody = chatBody;
  }

  let footer = $("<div/>", {
    class: "sabox_field",
  }).appendTo(MainBody);

  let footerForm = $("<form/>").appendTo(footer);
  instance.footerForm = footerForm;

  let uploadImageBtn = $("<button/>", { class: "fab is-visible" }).appendTo(
    footerForm
  );
  $("<i/>", { class: "zmdi zmdi-camera" }).appendTo(uploadImageBtn);

  let messageInput = $("<input/>", {
    placeholder: "Send a message",
    class: "chat_field chat_message",
  }).appendTo(footerForm);
  instance.messageInput = messageInput;

  let sendMsgBtn = $("<button/>", {
    type: "submit",
    class: "fab is-visible",
  }).appendTo(footerForm);
  $("<i/>", { class: "zmdi zmdi-mail-send" }).appendTo(sendMsgBtn);

  if (settings.position != 2) {
    let saboxMainBtn = $("<button/>", {
      class: "saboxBtn",
    })
      .appendTo(saboxEl)
      .on("click", function () {
        $(instance.target)
          .find(".mainbtnicon")
          .toggleClass("zmdi-comment-outline");
        $(instance.target).find(".mainbtnicon").toggleClass("zmdi-close");
        $(instance.target).find(".mainbtnicon").toggleClass("is-active");
        $(instance.target).find(".mainbtnicon").toggleClass("is-visible");
        $(instance.target).find(".chat").toggleClass("is-visible");
        $(instance.target).find(".fab").toggleClass("is-visible");
      });

    instance.mainBtn = saboxMainBtn;

    $("<i/>", {
      class: "mainbtnicon prime zmdi zmdi-comment-outline",
    }).appendTo(saboxMainBtn);

    $(instance.mainBtn).on("click", function () {
      $(instance).find(".prime").toggleClass("zmdi-comment-outline");
      $(instance).find(".prime").toggleClass("zmdi-close");
      $(instance).find(".prime").toggleClass("is-active");
      $(instance).find(".prime").toggleClass("is-visible");
      $(instance).find(".chat").toggleClass("is-visible");
      $(instance).find(".fab").toggleClass("is-visible");
    });
  }

  $(instance.footerForm).on("submit", function (e) {
    e.preventDefault();
    let newMsg = $(instance.messageInput).val();

    if (newMsg && newMsg != "") {
      instance.addMessage({ user: 1, msg: newMsg, status: "🟡" });
    }
  });
}
