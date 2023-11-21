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


router.get('/api/productOther', goodsRoutes.productOther);
router.get('/api/product', goodsRoutes.product);

router.get('/api/oneGoods/:id', goodsRoutes.getOneGood);
router.post('/api/goods/add',goodsRoutes.addGood);



router.get('/api/getComments/', commentsRoutes.getComments);
// router.post('/api/comments/add', commentsRoutes.addComment);
//////////////////////////////////////////////



router.post('/api/hasCommentsAdd',authMiddleware,  commentsRoutes.isHasAddComments);
router.post('/api/postComments',authMiddleware,  commentsRoutes.postComments);

//////////

router.get('/api/banners', bannersRoutes.getBanners);
router.get('/api/loginBanner', bannersRoutes.getLoginBanner);


router.put('/api/changeUser', authMiddleware ,users.changeUser);
router.put('/api/changeUserPass',[
    check("password", "Password should be at least 5 characters").isLength({min:5}),
    ],
    authMiddleware ,users.changeUserPass);
router.post('/api/orders/add', authMiddlewareBasket, productAvailabilityMiddleware ,orders.ordersAdd);




router.get("/api/activate/:link",users.activityUser);
router.get("/api/activityPassword/:link",users.activityPassword);

router.post('/api/isAuth', authMiddleware,loginUser.isValideToken);

router.post('/api/supportUser', authMiddleware,users.supportUser);
router.post('/api/resetPassword',users.resetPassword);

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



// router.get('/api/goods', goodsRoutes.getAllGoods);


module.exports = router




