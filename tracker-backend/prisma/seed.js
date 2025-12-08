// prisma/seed.js
// Dual-mode seed: "rotation" (original FAANG plan rotation) or "curated" (week-focused plan)
// Usage:
//   SEED_MODE=rotation node prisma/seed.js
//   SEED_MODE=curated  node prisma/seed.js
// Optional:
//   START_DATE=2025-12-01 WEEKS=26 DAYS_PER_WEEK=7 node prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const SEED_MODE = (process.env.SEED_MODE || 'rotation').toLowerCase(); // rotation | curated
const START_DATE = process.env.START_DATE || (new Date()).toISOString().slice(0,10);
const WEEKS = parseInt(process.env.WEEKS || '26', 10);
const DAYS_PER_WEEK = parseInt(process.env.DAYS_PER_WEEK || '7', 10);
const TOTAL_DAYS = WEEKS * DAYS_PER_WEEK; // default 26*7 = 182 (last week may be partial)

// -------------------------------
// Source topic arrays (copied from your App.jsx / FAANG_6month_plan_optionA)
// These arrays are used as the definitive source for topics in seed. See App.jsx for reference. :contentReference[oaicite:1]{index=1}
// -------------------------------

// LeetCode / DSA list (sample subset - expand if needed)
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
  ['Invert Binary Tree','https://leetcode.com/problems/invert-binary-tree/'],
  // Add more if you want to expand the seeded topics
];

// System design list
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

// Behavioral list
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

// Micro projects list
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

// Tagging helpers (basic heuristics)
function guessSubcategoryForTitle(title) {
  const t = title.toLowerCase();
  if (t.includes('tree') || t.includes('binary')) return 'Trees';
  if (t.includes('linked')) return 'LinkedList';
  if (t.includes('graph') || t.includes('islands') || t.includes('clone graph')) return 'Graphs';
  if (t.includes('dp') || t.includes('triangle') || t.includes('koko') || t.includes('kth')) return 'Dynamic Programming';
  if (t.includes('stack') || t.includes('parentheses') || t.includes('min stack')) return 'Stacks';
  if (t.includes('array') || t.includes('two sum') || t.includes('rotate') || t.includes('product')) return 'Arrays';
  if (t.includes('substring') || t.includes('palindrome')) return 'Strings';
  if (t.includes('search') || t.includes('binary search') || t.includes('rotated')) return 'Binary Search';
  if (t.includes('island') || t.includes('graph')) return 'Graphs';
  return 'General';
}

// curatedWeekPlan: mapping of week -> focus subcategory (curated plan)
const curatedWeekPlan = [
  'Arrays', 'Arrays', 'Strings', 'Strings',
  'LinkedList', 'LinkedList', 'Stacks', 'Queues',
  'Trees', 'Trees', 'Graphs', 'Graphs',
  'Dynamic Programming', 'Dynamic Programming', 'Greedy', 'Binary Search',
  'System Design Basics', 'System Design Basics', 'System Design - Storage', 'System Design - Caching',
  'Behavioral', 'Behavioral', 'Projects', 'Projects',
  'Revision', 'Revision'
];

