const { Barang, Transaksi } = require('../models');
const { Op, Sequelize } = require('sequelize');

const getStartWeek = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(today.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
};

async function getLowStock(threshold = 10) {
    try {
        const lowBarang = await Barang.findAll({
            where: {
                stok: {
                    [Op.lt]: threshold
                }
            },
            attributes: ['barang_id', 'nama_barang', 'stok']
        });
        return lowBarang;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error("Gagal mengambil data.");
    }
}

async function getWeeklyTransasction() {
    const startWeek = getStartWeek();
    const weekly = await Transaksi.findAll({
        where: {
            tanggal_trans: {
                [Op.gte]: startWeek
            }
        },
        attributes: [
            [Sequelize.fn('DATE', Sequelize.col('tanggal_trans')), 'tanggal'],
            'jenis_trans',
            [Sequelize.fn('SUM', Sequelize.col('jumlah_barang')), 'total_barang']
        ],
        group: ['tanggal', 'jenis_trans'],
        order: [[Sequelize.fn('DATE', Sequelize.col('tanggal_trans')), 'ASC']]
    });

    let inThisWeek = 0;
    let outThisWeek = 0;
    const chartMap = {};

    weekly.forEach(item => {
        const date = item.get('tanggal');
        const jenis = item.get('jenis_trans');
        const total = parseInt(item.get('total_barang')) || 0; 
        
        if (jenis === 'in') {
            inThisWeek += total;
        } else if (jenis === 'out') {
            outThisWeek += total;
        }
        if (!chartMap[date]) {
            chartMap[date] = { date: date, masuk: 0, keluar: 0 };
        }
        if (jenis === 'in') {
            chartMap[date].masuk = total;
        } else if (jenis === 'out') {
            chartMap[date].keluar = total;
        }
    });

    const chartData = Object.values(chartMap).map(data => {
        const dateObj = new Date(data.date);
        const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        return {
            name: dayNames[dateObj.getDay()],
            masuk: data.masuk,
            keluar: data.keluar,
        };
    });

    return {
        stats: { inThisWeek, outThisWeek },
        chartData: chartData
    };
}

module.exports = {
    getLowStock,
    getWeeklyTransasction
};