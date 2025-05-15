const { CaseStudyModel,UserModel } = require('../../model/index.model');
const mongoose = require('mongoose');
class CaseStudyService {
  async createCaseStudy(data, userId) {
    const _id = new mongoose.Types.ObjectId().toString(); 
    return await CaseStudyModel.create({_id, ...data, userId });
  }

  async   getAllCaseStudies(userId, skip = 0, limit = 10) {
    // Get the total count of case studies for pagination
    const totalCount = await CaseStudyModel.countDocuments({ userId });
  
    // Fetch the case studies with skip and limit
    const caseStudies = await CaseStudyModel.find({ userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Optional: sort newest first
  
    // Calculate total pages based on count and limit
    const totalPages = Math.ceil(totalCount / limit);
  
    return {
      caseStudies,
      totalCount,
      totalPages,
    };
  }
  
  async   getAllCaseStudiesUsername(username, skip = 0, limit = 10) {
    // Get the total count of case studies for pagination
    console.log(username,"username")
    const findUser = await UserModel.findOne({ username: username });
    console.log(findUser,"findUser")
    if(!findUser){
      return {
        caseStudies:[],
        totalCount:0,
        totalPages:1,
      };
    }
    const totalCount = await CaseStudyModel.countDocuments({ userId:findUser._id });
    // Fetch the case studies with skip and limit
    const caseStudies = await CaseStudyModel.find({ userId:findUser._id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Optional: sort newest first
  
    // Calculate total pages based on count and limit
    const totalPages = Math.ceil(totalCount / limit);
  
    return {
      caseStudies,
      totalCount,
      totalPages,
    };
  }

  async getCaseStudyById(id, userId) {
    const caseStudy = await CaseStudyModel.findOne({ _id: id, userId });
    if (!caseStudy) throw new Error('Case study not found');
    return caseStudy;
  }

  async updateCaseStudy(id, userId, updates) {
    const updated = await CaseStudyModel.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true }
    );
    if (!updated) throw new Error('Case study not found or not authorized');
    return updated;
  }

  async deleteCaseStudy(id, userId) {
    const deleted = await CaseStudyModel.findOneAndDelete({ _id: id, userId });
    if (!deleted) throw new Error('Case study not found or not authorized');
    return { message: 'Deleted successfully' };
  }
}

module.exports = new CaseStudyService();
