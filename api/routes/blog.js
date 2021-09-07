const express = require('express')
const router = express.Router()
const blog = require('../model/blog')
const app = express()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { updateOne } = require('../model/blog')

app.use(express.json())

const uploadPath = path.join('static', blog.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png']
const storage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, uploadPath)
  },
  filename (req, res, cb) {
    cb(null, Date.now() + file.originalname)
  }
})
const upload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

router.get('/:url', getBlog, async (req, res) => {
//  res.Blog.views = res.Blog.views + 1
  try {
    const Bloger = await blog.updateOne({ url: req.params.url }, { $set: { views: res.Blog.views + 1 } })
    // blog.findOneAndUpdate({ url: req.params.url }, { $set: { blog.views: blog.vews + 1 } })
    res.Blog.save()
    res.json(res.Blog)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/:url', getBlog, async (req, res, next) => {
  await res.Blog.remove()
  next()
})

router.get('/', async function (req, res) {
  const pagination = 6
  const page = req.headers.page ? parseInt(req.headers.page) : 1
  const blogsCounts = await blog.countDocuments()
  const podschet = blogsCounts / pagination
  const blogsCount = parseInt(Math.ceil(podschet))
  try {
    const blogs = await blog.find()
      .select('_id h1 title introtext coverImageName url tag createdDate views')
      .sort('-createdDate')
      .skip((page - 1) * pagination)
      .limit(pagination)
      .lean()
      .exec()
    res.json(blogs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
router.patch('/:url', getBlog, async (req, res) => {
  res.Blog.h1 = req.body.h1,
  res.Blog.title = req.body.title,
  res.Blog.description = req.body.description,
  res.Blog.introtext = req.body.introtext,
  res.Blog.tag = req.body.tag,
  res.Blog.content = req.body.content,
  res.Blog.coverImageName = req.body.coverImageName
  try {
    const updatedBlog = res.Blog.save()
    await res.json(updatedBlog)
    // res.status(200).json({ message: "Страница обновлена" });
  } catch (err) {
    // res.status(400).json({ message: err.message });
    console.log(err.message)
  }
})

router.post('/:url/comment', getBlog, async (req, res, next) => {
  res.Blog.comments.push(req.body)
  try {
    
    const updatedBlog = res.Blog.save()
    await res.json(updatedBlog)
    // res.status(200).json({ message: "Страница обновлена" });
  } catch (err) {
    // res.status(400).json({ message: err.message });
    console.log(err.message)
  }
})

router.patch('/:url/comment', getBlog, async (req, res) => {
  for (const i in res.Blog.comments) {
    // console.log(res.Blog.comments[i]._id)
    // console.log(req.body.active + 'боди')
    if (res.Blog.comments[i]._id == req.body.active) {
      console.log('Совпадение')
      res.Blog.comments[i].active = true
    }
  }

  // console.log(req)
  // console.log(res.Blog.comments)
  try {
    const updatedBlog = res.Blog.save()
    await res.json(updatedBlog)
    // res.status(200).json({ message: "Страница обновлена" });
  } catch (err) {
    // res.status(400).json({ message: err.message });
    console.log(err.message)
  }
})

router.patch('/:url/comment/del', getBlog, async (req, res, next) => {
   for (const i in res.Blog.comments) {
    // console.log(res.Blog.comments[i]._id)
    // console.log(req.body.active + 'боди')
    if (res.Blog.comments[i]._id == req.body.active) {
      console.log(res.Blog.comments)
      res.Blog.comments.splice(i, 1)
    }
  }
  try {
    const updatedBlog = res.Blog.save()
    await res.json(updatedBlog)
    // res.status(200).json({ message: "Страница обновлена" });
  } catch (err) {
    // res.status(400).json({ message: err.message });
    console.log(err.message)
  }
})
/* router.post("/", upload.single('file'), async (req, res, next) => {
  const fileName = req.file != null ? req.file.filename : null;
   let Blog = new blog({
      h1: req.body.h1,
      title: req.body.title,
      description: req.body.description,
      introtext: req.body.introtext,
      url: req.body.url,
      tag: req.body.tag,
      content: req.body.content,
      coverImageName: fileName
  });
  try {
      const newBlog = Blog.save();
      await res.status(201).json(newBlog);
  } catch (err) {
      res.status(400).json({ message: err.message});
  }
}); */

/* router.get("/national-projects", async function(req, res) {
  try {

      const blogs2 = await blog.find()
      .select("_id h1 title introtext coverImageName url tag created_date")
      .sort("-created_date")
      .lean()
      .exec();
     res.json(blogs2);
     console.log(blogs2);
  } catch (err) {
      res.status(500).json({ message: err.message});
  }
}); */

async function getBlog (req, res, next) {
  let Blog
  try {
    // Ищем страницу по URL, который указан в строке запроса.
    Blog = await blog.findOne({ url: req.params.url }).exec()
    if (Blog === null) {
      // Возвращаем 404 ответ сервера, если страница не найдена.
      return res.status(404).json({ message: 'Страницы не существует' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  res.Blog = Blog
  next()
}

/* router.post("/", async (req, res, next) => {
     let Blog = new blog({
        h1: req.body.h1,
        title: req.body.title,
        description: req.body.description,
        url: req.body.url,
        introtext: req.body.introtext,
        tag: req.body.tag,
        content: req.body.content
    });
    try {
        const newBlog = Blog.save();
        await res.status(201).json(newBlog);
    } catch (err) {
        res.status(400).json({ message: err.message});
    }
}); */
module.exports = router
