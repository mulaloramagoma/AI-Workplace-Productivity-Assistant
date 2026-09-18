# 🤖 AI Workplace Productivity Assistant

An AI-powered workplace productivity assistant developed as part of the **AI Skills Acceleration Programme**.

The project is designed to help employees automate and simplify common workplace activities such as writing emails, summarising meetings, planning tasks, conducting research, and interacting with an AI chatbot.

🔗 **Live Application:** https://ai-assist-hub-24.lovable.app/  
🔗 **GitHub Repository:** https://github.com/mulaloramagoma/AI-Workplace-Productivity-Assistant

---

## 📌 Project Overview

The **AI Workplace Productivity Assistant** is a web-based application that combines several practical AI tools into one easy-to-use dashboard.

The main goal of the project is to demonstrate how Artificial Intelligence can be applied to everyday workplace activities to improve productivity, reduce repetitive work, and help users organise information more effectively.

The application provides five main AI-powered tools:

1. 📧 Email Generator
2. 📝 Meeting Summarizer
3. ✅ Task Planner
4. 🔎 Research Assistant
5. 💬 AI Chatbot

The application also includes an **About / Help** section that provides guidance on responsible and ethical AI usage.

---

## 🎯 Project Objectives

The objectives of this project are to:

- Apply AI tools to practical workplace scenarios.
- Demonstrate effective prompt engineering.
- Automate repetitive workplace tasks.
- Improve productivity and organisation.
- Provide users with structured AI-generated outputs.
- Demonstrate responsible and ethical use of Artificial Intelligence.
- Build a functional and user-friendly AI application.
- Gain practical experience using AI-assisted development tools.

---

## ✨ Features

### 📧 1. Email Generator

The Email Generator helps users create professional workplace emails from a purpose and a few key points.

Users can provide:

- Recipient information
- Purpose of the email
- Email type
- Key points
- Preferred tone
- Additional instructions

Available tones include:

- Professional
- Friendly
- Formal
- Concise

The generated email can be reviewed, copied, cleared, or regenerated.

**Example use cases:**

- Requesting information
- Following up on a task
- Sending a workplace update
- Writing a professional response
- Communicating with colleagues or customers

---

### 📝 2. Meeting Summarizer

The Meeting Summarizer converts meeting notes or transcripts into an organised summary.

It can produce:

- Meeting summary
- Key discussion points
- Decisions made
- Action items
- Task owners
- Deadlines
- Outstanding questions

The tool is designed to keep the generated summary grounded in the information provided by the user rather than inventing information.

**Example use case:**

A user can paste meeting notes into the application and receive a structured summary that makes it easier to understand what was discussed and what actions need to be taken.

---

### ✅ 3. Task Planner

The Task Planner helps users break a larger goal into smaller and more manageable tasks.

Users provide:

- A goal
- A timeframe
- Available resources

The assistant can then organise the work into a table containing:

| Information | Description |
|---|---|
| Task | The activity that needs to be completed |
| Description | Explanation of the task |
| Priority | Importance of the task |
| Suggested Deadline | Suggested completion date |
| Dependencies | Tasks that need to happen first |
| Estimated Effort | Approximate amount of work required |

The tool can help users structure projects and organise their workload.

---

### 🔎 4. Research Assistant

The Research Assistant helps users explore a topic and organise their initial research.

Users can request sections such as:

- Summary
- Key points
- Pros and cons
- Questions to investigate
- Research outline

The application distinguishes between information provided by the user and AI-generated suggestions.

AI-generated inferences are labelled as **"AI suggestion:"** to make the distinction clearer.

This helps encourage users to verify information instead of automatically treating AI-generated content as fact.

---

### 💬 5. AI Chatbot

The AI Chatbot provides a conversational interface where users can ask questions and continue a conversation.

The chatbot includes:

- User and assistant messages
- Loading indicators
- Copy response functionality
- Clear conversation functionality

It can be used for general workplace assistance, brainstorming, explanations, and other productivity-related questions.

---

## 🧠 Prompt Engineering

Prompt engineering is an important part of this project.

The AI service uses structured prompts designed around several components:

- **Role** – Defines what the AI should act as.
- **Task** – Explains what the AI needs to do.
- **Context** – Provides the relevant information.
- **Output Format** – Specifies how the response should be structured.
- **Constraints** – Defines limitations the AI must follow.

For example, the Meeting Summarizer is instructed to work from the supplied meeting notes and avoid inventing names, dates, figures, or other information that is not provided.

This approach helps make AI responses more consistent, structured, and useful.

---

## 🛡️ Responsible and Ethical AI

Responsible AI is an important part of this project.

The application reminds users that AI-generated content should be treated as a **draft rather than a final decision**.

Users are encouraged to:

- Review AI-generated content before using it.
- Verify names, dates, numbers, and commitments.
- Avoid entering confidential or sensitive information.
- Check important information against reliable sources.
- Use human judgement when making decisions.
- Disclose AI assistance where organisational policies require it.

The application also includes safeguards designed to reduce unsupported AI-generated information.

For example:

