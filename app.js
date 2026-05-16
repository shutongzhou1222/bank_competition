// 年轮守护 - 核心逻辑
// GrowthRing AI - Core Logic

let charts = {};
let chatHistory = [];
let educationChart, expensePieChart, anxietyGauge, expenseOverviewChart;

function todayStr() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

// 引导页面数据
let onboardingData = {
    question1: '',
    question2: '',
    question2sub: '',
    question3: '',
    question4: '',
    question5: ''
};

let currentQuestion = 1;
let hasMultipleChildren = false;

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
    initLocalStorage();
    
    // 检查是否需要显示引导页面
    checkOnboardingStatus();
    
    setupEventListeners();
});

function checkOnboardingStatus() {
    const completed = localStorage.getItem('onboardingCompleted');
    const savedData = localStorage.getItem('onboardingData');
    
    if (completed === 'true') {
        // 已完成引导，直接进入首页
        showMainApp();
    } else if (savedData) {
        // 有部分填写数据，恢复并继续
        onboardingData = JSON.parse(savedData);
        restoreOnboardingProgress();
        showOnboarding();
    } else {
        // 第一次访问，显示引导页面
        showOnboarding();
    }
}

function showOnboarding() {
    document.getElementById('onboarding-page').style.display = 'flex';
    document.querySelector('header').style.display = 'none';
    document.getElementById('main-content').style.display = 'none';
    
    // 设置问题1的选项点击事件
    document.querySelectorAll('#q1 .option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectOption('q1', this);
        });
    });
    
    // 设置问题2的选项点击事件
    document.querySelectorAll('#q2 .option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!hasMultipleChildren) {
                selectOption('q2', this);
            }
        });
    });
    
    // 设置问题2子问题的选项点击事件
    document.querySelectorAll('#q2-sub .option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectOption('q2-sub', this);
        });
    });
    
    // 设置问题3的选项点击事件
    document.querySelectorAll('#q3 .option-btn-list').forEach(btn => {
        btn.addEventListener('click', function() {
            selectOption('q3', this);
        });
    });
    
    // 设置问题4的选项点击事件
    document.querySelectorAll('#q4 .option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectOption('q4', this);
        });
    });
    
    // 设置问题5的选项点击事件
    document.querySelectorAll('#q5 .option-btn-list').forEach(btn => {
        btn.addEventListener('click', function() {
            selectOption('q5', this);
        });
    });
}

function showMainApp() {
    document.getElementById('onboarding-page').style.display = 'none';
    document.querySelector('header').style.display = 'block';
    document.getElementById('main-content').style.display = 'block';
    renderHomePage();
}

function restoreOnboardingProgress() {
    // 根据已保存的数据恢复进度
    let progress = 0;
    
    if (onboardingData.question1) {
        progress += 20;
        markQuestionAnswered('q1');
        
        if (onboardingData.question2) {
            progress += 20;
            markQuestionAnswered('q2');
            
            if (onboardingData.question3) {
                progress += 20;
                markQuestionAnswered('q3');
                
                if (onboardingData.question4) {
                    progress += 20;
                    markQuestionAnswered('q4');
                    
                    if (onboardingData.question5) {
                        progress += 20;
                        markQuestionAnswered('q5');
                        showCompleteButton();
                    } else {
                        showQuestion('q5');
                    }
                } else {
                    showQuestion('q4');
                }
            } else {
                showQuestion('q3');
            }
        } else {
            // 检查是否需要显示子问题
            if (['2', '3'].includes(onboardingData.question1)) {
                hasMultipleChildren = true;
                document.getElementById('q2-sub').style.display = 'block';
            }
            showQuestion('q2');
        }
    }
    
    updateProgress(progress);
}

function selectOption(questionId, button) {
    // 移除同问题其他选项的选中状态
    document.querySelectorAll(`#${questionId} .option-btn, #${questionId} .option-btn-list`).forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // 设置当前选项为选中状态
    button.classList.add('selected');
    
    // 保存答案
    if (questionId === 'q1') {
        onboardingData.question1 = button.dataset.value;
        
        // 判断是否需要显示子问题
        if (['2', '3'].includes(button.dataset.value)) {
            hasMultipleChildren = true;
        }
    } else if (questionId === 'q2') {
        onboardingData.question2 = button.dataset.value;
        
        // 如果有多个孩子，显示子问题
        if (hasMultipleChildren && !onboardingData.question2sub) {
            document.getElementById('q2-sub').style.display = 'block';
            return;
        }
    } else if (questionId === 'q2-sub') {
        onboardingData.question2sub = button.dataset.value;
    } else if (questionId === 'q3') {
        onboardingData.question3 = button.dataset.value;
    } else if (questionId === 'q4') {
        onboardingData.question4 = button.dataset.value;
    } else if (questionId === 'q5') {
        onboardingData.question5 = button.dataset.value;
    }
    
    // 保存到本地存储
    saveOnboardingData();
    
    // 标记当前问题为已回答
    markQuestionAnswered(questionId);
    
    // 更新进度
    currentQuestion++;
    const progress = Math.min(currentQuestion * 20, 100);
    updateProgress(progress);
    
    // 显示下一个问题或完成
    if (questionId === 'q2-sub') {
        // 子问题回答完后继续
        currentQuestion++;
        updateProgress(Math.min(currentQuestion * 20, 100));
        showQuestion('q3');
    } else if (questionId === 'q5') {
        // 最后一个问题，显示完成按钮
        showCompleteButton();
    } else {
        // 显示下一个问题
        const nextQuestionId = `q${currentQuestion}`;
        if (document.getElementById(nextQuestionId)) {
            showQuestion(nextQuestionId);
        }
    }
}

function markQuestionAnswered(questionId) {
    const card = document.getElementById(questionId);
    if (card) {
        card.classList.remove('active');
        card.classList.add('answered');
    }
}

function showQuestion(questionId) {
    const card = document.getElementById(questionId);
    if (card) {
        setTimeout(() => {
            card.classList.add('active');
        }, 300);
    }
}

function updateProgress(percent) {
    document.getElementById('onboarding-progress').style.width = `${percent}%`;
    
    if (percent >= 100) {
        document.getElementById('progress-text').textContent = '已完成！';
    } else {
        const step = Math.ceil(percent / 20);
        document.getElementById('progress-text').textContent = `第 ${step} / 5 步`;
    }
}

function showCompleteButton() {
    document.querySelector('.skip-btn').style.display = 'none';
    document.getElementById('submit-btn').style.display = 'block';
}

function saveOnboardingData() {
    localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
}

function skipOnboarding() {
    // 保存已填写的数据
    saveOnboardingData();
    showMainApp();
}

function generateNavMap() {
    // 显示加载动画
    document.getElementById('loading-overlay').style.display = 'flex';
    
    // 标记引导完成
    localStorage.setItem('onboardingCompleted', 'true');
    
    // 根据用户输入生成个性化数据
    generatePersonalizedData();
    
    // 2秒后跳转到首页
    setTimeout(() => {
        document.getElementById('loading-overlay').style.display = 'none';
        showMainApp();
    }, 2000);
}

function generatePersonalizedData() {
    try {
        const familyData = getData('familyData');
        const educationData = getData('educationData');
        const expenseData = getData('expenseData');
        
        // 根据问题1（孩子数量）设置
        const childCount = parseInt(onboardingData.question1) || 1;
        familyData.childCount = childCount;
        
        // 根据问题2（孩子年龄）设置成长阶段
        const ageGroup = onboardingData.question2;
        let childAge = 3;
        let growthPhase = 'baby';
        
        switch(ageGroup) {
            case 'baby':
                childAge = 2;
                growthPhase = 'baby';
                break;
            case 'preschool':
                childAge = 5;
                growthPhase = 'preschool';
                break;
            case 'lower':
                childAge = 8;
                growthPhase = 'elementary';
                break;
            case 'upper':
                childAge = 10;
                growthPhase = 'elementary';
                break;
            case 'teen':
                childAge = 14;
                growthPhase = 'elementary';
                break;
        }
        
        familyData.childAge = childAge;
        familyData.growthPhase = growthPhase;
        
        // 获取成长阶段名称
        const growthStages = getData('growthStages');
        familyData.growthStage = growthStages[growthPhase] ? growthStages[growthPhase].name : '育婴新手期';
        
        // 根据问题3（教育路线）设置 - 如果未决定，默认选择公立路线
        let educationPath = onboardingData.question3 || 'public';
        if (educationPath === 'undecided') {
            educationPath = 'public';
        }
        educationData.currentPath = educationPath;
        
        // 根据问题4（收入区间）设置月收入和预算
        const incomeRange = onboardingData.question4;
        let monthlyIncome = 25000;
        
        switch(incomeRange) {
            case '1':
                monthlyIncome = 8000;
                break;
            case '2':
                monthlyIncome = 15000;
                break;
            case '3':
                monthlyIncome = 25000;
                break;
            case '4':
                monthlyIncome = 40000;
                break;
            case '5':
                monthlyIncome = 60000;
                break;
        }
        
        familyData.monthlyIncome = monthlyIncome;
        
        // 根据收入计算建议预算
        const recommendedBudget = Math.round(monthlyIncome * 0.3);
        expenseData.monthlyBudget.recommended = recommendedBudget;
        expenseData.monthlyBudget.actual = Math.round(recommendedBudget * 0.8);
        expenseData.monthlyBudget.overBudget = recommendedBudget;
        
        // 根据问题5（风险承受能力）调整投资建议
        const riskProfile = onboardingData.question5;
        educationData.riskProfile = riskProfile;
        
        // 根据风险偏好调整预期收益率
        let expectedReturn = 4;
        switch(riskProfile) {
            case 'conservative':
                expectedReturn = 2;
                break;
            case 'moderate':
                expectedReturn = 4;
                break;
            case 'aggressive':
                expectedReturn = 6;
                break;
            default:
                expectedReturn = 3;
        }
        educationData.expectedReturn = expectedReturn;
        
        // 计算教育金进度（添加错误处理）
        const currentPath = educationData.paths[educationPath];
        if (currentPath && currentPath.totalCost && currentPath.totalCost > 0) {
            const totalCost = currentPath.totalCost;
            const maxSavings = monthlyIncome * 0.15 * 12 * (18 - childAge);
            // currentSavings 只基于收入和年龄估算，不随路线变化
            const estimatedSavings = Math.round(monthlyIncome * 0.1 * 12 * Math.max(1, childAge));
            educationData.currentSavings = Math.min(estimatedSavings, totalCost);
            educationData.targetAmount = totalCost;
        } else {
            educationData.currentSavings = 100000;
            educationData.targetAmount = 260000;
        }
        
        // 更新支出数据
        expenseData.total = Math.round(monthlyIncome * 0.4);
        expenseData.categories[0].amount = Math.round(expenseData.total * 0.45);
        expenseData.categories[1].amount = Math.round(expenseData.total * 0.27);
        expenseData.categories[2].amount = Math.round(expenseData.total * 0.28);
        
        // 更新百分比
        expenseData.categories.forEach(cat => {
            cat.percentage = expenseData.total > 0 ? Math.round((cat.amount / expenseData.total) * 100) : 0;
        });
        
        // 保存所有数据
        saveData('familyData', familyData);
        saveData('educationData', educationData);
        saveData('expenseData', expenseData);
        
        console.log('个性化数据生成成功');
    } catch (error) {
        console.error('生成个性化数据时出错:', error);
    }
}

// ========== 退出登录功能 ==========
function logout() {
    try {
        // 清除所有用户相关数据
        localStorage.removeItem('onboardingCompleted');
        localStorage.removeItem('onboardingData');
        localStorage.removeItem('familyData');
        localStorage.removeItem('educationData');
        localStorage.removeItem('expenseData');
        localStorage.removeItem('insuranceData');
        localStorage.removeItem('gameData');
        localStorage.removeItem('chatHistory');
        
        // 重置引导数据
        onboardingData = {
            question1: '',
            question2: '',
            question2sub: '',
            question3: '',
            question4: '',
            question5: ''
        };
        currentQuestion = 1;
        hasMultipleChildren = false;
        
        // 显示引导页面
        showOnboarding();
        
        console.log('用户已退出，数据已清除');
    } catch (error) {
        console.error('退出时出错:', error);
    }
}

