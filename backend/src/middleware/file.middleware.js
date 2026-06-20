const multer = require("multer");


/*
|--------------------------------------------------------------------------
| File Upload Middleware
|--------------------------------------------------------------------------
| Stores uploaded file temporarily in memory
|--------------------------------------------------------------------------
*/


const storage = multer.memoryStorage();



const upload = multer({

    storage,


    limits: {

        // Maximum file size 3MB
        fileSize: 3 * 1024 * 1024

    },


    fileFilter: (req, file, cb) => {


        // allow only resume files

        if (
            file.mimetype === "application/pdf" ||
            file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {


            cb(null, true);


        } else {


            cb(
                new Error(
                    "Only PDF and DOCX files are allowed"
                )
            );


        }

    }

});



module.exports = upload;