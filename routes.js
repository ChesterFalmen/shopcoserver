const Router = require("express");
const router = new Router;
const  goodsRoutes =require("./goodsRoutes");
const commentsRoutes =require("./commentsRoutes");
const bannersRoutes = require("./bannersRoutes");
const registrationUser = require("./registrationRoutes");
const loginUser = require("./loginRoutes");
const orders = require("./ordersRoutes");
const users = require ("./userRoutes");
const newsletter = require("./newsletter");

const authMiddleware = require("./authMiddleware/authMiddleware")
const {check} = require("express-validator");
const productAvailabilityMiddleware = require("./authMiddleware/productАvailabilityMiddleware");
const authMiddlewareBasket = require("./authMiddleware/authMiddlewareBasket");
const basket = require("./basketRoutes")



// router.get('/api/goods', goodsRoutes.getAllGoods);
router.get('/api/product', goodsRoutes.product);
router.get('/api/productother', goodsRoutes.productOther);


router.get('/api/oneGoods/:id', goodsRoutes.getOneGood);
router.get('/api/goods/:count', goodsRoutes.getRecentGoods);
// router.get('/api/getRatingGoods/:count', goodsRoutes.getRatingGoods);
router.get('/api/getAllComments', commentsRoutes.getAllComments);
router.get('/api/comments/:id', commentsRoutes.getCommentsByGoodId);
router.post('/api/comments/add', commentsRoutes.addComment);
// router.post('/api/goods/updatePrice', goodsRoutes.updateFinalPrise);
router.get('/api/getCountComments/:count', commentsRoutes.getRecentComments);
// router.get('/api/category/:category', goodsRoutes.getGoodsByCategory);
// router.get('/api/styles/:style', goodsRoutes.getGoodsByStyle);
// router.get('/api/sex/:sex', goodsRoutes.getGoodsBySex);
router.post('/api/goods/add',goodsRoutes.addGood);


router.put('/api/changeUser', authMiddleware ,users.changeUser);
router.put('/api/changeUserPass',[
    check("password", "Password should be at least 5 characters").isLength({min:5}),
    ],
    authMiddleware ,users.changeUserPass);


// router.post('/api/orders/add', authMiddleware ,productAvailabilityMiddleware,orders.ordersAdd);
router.post('/api/orders/add', authMiddlewareBasket, productAvailabilityMiddleware ,orders.ordersAdd);


router.get("/api/activate/:link",users.activityUser);


router.get("/api/activityPassword/:link",users.activityPassword);


router.post('/api/isAuth', authMiddleware,loginUser.isValideToken);

router.post('/api/supportUser', authMiddleware,users.supportUser);
router.post('/api/resetPassword',users.resetPassword);


router.get('/api/banners', bannersRoutes.getBanners);
router.get('/api/loginBanner', bannersRoutes.getLoginBanner);
router.get('/api/getSaleGoods', goodsRoutes.getSaleGoods);

router.post('/api/search', goodsRoutes.search);

router.post('/api/mergeBasket', authMiddleware, basket.mergeBasket);
router.post('/api/refreshBasket', authMiddleware, basket.refreshBasket);
router.post('/api/getBasket', authMiddleware, basket.getBasket);

router.post("/api/aboutUser",authMiddleware, users.aboutUser )
router.post("/api/userOrders",authMiddleware, users.ordersUser )
router.post("/api/addNewsletter",[
    check("email", "Invalid email").isEmail({})], newsletter.addNewsletter)

router.post('/api/registration',[
    check("email", "Invalid email").isEmail({}),
    check("userName", "No empty").notEmpty(),
    check("password", "Password should be at least 5 characters").isLength({min:8})
], registrationUser.registrationUser );

router.post('/api/login', loginUser.loginUser);

module.exports = router