function setupEventListeners() {
    // 用户菜单按钮点击事件
    const userMenuBtn = document.getElementById('user-menu-btn');
    const userMenuDropdown = document.getElementById('user-menu-dropdown');
    
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenuDropdown.style.display = userMenuDropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        // 点击其他地方关闭菜单
        document.addEventListener('click', function(e) {
            if (!userMenuBtn.contains(e.target) && !userMenuDropdown.contains(e.target)) {
                userMenuDropdown.style.display = 'none';
            }
        });
    }
    
    // 退出登录功能
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('确定要退出吗？所有家庭信息将被清除，下次进入需要重新填写引导问答。')) {
                logout();
            }
        });
    }

    document.querySelectorAll('[data-path]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('[data-path]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            changeEducationPath(this.dataset.path);
        });
    });

    document.getElementById('chat-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// ========== 页面导航 ==========
function navigateTo(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.getElementById(`page-${page}`).classList.add('active');
    document.querySelector(`.nav-item[data-page="${page}"]`).classList.add('active');
    
    if (page === 'home') renderHomePage();
    else if (page === 'education') renderEducationPage();
    else if (page === 'expense') renderExpensePage();
    else if (page === 'insurance') renderInsurancePage();
    else if (page === 'game') renderGamePage();
    else if (page === 'chat') renderChatPage();
}

// ========== 智能行动卡 ==========
function renderAIActionCard() {
    const familyData = getData('familyData');
    const educationData = getData('educationData');
    const expenseData = getData('expenseData');

    const childAge = familyData.childAge || 3;
    const monthlyIncome = familyData.monthlyIncome || 25000;
    const currentSavings = educationData.currentSavings || 0;
    const paths = educationData.paths || window.educationData.paths;
    const currentPathKey = educationData.currentPath || 'public';
    const currentPath = paths[currentPathKey];
    const totalCost = currentPath ? currentPath.totalCost : 260000;
    const gap = Math.max(0, totalCost - currentSavings);
    const yearsLeft = Math.max(1, 22 - childAge);
    const monthlyNeeded = Math.round(gap / (yearsLeft * 12));
    const currentMonthly = educationData.monthlyContribution || 2000;
    const monthlyShortfall = monthlyNeeded - currentMonthly;

    const { total: protectionScore } = calculateProtectionScore();
    const anxietyCategory = expenseData.categories ? expenseData.categories[2] : null;
    const anxietyAmount = anxietyCategory ? anxietyCategory.amount : 0;

    // 优先级评分：缺口越大、保障越低、焦虑支出越高，优先级越高
    const actions = [];

    // 教育金缺口行动
    if (monthlyShortfall > 500) {
        actions.push({
            priority: monthlyShortfall / 100,
            text: `距离${currentPath ? currentPath.name : '教育目标'}还差 ${(gap / 10000).toFixed(0)} 万元，按当前储蓄速度每月需多存 ${monthlyShortfall.toLocaleString()} 元才能按时达标。`,
            btnText: '调整储蓄计划',
            page: 'education',
            meta: `缺口 ${(gap / 10000).toFixed(0)}万 · 还剩 ${yearsLeft} 年`
        });
    }

    // 保障缺口行动
    if (protectionScore < 60) {
        actions.push({
            priority: (60 - protectionScore) * 2,
            text: `家庭保障评分仅 ${protectionScore} 分，当前保单缺少医疗险和意外险，一旦发生意外将直接冲击教育金储蓄。建议优先补齐保障缺口，每年仅需约 1,000 元。`,
            btnText: '查看保障建议',
            page: 'insurance',
            meta: `保障评分 ${protectionScore}/100`
        });
    }

    // 焦虑支出行动
    if (anxietyAmount > monthlyIncome * 0.1) {
        actions.push({
            priority: (anxietyAmount / monthlyIncome) * 50,
            text: `本月焦虑驱动支出达 ${anxietyAmount.toLocaleString()} 元，占月收入的 ${Math.round(anxietyAmount / monthlyIncome * 100)}%。如果把其中一半转入教育金，每年可多存 ${Math.round(anxietyAmount * 6).toLocaleString()} 元。`,
            btnText: '分析支出结构',
            page: 'expense',
            meta: `焦虑支出 ${anxietyAmount.toLocaleString()}元/月`
        });
    }

    // 默认行动（所有指标都健康时）
    if (actions.length === 0) {
        actions.push({
            priority: 0,
            text: `各项财务指标运转良好！${childAge} 岁是培养财商的好时机，可以和${familyData.childName || '孩子'}一起玩亲子大富翁，让理财意识从小扎根。`,
            btnText: '开始亲子游戏',
            page: 'game',
            meta: '财务状态健康'
        });
    }

    // 取优先级最高的行动
    actions.sort((a, b) => b.priority - a.priority);
    const top = actions[0];

    const textEl = document.getElementById('ai-action-text');
    const btnEl = document.getElementById('ai-action-btn');
    const metaEl = document.getElementById('ai-action-meta');

    if (textEl) textEl.textContent = top.text;
    if (metaEl) metaEl.textContent = top.meta;
    if (btnEl) {
        btnEl.textContent = top.btnText;
        btnEl.onclick = () => navigateTo(top.page);
    }
}


// ========== 保单录入 ==========
function initPolicyTypes() {
    const saved = getUserPolicyTypes();
    ['critical', 'medical', 'accident'].forEach(type => {
        const has = saved[type] !== undefined;
        const amount = saved[type] || '';
        const row = document.getElementById(`policy-${type}-row`);
        const check = document.getElementById(`policy-${type}-check`);
        const input = document.getElementById(`policy-${type}-amount`);
        if (check) {
            check.innerHTML = has ? '<i class="fas fa-check text-white text-xs"></i>' : '';
            check.style.background = has ? 'var(--cmb-red)' : '';
            check.style.borderColor = has ? 'var(--cmb-red)' : '#ccc';
        }
        if (row) row.style.background = has ? '#fff5f5' : '';
        if (input && amount) input.value = amount;
    });
}

function togglePolicyType(type) {
    const saved = getUserPolicyTypes();
    if (saved[type] !== undefined) {
        delete saved[type];
    } else {
        const input = document.getElementById(`policy-${type}-amount`);
        saved[type] = (input && input.value) ? parseInt(input.value) : 100;
    }
    localStorage.setItem('userPolicyTypes', JSON.stringify(saved));
    initPolicyTypes();
    renderProtectionScore();
    renderAIActionCard();
}

function savePolicyTypes() {
    const saved = getUserPolicyTypes();
    ['critical', 'medical', 'accident'].forEach(type => {
        const input = document.getElementById(`policy-${type}-amount`);
        if (saved[type] !== undefined && input && input.value) {
            saved[type] = parseInt(input.value);
        }
    });
    localStorage.setItem('userPolicyTypes', JSON.stringify(saved));
    renderProtectionScore();
    renderAIActionCard();
}

function getUserPolicyTypes() {
    return JSON.parse(localStorage.getItem('userPolicyTypes') || '{}');
}

function calculateProtectionScore() {
    const insuranceData = getData('insuranceData');
    const policy = insuranceData.policy;
    const recommendation = insuranceData.recommendation;
    const traps = insuranceData.commonTraps || [];
    const userPolicy = getUserPolicyTypes();
    const hasUserData = Object.keys(userPolicy).length > 0;

    const dimensions = [];

    // 1. 保额充足度（满分30）：优先用用户录入的重疾保额
    const userCriticalWan = userPolicy.critical || 0;
    const currentCoverage = hasUserData ? userCriticalWan * 10000 : (policy.coverage || 0);
    const recommendedCritical = recommendation.coverage.critical || 1000000;
    const coverageRatio = currentCoverage / recommendedCritical;
    const coverageScore = Math.round(Math.min(coverageRatio, 1) * 30);
    dimensions.push({
        name: '保额充足度',
        score: coverageScore,
        max: 30,
        desc: coverageRatio >= 1
            ? `重疾保额 ${(currentCoverage/10000).toFixed(0)}万，达到建议标准`
            : currentCoverage > 0
                ? `重疾保额 ${(currentCoverage/10000).toFixed(0)}万，建议至少 ${(recommendedCritical/10000).toFixed(0)}万`
                : `未录入重疾险保额，建议至少 ${(recommendedCritical/10000).toFixed(0)}万`
    });

    // 2. 险种覆盖（满分25）：重疾15分+医疗7分+意外3分，优先读用户录入
    const hasTypes = hasUserData
        ? { critical: userPolicy.critical !== undefined, medical: userPolicy.medical !== undefined, accident: userPolicy.accident !== undefined }
        : { critical: true, medical: false, accident: false };
    const typeScore = (hasTypes.critical ? 15 : 0) + (hasTypes.medical ? 7 : 0) + (hasTypes.accident ? 3 : 0);
    const missingTypes = [];
    if (!hasTypes.critical) missingTypes.push('重疾险');
    if (!hasTypes.medical) missingTypes.push('百万医疗险');
    if (!hasTypes.accident) missingTypes.push('意外险');
    dimensions.push({
        name: '险种覆盖',
        score: typeScore,
        max: 25,
        desc: missingTypes.length === 0
            ? '重疾、医疗、意外险齐全'
            : missingTypes.length === 3
                ? '尚未录入任何保险，建议先配置重疾险'
                : `缺少${missingTypes.join('和')}`
    });

    // 3. 性价比（满分25）：当前产品rating vs 最高rating
    const ratings = (insuranceData.comparison || []).map(p => p.rating);
    const currentRating = ratings[0] || 3;
    const maxRating = Math.max(...ratings);
    const priceScore = Math.round((currentRating / maxRating) * 25);
    dimensions.push({
        name: '产品性价比',
        score: priceScore,
        max: 25,
        desc: currentRating < maxRating
            ? `当前产品评分 ${currentRating}/5，市场有更优方案`
            : '当前产品性价比最优'
    });

    // 4. 风险暴露（满分20）：基于当前保单风险等级和问题/优势数量
    const riskBaseMap = { low: 18, medium: 13, high: 10 };
    const riskBase = riskBaseMap[policy.riskLevel] || 10;
    const issueCount = (policy.issues || []).length;
    const positiveCount = (policy.positives || []).length;
    const riskScore = Math.max(0, Math.min(20, riskBase - issueCount + positiveCount));
    dimensions.push({
        name: '风险暴露',
        score: riskScore,
        max: 20,
        desc: policy.riskLevel === 'high'
            ? `当前保单风险较高，存在 ${issueCount} 项问题`
            : `风险可控，${issueCount} 项问题已知`
    });

    const total = dimensions.reduce((s, d) => s + d.score, 0);
    return { total, dimensions };
}

function renderProtectionScore() {
    const { total, dimensions } = calculateProtectionScore();
    const scoreEl = document.getElementById('protection-score');
    const labelEl = document.getElementById('protection-score-label');
    const breakdownEl = document.getElementById('protection-score-breakdown');

    if (scoreEl) scoreEl.textContent = total;

    if (labelEl) {
        if (total >= 80) {
            labelEl.textContent = '保障较完善 ✅';
            labelEl.className = 'text-sm mb-2 text-green-600';
        } else if (total >= 60) {
            labelEl.textContent = '建议优化提升 💪';
            labelEl.className = 'text-sm mb-2 text-yellow-600';
        } else {
            labelEl.textContent = '保障存在明显缺口 ⚠️';
            labelEl.className = 'text-sm mb-2 text-red-500';
        }
    }

    if (breakdownEl) {
        breakdownEl.innerHTML = dimensions.map(d => {
            const pct = Math.round((d.score / d.max) * 100);
            const color = pct >= 80 ? '#4CAF50' : pct >= 50 ? '#FF9800' : '#E60012';
            return `<div>
                <div class="flex justify-between text-xs mb-1">
                    <span class="text-gray-600">${d.name}</span>
                    <span style="color:${color};font-weight:600;">${d.score}/${d.max}</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full" style="height:4px;">
                    <div style="width:${pct}%;height:4px;border-radius:9999px;background:${color};"></div>
                </div>
                <p class="text-xs text-gray-400 mt-1">${d.desc}</p>
            </div>`;
        }).join('');
    }
}

function toggleProtectionDetail() {
    const detail = document.getElementById('protection-score-detail');
    if (detail) {
        detail.style.display = detail.style.display === 'none' ? 'block' : 'none';
    }
}

// ========== 首页渲染 ==========
function renderHomePage() {
    try {
        const familyData = getData('familyData');
        const educationData = getData('educationData');
        const expenseData = getData('expenseData');
        const growthStages = getData('growthStages');
        
        // 设置孩子信息
        if (familyData && familyData.childName) {
            document.getElementById('child-name').textContent = familyData.childName;
        }
        if (familyData && familyData.childAge) {
            document.getElementById('child-age').textContent = familyData.childAge;
        }
        if (familyData && familyData.growthStage) {
            document.getElementById('growth-stage').textContent = familyData.growthStage;
        }
        
        // 计算教育金进度和显示教育目标、路径
        let progress = 0;
        let totalCost = 0;
        if (educationData && educationData.paths && educationData.paths[educationData.currentPath]) {
            const currentPath = educationData.paths[educationData.currentPath];
            if (currentPath && currentPath.totalCost && currentPath.totalCost > 0 && educationData.currentSavings) {
                progress = Math.min(Math.round((educationData.currentSavings / currentPath.totalCost) * 100), 100);
                totalCost = currentPath.totalCost;
            }
        }
        
        document.getElementById('edu-progress').textContent = progress;
        document.getElementById('edu-progress-bar').style.width = `${progress}%`;
        document.getElementById('edu-saved').textContent = formatNumber(educationData.currentSavings || 0);
        
        // 显示教育目标和路径
        document.getElementById('edu-goal').textContent = formatNumber(totalCost) + '元';
        const pathNames = {
            'public': '公立路线',
            'international': '国际双语',
            'overseas': '海外留学',
            'undecided': '未决定'
        };
        document.getElementById('edu-path').textContent = pathNames[educationData.currentPath] || '公立路线';
        
        // 渲染保障评分
        renderProtectionScore();

        // 渲染智能行动卡
        renderAIActionCard();

        // 渲染成长阶段卡片
        if (familyData && familyData.growthPhase) {
            renderGrowthStageCard(familyData.growthPhase);
        }
        
        // 渲染月度总结和快捷入口
        currentViewMonth = new Date().getMonth();
        renderMonthlySummary();
        renderQuickEntryCards();
        
        console.log('首页渲染成功');
    } catch (error) {
        console.error('渲染首页时出错:', error);
    }
}

function calculateAnxietyIndex() {
    const expenseData = getData('expenseData');
    const familyData = getData('familyData');
    const educationData = getData('educationData');

    const monthlyIncome = (familyData && familyData.monthlyIncome) ? familyData.monthlyIncome : 25000;
    const childAge = (familyData && familyData.childAge) ? familyData.childAge : 3;

    // 维度1：焦虑驱动支出占比（权重35）
    const anxietyCategory = expenseData.categories ? expenseData.categories[2] : null;
    const anxietyAmount = anxietyCategory ? anxietyCategory.amount : 0;
    const anxietyRatio = Math.min(anxietyAmount / monthlyIncome, 0.5); // 最高50%
    const d1 = Math.round(anxietyRatio * 70); // 0-35分

    // 维度2：教育金缺口压力（权重30）
    const paths = (educationData && educationData.paths) ? educationData.paths : window.educationData.paths;
    const currentPathKey = (educationData && educationData.currentPath) ? educationData.currentPath : 'public';
    const currentPath = paths[currentPathKey];
    const totalCost = currentPath ? currentPath.totalCost : 260000;
    const currentSavings = (educationData && educationData.currentSavings) ? educationData.currentSavings : 0;
    const yearsLeft = Math.max(1, 22 - childAge);
    const monthlyNeeded = totalCost / (yearsLeft * 12);
    const currentMonthly = (educationData && educationData.monthlyContribution) ? educationData.monthlyContribution : 2000;
    const gapRatio = Math.max(0, Math.min((monthlyNeeded - currentMonthly) / monthlyNeeded, 1));
    const d2 = Math.round(gapRatio * 30); // 0-30分

    // 维度3：保障缺口压力（权重20）
    const { total: protectionScore } = calculateProtectionScore();
    const d3 = Math.round((1 - protectionScore / 100) * 20); // 0-20分

    // 维度4：收入压力（权重15）：支出/收入比
    const totalExpense = expenseData.total || 0;
    const expenseRatio = Math.min(totalExpense / monthlyIncome, 1);
    const d4 = Math.round(expenseRatio * 15); // 0-15分

    return Math.min(d1 + d2 + d3 + d4, 99);
}

function renderGrowthStageCard(phase) {
    try {
        const growthStages = getData('growthStages');
        const stage = growthStages && growthStages[phase];
        
        if (stage) {
            const iconEl = document.getElementById('stage-icon');
            const iconBgEl = document.getElementById('stage-icon-bg');
            const nameEl = document.getElementById('stage-name');
            const ageEl = document.getElementById('stage-age');
            const cardEl = document.getElementById('stage-card');
            const descEl = document.getElementById('stage-description');
            const tipsEl = document.getElementById('stage-tips');
            
            if (iconEl) {
                iconEl.className = `fas ${stage.icon}`;
                iconEl.style.color = stage.color;
            }
            if (iconBgEl) {
                iconBgEl.style.backgroundColor = `${stage.color}20`;
            }
            if (nameEl) {
                nameEl.textContent = stage.name;
            }
            if (ageEl) {
                ageEl.textContent = stage.ageRange;
            }
            if (cardEl) {
                cardEl.style.borderLeft = `4px solid ${stage.color}`;
            }
            if (descEl) {
                descEl.textContent = stage.description || '';
            }
            if (tipsEl && stage.tips) {
                tipsEl.innerHTML = stage.tips.map(tip => 
                    `<li class="flex items-start text-sm text-gray-600"><i class="fas fa-lightbulb text-yellow-500 mr-2 mt-0.5"></i>${tip}</li>`
                ).join('');
            }
            
            updateWarmTip(stage);
        }
    } catch (error) {
        console.error('渲染成长阶段卡片时出错:', error);
    }
}

function updateWarmTip(stage) {
    const tips = [
        `🌟 ${stage.name}是培养孩子${stage.focusAreas[0]}的关键时期，建议注重${stage.focusAreas[1]}的培养。`,
        `💡 在${stage.name}，${stage.tips[0]}是很重要的习惯。`,
        `📚 与孩子一起阅读绘本，每天${Math.floor(Math.random() * 20) + 10}分钟，效果胜过昂贵的早教班。`,
        `👨‍👩‍👧‍👦 多进行亲子互动游戏，这是${stage.name}最好的教育方式。`
    ];
    document.getElementById('warm-tip').textContent = tips[Math.floor(Math.random() * tips.length)];
}

// ========== 用户信息编辑功能 ==========
function openProfileModal() {
    const familyData = getData('familyData');
    
    document.getElementById('edit-child-name').value = familyData.childName;
    document.getElementById('edit-child-age').value = familyData.childAge;
    document.getElementById('edit-family-income').value = familyData.monthlyIncome;
    document.getElementById('edit-city').value = familyData.city;
    
    document.getElementById('profile-modal').style.display = 'flex';
}

function closeProfileModal() {
    document.getElementById('profile-modal').style.display = 'none';
}

function saveProfile() {
    const familyData = getData('familyData');
    
    const childName = document.getElementById('edit-child-name').value || familyData.childName;
    const childAge = parseInt(document.getElementById('edit-child-age').value) || familyData.childAge;
    const monthlyIncome = parseInt(document.getElementById('edit-family-income').value) || familyData.monthlyIncome;
    const city = document.getElementById('edit-city').value || familyData.city;
    
    const growthPhase = getGrowthPhaseByAge(childAge);
    const growthStages = getData('growthStages');
    const stage = growthStages[growthPhase];
    
    const updatedData = {
        ...familyData,
        childName,
        childAge,
        monthlyIncome,
        city,
        growthPhase,
        growthStage: stage ? stage.name : '育婴新手期'
    };
    
    saveData('familyData', updatedData);
    closeProfileModal();
    renderHomePage();
    
    showToast('家庭信息已更新');
}

function getGrowthPhaseByAge(age) {
    if (age >= 0 && age <= 3) return 'baby';
    if (age >= 4 && age <= 6) return 'preschool';
    if (age >= 7 && age <= 12) return 'elementary';
    return 'baby';
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

// 月份切换相关变量
let currentViewMonth = new Date().getMonth();
let currentViewYear = new Date().getFullYear();

function switchMonth(direction) {
    currentViewMonth += direction;
    
    if (currentViewMonth > 11) {
        currentViewMonth = 0;
        currentViewYear++;
    } else if (currentViewMonth < 0) {
        currentViewMonth = 11;
        currentViewYear--;
    }
    
    // 更新按钮状态
    const now = new Date();
    const isCurrentMonth = currentViewYear === now.getFullYear() && currentViewMonth === now.getMonth();
    document.getElementById('next-month-btn').disabled = isCurrentMonth;
    
    renderMonthlySummary();
}

function renderMonthlySummary() {
    const expenseData = getData('expenseData');
    const educationData = getData('educationData');
    
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    document.getElementById('summary-date').textContent = `${currentViewYear}年${monthNames[currentViewMonth]}`;
    
    // 模拟当月数据（实际应该从expenseData中获取）
    const monthlyExpense = Math.round(15000 + Math.random() * 5000);
    const monthlySavings = Math.round(5000 + Math.random() * 2000);
    const prevMonthExpense = Math.round(14000 + Math.random() * 5000);
    const prevMonthSavings = Math.round(4500 + Math.random() * 2000);
    
    // 计算环比变化
    const expenseChange = Math.round(((monthlyExpense - prevMonthExpense) / prevMonthExpense) * 100);
    const savingsChange = Math.round(((monthlySavings - prevMonthSavings) / prevMonthSavings) * 100);
    
    document.getElementById('summary-expense').textContent = formatNumber(monthlyExpense);
    document.getElementById('summary-savings').textContent = formatNumber(monthlySavings);
    
    // 更新变化显示
    const expenseChangeEl = document.getElementById('expense-change');
    if (expenseChange >= 0) {
        expenseChangeEl.innerHTML = `<span class="text-red-500">↑ ${expenseChange}%</span><span class="text-gray-400"> 较上月</span>`;
    } else {
        expenseChangeEl.innerHTML = `<span class="text-green-500">↓ ${Math.abs(expenseChange)}%</span><span class="text-gray-400"> 较上月</span>`;
    }
    
    const savingsChangeEl = document.getElementById('savings-change');
    if (savingsChange >= 0) {
        savingsChangeEl.innerHTML = `<span class="text-green-500">↑ ${savingsChange}%</span><span class="text-gray-400"> 较上月</span>`;
    } else {
        savingsChangeEl.innerHTML = `<span class="text-red-500">↓ ${Math.abs(savingsChange)}%</span><span class="text-gray-400"> 较上月</span>`;
    }
    
    // 生成当月亮点
    const highlights = [];
    if (savingsChange > 0) {
        highlights.push(`储蓄金额较上月提升 ${savingsChange}%，继续保持！`);
    }
    if (expenseChange < 0) {
        highlights.push(`支出控制良好，较上月减少 ${Math.abs(expenseChange)}%`);
    }
    if (expenseData && expenseData.categories) {
        const rigidRatio = expenseData.categories[0].percentage;
        if (rigidRatio > 50) {
            highlights.push(`刚性支出占比${rigidRatio}%，财务结构健康`);
        }
    }
    if (educationData && educationData.currentSavings > 0) {
        highlights.push(`教育金持续积累，已存 ${formatNumber(educationData.currentSavings)} 元`);
    }
    if (highlights.length === 0) {
        highlights.push('财务状况总体稳定，继续保持良好的消费习惯');
    }
    
    document.getElementById('summary-highlights').innerHTML = highlights.map(h => `<li>${h}</li>`).join('');
    
    // 生成优化建议
    const suggestions = [];
    if (expenseChange > 10) {
        suggestions.push('本月支出增长较快，建议检查非必要支出');
    }
    if (savingsChange < 0) {
        suggestions.push('储蓄金额有所下降，建议调整预算，增加教育金储备');
    }
    const familyData = getData('familyData');
    if (familyData && familyData.growthPhase === 'baby') {
        suggestions.push('育婴早期阶段，建议提前规划教育金，利用时间复利');
    }
    if (suggestions.length === 0) {
        suggestions.push('各项指标表现良好，维持现有理财习惯即可');
    }
    
    document.getElementById('summary-suggestions').innerHTML = suggestions.map(s => `<div>• ${s}</div>`).join('');
}

function renderQuickEntryCards() {
    const quickEntries = [
        { icon: 'fa-chart-line', title: '教育金规划', desc: '查看成长路线', color: '#E60012', page: 'education' },
        { icon: 'fa-bar-chart', title: '支出分析', desc: '识别焦虑消费', color: '#4CAF50', page: 'expense' },
        { icon: 'fa-shield-alt', title: '保险测评', desc: '智能保单分析', color: '#8B5A2B', page: 'insurance' },
        { icon: 'fa-gamepad', title: '亲子大富翁', desc: '财商启蒙游戏', color: '#9C27B0', page: 'game' },
        { icon: 'fa-comments', title: 'AI顾问', desc: '随时在线咨询', color: '#FF9800', page: 'chat' }
    ];
    
    const container = document.getElementById('quick-entry-container');
    container.innerHTML = quickEntries.map(entry => `
        <div class="quick-entry-card" onclick="navigateTo('${entry.page}')">
            <div class="quick-entry-icon" style="background-color: ${entry.color}20; color: ${entry.color}">
                <i class="fas ${entry.icon}"></i>
            </div>
            <h3>${entry.title}</h3>
            <p>${entry.desc}</p>
        </div>
    `).join('');
}

// ========== 教育金页面 ==========
function renderEducationPage() {
    const educationData = getData('educationData');
    updateEducationDisplay();
    renderTimeline();
    renderEducationChart();
    renderStressTest();
    updateCalculationParams();
}

function toggleCalculationDetails() {
    const details = document.getElementById('calculation-details');
    details.classList.toggle('hidden');
}

function toggleReturnRateSlider(event) {
    event.preventDefault();
    const slider = document.getElementById('return-rate-slider');
    slider.classList.toggle('hidden');
}

function updateReturnRate() {
    const input = document.getElementById('return-rate-input');
    const display = document.getElementById('return-rate-display');
    const rateDisplay = document.getElementById('calc-return-rate');
    
    const rate = parseFloat(input.value);
    display.textContent = `当前收益率：${rate}%`;
    rateDisplay.textContent = `${rate}%`;
    
    // 重新计算目标金额
    recalculateTargetAmount(rate);
}

function recalculateTargetAmount(rate) {
    const educationData = getData('educationData');
    const familyData = getData('familyData');
    const currentSavings = educationData.currentSavings || 0;
    const paths = educationData.paths || { public: { totalCost: 260000, milestones: [] } };
    const currentPathKey = educationData.currentPath || 'public';
    const currentPath = paths[currentPathKey] || paths['public'];
    const childAge = (familyData && familyData.childAge) ? familyData.childAge : 3;
    const yearsToGraduation = Math.max(1, 22 - childAge);

    let inflatedTotal = 0;
    if (currentPath && currentPath.milestones) {
        inflatedTotal = currentPath.milestones.reduce((sum, m) => {
            const yearsUntil = Math.max(0, m.age - childAge);
            return sum + Math.round(m.cost * Math.pow(1.035, yearsUntil));
        }, 0);
    } else {
        inflatedTotal = currentPath ? currentPath.totalCost : 260000;
    }

    const futureSavings = Math.round(currentSavings * Math.pow(1 + rate / 100, yearsToGraduation));
    const newTarget = Math.max(0, inflatedTotal - futureSavings);

    document.getElementById('calc-final-amount').textContent = formatNumber(newTarget);
}

function updateCalculationParams() {
    const familyData = getData('familyData');
    const educationData = getData('educationData');
    const childAge = (familyData && familyData.childAge) ? familyData.childAge : 3;

    const yearsToGraduation = 22 - childAge;
    document.getElementById('calc-child-age').textContent = `${childAge} 岁`;
    document.getElementById('calc-years-left').textContent = `距离大学毕业还有 ${yearsToGraduation} 年`;

    if (educationData) {
        document.getElementById('calc-savings').textContent = `${formatNumber(educationData.currentSavings)} 元`;

        const paths = educationData.paths || window.educationData.paths;
        const currentPathKey = educationData.currentPath || 'public';
        const currentPath = paths[currentPathKey];
        const grid = document.getElementById('stage-costs-grid');
        if (grid && currentPath && currentPath.milestones) {
            grid.innerHTML = currentPath.milestones.map(m => {
                const yearsUntil = Math.max(0, m.age - childAge);
                const inflated = Math.round(m.cost * Math.pow(1.035, yearsUntil));
                const wan = (inflated / 10000).toFixed(1);
                return `<div class="text-center p-2 bg-white rounded">
                    <p class="font-medium">${m.name}</p>
                    <p class="text-green-600">${wan}万</p>
                </div>`;
            }).join('');
        }
    }

    const rateInput = document.getElementById('return-rate-input');
    const rate = rateInput ? parseFloat(rateInput.value) : 3.0;
    recalculateTargetAmount(rate);
}

function changeEducationPath(path) {
    const educationData = getData('educationData');
    educationData.currentPath = path;
    saveData('educationData', educationData);
    updateEducationDisplay();
    renderTimeline();
}

function updateEducationDisplay() {
    const educationData = getData('educationData');
    const paths = educationData.paths || window.educationData.paths;
    const currentPathKey = educationData.currentPath || 'public';
    const currentPath = paths[currentPathKey];
    
    document.getElementById('current-savings-display').textContent = formatNumber(educationData.currentSavings);
    document.getElementById('target-amount').textContent = `${formatNumber(currentPath.totalCost)} 元`;
    
    const gap = currentPath.totalCost - educationData.currentSavings;
    document.getElementById('gap-amount').textContent = `${formatNumber(Math.max(0, gap))} 元`;
    
    const progress = Math.round((educationData.currentSavings / currentPath.totalCost) * 100);
    document.getElementById('education-progress-text').textContent = progress;
    document.getElementById('education-progress-bar').style.width = `${progress}%`;
    
    const progressBar = document.getElementById('education-progress-bar');
    progressBar.className = 'progress-fill';
    if (progress >= 80) {
        progressBar.classList.add('progress-green');
    } else if (progress >= 50) {
        progressBar.classList.add('progress-yellow');
    } else {
        progressBar.classList.add('progress-red');
    }
    
    document.getElementById('path-description').textContent = currentPath.description;

    const monthlyContribEl = document.getElementById('monthly-contribution');
    if (monthlyContribEl) monthlyContribEl.textContent = `${formatNumber(educationData.monthlyContribution)} 元/月`;

    // 建议月储蓄
    const familyData = getData('familyData');
    const childAge = (familyData && familyData.childAge) ? familyData.childAge : 3;
    const monthlyIncome = (familyData && familyData.monthlyIncome) ? familyData.monthlyIncome : 25000;
    const yearsLeft = Math.max(1, 22 - childAge);
    const gapVal = Math.max(0, currentPath.totalCost - educationData.currentSavings);
    const monthlyNeeded = Math.round(gapVal / (yearsLeft * 12));
    const incomeRatio = Math.round((monthlyNeeded / monthlyIncome) * 100);
    const currentMonthly = educationData.monthlyContribution || 2000;
    const shortfall = monthlyNeeded - currentMonthly;

    const neededEl = document.getElementById('monthly-needed-display');
    const detailEl = document.getElementById('monthly-advice-detail');
    const ratioBar = document.getElementById('monthly-ratio-bar');
    const ratioLabel = document.getElementById('monthly-income-ratio');

    if (neededEl) neededEl.textContent = `${formatNumber(monthlyNeeded)} 元/月`;
    if (ratioBar) ratioBar.style.width = `${Math.min(incomeRatio, 100)}%`;
    if (ratioLabel) ratioLabel.textContent = `占月收入 ${incomeRatio}%`;
    if (detailEl) {
        if (shortfall > 0) {
            detailEl.textContent = `当前每月存 ${formatNumber(currentMonthly)} 元，还需多存 ${formatNumber(shortfall)} 元才能按时达标`;
        } else {
            detailEl.textContent = `当前每月存 ${formatNumber(currentMonthly)} 元，已超过建议值，进度超前 🎉`;
        }
    }

    // 同步路径 tab 按钮选中状态
    document.querySelectorAll('[data-path]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.path === educationData.currentPath);
    });
}

function updateSavings() {
    const input = document.getElementById('savings-input');
    const value = parseInt(input.value);
    
    if (value && value > 0) {
        const educationData = getData('educationData');
        educationData.currentSavings = value;
        saveData('educationData', educationData);
        updateEducationDisplay();
        input.value = '';
        
        renderHomePage();
    }
}

function renderTimeline() {
    const educationData = getData('educationData');
    const currentPath = educationData.paths[educationData.currentPath];
    const container = document.getElementById('timeline-container');
    
    container.innerHTML = currentPath.milestones.map((milestone, index) => `
        <div class="timeline-item">
            <div class="timeline-dot">${milestone.age}</div>
            <div class="timeline-line ${index < currentPath.milestones.length - 1 ? '' : 'hidden'}"></div>
            <div class="timeline-content">
                <div class="flex justify-between items-center">
                    <h4>${milestone.name}</h4>
                    <span class="text-sm font-bold" style="color: var(--cmb-red)">${formatNumber(milestone.cost)} 元</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderEducationChart() {
    const ctx = document.getElementById('education-chart');
    
    if (educationChart) {
        educationChart.destroy();
    }
    
    const educationData = getData('educationData');
    
    const labels = educationData.paths.public.milestones.map(m => `${m.age}岁`);
    const publicData = educationData.paths.public.milestones.map(m => m.cost);
    const intlData = educationData.paths.international.milestones.map(m => m.cost);
    const overseasData = educationData.paths.overseas.milestones.map(m => m.cost);
    
    educationChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '公立路线',
                    data: publicData,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: '国际路线',
                    data: intlData,
                    borderColor: '#E60012',
                    backgroundColor: 'rgba(230, 0, 18, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: '海外路线',
                    data: overseasData,
                    borderColor: '#8B5A2B',
                    backgroundColor: 'rgba(139, 90, 43, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${formatNumber(context.parsed.y)} 元`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                }
            },
            animation: {
                duration: 1000
            }
        }
    });
}

