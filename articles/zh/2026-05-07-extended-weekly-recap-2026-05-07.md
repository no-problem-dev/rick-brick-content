---
title: "扩展周报 - 物理AI从"
slug: "extended-weekly-recap-2026-05-07"
summary: "物理AI与代理化加速，制造、宇宙、创药、金融中的"
date: "2026-05-07T12:30"
tags: ["extended-weekly-recap","AI","Robotics","創薬AI","経済","教育工学","AI実装","エネルギー工学","宇宙科学","フィンテック","デジタル変革","Agent AI","Physical AI","科学技術","イノベーション"]
category: "extended-weekly-recap"
automated: true
provider: "openai"
sources: ["https://www.manufacturingdigital.com/articles/gft-google-cloud-ai-powered-visual-inspection-robots","https://www.globenewswire.com/news-release/2026/04/30/2873111/0/en/ClassMate-by-World-Book-Recognized-with-Prestigious-ISTE-Seal.html","https://www.prnewswire.com/news-releases/insilicos-rentosertib-inhalation-solution-receives-ind-clearance-for-the-worlds-first-ai-driven-candidate-to-enter-direct-to-lung-clinical-study-302130303.html","https://www.businesswire.com/news/home/20260430501328/en/The-Museum-of-Science-and-Mystic-River-Watershed-Association-Honored-with-2026-Boston-Climate-Leader-Award-for-Research-and-Innovation","https://www.conference-board.org/press/us-lei-march-2026","https://www.eurekalert.org/news-releases/990355","https://www.iea.org/news/data-centre-electricity-use-surged-in-2025-even-with-tightening-bottlenecks-driving-a-scramble-for-solutions","https://www.jpl.nasa.gov/news/nasas-perseverance-rover-completes-first-ai-planned-drive-on-mars","https://www.ed.gov/about/news/press-release/proclaiming-april-2026-national-community-college-month","https://www.unesco.org/en/articles/launch-observatory-artificial-intelligence-education-latin-america-and-caribbean-connecting?hub=68184","https://iite.unesco.org/news/ai-day-2026-unesco-and-codemao-launched-ai-and-coding-for-youth-platform/","https://arxiv.org/abs/2604.18643","https://www.indiatimes.com/tech/news/meta-acquires-robotics-company-assured-robot-intelligence-to-help-build-humanoid-technology-683641.html","https://www.prnewswire.com/news-releases/insilico-medicines-inhalation-solution-of-rentosertib-receives-ind-clearance-for-the-worlds-first-ai-driven-candidate-to-enter-direct-to-lung-clinical-study-302129339.html","https://www.uab.edu/news/research/item/15535-study-shows-brain-training-can-reduce-alzheimer-s-and-dementia-risk-by-25-percent","https://digit.fyi/fs-tech-summit-2026-ai-resilience-and-the-future-of-finance/","https://www.nasa.gov/news-release/nasa-partners-update-international-space-station-2026-flight-plan/","https://press.siemens.com/global/en/pressrelease/siemens-brings-ai-physical-world-eigen-engineering-agent","https://www.nasdaq.com/press-release/arrive-ai-deploys-nvidia-isaac-sim-and-blackwell-gpu-systems-accelerate-ai-robotics","https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Releases-New-Physical-AI-Models-as-Global-Partners-Unveil-Next-Generation-Robots/default.aspx"]
sns_topics: [{"topic":"制造现场的AI视觉检查机器人×原因分析代理","summary":"GFT与Google Cloud部署AI驱动的视觉检查机器人。不仅自动化缺陷检出，还能自动识别产生源头，明确了预防不良品增产的方向。"},{"topic":"数据中心电力增长与AI负荷的'供应约束'问题","summary":"IEA整理2025年数据中心电力使用增长与AI负荷。由于电网增强滞后，电力×计算的优化波及产业竞争力和安全保障。"},{"topic":"火星漫游的AI计划驾驶与太空中的计划审计","summary":"JPL报告了Perseverance的AI计划驾驶完成。虽非完全自主，但将计划制定的一部分转向AI，减少运维负荷和机会成本。"},{"topic":"药物发现AI：吸入剂的IND批准与抗体设计的高速优化","summary":"Insilio的Rentosertib获得IND批准。同时ConvergeAB能够在短时间内改善现有抗体的结合亲和力，AI正逼近可执行的设计。"},{"topic":"物理AI模型与代理化（仿真→实机）","summary":"Siemens的Eigen Engineering Agent、NVIDIA Physical AI、UR×Scale AI等协同。通过仿真和数据获取，用SDK降低'执行'的摩擦。"}]
thumbnail: "/images/extended-weekly-recap-2026-05-07.png"
recap_period: "2026-04-30/2026-05-06"
---
### 1. 执行摘要

