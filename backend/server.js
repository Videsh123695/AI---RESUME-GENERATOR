const app=require('./src/app');
require('dotenv').config();
const connectToDB=require('./src/config/database')
// const invokeGeminiAi=require('./src/services/ai.service');
port=process.env.PORT
// const {resume, selfDescription , jobDescription}= require('./src/services/temp');
// const generateInterviewReport=require('./src/services/ai.service');
const dns=require('dns')
dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
])
connectToDB();
// invokeGeminiAi();
// generateInterviewReport({resume, selfDescription, jobDescription});

// console.log(process.env.NODE_ENV);


// app.get('/',(req,res)=>{
//     res.send("hello friends how are you : ")
// })
if (process.env.NODE_ENV !== "production") {

  const PORT = process.env.PORT || 2000;
    
  app.listen(PORT, () => {
    console.log(
      `Server running on http://localhost:${PORT}`
    );


  });
}

module.exports = app;


