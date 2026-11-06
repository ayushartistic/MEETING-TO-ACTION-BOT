
const rawOutput = $json.text;

// 1. Parse Gemini's JSON response
let meetingData;

try {
  meetingData = JSON.parse(rawOutput);
} catch (error) {
  throw new Error(
    "Invalid JSON received from Gemini: " + error.message
  );
}

// 2. Validate required top-level fields
const requiredFields = [
  "meeting_title",
  "meeting_summary",
  "discussion_points",
  "decisions",
  "action_items",
  "open_questions",
  "clarifications_required",
  "conflicts_detected",
  "risks"
];

for (const field of requiredFields) {
  if (!(field in meetingData)) {
    throw new Error(`Missing required field: ${field}`);
  }
}

// 3. Validate array fields
const arrayFields = [
  "discussion_points",
  "decisions",
  "action_items",
  "open_questions",
  "clarifications_required",
  "conflicts_detected",
  "risks"
];

for (const field of arrayFields) {
  if (!Array.isArray(meetingData[field])) {
    throw new Error(`${field} must be an array`);
  }
}

// 4. Validate individual action items
for (const [index, item] of meetingData.action_items.entries()) {
  const requiredActionFields = [
    "task",
    "owner",
    "deadline",
    "deadline_status",
    "owner_status",
    "priority"
  ];

  for (const field of requiredActionFields) {
    if (!(field in item)) {
      throw new Error(
        `Action item ${index + 1} is missing ${field}`
      );
    }
  }

  if (!["Confirmed", "Missing", "Ambiguous"].includes(item.deadline_status)) {
    throw new Error(`Invalid deadline_status in action item ${index + 1}`);
  }

  if (!["Assigned", "Missing"].includes(item.owner_status)) {
    throw new Error(`Invalid owner_status in action item ${index + 1}`);
  }

  if (!["High", "Medium", "Low", "Unknown"].includes(item.priority)) {
    throw new Error(`Invalid priority in action item ${index + 1}`);
  }
}

// 5. Validate conflict and risk records
for (const [index, conflict] of meetingData.conflicts_detected.entries()) {
  if (
    typeof conflict.conflict !== "string" ||
    !Array.isArray(conflict.involved_participants) ||
    typeof conflict.explanation !== "string" ||
    !["High", "Medium", "Low"].includes(conflict.severity)
  ) {
    throw new Error(`Invalid conflict record at index ${index}`);
  }
}

for (const [index, risk] of meetingData.risks.entries()) {
  if (
    typeof risk.risk !== "string" ||
    typeof risk.reason !== "string" ||
    !["High", "Medium", "Low"].includes(risk.severity)
  ) {
    throw new Error(`Invalid risk record at index ${index}`);
  }
}

// 6. Retrieve normalized input metadata
const telegramData = $("Edit Fields").isExecuted
  ? $("Edit Fields").item.json
  : $("Edit Fields1").item.json;

// 7. Generate a deterministic meeting ID
const meetingId =
  `M-${telegramData.chat_id}-${telegramData.message_id}`;

// 8. Return the complete structured output
return {
  json: {
    ...telegramData,
    ...meetingData,
    meeting_id: meetingId
  }
};