// ========== 教育选择 AI 问答 ==========
const EDU_QA_DATA = {
    'international-school': {
        question: '如果从公立转国际学校，我每月需要多存多少？',
        extraMonthly: 6200,
        totalIncrease: 2200000,
        tips: [
            '建议开设专项教育储蓄账户，与日常支出账户分开管理',
            '可考虑招商银行"朝朝盈"等灵活理财产品，兼顾流动性与收益',
            '国际学校费用逐年递增，建议每年按 5% 上调储蓄金额',
            '提前了解学校奖学金政策，优秀学生可减免 10%-30% 学费'
        ]
    },
    'study-abroad': {
        question: '如果本科去美国留学，总费用会增加多少？',
        extraMonthly: 8500,
        totalIncrease: 1800000,
        tips: [
            '建议从孩子 10 岁起开始专项储备，分散储蓄压力',
            '可配置部分美元资产，规避汇率波动风险',
            '申请美国大学助学金和奖学金，优秀学生可获 50% 以上资助',
            '提前规划 SAT/托福培训费用，约需额外 3-5 万元'
        ]
    },
    'extracurricular': {
        question: '每年增加 2 万特长培训，对我的储蓄计划影响大吗？',
        extraMonthly: 1800,
        totalIncrease: 240000,
        tips: [
            '特长培训投入相对可控，建议纳入月度预算统一管理',
            '优先选择 1-2 项孩子真正感兴趣的方向，避免盲目跟风',
            '可利用招商银行信用卡教育分期，减轻单次大额支出压力',
            '定期评估培训效果，及时调整投入方向'
        ]
    },
    'gap-year': {
        question: '孩子计划 gap 一年再上大学，需要额外准备多少？',
        extraMonthly: 700,
        totalIncrease: 120000,
        tips: [
            'Gap 年费用相对较低，建议提前 2 年开始专项储备',
            '可将 gap 年规划为有意义的实习或志愿者经历，降低纯消费支出',
            '提前了解目标大学的 gap year 政策，部分学校支持延迟入学',
            '建议为孩子购买境外旅行险，保障 gap 年安全'
        ]
    }
};

