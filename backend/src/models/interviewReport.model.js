const mongoose= require('mongoose');

/**
 * given by the user :String
 * - job description : String
 * - resume text: String
 * -self description
 * 
 * - MatchScore : Number
 * 
 * 
 *# geberated by the model 
 * - TEchnical questions :[{
 *              question:"",
 *              intention:"",
 *              answer:""
 *          }]
 * - Behavioral questions :[{
 *              question:"",
 *              intention:"",
 *              answer:""
 *          }]
 * -skill assesment results based on skill gap :[{skill :"", severity:{
 *          type:String,
 * enum:["low", "medium", "high"]}}]
 * - preperation plan :[{ day:Number,
 * focus:STring,
 * tasks:["String"] }]

 */


const technicalQuestionSchema= new mongoose.Schema({
    question:{
        type:String,
        required:[true, "Technucal question is required "]
    },
    intention:{
        type:String,
        required:[true, "Intention is required "]

    },
    answer:{
        type:String,
        required:[true, "Answer is required "]
    },  

},{
    _id:false
})



const behavioralQuestionSchema= mongoose.Schema({
    question:{
        type:String,
        required:[true, "Technucal question is required "]
    },
    intention:{
        type:String,
        required:[true, "Intention is required "]

    },
    answer:{
        type:String,
        required:[true, "Answer is required "]
    },  

},{
    _id:false
})

const skillGapSchema=new mongoose.Schema({
    skill:{
        type:String,
        required:[true, "skill is required "]
    },
    severity:{
        type:String,
        enum:["low","medium","high"],
        required:[true, "Severity is required "]
    }
},{
        _id:false
    });

    const preperationPlanSchema=mongoose.Schema({
        day:{
            type:Number,
            required:[true,"Day is required"],

        },
        focus:{
            type:String,
            required:[true,"Focus is required"]
        },
        tasks:[{
            type:String,
            required:[true, "Task is required "]
        }]
    });



 const interviewReportSchema= new mongoose.Schema({
    jobDescription:{
        type:String,
        required:[true, "Job description is required"],
        trim:true
    },
    resume:{
        type:String,
        default:""
    },
    selfDescription:{
        type:String,
        default:""
    },
    matchScore:{
        type:Number,
        min:0,
        max:100,
        default:0
    },

    technicalQuestion:[technicalQuestionSchema],
    behavioralQuestion:[behavioralQuestionSchema],
    skillGaps:[skillGapSchema],
    preperationPlan:[preperationPlanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    title:{
        type:String,
        required:[true, "job titled is required"],
        trim:true
    }
 },

 {
timestamps:true
}

);

const interviewReportModel=mongoose.model("InterviewReport", interviewReportSchema);

module.exports= interviewReportModel;