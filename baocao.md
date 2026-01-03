TRƯỜNG ĐẠI HỌC VINH
VIỆN KỸ THUẬT VÀ CÔNG NGHỆ


   

BÁO CÁO
THỰC TẬP CUỐI KHÓA


VỊ TRÍ THỰC TẬP SINH PHÁT TRIỂN WEBSITE
SỬ DỤNG REACT 



  ĐVTT:	Công ty TNHH Thương mại điện tử Sudo
SVTH:	Trần Ngọc Thế, 215748020110414




Nghệ An, 12/2025 
LỜI CẢM ƠN
Em xin gửi lời cảm ơn chân thành đến Công ty TNHH Thương mại điện tử Sudo vì đã tạo điều kiện để em được thực tập tại vị trí Lập trình viên Phát triển Website sử dụng React trong thời gian qua.
Trong suốt quá trình thực tập, em đã có cơ hội quý báu được tham gia vào dự án phát triển website thực tế, bao gồm việc phân tích yêu cầu, xây dựng giao diện người dùng (UI/UX), xử lý dữ liệu client-side và kết nối tích hợp API để đảm bảo website hoạt động thông suốt.
Em đặc biệt trân trọng những kinh nghiệm thực tiễn mà Công ty đã mang lại, từ việc áp dụng thư viện React để xây dựng giao diện người dùng tương tác, sử dụng thư viện quản lý trạng thái như Redux Toolkit cho đến cách tổ chức các component và triển khai mã nguồn hiệu quả.
Dưới sự hướng dẫn tận tình từ các anh/chị trong nhóm kỹ thuật, em đã nâng cao đáng kể kiến thức chuyên môn về lập trình JavaScript/TypeScript, hiểu sâu hơn về kiến trúc React và các design patterns trong phát triển web. Các buổi góp ý code, hỗ trợ xử lý lỗi và làm việc nhóm đã giúp em phát triển mạnh mẽ kỹ năng tư duy logic, khả năng giải quyết vấn đề hiệu quả.
Sự hỗ trợ và chỉ dẫn này không chỉ giúp em hoàn thành xuất sắc nhiệm vụ thực tập mà còn trang bị cho em một nền tảng kiến thức và kinh nghiệm vững chắc, định hướng rõ ràng cho sự nghiệp tương lai trong lĩnh vực phát triển website.
Em xin kính chúc Công ty TNHH Thương mại điện tử Sudo ngày càng phát triển vững mạnh, gặt hái được nhiều thành công hơn nữa và tiếp tục là đơn vị tiên phong trong lĩnh vực công nghệ.
Em xin chân thành cảm ơn!

Nghệ An, tháng 12 năm 2025 
                                                                                                  Sinh viên
                                                                                               Trần Ngọc Thế
