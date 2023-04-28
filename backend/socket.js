const knex = require("./db/db");
const { sendMail } = require("./helpers/mail");

module.exports = function (io) {
  function convertDate(date) {
    const split = date.toISOString().split("T");
    return split[0] + " " + split[1].slice(0, -2);
  }
  // socket connection
  io.on("connection", function (socket) {
    socket.removeAllListeners("new chat");
    console.log(`⚡: ${socket.id} user just connected`);
    socket.emit("greeting-from-server", {
      greeting: "Hello Client",
    });
    socket.on("greeting-from-client", function (message) {
      console.log(message);
    });

    //Whenever someone disconnects this piece of code executed
    socket.on("disconnect", function () {
      console.log("A user disconnected", socket.id);
    });

    socket.on("message", (data) => {
      //sends the data to everyone except you.
      socket.broadcast.emit("response", data);

      //sends the data to everyone connected to the server
      // socket.emit("response", data)
    });

    const allClients = [];
    socket.on("new connection", (ClientChatCode, UserId, ClientEmail) => {
      let index = allClients.findIndex((x) => x.chat_code == ClientChatCode);
      if (index == -1) {
        allClients.push({
          socket_id: socket.id,
          chat_code: ClientChatCode,
          user_id: UserId,
          client_email: ClientEmail,
          date_connect: convertDate(new Date()),
        });
      }
    });

    socket.on("new chat", async (msg, IPAddress, City, Country) => {
      let chat = await knex("Chats")
        .where({ chat_cookie_id: msg.cookie_id, bubble_id: msg.bubble_id })
        .first()
        .orderBy("id", "desc");
      const user = await knex("Users")
        .where({ id: msg.receiver_id })
        .first()
        .orderBy("id", "desc");

      if (!chat) {
        //------------------ Sending Email to User ----------//
        var html2 = "";
        var mailOptions = {
          from: '"Complete Greet" <contact@completegreet.com>',
          to: user.email,
          subject: "New Message",
          text: "You Can Reset Your Password by Clicking the Following ",
          html: html2,
        };

        const mailInfo = await sendMail(mailOptions);
        // console.log(
        //   "🚀 ~ file: userController.js:164 ~ module.exports.forgotPassword=asyncHandler ~ mailInfo:",
        //   mailInfo
        // );
        if (!mailInfo) {
          return res.status(400).json({
            error: true,
            message: "Mail send failed.",
            data: null,
          });
        }
        const ChatCode = msg.chat_code;
        const subscriber = await knex("Subscribers")
          .where({ user_id: msg.receiver_id, is_active: 1, is_finished: 0 })
          .first()
          .orderBy("id", "desc");

        // ,BubbleID:msg.BubbleID
        //----- Creating Chat if not Existed ----//
        const createChat = await knex("Chats").insert({
          chat_cookie_id: msg.cookie_id,
          bubble_id: msg.bubble_id,
          client_name: msg.sender_name,
          client_ip_address: IPAddress,
          client_city: City,
          client_country: Country,
          chat_code: msg.chat_code,
          client_email: msg.sender_email,
          hoster_id: msg.receiver_id,
          chat_date: msg.date,
          new_chat: 1,
          subscriber_id: subscriber.id,
        });
        if (createChat) {
          chat = await knex("Chats")
            .where({ chat_cookie_id: msg.cookie_id, bubble_id: msg.bubble_id })
            .first()
            .orderBy("id", "desc");
          const bubble = await knex("Bubbles")
            .where({ id: msg.bubble_id })
            .first()
            .orderBy("id", "desc");

          //------------- Sending First Message --------//
          if (
            bubble.bubble_greet_msg.replace(/\s/g, "").length &&
            bubble.bubble_greet_msg != null &&
            bubble.bubble_greet_msg != ""
          ) {
            setTimeout(async function () {
              const createMessage = await knex("Messages").insert({
                sender_id: chat.hoster_id,
                time: convertDate(new Date()),
                content: bubble.bubble_greet_msg,
                user_id: chat.hoster_id,
                receiver_id: chat.client_email,
                chat_id: chat.id,
                bubble_id: chat.bubble_id,
                chat_code: chat.chat_code,
                is_read: 0,
              });
              if (createMessage) {
                const currentUser = await knex("Users")
                  .where({ id: msg.receiver_id })
                  .first()
                  .orderBy("id", "desc");

                const message = await knex("Messages")
                  .where({ chat_id: chat.id, bubble_id: chat.bubble_id })
                  .first()
                  .orderBy("id", "desc");
                const ImageURL = currentUser.Image;
                io.emit(ChatCode, message, chat, ImageURL);
              }
            }, bubble.BubbleFirstMessageDelay * 1000);
          }
          // console.log("cccc", chat);
          //--------------------------------------------//
          socket.on(chat.chat_code, async (msg) => {
            // socket.removeAllListeners(chat.chat_code);
console.log('checkkkk',msg);
console.log('chat',chat);
            const createMessage = await knex("Messages").insert({
              sender_id: msg.SenderID,
              time: convertDate(new Date()),
              content: msg.text,
              user_id: msg.UserId,
              receiver_id: chat.client_email,
              chat_id: chat.id,
              bubble_id: msg.BubbleID,
              chat_code: msg.ChatCode,
              is_read: 0,
            });
            if (createMessage) {

              const message = await knex("Messages")
                .where({ chat_id: chat.id, bubble_id: chat.bubble_id })
                .first()
                .orderBy("id", "desc");
              // const chat = await knex("Chats")
              //   .where({ id: msg.chat_id })
              //   .first()
              //   .orderBy("id", "desc");
              chat.chat_date = convertDate(new Date());
              await knex("Chats")
                .update({ chat_date: convertDate(new Date()) })
                .where({ id: message.chat_id });
                
              if (message.sender_id == message.user_id) {
                let allmessages = await knex("Messages").where({
                  chat_id: message.chat_id,
                  user_id: message.sender_id,
                });
                allmessages.forEach(function (msg) {
                  msg.is_read = 1;
                });
                await knex("Messages").update({ is_read: 1 }).where({
                  chat_id: message.chat_id,
                  user_id: message.sender_id,
                });
              }

              let CurrentUser = await knex("Users")
                .where({ id: message.user_id })
                .first()
                .orderBy("id", "desc");
              const ImageURL = CurrentUser.Image;

              io.emit(chat.chat_code, message, chat, ImageURL);
            }
          });
          console.log("-------------", chat, msg);
          io.emit("new chat", chat, msg);

          socket.on(chat.chat_code + "UL", async (msg) => {
            io.emit(chat.chat_code + "ULURL", "getinfo");
          });
          socket.on(chat.chat_code + "ULURL", async (msg) => {
            io.emit(chat.chat_code + "UL", msg);
          });
        }
      }
    });
  });
};
