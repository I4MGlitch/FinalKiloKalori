require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const parser = require('body-parser');
const compression = require('compression');
const multer = require('multer');
const jwt = require("jsonwebtoken");

const admins = require('./schemas/admin')
const article = require('./schemas/article')
const bentocake = require('./schemas/bentocake')
const donut = require('./schemas/donut')
const image = require('./schemas/image')
const tiramisu = require('./schemas/tiramisu')
const website = require('./schemas/website')
const wholecake = require('./schemas/wholecake')
const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();
app.use(cors());
app.use(compression());
app.use(parser.json({ limit: '50mb' }));

const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected to database: KiloKalori'))
  .catch((err) => console.error('MongoDB connection error:', err));

const { v2: cloudinary } = require("cloudinary");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.post("/images", upload.single("image"), async (req, res) => {
  try {
    const { category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = req.file.originalname; // Get file name

    // Upload image to Cloudinary
    cloudinary.uploader.upload_stream({ folder: "Products" }, async (error, uploadResult) => {
      if (error) return res.status(500).json({ message: "Cloudinary upload failed", error });

      // Save image details to MongoDB
      const newImage = new image({
        name: fileName, 
        category,
        imageUrl: uploadResult.secure_url,
      });

      await newImage.save();
      res.status(201).json({ message: "Image uploaded successfully", data: newImage });
    }).end(req.file.buffer);

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;


  const foundAdmin = await admins.findOne({ username });
  if (!foundAdmin) {
    return res.status(400).json({ message: 'Access restricted to admins only' });
  }


  if (foundAdmin.password !== password) {
    return res.status(400).json({ message: 'Invalid admin password credentials' });
  }

  const token = jwt.sign(
    {
      id: foundAdmin._id,
      username: foundAdmin.username,
      email: foundAdmin.email,
      role: 'admin'
    },
    'Secret',
    { expiresIn: '1h' }
  );

  res.json({ token });
});

app.get('/articles', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.max(1, parseInt(req.query.pageSize) || 6);
    const total = await article.countDocuments();

    // Use the _id field to sort (implicitly sorts by creation date as well)
    const articles = await article.find()
      .sort({ _id: -1 })  // Sort by _id in descending order (newest first)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({ articles, total, totalPages: Math.ceil(total / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.post("/articles", upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Ensure `description` is always an array
    let descriptionArray;
    try {
      descriptionArray = JSON.parse(description); // Convert JSON string to array
      if (!Array.isArray(descriptionArray)) {
        throw new Error("Invalid format"); // If not an array, throw error
      }
    } catch (e) {
      descriptionArray = description.split("\n").filter(line => line.trim() !== "");
    }

    cloudinary.uploader.upload_stream({ folder: "Articles" }, async (error, uploadResult) => {
      if (error) return res.status(500).json({ message: "Cloudinary upload failed", error });

      const newArticle = new article({
        title,
        description: descriptionArray, // Ensure stored as array
        imageUrl: uploadResult.secure_url,
      });

      await newArticle.save();
      res.status(201).json(newArticle);
    }).end(req.file.buffer);

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.get('/articles/latest', async (req, res) => {
  try {
    const articles = await article.find().sort({ _id: -1 }).limit(3);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/articles/all', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.max(1, parseInt(req.query.pageSize) || 100);
    const total = await article.countDocuments();

    const articles = await article.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({ articles, total, totalPages: Math.ceil(total / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/articles/:id', async (req, res) => {
  try {
    const singleArticle = await article.findById(req.params.id);
    if (!singleArticle) return res.status(404).json({ message: 'Article not found' });
    res.json(singleArticle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/articles/:id', async (req, res) => {
  try {
    const articles = await article.findById(req.params.id);
    if (!articles) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    const imageUrl = articles.imageUrl;
    const publicId = imageUrl.split('/').pop().split('.')[0];
   
    await cloudinary.uploader.destroy(publicId);

    await article.findByIdAndDelete(req.params.id);

    res.json({ message: 'Article and image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting article', error });
  }
});

app.post('/bentocakes', async (req, res) => {
  try {
    const { flavor, price, size, category } = req.body;
    const newBentoCake = new bentocake({ flavor, price, size, category });
    await newBentoCake.save();
    res.status(201).json(newBentoCake);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/bentocakes/:id', async (req, res) => {
  try {
    const bentoCake = await bentocake.findById(req.params.id);
    if (!bentoCake) return res.status(404).json({ message: 'Bento cake not found' });
    res.json(bentoCake);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/bentocakes', async (req, res) => {
  try {
    const bentoCakes = await bentocake.find();
    res.json(bentoCakes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/bentocakes/latest', async (req, res) => {
  try {
    const bentoCakes = await bentocake.find().sort({ _id: -1 }).limit(3);
    res.json(bentoCakes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/bentocakes/:id', async (req, res) => {
  try {
    const deletedBentoCake = await bentocake.findByIdAndDelete(req.params.id);
    if (!deletedBentoCake) return res.status(404).json({ message: 'Bento cake not found' });
    res.json({ message: 'Bento cake deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/donuts', async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const newDonut = new donut({ name, price, category });
    await newDonut.save();
    res.status(201).json(newDonut);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/donuts/:id', async (req, res) => {
  try {
    const donut = await donut.findById(req.params.id);
    if (!donut) return res.status(404).json({ message: 'Donut not found' });
    res.json(donut);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/donuts', async (req, res) => {
  try {
    const donuts = await donut.find();
    res.json(donuts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/donuts/latest', async (req, res) => {
  try {
    const donuts = await donut.find().sort({ _id: -1 }).limit(3);
    res.json(donuts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/donuts/:id', async (req, res) => {
  try {
    const deletedDonut = await donut.findByIdAndDelete(req.params.id);
    if (!deletedDonut) return res.status(404).json({ message: 'Donut not found' });
    res.json({ message: 'Donut deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/images/:id', async (req, res) => {
  try {
    const image = await image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/images', async (req, res) => {
  try {
    const images = await image.find();
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/images/latest/wholecake', async (req, res) => {
  try {
    const images = await image.find({ category: 'Whole Cake' }).sort({ _id: -1 }).limit(6);
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/images/latest/bentocake', async (req, res) => {
  try {
    const images = await image.find({ category: 'Bento Cake' }).sort({ _id: -1 }).limit(6);
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/images/latest/donut', async (req, res) => {
  try {
    const images = await image.find({ category: 'Donut' }).sort({ _id: -1 }).limit(6);
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/images/latest/tiramisu', async (req, res) => {
  try {
    const images = await image.find({ category: 'Tiramisu' }).sort({ _id: -1 }).limit(6);
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/images/all/wholecake', async (req, res) => {
  try {
    const images = await image.find({ category: 'Whole Cake' }).sort({ _id: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/images/all/bentocake', async (req, res) => {
  try {
    const images = await image.find({ category: 'Bento Cake' }).sort({ _id: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/images/all/donut', async (req, res) => {
  try {
    const images = await image.find({ category: 'Donut' }).sort({ _id: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/images/all/tiramisu', async (req, res) => {
  try {
    const images = await image.find({ category: 'Tiramisu' }).sort({ _id: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.delete('/images/:id', async (req, res) => {
  try {
    // Find the image in MongoDB
    const deletedImage = await image.findById(req.params.id);
    if (!deletedImage) return res.status(404).json({ message: 'Image not found' });

    // Extract Cloudinary public ID from image URL
    const imageUrl = deletedImage.imageUrl; 
    const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract ID before file extension

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Delete the image document from MongoDB
    await image.findByIdAndDelete(req.params.id);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Failed to delete image' });
  }
});

app.post('/tiramisu', async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const newTiramisu = new tiramisu({ name, price, category });
    await newTiramisu.save();
    res.status(201).json(newTiramisu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/tiramisu/:id', async (req, res) => {
  try {
    const tiramisu = await tiramisu.findById(req.params.id);
    if (!tiramisu) return res.status(404).json({ message: 'Tiramisu not found' });
    res.json(tiramisu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/tiramisu', async (req, res) => {
  try {
    const tiramisus = await tiramisu.find();
    res.json(tiramisus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/tiramisu/latest', async (req, res) => {
  try {
    const tiramisus = await tiramisu.find().sort({ _id: -1 }).limit(3);
    res.json(tiramisus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/tiramisu/:id', async (req, res) => {
  try {
    const deletedTiramisu = await tiramisu.findByIdAndDelete(req.params.id);
    if (!deletedTiramisu) return res.status(404).json({ message: 'Tiramisu not found' });
    res.json({ message: 'Tiramisu deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/website', async (req, res) => {
  try {
    const newwebsite = await website.findOne();
    res.json(newwebsite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/website', async (req, res) => {
  try {
    const { aboutus, whatsapp, alamat, linkmap, facebook, instagram, tiktok } = req.body;

    // Find the existing website data
    let newwebsite = await website.findOne();

    // If data doesn't exist, create new one
    if (!newwebsite) {
      newwebsite = new website({
        aboutus,
        whatsapp,
        alamat,
        linkmap,
        facebook,
        instagram,
        tiktok
      });
    } else {
      // If it exists, update only the fields that are passed
      if (aboutus) newwebsite.aboutus = aboutus;
      if (whatsapp) newwebsite.whatsapp = whatsapp;
      if (alamat) newwebsite.alamat = alamat;
      if (linkmap) newwebsite.linkmap = linkmap;
      if (facebook) newwebsite.facebook = facebook;
      if (instagram) newwebsite.instagram = instagram;
      if (tiktok) newwebsite.tiktok = tiktok;
    }

    // Save the updated website data
    await newwebsite.save();
    res.json(newwebsite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/wholecake', async (req, res) => {
  try {
    const { flavor, price, size, category } = req.body;
    const newWholecake = new wholecake({ flavor, price, size, category });
    await newWholecake.save();
    res.status(201).json(newWholecake);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/wholecake/:id', async (req, res) => {
  try {
    const wholecake = await wholecake.findById(req.params.id);
    if (!wholecake) return res.status(404).json({ message: 'Wholecake not found' });
    res.json(wholecake);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/wholecake', async (req, res) => {
  try {
    const wholecakes = await wholecake.find();
    res.json(wholecakes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/wholecake/latest', async (req, res) => {
  try {
    const wholecakes = await wholecake.find().sort({ _id: -1 }).limit(3);
    res.json(wholecakes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/wholecake/:id', async (req, res) => {
  try {
    const deletedWholecake = await wholecake.findByIdAndDelete(req.params.id);
    if (!deletedWholecake) return res.status(404).json({ message: 'Wholecake not found' });
    res.json({ message: 'Wholecake deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});