本周最重要的趋势是，AI从"推理的存在"向"执行并产生结果的存在"转变，以物理世界为轴心向前推进。在制造中，AI代理化了从缺陷检测到根本原因分析的过程；在太空中，AI承担火星漫游车的行驶计划，降低了运行负荷；在创药中，报道了IND批准和抗体设计的高速优化。

另一方面，支撑执行的现实约束条件——数据中心电力和系统瓶颈——再次显露出来。在教育和金融领域，AI的应用也转向了治理、人才制度和可审计性，本周既考察了技术的"能力"，也考察了"治理"。

按领域来看，机器人技术和物理AI的信息量最大，其次是生命科学和创药AI、能源工程、太空工程。心理学和认知科学主要是理论方面的启示，经济学和计算社会科学在本次输入中没有突出的单独新闻。

---

### 2. 本周亮点（最重要的3-5个议题）

#### 亮点1：制造现场AI视觉检测扩展到"根本原因分析代理"（机器人×工业实施）
**概述**
本周机器人相关的报道中，AI在制造流水线中的实施进展到了"在现场运行"的阶段。GFT Technologies与Google Cloud合作推出的汽车制造流水线AI驱动视觉检测机器人新闻中，AI代理不仅检测缺陷（defect），还自动识别缺陷来源，并立即反馈，从而防止缺陷零件的扩大生产。关键在于，检查结果的呈现不是终点，而是链接到下一步行动（流水线停止、条件调整、原因追踪）的"闭环化"在推进。同时，本周还报道了Deloitte表示企业对物理AI抱有很高期待，这强化了制造业正在从试点导入过渡到业务转型的背景。此外，教育领域涉及STEM访问扩展的背景下，机器人平台的许可证合同也成为话题，物理AI的适用范围在扩大。

**领域**
机器人技术·自主代理、教育工程（STEM实施）

**背景与经过**
传统AI在图像分析和异常检测等"观察"方面很强，但在根据观察结果进行现场决策和工序设计自动化方面存在多重障碍：运行程序、数据质量、因果推断、现场约束（安全、停止标准、职责划分）等。本周的事例之所以重要，是因为它超越了这些障碍，通过包括云基础设施在内的形式实施AI代理，将检测、原因识别和实时反馈整合到同一个系统中。

**技术与社会影响**
在社会实施中影响最大的是质量保证的速度和成本变化。当故障发生后用来手工寻找原因的时间缩短时，不仅损失（废弃、返工）减少，学习数据（原因与结果的对应）的积累也加速。结果是AI的价值从"检查"转移到"改进过程"。此外，这种闭环化伴随员工角色的重新设计（监督、异常处理、工序设计的权重增加），因此容易与教育和技能更新相结合。

**未来展望**
下周及之后需要关注的是，根本原因分析代理能在多大程度上处理因果关系，以及能否以可审计的形式进行解释。缺陷的"检测"相对容易评估，但"发生源的识别"则受到现场多个因素（材料差异、设备磨损、作业员操作、环境条件）的影响，因此工序变更的合理性、安全性、责任归属等将成为争议焦点，而不仅仅是模型性能指标。此外，包括教育和培训计划在内的人才侧面的准备，也直接关系到现场部署的可持续性。