async function askEduQuestion(choiceId) {
    const qa = EDU_QA_DATA[choiceId];
    if (!qa) return;

    const familyData = getData('familyData');
    const educationData = getData('educationData');
    const childAge = (familyData && familyData.childAge) ? familyData.childAge : 3;
    const baseMonthly = educationData ? educationData.monthlyContribution : 2000;
    const currentSavings = educationData ? educationData.currentSavings : 100000;
    const monthlyIncome = (familyData && familyData.monthlyIncome) ? familyData.monthlyIncome : 20000;

    document.getElementById('edu-qa-question-text').textContent = qa.question;
    document.getElementById('edu-qa-monthly').textContent = `+${formatNumber(qa.extraMonthly)} 元/月（当前 ${formatNumber(baseMonthly)} → ${formatNumber(baseMonthly + qa.extraMonthly)} 元/月）`;
    document.getElementById('edu-qa-total').textContent = `约 +${formatNumber(qa.totalIncrease)} 元`;

    const tipsList = document.getElementById('edu-qa-tips');

    document.querySelectorAll('.edu-qa-btn').forEach(btn => btn.classList.remove('border-cmb-red'));
    const buttons = document.querySelectorAll('.edu-qa-btn');
    const idx = ['international-school', 'study-abroad', 'extracurricular', 'gap-year'].indexOf(choiceId);
    if (idx >= 0 && buttons[idx]) buttons[idx].classList.add('border-cmb-red');

    const answerEl = document.getElementById('edu-qa-answer');
    answerEl.classList.remove('hidden');
    answerEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const apiKey = getApiKey();
    if (apiKey) {
        tipsList.innerHTML = `<li class="text-xs text-gray-400">AI 正在生成建议...</li>`;
        try {
            const prompt = `家庭背景：孩子${childAge}岁，月收入${monthlyIncome}元，已存教育金${currentSavings}元，每月存${baseMonthly}元。
用户问题：${qa.question}
请给出3条简洁实用的储蓄建议，每条不超过40字，直接列出，不要序号前缀以外的格式。`;

            const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                body: JSON.stringify({
                    model: 'doubao-seed-2-0-pro-260215',
                    messages: [
                        { role: 'system', content: '你是专业的家庭教育金规划顾问，给出简洁实用的建议，不推荐具体产品。' },
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: 300
                })
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            const aiTips = data.choices[0].message.content.trim().split('\n').filter(l => l.trim());
            tipsList.innerHTML = aiTips.map(t =>
                `<li class="text-xs text-gray-600 flex items-start gap-1"><span class="text-green-500 mt-0.5">✓</span><span>${t.replace(/^[\d\.\-\s]+/, '')}</span></li>`
            ).join('');
        } catch (e) {
            tipsList.innerHTML = qa.tips.map(t =>
                `<li class="text-xs text-gray-600 flex items-start gap-1"><span class="text-green-500 mt-0.5">✓</span><span>${t}</span></li>`
            ).join('');
        }
    } else {
        tipsList.innerHTML = qa.tips.map(t =>
            `<li class="text-xs text-gray-600 flex items-start gap-1"><span class="text-green-500 mt-0.5">✓</span><span>${t}</span></li>`
        ).join('');
    }
}

function closeEduAnswer() {
    document.getElementById('edu-qa-answer').classList.add('hidden');
    document.querySelectorAll('.edu-qa-btn').forEach(btn => {
        btn.classList.remove('border-cmb-red');
    });
}

async function askEduFreeQuestion() {
    const input = document.getElementById('edu-free-input');
    const question = input.value.trim();
    if (!question) return;

    const answerEl = document.getElementById('edu-free-answer');
    const answerText = document.getElementById('edu-free-answer-text');
    answerEl.classList.remove('hidden');
    answerText.textContent = 'AI 正在思考...';
    answerEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const familyData = getData('familyData');
    const educationData = getData('educationData');
    const childAge = (familyData && familyData.childAge) ? familyData.childAge : 3;
    const baseMonthly = educationData ? educationData.monthlyContribution : 2000;
    const currentSavings = educationData ? educationData.currentSavings : 100000;
    const monthlyIncome = (familyData && familyData.monthlyIncome) ? familyData.monthlyIncome : 20000;

    const apiKey = getApiKey();
    if (!apiKey) {
        answerText.textContent = '请先在设置中配置 API Key，才能使用 AI 问答功能。';
        return;
    }

    try {
        const prompt = `家庭背景：孩子${childAge}岁，月收入${monthlyIncome}元，已存教育金${currentSavings}元，每月存${baseMonthly}元。
用户问题：${question}
请给出简洁实用的回答，不超过150字，不推荐具体金融产品。`;

        const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: 'doubao-seed-2-0-pro-260215',
                messages: [
                    { role: 'system', content: '你是专业的家庭教育金规划顾问，给出简洁实用的建议，不推荐具体产品。' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 400
            })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        answerText.textContent = data.choices[0].message.content.trim();
    } catch (e) {
        answerText.textContent = '抱歉，AI 暂时无法回答，请稍后再试。';
    }
}

function renderStressTest() {
    // no-op, kept for compatibility
}

// ========== 支出分析页面 ==========
function renderExpensePage() {
    const expenseData = getData('expenseData');
    
    renderExpenseOverviewChart();
    renderExpensePieChart();
    renderAnxietyGauge();
    renderExpenseList();
    renderAlternativesList();
    renderAnxietyTriggers();
    renderAnxietyIntervention();
    renderBudgetDisplay();
}

function renderExpensePieChart() {
    const ctx = document.getElementById('expense-pie-chart');
    
    if (expensePieChart) {
        expensePieChart.destroy();
    }
    
    const expenseData = getData('expenseData');
    
    expensePieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: expenseData.categories.map(c => c.name),
            datasets: [{
                data: expenseData.categories.map(c => c.percentage),
                backgroundColor: expenseData.categories.map(c => c.color),
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = expenseData.total;
                            const amount = Math.round(total * context.parsed / 100);
                            return `${context.label}: ${formatNumber(amount)} 元 (${context.parsed}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                duration: 1000
            }
        }
    });
}

function renderExpenseOverviewChart() {
    const ctx = document.getElementById('expense-overview-chart');
    
    if (expenseOverviewChart) {
        expenseOverviewChart.destroy();
    }
    
    const expenseData = getData('expenseData');
    
    const educationAmount = expenseData.details
        .filter(item => item.category === '刚性成长支出')
        .reduce((sum, item) => sum + item.amount, 0);

    const livingAmount = expenseData.details
        .filter(item => item.category === '品质生活支出')
        .reduce((sum, item) => sum + item.amount, 0);

    const anxietyAmount = expenseData.details
        .filter(item => item.category === '焦虑驱动支出')
        .reduce((sum, item) => sum + item.amount, 0);
    
    expenseOverviewChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['教育支出', '生活支出', '焦虑驱动支出'],
            datasets: [{
                data: [educationAmount, livingAmount, anxietyAmount],
                backgroundColor: ['#4CAF50', '#8B5A2B', '#E60012'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 10,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

function renderAnxietyGauge() {
    const ctx = document.getElementById('anxiety-gauge');
    
    if (anxietyGauge) {
        anxietyGauge.destroy();
    }
    
    const anxietyIndex = calculateAnxietyIndex();
    
    let color;
    let level;
    if (anxietyIndex >= 80) {
        color = '#E60012';
        level = '高度焦虑';
    } else if (anxietyIndex >= 60) {
        color = '#FFC107';
        level = '中度焦虑';
    } else {
        color = '#4CAF50';
        level = '状态良好';
    }
    
    anxietyGauge = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [anxietyIndex, 100 - anxietyIndex],
                backgroundColor: [color, '#e5e7eb'],
                borderWidth: 0,
                circumference: 180,
                rotation: -90
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            cutout: '75%',
            animation: {
                animateRotate: true,
                duration: 1000
            }
        }
    });
    
    document.getElementById('gauge-value').textContent = anxietyIndex;
    document.getElementById('gauge-value').style.color = color;
    document.getElementById('gauge-level').textContent = level;
    document.getElementById('gauge-level').style.color = color;
}

function addExpense() {
    const name = document.getElementById('new-expense-name').value.trim();
    const amount = parseInt(document.getElementById('new-expense-amount').value);
    const category = document.getElementById('new-expense-category').value;
    
    if (!name || !amount || amount <= 0) {
        showToast('请填写完整的支出信息');
        return;
    }
    
    const expenseData = getData('expenseData');
    
    const newExpense = {
        id: Date.now(),
        name,
        amount,
        category,
        trigger: category === '焦虑驱动支出' ? '用户填写' : null,
        date: todayStr()
    };
    
    expenseData.details.push(newExpense);
    expenseData.total += amount;
    
    const categoryIndex = expenseData.categories.findIndex(c => c.name === category);
    if (categoryIndex !== -1) {
        expenseData.categories[categoryIndex].amount += amount;
        expenseData.categories[categoryIndex].percentage = Math.round((expenseData.categories[categoryIndex].amount / expenseData.total) * 100);
    }
    
    saveData('expenseData', expenseData);
    
    document.getElementById('new-expense-name').value = '';
    document.getElementById('new-expense-amount').value = '';
    document.getElementById('new-expense-category').value = '刚性成长支出';
    
    renderExpensePage();
    showToast('支出已添加');
}

function renderExpenseList() {
    const expenseData = getData('expenseData');
    const container = document.getElementById('expense-list');
    
    container.innerHTML = expenseData.details.map(expense => {
        let categoryClass = 'category-rigid';
        let anxietyBadge = '';
        
        if (expense.category === '品质生活支出') categoryClass = 'category-quality';
        else if (expense.category === '焦虑驱动支出') {
            categoryClass = 'category-anxiety';
            anxietyBadge = `<span class="anxiety-badge" title="触发源: ${expense.trigger || '用户填写'}">焦虑驱动</span>`;
        }
        
        return `
            <div class="expense-item">
                <div>
                    <div class="font-medium flex items-center">${expense.name} ${anxietyBadge}</div>
                    <span class="expense-category ${categoryClass}">${expense.category}</span>
                </div>
                <div class="font-bold">${formatNumber(expense.amount)} 元</div>
            </div>
        `;
    }).join('');
}

function renderAlternativesList() {
    const expenseData = getData('expenseData');
    const container = document.getElementById('alternatives-list');
    
    container.innerHTML = expenseData.alternatives.map(alt => `
        <div class="alternative-card">
            <div class="flex justify-between items-start mb-2">
                <div class="flex items-center">
                    <span class="line-through text-gray-500 text-sm">${alt.original}</span>
                    <i class="fas fa-arrow-right mx-2 text-gray-400"></i>
                    <span class="font-medium text-green-700">${alt.alternative}</span>
                </div>
                <span class="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                    省 ${formatNumber(alt.savings)} 元
                </span>
            </div>
            <p class="text-sm text-gray-600 mb-2">${alt.description}</p>
            <div class="flex gap-2">
                <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">效果: ${alt.effectiveness}</span>
                <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">适用: ${alt.ageRange}</span>
            </div>
        </div>
    `).join('');
}

function renderAnxietyTriggers() {
    const expenseData = getData('expenseData');
    const container = document.getElementById('anxiety-triggers');
    
    container.innerHTML = expenseData.anxietyTriggers.map(trigger => `
        <div class="trigger-item py-2">
            <span class="trigger-name">${trigger.name}</span>
            <div class="trigger-bar-container">
                <div class="trigger-bar" style="width: ${trigger.percentage}%; background: ${trigger.color}"></div>
            </div>
            <span class="trigger-percentage">${trigger.percentage}%</span>
        </div>
    `).join('');
}

function renderAnxietyIntervention() {
    const familyData = getData('familyData');
    const growthStages = getData('growthStages');
    const stage = growthStages[familyData.growthPhase];
    
    const container = document.getElementById('anxiety-intervention');
    
    if (stage) {
        const uniqueSuggestions = [];
        const seenTitles = new Set();
        
        stage.risks.forEach(risk => {
            const title = getSuggestionTitle(risk.name);
            if (!seenTitles.has(title)) {
                seenTitles.add(title);
                uniqueSuggestions.push({
                    title: title,
                    content: getSuggestionContent(risk.name)
                });
            }
        });
        
        const limitedSuggestions = uniqueSuggestions.slice(0, 3);
        
        container.innerHTML = `
            <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: ${stage.color}20;">
                        <i class="fas ${stage.icon}" style="color: ${stage.color};"></i>
                    </div>
                    <div>
                        <h4 class="font-semibold">${stage.name} (${stage.ageRange})</h4>
                        <p class="text-sm text-gray-500">针对此阶段的个性化建议</p>
                    </div>
                </div>
            </div>
            
            ${limitedSuggestions.map(suggestion => `
                <div class="border-l-4 rounded-r-lg p-4" style="border-color: #4CAF50;">
                    <div class="flex items-start justify-between mb-2">
                        <h5 class="font-medium text-green-700">✅ ${suggestion.title}</h5>
                        <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">建议</span>
                    </div>
                    <p class="text-sm text-gray-600 mb-3">${suggestion.content}</p>
                </div>
            `).join('')}
            <button class="w-full mt-4 py-3 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2"
                style="background: linear-gradient(135deg, #7C3AED, #A78BFA);"
                onclick="generateAIAnxietyAdvice()">
                <i class="fas fa-robot"></i> AI 反焦虑深度诊断
            </button>
            <div id="ai-anxiety-result" class="hidden mt-4"></div>
        `;
    }
}

async function generateAIAnxietyAdvice() {
    const apiKey = getApiKey();
    if (!apiKey) {
        showToast('请先在 AI顾问 页面配置 API Key');
        return;
    }

    const btn = document.querySelector('[onclick="generateAIAnxietyAdvice()"]');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> AI 分析中...'; }

    const expenseData = getData('expenseData');
    const familyData = getData('familyData');
    const anxietyIndex = calculateAnxietyIndex();
    const monthlyIncome = (familyData && familyData.monthlyIncome) ? familyData.monthlyIncome : 20000;
    const childAge = (familyData && familyData.childAge) ? familyData.childAge : 3;

    const anxietyItems = (expenseData.details || []).filter(d => d.category === '焦虑驱动支出');
    const anxietyTotal = anxietyItems.reduce((s, d) => s + d.amount, 0);
    const triggers = (expenseData.anxietyTriggers || []).map(t => `${t.name}(${t.percentage}%)`).join('、');

    const prompt = `家庭情况：孩子${childAge}岁，月收入${monthlyIncome}元。
本月焦虑指数：${anxietyIndex}分（满分100）。
焦虑驱动支出：${anxietyTotal}元，占月收入${Math.round(anxietyTotal/monthlyIncome*100)}%。
主要焦虑触发源：${triggers || '暂无数据'}。
焦虑支出明细：${anxietyItems.map(i => `${i.name}${i.amount}元`).join('、') || '暂无'}。

请从反焦虑视角给出个性化分析，包含：
1. 这些支出中哪些是真正必要的，哪些是焦虑驱动的（具体说明）
2. 每月可以节省多少，节省下来怎么用更有价值
3. 一句话帮家长重建理性决策框架

语言温暖不说教，控制在250字以内。`;

    try {
        const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: 'doubao-seed-2-0-pro-260215',
                messages: [
                    { role: 'system', content: '你是一位反焦虑家庭财务顾问，帮助家长识别焦虑消费、回归理性决策。语气温暖、不说教、给出具体可操作的建议。' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 500
            })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const aiText = data.choices[0].message.content.trim();

        const resultEl = document.getElementById('ai-anxiety-result');
        resultEl.classList.remove('hidden');
        resultEl.innerHTML = `
            <div class="p-4 rounded-xl" style="background:linear-gradient(135deg,#F5F3FF,#EDE9FE);border:1px solid #DDD6FE;">
                <div class="flex items-center gap-2 mb-3">
                    <i class="fas fa-robot" style="color:#7C3AED;"></i>
                    <span class="text-sm font-semibold" style="color:#5B21B6;">AI 反焦虑诊断报告</span>
                </div>
                <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">${aiText}</p>
            </div>
        `;
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-robot"></i> 重新诊断'; }
    } catch (e) {
        showToast('AI 调用失败：' + e.message);
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-robot"></i> AI 反焦虑深度诊断'; }
    }
}

function getSuggestionTitle(riskName) {
    if (riskName.includes('广撒网')) return '先体验再报名';
    if (riskName.includes('阶层滑落')) return '聚焦 1-2 个核心特长';
    if (riskName.includes('攀比')) return '理性看待同伴压力';
    if (riskName.includes('信息过载')) return '减少信息噪音';
    return '个性化建议';
}

function getSuggestionContent(riskName) {
    if (riskName.includes('广撒网')) {
        return '不要一次性报全年课程，先报 1-2 节体验课，观察孩子的兴趣和适应情况。大多数孩子在 3 个月内会失去对新兴趣的热情。';
    }
    if (riskName.includes('阶层滑落')) {
        return '研究表明，孩子在 6 岁前同时学习超过 3 个特长，不仅效果差，还会导致厌学。不如集中精力培养 1-2 个孩子真正感兴趣的领域。';
    }
    if (riskName.includes('攀比')) {
        return '每个家庭的情况都不同，盲目攀比只会徒增焦虑。专注于孩子的成长节奏，找到适合自己家庭的教育方式。';
    }
    if (riskName.includes('信息过载')) {
        return '建议设定固定的信息获取时间，避免随时刷手机接收各种育儿信息，减少不必要的焦虑干扰。';
    }
    return '根据您孩子的情况，我们建议您关注孩子的全面发展，注重亲子互动和身心健康。';
}

function scrollToAlternatives() {
    const alternativesSection = document.getElementById('alternatives-list');
    if (alternativesSection) {
        alternativesSection.scrollIntoView({ behavior: 'smooth' });
        alternativesSection.parentElement.classList.add('highlight-flash');
        setTimeout(() => {
            alternativesSection.parentElement.classList.remove('highlight-flash');
        }, 1000);
    }
}

function renderBudgetDisplay() {
    const expenseData = getData('expenseData');
    const budget = expenseData.monthlyBudget;
    
    document.getElementById('budget-recommended').textContent = formatNumber(budget.recommended);
    document.getElementById('budget-actual').textContent = formatNumber(budget.actual);
    document.getElementById('budget-over').textContent = formatNumber(budget.overBudget);
    
    const budgetUsage = Math.min((budget.actual / budget.recommended) * 100, 100);
    document.getElementById('budget-bar').style.width = `${budgetUsage}%`;
    document.getElementById('budget-bar').className = 'progress-fill';
    
    if (budgetUsage <= 100) {
        document.getElementById('budget-bar').classList.add('progress-green');
    } else {
        document.getElementById('budget-bar').classList.add('progress-red');
    }
}

// ========== 保险测评页面 ==========
function renderInsurancePage() {
    initPolicyTypes();
    renderPolicyResult();
}

function triggerUpload() {
    document.getElementById('file-upload').click();
    
    document.getElementById('file-upload').onchange = function() {
        document.getElementById('upload-section').style.display = 'none';
        document.getElementById('loading-section').style.display = 'block';
        
        setTimeout(() => {
            document.getElementById('loading-section').style.display = 'none';
            document.getElementById('result-section').style.display = 'block';
            renderPolicyResult();
        }, 3000);
    };
}

function resetInsurancePage() {
    document.querySelector('.card:has(#insurance-description)').style.display = 'block';
    document.getElementById('upload-section').style.display = 'block';
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('insurance-description').value = '';
    const aiResult = document.getElementById('insurance-ai-result');
    if (aiResult) aiResult.remove();
}

async function analyzeInsurance() {
    const description = document.getElementById('insurance-description').value;

    if (!description.trim()) {
        alert('请先描述您的保险需求');
        return;
    }

    document.querySelector('.card:has(#insurance-description)').style.display = 'none';
    document.getElementById('upload-section').style.display = 'none';

    const loadingSection = document.createElement('div');
    loadingSection.id = 'loading-section';
    loadingSection.className = 'card mb-6';
    loadingSection.innerHTML = `
        <div class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-cmb-red mx-auto mb-4"></div>
            <p class="text-gray-600">AI 正在分析您的保险需求...</p>
        </div>
    `;
    document.querySelector('#page-insurance section').appendChild(loadingSection);

    const apiKey = getApiKey();
    if (apiKey) {
        try {
            const familyData = getData('familyData');
            const monthlyIncome = familyData.monthlyIncome || 20000;
            const childAge = familyData.childAge || 3;
            const annualBudget = Math.round(monthlyIncome * 12 * 0.06);

            const systemPrompt = `你是一位专业的家庭保险规划顾问，擅长为中国家庭提供保险配置建议。
请根据用户描述，提供结构化的保险建议，严格按以下四个部分输出，每部分用【】标题分隔：

【配置思路】
分析用户家庭情况，说明保险配置的优先级和逻辑（3-5句话）

【推荐方案】
列出2-4个具体险种，每个险种格式：
- 险种名称：XXX
  保额建议：XX万元
  年保费估算：XX元
  推荐理由：XX

【收益分析】
说明该配置方案的保障价值和财务意义（2-3点，每点一行）

【风险提示】
说明等待期、免赔额、健康告知等关键注意事项（2-3点，每点一行）

家庭背景：月收入${monthlyIncome}元，孩子${childAge}岁，建议年保费预算${annualBudget}元。
回答简洁专业，不推荐具体产品品牌，只给配置思路。`;

            const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'doubao-seed-2-0-pro-260215',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: description }
                    ],
                    max_tokens: 800
                })
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error?.message || `HTTP ${response.status}`);
            }

            const data = await response.json();
            const aiText = data.choices[0].message.content;

            loadingSection.remove();

            const thoughtMatch = aiText.match(/【配置思路】([\s\S]*?)(?=【|$)/);
            const planMatch   = aiText.match(/【推荐方案】([\s\S]*?)(?=【|$)/);
            const benefitMatch = aiText.match(/【收益分析】([\s\S]*?)(?=【|$)/);
            const riskMatch   = aiText.match(/【风险提示】([\s\S]*?)(?=【|$)/);
            const fmt = t => t.trim().replace(/\n/g, '<br>');
            const hasStructure = thoughtMatch || planMatch;

            const resultDiv = document.createElement('div');
            resultDiv.id = 'insurance-ai-result';
            resultDiv.innerHTML = `
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-bold">AI 保险配置建议</h3>
                    <button class="btn btn-outline btn-sm" onclick="resetInsurancePage()">
                        <i class="fas fa-arrow-left mr-2"></i>返回
                    </button>
                </div>
                <div class="card mb-4" style="background:#EFF6FF;border-color:#BFDBFE;">
                    <p class="text-sm" style="color:#1D4ED8;"><strong>您的需求：</strong>${description}</p>
                </div>
                ${thoughtMatch ? `<div class="card mb-4"><div class="card-title"><i class="fas fa-lightbulb" style="color:#D97706;"></i> 配置思路</div><p class="text-sm text-gray-700">${fmt(thoughtMatch[1])}</p></div>` : ''}
                ${planMatch   ? `<div class="card mb-4"><div class="card-title"><i class="fas fa-shield-alt" style="color:#16A34A;"></i> 推荐方案</div><p class="text-sm text-gray-700">${fmt(planMatch[1])}</p></div>` : ''}
                ${benefitMatch ? `<div class="card mb-4"><div class="card-title"><i class="fas fa-chart-line" style="color:#2563EB;"></i> 收益分析</div><p class="text-sm text-gray-700">${fmt(benefitMatch[1])}</p></div>` : ''}
                ${riskMatch   ? `<div class="card mb-4"><div class="card-title"><i class="fas fa-exclamation-triangle" style="color:#D97706;"></i> 风险提示</div><p class="text-sm text-gray-700">${fmt(riskMatch[1])}</p></div>` : ''}
                ${!hasStructure ? `<div class="card mb-4"><div class="card-title"><i class="fas fa-robot" style="color:#7C3AED;"></i> AI 分析结果</div><p class="text-sm text-gray-700">${fmt(aiText)}</p></div>` : ''}
                <div class="card mb-4" style="background:#FFFBEB;">
                    <p class="text-xs text-center" style="color:#92400E;">💡 以上建议由 AI 生成，仅供参考，不构成专业保险建议。具体方案请咨询持牌保险顾问。</p>
                </div>
            `;
            document.querySelector('#page-insurance section').appendChild(resultDiv);

        } catch (e) {
            loadingSection.remove();
            showToast('AI 调用失败：' + e.message);
            // 降级到静态逻辑
            const familyData = getData('familyData');
            const monthlyIncome = familyData.monthlyIncome || 20000;
            const annualBudget = monthlyIncome * 12 * 0.06;
            displayInsuranceResult(generateInsuranceRecommendation(description, familyData, annualBudget));
        }
    } else {
        loadingSection.remove();
        const familyData = getData('familyData');
        const monthlyIncome = familyData.monthlyIncome || 20000;
        const annualBudget = monthlyIncome * 12 * 0.06;
        displayInsuranceResult(generateInsuranceRecommendation(description, familyData, annualBudget));
    }
}

function generateInsuranceRecommendation(description, familyData, budget) {
    const childAge = familyData.childAge || 3;
    const hasChild = description.includes('孩子') || description.includes('宝宝') || description.includes('重疾');
    
    let products = [];
    let rationale = '';
    
    if (hasChild) {
        // 配置孩子的保险
        const childCoverage = Math.min(500000, budget * 4); // 保额约为保费的4倍
        const childPremium = Math.round(budget * 0.4); // 40%预算用于孩子
        
        products.push({
            name: '少儿重疾险',
            premium: childPremium,
            coverage: childCoverage,
            description: `适合${childAge}岁儿童，涵盖100+种重疾`
        });
        
        // 配置大人的保险
        const adultBudget = budget * 0.6;
        
        // 大人重疾险
        const adultCoverage = Math.min(500000, adultBudget * 3);
        const adultPremium = Math.round(adultBudget * 0.5);
        
        products.push({
            name: '成人重疾险',
            premium: adultPremium,
            coverage: adultCoverage,
            description: '涵盖重疾+中症+轻症，多重赔付'
        });
        
        // 医疗险
        const medicalPremium = Math.round(adultBudget * 0.3);
        products.push({
            name: '百万医疗险',
            premium: medicalPremium,
            coverage: 2000000,
            description: '住院医疗费用报销，不限社保'
        });
        
        rationale = `根据您的需求分析，建议优先为孩子配置重疾保障（${childCoverage.toLocaleString()}元保额），同时父母作为家庭经济支柱也需要完善保障。以上配置总保费约${budget.toLocaleString()}元/年，占家庭年收入的6%左右，符合保险配置的合理比例。`;
    } else {
        // 只为大人配置
        const adultCoverage = Math.min(500000, budget * 3);
        const adultPremium = Math.round(budget * 0.6);
        
        products.push({
            name: '成人重疾险',
            premium: adultPremium,
            coverage: adultCoverage,
            description: '涵盖重疾+中症+轻症'
        });
        
        const medicalPremium = Math.round(budget * 0.3);
        products.push({
            name: '百万医疗险',
            premium: medicalPremium,
            coverage: 2000000,
            description: '住院费用全额报销'
        });
        
        rationale = `建议为家庭经济支柱配置全面保障，重疾险覆盖${adultCoverage.toLocaleString()}元，医疗险作为补充。总保费约${budget.toLocaleString()}元/年，处于合理范围内。`;
    }
    
    return {
        products,
        rationale,
        totalPremium: products.reduce((sum, p) => sum + p.premium, 0),
        budget
    };
}

function displayInsuranceResult(recommendation) {
    const resultHTML = `
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold">保险配置建议结果</h3>
            <button class="btn btn-outline btn-sm" onclick="resetInsurancePage()">
                <i class="fas fa-arrow-left mr-2"></i>返回
            </button>
        </div>
        <div class="card mb-6">
            <div class="card-title">
                <i class="fas fa-shield-check text-green-500"></i>
                您的专属保险配置建议
            </div>
            
            <div class="bg-blue-50 p-4 rounded-lg mb-6">
                <p class="text-sm text-blue-800">
                    💡 保险配置黄金法则：家庭年交保费不宜超过年收入的5%-10%，您的合理预算约为 <strong>${recommendation.budget.toLocaleString()} 元/年</strong>
                </p>
            </div>
            
            <h4 class="font-semibold mb-3">推荐配置方案</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                ${recommendation.products.map(p => `
                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                        <i class="fas fa-check-circle text-green-500 text-2xl mb-2"></i>
                        <h4 class="font-semibold">${p.name}</h4>
                        <p class="text-sm text-gray-600">${p.premium.toLocaleString()} 元/年</p>
                        <p class="text-xs text-gray-400">保额 ${p.coverage.toLocaleString()} 元</p>
                        <p class="text-xs text-gray-500 mt-1">${p.description}</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-4">
                <span class="text-gray-600">建议年交保费总计</span>
                <span class="text-2xl font-bold text-cmb-red">${recommendation.totalPremium.toLocaleString()} 元</span>
            </div>
            
            <h4 class="font-semibold mb-2">配置思路</h4>
            <p class="text-sm text-gray-600 mb-4">${recommendation.rationale}</p>
            
            <h4 class="font-semibold mb-3">收益与风险分析</h4>
            <div class="space-y-3">
                <div class="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <i class="fas fa-trending-up text-green-600 mt-0.5"></i>
                    <div>
                        <h5 class="font-medium text-green-800">保障收益</h5>
                        <p class="text-xs text-green-700">重疾确诊即可获得一次性赔付，无需报销单据；医疗险可覆盖住院费用，减轻经济压力。</p>
                    </div>
                </div>
                <div class="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <i class="fas fa-exclamation-triangle text-yellow-600 mt-0.5"></i>
                    <div>
                        <h5 class="font-medium text-yellow-800">潜在风险</h5>
                        <p class="text-xs text-yellow-700">重疾险有90-180天等待期，等待期内出险不赔付；医疗险有1万左右免赔额，小额医疗费用需自付。</p>
                    </div>
                </div>
                <div class="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <i class="fas fa-lightbulb text-blue-600 mt-0.5"></i>
                    <div>
                        <h5 class="font-medium text-blue-800">注意事项</h5>
                        <p class="text-xs text-blue-700">建议选择等待期短、保障范围广的产品；如实健康告知，避免理赔纠纷；定期review保障方案，根据家庭情况调整。</p>
                    </div>
                </div>
            </div>
            
            <div class="mt-6 p-4 bg-amber-50 rounded-lg">
                <p class="text-sm text-amber-800 text-center">
                    💡 以上建议仅供参考，具体产品选择请结合家庭实际情况。保险配置是长期规划，建议咨询专业顾问进行详细评估。
                </p>
            </div>
        </div>
    `;
    
    document.querySelector('#page-insurance section').innerHTML += resultHTML;
}

function renderPolicyResult() {
    const insuranceData = getData('insuranceData');
    
    document.getElementById('policy-name').textContent = insuranceData.policy.name;
    document.getElementById('policy-premium').textContent = `${formatNumber(insuranceData.policy.premium)} 元/年`;
    document.getElementById('policy-coverage').textContent = `${formatNumber(insuranceData.policy.coverage)} 元`;
    document.getElementById('policy-duration').textContent = insuranceData.policy.duration;
    
    document.getElementById('policy-positives').innerHTML = insuranceData.policy.positives.map(p => 
        `<li><i class="fas fa-check-circle text-green-500 mr-2"></i>${p}</li>`
    ).join('');
    
    document.getElementById('policy-issues').innerHTML = insuranceData.policy.issues.map(i => 
        `<li><i class="fas fa-exclamation-circle text-red-500 mr-2"></i>${i}</li>`
    ).join('');
    
    document.getElementById('comparison-table').innerHTML = `
        <thead>
            <tr>
                <th>产品</th>
                <th>类型</th>
                <th>年交保费</th>
                <th>保额</th>
                <th>评分</th>
            </tr>
        </thead>
        <tbody>
            ${insuranceData.comparison.map(c => `
                <tr>
                    <td class="font-medium">${c.product}</td>
                    <td>${c.type}</td>
                    <td>${formatNumber(c.premium)} 元</td>
                    <td>${formatNumber(c.coverage)} 元</td>
                    <td class="stars">${'★'.repeat(c.rating)}${'☆'.repeat(5 - c.rating)}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
    
    document.getElementById('rec-premium').textContent = formatNumber(insuranceData.recommendation.totalPremium);
    document.getElementById('rec-savings').textContent = formatNumber(insuranceData.recommendation.annualSavings);
    
    document.getElementById('recommendation-list').innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${insuranceData.recommendation.products.map(p => `
                <div class="bg-gray-50 p-4 rounded-lg text-center">
                    <i class="fas fa-check-circle text-green-500 text-2xl mb-2"></i>
                    <h4 class="font-semibold">${p.name}</h4>
                    <p class="text-sm text-gray-600">${formatNumber(p.premium)} 元/年</p>
                    <p class="text-xs text-gray-400">保额 ${formatNumber(p.coverage)} 元</p>
                    <p class="text-xs text-gray-500 mt-1">${p.description}</p>
                </div>
            `).join('')}
        </div>
    `;
    
    document.getElementById('rec-rationale').textContent = insuranceData.recommendation.rationale;
    
    document.getElementById('common-traps-list').innerHTML = insuranceData.commonTraps.map(trap => `
        <div class="trap-item mb-3">
            <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style="background: ${trap.riskLevel === 'high' ? '#ffebee' : trap.riskLevel === 'medium' ? '#fff3e0' : '#e8f5e9'}">
                    <i class="fas ${trap.riskLevel === 'high' ? 'fa-exclamation-triangle text-red-500' : trap.riskLevel === 'medium' ? 'fa-exclamation-circle text-yellow-600' : 'fa-info-circle text-green-600'}" style="font-size: 12px"></i>
                </div>
                <div>
                    <h4 class="font-medium text-sm">${trap.name}</h4>
                    <p class="text-xs text-gray-600 mt-1">${trap.description}</p>
                    <p class="text-xs text-green-600 mt-1"><i class="fas fa-lightbulb mr-1"></i>${trap.tips}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// ========== 亲子大富翁页面 ==========
function renderGamePage() {
    const gameData = getData('gameData');
    renderParentView();
    renderKidView();
}

function switchGameMode(mode) {
    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`${mode}-mode`).classList.add('active');
    
    if (mode === 'parent') {
        document.getElementById('parent-view').style.display = 'block';
        document.getElementById('kid-view').style.display = 'none';
    } else {
        document.getElementById('parent-view').style.display = 'none';
        document.getElementById('kid-view').style.display = 'block';
    }
}

function manualAllowance() {
    const amount = prompt('请输入发放金额（元）:');
    if (amount && !isNaN(amount)) {
        const gameData = getData('gameData');
        gameData.childBalance += parseInt(amount);
        gameData.allowances = gameData.allowances || { weekly: 20, lastReceived: '', records: [] };
        gameData.allowances.records = gameData.allowances.records || [];
        gameData.allowances.records.unshift({
            date: todayStr(),
            amount: parseInt(amount),
            note: '手动发放'
        });
        gameData.allowances.lastReceived = todayStr();
        saveData('gameData', gameData);
        renderParentView();
        renderKidView();
        alert(`已发放零花钱 ¥${amount}`);
    }
}

function toggleAutoAllowance() {
    const gameData = getData('gameData');
    gameData.autoAllowance = !gameData.autoAllowance;
    saveData('gameData', gameData);
    
    const status = gameData.autoAllowance ? '已开启' : '已关闭';
    alert(`自动发放零花钱${status}`);
}

function createChallenge() {
    const name = prompt('请输入挑战名称:');
    const target = prompt('请输入目标金额（元）:');
    const days = prompt('请输入挑战天数:');
    
    if (name && target && days) {
        const gameData = getData('gameData');
        const newId = Math.max(...gameData.challenges.map(c => c.id)) + 1;
        gameData.challenges.push({
            id: newId,
            name: name,
            target: parseInt(target),
            current: 0,
            days: parseInt(days),
            daysLeft: parseInt(days),
            status: 'available',
            reward: Math.round(parseInt(target) * 0.1),
            icon: 'fa-trophy'
        });
        saveData('gameData', gameData);
        renderParentView();
    }
}

function kidDeposit() {
    const amount = prompt('请输入存入金额（元）:');
    if (amount && !isNaN(amount)) {
        const gameData = getData('gameData');
        const numAmount = parseInt(amount);
        if (numAmount > gameData.childBalance) {
            alert('余额不足！');
            return;
        }
        gameData.childBalance -= numAmount;
        gameData.totalSaved += numAmount;
        gameData.savingsRate = Math.round((gameData.totalSaved / (gameData.totalEarned || 1)) * 100);
        gameData.spendingHistory = gameData.spendingHistory || [];
        gameData.spendingHistory.unshift({
            name: '存入小金库',
            amount: numAmount,
            category: 'saving',
            date: todayStr()
        });
        saveData('gameData', gameData);
        renderKidView();
        
        const piggy = document.getElementById('piggy-animation');
        if (piggy) {
            piggy.style.transform = 'scale(1.2)';
            setTimeout(() => piggy.style.transform = 'scale(1)', 300);
        }
    }
}

function kidWithdraw() {
    const amount = prompt('请输入取出金额（元）:');
    if (amount && !isNaN(amount)) {
        const gameData = getData('gameData');
        const numAmount = parseInt(amount);
        if (numAmount > gameData.totalSaved) {
            alert('储蓄余额不足！');
            return;
        }
        gameData.childBalance += numAmount;
        gameData.totalSaved -= numAmount;
        gameData.savingsRate = Math.round((gameData.totalSaved / (gameData.totalEarned || 1)) * 100);
        gameData.spendingHistory = gameData.spendingHistory || [];
        gameData.spendingHistory.unshift({
            name: '从储蓄罐取出',
            amount: numAmount,
            category: 'withdraw',
            date: todayStr()
        });
        saveData('gameData', gameData);
        renderKidView();
    }
}

function addWish() {
    const name = prompt('请输入心愿名称:');
    const price = prompt('请输入目标金额（元）:');
    
    if (name && price) {
        const gameData = getData('gameData');
        gameData.wishlist = gameData.wishlist || [];
        gameData.wishlist.push({
            id: Date.now(),
            name: name,
            targetAmount: parseInt(price),
            currentAmount: 0,
            status: 'active'
        });
        saveData('gameData', gameData);
        renderKidView();
    }
}

function claimWish(wishId) {
    const amount = prompt('请输入投入金额（元）:');
    if (amount && !isNaN(amount)) {
        const gameData = getData('gameData');
        const wish = gameData.wishlist.find(w => w.id === wishId);
        if (wish) {
            const numAmount = parseInt(amount);
            if (numAmount > gameData.childBalance) {
                alert('余额不足！');
                return;
            }
            gameData.childBalance -= numAmount;
            wish.currentAmount += numAmount;
            
            if (wish.currentAmount >= wish.targetAmount) {
                wish.status = 'completed';
                alert(`恭喜！${wish.name} 攒够了！`);
            }
            saveData('gameData', gameData);
            renderKidView();
        }
    }
}

function renderParentView() {
    const gameData = getData('gameData');

    document.getElementById('parent-balance').textContent = `${gameData.childBalance} 元`;
    document.getElementById('parent-earned').textContent = `${gameData.totalEarned} 元`;
    document.getElementById('parent-saved').textContent = `${gameData.totalSaved} 元`;
    document.getElementById('parent-savings-rate').textContent = `${gameData.savingsRate}%`;

    const progress = Math.min((gameData.totalSaved / 100) * 100, 100);
    document.getElementById('parent-savings-progress').style.width = `${progress}%`;

    // 教育金联动
    const educationData = getData('educationData');
    const familyData = getData('familyData');
    const childAge = (familyData && familyData.childAge) ? familyData.childAge : 3;
    const paths = (educationData && educationData.paths) ? educationData.paths : window.educationData.paths;
    const currentPathKey = (educationData && educationData.currentPath) ? educationData.currentPath : 'public';
    const currentPath = paths[currentPathKey];
    const totalCost = currentPath ? currentPath.totalCost : 260000;
    const yearsLeft = Math.max(1, 22 - childAge);
    const dailyNeeded = totalCost / (yearsLeft * 365);
    const gameSavings = gameData.totalSaved || 0;
    const daysEquivalent = Math.round(gameSavings / dailyNeeded);
    const daysEl = document.getElementById('edu-link-days');
    const subEl = document.getElementById('edu-link-sub');
    if (daysEl) daysEl.textContent = `${daysEquivalent} 天`;
    if (subEl) {
        const nextTask = gameData.tasks.find(t => t.status === 'available');
        if (nextTask) {
            const taskDays = Math.round(nextTask.reward / dailyNeeded);
            subEl.textContent = `完成「${nextTask.name}」可再积累 ${taskDays} 天的教育金`;
        } else {
            subEl.textContent = '每完成一个任务，就离教育目标更近一步';
        }
    }
    
    const container = document.getElementById('parent-task-list');
    container.innerHTML = gameData.tasks.map(task => {
        let typeIcon = 'fa-home';
        if (task.type === 'learning') typeIcon = 'fa-book';
        else if (task.type === 'habit') typeIcon = 'fa-calendar-check';
        else if (task.type === 'independence') typeIcon = 'fa-user';

        return `
            <div class="task-card ${task.status === 'completed' ? 'completed' : ''}">
                <div class="flex items-center flex-1">
                    <i class="fas ${typeIcon} text-gray-400 mr-3"></i>
                    <div>
                        <h4 class="font-medium">${task.name}</h4>
                        <p class="text-green-600 font-bold">+${task.reward} 元</p>
                    </div>
                </div>
                ${task.status === 'completed' ?
                    '<span class="text-green-500 font-medium"><i class="fas fa-check mr-1"></i>已完成</span>' :
                    task.status === 'in_progress' ?
                    '<span class="text-blue-500 font-medium"><i class="fas fa-clock mr-1"></i>进行中</span>' :
                    '<button class="btn btn-primary btn-sm" onclick="startTask(' + task.id + ')">开始</button>'
                }
            </div>
        `;
    }).join('');

    const allowanceEl = document.getElementById('allowance-records');
    if (allowanceEl) {
        const records = (gameData.allowances && gameData.allowances.records) ? gameData.allowances.records : [];
        allowanceEl.innerHTML = records.map(r => `
            <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                    <p class="text-sm font-medium">${r.note || '零花钱'}</p>
                    <p class="text-xs text-gray-500">${r.date}</p>
                </div>
                <span class="text-green-600 font-bold">+¥${r.amount}</span>
            </div>
        `).join('') || '<p class="text-sm text-gray-400 text-center py-2">暂无记录</p>';
    }
}

function renderKidView() {
    const gameData = getData('gameData');

    const kidBalanceLarge = document.getElementById('kid-balance-large');
    if (kidBalanceLarge) kidBalanceLarge.textContent = `¥${gameData.childBalance}`;

    const kidEarned = document.getElementById('kid-earned');
    if (kidEarned) kidEarned.textContent = `累计收入: ¥${gameData.totalEarned}`;
    
    const taskSquare = document.getElementById('kid-task-square');
    if (taskSquare) {
        taskSquare.innerHTML = gameData.tasks.filter(t => t.status !== 'completed').slice(0, 4).map(task => `
            <div class="task-card kid-task p-3">
                <div class="flex-1">
                    <h4 class="font-medium text-sm">${task.name}</h4>
                    <div class="flex items-center mt-1">
                        <span class="text-green-600 font-bold text-sm">+${task.reward} 金币</span>
                    </div>
                </div>
                ${task.status === 'available' ? 
                    '<button class="btn btn-secondary btn-sm" onclick="claimTask(' + task.id + ')">领取</button>' :
                    '<span class="text-blue-500 font-medium text-xs">进行中...</span>'
                }
            </div>
        `).join('');
    }
    
    const wishList = document.getElementById('wish-list');
    if (wishList) {
        const wishes = gameData.wishlist || [];
        wishList.innerHTML = wishes.length > 0 ? wishes.map(wish => `
            <div class="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                <div class="flex-1">
                    <h4 class="font-medium text-sm">${wish.name}</h4>
                    <div class="text-xs text-gray-500 mt-1">已存 ¥${wish.currentAmount} / 目标 ¥${wish.targetAmount}</div>
                    <div class="progress-bar mt-2">
                        <div class="progress-fill progress-pink" style="width: ${Math.min(100, (wish.currentAmount / wish.targetAmount) * 100)}%"></div>
                    </div>
                </div>
                <button class="btn btn-primary btn-sm ml-3" onclick="claimWish(${wish.id})">
                    投入
                </button>
            </div>
        `).join('') : '<p class="text-sm text-gray-500 text-center py-4">还没有心愿，添加一个吧！</p>';
    }
}

function startTask(taskId) {
    const gameData = getData('gameData');
    const task = gameData.tasks.find(t => t.id === taskId);
    if (task) {
        task.status = 'in_progress';
        saveData('gameData', gameData);
        renderGamePage();
    }
}

function completeTask(taskId) {
    const gameData = getData('gameData');
    const task = gameData.tasks.find(t => t.id === taskId);
    if (task) {
        task.status = 'completed';
        task.completedDate = todayStr();
        gameData.childBalance += task.reward;
        gameData.totalEarned += task.reward;
        saveData('gameData', gameData);
        renderGamePage();
    }
}

function claimTask(taskId) {
    const gameData = getData('gameData');
    const task = gameData.tasks.find(t => t.id === taskId);
    if (task) {
        task.status = 'in_progress';
        saveData('gameData', gameData);
        renderGamePage();
    }
}

function addTask() {
    const taskName = prompt('请输入任务名称:');
    const taskReward = prompt('请输入奖励金额:');
    
    if (taskName && taskReward) {
        const gameData = getData('gameData');
        const newId = Math.max(...gameData.tasks.map(t => t.id)) + 1;
        gameData.tasks.push({
            id: newId,
            name: taskName,
            reward: parseInt(taskReward),
            status: 'available',
            type: 'housework',
            icon: 'fa-home'
        });
        saveData('gameData', gameData);
        renderGamePage();
    }
}

function startChallenge(challengeId) {
    const gameData = getData('gameData');
    const challenge = gameData.challenges.find(c => c.id === challengeId);
    if (challenge) {
        challenge.status = 'active';
        challenge.startDate = todayStr();
        saveData('gameData', gameData);
        renderGamePage();
    }
}

// ========== AI对话页面 ==========
const COMPANION = {
    name: '年轮守护顾问',
    avatar: '🌳',
    color: '#E60012',
    greeting: '亲爱的，我在这里陪着你。育儿路上的焦虑，我们一起面对。无论你有什么问题或困扰，都可以告诉我。'
};

const ANXIETY_KEYWORDS = [
    '焦虑', '担心', '害怕', '紧张', '不安', '压力', '烦恼', '困扰',
    '迷茫', '无助', '疲惫', '累', '崩溃', '绝望', '失落', '沮丧',
    '犹豫', '纠结', '难', '怎么办', '怎么选', '不知道', '不会'
];

const ANXIETY_RESPONSES = [
    '我理解你的感受。育儿路上确实有很多不确定性，但请相信，你已经在努力做得更好了。',
    '亲爱的，你不是一个人在战斗。很多父母都会经历类似的焦虑，这说明你是一个非常用心的人。',
    '我能感受到你的压力。但请记住，每个家庭都有自己的节奏，不必和别人比较。',
    '我理解你的担忧。育儿确实需要面对很多选择，但没有绝对的"正确答案"。你在思考这个问题，本身就是一种负责任的表现。',
    '先深呼吸一下。你能把这个问题说出来，已经很棒了。让我们一起慢慢理清思路。'
];

// ========== API Key 管理 ==========
function getApiKey() {
    return localStorage.getItem('arkApiKey') || '';
}

function saveApiKey() {
    const key = document.getElementById('api-key-input').value.trim();
    if (!key.startsWith('ark-')) {
        showToast('Key 格式不对，应以 ark- 开头');
        return;
    }
    localStorage.setItem('arkApiKey', key);
    updateApiStatus();
    toggleApiKeyPanel();
    showToast('API Key 已保存');
}

function clearApiKey() {
    localStorage.removeItem('arkApiKey');
    document.getElementById('api-key-input').value = '';
    updateApiStatus();
    showToast('API Key 已清除');
}

function toggleApiKeyPanel() {
    const panel = document.getElementById('api-key-panel');
    const chevron = document.getElementById('api-chevron');
    const isOpen = panel.style.display !== 'none';
    panel.style.display = isOpen ? 'none' : 'block';
    chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
    if (!isOpen) {
        const key = getApiKey();
        if (key) document.getElementById('api-key-input').value = key;
    }
}

function updateApiStatus() {
    const dot = document.getElementById('api-status-dot');
    const label = document.getElementById('api-status-label');
    if (!dot || !label) return;
    const hasKey = !!getApiKey();
    dot.style.background = hasKey ? '#4CAF50' : '#ccc';
    label.textContent = hasKey ? '火山方舟 AI 已连接，正在使用真实 AI 对话' : '配置火山方舟 API Key 以启用真实 AI 对话';
    label.style.color = hasKey ? '#4CAF50' : '#6b7280';
}

// ========== 构建 System Prompt ==========
function buildSystemPrompt() {
    const familyData = getData('familyData');
    const educationData = getData('educationData');
    const expenseData = getData('expenseData');
    const { total: protectionScore } = calculateProtectionScore();

    const childName = familyData.childName || '孩子';
    const childAge = familyData.childAge || 3;
    const monthlyIncome = familyData.monthlyIncome || 25000;
    const city = familyData.cityLevel || '一线';
    const paths = educationData.paths || window.educationData.paths;
    const currentPathKey = educationData.currentPath || 'public';
    const pathNames = { public: '公立路线', international: '国际路线', overseas: '海外路线' };
    const currentPathName = pathNames[currentPathKey] || '公立路线';
    const currentPath = paths[currentPathKey];
    const totalCost = currentPath ? currentPath.totalCost : 260000;
    const currentSavings = educationData.currentSavings || 0;
    const gap = Math.max(0, totalCost - currentSavings);
    const yearsLeft = Math.max(1, 22 - childAge);
    const monthlyNeeded = Math.round(gap / (yearsLeft * 12));
    const anxietyAmount = expenseData.categories ? (expenseData.categories[2] || {}).amount || 0 : 0;
    const riskProfile = educationData.riskProfile || 'moderate';
    const riskNames = { conservative: '保守型', moderate: '稳健型', aggressive: '积极型' };

    return `你是「年轮守护」的 AI 财务顾问，专注于亲子家庭的财务规划与育儿焦虑疏导。你的风格温暖、专业、不推销产品，帮助家长理清思路、做出理性决策。

当前用户家庭信息：
- 孩子姓名：${childName}，${childAge} 岁，${city}城市
- 家庭月收入：${monthlyIncome.toLocaleString()} 元
- 风险偏好：${riskNames[riskProfile] || '稳健型'}
- 教育路径：${currentPathName}，目标总费用 ${(totalCost/10000).toFixed(0)} 万元
- 已存教育金：${(currentSavings/10000).toFixed(1)} 万元，缺口 ${(gap/10000).toFixed(1)} 万元
- 建议月储蓄：${monthlyNeeded.toLocaleString()} 元/月（距毕业还有 ${yearsLeft} 年）
- 家庭保障评分：${protectionScore}/100
- 本月焦虑驱动支出：${anxietyAmount.toLocaleString()} 元

回答原则：
1. 优先结合用户的真实数据给出具体建议，而不是泛泛而谈
2. 涉及金额时直接给出数字，不要模糊表达
3. 遇到焦虑情绪先共情，再给理性分析
4. 不推荐具体金融产品，只给配置思路
5. 回答简洁，用换行和 emoji 增加可读性，不超过 300 字`;
}

// ========== 真实 AI 调用（火山方舟） ==========
async function callClaudeAPI(userMessage) {
    const apiKey = getApiKey();
    if (!apiKey) return null;

    const messages = [
        { role: 'system', content: buildSystemPrompt() },
        ...chatHistory
            .filter(m => m.type === 'user' || m.type === 'ai')
            .slice(-10)
            .map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.content })),
        { role: 'user', content: userMessage }
    ];

    const response = await fetch(
        'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'doubao-seed-2-0-pro-260215',
                messages,
                max_tokens: 600
            })
        }
    );

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

