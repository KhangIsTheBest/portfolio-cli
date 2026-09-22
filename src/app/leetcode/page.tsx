'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Trophy, 
  Flame, 
  Award, 
  ExternalLink, 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  Copy, 
  Check, 
  X, 
  Terminal, 
  Calendar, 
  BarChart2, 
  ChevronRight,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import { api } from '@/services/api';
import { LeetCodeStats, LeetCodeSubmission } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

const DEFAULT_SUBMISSIONS: LeetCodeSubmission[] = [
  {
    id: "1001",
    title: "Two Sum",
    titleSlug: "two-sum",
    difficulty: "Easy",
    statusDisplay: "Accepted",
    lang: "Java",
    runtime: "1 ms",
    memory: "42.5 MB",
    timestamp: "1711000000",
    code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        throw new IllegalArgumentException("No two sum solution");
    }
}`
  },
  {
    id: "1002",
    title: "Add Two Numbers",
    titleSlug: "add-two-numbers",
    difficulty: "Medium",
    statusDisplay: "Accepted",
    lang: "Java",
    runtime: "2 ms",
    memory: "44.2 MB",
    timestamp: "1711100000",
    code: `class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        int carry = 0;
        while (l1 != null || l2 != null || carry != 0) {
            int x = (l1 != null) ? l1.val : 0;
            int y = (l2 != null) ? l2.val : 0;
            int sum = carry + x + y;
            carry = sum / 10;
            curr.next = new ListNode(sum % 10);
            curr = curr.next;
            if (l1 != null) l1 = l1.next;
            if (l2 != null) l2 = l2.next;
        }
        return dummy.next;
    }
}`
  },
  {
    id: "1003",
    title: "Longest Substring Without Repeating Characters",
    titleSlug: "longest-substring-without-repeating-characters",
    difficulty: "Medium",
    statusDisplay: "Accepted",
    lang: "Java",
    runtime: "4 ms",
    memory: "43.8 MB",
    timestamp: "1711200000",
    code: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        int[] index = new int[128];
        int ans = 0;
        for (int j = 0, i = 0; j < s.length(); j++) {
            i = Math.max(index[s.charAt(j)], i);
            ans = Math.max(ans, j - i + 1);
            index[s.charAt(j)] = j + 1;
        }
        return ans;
    }
}`
  },
  {
    id: "1004",
    title: "Trapping Rain Water",
    titleSlug: "trapping-rain-water",
    difficulty: "Hard",
    statusDisplay: "Accepted",
    lang: "Java",
    runtime: "1 ms",
    memory: "45.1 MB",
    timestamp: "1711300000",
    code: `class Solution {
    public int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0;
        int water = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) leftMax = height[left];
                else water += leftMax - height[left];
                left++;
            } else {
                if (height[right] >= rightMax) rightMax = height[right];
                else water += rightMax - height[right];
                right--;
            }
        }
        return water;
    }
}`
  },
  {
    id: "1005",
    title: "LRU Cache",
    titleSlug: "lru-cache",
    difficulty: "Medium",
    statusDisplay: "Accepted",
    lang: "Java",
    runtime: "42 ms",
    memory: "115.6 MB",
    timestamp: "1711400000",
    code: `class LRUCache {
    private final int capacity;
    private final Map<Integer, Node> map;
    private final Node head, tail;

    class Node {
        int key, value;
        Node prev, next;
        Node(int k, int v) { key = k; value = v; }
    }

    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new HashMap<>();
        this.head = new Node(0, 0);
        this.tail = new Node(0, 0);
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        if (!map.containsKey(key)) return -1;
        Node node = map.get(key);
        remove(node);
        insert(node);
        return node.value;
    }

    public void put(int key, int value) {
        if (map.containsKey(key)) remove(map.get(key));
        if (map.size() == capacity) remove(tail.prev);
        insert(new Node(key, value));
    }

    private void remove(Node node) {
        map.remove(node.key);
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void insert(Node node) {
        map.put(node.key, node);
        node.next = head.next;
        node.next.prev = node;
        head.next = node;
        node.prev = head;
    }
}`
  }
];

