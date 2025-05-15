const caseStudyService = require('./caseStudy.service');

class CaseStudyController {
  async create(req, res) {
    try {
      const result = await caseStudyService.createCaseStudy(req.body, req.user.id);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;      // default to page 1
      const limit = parseInt(req.query.limit) || 10;   // default to 10 items per page
      const skip = (page - 1) * limit;
  
      const results = await caseStudyService.getAllCaseStudies(req.user.id, skip, limit);
      
      res.status(200).json({
        page,
        limit,
        data: results,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getAllbyUsername(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;      // default to page 1
      const limit = parseInt(req.query.limit) || 10;   // default to 10 items per page
      const username = (req.query.username) || "";   // default to 10 items per page

      const skip = (page - 1) * limit;
  
      const results = await caseStudyService.getAllCaseStudiesUsername(username, skip, limit);
      
      res.status(200).json({
        page,
        limit,
        data: results,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
  

  async getById(req, res) {
    try {
      const result = await caseStudyService.getCaseStudyById(req.params.id, req.user.id);
      res.status(200).json(result);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const result = await caseStudyService.updateCaseStudy(req.params.id, req.user.id, req.body);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await caseStudyService.deleteCaseStudy(req.params.id, req.user.id);
      res.status(200).json(result);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }
}

module.exports = new CaseStudyController();