function renderChatPage() {
    renderMessages();
    renderQuickQuestions();
    updateApiStatus();
}

function renderMessages() {
    const container = document.getElementById('chat-messages');
    
    if (!chatHistory || chatHistory.length === 0) {
        chatHistory = [{
            type: 'ai',
            content: COMPANION.greeting
        }];
    }
    
    container.innerHTML = chatHistory.map(msg => `
        <div class="chat-message ${msg.type}">
            ${msg.type === 'ai' ? `<div class="chat-avatar ai" style="background-color: ${COMPANION.color}20">${COMPANION.avatar}</div>` : ''}
            <div class="chat-bubble ${msg.type}" ${msg.type === 'ai' ? `style="border-color: ${COMPANION.color}30"` : ''}>
                <p>${msg.content.replace(/\n/g, '<br>')}</p>
            </div>
            ${msg.type === 'user' ? '<div class="chat-avatar user">👤</div>' : ''}
        </div>
    `).join('');
    
    container.scrollTop = container.scrollHeight;
}

const QUICK_QUESTIONS = [
    { question: "教育金应该存多少合适？" },
    { question: "孩子报什么兴趣班比较好？" },
    { question: "怎么判断是不是焦虑消费？" },
    { question: "家庭保险怎么配置？" },
    { question: "怎么给孩子树立正确的金钱观？" }
];