**出处**
[Manufacturing Digital：GFT×Google Cloud AI视觉检测机器人](https://www.manufacturingdigital.com/articles/gft-google-cloud-ai-powered-visual-inspection-robots)

---

#### 亮点2：数据中心电力增长与AI负荷成为"产业竞争力的条件"（能源×AI）
**概述**
本周IEA强调了AI发展与电力约束的直接对应关系。IEA整理了数据中心电力使用在2025年急速增加的事实，以及AI密集型（AI专用）数据中心增长速度相对更快的情况，并警告电力供应端的瓶颈正在进入"解决方案竞争（供应约束的争夺）"阶段。具体数字包括：数据中心用电增长17%，5大科技公司的资本支出在2025年超过400亿美元，预计2026年进一步增长75%。

**领域**
能源工程·气候科学、经济学（投资·产业竞争力）、机器人技术（作为运行基础的计算）

**背景与经过**
AI是计算密集型的，不仅学习而且推理也增加计算需求。此外，数据中心投资不仅依赖电源，还依赖配电·系统连接的余量。但短期内系统扩强速度跟不上需求增长，因此如何保障电力成为影响成本、供应稳定性以及产业导入速度的因素。在IEA的语境中，这个问题被扩展到制度设计的讨论，不仅涵盖电力成本，还包括能源可及性（家庭和产业负担）、安全性（供应中断风险）和经济影响。

**技术与社会影响**
在社会层面，AI应用的"可行/不可行"越来越受到电力市场和监管设计的影响。在技术层面，电网投资的优先级、可再生能源·储能·系统灵活性等电源组合设计，以及需求侧（数据中心）的峰值抑制等都成为竞争力所在。结果是，AI的性能提升不再是唯一追求，运行工程学（如何基于电力价格进行推理控制）变得至关重要。

**未来展望**
下一个焦点是，基于计算需求的电网计划与AI工作负载设计（何时·运行哪个模型·运行多少）的融合能在多大程度上制度化。不仅技术厂商，电力公司、监管部门和产业政策制定者可能会坐到同一张桌子前。此外，在气候政策中，AI与可再生能源的关系如何评估（能源消费的正当性、机会成本、减排整合性）仍将是议题。

**出处**
[IEA：2025年数据中心电力使用剧增与AI负荷](https://www.iea.org/news/data-centre-electricity-use-surged-in-2025-even-with-tightening-bottlenecks-driving-a-scramble-for-solutions)

---

#### 亮点3：太空探测自主化达到"计划"的AI化（火星×计划审计）
**概述**
JPL报告称火星漫游车"Perseverance"完成了AI规划的首次驾驶。报道中，生成AI和机器学习被用于分析高分辨率轨道图像（HiRISE）和地形坡度数据，AI提出的规划路线（图示的路径）与实际行驶路线进行了比较。重要的是，这不是宣称"完全自主"，而是为了缓解地面运行的瓶颈（人工确认、月级的前置时间），而采取的分阶段战略——将计划制定的一部分转移给AI。

**领域**
太空工程·太空科学、机器人技术·自主代理

**背景与经过**
航天器因通信延迟和无法维修，现场的计划和判断质量左右任务成功率。但错误判断的成本极高，因此现场自主化必须与"可验证性"相结合。过度依赖地面运行会导致审查时间成为瓶颈，增加科学探索的机会损失。因此，采取了AI制定计划候选、地面验证和审计，同时降低整体运行决策成本的方法。

**技术与社会影响**
在技术方面，AI可以对大规模图像和地形数据进行高速总结，地面审计流程得以合理化，计划周期可能会缩短。此外，如何将风险（导航不确定性和地形陷阱）量化并融入AI计划中，成为下一代规划引擎的设计问题。在社会层面，太空治理的讨论从单纯的安全性扩展到可解释性和计划审计框架。

**未来展望**
下周及之后，计划AI的输出如何验证，地面审计负荷减少了多少，都值得关注。此外，当AI从规划推进到执行的一部分（例如危险的即时纠正）时，责任划分、失败分析程序（日志、可重现性）也变得重要。

**出处**
[JPL：Perseverance的AI规划驾驶完成](https://www.jpl.nasa.gov/news/nasas-perseverance-rover-completes-first-ai-planned-drive-on-mars)

---

#### 亮点4：创药AI通过IND批准和抗体优化接近"执行"阶段（生命科学×生成AI）
**概述**
创药AI的新闻中，从单纯的候选探索转向与临床流程相联系的动作尤为突出。Insilico Medicine利用生成AI平台"Pharma.AI"开发的TNIK抑制剂"Rentosertib"吸入液，获得了中国国家药品监督管理局（CDE）的IND申报批准。AI承担了从靶点发现到分子设计的整个过程，候选药物采用直接肺部给药这一临床具体形式，相比传统口服药具有减少副作用的期待。此外，本周后期报道称Converge Bio的生成AI"ConvergeAB"优化了现有抗癌药西妥昔单抗（cetuximab）的抗体设计，在8小时内将结合亲和力提高了2.1倍以上。报道强调了不需额外学习或手工调整的条件，AI的"短时间实施能力"成为焦点。

**领域**
生命科学·创药AI、心理学（创药的社会接受度间接相关但本周主要是生命科学）、经营学（研发周期）

**背景与经过**
创药从研究到临床的桥接期很长，AI迄今为止主要因"加快探索"而受到评价。但IND批准和具体给药方式的确定表明，AI的价值正在与临床决策相联系。此外，当抗体设计优化等接近实务的指标（结合亲和力）在短时间内改善并被报道时，AI正在加速实验规划和设计迭代，进而可能缩短试验启动前的时间。

**技术与社会影响**
在社会层面，罕见病、肺病等特定领域中，包括给药途径在内的设计优化成为可能，有望改善治疗可及性和不良反应特征。在产业层面，AI的优势从"输出候选"向"推进开发"转移，因此研发组织的KPI（从探索速度向临床里程碑）也需重新设计。

**未来展望**
下一个课题是，IND批准和设计改善在多大程度上能成功，以及如何证明再现性和生物安全性（数据透明性、方法解释、监管合规）。此外，肺部局部给药和抗体设计改善如何与临床结果相连接——即如何填补"翻译间隙"（从硅学/体外/体内到临床）是焦点。

**出处**
[PR Newswire：Rentosertib吸入液IND批准](https://www.prnewswire.com/news-releases/insilicos-rentosertib-inhalation-solution-receives-ind-clearance-for-the-worlds-first-ai-driven-candidate-to-enter-direct-to-lung-clinical-study-302130303.html)
[PR Newswire：ConvergeAB优化西妥昔单抗抗体](https://www.prnewswire.com/news-releases/converge-bio-the-generative-ai-lab-for-the-life-sciences-shares-findings-from-a-new-study-showing-that-convergeab-their-antibody-design-and-optimization-solution-was-able-to-improve-cetuximab-a-widely-used-cancer-therapy-302135063.html)

---

#### 亮点5：物理AI模型与代理执行缩小"实验室→现场"的摩擦（Physical AI×SDK×模仿学习）
**概述**
本周报道了多个动向，表明物理世界中运行的AI正在朝"在模拟中训练、代理在现场执行"方向整合。Siemens发布了"Eigen Engineering Agent"，不仅展示模型，还将工厂和现场的工程流程作为工作流重新构成，体现了从决策到执行（自主执行）的承诺。NVIDIA推出了Physical AI Models，强调了下一代机器人实施不仅需要模型本身，还需要周边堆栈（模拟、计算、实施协调）。Arrive AI利用NVIDIA Isaac Sim和Blackwell GPU系统，加速机器人/计算机视觉开发。Universal Robots与Scale AI合作，提供加速模仿学习的机制，意在整理高保真数据收集和学习的流程。研究方面，arXiv的AeroGen通过结构化提示和Drone SDK展示了生成的自主无人机代码在真实环境和模拟中的有用性。共同主题是"生成的东西不是直接用，而是按执行端的约束来守护"的设计。

**领域**
机器人技术·自主代理、计算基础（周边堆栈）、经营学·组织论（实施流程的变化）

**背景与经过**
机器人实施最大的瓶颈是：(1) 现场数据获取成本，(2) 模拟与实机的差距，(3) 安全要求导致不仅需要验证模型本身，还需验证整个系统。这些反映了算法研究最终成果的评估从"能否运行"转向"是否能在现场约束下使用"。物理AI为弥补这一差距而诞生，将数据收集、模拟、实施协调、执行监视（SDK或接口）视为一个统一的开发生命周期。

**技术与社会影响**
在技术方面，模拟驱动学习加快开发速度，同时模仿学习和高保真数据改进现场适配。SDK的约束有助于同时实现安全性和可部署性。在社会方面，自主系统普及程度越高，审计和问责设计就变得越重要，开发流程本身也转变为包含"工程治理"的形式。

**未来展望**
下周及之后的关键是：(1) 物理AI模型的基准如何定义，(2) SDK/接口能抑制哪种故障，(3) 学习数据的偏差与安全性的权衡如何管理。此外，在群体和分布式控制等需要协调的领域，竞争轴可能从单体性能转向"组装的可重现性"。

**出处**
[Siemens：Eigen Engineering Agent](https://press.siemens.com/global/en/pressrelease/siemens-brings-ai-physical-world-eigen-engineering-agent)
[NVIDIA：Physical AI Models](https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Releases-New-Physical-AI-Models-as-Global-Partners-Unveil-Next-Generation-Robots/default.aspx)
[Arrive AI：NVIDIA Isaac Sim和Blackwell](https://www.nasdaq.com/press-release/arrive-ai-deploys-nvidia-isaac-sim-and-blackwell-gpu-systems-accelerate-ai-robotics)
[Universal Robots×Scale AI：模仿学习系统](https://www.nasdaq.com/press-release/universal-robots-and-scale-ai-launch-imitation-learning-system-accelerate-ai-model)
[arXiv：AeroGen（Agentic Drone Autonomy）](https://arxiv.org/abs/2603.14236)
[Red Cat Holdings：Apium Swarm Robotics收购完成](https://ir.redcatholdings.com/news-events/press-releases/detail/216/red-cat-closes-acquisition-of-apium-swarm-robotics)

---

### 3. 领域周报

#### 1. 机器人技术·自主代理
制造视觉检测机器人实现了从检测到根本原因分析的闭环化，Siemens和NVIDIA等推进物理AI模型与代理执行。确认了无人机自主也以SDK为前提来提升部署性的趋势。

#### 2. 心理学·认知科学
人类与AI协同决策的互补性框架成为话题。此外，AI"理解"的局限（模式记忆还是真正理解）以及量子类认知模型的提案等，理论层面的启示突出。

#### 3. 经济学·行为经济学
报道称Q1 GDP增长得到AI基础设施投资支撑，同时也显示了景气先行指数的疲弱。投资与消费的不匹配成为议题。

#### 4. 生命科学·创药AI
Insilico的吸入液获IND批准，Converge Bio实现抗体设计的高速优化，生成AI接近临床里程碑。实验迭代的缩短得以展示，对翻译间隙的关注上升。

#### 5. 教育工程
限制生成AI使用的闭源模型型学习平台获得评价。此外，教育AI观测所和社区大学的AI素养及人才培养也从制度端推进。

#### 6. 经营学·组织论
人形机器人领域技术基础的收购动向最具象征性，企业资产和人才从软件转向物理实施。金融领域AI治理向运行核心转移。

#### 7. 计算社会科学
输入中没有突出的个别新闻，故略过。

#### 8. 金融工程·计算金融
包含LLM的自动化接近订单执行，从预测向"规则化执行"转变。AI透明性与基于上下文的实时风险管理成为焦点。

#### 9. 能源工程·气候科学
IEA整理了电力供应瓶颈和AI负荷增加，强调了制度设计的必要性。此外，直接空气捕获（DAC）的机会成本也得到评估，投资效益审查严格化推进。

#### 10. 太空工程·太空科学
火星漫游车的AI规划驾驶完成，太空自主化阶段进入"计划AI化"。继Artemis II成功后，月球探测阶段转变也有报道。

---

### 4. 周次趋势分析

本周的横贯性趋势是，AI从"作为信息处理的能力"转向"约束下的执行"和"运行责任设计"。在制造中从检测到根本原因分析，太空中将计划制定的一部分转移给AI，创药中候选设计的成果与IND批准相联系，金融中模型输出转化为可执行订单的框架推进。这些都共同表明，系统设计不仅需要模型性能，还需融入时间、成本、安全性、监管、可审计性等要求。

多个领域的共同模式包括：(1) 模拟和数据收集基础设施的整备，(2) 执行端的约束（SDK、审计、工作流化），(3) 组织和制度更新（教育、治理、电力市场制度设计）同步推进。特别是物理AI与计算资源（能源）相结合，使得AI导入的可行性受到"电力、系统、运行调度"的影响，这不仅是成本问题，还涉及安全保障和产业竞争力，因此技术与政策的距离在缩小。

在领域间的相互影响中，可以看到能源×太空×机器人的交点。太空探测和机器人运行伴随计算和分析，其背后是数据中心电力和计算基础。认知×教育×治理方面，则显示了考虑到AI协同和理解局限的设计正反映到教育制度（观测所和人才培养）。创药AI和金融AI中，成功指标从研究成果向临床和市场这样的"现场结果"转移，因此评估框架本身正在改变。

作为相对安静的领域，虽然计算社会科学和个别心理学实验新闻不突出，但理论研究（量子类模型、互补性框架）和神经机制的启示仍存在，总体上保持了"实施越推进，理解、审计、问责讨论就越要先期准备"的均衡。

---

### 5. 未来展望

下周及之后有望关注以下三点。首先，物理AI开发周期能在多大程度上缩短，实机适用的成功率能否提高——这一"实务指标"的进展。Eigen Engineering Agent、Isaac Sim、UR×Scale AI等框架接下来将面临"装机工程量减少了多少"和"安全与性能如何兼得"的评价。

其次，以电力约束为前提的AI运行标准化是否推进。IEA呈现的瓶颈讨论，下一阶段会波及电力市场制度设计、需求侧控制、可再生能源·储能的组合优化。AI方面也可能出现避开高峰推理的战略和模型选择的运行优化。

第三，创药AI和金融AI的"执行"带来的成功率与治理整备。Insilico的IND批准和抗体设计的高速改善是强大推力，但下一步需要包括临床有效性·安全性确证在内的验证。金融中，订单执行自动化越推进，就越需要透明性、问责和基于上下文的风险管理。

从中长期看，"AI很聪明"向"AI可运行""AI可解释""AI能负责"的要件转变，技术开发的中心位置正在调整。物理AI处于最前线，波及范围从机器人到太空、制造乃至医疗，因此治理和人才制度（教育AI观测所、社区大学）的角色在今后会进一步扩大。

---

### 6. 参考文献

| 标题 | 信息源 | 日期 | URL |
|---------|--------|------|-----|
| AI-Powered Visual Inspection Robots | Manufacturing Digital | 2026-04-30 | https://www.manufacturingdigital.com/articles/gft-google-cloud-ai-powered-visual-inspection-robots |
| ClassMate by World Book Recognized with Prestigious ISTE Seal | GlobeNewswire | 2026-04-30 | https://www.globenewswire.com/news-release/2026/04/30/2873111/0/en/ClassMate-by-World-Book-Recognized-with-Prestigious-ISTE-Seal.html |
| Insilico's Rentosertib Inhalation Solution IND Clearance | PR Newswire | 2026-04-28 | https://www.prnewswire.com/news-releases/insilicos-rentosertib-inhalation-solution-receives-ind-clearance-for-the-worlds-first-ai-driven-candidate-to-enter-direct-to-lung-clinical-study-302130303.html |
| 2026 Boston Climate Leader Awards | Business Wire | 2026-04-30 | https://www.businesswire.com/news/home/20260430501328/en/The-Museum-of-Science-and-Mystic-River-Watershed-Association-Honored-with-2026-Boston-Climate-Leader-Award-for-Research-and-Innovation |
| The Conference Board LEI for the US March 2026 | The Conference Board | 2026-04-30 | https://www.conference-board.org/press/us-lei-march-2026 |
| Human-AI Team Complementarity Framework | EurekAlert! | 2026-04-30 | https://www.eurekalert.org/news-releases/990355 |
| Data centre electricity use surged in 2025, even with tightening bottlenecks driving a scramble for solutions | IEA | 2026-04-16 | https://www.iea.org/news/data-centre-electricity-use-surged-in-2025-even-with-tightening-bottlenecks-driving-a-scramble-for-solutions |
| NASA's Perseverance Rover Completes First AI-Planned Drive on Mars | NASA JPL | 2026-04-30 | https://www.jpl.nasa.gov/news/nasas-perseverance-rover-completes-first-ai-planned-drive-on-mars |
| Proclaiming April 2026 as National Community College Month | U.S. Department of Education | 2026-04-07 | https://www.ed.gov/about/news/press-release/proclaiming-april-2026-national-community-college-month |
| Launch of the Observatory on Artificial Intelligence in Education for Latin America and the Caribbean | UNESCO | 2026-04-14 | https://www.unesco.org/en/articles/launch-observatory-artificial-intelligence-education-latin-america-and-caribbean-connecting?hub=68184 |
| AI Day 2026: UNESCO and CODEMAO launched AI and Coding for Youth platform | UNESCO IITE | 2026-03-27 | https://iite.unesco.org/news/ai-day-2026-unesco-and-codemao-launched-ai-and-coding-for-youth-platform/ |
| Quantum-Like Models of Cognition and Decision Making: Open-Systems and Gorini--Kossakowski--Sudarshan--Lindblad Dynamics | arXiv | 2026-04-?? | https://arxiv.org/abs/2604.18643 |
| Meta acquires robotics company Assured Robot Intelligence | The Economic Times | 2026-05-02 | https://www.indiatimes.com/tech/news/meta-acquires-robotics-company-assured-robot-intelligence-to-help-build-humanoid-technology-683641.html |
| Insilico Medicine's Rentosertib Indication Approval | PR Newswire | 2026-04-29 | https://www.prnewswire.com/news-releases/insilico-medicines-inhalation-solution-of-rentosertib-receives-ind-clearance-for-the-worlds-first-ai-driven-candidate-to-enter-direct-to-lung-clinical-study-302129339.html |
| Study shows brain training can reduce Alzheimer's risk | UAB News | 2026-05-01 | https://www.uab.edu/news/research/item/15535-study-shows-brain-training-can-reduce-alzheimer-s-and-dementia-risk-by-25-percent |
| FS Tech Summit 2026: AI, Resilience, and Finance | Digit.fyi | 2026-05-01 | https://digit.fyi/fs-tech-summit-2026-ai-resilience-and-the-future-of-finance/ |
| NASA Partners Update ISS 2026 Flight Plan | NASA | 2026-05-02 | https://www.nasa.gov/news-release/nasa-partners-update-international-space-station-2026-flight-plan/ |
| Siemens brings AI to the physical world with Eigen Engineering Agent | Siemens Press | 2026-04-20 | https://press.siemens.com/global/en/pressrelease/siemens-brings-ai-physical-world-eigen-engineering-agent |
| Arrive AI Deploys NVIDIA Isaac Sim and Blackwell GPU Systems to Accelerate AI, Robotics, and Computer Vision Development | Nasdaq | 2026-04-29 | https://www.nasdaq.com/press-release/arrive-ai-deploys-nvidia-isaac-sim-and-blackwell-gpu-systems-accelerate-ai-robotics |
| NVIDIA Releases New Physical AI Models as Global Partners Unveil Next-Generation Robots | NVIDIA Investor Relations | 2026-02-XX | https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Releases-New-Physical-AI-Models-as-Global-Partners-Unveil-Next-Generation-Robots/default.aspx |
| Universal Robots and Scale AI Launch Imitation Learning System to Accelerate AI Model Training | Nasdaq | 2026-03-XX | https://www.nasdaq.com/press-release/universal-robots-and-scale-ai-launch-imitation-learning-system-accelerate-ai-model |
| AeroGen: Agentic Drone Autonomy through Single-Shot Structured Prompting & Drone SDK | arXiv | 2026-03-15 | https://arxiv.org/abs/2603.14236 |
| Red Cat Closes Acquisition of Apium Swarm Robotics | Red Cat Holdings IR | 2026-04-XX | https://ir.redcatholdings.com/news-events/press-releases/detail/216/red-cat-closes-acquisition-of-apium-swarm-robotics |
| Affordance Agent Harness: Verification-Gated Skill Orchestration | arXiv | 2026-05-04 | https://arxiv.org/abs/2605.00663 |
| ConvergeAB improves cetuximab binding affinity | PR Newswire | 2026-05-04 | https://www.prnewswire.com/news-releases/converge-bio-the-generative-ai-lab-for-the-life-sciences-shares-findings-from-a-new-study-showing-that-convergeab-their-antibody-design-and-optimization-solution-was-able-to-improve-cetuximab-a-widely-used-cancer-therapy-302135063.html |
| Direct air capture opportunity costs study | EurekAlert! | 2026-05-04 | https://www.eurekalert.org/news-releases/1043328 |
| Insular cortex social affective behavior study | EurekAlert! | 2026-05-04 | https://www.eurekalert.org/news-releases/1043341 |
| ATLAS: Adaptive Trading with LLM AgentS | arXiv | 2026-05-04 | https://arxiv.org/abs/2510.15949 |
| Brian Nutt on the Future of Automated Trading | PR Newswire | 2026-05-04 | https://www.prnewswire.com/news-releases/brian-nutt-of-trutrade-discusses-the-future-of-automated-trading-systems-302135068.html |
| NASA just took a huge step toward the moon after Artemis II success | NASA | 2026-05-04 | https://www.nasa.gov/news-release/nasa-just-took-a-huge-step-toward-the-moon-after-artemis-ii-success/ |

---

> 本文由 LLM 自动生成，内容可能存在错误。
