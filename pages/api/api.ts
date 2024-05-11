import { NextApiRequest, NextApiResponse } from 'next';
/*
  Purpose
    ● Streamline the project planning process for developers, making it easier to create  clear and organized outlines.
    ● Empowers developers and other technical professionals to obtain a
    comprehensive guide for project development, from initial conception to final
      implementation
    Features:
● Project Requirements Analysis:
○ Analyze user-provided project descriptions and automatically identify key
functional and non-functional requirements.
○ Suggest relevant considerations based on project type and complexity
(e.g., security needs for financial applications, accessibility requirements
for educational platforms).
● Technology Recommendation:
○ Based on the project requirements, recommend suitable programming
languages, frameworks, libraries, and tools for development.
○ Consider factors like project complexity, platform compatibility, and
developer expertise.
● To-Do List Generation:
○ Break down the development process into a structured to-do list with clear
steps and subtasks.
○ Provide estimated timelines for different development phases based on
project scope and complexity.
● Resource Recommendations:
○ Provide search hints and keywords to guide users towards finding
additional resources specific to their project needs.
Example:
Input:
I want to build a webpage where I can buy or sell 3D printing blueprints. I also
want to use the paypal platform to do the transactions.
Output:
Project Requirements:
Functional Requirements:
● Users can browse and search for 3D printing blueprints.
● Sellers can upload and manage their blueprints for sale.
● Buyers can purchase blueprints securely using PayPal.
● Implement a download system for purchased blueprints.
● User accounts and login functionality for managing purchases and sales.
● Implement a search and filtering system for blueprints based on categories,
materials, etc.
Non-Functional Requirements:
● Ensure a responsive and user-friendly interface across different devices.
● Secure user data and transactions with proper encryption and access control.
● Implement a scalable architecture to handle potential growth in users and
transactions.
Development Environment Setup:
● Choose a web development framework like Django (Python), Ruby on Rails, or
Node.js with Express.
● Select a database solution like MySQL or PostgreSQL to store user data,
blueprints, and transaction details.
● Consider using cloud hosting services like AWS or Google Cloud Platform for
scalability and reliability.
To-Do List:
Implementation:
● Front-end Development:
○ Design an intuitive user interface for browsing, searching, and purchasing
blueprints.
○ Integrate a user registration and login system.
○ Implement a shopping cart and checkout functionality.
○ Develop a secure download system for purchased blueprints.
● Back-end Development:
○ Build API endpoints for user management, blueprint upload/download, and
payment processing.
○ Integrate with the chosen PayPal API for secure transactions.
○ Store user data, blueprint details, and transaction history securely in the
database.
● Tool Ideas:
○ Front-end: React, Vue.js, or Angular for building interactive UI
components.
○ Back-end: Django REST framework, Rails API, or Express.js for building
APIs.
○ Cloud Hosting: AWS, Google Cloud Platform, Heroku.
Data Management:
● Design a data model to efficiently store user information, blueprint details
(metadata, files), and transaction records.
● Implement security measures like data encryption and access control to protect
sensitive user data and financial information.
Testing and Quality Assurance:
● Conduct thorough unit testing of individual functionalities.
● Perform integration testing to ensure different components work together
seamlessly.
● Conduct user acceptance testing to gather feedback and refine the user
experience.
● Utilize testing frameworks like JUnit (Python), RSpec (Ruby), or Jest
(JavaScript).
Deployment and Maintenance:
● Deploy the application to a chosen web hosting platform following their
guidelines.
● Implement a maintenance plan for addressing bugs, security vulnerabilities, and
new feature updates.
● Regularly monitor system performance and user feedback for continuous
improvement.
Additional Considerations:
● New Functionalities:
○ Implement a rating and review system for blueprints to improve user trust
and decision-making.
○ Integrate with 3D model viewers to allow users to preview blueprints
before purchase.
○ Consider offering additional services like 3D printing on demand for
purchased blueprints.
● User Needs:
○ Gather feedback from potential users throughout the development process
to ensure the platform caters to their specific needs and preferences.
○ Consider offering different pricing models (e.g., one-time purchase,
subscription) to cater to diverse user preferences.
Resources:
● Search for tutorials and documentation on chosen web development frameworks,
database technologies, and PayPal integration.
● Explore existing open-source projects and libraries for e-commerce functionality
and 3D model viewing.
● Utilize online communities and forums to connect with other developers and get
help with specific challenges.
General Output Model:
Project Requirements:
● Functional Requirements: Clearly define the core functionalities your project
must deliver. This will vary significantly based on the project's purpose (e.g., data
analysis, user interaction, content management).
● Non-Functional Requirements: Specify performance, security, usability, and
accessibility considerations. These will influence the technical choices made
during development (e.g., speed, data encryption, user interface design).
● Development Environment Setup: Briefly mention necessary tools and
knowledge required to set up your development environment. This might include
chosen platforms (web, mobile, desktop), programming languages, and any
specific frameworks or libraries.
To-Do List:
● Implementation:
○ Break down the development process into clear steps:
■ Choose appropriate technologies and tools based on project needs
(e.g., programming languages, frameworks, libraries). Consider
factors like project complexity, platform compatibility, and developer
expertise.
■ Design a user interface that is intuitive and user-friendly. Prioritize
ease of use and clear navigation for a positive user experience.
■ Implement the core functionalities as defined in the requirements.
This may involve building features, integrating APIs, or developing
algorithms.
○ Tool Ideas:
■ Web Development: Explore libraries like React, Angular, or Vue.js
for building interactive web applications. Consider Node.js for
server-side development and APIs.
■ Mobile Development: Choose frameworks like Kotlin/Java for
Android or Swift for iOS depending on your target platform.
● Data Management:
○ Select a suitable data storage solution based on data volume, access
patterns, and security needs. Options include:
■ Databases: Consider relational databases like MySQL or
PostgreSQL for structured data, or NoSQL databases like
MongoDB for flexible data structures.
■ File Systems: For simpler projects, storing data in files can be
sufficient.
○ Design a data model that efficiently stores and manages your project's
data. This involves defining the structure and relationships between
different data elements.
○ Implement security measures to protect sensitive data. This includes
encryption, access control, and vulnerability management.
● Testing and Quality Assurance:
○ Conduct thorough testing to ensure the project functions as intended
across different platforms and scenarios. Utilize various testing methods:
■ Unit testing: Test individual components of your code.
■ Integration testing: Test how different components interact with
each other.
■ User acceptance testing: Get user feedback to ensure the project
meets their needs.
○ Utilize testing frameworks and tools to automate repetitive tasks and
identify potential issues. Popular options include JUnit (Java), XCTest
(iOS), and Selenium for web applications.
● Deployment and Maintenance:
○ Follow platform-specific guidelines for deployment. This may involve app
store submissions for mobile apps or web hosting services for web
applications.
○ Implement a maintenance plan for addressing bugs, security
vulnerabilities, and new feature updates. This ensures your project
remains functional and up-to-date.
Additional Considerations:
● New Functionalities: Consider innovative features that could enhance your
project's value and user experience. This could involve integrating AI, machine
learning, or advanced data analysis tools.
● User Needs: Take note of potential user needs that may not be immediately
apparent in the initial requirements. Gather user feedback throughout the
development process to refine your project and ensure it meets their
expectations.
Resources:
● Provide search hints and keywords to guide users towards finding relevant tools,
libraries, and resources based on their specific project needs. This empowers
them to explore and choose the most suitable options for their development
environme
*/
// set limit of body size to 2mb
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
  },
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end(); // Preflight request
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }
  const { projectDescription } = req.body;
  console.log(req.body);
  try {
    const prompt = `Given the provided project description, generate a comprehensive outline outlining the project requirements, recommended technologies, to-do list for development, and additional considerations. Please ensure that the output includes both functional and non-functional requirements, along with suitable technology recommendations and development steps.Please use the format\n\n
    Project Requirements:\n
    \tFunctional Requirements:\n
    ...
    ...\n
    \tNon-Functional Requirements:\n
    ...
    ...\n
    Development Environment Setup:\n
    ...
    ...\n
    To-Do List:\n
    ...
    ...\n
    Resource Recommendations:\n
    ...
    ...\n
    \n\n
    ## These points are only for reference, please generate the output based on the provided project description\n\n
    use markdown syntax for better formatting\n\n
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: prompt,
          },
          {
            role: 'user',
            content: projectDescription,
          },
        ],
        model: 'gpt-4-vision-preview',
        max_tokens: 3000,
        temperature: 1,
        stop: '',
      }),
    });
    const data = await response.json();
    console.log(data);
    let output = data.choices[0].message.content;
    output = output;
    res.status(200).json({
      text: output,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Something went wrong.',
    });
  }
}