// -------------------------------
// Main seeding function
// -------------------------------
async function main() {
  console.log('Seeding database - mode:', SEED_MODE);
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

  console.log('Created roles.');

  // 2) Categories + Subcategories
  const categoriesDef = [
    { name: 'DSA', subs: ['Arrays','Strings','LinkedList','Trees','Graphs','Dynamic Programming','Greedy','Binary Search','Stacks','Queues','General'] },
    { name: 'System Design', subs: ['Basics','Caching','Messaging','Storage','Load Balancing'] },
    { name: 'Behavioral', subs: ['Ownership','Conflict','Deadline','Mistake','Leadership'] },
    { name: 'Projects', subs: ['Web','Backend','Realtime','DevOps'] }
  ];

  const catMap = {};
  for (const c of categoriesDef) {
    const cat = await prisma.category.create({ data: { name: c.name, description: `${c.name} topic category` } });
    catMap[c.name] = { id: cat.id, subs: {} };
    for (const s of c.subs) {
      const sub = await prisma.subcategory.create({ data: { name: s, categoryId: cat.id } });
      catMap[c.name].subs[s] = sub.id;
    }
  }
  console.log('Created categories and subcategories.');

  // 3) Create topics (unique across all arrays)
  // Merge lc, designs, behaviors, micro into topic objects
  const topicPool = []; // { title, type, difficulty, link, tags, subcategoryName, categoryName }
  // DSA topics from lc
  for (const [title, link] of lc) {
    topicPool.push({ title, type: 'DSA', difficulty: 'EASY', link: link || null, categoryName: 'DSA', subcategoryName: guessSubcategoryForTitle(title) });
  }
  // system designs
  for (const title of designs) {
    topicPool.push({ title, type: 'SYSTEM_DESIGN', difficulty: 'MEDIUM', link: null, categoryName: 'System Design', subcategoryName: 'Basics' });
  }
  // behavioral
  for (const title of behaviors) {
    topicPool.push({ title, type: 'BEHAVIORAL', difficulty: 'EASY', link: null, categoryName: 'Behavioral', subcategoryName: 'Ownership' });
  }
  // micro
  for (const title of micro) {
    topicPool.push({ title, type: 'PROJECT', difficulty: 'MEDIUM', link: null, categoryName: 'Projects', subcategoryName: 'Backend' });
  }

  // deduplicate by title (safety)
  const byTitle = new Map();
  for (const t of topicPool) {
    if (!byTitle.has(t.title)) byTitle.set(t.title, t);
  }
  const uniqueTopics = Array.from(byTitle.values());

  // Create topics in DB
  const createdTopics = [];
  for (const t of uniqueTopics) {
    // ensure subcategory exists (fallback to General)
    let subId = catMap[t.categoryName]?.subs[t.subcategoryName] || catMap[t.categoryName]?.subs['General'] || Object.values(catMap[t.categoryName].subs)[0];
    const created = await prisma.topic.create({
      data: {
        title: t.title,
        difficulty: t.difficulty === 'EASY' ? 'EASY' : t.difficulty === 'MEDIUM' ? 'MEDIUM' : 'HARD',
        type: t.type,
        estimatedTime: 20,
        link: t.link,
        tags: [],
        subcategoryId: subId
      }
    });
    createdTopics.push(created);
  }

  console.log(`Created ${createdTopics.length} topics.`);

  // 4) Weekly plan → create WeeklyPlanTopic entries according to mode
  // rotation mode: map across TOTAL_DAYS using the rotation formula similar to App.jsx:
  //   lc1 = lc[i % lc.length]
  //   lc2 = lc[(i+7) % lc.length]
  //   design = designs[i % designs.length]
  //   behavior = behaviors[i % behaviors.length]
  //   micro = micro[i % micro.length]
  //
  // curated mode: for each week, choose the curatedWeekPlan[week-1] subcategory focus and fill that week's day topics
  //
  const findTopicByTitle = (title) => createdTopics.find(t => t.title === title);

  if (SEED_MODE === 'rotation') {
    console.log('Seeding rotation-mode weekly plan for', TOTAL_DAYS, 'days starting from', START_DATE);
    const start = new Date(START_DATE);
    let dayIndex = 0;
    for (let d = 0; d < TOTAL_DAYS; d++) {
      const date = new Date(start.getTime() + d * 24*3600*1000);
      const lc1 = lc[d % lc.length][0];
      const lc2 = lc[(d + 7) % lc.length][0];
      const design = designs[d % designs.length];
      const behavior = behaviors[d % behaviors.length];
      const microproj = micro[d % micro.length];

      // For rotation mode, create plan mappings for each topic chosen (we will create up to 5 mappings per day:
      // lc1, lc2, design, behavior, micro) - map them into weeklyPlanTopic with weekNumber and dayNumber
      const weekNumber = Math.floor(d / DAYS_PER_WEEK) + 1;
      const dayNumber = (d % DAYS_PER_WEEK) + 1;

      const titles = [lc1, lc2, design, behavior, microproj];
      for (const title of titles) {
        const topic = findTopicByTitle(title);
        if (!topic) {
          // some design/behavior/micro might not be in createdTopics (if unique strings differ); try partial match
          const found = createdTopics.find(t => t.title && title && t.title.toLowerCase().includes(title.toLowerCase().slice(0,8)));
          if (found) {
            await prisma.weeklyPlanTopic.create({
              data: { weekNumber, dayNumber, topicId: found.id }
            });
          } else {
            // skip if not found
          }
        } else {
          await prisma.weeklyPlanTopic.create({
            data: { weekNumber, dayNumber, topicId: topic.id }
          });
        }
      }
      dayIndex++;
    }
    console.log('Rotation-mode weekly plan created.');
  } else if (SEED_MODE === 'curated') {
    console.log('Seeding curated-mode weekly plan for', WEEKS, 'weeks starting from', START_DATE);
    // For curated, iterate weeks 1..WEEKS, for each week choose a focus subcategory and fill DAYS_PER_WEEK topics
    for (let w = 1; w <= WEEKS; w++) {
      const focus = curatedWeekPlan[(w - 1) % curatedWeekPlan.length]; // may repeat if WEEKS > curatedWeekPlan length
      // find topics that belong to that focus subcategory (search subcategory name or category)
      // search for topics with subcategory name equal or topics with title matching focus
      const candidateTopics = createdTopics.filter(t => {
        const sub = t.subcategoryId && Object.values(catMap).some(cm => Object.values(cm.subs).includes(t.subcategoryId));
        // we will get subcategory name via DB for robust matching below
        return true; // we'll query DB for the actual subcategory name to match focus
      });

      // fetch matching topics from DB by subcategory name or category
      const subs = await prisma.subcategory.findMany({
        where: { name: { contains: focus, mode: 'insensitive' } }
      });

      let topicsForWeek = [];
      if (subs.length > 0) {
        const subIds = subs.map(s => s.id);
        topicsForWeek = await prisma.topic.findMany({ where: { subcategoryId: { in: subIds } }, take: DAYS_PER_WEEK });
      } else {
        // fallback: if focus contains "System Design" or "Behavioral" or "Projects"
        if (/system design/i.test(focus) || /^System/i.test(focus)) {
          topicsForWeek = await prisma.topic.findMany({ where: { type: 'SYSTEM_DESIGN' }, take: DAYS_PER_WEEK });
        } else if (/behavioral/i.test(focus)) {
          topicsForWeek = await prisma.topic.findMany({ where: { type: 'BEHAVIORAL' }, take: DAYS_PER_WEEK });
        } else if (/project/i.test(focus)) {
          topicsForWeek = await prisma.topic.findMany({ where: { type: 'PROJECT' }, take: DAYS_PER_WEEK });
        } else if (/revision/i.test(focus)) {
          // choose a mixed set for revision: some DSA + design + behavioral
          const p1 = await prisma.topic.findMany({ where: { type: 'DSA' }, take: 2 });
          const p2 = await prisma.topic.findMany({ where: { type: 'SYSTEM_DESIGN' }, take: 1 });
          const p3 = await prisma.topic.findMany({ where: { type: 'BEHAVIORAL' }, take: 1 });
          topicsForWeek = [...p1, ...p2, ...p3];
        } else {
          // last fallback - take DSA topics
          topicsForWeek = await prisma.topic.findMany({ where: { type: 'DSA' }, take: DAYS_PER_WEEK });
        }
      }

      // ensure we have DAYS_PER_WEEK items, if not fill from DSA pool
      if (topicsForWeek.length < DAYS_PER_WEEK) {
        const needed = DAYS_PER_WEEK - topicsForWeek.length;
        const more = await prisma.topic.findMany({ where: { type: 'DSA' }, take: needed });
        topicsForWeek = topicsForWeek.concat(more);
      }

      // create weekly mappings: dayNumber 1..DAYS_PER_WEEK
      for (let d = 1; d <= DAYS_PER_WEEK; d++) {
        const topic = topicsForWeek[(d - 1) % topicsForWeek.length];
        await prisma.weeklyPlanTopic.create({ data: { weekNumber: w, dayNumber: d, topicId: topic.id } });
      }
    }
    console.log('Curated-mode weekly plan created.');
  } else {
    console.warn('Unknown SEED_MODE:', SEED_MODE, ' - no weekly plan created.');
  }

  // 5) Create a test admin user
  const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe!123';
  const pwHash = await bcrypt.hash(adminPassword, 10);
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: pwHash, name: 'Admin User', roleId: adminRole.id },
    create: { email: adminEmail, passwordHash: pwHash, name: 'Admin User', roleId: adminRole.id }
  });

  console.log('Admin user created:');
  console.log('  email:', adminEmail);
  console.log('  password:', adminPassword);

  console.log('Seeding complete.');
}

main()
  .catch(e => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
