// 年轮守护 - 模拟演示数据
// GrowthRing AI - Sample Data

function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
}

// ========== 1. 家庭基本信息 ==========
const familyData = {
    childName: "小葵",
    childAge: 3,
    growthStage: "育婴新手期",
    growthPhase: "baby", // baby, preschool, elementary
    familySize: 3,
    monthlyIncome: 25000,
    cityLevel: "一线",
    parentAge: 32,
    hasSecondChild: false
};

// ========== 2. 教育金数据 ==========
const educationData = {
    currentSavings: 100000,
    currentPath: "public",
    monthlyContribution: 2000,
    inflationRate: 0.03,
    paths: {
        public: {
            name: "公立路线",
            description: "稳妥省心，适合注重性价比的家庭",
            milestones: [
                { age: 3, name: "入托", cost: 20000, type: "education" },
                { age: 6, name: "小学", cost: 30000, type: "education" },
                { age: 12, name: "初中", cost: 40000, type: "education" },
                { age: 15, name: "高中", cost: 50000, type: "education" },
                { age: 18, name: "大学", cost: 120000, type: "education" }
            ],
            totalCost: 260000,
            riskLevel: "low"
        },
        international: {
            name: "国际路线",
            description: "双语环境，为留学做准备",
            milestones: [
                { age: 3, name: "国际幼儿园", cost: 50000, type: "education" },
                { age: 6, name: "双语小学", cost: 100000, type: "education" },
                { age: 12, name: "国际初中", cost: 150000, type: "education" },
                { age: 15, name: "国际高中", cost: 200000, type: "education" },
                { age: 18, name: "国内双一流", cost: 400000, type: "education" }
            ],
            totalCost: 900000,
            riskLevel: "medium"
        },
        overseas: {
            name: "海外路线",
            description: "全球视野，冲刺世界名校",
            milestones: [
                { age: 3, name: "高端托育", cost: 80000, type: "education" },
                { age: 6, name: "国际小学", cost: 150000, type: "education" },
                { age: 12, name: "国际初中", cost: 250000, type: "education" },
                { age: 15, name: "美高/英高", cost: 400000, type: "education" },
                { age: 18, name: "海外大学", cost: 1200000, type: "education" }
            ],
            totalCost: 2080000,
            riskLevel: "high"
        }
    },
    events: [],
    stressTestResults: {
        secondChildImpact: 0.15,
        studyAbroadImpact: 0.35,
        jobChangeImpact: 0.2,
        emergencyImpact: 0.25
    }
};

