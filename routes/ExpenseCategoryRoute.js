const router = require('express').Router();
const expensecategory = require('../controllers/ExpenseCategoryController')

router.get('/expensecategory' , expensecategory.getCategory);
router.post('/expensecategory' , expensecategory.addCategory);

module.exports = routers;