- Missing information can be identified as **"Not specified."**
- AI inferences can be labelled as **"AI suggestion."**
- The system is designed not to invent names, dates, or figures.

The project's guiding principle is:

> **Human oversight first.**

---

## 🛠️ Technology Stack

The project was developed using modern web technologies and an AI-assisted development approach.

### Frontend

- React 19
- TypeScript
- TanStack Start
- Tailwind CSS
- shadcn/ui
- Lucide React

### AI Integration

The application uses a server-side AI service layer that communicates with an **OpenAI-compatible API endpoint**.

### Development Platform

- Lovable
- GitHub
- AI-assisted development
- Prompt engineering

---

## 🏗️ Project Architecture

The project separates the user interface from the AI service layer.

The main structure includes:

```text
src/
├── components/
│   ├── AppLayout
│   └── ResultPanel
│
├── lib/
│   ├── ai.server.ts
│   ├── ai.functions.ts
│   └── use-ai.ts
│
└── routes/
    ├── index
    ├── email
    ├── meetings
    ├── tasks
    ├── research
    ├── chat
    └── about
```

### AI Service Layer

The `ai.server.ts` file contains the main AI integration.

It includes:

- AI prompt templates
- AI API communication
- Groundedness rules
- Error handling
- Streaming responses

The `ai.functions.ts` file exposes the AI functionality through validated server functions.

The `use-ai.ts` file provides a React hook used by the application's pages.

---

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/mulaloramagoma/AI-Workplace-Productivity-Assistant.git
```

### 2. Open the project

```bash
cd AI-Workplace-Productivity-Assistant
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file based on `.env.example`.

Example:

```env
AI_API_URL=https://your-openai-compatible-api-endpoint/v1
AI_API_KEY=your_api_key
AI_MODEL=your_model_name
```

**Important:** API keys should be kept private and should never be committed to GitHub.

### 5. Start the development server

```bash
npm run dev
```

The application will then be available through the local development server.

---

## 🧪 Demo Mode

The application can also operate in **demo mode** when an AI API key is not configured.

In demo mode, the application provides clearly labelled sample responses so that users can explore the interface and functionality without immediately connecting an AI API.

---

## 📱 User Experience

The application uses a responsive dashboard design intended to work across different screen sizes.

The dashboard provides quick access to all five productivity tools:

```text
AI Workplace Productivity Assistant
│
├── Dashboard
├── Email Generator
├── Meeting Summarizer
├── Task Planner
├── Research Assistant
├── AI Chatbot
└── About / Help
```

The interface is designed to make the tools easy to navigate for users who may not have advanced technical knowledge.

---

## 💼 Workplace Applications

The project demonstrates how AI can support different workplace activities.

### Communication

The Email Generator can help employees prepare professional communication.

### Meetings

The Meeting Summarizer can help turn meeting notes into structured information.

### Project Management

The Task Planner can help break larger goals into manageable activities.

### Research

The Research Assistant can help users structure their initial research.

### General Assistance

The AI Chatbot provides a conversational interface for workplace questions and brainstorming.

---

## 📚 Skills Demonstrated

This project demonstrates practical skills in:

- Artificial Intelligence
- Prompt Engineering
- AI-assisted software development
- Web application development
- React
- TypeScript
- User Interface Design
- API integration
- Git and GitHub
- Problem solving
- Responsible AI
- Workplace automation

---

## 🎓 AI Skills Acceleration Programme

This project was created as part of the **AI Skills Acceleration Programme**.

It demonstrates the practical application of AI tools and prompt engineering to solve workplace problems.

The project focuses on using AI as a productivity tool while maintaining **human oversight, responsible use, and verification of AI-generated information**.

---

## 🚀 Future Improvements

Possible future improvements include:

- User authentication
- Saving previous AI conversations
- Exporting generated content to PDF or Word
- Integration with email platforms
- Calendar integration
- Advanced task management
- Real-time web research
- File upload and document analysis
- Voice interaction
- Custom workplace AI assistants
- Additional AI models
- Improved analytics and productivity tracking

---

## ⚠️ Disclaimer

This application provides AI-generated assistance and should not replace human judgement.

Users should review and verify AI-generated content before sending, sharing, or using it for important workplace decisions.

Do not enter confidential, private, or sensitive information unless the application's security and data-handling arrangements have been appropriately verified.

---

## 👨‍💻 Project Author

**Mulalo Donald Ramagoma**

AI Skills Acceleration Programme

GitHub:  
https://github.com/mulaloramagoma/

---

## 🔗 Project Links

**Live Application:**  
https://ai-assist-hub-24.lovable.app/

**GitHub Repository:**  
https://github.com/mulaloramagoma/AI-Workplace-Productivity-Assistant

---

## ⭐ Conclusion

The **AI Workplace Productivity Assistant** demonstrates how Artificial Intelligence and prompt engineering can be combined to create practical workplace productivity tools.

By bringing email generation, meeting summarisation, task planning, research assistance, and conversational AI into one application, the project provides a practical example of how AI can assist employees with everyday tasks while keeping **human review and responsible AI use at the centre of the workflow**.
