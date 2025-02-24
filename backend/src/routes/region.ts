const express = require('express');
const router = express.Router();
import * as regionController from '../controllers/regionController';
import {
  regionFindValidator,
  regionValidator,
} from '../validator/regionValidator';

//crud
router.get('', regionController.getRegion);
router.post('', regionValidator, regionController.createRegion);
router.put('/:id', regionValidator, regionController.updateRegion);
router.delete('/:id', regionController.deleteRegion);

//search
router.get('/find/', regionFindValidator, regionController.findRegion);
router.get('/find-near/', regionFindValidator, regionController.findRegionNear);

export default router;
