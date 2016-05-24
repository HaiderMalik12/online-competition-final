module.exports.requiresLogin=function(req,res,next){
    console.log('authentication');
    if(req.user){
        console.log('user priniting');
        console.log(req.user.local.category);
        //console.log('Cateogry',req.user);
    next();
}else{
    next();
    //res.redirect('/')
}

};
module.exports.requiresJudge=function(req,res,next){

};