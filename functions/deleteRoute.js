const router = require("express").Router();
var firebase = require("firebase-admin");

// delete product by id
router.delete('/product/:productId', async (req, res) => {
   const { productId } = req.params;
   const productRef = firebase.firestore().collection('products').doc(productId);

   try {
      const result = await productRef.delete();
      return res.json({ status: "success", result: result });
   } catch (error) {
      console.error("Error during delete product by id !!!", error);
      return res.json({ status: "failed", result: error });
   }
});

module.exports = router;