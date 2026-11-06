# Meeting-to-Action Bot

**An AI-powered meeting analysis and action-item extraction system built using n8n, Google Gemini, Telegram, and Google Sheets.**

## Overview

Meeting-to-Action Bot automates the process of converting meeting transcripts into structured and actionable information.

Users can submit meeting transcripts through a Telegram Bot, either as text messages or `.txt` documents. The system processes the transcript using Google Gemini, extracts important meeting information, validates the generated structured data, and stores the results in Google Sheets.

The primary objective is to reduce manual effort in meeting documentation, improve task visibility, and identify missing information, conflicting commitments, and potential project risks.

## Key Features

### Implemented Features

- **Multiple Input Methods:** Accepts meeting transcripts through Telegram text messages and TXT document uploads.
- **AI-Powered Meeting Analysis:** Uses Google Gemini to understand and analyze meeting discussions.
- **Automatic Meeting Summarization:** Generates concise meeting summaries and extracts important discussion points.
- **Decision Extraction:** Identifies decisions made during meetings.
- **Action Item Extraction:** Converts meeting commitments into individual tasks.
- **Owner Identification:** Extracts task owners when explicitly mentioned.
- **Deadline Detection:** Identifies confirmed, missing, and ambiguous deadlines.
- **Priority Classification:** Categorizes extracted tasks as High, Medium, Low, or Unknown.
- **Missing Information Detection:** Identifies unresolved questions and information requiring clarification.
- **Conflict Detection:** Identifies conflicting statements, commitments, or deadlines.
- **Risk Detection:** Highlights potential project risks based on meeting discussions.
- **Structured Data Validation:** Uses JavaScript to parse Gemini's JSON response and validate required fields before storage.
- **Meeting History Storage:** Maintains meeting-level records in Google Sheets.
- **Individual Task Storage:** Stores each extracted action item as a separate record linked to its meeting.

### Planned Enhancements

- Automated meeting reports through Telegram.
- Duplicate transcript detection.
- Enhanced error handling and input validation.
- Meeting history retrieval and comparison.
- Automated task reminders and progress tracking.
- Task dependency detection.

## Technology Stack

| Technology | Purpose |
|---|---|
| Telegram Bot API | Meeting transcript submission |
| n8n | Workflow automation and orchestration |
| Google Gemini | Natural language understanding and meeting analysis |
| JavaScript | JSON parsing, validation, and data processing |
| Google Sheets API | Meeting and action-item storage |

## System Architecture

The system follows a workflow-based architecture.

```text
                  TELEGRAM BOT
                       |
                Telegram Trigger
                       |
                  Input Switch
                  /          \
             Text Input    TXT Upload
                 |             |
             Edit Fields    Download File
                 |             |
                 |        Extract Text
                 |             |
                 |        Edit Fields
                  \           /
                   \         /
                  GEMINI AI
                       |
              Structured JSON
                       |
              JAVASCRIPT CODE
              Parsing & Validation
                       |
                Output Routing
                  /          \
                 /            \
        Meeting History     Split Out
          Google Sheets         |
                         Individual Tasks
                                |
                          Google Sheets
```

### Processing Workflow

1. **Input Reception:** Telegram receives a text transcript or TXT document.
2. **Input Routing:** n8n identifies the type of input and routes it to the appropriate branch.
3. **Transcript Extraction:** Text messages are passed directly, while TXT documents are downloaded and converted into text.
4. **Input Normalization:** Both branches produce a common input structure containing the transcript and Telegram metadata.
5. **AI Analysis:** Google Gemini analyzes the transcript and generates structured meeting information.
6. **JSON Processing:** A JavaScript Code node parses the response and validates the required fields and data structures.
7. **Meeting Identification:** A meeting ID is generated using the Telegram chat ID and message ID.
8. **Meeting Storage:** Meeting-level information is appended to the Meeting History worksheet.
9. **Task Separation:** The Split Out node separates the extracted action-item array into individual records.
10. **Action Item Storage:** Each task is appended as a separate row in the Action Items worksheet.

## AI Analysis Output

The system extracts the following information from meeting transcripts:

