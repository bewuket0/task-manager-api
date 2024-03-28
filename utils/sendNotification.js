const Notification = require("../model/notificationModel");

const sendNotification = async ({ type, content, recipient }) => {
  const notification = await Notification.create({
    type,
    content,
    recipient,
  });

  //   console.log("notif == ", notification);

  return notification;
};

module.exports = sendNotification;
