const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const nodeMailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({
    message: "SUCCESS",
  });
});

app.post("/", async (req, res) => {
  const { name, phone, items } = req.body;

  let itemsText = items.map(
    (item) =>
      `<p>${item.name} ${item.color} ${item.selected} ${item.count}шт - общая цена ${item.price} рублей</p>`
  );

  itemsText = itemsText.join(" \n");

  let transporter = nodeMailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_LOGIN, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  // const strItems = items.map((item) => `<h3>${item.name} ${item.selected} ${item.count}шт на сумму ${item.price}</h3>`).join("<br>");

  let mailOptions = {
    from: process.env.EMAIL_LOGIN, // sender address
    to: process.env.EMAIL_TO, // list of receivers
    subject: `НОВАЯ ЗАЯВКА С САЙТА ОТ ${phone}`, // Subject line
    text: `${name}, ${phone}`, // plain text body
    html: `
    <h1>${name} заказал:</h1>
    ${itemsText}
    <h1>Его номер телефона: ${phone}</h1>
    `,
  };

  transporter.sendMail(mailOptions, (err, res) => {
    if (err) {
      console.log(err);
    }
    transporter.close();
  });
  res.json({
    message: "OK",
  });
});

app.listen(port, () => console.log("STARTED"));
