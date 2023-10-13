const Router = require("express");
const router = new Router;


const { app } = require('./app');
// const { goodsRoutes, commentsRoutes, bannersRoutes } = require('./routes');
const  goodsRoutes =require("./goodsRoutes")
const commentsRoutes =require("./commentsRoutes")
const bannersRoutes = require("./bannersRoutes")



router.get('/api/goods', goodsRoutes.getAllGoods);
router.get('/api/oneGoods/:id', goodsRoutes.getOneGood);
router.get('/api/goods/:count', goodsRoutes.getRecentGoods);
router.get('/api/getRatingGoods/:count', goodsRoutes.getRatingGoods);
router.get('/api/getAllComments', commentsRoutes.getAllComments);
router.get('/api/comments/:id', commentsRoutes.getCommentsByGoodId);
router.post('/api/comments/add', commentsRoutes.addComment);
router.get('/api/getCountComments/:count', commentsRoutes.getRecentComments);
router.get('/api/category/:category', goodsRoutes.getGoodsByCategory);
router.get('/api/styles/:style', goodsRoutes.getGoodsByStyle);
router.get('/api/sex/:sex', goodsRoutes.getGoodsBySex);
router.post('/api/goods/add', goodsRoutes.addGood);
router.get('/api/banners', bannersRoutes.getBanners);
router.get('/api/loginBanner', bannersRoutes.getLoginBanner);
router.get('/api/getSaleGoods', goodsRoutes.getSaleGoods);

module.exports = router




