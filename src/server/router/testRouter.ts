import { Router } from "express";

/**
 * 行情详情路由
 */
const router = Router();
router.get(`test`, (req, res) => {
  res.write("Hello world");
  res.end();
});

export default router;
