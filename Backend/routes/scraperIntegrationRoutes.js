/**
 * API Routes for Faculty Data Scraping and Integration
 *
 * Provides endpoints to scrape faculty data from university website
 * and integrate it with the existing manual entry system
 */

const express = require('express');
const router = express.Router();
const FacultyDataIntegrator = require('../utils/facultyDataIntegrator');
const Professor = require('../Professor');

/**
 * POST /api/scraper/faculty/:nodeId
 * Scrape and store individual faculty data
 */
router.post('/faculty/:nodeId', async (req, res) => {
  try {
    const { nodeId } = req.params;
    const options = req.body || {};

    console.log(`API: Scraping faculty data for node ${nodeId}`);

    const result = await FacultyDataIntegrator.scrapeAndStore(nodeId, options);

    if (result.success) {
      res.json({
        success: true,
        message: `Faculty data ${result.isNewRecord ? 'created' : 'updated'} successfully`,
        data: {
          facultyId: result.faculty._id,
          name: result.faculty.name,
          email: result.faculty.email,
          department: result.faculty.department,
          isNewRecord: result.isNewRecord,
          validation: result.validation
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to scrape and store faculty data',
        error: result.error,
        nodeId
      });
    }

  } catch (error) {
    console.error('API Error - Faculty scraping:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during faculty data scraping',
      error: error.message
    });
  }
});

/**
 * POST /api/scraper/faculty/batch
 * Batch scrape multiple faculty members
 * Body: { nodeIds: ['123', '456'], options: {...} }
 */
router.post('/faculty/batch', async (req, res) => {
  try {
    const { nodeIds, options = {} } = req.body;

    if (!nodeIds || !Array.isArray(nodeIds) || nodeIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'nodeIds array is required'
      });
    }

    console.log(`API: Batch scraping ${nodeIds.length} faculty members`);

    const results = await FacultyDataIntegrator.batchScrapeAndStore(nodeIds, options);

    res.json({
      success: true,
      message: 'Batch scraping completed',
      data: {
        summary: results.summary,
        successful: results.successful.map(r => ({
          nodeId: r.scrapedData.node_id,
          facultyId: r.faculty._id,
          name: r.faculty.name,
          isNewRecord: r.isNewRecord
        })),
        failed: results.failed
      }
    });

  } catch (error) {
    console.error('API Error - Batch scraping:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during batch scraping',
      error: error.message
    });
  }
});

/**
 * POST /api/integration/faculty/:nodeId
 * Update logged-in user's profile with scraped faculty data
 * Preserves user's email and login credentials while updating profile data
 */
