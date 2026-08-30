const DB_NAME = "veda-exams"
const DB_VERSION = 1
const FILES_STORE = "examFiles"
const LOCAL_STORAGE_PREFIX = "veda-exam:"
const SELECTED_QUESTION_PREFIX = "veda-exam-selected-question:"
const TTL_MS = 24 * 60 * 60 * 1000

export interface ExamFiles {
  questionPaper: File
  answerSheet: File
}

export interface ExamRecord {
  id: string
  createdAt: string
  expiresAt: number
  questionPaper: {
    name: string
    type: string
  }
  answerSheet: {
    name: string
    type: string
  }
  result: unknown
}

/** Whether a stored exam result has passed its 24-hour TTL. */
export function isExamExpired(record: ExamRecord): boolean {
  return typeof record.expiresAt === "number" && Date.now() > record.expiresAt
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(FILES_STORE)) {
        db.createObjectStore(FILES_STORE)
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error("Failed to open IndexedDB"))
  })
}

/**
 * Store the uploaded PDF/image files in IndexedDB under the given exam ID.
 * Files (not base64) are stored so they can be restored as Blob object URLs.
 */
export async function saveExamFiles(
  id: string,
  files: ExamFiles,
): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(FILES_STORE, "readwrite")
    tx.objectStore(FILES_STORE).put(files, id)
    tx.oncomplete = () => {
      db.close()
      resolve()
    }
    tx.onerror = () => {
      db.close()
      reject(tx.error ?? new Error("Failed to store exam files"))
    }
  })
}

/** Retrieve the stored files for an exam ID, or null if they don't exist. */
export async function getExamFiles(id: string): Promise<ExamFiles | null> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(FILES_STORE, "readonly")
    const request = tx.objectStore(FILES_STORE).get(id)
    request.onsuccess = () => {
      db.close()
      resolve((request.result as ExamFiles | undefined) ?? null)
    }
    request.onerror = () => {
      db.close()
      reject(request.error ?? new Error("Failed to read exam files"))
    }
  })
}

/** Store the processed, persistent result JSON in localStorage under `veda-exam:{id}`. */
export function saveExamResult(id: string, record: ExamRecord): void {
  localStorage.setItem(
    `${LOCAL_STORAGE_PREFIX}${id}`,
    JSON.stringify(record),
  )
}

/** Load the stored result JSON for an exam ID, or null if it doesn't exist. */
export function getExamResult(id: string): ExamRecord | null {
  const raw = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${id}`)
  if (!raw) return null
  try {
    return JSON.parse(raw) as ExamRecord
  } catch {
    return null
  }
}

/**
 * Persist the currently selected question for a specific exam ID so it can be
 * restored on reload, scoped independently per exam.
 */
export function saveSelectedQuestion(id: string, questionNo: string): void {
  localStorage.setItem(`${SELECTED_QUESTION_PREFIX}${id}`, questionNo)
}

/** Load the saved selected question for an exam ID, or null if none saved. */
export function getSelectedQuestion(id: string): string | null {
  return localStorage.getItem(`${SELECTED_QUESTION_PREFIX}${id}`)
}

/** Remove the stored result JSON, files, and selected-question state for an exam ID. */
export async function removeExam(id: string): Promise<void> {
  localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}${id}`)
  localStorage.removeItem(`${SELECTED_QUESTION_PREFIX}${id}`)
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(FILES_STORE, "readwrite")
    tx.objectStore(FILES_STORE).delete(id)
    tx.oncomplete = () => {
      db.close()
      resolve()
    }
    tx.onerror = () => {
      db.close()
      reject(tx.error ?? new Error("Failed to remove exam"))
    }
  })
}

/** The TTL for stored exam results, exposed for record creation. */
export function examExpiresAt(): number {
  return Date.now() + TTL_MS
}
