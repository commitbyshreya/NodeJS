const isLogIn = async (req, res,next) => {
    try {
        if (req.session.user_id) {
            next() // pass access to next route handler or middleware -> loading home page 
        } else {
            res.redirect('/user/login')
            
        }
        
    } catch (error) {
        console.log(error.message)
    }
}

const isLogOut = async (req, res,next) => {
    try {
        if (req.session.user_id) {
            res.redirect('/user/home')
        } else {
            next() // loading login or register page 
        }
    } catch (error){
        console.log(error.message)
    }
}

module.exports = {isLogIn,isLogOut}