// ========== 3. 支出数据 ==========
const expenseData = {
    total: 15000,
    categories: [
        { name: "刚性成长支出", amount: 6300, percentage: 42, color: "#4CAF50", icon: "fa-shield-alt" },
        { name: "品质生活支出", amount: 4500, percentage: 30, color: "#8B5A2B", icon: "fa-heart" },
        { name: "焦虑驱动支出", amount: 4200, percentage: 28, color: "#E60012", icon: "fa-exclamation-triangle" }
    ],
    details: [
        { id: 1, name: "幼儿园学费", amount: 3500, category: "刚性成长支出", date: "2024-05-01", anxietyLevel: 0 },
        { id: 2, name: "儿童医保", amount: 300, category: "刚性成长支出", date: "2024-05-02", anxietyLevel: 0 },
        { id: 3, name: "绘本教材", amount: 500, category: "刚性成长支出", date: "2024-05-05", anxietyLevel: 0 },
        { id: 4, name: "基础舞蹈班", amount: 2000, category: "刚性成长支出", date: "2024-05-08", anxietyLevel: 1 },
        { id: 5, name: "亲子游", amount: 2500, category: "品质生活支出", date: "2024-05-10", anxietyLevel: 0 },
        { id: 6, name: "益智玩具", amount: 800, category: "品质生活支出", date: "2024-05-12", anxietyLevel: 0 },
        { id: 7, name: "儿童餐厅", amount: 600, category: "品质生活支出", date: "2024-05-15", anxietyLevel: 0 },
        { id: 8, name: "换季衣物", amount: 600, category: "品质生活支出", date: "2024-05-18", anxietyLevel: 0 },
        { id: 9, name: "跟风英语网课", amount: 1800, category: "焦虑驱动支出", date: "2024-05-03", anxietyLevel: 3, trigger: "家长群" },
        { id: 10, name: "闲置早教机", amount: 1200, category: "焦虑驱动支出", date: "2024-05-06", anxietyLevel: 3, trigger: "直播带货" },
        { id: 11, name: "编程课试听包", amount: 800, category: "焦虑驱动支出", date: "2024-05-14", anxietyLevel: 2, trigger: "朋友推荐" },
        { id: 12, name: "智力开发玩具", amount: 400, category: "焦虑驱动支出", date: "2024-05-20", anxietyLevel: 2, trigger: "母婴博主" }
    ],
    alternatives: [
        {
            original: "跟风英语网课（1800元）",
            alternative: "免费资源+亲子共读",
            savings: 1500,
            description: "利用BBC儿童频道、可汗学院等免费资源，每天15分钟亲子共读。研究表明，父母陪伴学习的效果是网课的3倍！",
            effectiveness: "高",
            ageRange: "2-6岁",
            tag: "语言启蒙"
        },
        {
            original: "闲置早教机（1200元）",
            alternative: "图书馆借书+DIY游戏",
            savings: 1000,
            description: "市图书馆有大量优质儿童读物，配合简单的DIY游戏，早教效果不输昂贵设备，还能增进亲子互动",
            effectiveness: "高",
            ageRange: "0-4岁",
            tag: "认知发展"
        },
        {
            original: "编程课试听包（800元）",
            alternative: "Scratch免费版+亲子编程",
            savings: 700,
            description: "MIT开发的Scratch软件完全免费，家长可以和孩子一起学习编程基础，成本为零效果更好",
            effectiveness: "中",
            ageRange: "6-12岁",
            tag: "思维训练"
        },
        {
            original: "高端益智玩具（500元）",
            alternative: "日常生活教具",
            savings: 450,
            description: "用筷子练习精细动作、用扑克牌学习数学、用厨房用品做科学实验，生活本身就是最好的课堂",
            effectiveness: "高",
            ageRange: "2-8岁",
            tag: "动手能力"
        }
    ],
    anxietyTriggers: [
        { name: "家长群", count: 3, percentage: 38, color: "#E60012", description: "群内攀比和信息轰炸" },
        { name: "直播带货", count: 2, percentage: 25, color: "#FF9800", description: "限时抢购制造焦虑" },
        { name: "朋友推荐", count: 2, percentage: 25, color: "#9C27B0", description: "熟人推荐更易信任" },
        { name: "母婴博主", count: 1, percentage: 12, color: "#4CAF50", description: "KOL种草影响" }
    ],
    monthlyBudget: {
        recommended: 12000,
        actual: 15000,
        overBudget: 3000
    },
    spendingPattern: {
        weekly: 3750,
        daily: 535,
        trend: "up"
    }
};

