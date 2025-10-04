const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/login'); 
const { getLowStock, getWeeklyTransasction } = require('../helper/DashboardHelper');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const lowStockItems = await getLowStock(10); 
        const { stats, chartData } = await getWeeklyTransasction();
        res.json([{
            lowStockItems: lowStockItems,
            stats: stats,
            chartData: chartData
        }]);

    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: error.message || "Gagal mengambil data." });
    }
});

module.exports = router;