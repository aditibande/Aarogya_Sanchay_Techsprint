const express = require('express');
const router = express.Router();
const User = require('../models/user'); 
const HealthRecord = require('../models/healthRecord'); 
const authMiddleware = require('../middleware/authMiddleware'); 


router.get('/', authMiddleware, async (req, res) => {
  try {

    if (!['doctor', 'admin', 'govt'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Authorization required.' });
    }

    const migrants = await User.find({ role: 'migrant' })
      .select('-password') 
      .sort({ createdAt: -1 })

  
    const migrantsWithStats = await Promise.all(migrants.map(async (migrant) => {
      const recordsCount = await HealthRecord.countDocuments({ userId: migrant._id });
      const lastRecord = await HealthRecord.findOne({ userId: migrant._id })
        .sort({ date: -1 }) 
        .select('date type title');

      return {
        ...migrant.toObject(),
        totalRecords: recordsCount,
        lastCheckup: lastRecord ? lastRecord.date : null,
        lastRecordType: lastRecord ? lastRecord.type : null,
        lastRecordTitle: lastRecord ? lastRecord.title : null
      };
    }));

    res.json({
      success: true,
      count: migrantsWithStats.length,
      data: migrantsWithStats
    });
  } catch (error) {
    console.error('Error fetching migrants:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching migrants' 
    });
  }
});


router.get('/stats', authMiddleware, async (req, res) => {
  try {
    if (!['doctor', 'admin', 'govt'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Authorization required.' });
    }

    const totalMigrants = await User.countDocuments({ role: 'migrant' });
    
   
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeCases = await HealthRecord.distinct('userId', {
      date: { $gte: thirtyDaysAgo }
    });


    const criticalCases = await HealthRecord.distinct('userId', {
      $or: [
        { type: 'doctor_visit', title: { $regex: /emergency|critical|urgent/i } },
        { description: { $regex: /emergency|critical|urgent|serious/i } },
        { tags: { $in: ['critical', 'emergency', 'urgent'] } }
      ]
    });


    const totalPatients = await User.countDocuments({ 
      role: { $nin: ['doctor', 'admin', 'govt'] } 
    });


    const totalDoctors = await User.countDocuments({ role: 'doctor' });

  
    const pendingReports = await HealthRecord.countDocuments({
      $or: [
        { description: { $exists: false } },
        { description: '' },
        { description: null }
      ]
    });

    res.json({
      success: true,
      stats: {
        totalMigrants,
        activeCases: activeCases.length,
        criticalCases: criticalCases.length,
        totalPatients,
        doctors: totalDoctors,
        pendingReports
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching statistics' 
    });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    if (!['doctor', 'admin', 'govt'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Authorization required.' });
    }

    const migrant = await User.findById(req.params.id).select('-password');
    
    if (!migrant || migrant.role !== 'migrant') {
      return res.status(404).json({ 
        success: false, 
        message: 'Migrant not found' 
      });
    }

  
    const healthRecords = await HealthRecord.find({ userId: req.params.id })
      .sort({ date: -1 });


    const vaccinations = healthRecords.filter(record => record.type === 'vaccination');
    const lastVaccination = vaccinations.length > 0 ? vaccinations[0].date : null;

    res.json({
      success: true,
      data: {
        migrant,
        healthRecords,
        recordsCount: healthRecords.length,
        vaccinationsCount: vaccinations.length,
        lastVaccination,
        recordsByType: {
          doctor_visit: healthRecords.filter(r => r.type === 'doctor_visit').length,
          lab_report: healthRecords.filter(r => r.type === 'Lab-report').length,
          vaccination: healthRecords.filter(r => r.type === 'vaccination').length,
          prescription: healthRecords.filter(r => r.type === 'prescription').length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching migrant details:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching migrant details' 
    });
  }
});


router.get('/search/:query', authMiddleware, async (req, res) => {
  try {
    if (!['doctor', 'admin', 'govt'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Authorization required.' });
    }

    const searchQuery = req.params.query;
    
    const migrants = await User.find({
      role: 'migrant',
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { phone: { $regex: searchQuery, $options: 'i' } },
        { healthId: { $regex: searchQuery, $options: 'i' } }
      ]
    }).select('-password');


    const migrantsWithStats = await Promise.all(migrants.map(async (migrant) => {
      const recordsCount = await HealthRecord.countDocuments({ userId: migrant._id });
      return {
        ...migrant.toObject(),
        totalRecords: recordsCount
      };
    }));

    res.json({
      success: true,
      count: migrantsWithStats.length,
      data: migrantsWithStats
    });
  } catch (error) {
    console.error('Error searching migrants:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while searching migrants' 
    });
  }
});

router.get('/analytics/overview', authMiddleware, async (req, res) => {
  try {
    if (!['doctor', 'admin', 'govt'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Authorization required.' });
    }

   
    const recordsByType = await HealthRecord.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

   
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentRegistrations = await User.countDocuments({
      role: 'migrant',
      createdAt: { $gte: sevenDaysAgo }
    });

    const migrantsByLanguage = await User.aggregate([
      { $match: { role: 'migrant' } },
      {
        $group: {
          _id: '$language',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      analytics: {
        recordsByType,
        recentRegistrations,
        migrantsByLanguage
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching analytics' 
    });
  }
});

module.exports = router;

