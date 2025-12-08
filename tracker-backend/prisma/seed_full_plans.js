// prisma/seed_full_plans.js
// Full seed: FAANG (rotation/curated), Spiritual plans, Fitness plan, creates UserPlan objects and UserPlanTask entries.
// Usage:
//   SEED_MODE=rotation node prisma/seed_full_plans.js
//   SEED_MODE=curated  node prisma/seed_full_plans.js
// Optional:
//   START_DATE=2025-12-01 WEEKS=26 DAYS_PER_WEEK=7 ADMIN_EMAIL=admin@local ADMIN_PASSWORD=ChangeMe!123 node prisma/seed_full_plans.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const SEED_MODE = (process.env.SEED_MODE || 'rotation').toLowerCase();
const START_DATE = process.env.START_DATE || (new Date()).toISOString().slice(0,10);
const WEEKS = parseInt(process.env.WEEKS || '26', 10);
const DAYS_PER_WEEK = parseInt(process.env.DAYS_PER_WEEK || '7', 10);
const TOTAL_DAYS = WEEKS * DAYS_PER_WEEK;

// ---------- source arrays (same as previous seed) ----------
const lc = [
  ['Two Sum','https://leetcode.com/problems/two-sum/'],
  ['Best Time to Buy/Sell Stock','https://leetcode.com/problems/best-time-to-buy-and-sell-stock/'],
  ['3Sum','https://leetcode.com/problems/3sum/'],
  ['Container With Most Water','https://leetcode.com/problems/container-with-most-water/'],
  ['Product of Array Except Self','https://leetcode.com/problems/product-of-array-except-self/'],
  ['Rotate Array','https://leetcode.com/problems/rotate-array/'],
  ['Group Anagrams','https://leetcode.com/problems/group-anagrams/'],
  ['Top K Frequent Elements','https://leetcode.com/problems/top-k-frequent-elements/'],
  ['Longest Substring Without Repeating Characters','https://leetcode.com/problems/longest-substring-without-repeating-characters/'],
  ['Sliding Window Maximum','https://leetcode.com/problems/sliding-window-maximum/'],
  ['Valid Parentheses','https://leetcode.com/problems/valid-parentheses/'],
  ['Min Stack','https://leetcode.com/problems/min-stack/'],
  ['Reverse Linked List','https://leetcode.com/problems/reverse-linked-list/'],
  ['Merge Two Sorted Lists','https://leetcode.com/problems/merge-two-sorted-lists/'],
  ['Binary Search','https://leetcode.com/problems/binary-search/'],
  ['Search in Rotated Sorted Array','https://leetcode.com/problems/search-in-rotated-sorted-array/'],
  ['Find Minimum in Rotated Sorted Array','https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/'],
  ['Koko Eating Bananas','https://leetcode.com/problems/koko-eating-banana/'],
  ['Invert Binary Tree','https://leetcode.com/problems/invert-binary-tree/'],
  ['Diameter of Binary Tree','https://leetcode.com/problems/diameter-of-binary-tree/'],
  ['Lowest Common Ancestor','https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/'],
  ['Number of Islands','https://leetcode.com/problems/number-of-islands/'],
  ['Clone Graph','https://leetcode.com/problems/clone-graph/'],
  ['Course Schedule','https://leetcode.com/problems/course-schedule/'],
  ['Pacific Atlantic Water Flow','https://leetcode.com/problems/pacific-atlantic-water-flow/'],
  ['Kth Largest Element','https://leetcode.com/problems/kth-largest-element-in-an-array/'],
  ['Two Sum II - Input array is sorted','https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/'],
  ['Valid Palindrome','https://leetcode.com/problems/valid-palindrome/'],
  ['Invert Binary Tree (dup)','https://leetcode.com/problems/invert-binary-tree/']
];

const designs = [
  'Load Balancers (L4 vs L7, HAProxy, NGINX)',
  'Caching: Redis eviction (LRU/LFU)',
  'Message Queues: Kafka vs SQS',
  'Sharding & Partitioning',
  'CAP Theorem + Consistency Models',
  'URL Shortener design',
  'Rate Limiter design',
  'Instagram Feed design',
  'Chat Messaging System',
  'Job Scheduler',
  'Distributed Caching',
  'YouTube Architecture',
  'Netflix Architecture',
  'Twitter Timeline',
  'Uber Dispatch System'
];

