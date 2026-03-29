// routes/issues.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer(); // important!
const { 
  createIssue, 
  getIssues, 
  voteIssue, 
  getIssueById,
  approveIssue,
  rejectIssue,
  assignToGramSevak,
  getAllGramSevakIssues,
  getMyIssues
} = require('../controllers/issueController');

const { createGramSevakAssignedIssue,GramSevekStatusUpdate,GetAllGramsevekCompletedIssue,GetNotifications,MarkAllNotificationsAsRead,TestNotification } = require('../controllers/gramSevakController'); // correct

// Routes
router.get('/my-issues', auth, getMyIssues);
router.get('/gramsevek', getAllGramSevakIssues);
router.get('/gramsevek/completed',GetAllGramsevekCompletedIssue)
router.patch('/gramsevek/:id/approval', createGramSevakAssignedIssue); // multer add केलं file साठी
router.patch('/gramsevek/:status/:id',GramSevekStatusUpdate)
router.get('/notifications', GetNotifications);
router.get('/ping-notif', (req, res) => res.json({ success: true, notifications: [{_id:Date.now(), title:'System Integrity', desc:'Backend connection established.', type:'info', read:false, createdAt: new Date()}] }));
router.get('/test-notif-trigger', TestNotification);
router.patch('/notifications/read', MarkAllNotificationsAsRead);
router.post('/', auth, createIssue);
router.get('/', getIssues);
router.post('/:id/vote', auth, voteIssue);
router.patch('/:id/approved', auth, approveIssue);
router.patch('/:id/rejected', auth, rejectIssue);
router.patch('/:id/in-progress', auth, assignToGramSevak);
router.get('/:id', getIssueById);

module.exports = router;