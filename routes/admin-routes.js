import express from 'express'
import { login, addAdmin, getAdmins, getAdminById } from '../controllers/admin-controller.js';

const adminRouter = express.Router();

adminRouter.post('/signup', addAdmin).post('/login', login);
adminRouter.get('/:id',getAdminById)
adminRouter.get('/',getAdmins)
export default adminRouter;