const express = require('express');
const router = express.Router();

const { caseStudyController } = require('../../controller/index.controller');
const { auth, trackAnalytics } = require('../../middleware/index.middleware');

// Create a new case study
router.post('/', auth, caseStudyController.create);

// Get all case studies of the logged-in user
router.get('/', auth, caseStudyController.getAll);

router.get('/user',trackAnalytics('view'),  caseStudyController.getAllbyUsername);


// Get a specific case study by ID (must belong to the user)
router.get('/:id', auth, trackAnalytics('view'), caseStudyController.getById);

// Update a specific case study (must belong to the user)
router.put('/:id', auth, caseStudyController.update);

// Delete a specific case study (must belong to the user)
router.delete('/:id', auth, caseStudyController.delete);

module.exports = router;