router.post('/faculty/:nodeId', async (req, res) => {
  try {
    const { nodeId } = req.params;
    const userId = req.user.id; // Get logged-in user ID from token
    const options = req.body || {};

    console.log(`API: Updating user ${userId} with scraped data from node ${nodeId}`);

    // Get the current logged-in user
    const currentUser = await Professor.findById(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'Current user not found'
      });
    }

    console.log(`Current user: ${currentUser.name} (${currentUser.email})`);

    // Scrape the faculty data
    const FacultyDataScraper = require('../scrapers/facultyDataScraper');
    const DataTransformer = require('../utils/dataTransformer');

    const scraper = new FacultyDataScraper();
    const scrapedData = await scraper.scrapeFacultyData(nodeId);

    if (!scrapedData || !scrapedData.name) {
      return res.status(404).json({
        success: false,
        message: `No faculty data found for node ID ${nodeId}`,
        nodeId
      });
    }

    // Transform the scraped data
    const transformedData = DataTransformer.transformScrapedDataForDB(scrapedData);

    // Prepare update data - preserve email, password, and user credentials
    const updateData = {
      // Update profile information (preserve email and password)
      name: transformedData.name || currentUser.name,
      department: transformedData.department || currentUser.department,
      designation: transformedData.designation || currentUser.designation,

      // Update scraped data fields
      teaching_experience: transformedData.teaching_experience || [],
      research_experience: transformedData.research_experience || [],
      industry_experience: transformedData.industry_experience || [],

      // Publications
      ugc_papers: transformedData.ugc_papers || [],
      ugc_approved_journals: transformedData.ugc_approved_journals || [],
      non_ugc_papers: transformedData.non_ugc_papers || [],
      non_ugc_journals: transformedData.non_ugc_journals || [],
      conference_proceedings: transformedData.conference_proceedings || [],

      // Books and other publications
      books: transformedData.books || [],
      chapters_in_books: transformedData.chapters_in_books || [],
      edited_books: transformedData.edited_books || [],

      // Education and awards
      education: transformedData.education || [],
      awards: transformedData.awards || [],

      // Projects and other activities
      ongoing_projects: transformedData.ongoing_projects || [],
      completed_projects: transformedData.completed_projects || [],
      ongoing_consultancy_works: transformedData.ongoing_consultancy_works || [],
      completed_consultancy_works: transformedData.completed_consultancy_works || [],
      patents: transformedData.patents || [],
      fellowship: transformedData.fellowship || [],
      training_programs: transformedData.training_programs || [],
      mou_collaborations: transformedData.mou_collaborations || [],

      // Research Guidance
      pg_guidance: transformedData.pg_guidance || [],
      phd_guidance: transformedData.phd_guidance || [],
      postdoc_guidance: transformedData.postdoc_guidance || [],

      // Research areas
      area_of_expertise: transformedData.area_of_expertise || [],
      research_interests: transformedData.research_interests || [],

      // Meta information
      node_id: nodeId,
      data_source: currentUser.data_source === 'manual' ? 'hybrid' : 'web_scraping',
      last_scraped: new Date(),
      scraped_sections: Object.keys(transformedData).filter(key =>
        Array.isArray(transformedData[key]) && transformedData[key].length > 0
      )
    };

    // Update the current user with scraped data
    const updatedUser = await Professor.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    console.log(`✅ Updated user ${updatedUser.name} with scraped data`);

    // Validate the update
    const validation = DataTransformer.validateTransformation(scrapedData, updateData);

    // Prepare response with summary
    const responseSummary = {
      teaching_experience: updateData.teaching_experience?.length || 0,
      research_experience: updateData.research_experience?.length || 0,
      industry_experience: updateData.industry_experience?.length || 0,
      ugc_papers: (updateData.ugc_papers?.length || 0) + (updateData.ugc_approved_journals?.length || 0),
      non_ugc_papers: (updateData.non_ugc_papers?.length || 0) + (updateData.non_ugc_journals?.length || 0),
      conference_proceedings: updateData.conference_proceedings?.length || 0,
      books: (updateData.books?.length || 0) + (updateData.edited_books?.length || 0),
      chapters: updateData.chapters_in_books?.length || 0,
      education: updateData.education?.length || 0,
      awards: updateData.awards?.length || 0,
      projects: (updateData.ongoing_projects?.length || 0) + (updateData.completed_projects?.length || 0),
      consultancy_works: (updateData.ongoing_consultancy_works?.length || 0) + (updateData.completed_consultancy_works?.length || 0),
      research_guidance: (updateData.pg_guidance?.length || 0) + (updateData.phd_guidance?.length || 0) + (updateData.postdoc_guidance?.length || 0),
      patents: updateData.patents?.length || 0
    };

    res.json({
      success: true,
      message: `Your profile has been updated with scraped data from ${scrapedData.name}`,
      data: {
        userId: updatedUser._id,
        userName: updatedUser.name,
        userEmail: updatedUser.email, // This remains unchanged
        scrapedFrom: {
          name: scrapedData.name,
          nodeId: nodeId,
          department: scrapedData.department
        },
        summary: responseSummary,
        totalRecords: Object.values(responseSummary).reduce((a, b) => a + b, 0),
        dataSource: updatedUser.data_source,
        validation: validation,
        preservedFields: ['email', 'password', 'role', '_id'],
        // Frontend refresh signals
        refreshRequired: true,
        refreshPages: ['experience', 'publications', 'books', 'patents', 'profile'],
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('API Error - User profile update:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update your profile with scraped data',
      error: error.message,
      nodeId
    });
  }
});

/**
 * GET /api/scraper/faculty/:nodeId/preview
 * Preview scraped data without storing (for validation)
 */
