# 🌱 风光储耦合制氢系统容量优化配置平台

**基于Vue前端 + Julia后端的智能化风光储氢协同优化系统**  
构建8760小时逐时尺度下风光耦合的并/离网制氢系统模型，通过输入特定地区的气象数据、设备参数，以逐时数据真实反映制氢系统的电力输入和能量平衡，并进一步分析制氢系统的产氢量和效率。可根据用户设定的能源需求、成本预算、容量约束等条件，对风光发电设备和制氢设备的容量进行优化配置。以实现能源利用效率最大化、成本最小化，并确保产氢量要求，满足用户在不同场景下的需求。
![image](https://github.com/user-attachments/assets/149f9e91-747a-4f94-9415-f5306c466dd4)


## 🌟 核心功能
- **多目标优化**  
  - 平准化制氢成本（LCOH）最小化  
  - 风光消纳率最大化  
  - 产氢量最大化  
- **可视化配置**  
  - 风机/光伏/储能容量参数交互式调节  
  - 地理气象数据动态加载 
- **结果展示**
  - 系统典型日出力情况
  - 优化过程收敛曲线  
  - Pareto前沿多目标权衡分析  
  - 经济性指标对比

## 🛠️ 技术栈
| 模块          | 技术选型                                                                 |
|---------------|--------------------------------------------------------------------------|
| **前端**      | Vue 3 + Element Plus + ECharts + Vite                                   |
| **后端**      | Julia 1.10 + HTTP.jl + MySQL（优化算法：遗传算法/枚举）               |
| **数据接口**  | axios 发送请求 + JSON Schema 校验                                          |
| **部署**      | Docker Compose（前端Nginx + 后端Julia服务 + MySQL）                     |

## 🚀 快速开始

### 1. 环境准备
```bash
# 前端
cd frontend && npm install

# 后端
julia --project=backend -e 'using Pkg; Pkg.instantiate()'
```
### 2. 数据库配置
```bash
# MySQL
CREATE DATABASE IF NOT EXISTS newenergy;
use newenergy;
create table  if not exists non_dominated_solutions(
	wind int,
	pv int,
	storage int, 
	electrolyzer int,
	tank int,
	consumption float,
	LCOH float,
	Hproduction float,
	Front int 
);
...
```
### 3. 运行开发模式
```bash
# 前端开发服务器
npm run dev

# 启动Julia后端
  julia -- Mainserver.jl
```
## 📜 计算演示
![2025-04-28T10_04_25 624Z-787771](https://github.com/user-attachments/assets/99ce4e9c-686b-4e69-8662-83d95fefd07e)
