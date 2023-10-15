const Router = require("express");
const router = new Router;



const  goodsRoutes =require("./goodsRoutes")
const commentsRoutes =require("./commentsRoutes")
const bannersRoutes = require("./bannersRoutes")
const registrationUser = require("./registrationRoutes")
const loginUser = require("./loginRoutes")
const {check} = require("express-validator")



router.get('/api/goods', goodsRoutes.getAllGoods);
router.get('/api/oneGoods/:id', goodsRoutes.getOneGood);
router.get('/api/goods/:count', goodsRoutes.getRecentGoods);
router.get('/api/getRatingGoods/:count', goodsRoutes.getRatingGoods);
router.get('/api/getAllComments', commentsRoutes.getAllComments);
router.get('/api/comments/:id', commentsRoutes.getCommentsByGoodId);
router.post('/api/comments/add', commentsRoutes.addComment);
router.post('/api/goods/updatePrice', goodsRoutes.updateFinalPrise);
router.get('/api/getCountComments/:count', commentsRoutes.getRecentComments);
router.get('/api/category/:category', goodsRoutes.getGoodsByCategory);
router.get('/api/styles/:style', goodsRoutes.getGoodsByStyle);
router.get('/api/sex/:sex', goodsRoutes.getGoodsBySex);
router.post('/api/goods/add', goodsRoutes.addGood);
router.get('/api/banners', bannersRoutes.getBanners);
router.get('/api/loginBanner', bannersRoutes.getLoginBanner);
router.get('/api/getSaleGoods', goodsRoutes.getSaleGoods);
router.post('/api/registration',[
    check("username", "Invalid email").isEmail({}),
    check("password", "Password should be at least 5 characters").isLength({min:5})
], registrationUser.registrationUser );

router.post('/api/login', loginUser.loginUser);

module.exports = router




