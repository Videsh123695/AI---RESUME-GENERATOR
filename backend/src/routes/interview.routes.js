const express= require('express');
const authMiddleware=require('../middleware/auth.middleware')
const interviewRouter=express();
const interviewController=require('../controllers/interview.controller');
const upload=require('../middleware/file.middleware')

/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user 
 * self description , resume pdf and job description
 * @access private
 */

interviewRouter.post('/',authMiddleware.authUser, upload.single("resume"),  interviewController.generateInterviewReportController)

/**
 * @route POST /api/interview/report/:interviewId
 * @description generate interview report  by interviewId
 * self description , resume pdf and job description
 * @access private
 */

interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.generateInterviewReportByIdController)

/**
 * @route GET /api/interview/
 * @description get all existing  interview report  by interviewId for a logged in user
 * self description , resume pdf and job description
 * @access private
 */

interviewRouter.get('/', authMiddleware.authUser, interviewController.getAllInterviewReportsController);

/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf report  by interviewReportId on the basis of
 * self description , resume pdf and job description
 * @access private
 */

interviewRouter.post("/resume/pdf/:interviewReportId" , authMiddleware.authUser, interviewController.generateResumePdfController);



module.exports=interviewRouter;