// ========== 4. 保险数据 ==========
const insuranceData = {
    policy: {
        name: "XX少儿重疾险（返还型）",
        company: "某保险公司",
        premium: 8000,
        duration: "20年",
        coverage: 500000,
        type: "返还型",
        issues: [
            "返还型陷阱：看似返本，实际通胀会让20年后的返还款大幅贬值",
            "保额不足：50万在一线城市仅够基础治疗，重症治疗费用通常超百万",
            "缺少医疗险：重疾险只保大病确诊，日常住院和门诊不报销",
            "价格虚高：比纯消费型重疾险贵3倍以上，性价比极低"
        ],
        positives: [
            "覆盖100种重疾，保障范围较广",
            "有投保人豁免条款"
        ],
        riskLevel: "high"
    },
    comparison: [
        { product: "当前产品", type: "返还型", premium: 8000, coverage: 500000, rating: 3, pros: ["返还本金", "保障全面"], cons: ["价格高", "保额低"] },
        { product: "消费型重疾A", type: "消费型", premium: 2500, coverage: 800000, rating: 5, pros: ["性价比高", "保额充足"], cons: ["不返还"] },
        { product: "消费型重疾B", type: "消费型", premium: 3000, coverage: 1000000, rating: 4, pros: ["保额高", "服务好"], cons: ["价格稍高"] }
    ],
    recommendation: {
        totalPremium: 3500,
        annualSavings: 4500,
        coverage: {
            critical: 1000000,
            medical: 2000000,
            accident: 200000
        },
        products: [
            { name: "消费型重疾险", premium: 2500, coverage: 1000000, description: "覆盖100+重疾，确诊即赔" },
            { name: "百万医疗险", premium: 800, coverage: 2000000, description: "报销住院费用，不限病种" },
            { name: "意外险", premium: 200, coverage: 200000, description: "覆盖意外医疗和伤残" }
        ],
        rationale: "这套方案用最低成本配齐'重疾+医疗+意外'黄金三角，比返还型方案每年节省4500元，20年累计节省9万元"
    },
    commonTraps: [
        { id: 1, name: "返还型陷阱", description: "保险公司用'返本'概念包装，实际收益率远低于银行理财", riskLevel: "high", tips: "优先选择纯消费型产品" },
        { id: 2, name: "保额误区", description: "儿童重疾保额建议至少100万，50万在一线城市不够用", riskLevel: "high", tips: "一线城市建议150万以上" },
        { id: 3, name: "捆绑销售", description: "很多代理人会捆绑附加险，增加不必要的费用", riskLevel: "medium", tips: "只选需要的保障责任" },
        { id: 4, name: "等待期陷阱", description: "部分产品等待期长达180天，需特别注意", riskLevel: "medium", tips: "选择等待期短的产品" },
        { id: 5, name: "豁免陷阱", description: "投保人豁免看似美好，实则增加不少保费", riskLevel: "low", tips: "预算有限可暂时不选" }
    ]
};

// ========== 5. 亲子大富翁数据 ==========
const gameData = {
    version: 3,
    childBalance: 195,
    totalEarned: 280,
    totalSaved: 195,
    savingsRate: 69,
    tasks: [
        { id: 1, name: "整理自己的玩具", reward: 10, status: "completed", completedDate: daysAgo(20), type: "housework", icon: "fa-toys" },
        { id: 2, name: "帮忙摆餐具", reward: 5, status: "completed", completedDate: daysAgo(18), type: "housework", icon: "fa-utensils" },
        { id: 3, name: "每天刷牙2次坚持一周", reward: 20, status: "completed", completedDate: daysAgo(15), type: "habit", icon: "fa-tooth" },
        { id: 4, name: "自己穿衣服", reward: 5, status: "available", type: "independence", icon: "fa-shirt" },
        { id: 5, name: "读一本绘本", reward: 8, status: "available", type: "learning", icon: "fa-book" },
        { id: 6, name: "帮妈妈浇花", reward: 5, status: "available", type: "housework", icon: "fa-leaf" }
    ],
    achievements: [
        { id: 1, name: "第一笔收入", unlocked: true, icon: "fa-coins", description: "完成第一个任务", points: 10 },
        { id: 2, name: "家务小能手", unlocked: true, icon: "fa-broom", description: "完成3个家务任务", points: 20 },
        { id: 3, name: "学习之星", unlocked: true, icon: "fa-book", description: "完成5个学习任务", points: 30 },
        { id: 4, name: "储蓄达人", unlocked: true, icon: "fa-piggy-bank", description: "累计储蓄100元", points: 25 },
        { id: 5, name: "坚持达人", unlocked: true, icon: "fa-trophy", description: "连续完成7天任务", points: 35 },
        { id: 6, name: "理财大师", unlocked: false, icon: "fa-chart-line", description: "储蓄率超过50%", points: 40 }
    ],
    challenges: [
        { id: 1, name: "攒钱买乐高", target: 300, current: 195, reward: 50, status: "active", daysLeft: 10, icon: "fa-brick" },
        { id: 2, name: "月度节俭挑战", target: 200, current: 0, reward: 30, status: "available", startDate: null, icon: "fa-calendar-alt" }
    ],
    spendingHistory: [
        { id: 1, name: "买小零食", amount: 10, date: daysAgo(15), category: "consumption", icon: "fa-cookie-bite" },
        { id: 2, name: "买贴纸", amount: 5, date: daysAgo(12), category: "consumption", icon: "fa-stamp" },
        { id: 3, name: "存入小金库", amount: 20, date: daysAgo(10), category: "saving", icon: "fa-piggy-bank" }
    ],
    allowances: {
        weekly: 20,
        lastReceived: daysAgo(0),
        records: [
            { date: daysAgo(0), amount: 20, note: "本周零花钱" },
            { date: daysAgo(7), amount: 20, note: "本周零花钱" },
            { date: daysAgo(14), amount: 20, note: "本周零花钱" },
            { date: daysAgo(21), amount: 20, note: "本周零花钱" }
        ]
    },
    wishlist: [
        { id: 1, name: "乐高城市系列", targetAmount: 299, currentAmount: 0, priority: "high" },
        { id: 2, name: "科学实验套装", targetAmount: 89, currentAmount: 0, priority: "medium" },
        { id: 3, name: "儿童绘本套装", targetAmount: 68, currentAmount: 0, priority: "medium" }
    ],
    giftCards: [
        { id: 1, name: "图书卡", value: 50, balance: 30, icon: "fa-book-open" },
        { id: 2, name: "玩具卡", value: 100, balance: 60, icon: "fa-gamepad" }
    ],
    delayChallenges: [
        { id: 1, name: "推迟一周买零食", targetDays: 7, savedAmount: 15, reward: 10, status: "completed" },
        { id: 2, name: "坚持一个月不买玩具", targetDays: 30, savedAmount: 50, reward: 30, status: "in_progress", daysRemaining: 12 }
    ]
};

