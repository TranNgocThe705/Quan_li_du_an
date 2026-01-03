# Cập Nhật Xử Lý Lỗi 403 - Không Có Quyền Xem Chi Tiết Task

## Mô Tả Vấn Đề
Trước đây, khi user không có quyền xem chi tiết task, API sẽ trả lỗi nhưng page không thông báo rõ ràng. User cần thấy thông báo "Không có quyền truy cập" một cách rõ ràng và thân thiện.

## Giải Pháp Được Triển Khai

### 1. Frontend - TaskDetails.jsx

#### Thêm State Quản Lý Lỗi Quyền Hạn
```javascript
const [permissionError, setPermissionError] = useState(null);
const { currentTask: task, loading, error, comments } = useSelector(state => state.task);
```

#### Xử Lý Lỗi Khi Fetch Task
```javascript
useEffect(() => {
    if (taskId) {
        dispatch(fetchTaskById(taskId))
            .unwrap()
            .then(() => {
                setPermissionError(null);
                // Only fetch comments if task can be accessed
                dispatch(fetchComments(taskId));
            })
            .catch((err) => {
                if (err && (err.includes('Access denied') || err.includes('không có quyền'))) {
                    setPermissionError(err || 'Bạn không có quyền xem chi tiết công việc này');
                    toast.error(err || 'Bạn không có quyền xem chi tiết công việc này');
                }
            });
    }
}, [dispatch, taskId]);
```

#### Thêm Phần Render Thông Báo Không Có Quyền
```jsx
if (permissionError || error) {
    return (
        <div className="p-6 text-center text-zinc-900 dark:text-zinc-200">
            <div className="max-w-md mx-auto mt-20 p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex justify-center mb-4">
                    <XCircleIcon className="w-16 h-16 text-red-500" />
                </div>
                <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-2">Không có quyền truy cập</h2>
                <p className="text-zinc-700 dark:text-zinc-300 mb-6">
                    {permissionError || error || 'Bạn không có quyền xem chi tiết công việc này'}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                    Chỉ người được giao nhiệm vụ, Team Lead hoặc Workspace Admin mới có thể xem chi tiết công việc này.
                </p>
                <button 
                    onClick={() => navigate(`/projectsDetail?id=${projectId}&tab=tasks`)} 
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Quay lại danh sách công việc
                </button>
            </div>
        </div>
    );
}
```

### 2. Backend - Comment Controller

#### Cập Nhật getComments
Thêm kiểm tra quyền giống như `checkTaskViewPermission`:
- Cho phép nếu user là assignee
- Cho phép nếu user là team lead
- Cho phép nếu user là workspace admin
- Trả lỗi 403 nếu không phù hợp điều kiện nào

#### Cập Nhật createComment
Cũng thêm kiểm tra quyền để chỉ những người có quyền xem task mới có thể comment.

**Files cập nhật:**
- `backend/controllers/commentController.js`
- `backend/src/controllers/commentController.js`

## Flow Xử Lý

### Khi User Cố Gắng Xem Task Mà Không Có Quyền

1. **Frontend:** Gọi `dispatch(fetchTaskById(taskId))`
2. **Backend:** Route GET `/api/tasks/:id` → Middleware `checkTaskViewPermission` → Kiểm tra quyền
3. **Backend:** Nếu không có quyền → Trả 403 với message "Access denied. Only the assignee, team lead, or workspace admin can view this task details"
4. **Frontend:** `fetchTaskById` rejected → Catch error → Set `permissionError`
5. **Frontend:** Render thông báo "Không có quyền truy cập" với:
   - Icon cảnh báo (XCircleIcon)
   - Tiêu đề: "Không có quyền truy cập"
   - Mô tả lỗi
   - Hướng dẫn: "Chỉ người được giao nhiệm vụ, Team Lead hoặc Workspace Admin mới có thể xem chi tiết công việc này."
   - Nút "Quay lại danh sách công việc"

### Giao Diện Hiển Thị

```
┌─────────────────────────────────────────────┐
│                                             │
│                  ⭕ (Icon)                   │
│                                             │
│        Không có quyền truy cập              │
│                                             │
│    Access denied. Only the assignee,       │
│    team lead, or workspace admin can       │
│    view this task details                  │
│                                             │
│  Chỉ người được giao nhiệm vụ, Team Lead  │
│  hoặc Workspace Admin mới có thể xem      │
│  chi tiết công việc này.                   │
│                                             │
│        [Quay lại danh sách công việc]      │
│                                             │
└─────────────────────────────────────────────┘
```

## Lợi Ích

✅ **UX Cải Thiện:** User biết rõ tại sao không thể xem chi tiết
✅ **Bảo Mật Rõ Ràng:** Giải thích logic phân quyền
✅ **Thân Thiện:** Thông báo lỗi dễ hiểu bằng tiếng Việt
✅ **Hướng Dẫn:** Giải thích ai có thể xem chi tiết task

## Tất Cả Files Được Cập Nhật

**Frontend:**
- `frontend/src/pages/tasks/TaskDetails.jsx`

**Backend:**
- `backend/controllers/commentController.js`
- `backend/src/controllers/commentController.js`

---
**Ngày cập nhật:** 2026-01-03
**Phiên bản:** 1.0
