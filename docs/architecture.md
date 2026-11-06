
# System Architecture

## 1. Project Overview

Meeting-to-Action Bot is an AI-powered meeting analysis and task extraction system. It processes meeting transcripts submitted through Telegram, uses Google Gemini to analyze meeting discussions, and stores the extracted information in Google Sheets.

The system aims to reduce manual effort in preparing meeting summaries, identifying decisions, tracking action items, and detecting missing information.

## 2. Technology Stack

| Component | Technology | Purpose |
|---|---|---|
| Input Interface | Telegram Bot | Receives meeting transcripts |
| Workflow Automation | n8n | Controls the processing pipeline |
| AI Model | Google Gemini | Analyzes meeting transcripts |
| Data Processing | JavaScript | Parses and validates AI output |
| Database / Storage | Google Sheets | Stores meeting history and action items |

## 3. System Architecture

The system follows a workflow-based architecture.

### Processing Pipeline

1. **Input Reception:** The Telegram Bot receives either a text transcript or a TXT document.
2. **Input Routing:** An n8n Switch node identifies the input type and directs it to the appropriate processing branch.
3. **Transcript Extraction:** Text messages are processed directly, while uploaded TXT documents are downloaded and their contents extracted.
4. **Input Normalization:** Both branches produce a common data structure containing the transcript and Telegram metadata.
5. **AI Analysis:** Google Gemini analyzes the transcript and generates structured meeting information.
6. **Data Validation:** A JavaScript Code node parses the generated JSON, validates required fields, and generates a meeting ID.
7. **Meeting Storage:** Meeting-level information is appended to the Meeting History worksheet.
8. **Action Item Processing:** A Split Out node separates the action-item array into individual records.
9. **Task Storage:** Each extracted action item is appended as an individual row in the Action Items worksheet.

## 4. AI Analysis Capabilities

The Gemini analysis stage extracts:

- Meeting title and summary
- Discussion points
- Decisions
- Action items
- Task owners
- Deadlines and deadline status
- Owner assignment status
- Task priority
- Open questions
- Required clarifications
- Conflicts between participants or commitments
- Potential project risks

The system is designed to preserve uncertainty rather than invent missing information.

## 5. Data Flow

The system maintains two separate storage structures:

- **Meeting History:** Stores one record for each processed meeting transcript.
- **Action Items:** Stores individual tasks extracted from the corresponding meeting.

Each action item is associated with its meeting through a Meeting ID.

## 6. Current Implementation Status

### Implemented
- Telegram text input
- TXT document input
- Input routing and transcript extraction
- Gemini-based meeting analysis
- Structured JSON generation
- JavaScript parsing and validation
- Meeting ID generation
- Meeting History storage
- Individual Action Items storage

### Planned
- Automated Telegram meeting reports
- Duplicate transcript detection
- Enhanced error handling
- Additional validation and testing