// ========== 6. AI对话数据 ==========
const chatData = {
    agents: {
        cgo: {
            name: "首席增长官",
            avatar: "👨‍💼",
            color: "#E60012",
            role: "对话式信息采集与需求挖掘",
            description: "像朋友一样聊天，在轻松对话中完成家庭财务画像",
            greeting: "你好！我是你的首席增长官。我们来聊聊小葵的成长吧～在轻松的对话中，我会帮你记录和规划，让育儿更从容。",
            quickQuestions: [
                { 
                    question: "宝宝马上3岁了，需要准备什么教育支出？", 
                    answer: "3岁是语言和社交能力发展的黄金期！需要重点关注：\n\n🎓 教育类：幼儿园学费（公立约1000-3000元/月，私立5000+）、绘本和益智玩具\n\n🏥 保障类：儿童医保一定要交，商业保险建议配置'重疾+医疗+意外'\n\n🎯 储蓄类：建议开始每月定投教育金，越早复利效果越好\n\n根据你的情况，建议每月预留3000-5000元作为育儿专项支出。" 
                },
                { 
                    question: "最近有什么适合的亲子活动？", 
                    answer: "推荐几个高性价比的亲子活动：\n\n📚 图书馆亲子阅读：免费又有氛围，培养阅读习惯\n🌳 公园自然探索：观察动植物，培养好奇心\n👩🍳 一起做简单烘焙：安全又有趣，锻炼动手能力\n🎨 DIY手工游戏：用废旧材料做玩具，环保又有成就感\n\n这些活动不仅省钱，更重要的是高质量的陪伴！" 
                },
                { 
                    question: "如何避免母婴消费陷阱？", 
                    answer: "新手爸妈容易陷入的消费陷阱：\n\n❌ 进口母婴用品迷信：很多国货品质同样优秀\n❌ 功能单一的高价玩具：简单的积木反而更能激发创造力\n❌ '必须'的早教课：亲子互动比昂贵课程更有效\n\n建议：列清单、做功课、理性消费，记住'够用就好'原则。" 
                }
            ]
        },
        actuary: {
            name: "动态精算师",
            avatar: "👨‍💻",
            color: "#4CAF50",
            role: "家庭现金流极限压力测试",
            description: "用数据说话，提供科学的财务决策支持",
            greeting: "你好，我是动态精算师。让我用数据帮你做出明智的财务决策，为家庭未来保驾护航。",
            quickQuestions: [
                { 
                    question: "我想给孩子报个一年2万的马术班，可行吗？", 
                    answer: "让我们做个全面分析：\n\n💰 成本分析：2万/年 = 1667元/月，占你月收入的6.7%\n\n📈 长期影响：若持续10年，总投入20万，会使教育金蓄水池达标率下降12%\n\n⚖️ 建议方案：\n1. 先尝试短期体验课（1-3个月）观察孩子兴趣\n2. 若确实喜欢，可考虑将日常娱乐支出削减15%来平衡\n3. 优先级：先保障教育金储蓄和家庭应急金\n\n结论：可以报，但建议先体验再决定长期投入。" 
                },
                { 
                    question: "如果现在生二胎，对家庭财务有什么影响？", 
                    answer: "二胎财务影响评估：\n\n📊 直接成本：每年新增约5-8万育儿支出\n\n⏳ 长期影响：\n- 教育金总需求增加约60万\n- 家庭流动性压力上升15%\n- 父母职业发展可能受影响\n\n🎯 建议：\n1. 确保现有应急金足够（至少6个月支出）\n2. 调整教育金规划，考虑双子女方案\n3. 评估双方父母能否提供支持\n\n做好准备后再迎接新成员会更从容！" 
                },
                { 
                    question: "教育金缺口怎么计算？", 
                    answer: "教育金缺口 = 未来总需求 - 已储蓄 - 预期投资收益\n\n以你当前选择的公立路线为例：\n\n🎯 目标金额：26万\n💰 已储蓄：10万\n📉 缺口：16万\n\n💡 解决方案：\n- 每月定投2000元\n- 年化收益率4%\n- 坚持15年\n\n到期可积累约50万，覆盖目标后还有富余！" 
                }
            ]
        },
        counselor: {
            name: "情绪伴航员",
            avatar: "👩‍⚕️",
            color: "#8B5A2B",
            role: "抗焦虑降温提醒与温和复盘",
            description: "温柔共情，帮助你保持理性育儿心态",
            greeting: "亲爱的，我在这里陪着你。育儿路上的焦虑，我们一起面对。你不是一个人在战斗。",
            quickQuestions: [
                { 
                    question: "看到别的孩子都报了很多班，我很焦虑怎么办？", 
                    answer: "我完全理解你的感受，这种'别人家的孩子'焦虑是很多父母都会经历的。\n\n🌸 请记住：\n1. 每个孩子都有自己的成长节奏，花期不同\n2. 高质量陪伴比昂贵的补习班更重要\n3. 关注孩子的兴趣，而不是别人的眼光\n\n🎯 小建议：设定一个'不跟风冷静期'，遇到想报的班先冷静7天再决定。你已经是很棒的父母了！" 
                },
                { 
                    question: "我总是担心给不了孩子最好的", 
                    answer: "这种心情太常见了，几乎每个父母都会有。\n\n💝 但什么是'最好的'呢？\n- 是无尽的物质，还是满满的爱？\n- 是昂贵的课程，还是高质量的陪伴？\n- 是别人眼中的'优秀'，还是孩子真正的快乐？\n\n孩子最需要的是安全感、自信心和被爱的感觉。你现在的付出，已经是给孩子最好的礼物了。" 
                },
                { 
                    question: "如何平衡工作和育儿？", 
                    answer: "平衡是个伪命题，我们追求的应该是'整合'而不是'平衡'。\n\n✨ 小技巧：\n1. 高质量陪伴：每天留30分钟'无手机时间'专注陪孩子\n2. 高效工作：提高单位时间效率，拒绝无效加班\n3. 寻求支持：不要独自承担，和伴侣分工合作\n4. 放过自己：接受不完美，偶尔的'敷衍'没关系\n\n你不需要做100分妈妈/爸爸，做一个'足够好'的父母就够了。" 
                }
            ]
        }
    },
    weeklySummary: {
        date: "2024-05-20",
        totalExpense: 15000,
        anxietyIndex: 68,
        highlights: [
            "教育金储蓄进度良好，本月已达标",
            "亲子阅读坚持得很棒，继续保持"
        ],
        suggestions: [
            { type: "warning", message: "焦虑驱动支出占比偏高(28%)，建议关注", action: "查看平替方案" },
            { type: "info", message: "建议预留下月育儿支出预算", action: "制定预算" }
        ],
        monthlyReport: {
            totalIncome: 25000,
            totalExpense: 15000,
            savings: 10000,
            savingsRate: 40,
            expenseBreakdown: {
                education: 6300,
                living: 4500,
                anxiety: 4200
            }
        }
    },
    monthlySummary: {
        date: "2024年5月",
        totalExpense: 15000,
        anxietyIndex: 68,
        highlights: [
            "教育金储蓄进度良好，本月已达标",
            "亲子阅读坚持得很棒，继续保持"
        ],
        suggestions: [
            { type: "warning", message: "焦虑驱动支出占比偏高(28%)，建议关注", action: "查看平替方案" },
            { type: "info", message: "建议预留下月育儿支出预算", action: "制定预算" }
        ]
    }
};

