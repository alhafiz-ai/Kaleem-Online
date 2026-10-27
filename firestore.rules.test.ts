import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { doc, getDoc, setDoc, updateDoc, getDocs, collection, writeBatch, serverTimestamp } from 'firebase/firestore';

let testEnv: RulesTestEnvironment;

export async function runDirtyDozenSecuritySuite() {
  testEnv = await initializeTestEnvironment({
    projectId: 'aldanish-security-test',
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
    },
  });

  const unauthDb = testEnv.unauthenticatedContext().firestore();
  const spoofAdminDb = testEnv.authenticatedContext('spoof-uid', {
    email: 'kaleemhafiz47@gmail.com',
    email_verified: false,
  }).firestore();
  const regularUserDb = testEnv.authenticatedContext('student-uid', {
    email: 'student@example.com',
    email_verified: true,
  }).firestore();
  const verifiedAdminDb = testEnv.authenticatedContext('director-uid', {
    email: 'kaleemhafiz47@gmail.com',
    email_verified: true,
  }).firestore();

  // Seed sample records securely for read/update tests
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, 'courses', 'hidden-course'), {
      id: 'hidden-course',
      title: { ur: 'خفیہ', en: 'Hidden', ar: 'مخفي' },
      category: 'tajweed',
      description: { ur: 'تفصیل', en: 'Desc', ar: 'وصف' },
      feeMonthlyPKR: 4000,
      feeUSD: 25,
      duration: { ur: '3 ماہ', en: '3 Months', ar: '3 أشهر' },
      classesPerWeek: 3,
      instructor: { ur: 'استاد', en: 'Teacher', ar: 'معلم' },
      level: 'Beginner',
      features: ['Tajweed'],
      isVisible: false,
      updatedBy: 'director-uid',
      updatedAt: new Date(),
    });
    await setDoc(doc(db, 'orders_private', 'ENR-2026-1001'), {
      id: 'ENR-2026-1001',
      studentName: 'Ahmad',
      fatherName: 'Ali',
      countryCity: 'Lahore',
      whatsapp: '+923001112233',
      type: 'live_course',
      courseOrItemTitle: 'Tajweed',
      totalAmountPKR: 4500,
      paymentMethod: 'easypaisa',
      paymentStatus: 'Pending',
      createdAt: '2026-10-23',
      createdAtServer: new Date(),
      updatedAtServer: new Date(),
    });
    await setDoc(doc(db, 'order_status', 'ENR-2026-1001'), {
      id: 'ENR-2026-1001',
      studentName: 'Ahmad',
      fatherName: 'Ali',
      type: 'live_course',
      courseOrItemTitle: 'Tajweed',
      totalAmountPKR: 4500,
      paymentMethod: 'easypaisa',
      paymentStatus: 'Pending',
      createdAt: '2026-10-23',
      createdAtServer: new Date(),
      updatedAtServer: new Date(),
    });
  });

  // 1. Email Spoof Attack (email_verified == false)
  await assertFails(
    setDoc(doc(spoofAdminDb, 'site_config', 'main'), {
      settings: { whatsappNumber: '+92300' },
      notice: { enabled: true },
      liveClass: { platform: 'Zoom' },
      payments: { easypaisa: {} },
      updatedBy: 'spoof-uid',
      updatedAt: serverTimestamp(),
    })
  );

  // 2. Shadow Field Injection on Course
  await assertFails(
    setDoc(doc(verifiedAdminDb, 'courses', 'course-1'), {
      id: 'course-1',
      title: { ur: 'تجوید', en: 'Tajweed', ar: 'تجويد' },
      category: 'tajweed',
      description: { ur: 'تفصیل', en: 'Desc', ar: 'وصف' },
      feeMonthlyPKR: 4500,
      feeUSD: 30,
      duration: { ur: '6 ماہ', en: '6 Months', ar: '6 أشهر' },
      classesPerWeek: 3,
      instructor: { ur: 'مفتی صاحب', en: 'Mufti', ar: 'المفتي' },
      level: 'Beginner',
      features: ['Makharij'],
      isVisible: true,
      updatedBy: 'director-uid',
      updatedAt: serverTimestamp(),
      isSuperFeatured: true, // Ghost shadow field!
    })
  );

  // 3. Password Leak in SiteConfig
  await assertFails(
    setDoc(doc(verifiedAdminDb, 'site_config', 'main'), {
      settings: { adminPassword: 'leaked-password', whatsappNumber: '+92300' },
      notice: { enabled: true },
      liveClass: { platform: 'Zoom' },
      payments: { easypaisa: {} },
      updatedBy: 'director-uid',
      updatedAt: serverTimestamp(),
    })
  );

  // 4. PII Scraping (list on orders_private)
  await assertFails(getDocs(collection(unauthDb, 'orders_private')));
  await assertFails(getDocs(collection(regularUserDb, 'orders_private')));

  // 5. PII Direct Read (get on orders_private by non-admin)
  await assertFails(getDoc(doc(regularUserDb, 'orders_private', 'ENR-2026-1001')));

  // 6. Order Status Enumeration (list on order_status)
  await assertFails(getDocs(collection(unauthDb, 'order_status')));

  // 7. Orphaned Order Submission (missing atomic sibling in order_status)
  await assertFails(
    setDoc(doc(unauthDb, 'orders_private', 'ENR-2026-9999'), {
      id: 'ENR-2026-9999',
      studentName: 'Zaid',
      fatherName: 'Umar',
      countryCity: 'Karachi',
      whatsapp: '+923009998877',
      type: 'live_course',
      courseOrItemTitle: 'Tajweed',
      totalAmountPKR: 4500,
      paymentMethod: 'easypaisa',
      paymentStatus: 'Pending',
      createdAt: '2026-10-23',
      createdAtServer: serverTimestamp(),
      updatedAtServer: serverTimestamp(),
    })
  );

  // 8. Self-Approved Admission (State Shortcutting)
  const shortcutBatch = writeBatch(unauthDb);
  shortcutBatch.set(doc(unauthDb, 'orders_private', 'ENR-2026-8888'), {
    id: 'ENR-2026-8888',
    studentName: 'Zaid',
    fatherName: 'Umar',
    countryCity: 'Karachi',
    whatsapp: '+923009998877',
    type: 'live_course',
    courseOrItemTitle: 'Tajweed',
    totalAmountPKR: 4500,
    paymentMethod: 'easypaisa',
    paymentStatus: 'Approved', // Forbidden on unauthenticated create!
    createdAt: '2026-10-23',
    createdAtServer: serverTimestamp(),
    updatedAtServer: serverTimestamp(),
  });
  shortcutBatch.set(doc(unauthDb, 'order_status', 'ENR-2026-8888'), {
    id: 'ENR-2026-8888',
    studentName: 'Zaid',
    fatherName: 'Umar',
    type: 'live_course',
    courseOrItemTitle: 'Tajweed',
    totalAmountPKR: 4500,
    paymentMethod: 'easypaisa',
    paymentStatus: 'Approved',
    createdAt: '2026-10-23',
    createdAtServer: serverTimestamp(),
    updatedAtServer: serverTimestamp(),
  });
  await assertFails(shortcutBatch.commit());

  // 9. Forged Client Timestamp
  const forgedTimeBatch = writeBatch(unauthDb);
  const forgedDate = new Date('2020-01-01T00:00:00Z');
  forgedTimeBatch.set(doc(unauthDb, 'orders_private', 'ENR-2026-7777'), {
    id: 'ENR-2026-7777',
    studentName: 'Zaid',
    fatherName: 'Umar',
    countryCity: 'Karachi',
    whatsapp: '+923009998877',
    type: 'live_course',
    courseOrItemTitle: 'Tajweed',
    totalAmountPKR: 4500,
    paymentMethod: 'easypaisa',
    paymentStatus: 'Pending',
    createdAt: '2026-10-23',
    createdAtServer: forgedDate,
    updatedAtServer: forgedDate,
  });
  forgedTimeBatch.set(doc(unauthDb, 'order_status', 'ENR-2026-7777'), {
    id: 'ENR-2026-7777',
    studentName: 'Zaid',
    fatherName: 'Umar',
    type: 'live_course',
    courseOrItemTitle: 'Tajweed',
    totalAmountPKR: 4500,
    paymentMethod: 'easypaisa',
    paymentStatus: 'Pending',
    createdAt: '2026-10-23',
    createdAtServer: forgedDate,
    updatedAtServer: forgedDate,
  });
  await assertFails(forgedTimeBatch.commit());

  // 10. ID Poisoning Attack
  await assertFails(
    setDoc(doc(unauthDb, 'orders_private', 'bad$id!'), {
      id: 'bad$id!',
      studentName: 'Zaid',
    })
  );

  // 11. Value Poisoning on Update
  await assertFails(
    updateDoc(doc(verifiedAdminDb, 'orders_private', 'ENR-2026-1001'), {
      paymentStatus: 'HackedStatus',
      updatedAtServer: serverTimestamp(),
    })
  );

  // 12. Hidden Course Scraping (unfiltered list fails when hidden course exists)
  await assertFails(getDocs(collection(unauthDb, 'courses')));

  // Positive sanity check: Valid atomic student order submission succeeds
  const validBatch = writeBatch(unauthDb);
  validBatch.set(doc(unauthDb, 'orders_private', 'ENR-2026-5555'), {
    id: 'ENR-2026-5555',
    studentName: 'Bilal',
    fatherName: 'Hasan',
    countryCity: 'Islamabad',
    whatsapp: '+923112223344',
    type: 'live_course',
    courseOrItemTitle: 'Tajweed',
    totalAmountPKR: 4500,
    paymentMethod: 'easypaisa',
    paymentStatus: 'Pending',
    createdAt: '2026-10-23',
    createdAtServer: serverTimestamp(),
    updatedAtServer: serverTimestamp(),
  });
  validBatch.set(doc(unauthDb, 'order_status', 'ENR-2026-5555'), {
    id: 'ENR-2026-5555',
    studentName: 'Bilal',
    fatherName: 'Hasan',
    type: 'live_course',
    courseOrItemTitle: 'Tajweed',
    totalAmountPKR: 4500,
    paymentMethod: 'easypaisa',
    paymentStatus: 'Pending',
    createdAt: '2026-10-23',
    createdAtServer: serverTimestamp(),
    updatedAtServer: serverTimestamp(),
  });
  await assertSucceeds(validBatch.commit());

  await testEnv.cleanup();
}
