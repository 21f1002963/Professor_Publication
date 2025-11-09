const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');

class FacultyDataScraper {
  constructor() {
    this.baseUrl = 'https://backup.pondiuni.edu.in/PU_Establishment/profile_view/?node=';
  }

  /**
   * Scrape faculty data from Pondicherry University profile page
   * @param {string} nodeId - The faculty node ID
   * @returns {Object} Scraped faculty data
   */
  async scrapeFacultyData(nodeId) {
    try {
      console.log(`Scraping data for faculty node: ${nodeId}`);

      const url = `${this.baseUrl}${nodeId}`;
      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);

      const facultyData = {
        // Basic Information
        name: this.extractName($),
        designation: this.extractDesignation($),
        department: this.extractDepartment($),
        school: this.extractSchool($),
        email: this.extractEmail($),
        profileImage: this.extractProfileImage($, nodeId),

        // Home Section
        home: {
          education: this.extractEducation($),
          specialization: this.extractSpecialization($),
          awards: this.extractAwards($),
          researchInterests: this.extractResearchInterests($)
        },

        // Experience Section
        experience: {
          teaching: this.extractTeachingExperience($),
          research: this.extractResearchExperience($),
          industry: this.extractIndustryExperience($)
        },

        // Patents/Papers Section
        innovation: {
          contributions: this.extractInnovationContributions($),
          patents: this.extractPatentDetails($),
          ugc_papers: this.extractUGCApprovedPapers($),
          non_ugc_papers: this.extractNonUGCPapers($)
        },

        // Books Section
        books: {
          authored_books: this.extractAuthoredBooks($),
          book_chapters: this.extractBookChapters($),
          edited_books: this.extractEditedBooks($)
        },

        // Projects/Consultancy Section
        projects_consultancy: {
          ongoing_projects: this.extractOngoingProjects($),
          ongoing_consultancy: this.extractOngoingConsultancy($),
          completed_projects: this.extractCompletedProjects($),
          completed_consultancy: this.extractCompletedConsultancy($)
        },

        // Research Guidance Section
        research_guidance: {
          pg_guidance: this.extractPGGuidance($),
          phd_guidance: this.extractPhDGuidance($),
          postdoc_guidance: this.extractPostDocGuidance($)
        },

        // Conference/Seminars/Workshops Section
        conferences_seminars: {
          e_lectures: this.extractELectures($),
          online_education: this.extractOnlineEducation($),
          invited_talks: this.extractInvitedTalks($),
          organized_conferences: this.extractOrganizedConferences($),
          organized_workshops: this.extractOrganizedWorkshops($)
        },

        // Affiliation/Collaboration Section
        collaboration: {
          participation_extension: this.extractParticipationExtension($),
          institutional_collaboration: this.extractInstitutionalCollaboration($)
        },

        // Programme Section
        programmes: {
          faculty_development: this.extractFacultyDevelopment($),
          executive_development: this.extractExecutiveDevelopment($),
          special_programmes: this.extractSpecialProgrammes($)
        },

        // Meta information
        scraped_date: new Date(),
        source_url: url,
        node_id: nodeId
      };

      console.log(`Successfully scraped data - ${facultyData.jsonData}`);
      return facultyData;

    } catch (error) {
      console.error(`Error scraping faculty data for node ${nodeId}:`, error.message);
      throw new Error(`Failed to scrape faculty data: ${error.message}`);
    }
  }

  /**
   * Extract faculty name from the page
   * Parses h2 tag which contains the name, with optional <small> tag for designation
   * Example: <h2>JAYAKUMAR S.K.V <small>Professor</small></h2>
   */
  extractName($) {
    // Try to get h2 tag (primary location for faculty name)
    const h2Element = $('h2').eq(1);
    if (h2Element.length) {
      // Clone to work with, remove small tag, and get text
      const nameOnly = h2Element.clone();
      nameOnly.find('small').remove();
      const name = nameOnly.text().trim();
      if (name) {
        return name;
      }
    }

    // Fallback to other selectors if h2 doesn't work
    const selectors = ['h1', '.faculty-name', '.name', '.profile-name'];
    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length && element.text().trim()) {
        // Remove small tags if present in other elements too
        const nameText = element.clone();
        nameText.find('small').remove();
        const name = nameText.text().trim();
        if (name) {
          return name;
        }
      }
    }
    return '';
  }

  /**
   * Extract faculty designation from the page
   * Parses the <small> tag inside h2 which contains the designation
   * Example: <h2>JAYAKUMAR S.K.V <small>Professor</small></h2>
   * Returns: "Professor"
   */
  extractDesignation($) {
    // Look for small tag inside h2 (primary location)
    const smallInH2 = $('h2 small').eq(1);
    if (smallInH2.length) {
      const designation = smallInH2.text().trim();
      if (designation) {
        return designation;
      }
    }

    // Fallback: Look for small tag anywhere on page
    const smallElement = $('small').first();
    if (smallElement.length) {
      const designation = smallElement.text().trim();
      // Common designation patterns to validate
      const validDesignations = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Senior Lecturer', 'Adjunct Professor', 'Visiting Professor', 'Research Scholar', 'Post Doc'];
      if (validDesignations.some(d => designation.toLowerCase().includes(d.toLowerCase()))) {
        return designation;
      }
    }

    return '';
  }

  /**
   * Extract department information
   */
  extractDepartment($) {
    const text = $('body').text();
    const patterns = [
      /Department of ([^\n\r,]+)/i,
      /Dept\. of ([^\n\r,]+)/i,
      /Department:\s*([^\n\r,]+)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    return '';
  }

  /**
   * Extract school information
   */
  extractSchool($) {
    const text = $('body').text();
    const patterns = [
      /School of ([^\n\r,]+)/i,
      /Faculty of ([^\n\r,]+)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    return '';
  }

  /**
   * Extract email address
   * Email is in the 3rd <li> element within <ul class="list-unstyled user_data">
   * Structure: Department, School, Email
   */
  extractEmail($) {
    // Primary method: Look for email in the 3rd li of user_data ul
    const userDataList = $('ul.list-unstyled.user_data li');
    if (userDataList.length >= 3) {
      const thirdLi = userDataList.eq(2); // 0-based index, so 2 = 3rd element
      const emailText = thirdLi.text().trim();

      // Extract email from the text using regex
      const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
      const match = emailText.match(emailPattern);
      if (match) {
        return match[0];
      }
    }

    // Fallback method: Search for email pattern in entire body
    const text = $('body').text();
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = text.match(emailPattern);
    return matches ? matches[0] : '';
  }

  /**
   * Extract profile image URL
   */
  extractProfileImage($, nodeId) {
    const imgElement = $('img[src*="employeePhotos/Teaching/Profile"]');
    if (imgElement.length > 0) {
      const src = imgElement.attr('src');
      return src.startsWith('http') ? src : `https://backup.pondiuni.edu.in${src}`;
    }
    return `https://backup.pondiuni.edu.in/Establishment/img/employeePhotos/Teaching/Profile/${nodeId}.jpeg`;
  }

  /**
   * Extract educational qualifications
   */
  extractEducation($) {
    const education = [];

    // Look for the education table in tab_content1 (first tab)
    const educationTab = $('#tab_content1');
    if (educationTab.length) {
      // Find tables with headers that indicate education data
      educationTab.find('table').each((tableIndex, table) => {
        const headers = $(table).find('th').map((i, th) => $(th).text().toLowerCase().trim()).get();

        // Check if this is an education table by looking for degree-related headers
        const isEducationTable = headers.some(h =>
          h.includes('degree') || h.includes('qualification') || h.includes('university') ||
          h.includes('college') || h.includes('institution')
        );

        if (isEducationTable || tableIndex === 0) { // Try first table in education tab
          console.log(`Processing education table ${tableIndex}, rows found: ${$(table).find('tr').length}`);

          $(table).find('tr').slice(1).each((rowIndex, row) => {
            const cells = $(row).find('td');
            console.log(`Processing row ${rowIndex}, cells: ${cells.length}`);

            if (cells.length >= 3) {
              // Check different possible column arrangements
              let degree = '', title = '', university = '', year = '';

              if (cells.length >= 4) {
                // Possible formats: [S.No, Degree, Title, University, Year] or [Degree, Title, University, Year]
                const firstCol = $(cells[0]).text().trim();
                if (isNaN(firstCol)) { // Not S.No, start from first column
                  degree = $(cells[0]).text().trim();
                  title = $(cells[1]).text().trim();
                  university = $(cells[2]).text().trim();
                  year = $(cells[3]).text().trim();
                } else { // Has S.No column
                  degree = $(cells[1]).text().trim();
                  title = $(cells[2]).text().trim();
                  university = $(cells[3]).text().trim();
                  year = cells.length > 4 ? $(cells[4]).text().trim() : '';
                }
              } else {
                // Fallback for 3 columns
                degree = $(cells[0]).text().trim();
                university = $(cells[1]).text().trim();
                year = $(cells[2]).text().trim();
              }

              console.log(`Extracted: degree="${degree}", university="${university}", title="${title}", year="${year}"`);

              // More flexible validation - just need degree and university to be present
              if (degree && university &&
                  degree.length > 1 && university.length > 3) {

                // Optional: Additional validation for degree patterns (but don't require it)
                const isLikelyDegree = degree.toLowerCase().includes('phd') ||
                                     degree.toLowerCase().includes('m.') ||
                                     degree.toLowerCase().includes('b.') ||
                                     degree.toLowerCase().includes('master') ||
                                     degree.toLowerCase().includes('bachelor') ||
                                     degree.toLowerCase().includes('diploma') ||
                                     degree.toLowerCase().includes('certificate') ||
                                     degree.toLowerCase().includes('degree');

                // Add the education entry (even if it doesn't match common degree patterns)
                const educationEntry = {
                  degree,
                  title: title || '',
                  university,
                  graduationYear: year || ''
                };

                education.push(educationEntry);
                console.log(`Added education entry:`, educationEntry);
              } else {
                console.log(`Skipped row - missing degree or university: degree="${degree}", university="${university}"`);
              }
            } else {
              console.log(`Skipped row - insufficient cells (${cells.length})`);
            }
          });
        }
      });
    }

    return education;
  }

  /**
   * Extract areas of specialization
   * Looks for specialization in x_panel with "Area of Specializaion" heading
   * Structure: <div class="x_panel"> -> <h2>Area of Specializaion</h2> -> <div class="x_content"> -> <p>content</p>
   */
  extractSpecialization($) {
    console.log('Extracting specialization...');
    
    // Primary method: Look for the specific x_panel structure
    const specializationPanel = $('.x_panel').filter((index, panel) => {
      const h2Text = $(panel).find('h2').text().trim();
      return h2Text.toLowerCase().includes('area of specializ') || 
             h2Text.toLowerCase().includes('specialization') ||
             h2Text.toLowerCase().includes('specializaion'); // Handle typo in original
    });

    if (specializationPanel.length > 0) {
      const contentDiv = specializationPanel.find('.x_content .dashboard-widget-content p');
      if (contentDiv.length > 0) {
        const specializationText = contentDiv.text().trim();
        console.log(`Found specialization in x_panel: "${specializationText}"`);
        
        if (specializationText) {
          // Split by comma and clean up each area
          const areas = specializationText.split(',').map(area => area.trim()).filter(area => area);
          console.log(`Parsed specialization areas:`, areas);
          return areas;
        }
      }
    }

    // Fallback method: Look for h2 headings (original method)
    console.log('Trying fallback method for specialization...');
    const specializationSection = $('h2:contains("Area of Specializaion"), h2:contains("Area of Specialization")').next();
    const specializationText = specializationSection.text().trim();

    if (specializationText) {
      console.log(`Found specialization via fallback: "${specializationText}"`);
      const areas = specializationText.split(',').map(area => area.trim()).filter(area => area);
      return areas;
    }

    // Additional fallback: Search for any element containing specialization keywords
    const specializationElements = $('*:contains("e-Learning"), *:contains("Cloud Computing"), *:contains("Data Design")').first();
    if (specializationElements.length > 0) {
      const text = specializationElements.text().trim();
      if (text.includes(',')) {
        console.log(`Found specialization via keyword search: "${text}"`);
        const areas = text.split(',').map(area => area.trim()).filter(area => area);
        return areas;
      }
    }

    console.log('No specialization found');
    return [];
  }

  /**
   * Extract awards and recognition
   */
  extractAwards($) {
    const awards = [];

    // Look for awards in the education tab (tab_content1) - should be the second table
    const educationTab = $('#tab_content1');
    if (educationTab.length) {
      educationTab.find('table').each((tableIndex, table) => {
        const headers = $(table).find('th').map((i, th) => $(th).text().toLowerCase().trim()).get();

        // Check if this is an awards table
        const isAwardsTable = headers.some(h =>
          h.includes('award') || h.includes('recognition') || h.includes('honour') ||
          h.includes('achievement') || h.includes('agency')
        );

        if (isAwardsTable) {
          $(table).find('tr').slice(1).each((rowIndex, row) => {
            const cells = $(row).find('td');

            if (cells.length >= 3) {
              let title = '', type = '', agency = '', year = '', amount = '';

              // Try to map columns based on headers or content
              if (cells.length >= 4) {
                const firstCol = $(cells[0]).text().trim();
                if (isNaN(firstCol)) { // Not S.No
                  title = $(cells[0]).text().trim();
                  type = $(cells[1]).text().trim();
                  agency = $(cells[2]).text().trim();
                  year = $(cells[3]).text().trim();
                  amount = cells.length > 4 ? $(cells[4]).text().trim() : '';
                } else { // Has S.No
                  title = $(cells[1]).text().trim();
                  type = $(cells[2]).text().trim();
                  agency = $(cells[3]).text().trim();
                  year = cells.length > 4 ? $(cells[4]).text().trim() : '';
                  amount = cells.length > 5 ? $(cells[5]).text().trim() : '';
                }
              }

              if (title && agency) {
                awards.push({
                  title,
                  type: type || 'Award',
                  agency,
                  year: year || '',
                  amount: amount || ''
                });
              }
            }
          });
        }
      });
    }

    return awards;
  }

  /**
   * Extract experience information
   */
  extractExperience($) {
    // This would need to be implemented based on the actual structure
    // of experience data on the website
    return [];
  }

  /**
   * Extract publications
   */
  extractPublications($) {
    // This would need to be implemented based on the actual structure
    // of publications data on the website
    return [];
  }

  /**
   * Extract research interests
   */
  extractResearchInterests($) {
    const specialization = this.extractSpecialization($);
    return specialization; // Often research interests are similar to specialization
  }

  // Experience Section Methods
  extractTeachingExperience($) {
    console.log('Extracting teaching experience...');
    const data = [];

    // Look for Teaching Experience in tab_content2
    const teachingTab = $('#tab_content2');
    if (teachingTab.length) {
      teachingTab.find('table').each((tableIndex, table) => {
        const headers = $(table).find('th').map((i, th) => $(th).text().toLowerCase().trim()).get();
        const tableText = $(table).text().toLowerCase();

        // Check if this is teaching experience table (usually first table or contains teaching keywords)
        const isTeachingTable = 
          tableIndex === 0 || // First table in teaching tab
          tableText.includes('teaching') ||
          headers.some(h => h.includes('teaching')) ||
          $(table).prev('h3, h4, h5').text().toLowerCase().includes('teaching') ||
          headers.some(h => h.includes('designation') && h.includes('department'));

        if (isTeachingTable) {
          console.log(`Found teaching experience table (index: ${tableIndex})`);
          
          $(table).find('tr').slice(1).each((rowIndex, row) => {
            const cells = $(row).find('td');

            if (cells.length >= 3) {
              const firstCol = $(cells[0]).text().trim();
              let designation = '', department = '', institution = '', duration = '';

              if (isNaN(firstCol)) { // Not S.No
                designation = $(cells[0]).text().trim();
                department = $(cells[1]).text().trim();
                institution = $(cells[2]).text().trim();
                duration = cells.length > 3 ? $(cells[3]).text().trim() : '';
              } else { // Has S.No
                designation = $(cells[1]).text().trim();
                department = $(cells[2]).text().trim();
                institution = $(cells[3]).text().trim();
                duration = cells.length > 4 ? $(cells[4]).text().trim() : '';
              }

              // Filter to include only teaching-related positions
              if (designation && institution && 
                  (designation.toLowerCase().includes('professor') ||
                   designation.toLowerCase().includes('lecturer') ||
                   designation.toLowerCase().includes('teacher') ||
                   designation.toLowerCase().includes('teaching') ||
                   designation.toLowerCase().includes('faculty') ||
                   designation.toLowerCase().includes('instructor') ||
                   institution.toLowerCase().includes('university') ||
                   institution.toLowerCase().includes('college') ||
                   institution.toLowerCase().includes('school') ||
                   institution.toLowerCase().includes('institute'))) {
                data.push({
                  designation,
                  department: department || '',
                  institution,
                  duration: duration || ''
                });
                console.log(`Added teaching experience: ${designation} at ${institution}`);
              }
            }
          });
        }
      });
    }

    console.log(`Total teaching experience entries: ${data.length}`);
    return data;
  }

  extractResearchExperience($) {
    console.log('Extracting research experience...');
    const data = [];

    // Look for Research Experience in tab_content2 (Experience tab)
    const experienceTab = $('#tab_content2');
    if (experienceTab.length) {
      experienceTab.find('table').each((tableIndex, table) => {
        const tableText = $(table).text().toLowerCase();
        const headers = $(table).find('th').map((i, th) => $(th).text().toLowerCase().trim()).get();

        // Check if this is research experience table (usually second table or contains research keywords)
        const isResearchTable = 
          tableIndex === 1 || // Second table in experience tab
          tableText.includes('research') ||
          headers.some(h => h.includes('research')) ||
          $(table).prev('h3, h4, h5').text().toLowerCase().includes('research');

        if (isResearchTable && headers.some(h => h.includes('designation') || h.includes('institution'))) {
          console.log(`Found research experience table (index: ${tableIndex})`);
          
          $(table).find('tr').slice(1).each((rowIndex, row) => {
            const cells = $(row).find('td');

            if (cells.length >= 3) {
              const firstCol = $(cells[0]).text().trim();
              let designation = '', department = '', institution = '', duration = '';

              if (isNaN(firstCol)) { // Not S.No
                designation = $(cells[0]).text().trim();
                department = $(cells[1]).text().trim();
                institution = $(cells[2]).text().trim();
                duration = cells.length > 3 ? $(cells[3]).text().trim() : '';
              } else { // Has S.No
                designation = $(cells[1]).text().trim();
                department = $(cells[2]).text().trim();
                institution = $(cells[3]).text().trim();
                duration = cells.length > 4 ? $(cells[4]).text().trim() : '';
              }

              if (designation && institution && 
                  (designation.toLowerCase().includes('research') || 
                   institution.toLowerCase().includes('research') ||
                   department.toLowerCase().includes('research'))) {
                data.push({
                  designation,
                  department: department || '',
                  institution,
                  duration: duration || ''
                });
                console.log(`Added research experience: ${designation} at ${institution}`);
              }
            }
          });
        }
      });
    }

    // Fallback: Look for dedicated research experience sections
    if (data.length === 0) {
      const researchSections = this.extractSectionData($, [
        'Research Experience',
        'Research Background'
      ]);
      data.push(...researchSections);
    }

    console.log(`Total research experience entries: ${data.length}`);
    return data;
  }

  extractIndustryExperience($) {
    console.log('Extracting industry experience...');
    const data = [];

    // Look for Industry Experience in tab_content2 (Experience tab)
    const experienceTab = $('#tab_content2');
    if (experienceTab.length) {
      experienceTab.find('table').each((tableIndex, table) => {
        const tableText = $(table).text().toLowerCase();
        const headers = $(table).find('th').map((i, th) => $(th).text().toLowerCase().trim()).get();

        // Check if this is industry experience table (usually third table or contains industry keywords)
        const isIndustryTable = 
          tableIndex === 2 || // Third table in experience tab
          tableText.includes('industry') ||
          tableText.includes('corporate') ||
          headers.some(h => h.includes('industry') || h.includes('corporate')) ||
          $(table).prev('h3, h4, h5').text().toLowerCase().includes('industry');

        if (isIndustryTable && headers.some(h => h.includes('designation') || h.includes('institution'))) {
          console.log(`Found industry experience table (index: ${tableIndex})`);
          
          $(table).find('tr').slice(1).each((rowIndex, row) => {
            const cells = $(row).find('td');

            if (cells.length >= 3) {
              const firstCol = $(cells[0]).text().trim();
              let designation = '', department = '', institution = '', duration = '';

              if (isNaN(firstCol)) { // Not S.No
                designation = $(cells[0]).text().trim();
                department = $(cells[1]).text().trim();
                institution = $(cells[2]).text().trim();
                duration = cells.length > 3 ? $(cells[3]).text().trim() : '';
              } else { // Has S.No
                designation = $(cells[1]).text().trim();
                department = $(cells[2]).text().trim();
                institution = $(cells[3]).text().trim();
                duration = cells.length > 4 ? $(cells[4]).text().trim() : '';
              }

              if (designation && institution && 
                  !designation.toLowerCase().includes('teaching') && 
                  !designation.toLowerCase().includes('research') && 
                  (designation.toLowerCase().includes('manager') || 
                   designation.toLowerCase().includes('engineer') ||
                   designation.toLowerCase().includes('analyst') ||
                   designation.toLowerCase().includes('consultant') ||
                   institution.toLowerCase().includes('pvt') ||
                   institution.toLowerCase().includes('ltd') ||
                   institution.toLowerCase().includes('corp'))) {
                data.push({
                  designation,
                  department: department || '',
                  institution,
                  duration: duration || ''
                });
                console.log(`Added industry experience: ${designation} at ${institution}`);
              }
            }
          });
        }
      });
    }

    // Fallback: Look for dedicated industry experience sections
    if (data.length === 0) {
      const industrySections = this.extractSectionData($, [
        'Industry Experience',
        'Industrial Experience',
        'Professional Experience',
        'Corporate Experience'
      ]);
      data.push(...industrySections);
    }

    console.log(`Total industry experience entries: ${data.length}`);
    return data;
  }

  // Innovation/Patents Section Methods
  extractInnovationContributions($) {
    return this.extractSectionData($, [
      'Contribution towards Innovation',
      'Innovation',
      'Innovations',
      'Creative Contributions'
    ]);
  }

  extractPatentDetails($) {
    return this.extractSectionData($, [
      'Patent Details',
      'Patents',
      'Patent Applications',
      'Intellectual Property'
    ]);
  }

  extractUGCApprovedPapers($) {
    const data = [];

    // Look for UGC papers in tab_content3 (Innovation tab)
    const innovationTab = $('#tab_content3');
    if (innovationTab.length) {
      innovationTab.find('table').each((tableIndex, table) => {
        const headers = $(table).find('th').map((i, th) => $(th).text().toLowerCase().trim()).get();

        // Check if this is UGC papers table - typically table 8 based on our analysis
        const isUGCTable = headers.some(h =>
          h.includes('title') && h.includes('authors') && h.includes('journal') && h.includes('impact factor')
        );

        if (isUGCTable) {
          $(table).find('tr').slice(1).each((rowIndex, row) => {
            const cells = $(row).find('td');

            if (cells.length >= 5) {
              const firstCol = $(cells[0]).text().trim();
              let title = '', authors = '', journal = '', volume = '', year = '', impact = '';

              if (isNaN(firstCol)) { // Not S.No
                title = $(cells[0]).text().trim();
                authors = $(cells[1]).text().trim();
                journal = $(cells[2]).text().trim();
                volume = $(cells[3]).text().trim();
                year = $(cells[4]).text().trim();
                impact = cells.length > 5 ? $(cells[5]).text().trim() : '';
              } else { // Has S.No
                title = $(cells[1]).text().trim();
                authors = $(cells[2]).text().trim();
                journal = $(cells[3]).text().trim();
                volume = $(cells[4]).text().trim();
                year = $(cells[5]).text().trim();
                impact = cells.length > 6 ? $(cells[6]).text().trim() : '';
              }

              if (title && authors && journal) {
                data.push({
                  title,
                  authors,
                  journal,
                  volume: volume || '',
                  year: year || '',
                  impactFactor: impact || ''
                });
              }
            }
          });
        }
      });
    }

    return data;
  }

  extractNonUGCPapers($) {
    return this.extractSectionData($, [
      'Papers Published in Non UGC Approved Peer Reviewed Journals',
      'Non UGC Papers',
      'Peer Reviewed Papers'
    ]);
  }

  // Books Section Methods
  extractAuthoredBooks($) {
    return this.extractSectionData($, [
      'Books',
      'Authored Books',
      'Published Books'
    ]);
  }

  extractBookChapters($) {
    return this.extractSectionData($, [
      'Chapters in Books',
      'Book Chapters',
      'Chapters'
    ]);
  }

  extractEditedBooks($) {
    return this.extractSectionData($, [
      'Edited Books',
      'Books Edited',
      'Editorial Work'
    ]);
  }

  // Projects/Consultancy Section Methods
  extractOngoingProjects($) {
    return this.extractSectionData($, [
      'Ongoing Projects',
      'Current Projects',
      'Active Projects'
    ]);
  }

  extractOngoingConsultancy($) {
    return this.extractSectionData($, [
      'Ongoing Consultancy Works',
      'Current Consultancy',
      'Active Consultancy'
    ]);
  }

  extractCompletedProjects($) {
    return this.extractSectionData($, [
      'Completed Projects',
      'Finished Projects',
      'Past Projects'
    ]);
  }

  extractCompletedConsultancy($) {
    return this.extractSectionData($, [
      'Completed Consultancy Works',
      'Finished Consultancy',
      'Past Consultancy'
    ]);
  }

  // Research Guidance Section Methods
  extractPGGuidance($) {
    return this.extractSectionData($, [
      'Research Guidance - PG',
      'PG Guidance',
      'Postgraduate Guidance',
      'Masters Guidance'
    ]);
  }

  extractPhDGuidance($) {
    const data = [];

    // Look for PhD guidance in tab_content6 (Research Guidance tab)
    const guidanceTab = $('#tab_content6');
    if (guidanceTab.length) {
      guidanceTab.find('table').each((tableIndex, table) => {
        const headers = $(table).find('th').map((i, th) => $(th).text().toLowerCase().trim()).get();

        // Check if this is PhD guidance table
        const isPhdTable = headers.some(h =>
          (h.includes('student') && h.includes('name')) ||
          h.includes('thesis') || h.includes('registration')
        );

        if (isPhdTable) {
          $(table).find('tr').slice(1).each((rowIndex, row) => {
            const cells = $(row).find('td');

            if (cells.length >= 4) {
              const firstCol = $(cells[0]).text().trim();
              let studentName = '', regDate = '', regNo = '', thesisTitle = '', status = '', dateAwarded = '';

              if (isNaN(firstCol)) { // Not S.No
                studentName = $(cells[0]).text().trim();
                regDate = $(cells[1]).text().trim();
                regNo = $(cells[2]).text().trim();
                thesisTitle = $(cells[3]).text().trim();
                status = cells.length > 4 ? $(cells[4]).text().trim() : '';
                dateAwarded = cells.length > 8 ? $(cells[8]).text().trim() : '';
              } else { // Has S.No
                studentName = $(cells[1]).text().trim();
                regDate = $(cells[2]).text().trim();
                regNo = $(cells[3]).text().trim();
                thesisTitle = $(cells[4]).text().trim();
                status = cells.length > 5 ? $(cells[5]).text().trim() : '';
                dateAwarded = cells.length > 8 ? $(cells[8]).text().trim() : '';
              }

              if (studentName && thesisTitle) {
                data.push({
                  studentName,
                  registrationDate: regDate || '',
                  registrationNo: regNo || '',
                  thesisTitle,
                  status: status || '',
                  dateAwarded: dateAwarded || ''
                });
              }
            }
          });
        }
      });
    }

    return data;
  }

  extractPostDocGuidance($) {
    return this.extractSectionData($, [
      'Research Guidance - Post Doctoral',
      'Post Doctoral Guidance',
      'Postdoc Guidance'
    ]);
  }

  // Conference/Seminars Section Methods
  extractELectures($) {
    return this.extractSectionData($, [
      'E-Lecture Details',
      'E-Lectures',
      'Online Lectures',
      'Digital Lectures'
    ]);
  }

  extractOnlineEducation($) {
    return this.extractSectionData($, [
      'Details of Online Education Conducted',
      'Online Education',
      'Virtual Teaching'
    ]);
  }

  extractInvitedTalks($) {
    return this.extractSectionData($, [
      'Invited Talks in Conference/Seminar/Workshop/Training Programme',
      'Invited Talks',
      'Guest Lectures',
      'Keynote Speeches'
    ]);
  }

  extractOrganizedConferences($) {
    return this.extractSectionData($, [
      'Conferences/Seminars Organized',
      'Organized Conferences',
      'Conferences Organized'
    ]);
  }

  extractOrganizedWorkshops($) {
    return this.extractSectionData($, [
      'Workshop Organized',
      'Workshops Organized',
      'Training Programs Organized'
    ]);
  }

  // Collaboration Section Methods
  extractParticipationExtension($) {
    return this.extractSectionData($, [
      'Participation & Extension Activities',
      'Extension Activities',
      'Community Participation'
    ]);
  }

  extractInstitutionalCollaboration($) {
    return this.extractSectionData($, [
      'Collaboration with Institution/Industry',
      'Institutional Collaboration',
      'Industry Collaboration'
    ]);
  }

  // Programme Section Methods
  extractFacultyDevelopment($) {
    return this.extractSectionData($, [
      'Faculty Development Programme Attended (Orientation, Refresher, other Short Term Course during the year)',
      'Faculty Development Programme',
      'FDP Attended',
      'Professional Development'
    ]);
  }

  extractExecutiveDevelopment($) {
    return this.extractSectionData($, [
      'Details of Executive Development Prog/Management Development Prog. conducted',
      'Executive Development',
      'Management Development'
    ]);
  }

  extractSpecialProgrammes($) {
    return this.extractSectionData($, [
      'Participation in IMPESS, IMPRINT, SPARC, STARS, LEAP Programme etc and DSF Funding Programme',
      'Special Programmes',
      'Government Programmes',
      'IMPESS',
      'IMPRINT',
      'SPARC',
      'STARS',
      'LEAP'
    ]);
  }

  /**
   * Generic method to extract data from sections based on headings
   */
  extractSectionData($, headings) {
    const data = [];

    for (const heading of headings) {
      // Find H2 headings that match our target
      $('h2').each((index, element) => {
        const headingText = $(element).text().trim();
        if (headingText.toLowerCase().includes(heading.toLowerCase())) {
          console.log(`Found section: ${headingText}`);

          // Look for the next table after this heading
          let nextElement = $(element).next();
          while (nextElement.length && !nextElement.is('table') && !nextElement.is('h2')) {
            if (nextElement.find('table').length > 0) {
              nextElement = nextElement.find('table').first();
              break;
            }
            nextElement = nextElement.next();
          }

          if (nextElement.is('table')) {
            // Extract table data
            const tableData = this.extractTableData($, nextElement);
            data.push(...tableData);
          } else {
            // Extract text content
            const textData = this.extractTextAfterHeading($, $(element));
            data.push(...textData);
          }
        }
      });
    }

    return data;
  }

  /**
   * Extract structured data from tables
   */
  extractTableData($, table) {
    const data = [];

    $(table).find('tr').slice(1).each((rowIndex, row) => {
      const cells = [];
      $(row).find('td').each((cellIndex, cell) => {
        const cellText = $(cell).text().trim();
        if (cellText) {
          cells.push(cellText);
        }
      });

      if (cells.length > 0) {
        // Join cells with ' - ' to create a readable entry
        data.push(cells.join(' - '));
      }
    });

    return data;
  }

  /**
   * Extract text content after a heading
   */
  extractTextAfterHeading($, headingElement) {
    const data = [];
    let currentElement = headingElement.next();

    // Look at the next several elements after the heading
    for (let i = 0; i < 5 && currentElement.length; i++) {
      // Stop if we hit another H2 heading
      if (currentElement.is('h2')) {
        break;
      }

      const text = currentElement.text().trim();
      if (text && text.length > 10) {
        // Split by common delimiters and clean up
        const items = text.split(/\n|\r/).map(item => item.trim()).filter(item => item.length > 5);
        data.push(...items);
      }

      currentElement = currentElement.next();
    }

    return data;
  }

  /**
   * Find heading element by text content
   */
  findHeadingElement($, headingText) {
    const selectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'b', '.heading', '.section-title'];

    for (const selector of selectors) {
      const elements = $(selector);
      for (let i = 0; i < elements.length; i++) {
        const element = $(elements[i]);
        if (element.text().trim().toLowerCase().includes(headingText.toLowerCase())) {
          return element;
        }
      }
    }

    return $();
  }

  /**
   * Extract data that appears after a heading
   */
  extractDataAfterHeading($, headingElement) {
    const data = [];
    let currentElement = headingElement.next();

    // Look at the next several elements after the heading
    for (let i = 0; i < 10 && currentElement.length; i++) {
      const text = currentElement.text().trim();

      // Stop if we hit another heading
      if (this.isHeadingElement(currentElement)) {
        break;
      }

      // Add non-empty text content
      if (text && text.length > 3) {
        // Split by common delimiters and clean up
        const items = text.split(/\n|\r|\•|•|→|▪/).map(item => item.trim()).filter(item => item.length > 3);
        data.push(...items);
      }

      // Also check for list items
      currentElement.find('li').each((index, li) => {
        const liText = $(li).text().trim();
        if (liText && liText.length > 3) {
          data.push(liText);
        }
      });

      // Check for table rows
      currentElement.find('tr').each((index, tr) => {
        if (index > 0) { // Skip header row
          const cells = $(tr).find('td');
          if (cells.length > 0) {
            const rowData = [];
            cells.each((cellIndex, cell) => {
              const cellText = $(cell).text().trim();
              if (cellText) {
                rowData.push(cellText);
              }
            });
            if (rowData.length > 0) {
              data.push(rowData.join(' - '));
            }
          }
        }
      });

      currentElement = currentElement.next();
    }

    return data;
  }

  /**
   * Check if an element is a heading
   */
  isHeadingElement(element) {
    const tagName = element.prop('tagName');
    return tagName && /^H[1-6]$/.test(tagName.toUpperCase());
  }

  /**
   * Scrape multiple faculty members
   * @param {Array} nodeIds - Array of faculty node IDs
   * @returns {Array} Array of scraped faculty data
   */
  async scrapeMultipleFaculty(nodeIds) {
    const results = [];
    const errors = [];

    for (const nodeId of nodeIds) {
      try {
        const facultyData = await this.scrapeFacultyData(nodeId);
        results.push(facultyData);

        // Add delay to avoid overwhelming the server
        await this.delay(1000);

      } catch (error) {
        errors.push({ nodeId, error: error.message });
        console.error(`Failed to scrape node ${nodeId}:`, error.message);
      }
    }

    return {
      success: results,
      errors: errors,
      totalProcessed: nodeIds.length,
      successCount: results.length,
      errorCount: errors.length
    };
  }

  /**
   * Utility function to add delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Discover faculty node IDs by scraping the faculty directory
   * @returns {Array} Array of discovered node IDs
   */
  async discoverFacultyNodes() {
    try {
      // This would need to be implemented based on how faculty are listed
      // on the university website. You might need to scrape a faculty directory page
      console.log('Faculty node discovery would need to be implemented based on the university\'s faculty directory structure');
      return [];
    } catch (error) {
      console.error('Error discovering faculty nodes:', error);
      return [];
    }
  }
}

module.exports = FacultyDataScraper;