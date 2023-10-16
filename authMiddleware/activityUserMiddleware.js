


const activityUserMiddleware = (req, res, next) =>{

    try {
        const activityLink =  req.params.link




    }catch (error) {
        res.status(403).json({message:"user not found"});
    }
}