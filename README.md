# VedaAI — AI Assessment Extraction & Answer Mapping

A teacher can upload a question paper and a student's handwritten answer sheet. The application extracts questions and answers, maps them together, grades the responses, and highlights the corresponding answer regions directly on the answer sheet.

**Live Demo:** `<DEPLOYED_URL>`

---

## Features

- Question paper and answer sheet upload (PDF/images)
- Question and labelled sub-part extraction
- Original question numbering and marks preservation
- Handwritten answer extraction
- Semantic question-to-answer mapping
- Out-of-order answer handling
- Unanswered question handling
- Unmatched answer handling
- Multi-page answer support
- Exact answer-region highlighting
- Per-question grading
- AI-generated feedback
- PDF zoom, pan and page navigation
- Result persistence across refresh

---

## How It Works

**Question Paper**
→ Google Cloud Vision OCR
→ Question Extraction

**Answer Sheet**
→ Google Cloud Vision OCR + bounding boxes
→ Answer Block Grouping

**Questions + Answer Blocks**
→ Semantic Mapping
→ Grading + Feedback

**Mapped Answer Blocks + Original OCR Bounding Boxes**
→ Exact Highlight Regions

The AI is responsible for semantic understanding and mapping, but it does NOT generate highlight coordinates. Highlight regions are calculated from the original bounding boxes returned by Google Cloud Vision. This keeps the visual highlighting tied to the actual OCR output.

---

## Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Google Cloud Vision API
- Groq (`qwen/qwen3.8-27b`)
- React-PDF
- Zod

---

## Edge Cases Handled

- Labelled sub-parts such as `1(a)` and `1(b)`
- Answers written out of order
- Questions left unanswered
- Content that cannot be matched to a question
- Answers spanning multiple pages
- Partial/weak answers for grading

---

## Local Setup

```bash
git clone <repository-url>
cd <project-folder>
npm install
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
GROQ_API_KEY=your_value_here
AI_MODEL_GROQ=qwen/qwen3.8-27b
GOOGLE_CLOUD_PROJECT_ID=your_value_here
GOOGLE_CLOUD_CLIENT_EMAIL=your_value_here
GOOGLE_CLOUD_PRIVATE_KEY=your_value_here
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Browser Persistence

No application database or authentication is required.

- Processed result JSON → `localStorage`
- Uploaded files → IndexedDB
- Results scoped using generated exam ID
- `/exams/result/[id]`
- 24-hour TTL
- Expired/missing results redirect back to `/exams`

---

## Assumptions & Limitations

- OCR accuracy depends on handwriting/image quality.
- Mapping and grading quality depend on the extracted text and AI model.
- Results are browser-local rather than stored in a backend database.
- Stored results expire after 24 hours.
- No authentication is implemented because it is outside the assignment scope.
- Google Vision PDF processing may have file size/page limitations depending on the Vision API tier.

---

## Assignment Requirements Coverage

| Requirement               | Status |
| ------------------------- | ------ |
| Question extraction       | ✅      |
| Labelled sub-parts        | ✅      |
| Answer extraction         | ✅      |
| Out-of-order mapping      | ✅      |
| Unanswered questions      | ✅      |
| Unmatched answers         | ✅      |
| Exact-region highlighting | ✅      |
| Multi-page answers        | ✅      |
| Grading & AI feedback     | ✅      |
