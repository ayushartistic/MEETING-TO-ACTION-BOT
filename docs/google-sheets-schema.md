
# Google Sheets Database Schema

## Overview

The project uses Google Sheets as its storage layer.

Two worksheets are maintained:

1. Meeting History
2. Action Items

The Meeting ID establishes the relationship between meeting records and their extracted tasks.

---

## 1. Meeting History

This worksheet stores meeting-level information.

| Column | Description |
|---|---|
| Meeting ID | Unique identifier generated for the Telegram message |
| Meeting Title | Extracted meeting title |
| Meeting Date | Meeting date, when available |
| Summary | AI-generated meeting summary |
| Discussion Points | Important topics discussed |
| Decisions | Decisions identified from the transcript |
| Open Questions | Questions that remain unresolved |
| Clarifications Required | Information requiring further confirmation |
| Conflicts | Detected conflicting statements or commitments |
| Risks | Potential risks identified during analysis |
| Processing Status | Indicates whether processing succeeded |
| Telegram User | Telegram user ID associated with the submission |
| Transcript Hash | Reserved for duplicate transcript detection |

---

## 2. Action Items

This worksheet stores individual tasks extracted from meetings.

Each action item is stored as a separate row.

| Column | Description |
|---|---|
| Task ID | Identifier associated with an extracted task |
| Meeting ID | ID linking the task to its meeting |
| Meeting Date | Meeting date, when available |
| Task | Description of the action item |
| Owner | Person responsible for the task |
| Deadline | Extracted deadline or estimate |
| Owner Status | Indicates whether the owner is assigned or missing |
| Deadline Status | Indicates whether the deadline is confirmed, missing, or ambiguous |
| Priority | High, Medium, Low, or Unknown |
| Task Status | Initial task status, defaulting to Pending |

---

## 3. Relationship Between Worksheets

One meeting can produce multiple action items.

The relationship is therefore:

**Meeting History (1) → Action Items (Many)**

The Meeting ID acts as the linking field.

---

## 4. Storage Behaviour

- A meeting record is appended to Meeting History after successful processing.
- The action-item array is separated into individual records.
- Each extracted task is appended to Action Items.
- Newly extracted tasks receive the initial status Pending.

Note: Duplicate transcript prevention and automated task-status updates are planned enhancements.
