"use client"

import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  getDocs,
  deleteDoc,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore"
import { db } from "./firebase"
import type { UserProfile, DailyLog, AccentTheme, ColorMode } from "./fitness-store"

// User profile operations
export async function saveUserProfile(userId: string, profile: UserProfile) {
  const docRef = doc(db, "users", userId, "data", "profile")
  await setDoc(docRef, profile, { merge: true })
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const docRef = doc(db, "users", userId, "data", "profile")
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? (docSnap.data() as UserProfile) : null
}

// Settings operations
export async function saveUserSettings(
  userId: string,
  settings: { isOnboarded: boolean; accentTheme: AccentTheme; colorMode: ColorMode },
) {
  const docRef = doc(db, "users", userId, "data", "settings")
  await setDoc(docRef, settings, { merge: true })
}

export async function getUserSettings(
  userId: string,
): Promise<{ isOnboarded: boolean; accentTheme: AccentTheme; colorMode: ColorMode } | null> {
  const docRef = doc(db, "users", userId, "data", "settings")
  const docSnap = await getDoc(docRef)
  return docSnap.exists()
    ? (docSnap.data() as { isOnboarded: boolean; accentTheme: AccentTheme; colorMode: ColorMode })
    : null
}

// Daily logs operations
export async function saveDailyLog(userId: string, log: DailyLog) {
  const docRef = doc(db, "users", userId, "logs", log.date)
  await setDoc(docRef, log)
}

export async function getDailyLogs(userId: string): Promise<DailyLog[]> {
  const logsRef = collection(db, "users", userId, "logs")
  const querySnapshot = await getDocs(query(logsRef))
  return querySnapshot.docs.map((doc) => doc.data() as DailyLog)
}

export async function deleteDailyLog(userId: string, date: string) {
  const docRef = doc(db, "users", userId, "logs", date)
  await deleteDoc(docRef)
}

// Real-time listeners
export function subscribeToLogs(userId: string, callback: (logs: DailyLog[]) => void): Unsubscribe {
  const logsRef = collection(db, "users", userId, "logs")
  return onSnapshot(query(logsRef), (snapshot) => {
    const logs = snapshot.docs.map((doc) => doc.data() as DailyLog)
    callback(logs)
  })
}

export function subscribeToProfile(userId: string, callback: (profile: UserProfile | null) => void): Unsubscribe {
  const docRef = doc(db, "users", userId, "data", "profile")
  return onSnapshot(docRef, (doc) => {
    callback(doc.exists() ? (doc.data() as UserProfile) : null)
  })
}

export function subscribeToSettings(
  userId: string,
  callback: (settings: { isOnboarded: boolean; accentTheme: AccentTheme; colorMode: ColorMode } | null) => void,
): Unsubscribe {
  const docRef = doc(db, "users", userId, "data", "settings")
  return onSnapshot(docRef, (doc) => {
    callback(
      doc.exists() ? (doc.data() as { isOnboarded: boolean; accentTheme: AccentTheme; colorMode: ColorMode }) : null,
    )
  })
}
