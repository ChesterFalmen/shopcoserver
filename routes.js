const Router = require("express");
const router = new Router;
const  goodsRoutes =require("./goodsRoutes")
const commentsRoutes =require("./commentsRoutes")
const bannersRoutes = require("./bannersRoutes")
const registrationUser = require("./registrationRoutes")
const loginUser = require("./loginRoutes")
const orders = require("./ordersRoutes")
const users = require ("./userRoutes")
const authMiddleware = require("./authMiddleware/authMiddleware")
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
router.post('/api/orders/add', authMiddleware,orders.ordersAdd);
router.get("/api/activate/:link",users.activityUser);
router.post('/api/isAuth/', authMiddleware,loginUser.isValideToken);


router.get('/api/banners', bannersRoutes.getBanners);
router.get('/api/loginBanner', bannersRoutes.getLoginBanner);
router.get('/api/getSaleGoods', goodsRoutes.getSaleGoods);
router.post('/api/registration',[
    check("email", "Invalid email").isEmail({}),
    check("userName", "No empty").notEmpty(),
    check("password", "Password should be at least 5 characters").isLength({min:5})
], registrationUser.registrationUser );

router.post('/api/login', loginUser.loginUser);

module.exports = router