MỤC LỤC
LỜI CẢM ƠN	1
PHẦN 1: GIỚI THIỆU ĐƠN VỊ THỰC TẬP	4
1.1. Giới thiệu công ty TNHH thương mại điện tử Sudo	4
1.1.1. Tổng quan về công ty	4
1.1.2. Tầm nhìn và sứ mệnh	4
1.1.3. Lĩnh vực kinh doanh và dịch vụ	5
1.1.4. Thành tựu và định hướng phát triển	5
PHẦN 2: KẾT QUẢ THỰC TẬP	7
2.1. Cơ sở lý thuyết và công nghệ nền tảng	7
2.1.1. Kiến trúc React và các Thành phần Cốt lõi	7
2.1.2. Redux Toolkit - Quản lý State hiện đại	8
2.1.3. Quản lý State với Redux Toolkit	8
2.1.4. Kiến trúc điều hướng nâng cao với React Router	9
2.1.5. Development Environment và Modern Tooling	9
2.2. Xây dựng và phát triển hệ thống Project Management	10
2.2.1. Giới thiệu dự án Project Management System	10
2.2.2. Triển khai các chức năng chính	11
PHẦN 3: BÀI HỌC KINH NGHIỆM	17

 
Thông tin thực tập
Tên đơn vị thực tập	Công ty TNHH Thương mại điện tử Sudo
Tên bộ phận thực tập	Kỹ thuật phát triển phần mềm
Các nhiệm vụ thực tập	Nghiên cứu phân tích phát triển website với thư viện React
Thời gian thực tập	Từ ngày 03/10/2025 đến ngày 26/12/2025
Người hướng dẫn thực tập	Anh Nguyễn Văn Duy

 
PHẦN 1: GIỚI THIỆU ĐƠN VỊ THỰC TẬP
1.1. Giới thiệu công ty TNHH thương mại điện tử Sudo
1.1.1. Tổng quan về công ty
Công ty TNHH thương mại điện tử Sudo (Sudo E-commerce Company Limited) được thành lập 4/11/2015. Với đội ngũ bao gồm những kỹ sư tài năng tại Việt Nam và Đức. Sudo luôn nỗ lực để cung cấp cho khách hàng những sản phẩm chất lượng với tiêu chuẩn Châu Âu.
Giá trị cốt lõi:
- Khách hàng là trọng tâm: Mọi hoạt động, quyết định của đội ngũ Sudo đều phải đặt lợi ích và sự thành công của khách hàng lên hàng đầu.
- Đột phá với AI:  Khuyến khích sự sáng tạo, học hỏi và áp dụng công nghệ mới, đặc biệt là AI, để liên tục cải tiến sản phẩm và quy trình làm việc.
- Đơn giản hóa (Simplify Complexity): Mọi thứ từ sản phẩm, quy trình làm việc đến giao tiếp nội bộ và với khách hàng đều hướng tới sự rõ ràng, dễ hiểu và hiệu quả.
- Tốc độ: Thúc đẩy tinh thần hành động nhanh, đưa ra quyết định kịp thời và triển khai công việc hiệu quả.
- Chính chực: Xây dựng môi trường làm việc dựa trên sự tin tưởng, tôn trọng và trách nhiệm giải trình.
- Sự công nhận: Đánh giá cao rằng sự ghi nhận sẽ thúc đẩy sự phát triển và thành công. 
1.1.2. Tầm nhìn và sứ mệnh
Với tất cả sản phẩm, dịch vụ, dự án của Sudo cung cấp, chúng tôi đều không ngừng hoàn thiện quy trình, áp dụng công nghệ tự động hoá, xây dựng giải pháp để đáp ứng yêu cầu xử lý bài toán hiệu quả và tối ưu nhất.
- Tầm nhìn: Xây dựng Sudo thành công ty thương mại điện tử tiên phong về công nghệ và trải nghiệm khách hàng dẫn đầu tại Việt Nam trong vòng 5 năm tới (2030). 
- Sứ mệnh: Sứ mệnh của Sudo là giúp các doanh nghiệp có nền tảng làm việc chuyên nghiệp, sáng tạo và bền vững để thành công trong thương mại điện tử bằng giải pháp công nghệ đột phá.
1.1.3. Lĩnh vực kinh doanh và dịch vụ
Công ty TNHH Thương mại điện tử Sudo tập trung vào việc cung cấp các giải pháp công nghệ đột phá, đặc biệt là trong lĩnh vực thương mại điện tử. Sứ mệnh của công ty là giúp các doanh nghiệp xây dựng nền tảng làm việc chuyên nghiệp, sáng tạo và bền vững để thành công trong mảng này.
Các lĩnh vực hoạt động và dịch vụ chính bao gồm:
- Phát triển Website: Chuyên phát triển các website hiện đại, responsive và tối ưu hiệu năng, sử dụng các công nghệ tiên tiến như React, Next.js.
- Giải pháp Thương mại điện tử: Cung cấp các giải pháp công nghệ toàn diện và nền tảng giúp các doanh nghiệp vận hành và thành công trong lĩnh vực thương mại điện tử.
- Phát triển Phần mềm: Xây dựng và phát triển các sản phẩm phần mềm, ứng dụng theo yêu cầu, tập trung vào việc tối ưu trải nghiệm khách hàng.
- Nghiên cứu và Ứng dụng Công nghệ mới: Khuyến khích học hỏi và áp dụng các công nghệ mới, đặc biệt là AI, để liên tục cải tiến sản phẩm và quy trình làm việc.
1.1.4. Thành tựu và định hướng phát triển
Công ty TNHH Thương mại điện tử Sudo là một đối tác đáng tin cậy trong hành trình đổi mới và phát triển công nghệ thông tin tại Việt Nam. Sudo luôn nỗ lực không ngừng để hoàn thiện quy trình, áp dụng công nghệ tự động hoá và xây dựng các giải pháp hiệu quả, tối ưu nhất. Công ty luôn cố gắng cung cấp cho khách hàng những sản phẩm chất lượng đạt tiêu chuẩn Châu Âu.
Về định hướng phát triển, Sudo khuyến khích sự sáng tạo, học hỏi và áp dụng công nghệ mới, đặc biệt là AI, để liên tục cải tiến sản phẩm và quy trình làm việc. Tầm nhìn của công ty là xây dựng Sudo trở thành công ty thương mại điện tử tiên phong về công nghệ và trải nghiệm khách hàng, dẫn đầu tại Việt Nam trong vòng 5 năm tới (2030) , thông qua việc cung cấp các giải pháp công nghệ đột phá.
 
