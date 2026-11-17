import { Router } from 'express';
import { getDisplayConfig, updateDisplayConfig, } from '../controllers/displayController.js';
const router = Router();
router.get('/:tenantId', getDisplayConfig);
router.put('/:tenantId', updateDisplayConfig);
export default router;