const behaviors = [
  'Tell me about a time you took ownership.',
  'Tell me about a production issue you fixed.',
  'Tell me about a conflict with a teammate.',
  'Tell me about a time you improved a system.',
  'Tell me about a time you handled tight deadlines.',
  'Tell me about a mistake and what you learned.',
  'Tell me when you disagreed with your manager.',
  'Tell me when you led without authority.'
];

const micro = [
  'Implement LRU Cache in Python',
  'Build a rate limiter in Node.js',
  'Create a Redis-based counter',
  'Implement a message queue mock',
  'Build a mini URL shortener',
  'Implement JWT auth microservice',
  'Build a WebSocket chat prototype',
  'Deploy a serverless function'
];

// Spiritual books list (will be cycled across days)
const spiritualBooks = [
  'Bhagvad Gita', 'Bhagvat Puran', 'Vidur Niti', 'Vasudev Mahatmya', 'Satsangi Jivan', 'Vachanamrut'
];

// ---------- helper functions ----------
function guessSubcategoryForTitle(title) {
  const t = (title || '').toLowerCase();
  if (t.includes('tree') || t.includes('binary')) return 'Trees';
  if (t.includes('linked')) return 'LinkedList';
  if (t.includes('graph') || t.includes('islands') || t.includes('clone graph')) return 'Graphs';
  if (t.includes('dp') || t.includes('triangle') || t.includes('koko') || t.includes('kth')) return 'Dynamic Programming';
  if (t.includes('stack') || t.includes('parentheses') || t.includes('min stack')) return 'Stacks';
  if (t.includes('array') || t.includes('two sum') || t.includes('rotate') || t.includes('product')) return 'Arrays';
  if (t.includes('substring') || t.includes('palindrome')) return 'Strings';
  if (t.includes('search') || t.includes('binary search') || t.includes('rotated')) return 'Binary Search';
  return 'General';
}

async function createIfNot(model, where, createData) {
  // convenience: try upsert-like behavior
  const found = await prisma[model].findFirst({ where });
  if (found) return found;
  return prisma[model].create({ data: createData });
}