PHẦN 2: KẾT QUẢ THỰC TẬP
2.1. Cơ sở lý thuyết và công nghệ nền tảng
Trong thời gian 3 tháng thực tập tại Công ty TNHH Thương mại điện tử Sudo với vị trí Lập trình viên Phát triển Website, em đã được đào tạo và làm việc theo lộ trình chi tiết, tập trung vào các công nghệ React, Redux và các công cụ phát triển web hiện đại.
2.1.1. Kiến trúc của React và các Thành phần Cốt lõi
Kiến trúc Component-Based: React sử dụng Virtual DOM để tối ưu hiệu năng render, cho phép xây dựng giao diện người dùng phức tạp thông qua các component có thể tái sử dụng. Điều này giúp quản lý state và props hiệu quả, đồng thời tạo ra mã nguồn dễ bảo trì.
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { FaHome, FaUser, FaCamera } from 'react-icons/fa';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { user } = useSelector(state => state.auth);
    const { currentWorkspace } = useSelector(state => state.workspace);
    
    // Component logic với hooks pattern
    ...
}
Ví dụ 1. Từ Dashboard.jsx - Component structure
Mẫu Hooks hiện đại: Thay vì Class Components, Project Management System sử dụng hoàn toàn Function Components với Hooks để quản lý state và side effects. Điều này giúp code ngắn gọn hơn và dễ kiểm tra hơn.
JSX và Styling: JSX kết hợp với CSS Modules hoặc Styled Components để tạo UI responsive. Sử dụng hệ thống bố cục Flexbox/Grid cho thiết kế đáp ứng trên mọi kích thước màn hình.
2.1.2. Bộ công cụ Redux – Quản lí trạng thái hiện đại
Triển khai Bộ công cụ Redux: Thay vì Redux thuần túy, Project Management System sử dụng Redux Toolkit (RTK) để giảm mã lặp khuôn và tăng trải nghiệm của nhà phát triển.
import { configureStore } from '@reduxjs/toolkit'
import workspaceReducer from '../features/workspaceSlice'
import themeReducer from '../features/themeSlice'
import authReducer from '../features/authSlice'
import projectReducer from '../features/projectSlice'
import taskReducer from '../features/taskSlice'