router.get('/faculty/:nodeId/preview', async (req, res) => {
  try {
    const { nodeId } = req.params;

    console.log(`API: Previewing scraped data for node ${nodeId}`);

    const FacultyDataScraper = require('../scrapers/facultyDataScraper');
    const DataTransformer = require('../utils/dataTransformer');

    // Scrape data
    const scraper = new FacultyDataScraper();
    const scrapedData = await scraper.scrapeFacultyData(nodeId);

    // Transform data
    const transformedData = DataTransformer.transformScrapedDataForDB(scrapedData);

    // Validate transformation
    const validation = DataTransformer.validateTransformation(scrapedData, transformedData);

    // Check for existing records
    const existingFaculty = await FacultyDataIntegrator.findExistingFaculty(transformedData);

    res.json({
      success: true,
      message: 'Data preview generated successfully',
      data: {
        scraped: {
          name: scrapedData.name,
          email: scrapedData.email,
          department: scrapedData.department,
          sections: {
            education: scrapedData.home?.education?.length || 0,
            awards: scrapedData.home?.awards?.length || 0,
            teaching_experience: scrapedData.experience?.teaching?.length || 0,
            research_experience: scrapedData.experience?.research?.length || 0,
            publications: (scrapedData.innovation?.ugc_papers?.length || 0) +
                         (scrapedData.innovation?.non_ugc_papers?.length || 0),
            books: (scrapedData.books?.authored_books?.length || 0) +
                   (scrapedData.books?.edited_books?.length || 0),
            projects: (scrapedData.projects?.ongoing_projects?.length || 0) +
                     (scrapedData.projects?.completed_projects?.length || 0)
          }
        },
        existing: existingFaculty ? {
          id: existingFaculty._id,
          name: existingFaculty.name,
          email: existingFaculty.email,
          dataSource: existingFaculty.data_source,
          lastUpdated: existingFaculty.updatedAt
        } : null,
        validation,
        recommendations: {
          action: existingFaculty ? 'update' : 'create',
          suggestedStrategy: existingFaculty?.data_source === 'manual' ? 'merge' : 'replace'
        }
      }
    });

  } catch (error) {
    console.error('API Error - Preview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate preview',
      error: error.message
    });
  }
});

/**
 * GET /api/scraper/mapping
 * Get field mapping information between scraped and manual data
 */
router.get('/mapping', (req, res) => {
  try {
    const fieldMapping = {
      direct_mappings: [
        'Basic Information: name, email, department, designation',
        'Education: degree, title, university, graduationYear',
        'Awards: title, type, agency, year, amount',
        'Books: title, authors, publisher, isbn, year',
        'Innovation Contributions: workName, specialization, remarks'
      ],
      transformations_needed: [
        'Experience: duration → from/to dates',
        'Publications: volumeIssuePages → volume/issue/pages',
        'Patents: yearOfAward → date_of_award, type → scope',
        'Research Guidance: status → detailed status fields'
      ],
      missing_in_scraped: [
        'File uploads (papers, certificates)',
        'Detailed project descriptions',
        'Contact information (phone, office)',
        'Administrative responsibilities',
        'Some date ranges in experience'
      ],
      compatibility: {
        fully_compatible: 85,
        needs_transformation: 12,
        missing_fields: 3
      }
    };

    res.json({
      success: true,
      message: 'Field mapping information',
      data: fieldMapping
    });

  } catch (error) {
    console.error('API Error - Mapping info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get mapping information',
      error: error.message
    });
  }
});

/**
 * GET /api/scraper/status
 * Get statistics about scraped vs manual data
 */
router.get('/status', async (req, res) => {
  try {
    const stats = await Professor.aggregate([
      {
        $group: {
          _id: '$data_source',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusData = {
      manual: stats.find(s => s._id === 'manual')?.count || 0,
      web_scraping: stats.find(s => s._id === 'web_scraping')?.count || 0,
      hybrid: stats.find(s => s._id === 'hybrid')?.count || 0
    };

    statusData.total = statusData.manual + statusData.web_scraping + statusData.hybrid;

    res.json({
      success: true,
      message: 'Faculty data statistics',
      data: statusData
    });

  } catch (error) {
    console.error('API Error - Status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get statistics',
      error: error.message
    });
  }
});

module.exports = router;