// ---------- main ----------
async function main() {
  console.log('Full-plan seeding started. Mode:', SEED_MODE);

  // 1) Roles
  const roles = [
    { name: 'admin', permissions: { manageUsers: true, manageCategories: true, managePlans: true } },
    { name: 'manager', permissions: { manageCategories: true, managePlans: true } },
    { name: 'user', permissions: {} }
  ];
  for (const r of roles) {
    await prisma.role.upsert({
      where: { name: r.name },
      update: { permissions: r.permissions },
      create: { name: r.name, permissions: r.permissions }
    });
  }
  console.log('Roles done.');

  // 2) Categories + Subcategories (include Spiritual + Fitness)
  const categoriesDef = [
    { name: 'DSA', type: 'DSA', subs: ['Arrays','Strings','LinkedList','Trees','Graphs','Dynamic Programming','Greedy','Binary Search','Stacks','Queues','General'] },
    { name: 'System Design', type: 'SYSTEM_DESIGN', subs: ['Basics','Caching','Messaging','Storage','Load Balancing'] },
    { name: 'Behavioral', type: 'BEHAVIORAL', subs: ['Ownership','Conflict','Deadline','Mistake','Leadership'] },
    { name: 'Projects', type: 'PROJECT', subs: ['Web','Backend','Realtime','DevOps'] },
    { name: 'Spiritual', type: 'SPIRITUAL', subs: ['Bhaktachintamani','Mantra Jaap','Katha Listening','Shikshapatri','Spiritual Books'] },
    { name: 'Fitness', type: 'FITNESS', subs: ['Running','Yoga','Exercise','Jump Rope'] }
  ];

  const catMap = {};
  for (const c of categoriesDef) {
    const cat = await prisma.category.create({ data: { name: c.name, description: `${c.name} category`, type: c.type } });
    catMap[c.name] = { id: cat.id, subs: {} };
    for (const s of c.subs) {
      const sub = await prisma.subcategory.create({ data: { name: s, categoryId: cat.id } });
      catMap[c.name].subs[s] = sub.id;
    }
  }
  console.log('Categories + Subcategories created.');

  // 3) Create topics: DSA + System + Behavioral + Micro + Spiritual + Fitness
  const topicDefs = [];

  // DSA from lc
  for (const [title, link] of lc) {
    topicDefs.push({ title, type: 'DSA', difficulty: 'EASY', link: link || null, category: 'DSA', sub: guessSubcategoryForTitle(title) });
  }
  // designs
  for (const title of designs) {
    topicDefs.push({ title, type: 'SYSTEM_DESIGN', difficulty: 'MEDIUM', link: null, category: 'System Design', sub: 'Basics' });
  }
  // behaviors
  for (const title of behaviors) {
    topicDefs.push({ title, type: 'BEHAVIORAL', difficulty: 'EASY', link: null, category: 'Behavioral', sub: 'Ownership' });
  }
  // micro
  for (const title of micro) {
    topicDefs.push({ title, type: 'PROJECT', difficulty: 'MEDIUM', link: null, category: 'Projects', sub: 'Backend' });
  }

  // Spiritual: Bhaktachintamani chapters (1..164)
  for (let i = 1; i <= 164; i++) {
    topicDefs.push({ title: `Bhaktachintamani - Chapter ${i}`, type: 'SPIRITUAL', difficulty: 'EASY', category: 'Spiritual', sub: 'Bhaktachintamani', estimatedTime: 20 });
  }
  // Shikshapatri shloks (1..212)
  for (let i = 1; i <= 212; i++) {
    topicDefs.push({ title: `Shikshapatri - Shlok ${i}`, type: 'SPIRITUAL', difficulty: 'EASY', category: 'Spiritual', sub: 'Shikshapatri', estimatedTime: 5 });
  }
  // Mantra Jaap single numeric-goal topic
  topicDefs.push({ title: 'Mantra Jaap - 1008 Repetitions', type: 'SPIRITUAL', difficulty: 'EASY', category: 'Spiritual', sub: 'Mantra Jaap', numericGoal: 1008, estimatedTime: 30 });
  // Daily Katha listen (YouTube)
  topicDefs.push({ title: 'Daily Katha Listening (YouTube)', type: 'SPIRITUAL', difficulty: 'EASY', category: 'Spiritual', sub: 'Katha Listening', estimatedTime: 20 });

  // Spiritual books - we create an entry per book chapter placeholder (we'll create N placeholders per book, here we create 50 per book as example; actual chapter counts differ and can be tuned)
  const chaptersPerBookPlaceholder = 50; // placeholder - treat as "chapter slots" to cycle
  for (const book of spiritualBooks) {
    for (let ch = 1; ch <= chaptersPerBookPlaceholder; ch++) {
      topicDefs.push({ title: `${book} - Chapter ${ch}`, type: 'SPIRITUAL', difficulty: 'EASY', category: 'Spiritual', sub: 'Spiritual Books', estimatedTime: 20 });
    }
  }

  // Fitness tasks (single topics reused daily)
  topicDefs.push({ title: 'Run 5K', type: 'FITNESS', difficulty: 'EASY', category: 'Fitness', sub: 'Running', estimatedTime: 45 });
  topicDefs.push({ title: 'Yoga (15 minutes)', type: 'FITNESS', difficulty: 'EASY', category: 'Fitness', sub: 'Yoga', estimatedTime: 15 });
  topicDefs.push({ title: 'Exercise (30 minutes)', type: 'FITNESS', difficulty: 'EASY', category: 'Fitness', sub: 'Exercise', estimatedTime: 30 });
  topicDefs.push({ title: 'Jump Rope (10 minutes)', type: 'FITNESS', difficulty: 'EASY', category: 'Fitness', sub: 'Jump Rope', estimatedTime: 10 });

  // Deduplicate by title
  const uniq = new Map();
  for (const t of topicDefs) {
    if (!uniq.has(t.title)) uniq.set(t.title, t);
  }
  const topicList = Array.from(uniq.values());

  const createdTopics = [];
  for (const td of topicList) {
    // find subcategory id
    const subId = catMap[td.category].subs[td.sub] || Object.values(catMap[td.category].subs)[0];
    const created = await prisma.topic.create({
      data: {
        title: td.title,
        difficulty: td.difficulty === 'EASY' ? 'EASY' : td.difficulty === 'MEDIUM' ? 'MEDIUM' : 'HARD',
        type: td.type === 'DSA' ? 'DSA' : td.type === 'SYSTEM_DESIGN' ? 'SYSTEM_DESIGN' : td.type === 'BEHAVIORAL' ? 'BEHAVIORAL' : td.type === 'PROJECT' ? 'PROJECT' : td.type === 'SPIRITUAL' ? 'PROJECT' /* prisma enum mismatch fallback */ : td.type,
        estimatedTime: td.estimatedTime || 20,
        link: td.link || null,
        numericGoal: td.numericGoal || null,
        tags: td.tags || [],
        subcategoryId: subId
      }
    });
    createdTopics.push(created);
  }
  console.log(`Created ${createdTopics.length} topics (including spiritual & fitness).`);

  // 4) Create FAANG weekly plan using chosen SEED_MODE (rotation/curated) — map to WeeklyPlanTopic table
  // Use previous rotation/curated logic: create WeeklyPlanTopic entries (multiple topics per day)
  const findTopicByTitle = (title) => createdTopics.find(t => t.title === title);

  if (SEED_MODE === 'rotation') {
    console.log('Creating FAANG weekly plan (rotation) for', TOTAL_DAYS, 'days.');
    const start = new Date(START_DATE);
    for (let d = 0; d < TOTAL_DAYS; d++) {
      const weekNumber = Math.floor(d / DAYS_PER_WEEK) + 1;
      const dayNumber = (d % DAYS_PER_WEEK) + 1;
      const lc1 = lc[d % lc.length][0];
      const lc2 = lc[(d + 7) % lc.length][0];
      const design = designs[d % designs.length];
      const behavior = behaviors[d % behaviors.length];
      const microproj = micro[d % micro.length];

      const titles = [lc1, lc2, design, behavior, microproj];
      for (const title of titles) {
        const topic = createdTopics.find(t => t.title.toLowerCase().includes((title || '').toLowerCase().split(' ').slice(0,5).join(' ').trim()));
        if (topic) {
          await prisma.weeklyPlanTopic.create({ data: { weekNumber, dayNumber, topicId: topic.id } });
        }
      }
    }
    console.log('FAANG rotation plan created.');
  } else {
    console.log('Creating FAANG weekly plan (curated) for', WEEKS, 'weeks.');
    // curated plan similar to earlier approach (focus subcategories by week)
    const curatedWeekPlan = [
      'Arrays','Arrays','Strings','Strings','LinkedList','LinkedList','Stacks','Queues',
      'Trees','Trees','Graphs','Graphs','Dynamic Programming','Dynamic Programming','Greedy','Binary Search',
      'System Design','System Design','System Design','System Design',
      'Behavioral','Behavioral','Projects','Projects','Revision','Revision'
    ];
    for (let w = 1; w <= WEEKS; w++) {
      const focus = curatedWeekPlan[(w-1) % curatedWeekPlan.length];
      // find topics matching focus (by subcategory name or title)
      const subs = await prisma.subcategory.findMany({ where: { name: { contains: focus, mode: 'insensitive' } } });
      let topicsForWeek = [];
      if (subs.length) {
        const subIds = subs.map(s => s.id);
        topicsForWeek = await prisma.topic.findMany({ where: { subcategoryId: { in: subIds } }, take: DAYS_PER_WEEK });
      } else {
        // fallback: DSA
        topicsForWeek = await prisma.topic.findMany({ where: { type: 'DSA' }, take: DAYS_PER_WEEK });
      }
      if (topicsForWeek.length < DAYS_PER_WEEK) {
        const more = await prisma.topic.findMany({ where: { type: 'DSA' }, take: DAYS_PER_WEEK - topicsForWeek.length });
        topicsForWeek = topicsForWeek.concat(more);
      }
      for (let d = 1; d <= DAYS_PER_WEEK; d++) {
        const topic = topicsForWeek[(d-1) % topicsForWeek.length];
        await prisma.weeklyPlanTopic.create({ data: { weekNumber: w, dayNumber: d, topicId: topic.id } });
      }
    }
    console.log('FAANG curated plan created.');
  }

  // 5) Create Spiritual and Fitness UserPlans (separate plans) and map their tasks to UserPlanTask
  // For Spiritual plan we will generate tasks for:
  //  - Bhaktachintamani chapters (164) -> one per day
  //  - Shikshapatri shloks (212) -> one per day (these can be in a separate plan or combined)
  //  - Mantra Jaap daily -> repeated every day (numericGoal)
  //  - Daily Katha -> repeated every day
  //  - Spiritual Books -> cycle across chapters placeholders

  const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe!123';
  const pwHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: pwHash, name: 'Admin User', roleId: adminRole.id },
    create: { email: adminEmail, passwordHash: pwHash, name: 'Admin User', roleId: adminRole.id }
  });
  const adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
  console.log('Admin user ready:', adminEmail);

  // Create Spiritual UserPlan
  console.log('Creating Spiritual UserPlan and tasks...');
  // choose plan length: max of Bhaktachintamani(164) and Shikshapatri(212) -> set planDays to 212 (so both can fit)
  const spiritualPlanDays = Math.max(164, 212);
  const spiritualWeeks = Math.ceil(spiritualPlanDays / DAYS_PER_WEEK);
  const spiritualPlan = await prisma.userPlan.create({
    data: {
      userId: adminUser.id,
      name: 'Spiritual Plan (Bhaktachintamani + Shikshapatri + Daily Practices)',
      totalWeeks: spiritualWeeks,
      startDate: new Date(START_DATE)
    }
  });

  // fetch created topic ids for Bhaktachintamani & Shikshapatri & mantra & katha and books
  const bhaktaTopics = await prisma.topic.findMany({ where: { title: { contains: 'Bhaktachintamani' } }, orderBy: { title: 'asc' } });
  const shikshaTopics = await prisma.topic.findMany({ where: { title: { contains: 'Shikshapatri' } }, orderBy: { title: 'asc' } });
  const mantraTopic = await prisma.topic.findFirst({ where: { title: { contains: 'Mantra Jaap' } } });
  const kathaTopic = await prisma.topic.findFirst({ where: { title: { contains: 'Katha Listening' } } });
  const bookTopics = await prisma.topic.findMany({ where: { title: { contains: ' - Chapter ' }, AND: { subcategoryId: { in: Object.values(catMap['Spiritual'].subs) } } }, take: 1000 });

  // populate days 1..spiritualPlanDays
  for (let day = 1; day <= spiritualPlanDays; day++) {
    const weekNumber = Math.floor((day - 1) / DAYS_PER_WEEK) + 1;
    const dayNumber = ((day - 1) % DAYS_PER_WEEK) + 1;

    // Bhaktachintamani chapter if available
    const bhTopic = bhaktaTopics[day - 1]; // may be undefined after 164
    if (bhTopic) {
      await prisma.userPlanTask.create({ data: { userPlanId: spiritualPlan.id, topicId: bhTopic.id, weekNumber, dayNumber } });
    }

    // Shikshapatri (if day <= 212)
    const shTopic = shikshaTopics[day - 1];
    if (shTopic) {
      await prisma.userPlanTask.create({ data: { userPlanId: spiritualPlan.id, topicId: shTopic.id, weekNumber, dayNumber } });
    }

    // Mantra jaap and Katha always daily
    if (mantraTopic) await prisma.userPlanTask.create({ data: { userPlanId: spiritualPlan.id, topicId: mantraTopic.id, weekNumber, dayNumber } });
    if (kathaTopic) await prisma.userPlanTask.create({ data: { userPlanId: spiritualPlan.id, topicId: kathaTopic.id, weekNumber, dayNumber } });

    // Spiritual book: cycle through bookTopics
    if (bookTopics.length > 0) {
      const bookTopic = bookTopics[(day - 1) % bookTopics.length];
      if (bookTopic) await prisma.userPlanTask.create({ data: { userPlanId: spiritualPlan.id, topicId: bookTopic.id, weekNumber, dayNumber } });
    }
  }
  console.log('Spiritual plan created with', spiritualPlanDays, 'days.');

  // Create Fitness UserPlan (daily 4 activities each day)
  console.log('Creating Fitness UserPlan and tasks...');
  const fitnessDays = TOTAL_DAYS; // make fitness plan for same TOTAL_DAYS (26 weeks default)
  const fitnessWeeks = Math.ceil(fitnessDays / DAYS_PER_WEEK);
  const fitnessPlan = await prisma.userPlan.create({
    data: {
      userId: adminUser.id,
      name: 'Fitness Daily Plan (Run/Yoga/Exercise/Jump Rope)',
      totalWeeks: fitnessWeeks,
      startDate: new Date(START_DATE)
    }
  });
  const runTopic = await prisma.topic.findFirst({ where: { title: { contains: 'Run 5K' } } });
  const yogaTopic = await prisma.topic.findFirst({ where: { title: { contains: 'Yoga (15' } } });
  const exTopic = await prisma.topic.findFirst({ where: { title: { contains: 'Exercise (30' } } });
  const jrTopic = await prisma.topic.findFirst({ where: { title: { contains: 'Jump Rope' } } });

  for (let day = 1; day <= fitnessDays; day++) {
    const weekNumber = Math.floor((day - 1) / DAYS_PER_WEEK) + 1;
    const dayNumber = ((day - 1) % DAYS_PER_WEEK) + 1;
    if (runTopic) await prisma.userPlanTask.create({ data: { userPlanId: fitnessPlan.id, topicId: runTopic.id, weekNumber, dayNumber } });
    if (yogaTopic) await prisma.userPlanTask.create({ data: { userPlanId: fitnessPlan.id, topicId: yogaTopic.id, weekNumber, dayNumber } });
    if (exTopic) await prisma.userPlanTask.create({ data: { userPlanId: fitnessPlan.id, topicId: exTopic.id, weekNumber, dayNumber } });
    if (jrTopic) await prisma.userPlanTask.create({ data: { userPlanId: fitnessPlan.id, topicId: jrTopic.id, weekNumber, dayNumber } });
  }
  console.log('Fitness plan created with', fitnessDays, 'days.');

  // 6) Create a FAANG user plan (UserPlan) mapping WeeklyPlanTopic into a UserPlan for admin (optional)
  // This creates a UserPlan 'FAANG 6-month' which uses the WeeklyPlanTopic table as the canonical public plan; here we map week/day -> select topics in weeklyPlanTopic and create corresponding UserPlanTask rows.
  console.log('Creating UserPlan for FAANG (mapping WeeklyPlanTopic -> UserPlanTask)...');

  const faangPlan = await prisma.userPlan.create({
    data: {
      userId: adminUser.id,
      name: 'FAANG 6-month Plan (mapped)',
      totalWeeks: WEEKS,
      startDate: new Date(START_DATE)
    }
  });

  // fetch weekly plan mappings and create tasks
  const weeklyMappings = await prisma.weeklyPlanTopic.findMany({ orderBy: [{ weekNumber: 'asc' }, { dayNumber: 'asc' }] });

  for (const wm of weeklyMappings) {
    // create userPlanTask for admin user plan (this duplicates topics into user's plan)
    await prisma.userPlanTask.create({
      data: {
        userPlanId: faangPlan.id,
        topicId: wm.topicId,
        weekNumber: wm.weekNumber,
        dayNumber: wm.dayNumber
      }
    });
  }
  console.log('FAANG user plan created with', weeklyMappings.length, 'tasks.');

  console.log('All seeding complete.');
  console.log('Admin credentials ->', 'email:', adminEmail, ' password:', adminPassword);
}

main()
  .catch(e => {
    console.error('Seeding failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