export const store = configureStore({
    reducer: {
        workspace: workspaceReducer,
        theme: themeReducer,
        auth: authReducer,
        project: projectReducer,
        task: taskReducer,
        permissions: permissionReducer,
        notification: notificationReducer,
        admin: adminReducer,
    },
})
Ví dụ 2. Từ store.js – Cấu hình Redux với nhiều slice modules
Quản lý State Modular: Sử dụng Redux Toolkit với các slice riêng biệt cho từng domain (workspace, auth, project, task), giúp tổ chức code rõ ràng và dễ bảo trì.
Mẫu middleware nâng cao: Triển khai middleware tùy chỉnh cho xử lý lỗi, quản lý Modal, và giám sát hiệu suất trong chế độ phát triển.
2.1.3. Quản lý State với Redux Toolkit
Slice Pattern: Sử dụng createSlice từ Redux Toolkit để tạo reducer và actions một cách tự động, giảm boilerplate code.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchProjects = createAsyncThunk(
  'project/fetchProjects',
  async (workspaceId) => {
    const response = await projectAPI.getAll(workspaceId)
    return response.data
  }
)
Ví dụ 3. Từ projectSlice.js – Async Thunk pattern
Async Operations: Sử dụng createAsyncThunk để xử lý các API calls bất đồng bộ, tự động quản lý các trạng thái pending, fulfilled, và rejected.
2.1.4. Kiến trúc điều hướng nâng cao với React Router
Cấu trúc điều hướng lồng nhau: Project Management System triển khai hệ thống định tuyến phức tạp với nhiều routes lồng nhau và protected routes.
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/guards/ProtectedRoute'
import ProtectedAdminRoute from './components/guards/ProtectedAdminRoute'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="projects" element={<Projects />} />
                        <Route path="tasks" element={<TaskDetails />} />
                    </Route>
                </Route>
                <Route element={<ProtectedAdminRoute />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
Ví dụ 4. Từ App.jsx - Protected routing setup
Điều hướng điều kiện: Luồng điều hướng động dựa trên trạng thái xác thực và vai trò người dùng (user/admin) sử dụng ProtectedRoute và ProtectedAdminRoute guards.
2.1.5. Môi trường Phát triển và Bộ công cụ
Cấu hình Build Tool: Sử dụng Vite cho hot module replacement (HMR) nhanh, tối ưu hóa bundle size và cải thiện trải nghiệm phát triển.
Tích hợp Công cụ Phát triển
- React DevTools Extension cho Chrome/Firefox
- Redux DevTools Extension để theo dõi state changes
- Công cụ hỗ trợ phát triển tùy chỉnh và các hàm gỡ lỗi toàn cục
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
Ví dụ 5. Từ vite.config.js - Development configuration
Development Server: Cấu hình Vite proxy để kết nối với backend API, hỗ trợ hot reload và fast refresh trong quá trình phát triển.
2.2. Xây dựng và phát triển hệ thống Project Management
2.2.1. Giới thiệu dự án Project Management System
Mô tả bài toán: Project Management System là ứng dụng quản lý dự án và công việc nhóm, giúp các team tổ chức công việc hiệu quả với hệ thống workspace, project và task. Ứng dụng hỗ trợ phân quyền chi tiết, theo dõi tiến độ real-time và tích hợp AI để gợi ý tối ưu hóa workflow.
Mục tiêu dự án:
- Quản lý workspace, projects và tasks với phân cấp rõ ràng
- Hệ thống phân quyền chi tiết theo vai trò (owner, admin, member)
- Theo dõi tiến độ công việc real-time với socket.io
- Tích hợp AI để phân tích và gợi ý tối ưu hóa công việc
- Hệ thống approval workflow cho tasks quan trọng
Công nghệ stack chính:
"@reduxjs/toolkit": "^2.8.2",              
"axios": "^1.13.2",                          
"react-router-dom": "^7.8.1",               
"socket.io-client": "^4.8.1",               
"react-hot-toast": "^2.6.0",                
"lucide-react": "^0.540.0",                 
"i18next": "^25.6.1",                        
"tailwindcss": "^4.1.12",                   
"vite": "^7.1.2"                             
Ví dụ 6. Từ package.json dependencies - Core technologies
2.2.2. Triển khai các chức năng chính
2.2.2.1. Chức năng 1: Hệ thống Quản lý Task với Approval Workflow (Core Feature)
Mô tả: Tính năng chủ đạo cho phép quản lý tasks với workflow phê duyệt, phân quyền chi tiết và theo dõi tiến độ real-time.
Cách triển khai:
Task State Management với Redux:
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { taskAPI } from '../api'

export const fetchMyTasks = createAsyncThunk(
  'task/fetchMyTasks',
  async () => {
    const response = await taskAPI.getMyTasks()
    return response.data
  }
)

const taskSlice = createSlice({
  name: 'task',
  initialState: {
    tasks: [],
    loading: false,
    error: null
  },
  reducers: {
    updateTaskStatus: (state, action) => {
      const task = state.tasks.find(t => t._id === action.payload.taskId)
      if (task) task.status = action.payload.status
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyTasks.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMyTasks.fulfilled, (state, action) => {
        state.loading = false
        state.tasks = action.payload
      })
  }
})
Ví dụ 7. Từ taskSlice.js - Redux task management

Approval Workflow Implementation:
export const submitTaskForApproval = createAsyncThunk(
  'task/submitForApproval',
  async ({ taskId, message }) => {
    const response = await taskAPI.submitForApproval(taskId, { message })
    return response.data
  }
)

export const approveTask = createAsyncThunk(
  'task/approve',
  async ({ taskId, approvalData }) => {
    const response = await taskAPI.approve(taskId, approvalData)
    return response.data
  }
)
Ví dụ 8. Từ taskSlice.js - Approval workflow
Hệ thống Approval: Triển khai workflow phê duyệt cho tasks với các trạng thái pending_approval, approved, rejected và auto-approval sau thời gian chờ.
 
Hình 2.1. Giao diện quản lý tasks và approval workflow.

2.2.2.2. Chức năng 2: Hệ thống xác thực người dùng với JWT và Google OAuth
Mô tả: Hệ thống xác thực người dùng với JWT token, hỗ trợ đăng nhập bằng email/password và Google OAuth.
Redux-based Authentication Flow:
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }) => {
    const response = await axios.post('/api/auth/login', { email, password })
    localStorage.setItem('token', response.data.token)
    return response.data
  }
)

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, isAuthenticated, user } = useSelector((state) => state.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error(t('auth.fillAllFields'))
      return
    }
    try {
      await dispatch(login({ email, password })).unwrap()
      toast.success(t('auth.loginSuccess'))
      navigate('/')
    } catch (error) {
      toast.error(error.message)
    }
  }
}
Ví dụ 9. Từ Login.jsx - JWT Authentication với Redux
 
