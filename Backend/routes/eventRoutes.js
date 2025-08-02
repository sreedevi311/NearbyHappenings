const express = require('express');
const router = express.Router();
const { getEventsByTheme,
    saveFormEvent,
    pendingRequests,
    acceptedRequests,
    declinedRequests,
    updateStatusById,
    adminAdded ,
    deleteById,
    adminReAdd,
    getEventById,
    adminUpdatedEventInfo,
    getEventThemesWithCount ,
    getAllEventThemes,
    getAllCities,
    userInterestedEvents, 
    userCityUpcomingDayEvents,
    upcomingDayEvents,
    getRandomThemeEvents,
    searchEvents,
    getAllTags
} = require('../controllers/eventControllers');
const authMiddleware=require('../middleware/auth.middleware')

router.get('/theme/:theme',authMiddleware, getEventsByTheme);
router.get('/search', authMiddleware,searchEvents);
router.get('/tags', getAllTags);


router.post('/save-form-event',saveFormEvent);
router.get('/pending-requests',pendingRequests);
router.get('/accepted-requests',acceptedRequests)
router.get('/declined-requests',declinedRequests)
router.get('/admin-added',adminAdded);
router.put('/update-status/:id',updateStatusById);
router.delete('/admin-deleted/:id',deleteById);
router.post('/admin-readd',adminReAdd);
router.put('/admin-updated-event-info/:id', adminUpdatedEventInfo);


router.get('/get-event-themes',getEventThemesWithCount);
router.get('/get-all-event-themes',getAllEventThemes)
router.get('/get-all-cities',getAllCities);
router.get('/user-interested-events/:userId',authMiddleware,userInterestedEvents);
router.get('/user-city-upcoming-day-events/:userId',authMiddleware,userCityUpcomingDayEvents);
router.get('/upcoming-day-events',upcomingDayEvents);
router.get('/random-theme-events', getRandomThemeEvents);


router.get('/:id', getEventById)
module.exports = router;
