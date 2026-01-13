const express=require('express')
const mongoose=require('mongoose')
require('dotenv').config()
const cookieParser=require('cookie-parser')
const bodyParser=require('body-parser')
const cors=require('cors')
const path=require('path')

const authMiddleware=require('./middleware/authMiddleware')
const authRoutes=require('./routes/authRoutes')
const healthRecordRoutes=require('./routes/healthRecord');
const shareRoutes=require('./routes/Share');
const auditLogRoutes=require('./routes/auditLog');
const migrantRoutes=require('./routes/migrants');
const healthIDRoutes=require('./routes/healthids');

const app=express()

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
}

app.use(cookieParser())
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT=process.env.PORT||3000;
const MONGO_URL=process.env.MONGO_URL

mongoose.connect(MONGO_URL).then(()=>{
    console.log("Connected to MongoDB")
}).catch((err)=>{
    console.log("Error connecting to MongoDB:",err)
})

app.use('/api/auth',authRoutes);
app.use('/api/health-records',healthRecordRoutes);
app.use('/api/share',shareRoutes);
app.use('/api/audit',auditLogRoutes);
app.use('/api/migrants', migrantRoutes);
app.use("/api/healthids", healthIDRoutes);

try {
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.use(/(.*)/, (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }
} catch (error) {
  console.error("Error ", error.stack);
}

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})