Hình 2.2. Giao diện chức năng đăng nhập và đăng ký.
 
Hình 2.3. Giao diện hồ sơ người dùng và cài đặt người dùng.
2.2.2.3. Chức năng 3: Real-time Notifications với Socket.IO
Mô tả: Hệ thống thông báo real-time cho cập nhật task, comment, và approval requests.
Socket.IO Integration:
import io from 'socket.io-client'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'

export const socket = io(import.meta.env.VITE_API_URL, {
  auth: {
    token: localStorage.getItem('token')
  }
})

export const useSocket = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    socket.on('task:updated', (data) => {
      dispatch(updateTask(data.task))
      toast.success(`Task "${data.task.title}" has been updated`)
    })

    socket.on('notification:new', (notification) => {
      dispatch(addNotification(notification))
      toast.info(notification.message)
    })

    return () => {
      socket.off('task:updated')
      socket.off('notification:new')
    }
  }, [dispatch])
}
Ví dụ 10. Từ socket.js - Real-time notifications

Notification Component:
const NotificationBell = () => {
  const { notifications, unreadCount } = useSelector(state => state.notification)
  
  useSocket() // Subscribe to real-time events
  
  return (
    <div className="relative">
      <Bell className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </div>
  )
}
Ví dụ 11. Từ NotificationBell.jsx - Real-time UI updates
   
