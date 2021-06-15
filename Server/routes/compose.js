import express from 'express';
import {composePost} from '../controllers/compose.js'
import bodyParser from 'body-parser';


const router = express.Router();


router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post("/", composePost);


router.get("/", function (req, res){
    res.render("compose")

});


export default router;