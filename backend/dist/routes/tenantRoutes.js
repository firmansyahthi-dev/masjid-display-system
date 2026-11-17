import { Router } from 'express';
import { getTenants, getTenantById, } from '../controllers/tenantController.js';
const router = Router();
router.get('/', getTenants);
router.get('/:tenantId', getTenantById);
export default router;