Hình 2.4. Giao diện notifications real-time.

2.2.2.4. Chức năng 4: Admin Dashboard với Analytics và User Management
Mô tả: Dashboard quản trị hệ thống với thống kê chi tiết, quản lý users, workspaces và export reports.
Admin Dashboard Implementation:
import { useEffect, useState } from 'react'
import { adminAPI } from '../../api'
import { LineChart, PieChart, BarChart } from '../../components/charts'
import { downloadReportFromAPI } from '../../utils/exportUtils'

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    const fetchDashboard = async () => {
      const data = await adminAPI.getDashboard()
      setDashboardData(data)
    }
    fetchDashboard()
  }, [])

  const handleExportReport = async (format) => {
    await downloadReportFromAPI(adminAPI.exportReport, format)
    toast.success(t('admin.exportSuccess'))
  }

  const handleUpdateUserRole = async (userId, role) => {
    await adminAPI.updateUser(userId, { isSystemAdmin: role === 'admin' })
    toast.success(t('admin.roleUpdated'))
  }

  return (
    <div>
      <LineChart data={dashboardData?.activityTrend} />
      <PieChart data={dashboardData?.userDistribution} />
    </div>
  )
}
Ví dụ 12. Từ AdminDashboard.jsx - System analytics và user management
Role-based Access Control: Hiển thị UI khác nhau dựa trên user role 
2.2.2.5. Chức năng 5: AI Insights cho Task Optimization
Mô tả: Tích hợp AI để phân tích dữ liệu dự án và đưa ra insights tối ưu hóa workflow.
AI Service Implementation:
import axios from 'axios'

export const aiService = {
  async getTaskInsights(taskId) {
    const response = await axios.get(`/api/ai/tasks/${taskId}/insights`)
    return response.data
  },

  async suggestTaskOptimization(projectId) {
    const response = await axios.post(`/api/ai/projects/${projectId}/optimize`, {
      includeMetrics: ['duration', 'priority', 'dependencies']
    })
    return response.data
  },

  async analyzeProjectHealth(projectId) {
    const response = await axios.get(`/api/ai/projects/${projectId}/health`)
    return response.data
  }
}

// Component sử dụng AI insights
const TaskInsights = ({ taskId }) => {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchInsights = async () => {
    setLoading(true)
    const data = await aiService.getTaskInsights(taskId)
    setInsights(data)
    setLoading(false)
  }

  return (
    <div className="ai-insights">
      <h3>AI Insights</h3>
      {insights?.suggestions.map(suggestion => (
        <div key={suggestion.id}>
          <p>{suggestion.message}</p>
          <span className="confidence">{suggestion.confidence}% confidence</span>
        </div>
      ))}
    </div>
  )
}
Ví dụ 13. Từ aiService.js - AI insights integration
 
Hình 2.5. Giao diện AI Insights và Task Optimization

