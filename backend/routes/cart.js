const express=require("express");
const router=express.Router();
const cartController=require("../controller/cart.js")

// to get a data from a cart
router.get('/',cartController.getData );
  


  //add items into cart

router.post("/",cartController.addItem)


//update item count

router.put("/edit/",cartController.editItem)
  



  router.delete('/delete/:id', cartController.deleteItem);
  


module.exports=router;