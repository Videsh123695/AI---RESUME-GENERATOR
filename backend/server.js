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

console.log(process.env.NODE_ENV);


app.get('/',(req,res)=>{
    res.send("hello friends how are you : ")
})


app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`)

})