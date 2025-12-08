import { useState } from "react";
import { XIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { createWorkspace, fetchWorkspaces } from "../features/workspaceSlice";
import { toast } from "react-hot-toast";

const CreateWorkspaceDialog = ({ isDialogOpen, setIsDialogOpen }) => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        image_url: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    const handleNameChange = (e) => {
        const name = e.target.value;
        setFormData({ 
            ...formData, 
            name,
            // Auto-generate slug from name
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Vui lòng chọn file ảnh');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Kích thước ảnh không được vượt quá 5MB');
                return;
            }
            
            setSelectedFile(file);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
                setFormData({ ...formData, image_url: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setIsSubmitting(true);
        try {
            await dispatch(createWorkspace({
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                image_url: previewUrl || formData.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`,
            })).unwrap();

            // Fetch updated workspace list
            await dispatch(fetchWorkspaces());

            // Reset form and close dialog
            setFormData({
                name: "",
                slug: "",
                description: "",
                image_url: "",
            });
            setSelectedFile(null);
            setPreviewUrl("");
            setIsDialogOpen(false);
            toast.success('Workspace đã được tạo thành công!');
        } catch (error) {
            console.error('Failed to create workspace:', error);
            toast.error(error || 'Không thể tạo workspace');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isDialogOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur flex items-center justify-center text-left z-50">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-lg text-zinc-900 dark:text-zinc-200 relative">
                <button 
                    className="absolute top-3 right-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200" 
                    onClick={() => setIsDialogOpen(false)}
                    type="button"
                >
                    <XIcon className="size-5" />
                </button>

                <h2 className="text-xl font-medium mb-1">Tạo Workspace Mới</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                    Tạo một workspace mới để quản lý các dự án của bạn
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Workspace Name */}
                    <div>
                        <label className="block text-sm mb-1 font-medium">
                            Tên Workspace <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            value={formData.name} 
                            onChange={handleNameChange}
                            placeholder="Ví dụ: Marketing Team, Dev Team" 
                            className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            required 
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Slug (Auto-generated) */}
                    <div>
                        <label className="block text-sm mb-1 font-medium">
                            Slug <span className="text-xs text-zinc-500">(tự động tạo)</span>
                        </label>
                        <input 
                            type="text" 
                            value={formData.slug} 
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            placeholder="workspace-slug" 
                            className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            disabled={isSubmitting}
                        />
                        <p className="text-xs text-zinc-500 mt-1">
                            URL: /workspaces/{formData.slug || 'your-slug'}
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm mb-1 font-medium">Mô Tả</label>
                        <textarea 
                            value={formData.description} 
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Mô tả về workspace của bạn..." 
                            className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Image Upload / URL (Optional) */}
                    <div>
                        <label className="block text-sm mb-1 font-medium">
                            Logo Workspace <span className="text-xs text-zinc-500">(tùy chọn)</span>
                        </label>
                        
                        {/* Tab selection */}
                        <div className="flex gap-2 mb-2">
                            <label className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                    disabled={isSubmitting}
                                />
                                <div className="cursor-pointer px-3 py-2 text-center rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition text-sm">
                                    📁 Chọn từ máy
                                </div>
                            </label>
                        </div>
                        
                        <input 
                            type="url" 
                            value={formData.image_url} 
                            onChange={(e) => {
                                setFormData({ ...formData, image_url: e.target.value });
                                setPreviewUrl("");
                                setSelectedFile(null);
                            }}
                            placeholder="Hoặc nhập URL: https://example.com/logo.png" 
                            className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isSubmitting}
                        />
                        <p className="text-xs text-zinc-500 mt-1">
                            {selectedFile ? `Đã chọn: ${selectedFile.name}` : 'Để trống để sử dụng avatar tự động'}
                        </p>
                    </div>

                    {/* Preview */}
                    {formData.name && (
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800">
                            <p className="text-xs text-zinc-500 mb-2">Xem trước:</p>
                            <div className="flex items-center gap-3">
                                <img 
                                    src={previewUrl || formData.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`} 
                                    alt="Preview" 
                                    className="w-10 h-10 rounded shadow object-cover"
                                    onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`;
                                    }}
                                />
                                <div>
                                    <p className="font-medium text-sm">{formData.name}</p>
                                    <p className="text-xs text-zinc-500">{formData.description || 'Không có mô tả'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button 
                            type="button"
                            onClick={() => setIsDialogOpen(false)}
                            className="px-4 py-2 text-sm rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                            disabled={isSubmitting}
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-2 text-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting || !formData.name}
                        >
                            {isSubmitting ? 'Đang tạo...' : 'Tạo Workspace'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateWorkspaceDialog;
