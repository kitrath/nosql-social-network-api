const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

router.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Unknown route.',
    });
});

module.exports = router;