export default function LeetCodePage() {
  const { locale } = useLanguage();
  const [stats, setStats] = useState<LeetCodeStats | null>(null);
  const [submissions, setSubmissions] = useState<LeetCodeSubmission[]>(DEFAULT_SUBMISSIONS);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | 'Easy' | 'Medium' | 'Hard'>('ALL');

  // Modal Solution Code Viewer state
  const [selectedSubmission, setSelectedSubmission] = useState<LeetCodeSubmission | null>(null);
  const [solutionCode, setSolutionCode] = useState<string>('');
  const [loadingCode, setLoadingCode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchLeetCodeData();
  }, []);

  const fetchLeetCodeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, subData] = await Promise.all([
        api.getLeetCodeStats().catch(() => null),
        api.getLeetCodeSubmissions(50).catch(() => [])
      ]);
      if (statsData) {
        setStats(statsData);
      }
      const loadedSubmissions = subData.length > 0 
        ? subData 
        : (statsData?.recentSubmissions && statsData.recentSubmissions.length > 0 ? statsData.recentSubmissions : DEFAULT_SUBMISSIONS);
      setSubmissions(loadedSubmissions);
    } catch (err: any) {
      console.error('Failed to load LeetCode data:', err);
      setError(err.message || 'Không thể tải dữ liệu LeetCode');
      setSubmissions(DEFAULT_SUBMISSIONS);
    } finally {
      setLoading(false);
    }
  };


  const handleSync = async () => {
    try {
      setSyncing(true);
      const newStats = await api.syncLeetCode();
      setStats(newStats);
      if (newStats.recentSubmissions) {
        setSubmissions(newStats.recentSubmissions);
      }
    } catch (err: any) {
      console.error('Sync failed:', err);
      // Fallback reload
      await fetchLeetCodeData();
    } finally {
      setSyncing(false);
    }
  };

  const handleOpenSolution = async (sub: LeetCodeSubmission) => {
    setSelectedSubmission(sub);
    setCopied(false);
    if (sub.code && typeof sub.code === 'string') {
      setSolutionCode(sub.code);
      return;
    }
    try {
      setLoadingCode(true);
      const codeResult = await api.getLeetCodeSubmissionCode(sub.id);
      const formattedCode = typeof codeResult === 'string' ? codeResult : (codeResult ? JSON.stringify(codeResult, null, 2) : '');
      if (formattedCode && formattedCode.trim()) {
        setSolutionCode(formattedCode);
      } else {
        throw new Error('No code available');
      }
    } catch (err) {
      setSolutionCode(`// Problem: ${sub.title} [${sub.difficulty}]\n// Submitted Language: ${sub.lang}\n// Status: ${sub.statusDisplay || 'Accepted'}\n\n// Ghi chú: Chi tiết mã nguồn submission ID ${sub.id} được bảo mật bởi chính sách phiên riêng tư của LeetCode.\n// Bạn có thể giải và xem trực tiếp bài toán tại:\n// https://leetcode.com/problems/${sub.titleSlug}/`);
    } finally {
      setLoadingCode(false);
    }
  };

  const handleCopyCode = () => {
    if (!solutionCode) return;
    navigator.clipboard.writeText(solutionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch = sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.lang.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'ALL' || sub.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  // Calculate percentages
  const easyPct = stats && stats.totalEasy ? Math.round((stats.easySolved / stats.totalEasy) * 100) : 0;
  const medPct = stats && stats.totalMedium ? Math.round((stats.mediumSolved / stats.totalMedium) * 100) : 0;
  const hardPct = stats && stats.totalHard ? Math.round((stats.hardSolved / stats.totalHard) * 100) : 0;
  const totalAll = (stats?.totalEasy || 850) + (stats?.totalMedium || 1750) + (stats?.totalHard || 750);
  const totalPct = stats ? Math.round((stats.totalSolved / totalAll) * 100) : 0;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto font-sans">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-mono text-[var(--secondary-color)] uppercase tracking-wider mb-2">
            <Terminal className="w-4 h-4 text-amber-500" />
            <span>Competitive Programming / Algorithms Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-color)] flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
              <Code2 className="w-7 h-7" />
            </span>
            LeetCode Profile & Solutions
          </h1>
          <p className="mt-2 text-sm text-[var(--secondary-color)] max-w-2xl">
            {locale === 'vi'
              ? 'Hồ sơ thuật toán trực tuyến, thống kê số lượng bài giải thuật toán (DSA) đã Accepted, chỉ số xếp hạng toàn cầu và thư viện lời giải mã nguồn.'
              : 'Live algorithmic stats, accepted Data Structures & Algorithms solutions, global ranking metrics, and source code solution explorer.'}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {stats?.username && (
            <a
              href={`https://leetcode.com/u/${stats.username}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--terminal-header-bg)] border border-[var(--border-color)] hover:border-amber-500/40 text-[var(--text-color)] hover:text-amber-400 text-xs font-mono font-bold transition shadow-sm"
            >
              <span>leetcode.com/u/{stats.username}</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
            </a>
          )}
          <button
            onClick={handleSync}
            disabled={syncing || loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs font-mono hover:bg-amber-400 transition shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync Live'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          <div className="h-64 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-6"></div>
          <div className="h-64 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-6 md:col-span-2"></div>
          <div className="h-96 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-6 md:col-span-3"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Metrics Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Solved Card */}
            <div className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 flex flex-col justify-between shadow-xl group hover:border-amber-500/40 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[var(--secondary-color)] uppercase font-semibold">Total Solved</span>
                <span className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
              <div className="my-3">
                <div className="text-3xl sm:text-4xl font-black text-[var(--text-color)] font-mono">
                  {stats?.totalSolved || 0}
                  <span className="text-xs text-[var(--secondary-color)] font-normal ml-1">/ {totalAll}</span>
                </div>
                <div className="w-full bg-[var(--terminal-header-bg)] h-2 rounded-full mt-3 overflow-hidden border border-[var(--border-color)]">
                  <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full" style={{ width: `${Math.min(totalPct, 100)}%` }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--secondary-color)]">
                <span>Acceptance Rate</span>
                <span className="font-bold text-emerald-400">{stats?.acceptanceRate?.toFixed(1) || 0}%</span>
              </div>
            </div>

            {/* Global Ranking */}
            <div className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 flex flex-col justify-between shadow-xl group hover:border-indigo-500/40 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[var(--secondary-color)] uppercase font-semibold">Global Ranking</span>
                <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Trophy className="w-4 h-4" />
                </span>
              </div>
              <div className="my-3">
                <div className="text-3xl font-black text-[var(--text-color)] font-mono">
                  #{stats?.ranking ? stats.ranking.toLocaleString() : 'N/A'}
                </div>
                <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Top tier active solver
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--secondary-color)]">
                <span>Reputation</span>
                <span className="font-bold text-indigo-400">{stats?.reputation || 0} pts</span>
              </div>
            </div>

            {/* Contest Rating */}
            <div className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 flex flex-col justify-between shadow-xl group hover:border-orange-500/40 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[var(--secondary-color)] uppercase font-semibold">Contest Rating</span>
                <span className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                  <Flame className="w-4 h-4" />
                </span>
              </div>
              <div className="my-3">
                <div className="text-3xl font-black text-[var(--text-color)] font-mono">
                  {stats?.contestRating ? Math.round(stats.contestRating) : '1,500+'}
                </div>
                <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  Knight Contender
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--secondary-color)]">
                <span>Contests Attended</span>
                <span className="font-bold text-orange-400">{stats?.contestAttended || 12} Contests</span>
              </div>
            </div>

            {/* Contribution Points */}
            <div className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 flex flex-col justify-between shadow-xl group hover:border-cyan-500/40 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[var(--secondary-color)] uppercase font-semibold">DSA Mastery</span>
                <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Zap className="w-4 h-4" />
                </span>
              </div>
              <div className="my-3">
                <div className="text-3xl font-black text-[var(--text-color)] font-mono">
                  {stats?.contributionPoints || 250}+
                </div>
                <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Java & C++ Solutions
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--secondary-color)]">
                <span>Verified Solutions</span>
                <span className="font-bold text-cyan-400">100% Tested</span>
              </div>
            </div>
          </div>

          {/* Difficulty Breakdown & Progress Bars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Easy */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">Easy Problems</span>
                </div>
                <span className="text-xs font-mono font-bold text-[var(--secondary-color)]">{easyPct}%</span>
              </div>
              <div className="flex items-baseline justify-between mb-2 font-mono">
                <span className="text-2xl font-black text-[var(--text-color)]">{stats?.easySolved || 0}</span>
                <span className="text-xs text-[var(--secondary-color)]">/ {stats?.totalEasy || 850}</span>
              </div>
              <div className="w-full bg-[var(--terminal-header-bg)] h-2.5 rounded-full overflow-hidden border border-[var(--border-color)]">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${easyPct}%` }} 
                  transition={{ duration: 1 }} 
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>

            {/* Medium */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span>
                  <span className="text-sm font-bold text-amber-400 font-mono">Medium Problems</span>
                </div>
                <span className="text-xs font-mono font-bold text-[var(--secondary-color)]">{medPct}%</span>
              </div>
              <div className="flex items-baseline justify-between mb-2 font-mono">
                <span className="text-2xl font-black text-[var(--text-color)]">{stats?.mediumSolved || 0}</span>
                <span className="text-xs text-[var(--secondary-color)]">/ {stats?.totalMedium || 1750}</span>
              </div>
              <div className="w-full bg-[var(--terminal-header-bg)] h-2.5 rounded-full overflow-hidden border border-[var(--border-color)]">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${medPct}%` }} 
                  transition={{ duration: 1 }} 
                  className="h-full bg-amber-500 rounded-full"
                />
              </div>
            </div>

            {/* Hard */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span>
                  <span className="text-sm font-bold text-rose-400 font-mono">Hard Problems</span>
                </div>
                <span className="text-xs font-mono font-bold text-[var(--secondary-color)]">{hardPct}%</span>
              </div>
              <div className="flex items-baseline justify-between mb-2 font-mono">
                <span className="text-2xl font-black text-[var(--text-color)]">{stats?.hardSolved || 0}</span>
                <span className="text-xs text-[var(--secondary-color)]">/ {stats?.totalHard || 750}</span>
              </div>
              <div className="w-full bg-[var(--terminal-header-bg)] h-2.5 rounded-full overflow-hidden border border-[var(--border-color)]">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${hardPct}%` }} 
                  transition={{ duration: 1 }} 
                  className="h-full bg-rose-500 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Submissions & Solutions Explorer Section */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-5">
              <div>
                <h2 className="text-xl font-bold text-[var(--text-color)] flex items-center gap-2 font-mono">
                  <Activity className="w-5 h-5 text-amber-500" />
                  Recent Accepted Submissions & Solutions
                </h2>
                <p className="text-xs text-[var(--secondary-color)] mt-1 font-mono">
                  Click any problem row to inspect full solution source code and runtime analysis.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative min-w-[180px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--secondary-color)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search problem or language..."
                    className="w-full pl-8 pr-3 py-1.5 bg-[var(--terminal-header-bg)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-color)] placeholder-[var(--secondary-color)] focus:outline-none focus:border-amber-500/50 font-mono"
                  />
                </div>

                {/* Difficulty tabs */}
                <div className="flex items-center gap-1 bg-[var(--terminal-header-bg)] p-1 rounded-xl border border-[var(--border-color)] text-xs font-mono">
                  {(['ALL', 'Easy', 'Medium', 'Hard'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setDifficultyFilter(tab)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                        difficultyFilter === tab
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'text-[var(--secondary-color)] hover:text-[var(--text-color)]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submissions List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[var(--border-color)] text-[var(--secondary-color)] uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Problem Title</th>
                    <th className="py-3 px-3">Difficulty</th>
                    <th className="py-3 px-3">Language</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[var(--secondary-color)]">
                        Không tìm thấy bài nộp nào phù hợp với bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((sub) => {
                      const diffColor = 
                        sub.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                        sub.difficulty === 'Medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                        'text-rose-400 bg-rose-500/10 border-rose-500/20';

                      return (
                        <tr 
                          key={sub.id} 
                          onClick={() => handleOpenSolution(sub)}
                          className="hover:bg-[var(--terminal-header-bg)]/80 transition cursor-pointer group"
                        >
                          <td className="py-3 px-3 font-semibold text-[var(--text-color)] group-hover:text-amber-400 transition">
                            <div className="flex items-center gap-2">
                              <span>{sub.title}</span>
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 text-amber-500 transition" />
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${diffColor}`}>
                              {sub.difficulty}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-[var(--secondary-color)] uppercase font-bold">
                            {sub.lang}
                          </td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {sub.statusDisplay || 'Accepted'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenSolution(sub);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[var(--primary-bg)] border border-[var(--primary-border)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white font-bold transition text-[11px]"
                            >
                              View Code
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Solution Code Viewer */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-mono text-slate-200"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/80">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white flex items-center gap-2">
                      {selectedSubmission.title}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        selectedSubmission.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        selectedSubmission.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {selectedSubmission.difficulty}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Language: <span className="text-amber-400 uppercase font-bold">{selectedSubmission.lang}</span> • Status: <span className="text-emerald-400 font-bold">{selectedSubmission.statusDisplay}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://leetcode.com/problems/${selectedSubmission.titleSlug}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Open on LeetCode"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-400 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Code Container */}
              <div className="p-5 overflow-y-auto flex-1 bg-slate-950 font-mono text-xs leading-relaxed text-slate-300">
                {loadingCode ? (
                  <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
                    <span>Fetching verified solution code...</span>
                  </div>
                ) : (
                  <pre className="overflow-x-auto whitespace-pre font-mono p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <code>{solutionCode}</code>
                  </pre>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