PHẦN 3: BÀI HỌC KINH NGHIỆM
3.1. Bài học kinh nghiệm về việc vận dụng kiến thức đã học
Qua quá trình thực tập tại Công ty TNHH Thương mại điện tử SUDO, em nhận thấy sự liên kết chặt chẽ giữa lý thuyết được đào tạo tại trường và thực tế công việc:
Tư duy lập trình và Cấu trúc dữ liệu: Các kiến thức nền tảng về thuật toán và cấu trúc dữ liệu đã giúp em tiếp cận nhanh chóng với việc xử lý logic phức tạp trong ứng dụng. Đặc biệt là tư duy về lập trình hướng đối tượng (OOP) và lập trình hàm (Functional Programming) đã hỗ trợ đắc lực khi làm việc với các Component trong React và quản lý state với Redux.
Quy trình phát triển phần mềm: Những kiến thức về vòng đời phát triển phần mềm (SDLC) đã giúp em hiểu rõ vị trí và trách nhiệm của mình trong dự án, từ khâu nhận yêu cầu, thiết kế đến lập trình và kiểm thử.
Cơ sở dữ liệu và Mạng máy tính: Sự hiểu biết về cách thức hoạt động của API, giao thức HTTP và cấu trúc JSON học được ở trường là tiền đề quan trọng để em thực hiện thành công việc tích hợp API phía client và xử lý dữ liệu bất đồng bộ một cách hiệu quả.
3.2. Bài học kinh nghiệm về việc học hỏi kiến thức thực tế từ đơn vị thực tập
Môi trường làm việc thực tế tại SUDO đã mang lại cho em khối lượng kiến thức chuyên sâu mà sách vở chưa thể bao quát hết:
Làm chủ công nghệ React: Em đã nắm vững quy trình xây dựng Single Page Application (SPA) hiện đại. Thay vì chỉ viết mã chạy được, em học được cách tối ưu hóa hiệu năng render bằng các hooks nâng cao như React.memo, useCallback, và useMemo. Điều này giúp website phản hồi nhanh chóng và mượt mà trên mọi thiết bị.
Quản lý trạng thái (State Management) quy mô lớn: Việc áp dụng Redux Toolkit kết hợp với Redux Thunk và Reselect vào dự án thực tế giúp em hiểu sâu sắc về luồng dữ liệu một chiều (One-way data flow). Em đã học được cách tổ chức store sao cho khoa học, dễ bảo trì và tránh việc re-render không cần thiết.
Xử lý responsive design: Một bài học lớn là việc đảm bảo website hiển thị tốt trên mọi kích thước màn hình. Em đã tích lũy được kinh nghiệm trong việc sử dụng CSS Flexbox, Grid và Media Queries để tạo giao diện responsive, đảm bảo trải nghiệm người dùng đồng nhất trên desktop, tablet và mobile.
3.3. Bài học kinh nghiệm về việc rèn luyện kỹ năng, phẩm chất nghề nghiệp
Bên cạnh kiến thức chuyên môn, kỳ thực tập giúp em hoàn thiện tác phong làm việc chuyên nghiệp:
Tư duy Clean Code (Mã sạch): Em nhận thức rõ ràng rằng code không chỉ để máy chạy mà còn để con người đọc. Việc tuân thủ các quy tắc đặt tên, tách nhỏ hàm và component giúp code dễ đọc, dễ bảo trì và thuận lợi cho việc làm việc nhóm (teamwork).
Kỹ năng giải quyết vấn đề (Problem Solving): Khi đối mặt với các lỗi (bugs) khó hoặc các yêu cầu kỹ thuật mới, em đã rèn luyện được sự kiên nhẫn, kỹ năng tra cứu tài liệu (Google, StackOverflow, Documentation chính hãng) và khả năng tự học để tìm ra giải pháp tối ưu nhất.
3.4. Kiến nghị với Nhà trường để cải tiến học phần Thực tập cuối khoá
Dựa trên những trải nghiệm thực tế tại doanh nghiệp, em xin có một số đề xuất nhỏ nhằm nâng cao chất lượng đào tạo:
Cập nhật các Framework hiện đại: Nhà trường nên cân nhắc đưa các chuyên đề về các thư viện và framework phát triển web phổ biến như React, Vue.js, Next.js vào giảng dạy sớm hơn hoặc tổ chức các buổi workshop chuyên sâu, vì nhu cầu tuyển dụng mảng này hiện nay rất lớn.
Tăng cường thực hành về State Management và Git: Trong dự án thực tế, việc quản lý source code bằng Git (làm việc nhóm, resolve conflict) và quản lý state phức tạp là bắt buộc. Việc được tiếp cận kỹ hơn với các công cụ này tại trường sẽ giúp sinh viên đỡ bỡ ngỡ khi hòa nhập vào quy trình doanh nghiệp.







