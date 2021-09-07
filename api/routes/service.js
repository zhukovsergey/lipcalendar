const express = require("express");
const router = express.Router();
const {Nuxt, Builder} = require('nuxt');
const service = require("../model/service");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

app.use(express.json());

const uploadPath = path.join("static", service.coverImageBasePath);
const imageMimeTypes = ["image/jpeg", "image/png"];
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadPath);
    },
    originalname: function(req,res,cb) {
        cb(null,Date.now() + file.originalname);
    }
});
const upload = multer({
    storage : storage,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype));
    }
});

router.get('/', async function(req, res) {
    try {
        const services = await service.find().lean();
       res.json(services);
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
});

router.get("/:url", getService, (req, res) => {
    res.json(res.services);
  });
router.delete("/:url", getService, async (req, res) => {
    await services.remove();
})
  


  async function getService(req, res, next) {
    try {
      // Ищем страницу по URL, который указан в строке запроса.
      const page = await service.findOne({ url: req.params.url }).exec();      
      if (page === null) {
        // Возвращаем 404 ответ сервера, если страница не найдена.
        return res.status(404).json({ message: "Страницы не существует" });
      } else {
        // Передаём контент страницы, если URL найден.
        res.json(page);
        next();
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

module.exports = router ;

 