// ========== 7. 成长阶段数据 ==========
const growthStages = {
    baby: {
        name: "育婴新手期",
        ageRange: "0-3岁",
        icon: "fa-baby",
        color: "#FFB6C1",
        bgColor: "#FFF0F5",
        characteristics: ["初为父母", "易被营销裹挟", "消费陷阱多"],
        description: "这是初为父母的阶段，宝宝从新生儿逐渐成长为活泼好动的幼儿。新手爸妈容易被母婴博主、社群营销所裹挟，面对琳琅满目的母婴用品和各种早教课程，很容易陷入消费陷阱。建议建立消费清单，优先配置基础保障，多进行高质量的亲子互动。",
        focusAreas: ["基础保障", "理性消费", "亲子互动"],
        risks: [
            { name: "补偿心理", color: "#E60012", description: "自己童年缺失的，想加倍补偿给孩子" },
            { name: "恐惧心理", color: "#FF9800", description: "担心孩子输在起跑线上" },
            { name: "输在起点焦虑", color: "#F44336", description: "看到同龄人报班就心慌" }
        ],
        tips: [
            "建立消费清单，避免冲动购物",
            "优先配置基础医保和重疾险",
            "多进行亲子互动，这是最好的早教"
        ],
        commonExpenses: ["奶粉辅食", "纸尿裤", "婴幼儿用品", "早教课程", "疫苗体检"],
        budgetSuggestion: {
            monthly: 3000,
            breakdown: {
                essentials: 1500,
                education: 800,
                play: 400,
                insurance: 300
            }
        }
    },
    preschool: {
        name: "幼儿园探索期",
        ageRange: "4-6岁",
        icon: "fa-child",
        color: "#FFD700",
        bgColor: "#FFFDE7",
        characteristics: ["展现初步特长", "社交圈扩大", "同辈压力开始"],
        description: "孩子进入幼儿园，开始展现出初步的兴趣爱好和特长。社交圈扩大到幼儿园同学和家长群，同辈压力开始显现。这个阶段是培养兴趣爱好的黄金时期，但也是盲目报班的高发期。建议多尝试低成本体验课，培养1-2个核心兴趣即可。",
        focusAreas: ["兴趣探索", "社交能力", "财商启蒙"],
        risks: [
            { name: "广撒网心理", color: "#FFC107", description: "觉得多学总没错，盲目报班" },
            { name: "阶层滑落恐惧", color: "#E91E63", description: "担心孩子跟不上同龄人" },
            { name: "报班容易退班难", color: "#9C27B0", description: "冲动报名后发现不合适" }
        ],
        tips: [
            "多尝试低成本体验课再做决定",
            "培养1-2个核心兴趣即可",
            "开始简单的零花钱管理"
        ],
        commonExpenses: ["幼儿园学费", "兴趣班", "绘本教材", "户外活动", "生日派对"],
        budgetSuggestion: {
            monthly: 5000,
            breakdown: {
                tuition: 2500,
                activities: 1500,
                education: 600,
                play: 400
            }
        }
    },
    elementary: {
        name: "小学成长期",
        ageRange: "7-12岁",
        icon: "fa-graduation-cap",
        color: "#98FB98",
        bgColor: "#E8F5E9",
        characteristics: ["教育支出刚需", "孩子有自主意识", "大额支出增多"],
        description: "孩子进入小学阶段，教育支出成为刚需。学科辅导、特长培养、研学旅行等费用显著增加。孩子开始有自主意识，对金钱有初步概念。建议建立教育金专款专用账户，系统进行财商教育，提前规划大额支出。",
        focusAreas: ["教育规划", "财商教育", "习惯养成"],
        risks: [
            { name: "眼界焦虑", color: "#9C27B0", description: "别人家孩子都在补课" },
            { name: "失控焦虑", color: "#673AB7", description: "担心孩子学习跟不上" },
            { name: "季节性巨额失血", color: "#E91E63", description: "假期补习班、研学营费用高昂" }
        ],
        tips: [
            "建立教育金专款专用账户",
            "系统进行财商教育",
            "提前规划大额支出"
        ],
        commonExpenses: ["学科辅导", "特长培养", "研学旅行", "书籍文具", "校服午餐"],
        budgetSuggestion: {
            monthly: 8000,
            breakdown: {
                tutoring: 3500,
                extracurricular: 2500,
                education: 1200,
                daily: 800
            }
        }
    }
};