| Field | Description |
|---|---|
| Meeting Title | Identified meeting title |
| Meeting Summary | Concise summary of the meeting |
| Discussion Points | Important topics discussed |
| Decisions | Decisions made during the meeting |
| Action Items | Tasks and commitments |
| Owner | Person responsible for each task |
| Deadline | Associated task deadline |
| Deadline Status | Confirmed, Missing, or Ambiguous |
| Owner Status | Assigned or Missing |
| Priority | High, Medium, Low, or Unknown |
| Open Questions | Unresolved questions |
| Clarifications Required | Information requiring confirmation |
| Conflicts Detected | Conflicting commitments or statements |
| Risks | Potential project risks |

The analysis is designed to avoid fabricating information. Missing owners and deadlines are represented explicitly rather than being guessed.

## Google Sheets Data Storage

The system maintains two worksheets.

### 1. Meeting History

Stores one record per processed meeting submission.

It includes:
- Meeting ID
- Meeting Title
- Meeting Date
- Summary
- Discussion Points
- Decisions
- Open Questions
- Clarifications Required
- Conflicts
- Risks
- Processing Status
- Telegram User
- Transcript Hash

### 2. Action Items

Stores each extracted task individually.

It includes:
- Task ID
- Meeting ID
- Meeting Date
- Task
- Owner
- Deadline
- Owner Status
- Deadline Status
- Priority
- Task Status

The Meeting ID connects individual action items to their corresponding meeting record.

## Supported Languages

The AI analysis prompt is designed to understand:

- English
- Hindi
- Hinglish

The extracted structured output is generated in English.

## Setup and Configuration

### Prerequisites

- An n8n instance or account.
- A Telegram account.
- A Telegram Bot Token from BotFather.
- A Google Gemini API key.
- A Google account with Google Sheets access.

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/YOUR-USERNAME/meeting-to-action-bot.git
cd meeting-to-action-bot
```

**2. Import the n8n workflow**

- Open your n8n instance.
- Create a new workflow or open the workflow import option.
- Import `workflows/meeting-to-action-bot.json`.

**3. Configure credentials**

Set up the following credentials in n8n:

- Telegram Bot API credentials.
- Google Gemini API credentials.
- Google Sheets OAuth2 credentials.

Do not store actual API keys or tokens in the repository.

**4. Configure Google Sheets**

Create a spreadsheet with two worksheets:

- `Meeting History`
- `Action Items`

Use the column headers documented in the repository's `docs/google-sheets-schema.md`.

Select the spreadsheet and corresponding worksheets in the Google Sheets nodes.

**5. Activate the workflow**

Save the workflow, configure the Telegram Trigger, and activate it.

Send a meeting transcript to your Telegram Bot to test the pipeline.

## Testing

The system can be tested using different types of meeting transcripts.

Recommended test scenarios:

- Meetings with clearly assigned tasks and deadlines.
- Meetings with missing task owners.
- Meetings with ambiguous or tentative deadlines.
- Meetings containing conflicting commitments.
- Meetings containing unresolved decisions.
- Meetings with multiple participants and several action items.
- English, Hindi, and Hinglish transcripts.

Sample transcripts are available in the `test-data/` directory.

## Project Structure

```text
meeting-to-action-bot/
│
├── README.md
├── .gitignore
│
├── workflows/
│   └── meeting-to-action-bot.json
│
├── prompts/
│   └── meeting-analysis-prompt.md
│
├── code/
│   └── validate-and-structure.js
│
├── test-data/
│   ├── sample-transcript-1.txt
│   ├── sample-transcript-2.txt
│   └── sample-transcript-3.txt
│
└── docs/
    ├── architecture.md
    ├── workflow-overview.png
    └── google-sheets-schema.md
```

## Security Considerations

- Never commit Telegram Bot Tokens or Gemini API keys.
- Configure credentials securely through n8n.
- Avoid uploading private meeting transcripts or personally identifiable information.
- Use synthetic or anonymized data for public demonstrations.

## Current Development Status

The core transcript-processing and Google Sheets storage pipeline has been implemented and tested with both Telegram text messages and TXT document uploads.

Telegram report generation, duplicate detection, and additional automation capabilities remain under development.

## Future Scope

Potential future improvements include:

- Automated Telegram meeting reports.
- Duplicate transcript prevention.
- Meeting history search and retrieval.
- Task progress tracking.
- Deadline-based reminders.
- Task dependency identification.
- Meeting-to-meeting comparison.
- Enhanced multilingual analysis.

## License

This project is developed as an academic/hackathon project. Licensing details can be added according to the team's chosen distribution terms.