function renderQuickQuestions() {
    const container = document.getElementById('quick-questions');
    
    container.innerHTML = `
        <div class="quick-questions">
            ${QUICK_QUESTIONS.map(q => `
                <button class="quick-question-btn" onclick="sendQuickQuestion('${q.question}')">
                    ${q.question}
                </button>
            `).join('')}
        </div>
    `;
}

async function sendQuickQuestion(question) {
    chatHistory.push({ type: 'user', content: question });
    renderMessages();

    const apiKey = getApiKey();
    if (apiKey) {
        addTypingIndicator();
        try {
            const answer = await callClaudeAPI(question);
            removeTypingIndicator();
            chatHistory.push({ type: 'ai', content: answer });
        } catch (e) {
            removeTypingIndicator();
            showToast('AI 调用失败：' + e.message);
            chatHistory.push({ type: 'ai', content: generateSmartReply(question) });
        }
    } else {
        setTimeout(() => {
            chatHistory.push({ type: 'ai', content: generateSmartReply(question) });
            renderMessages();
        }, 600);
        return;
    }
    renderMessages();
}

function detectAnxiety(message) {
    const lowerMessage = message.toLowerCase();
    return ANXIETY_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

function generateSmartReply(message) {
    const isAnxious = detectAnxiety(message);
    
    if (isAnxious) {
        const randomResponse = ANXIETY_RESPONSES[Math.floor(Math.random() * ANXIETY_RESPONSES.length)];
        return randomResponse + '\n\n💡 ' + getTopicSpecificAdvice(message);
    }
    
    return getTopicSpecificAdvice(message);
}

function getTopicSpecificAdvice(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('教育金') || lowerMessage.includes('存钱') || lowerMessage.includes('储蓄')) {
        const familyData = getData('familyData');
        const educationData = getData('educationData');
        
        if (familyData && educationData) {
            const monthlyIncome = familyData.monthlyIncome || 20000;
            const savingsRate = educationData.currentSavings && educationData.targetAmount 
                ? Math.round((educationData.currentSavings / educationData.targetAmount) * 100) 
                : 10;
            
            return `关于教育金规划，我给您一些建议：\n\n📊 根据您的情况：\n• 建议教育金储备比例为家庭收入的10%-15%\n• 按照您的家庭收入，建议每月储备 ${Math.round(monthlyIncome * 0.12)} 元左右\n• 目前您的储备进度约为 ${savingsRate}%，继续保持！\n\n💡 小贴士：教育金越早规划越轻松，时间是最好的朋友。`;
        }
        return `教育金规划是很多家长关心的问题。\n\n💡 一般建议：\n• 提前规划，从孩子出生就开始\n• 采用定投方式，平滑成本\n• 选择相对稳定的投资产品\n• 建议设置专门的教育金账户\n\n如果您能告诉我更多关于您孩子的情况，我可以给出更具体的建议。`;
    }
    
    if (lowerMessage.includes('保险')) {
        return `关于家庭保险配置，我给您一些建议：\n\n🏥 优先级排序：\n1. 医疗险（人人需要）\n2. 重疾险（家庭经济支柱优先）\n3. 意外险（孩子活泼好动）\n4. 教育金保险（经济允许后考虑）\n\n💡 原则：\n• 保费不超过家庭收入的10%\n• 先保障后教育\n• 大人保障要优于孩子\n\n您可以描述一下您目前的家庭情况，我可以给出更具体的建议。`;
    }
    
    if (lowerMessage.includes('兴趣班') || lowerMessage.includes('补习') || lowerMessage.includes('培训')) {
        return `关于兴趣班选择，我理解您的纠结。\n\n🌟 建议原则：\n• 兴趣班不在多，在于孩子真正喜欢\n• 建议先体验再长期报名\n• 关注孩子的反馈而不是别人报了什么\n• 留出足够的自由玩耍时间\n\n💡 小贴士：\n• 3-6岁以艺术体育类为主\n• 7-12岁可以适当增加思维类\n• 警惕"不能输在起跑线"的焦虑营销\n\n您可以告诉我孩子的年龄，我可以给出更具体的建议。`;
    }
    
    if (lowerMessage.includes('焦虑') || lowerMessage.includes('压力')) {
        return `我理解您的焦虑。育儿路上的压力是很多父母都会有的感受。\n\n💝 请记住：\n• 您已经在努力做更好了\n• 每个家庭都有自己的节奏\n• 高质量陪伴比昂贵的课程更重要\n• 孩子最需要的是父母的关爱，不是完美的条件\n\n🌟 我们可以一起分析一下具体是什么让您感到焦虑，找到更理性的应对方式。`;
    }
    
    if (lowerMessage.includes('支出') || lowerMessage.includes('花费') || lowerMessage.includes('预算')) {
        return `关于家庭支出管理，我给您一些建议：\n\n📝 支出分类：\n• 刚性支出（教育、居住、餐饮）\n• 品质支出（旅行、娱乐）\n• 焦虑支出（跟风消费、冲动购买）\n\n💡 建议：\n• 建议设置月度预算\n• 区分"需要"和"想要"\n• 遇到大额支出先冷静7天\n• 记录每笔支出，定期复盘\n\n您可以告诉我您目前的支出情况，我可以帮您分析。`;
    }
    
    return `感谢您的问题！\n\n我是您的年轮守护顾问，可以帮您解答：\n• 教育金规划问题\n• 家庭保险配置\n• 育儿焦虑困惑\n• 支出管理建议\n\n请告诉我您具体想了解什么，我们可以一起探讨。`;
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    chatHistory.push({ type: 'user', content: message });
    input.value = '';
    renderMessages();

    const apiKey = getApiKey();
    if (apiKey) {
        addTypingIndicator();
        try {
            const reply = await callClaudeAPI(message);
            removeTypingIndicator();
            chatHistory.push({ type: 'ai', content: reply });
        } catch (e) {
            removeTypingIndicator();
            showToast('AI 调用失败：' + e.message);
            chatHistory.push({ type: 'ai', content: generateSmartReply(message) });
        }
    } else {
        setTimeout(() => {
            chatHistory.push({ type: 'ai', content: generateSmartReply(message) });
            renderMessages();
        }, 800);
        return;
    }
    renderMessages();
}

function addTypingIndicator() {
    const container = document.getElementById('chat-messages');
    const el = document.createElement('div');
    el.id = 'typing-indicator';
    el.className = 'chat-message ai';
    el.innerHTML = `
        <div class="chat-avatar ai" style="background-color: ${COMPANION.color}20">${COMPANION.avatar}</div>
        <div class="chat-bubble ai" style="border-color: ${COMPANION.color}30">
            <span class="typing-dots">
                <span>.</span><span>.</span><span>.</span>
            </span>
        </div>`;
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
}

function resetChat() {
    chatHistory = [{
        type: 'ai',
        content: COMPANION.greeting
    }];
    renderMessages();
}