// ========== 8. 焦虑干预数据 ==========
const anxietyIntervention = {
    levels: {
        0: { name: "平静", color: "#4CAF50", advice: "状态良好，继续保持理性消费" },
        1: { name: "轻微", color: "#8BC34A", advice: "开始关注消费决策，避免冲动" },
        2: { name: "中等", color: "#FFC107", advice: "建议设置冷静期，对比性价比" },
        3: { name: "较高", color: "#FF9800", advice: "强烈建议暂停消费，重新评估" },
        4: { name: "严重", color: "#E60012", advice: "需要财务降温，寻求专业建议" }
    },
    triggers: {
        "家长群": {
            description: "群内攀比和信息轰炸",
            intervention: [
                "设置群消息免打扰，定时查看",
                "取关过度营销的群",
                "记住：别人展示的都是最好的一面"
            ],
            severity: "high"
        },
        "直播带货": {
            description: "限时抢购制造焦虑",
            intervention: [
                "卸载直播购物APP",
                "购物前等待24小时",
                "只买清单上有的物品"
            ],
            severity: "medium"
        },
        "朋友推荐": {
            description: "熟人推荐更易信任",
            intervention: [
                "询问对方实际使用体验",
                "对比多家产品再决定",
                "考虑自己的实际需求"
            ],
            severity: "medium"
        },
        "母婴博主": {
            description: "KOL种草影响",
            intervention: [
                "关注理性测评博主",
                "查看产品真实评价",
                "警惕'必买'清单"
            ],
            severity: "low"
        }
    }
};

// ========== 9. localStorage 管理 ==========
function initLocalStorage() {
    if (!localStorage.getItem('familyData')) {
        localStorage.setItem('familyData', JSON.stringify(familyData));
    }
    if (!localStorage.getItem('educationData')) {
        localStorage.setItem('educationData', JSON.stringify(educationData));
    }
    if (!localStorage.getItem('expenseData')) {
        localStorage.setItem('expenseData', JSON.stringify(expenseData));
    }
    if (!localStorage.getItem('insuranceData')) {
        localStorage.setItem('insuranceData', JSON.stringify(insuranceData));
    }
    if (!localStorage.getItem('gameData') || JSON.parse(localStorage.getItem('gameData')).version !== 3) {
        localStorage.setItem('gameData', JSON.stringify(gameData));
    }
    if (!localStorage.getItem('chatData')) {
        localStorage.setItem('chatData', JSON.stringify(chatData));
    }
    if (!localStorage.getItem('growthStages')) {
        localStorage.setItem('growthStages', JSON.stringify(growthStages));
    }
    if (!localStorage.getItem('anxietyIntervention')) {
        localStorage.setItem('anxietyIntervention', JSON.stringify(anxietyIntervention));
    }
}

function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : window[key];
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
