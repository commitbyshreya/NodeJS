const multer = require("multer")
const path = require('path') 

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, path.join(__dirname, "../public/userImage"))
    },
    filename: (req,file,cb) => {
        cb(null, Date.now() + '-'+ file.originalname )
    }
})
// const storage = multer.memoryStorage({
//     filename: (req,file,cb) => {
//                 cb(null, Date.now() + '-'+ file.originalname )
//             }
// })
const upload = multer({ storage })

module.exports = upload